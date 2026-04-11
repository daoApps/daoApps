import { ApiError, NetworkError, ServerError } from '../errors';
import type {
  MCPListAgentsResponse,
  MCPCollaborationCreateRequest,
  MCPCollaborationCreateResponse,
  MCPCollaborationStatusResponse,
  MCPCollaborationResult,
  MCPProgressEvent,
  MCPSendMessageRequest,
  MCPSendMessageResponse,
  MCPAgentInfo,
  MCPClientConfig,
  MCPProgressCallback,
  MCPCompleteCallback,
  MCPErrorCallback,
} from './types';

export {
  MCPListAgentsResponse,
  MCPCollaborationCreateRequest,
  MCPCollaborationCreateResponse,
  MCPCollaborationStatusResponse,
  MCPProgressEvent,
  MCPSendMessageRequest,
  MCPSendMessageResponse,
  MCPAgentInfo,
};

export class MCPClient {
  private baseURL: string;
  private apiKey?: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private eventSource: EventSource | null = null;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: MCPClientConfig) {
    this.baseURL = config.baseURL.endsWith('/')
      ? config.baseURL.slice(0, -1)
      : config.baseURL;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
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
    const url = `${this.baseURL}/api/v1/mcp${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail: string = response.statusText;
        try {
          const errorBody = await response.json() as { detail?: string };
          errorDetail = errorBody.detail || errorDetail;
        } catch {
          // ignore
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

  async listAgents(): Promise<MCPListAgentsResponse> {
    return this.withRetry(() =>
      this.request<MCPListAgentsResponse>('GET', '/agents')
    );
  }

  async createCollaboration(
    request: MCPCollaborationCreateRequest
  ): Promise<MCPCollaborationCreateResponse> {
    return this.withRetry(() =>
      this.request<MCPCollaborationCreateResponse>('POST', '/collaboration', request)
    );
  }

  async getCollaborationStatus(
    sessionId: string
  ): Promise<MCPCollaborationStatusResponse> {
    return this.withRetry(() =>
      this.request<MCPCollaborationStatusResponse>('GET', `/collaboration/${sessionId}`)
    );
  }

  async sendMessage(
    sessionId: string,
    request: MCPSendMessageRequest
  ): Promise<MCPSendMessageResponse> {
    return this.withRetry(() =>
      this.request<MCPSendMessageResponse>('POST', `/collaboration/${sessionId}/message`, request)
    );
  }

  async cancelCollaboration(sessionId: string): Promise<void> {
    const controller = this.abortControllers.get(sessionId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(sessionId);
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    await this.request<void>('DELETE', `/collaboration/${sessionId}`);
  }

  streamProgress(
    sessionId: string,
    onProgress: MCPProgressCallback,
    onComplete: MCPCompleteCallback,
    onError: MCPErrorCallback
  ): () => void {
    if (typeof EventSource === 'undefined') {
      this.streamProgressWithFetch(sessionId, onProgress, onComplete, onError);
      return () => this.cancelStreaming(sessionId);
    }

    let url = `${this.baseURL}/api/v1/mcp/collaboration/${sessionId}/stream`;
    if (this.apiKey) {
      url += (url.includes('?') ? '&' : '?') + `api_key=${encodeURIComponent(this.apiKey)}`;
    }

    const eventSource = new EventSource(url, { withCredentials: false });
    this.eventSource = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as MCPProgressEvent;
        onProgress(data);

        if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
          eventSource.close();
          if (this.eventSource === eventSource) {
            this.eventSource = null;
          }

          this.getCollaborationStatus(sessionId)
            .then(status => onComplete(status))
            .catch(err => onError(err as Error));
        }
      } catch (error) {
        onError(error as Error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      if (this.eventSource === eventSource) {
        this.eventSource = null;
      }
      onError(new Error('SSE 连接错误，请检查后端服务是否正常运行以及 API 密钥是否正确'));
    };

    return () => {
      eventSource.close();
      if (this.eventSource === eventSource) {
        this.eventSource = null;
      }
    };
  }

  private async streamProgressWithFetch(
    sessionId: string,
    onProgress: MCPProgressCallback,
    onComplete: MCPCompleteCallback,
    onError: MCPErrorCallback
  ): Promise<void> {
    const controller = new AbortController();
    this.abortControllers.set(sessionId, controller);

    try {
      const url = `${this.baseURL}/api/v1/mcp/collaboration/${sessionId}/stream`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
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
              const data = JSON.parse(jsonStr) as MCPProgressEvent;
              onProgress(data);

              if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
                reader.cancel();
                this.abortControllers.delete(sessionId);
                const status = await this.getCollaborationStatus(sessionId);
                onComplete(status);
                return;
              }
            } catch (e) {
              console.warn('Failed to parse SSE message:', jsonStr);
            }
          }
        }
      }

      this.abortControllers.delete(sessionId);
      const finalStatus = await this.getCollaborationStatus(sessionId);
      onComplete(finalStatus);
    } catch (error) {
      this.abortControllers.delete(sessionId);
      if ((error as Error).name !== 'AbortError') {
        onError(error as Error);
      }
    }
  }

  private cancelStreaming(sessionId: string): void {
    const controller = this.abortControllers.get(sessionId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(sessionId);
    }
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
