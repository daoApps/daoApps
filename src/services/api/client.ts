// src/services/api/client.ts
import { API_CONFIG } from '../config';
import { ApiError, NetworkError, ServerError, ValidationError } from '../errors';

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class HttpClient {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { method, url, data, headers, timeout } = config;
    const finalTimeout = timeout || API_CONFIG.timeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), finalTimeout);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
        method,
        headers: { ...this.getHeaders(), ...headers },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ServerError(response.status, response.statusText);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('请求超时');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new NetworkError('网络连接失败');
    }
  }

  async get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
  ) {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
  ) {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
  ) {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

export const httpClient = new HttpClient();
