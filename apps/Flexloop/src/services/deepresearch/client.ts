import { ApiError, NetworkError, ServerError } from '../errors';
import {
  CreateResearchRequest,
  CreateResearchResponse,
  ResearchStatusResponse,
  ProgressEvent,
  HealthResponse,
  VersionInfo,
  ErrorResponse,
  TaskStatus,
  ProgressCallback,
  CompleteCallback,
  ErrorCallback
} from './types';

export interface DeepResearchClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class DeepResearchClient {
  private baseURL: string;
  private apiKey?: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private eventSource: EventSource | null = null;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: DeepResearchClientConfig) {
    this.baseURL = config.baseURL.endsWith('/') ? config.baseURL.slice(0, -1) : config.baseURL;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries >= this.maxRetries) {
        throw error;
      }

      if (error instanceof ServerError && (error as ServerError).status >= 400 && (error as ServerError).status < 500) {
        throw error;
      }

      await this.sleep(this.retryDelay * (retries + 1));
      return this.withRetry(operation, retries + 1);
    }
  }

  private async request<T>(
    method: string,
    path: string,
    data?: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: signal || controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail: string = response.statusText;
        try {
          const errorBody = await response.json() as ErrorResponse;
          errorDetail = errorBody.detail || errorDetail;
        } catch {
        }
        throw new ServerError(response.status, errorDetail);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('请求超时或已被取消');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new NetworkError('网络连接失败');
    }
  }

  async createResearch(request: CreateResearchRequest): Promise<CreateResearchResponse> {
    return this.withRetry(() =>
      this.request<CreateResearchResponse>('POST', '/research', request)
    );
  }

  async getStatus(taskId: string): Promise<ResearchStatusResponse> {
    return this.withRetry(() =>
      this.request<ResearchStatusResponse>('GET', `/research/${taskId}`)
    );
  }

  async cancelTask(taskId: string): Promise<void> {
    const controller = this.abortControllers.get(taskId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(taskId);
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    await this.request<void>('DELETE', `/research/${taskId}`);
  }

  streamProgress(
    taskId: string,
    onProgress: ProgressCallback,
    onComplete: CompleteCallback,
    onError: ErrorCallback
  ): () => void {
    if (typeof EventSource === 'undefined') {
      this.streamProgressWithFetch(taskId, onProgress, onComplete, onError);
      return () => this.cancelStreaming(taskId);
    }

    const url = `${this.baseURL}/research/${taskId}/stream`;
    const eventSource = new EventSource(url);
    this.eventSource = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ProgressEvent;
        onProgress(data);

        if (data.status === TaskStatus.COMPLETED || data.status === TaskStatus.FAILED || data.status === TaskStatus.CANCELLED) {
          eventSource.close();
          if (this.eventSource === eventSource) {
            this.eventSource = null;
          }

          this.getStatus(taskId)
            .then(status => onComplete(status))
            .catch(err => onError(err as Error));
        }
      } catch (error) {
        onError(error as Error);
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      if (this.eventSource === eventSource) {
        this.eventSource = null;
      }
      onError(new Error('SSE 连接错误'));
    };

    return () => {
      eventSource.close();
      if (this.eventSource === eventSource) {
        this.eventSource = null;
      }
    };
  }

  private async streamProgressWithFetch(
    taskId: string,
    onProgress: ProgressCallback,
    onComplete: CompleteCallback,
    onError: ErrorCallback
  ): Promise<void> {
    const controller = new AbortController();
    this.abortControllers.set(taskId, controller);

    try {
      const url = `${this.baseURL}/research/${taskId}/stream`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new NetworkError('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            const jsonStr = trimmedLine.slice(6).trim();
            if (jsonStr === '[DONE]') {
              continue;
            }

            try {
              const data = JSON.parse(jsonStr) as ProgressEvent;
              onProgress(data);

              if (data.status === TaskStatus.COMPLETED || data.status === TaskStatus.FAILED || data.status === TaskStatus.CANCELLED) {
                reader.cancel();
                this.abortControllers.delete(taskId);
                const status = await this.getStatus(taskId);
                onComplete(status);
                return;
              }
            } catch (e) {
              console.warn('Failed to parse SSE message:', jsonStr);
            }
          }
        }
      }

      this.abortControllers.delete(taskId);
      const finalStatus = await this.getStatus(taskId);
      onComplete(finalStatus);
    } catch (error) {
      this.abortControllers.delete(taskId);
      if ((error as Error).name !== 'AbortError') {
        onError(error as Error);
      }
    }
  }

  private cancelStreaming(taskId: string): void {
    const controller = this.abortControllers.get(taskId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(taskId);
    }
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.withRetry(() =>
      this.request<HealthResponse>('GET', '/health')
    );
  }

  async getVersion(): Promise<VersionInfo> {
    return this.withRetry(() =>
      this.request<VersionInfo>('GET', '/version')
    );
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }
}
