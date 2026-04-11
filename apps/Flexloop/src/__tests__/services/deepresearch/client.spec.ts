import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DeepResearchClient } from '../../../services/deepresearch/client';
import { TaskStatus } from '../../../services/deepresearch/types';
import { ServerError, NetworkError } from '../../../services/errors';

describe('DeepResearchClient', () => {
  const baseURL = 'http://localhost:8000';
  let client: DeepResearchClient;
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    vi.stubGlobal('fetch', mockFetch);
    vi.stubGlobal('EventSource', vi.fn(() => ({
      onmessage: null,
      onerror: null,
      close: vi.fn()
    })));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      client = new DeepResearchClient({
        baseURL,
        apiKey: 'test-key',
        timeout: 10000,
        maxRetries: 5,
        retryDelay: 500
      });
      expect(client).toBeInstanceOf(DeepResearchClient);
    });

    it('should use default values when not provided', () => {
      client = new DeepResearchClient({ baseURL });
      expect(client).toBeInstanceOf(DeepResearchClient);
    });

    it('should remove trailing slash from baseURL', () => {
      client = new DeepResearchClient({ baseURL: 'http://localhost:8000/' });
      expect(client).toBeInstanceOf(DeepResearchClient);
    });
  });

  describe('createResearch', () => {
    it('should successfully create a research task', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      const mockResponse = {
        task_id: 'test-task-123',
        status: TaskStatus.PENDING,
        message: 'Task created successfully'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.createResearch({
        query: 'What is DAO?'
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/research`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ query: 'What is DAO?' })
        })
      );
    });

    it('should include all optional parameters in request', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      const mockResponse = {
        task_id: 'test-task-123',
        status: TaskStatus.PENDING,
        message: 'Task created successfully'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await client.createResearch({
        query: 'What is DAO?',
        depth: 3,
        max_sources: 10,
        enable_breadth_first: true
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/research`,
        expect.objectContaining({
          body: JSON.stringify({
            query: 'What is DAO?',
            depth: 3,
            max_sources: 10,
            enable_breadth_first: true
          })
        })
      );
    });

    it('should correctly handle error responses', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ detail: 'Invalid query' })
      });

      const promise = client.createResearch({ query: '' });
      await expect(promise).rejects.toThrow(ServerError);
      await expect(promise).rejects.toThrow('Invalid query');
    }, 10000);

    it('should handle network errors', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      mockFetch.mockRejectedValue(new Error('Network failure'));

      const promise = client.createResearch({ query: 'test' });
      await expect(promise).rejects.toThrow(NetworkError);
      await expect(promise).rejects.toThrow('网络连接失败');
    }, 10000);
  });

  describe('error handling', () => {
    it('should throw ServerError with correct status code', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ detail: 'Invalid API key' })
      });

      try {
        await client.createResearch({ query: 'test' });
      } catch (error) {
        expect(error).toBeInstanceOf(ServerError);
        expect((error as ServerError).status).toBe(401);
        expect((error as ServerError).message).toBe('Invalid API key');
      }
    });

    it('should use statusText when error body has no detail', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({})
      });

      const promise = client.createResearch({ query: 'test' });
      await expect(promise).rejects.toThrow(ServerError);
      await expect(promise).rejects.toThrow('Internal Server Error');
    }, 10000);

    it('should use statusText when error body cannot be parsed', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      const promise = client.createResearch({ query: 'test' });
      await expect(promise).rejects.toThrow(ServerError);
      await expect(promise).rejects.toThrow('Bad Gateway');
    }, 10000);

    it('should throw NetworkError on timeout', async () => {
      client = new DeepResearchClient({ baseURL, timeout: 1000, maxRetries: 0 });

      mockFetch.mockImplementation((_, options) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          }, 1001);
          options.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      });

      await expect(client.createResearch({ query: 'test' })).rejects.toThrow(NetworkError);
      await expect(client.createResearch({ query: 'test' })).rejects.toThrow('请求超时或已被取消');
     }, 30000);
  });

  describe('retry mechanism', () => {
    it('should not retry when maxRetries is 0', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      mockFetch.mockRejectedValue(new NetworkError('Network failure'));

      await expect(client.createResearch({ query: 'test' })).rejects.toThrow(NetworkError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    }, 10000);

    it('should retry on network errors until maxRetries is reached', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 2, retryDelay: 10 });

      mockFetch
        .mockRejectedValueOnce(new NetworkError('Network failure'))
        .mockRejectedValueOnce(new NetworkError('Network failure'))
        .mockRejectedValueOnce(new NetworkError('Network failure'));

      await expect(client.createResearch({ query: 'test' })).rejects.toThrow(NetworkError);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should succeed on retry after initial failures', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 2, retryDelay: 10 });

      const mockResponse = {
        task_id: 'test-task-123',
        status: TaskStatus.PENDING,
        message: 'Task created successfully'
      };

      mockFetch
        .mockRejectedValueOnce(new NetworkError('Network failure'))
        .mockRejectedValueOnce(new NetworkError('Network failure'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });

      const result = await client.createResearch({ query: 'test' });
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on client errors (4xx)', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 3 });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ detail: 'Invalid input' })
      });

      await expect(client.createResearch({ query: '' })).rejects.toThrow(ServerError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on server errors (5xx)', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 2, retryDelay: 10 });

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable'
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            task_id: 'test-task-123',
            status: TaskStatus.PENDING,
            message: 'OK'
          })
        });

      const result = await client.createResearch({ query: 'test' });
      expect(result.task_id).toBe('test-task-123');
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should increase delay with each retry', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 2, retryDelay: 10 });

      mockFetch
        .mockRejectedValueOnce(new NetworkError('First failure'))
        .mockRejectedValueOnce(new NetworkError('Second failure'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            task_id: 'test-task-123',
            status: TaskStatus.PENDING,
            message: 'OK'
          })
        });

      const result = await client.createResearch({ query: 'test' });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('getStatus', () => {
    it('should get task status correctly', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      const mockResponse = {
        task_id: 'test-task-123',
        status: TaskStatus.RUNNING,
        progress: 50,
        current_step: 'Searching sources',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:05:00Z'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.getStatus('test-task-123');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/research/test-task-123`,
        expect.any(Object)
      );
    });
  });

  describe('streamProgress with EventSource', () => {
    it('should use EventSource when available', () => {
      client = new DeepResearchClient({ baseURL });

      const mockEventSource = {
        onmessage: null,
        onerror: null,
        close: vi.fn()
      };
      (EventSource as vi.Mock).mockReturnValueOnce(mockEventSource);

      const onProgress = vi.fn();
      const onComplete = vi.fn();
      const onError = vi.fn();

      const unsubscribe = client.streamProgress(
        'test-task-123',
        onProgress,
        onComplete,
        onError
      );

      expect(EventSource).toHaveBeenCalledWith(`${baseURL}/research/test-task-123/stream`);
      expect(mockEventSource.onmessage).toBeDefined();
      expect(mockEventSource.onerror).toBeDefined();
      expect(typeof unsubscribe).toBe('function');

      unsubscribe();
      expect(mockEventSource.close).toHaveBeenCalled();
    });

    it('should call onProgress when receiving progress event', () => {
      client = new DeepResearchClient({ baseURL });

      let messageHandler: ((event: MessageEvent) => void) | null = null;

      (EventSource as vi.Mock).mockImplementationOnce((url: string) => {
        const es = {
          onmessage: null,
          onerror: null,
          close: vi.fn()
        };
        messageHandler = (event: MessageEvent) => {
          es.onmessage?.(event);
        };
        return es;
      });

      const onProgress = vi.fn();
      const onComplete = vi.fn();
      const onError = vi.fn();

      client.streamProgress('test-task-123', onProgress, onComplete, onError);

      expect(messageHandler).not.toBeNull();

      const progressEvent = {
        task_id: 'test-task-123',
        status: TaskStatus.RUNNING,
        progress: 30,
        current_step: 'Searching',
        timestamp: Date.now()
      };

      messageHandler!({
        data: JSON.stringify(progressEvent)
      } as MessageEvent);

      expect(onProgress).toHaveBeenCalledWith(progressEvent);
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should call onComplete and close connection when task completes', async () => {
      client = new DeepResearchClient({ baseURL });

      let messageHandler: ((event: MessageEvent) => void) | null = null;
      const mockClose = vi.fn();

      (EventSource as vi.Mock).mockImplementationOnce(() => {
        const es = {
          onmessage: null,
          onerror: null,
          close: mockClose
        };
        messageHandler = (event: MessageEvent) => {
          es.onmessage?.(event);
        };
        return es;
      });

      const finalStatus = {
        task_id: 'test-task-123',
        status: TaskStatus.COMPLETED,
        progress: 100,
        current_step: 'Done',
        result: 'Final result',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:10:00Z'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(finalStatus)
      });

      const onProgress = vi.fn();
      const onComplete = vi.fn();
      const onError = vi.fn();

      client.streamProgress('test-task-123', onProgress, onComplete, onError);

      const completedEvent = {
        task_id: 'test-task-123',
        status: TaskStatus.COMPLETED,
        progress: 100,
        current_step: 'Done',
        timestamp: Date.now()
      };

      messageHandler!({
        data: JSON.stringify(completedEvent)
      } as MessageEvent);

      expect(onProgress).toHaveBeenCalledWith(completedEvent);
      expect(mockClose).toHaveBeenCalled();

      await vi.waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith(finalStatus);
      }, { timeout: 2000 });
    });

    it('should call onError when JSON parsing fails', () => {
      client = new DeepResearchClient({ baseURL });

      let messageHandler: ((event: MessageEvent) => void) | null = null;

      (EventSource as vi.Mock).mockImplementationOnce(() => {
        const es = {
          onmessage: null,
          onerror: null,
          close: vi.fn()
        };
        messageHandler = (event: MessageEvent) => {
          es.onmessage?.(event);
        };
        return es;
      });

      const onProgress = vi.fn();
      const onComplete = vi.fn();
      const onError = vi.fn();

      client.streamProgress('test-task-123', onProgress, onComplete, onError);

      messageHandler!({
        data: 'invalid json'
      } as MessageEvent);

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should call onError when EventSource has error', () => {
      client = new DeepResearchClient({ baseURL });

      let errorHandler: ((event: Event) => void) | null = null;
      const mockClose = vi.fn();

      (EventSource as vi.Mock).mockImplementationOnce(() => {
        const es = {
          onmessage: null,
          onerror: null,
          close: mockClose
        };
        errorHandler = (event: Event) => {
          es.onerror?.(event);
        };
        return es;
      });

      const onProgress = vi.fn();
      const onComplete = vi.fn();
      const onError = vi.fn();

      client.streamProgress('test-task-123', onProgress, onComplete, onError);

      errorHandler!({} as Event);

      expect(mockClose).toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0].message).toBe('SSE 连接错误');
    });
  });

  describe('cancelTask', () => {
    it('should cancel task and close EventSource', async () => {
      client = new DeepResearchClient({ baseURL });

      const mockEventSource = {
        close: vi.fn()
      };
      (EventSource as vi.Mock).mockReturnValueOnce(mockEventSource);

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });

      const unsubscribe = client.streamProgress(
        'test-task-123',
        vi.fn(),
        vi.fn(),
        vi.fn()
      );

      await client.cancelTask('test-task-123');

      expect(mockEventSource.close).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/research/test-task-123`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );

      unsubscribe();
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      const mockResponse = {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00Z',
        version: {
          version: '1.0.0',
          name: 'deepresearch'
        }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.healthCheck();
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/health`,
        expect.any(Object)
      );
    });
  });

  describe('getVersion', () => {
    it('should return version info', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      const mockResponse = {
        version: '1.0.0',
        name: 'deepresearch'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.getVersion();
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseURL}/version`,
        expect.any(Object)
      );
    });
  });

  describe('close', () => {
    it('should close EventSource when open', () => {
      client = new DeepResearchClient({ baseURL });

      const mockEventSource = {
        close: vi.fn()
      };
      (EventSource as vi.Mock).mockReturnValueOnce(mockEventSource);

      client.streamProgress('test-task-123', vi.fn(), vi.fn(), vi.fn());
      client.close();

      expect(mockEventSource.close).toHaveBeenCalled();
    });

    it('should do nothing when no EventSource or pending requests', () => {
      client = new DeepResearchClient({ baseURL });
      expect(() => client.close()).not.toThrow();
    });
  });

  describe('headers', () => {
    it('should include API key in headers when provided', async () => {
      client = new DeepResearchClient({ baseURL, apiKey: 'my-secret-key', maxRetries: 0 });

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          task_id: '123',
          status: TaskStatus.PENDING,
          message: 'OK'
        })
      });

      await client.createResearch({ query: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'my-secret-key'
          })
        })
      );
    });

    it('should include auth token from localStorage when available', async () => {
      client = new DeepResearchClient({ baseURL, maxRetries: 0 });

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('my-auth-token');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          task_id: '123',
          status: TaskStatus.PENDING,
          message: 'OK'
        })
      });

      await client.createResearch({ query: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer my-auth-token'
          })
        })
      );

      vi.restoreAllMocks();
    });
  });
});
