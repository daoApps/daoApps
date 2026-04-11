import { ref, onUnmounted } from 'vue';
import DOMPurify from 'dompurify';
import { DeepResearchClient } from '../services/deepresearch/client';
import { TaskStatusValues } from '../services/deepresearch/types';
import type {
  CreateResearchRequest,
  ProgressEvent,
  ResearchStatusResponse
} from '../services/deepresearch/types';
import { ApiError, NetworkError, ServerError } from '../services/errors';

export interface DeepResearchOptions {
  query: string;
  depth?: number;
  format?: 'markdown' | 'json' | 'summary';
  timeout?: number;
  maxResults?: number;
}

export interface DeepResearchResult {
  success: boolean;
  data?: string;
  error?: string;
  duration: number;
  timestamp: string;
  query: string;
}

const MAX_QUERY_LENGTH = 1000;
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

function getBaseURL(): string {
  return DEFAULT_BASE_URL;
}

function createClient(): DeepResearchClient {
  const apiKey = import.meta.env.VITE_DEEP_RESEARCH_API_KEY;
  return new DeepResearchClient({
    baseURL: getBaseURL(),
    apiKey,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || String(DEFAULT_TIMEOUT), 10)
  });
}

function sanitizeQuery(query: string): { clean: boolean; sanitized: string } {
  const trimmed = query.trim();
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return { clean: false, sanitized: '' };
  }
  const purified = DOMPurify.sanitize(trimmed);
  return { clean: purified === trimmed && purified.length > 0, sanitized: purified };
}

function log(level: 'info' | 'error', message: string, data?: Record<string, unknown>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  };
  console[level]('[DeepResearch]', JSON.stringify(logEntry));
}

export function useDeepResearch() {
  const isAvailable = ref(false);
  const version = ref<string | null>(null);
  const isLoading = ref(false);
  const lastResult = ref<DeepResearchResult | null>(null);
  const error = ref<string | null>(null);
  const progress = ref(0);
  const currentStep = ref('');

  let client: DeepResearchClient | null = null;
  let currentTaskId: string | null = null;
  let unsubscribeStream: (() => void) | null = null;

  async function checkAvailability(): Promise<boolean> {
    log('info', 'Checking DeepResearch API availability', { baseURL: getBaseURL() });

    if (!client) {
      try {
        client = createClient();
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        error.value = `创建 DeepResearch 客户端失败：${errorMsg}`;
        isAvailable.value = false;
        log('error', 'Failed to create client', { error: errorMsg });
        return false;
      }
    }

    try {
      const health = await client.healthCheck();
      if (health.status === 'ok') {
        const versionInfo = await client.getVersion();
        version.value = versionInfo.version;
        isAvailable.value = true;
        error.value = null;
        log('info', 'API availability confirmed', {
          version: versionInfo.version,
          name: versionInfo.name
        });
        return true;
      } else {
        throw new Error('API health check returned error status');
      }
    } catch (e) {
      let errorMsg: string;

      if (e instanceof NetworkError) {
        errorMsg = '无法连接到 DeepResearch API 服务，请检查服务是否启动';
      } else if (e instanceof ServerError) {
        errorMsg = `DeepResearch API 服务错误：${e.message} (HTTP ${e.status})`;
      } else if (e instanceof ApiError) {
        errorMsg = `DeepResearch API 错误：${e.message}`;
      } else {
        errorMsg = e instanceof Error ? e.message : String(e);
      }

      error.value = errorMsg;
      isAvailable.value = false;
      log('error', 'API health check failed', { error: errorMsg });
      return false;
    }
  }

  async function cancel(): Promise<void> {
    if (currentTaskId && client) {
      try {
        await client.cancelTask(currentTaskId);
        log('info', 'Task cancelled', { taskId: currentTaskId });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        log('error', 'Failed to cancel task', { taskId: currentTaskId, error: errorMsg });
      }
      currentTaskId = null;
    }

    if (unsubscribeStream) {
      unsubscribeStream();
      unsubscribeStream = null;
    }

    progress.value = 0;
    currentStep.value = '';
    isLoading.value = false;
  }

  async function research(options: DeepResearchOptions): Promise<DeepResearchResult> {
    const startTime = Date.now();
    const result: DeepResearchResult = {
      success: false,
      duration: 0,
      timestamp: new Date().toISOString(),
      query: options.query
    };

    const { clean, sanitized } = sanitizeQuery(options.query);
    if (!clean) {
      const errorMsg =
        options.query.trim().length > MAX_QUERY_LENGTH
          ? `查询内容超过最大长度限制（${MAX_QUERY_LENGTH} 字符）`
          : '查询内容包含不安全字符，已被过滤';
      result.error = errorMsg;
      error.value = errorMsg;
      lastResult.value = result;
      result.duration = Date.now() - startTime;
      log('error', 'Query validation failed', {
        error: errorMsg,
        queryLength: options.query.length
      });
      return result;
    }

    if (!client) {
      client = createClient();
    }

    if (!isAvailable.value) {
      const available = await checkAvailability();
      if (!available) {
        result.error = error.value || 'DeepResearch API 服务不可用';
        lastResult.value = result;
        result.duration = Date.now() - startTime;
        return result;
      }
    }

    await cancel();
    isLoading.value = true;
    error.value = null;
    progress.value = 0;
    currentStep.value = '初始化研究任务...';

    const depth = Math.max(1, Math.min(5, options.depth ?? 3));
    const maxSources = options.maxResults ?? 10;

    const request: CreateResearchRequest = {
      topic: sanitized,
      depth,
    };

    log('info', 'Creating DeepResearch task', {
      query: sanitized,
      depth,
      maxSources
    });

    return new Promise((resolve) => {
      client!.createResearch(request)
        .then((response) => {
          currentTaskId = response.task_id;
          log('info', 'Research task created', { taskId: response.task_id });

          unsubscribeStream = client!.streamProgress(
            response.task_id,
            (event: ProgressEvent) => {
              progress.value = event.progress;
              currentStep.value = event.current_step || '';
              log('info', 'Progress update', {
                taskId: event.task_id,
                progress: event.progress,
                step: event.current_step
              });
            },
            (status: ResearchStatusResponse) => {
              const duration = Date.now() - startTime;
              result.duration = duration;

              if (status.status === TaskStatusValues.COMPLETED) {
                result.success = true;
                result.data = status.result;
                result.duration = duration;
                lastResult.value = result;
                progress.value = 100;
                currentStep.value = '完成';
                error.value = null;
                log('info', 'Research completed successfully', {
                  taskId: response.task_id,
                  duration,
                  outputLength: status.result?.length || 0
                });
              } else if (status.status === TaskStatusValues.FAILED) {
                result.success = false;
                result.error = status.error || '研究任务执行失败';
                error.value = result.error;
                lastResult.value = result;
                log('error', 'Research task failed', {
                  taskId: response.task_id,
                  error: result.error
                });
              } else if (status.status === TaskStatusValues.CANCELLED) {
                result.success = false;
                result.error = '研究任务已取消';
                error.value = result.error;
                lastResult.value = result;
                log('info', 'Research task cancelled', { taskId: response.task_id });
              }

              isLoading.value = false;
              currentTaskId = null;
              unsubscribeStream = null;
              resolve(result);
            },
            (err: Error) => {
              const duration = Date.now() - startTime;
              result.success = false;
              result.error = err.message;
              result.duration = duration;
              error.value = err.message;
              lastResult.value = result;
              isLoading.value = false;
              currentTaskId = null;
              unsubscribeStream = null;
              log('error', 'Stream error', {
                taskId: response.task_id,
                error: err.message
              });
              resolve(result);
            }
          );
        })
        .catch((e) => {
          const duration = Date.now() - startTime;
          let errorMsg: string;

          if (e instanceof NetworkError) {
            errorMsg = '网络连接失败，无法连接到 DeepResearch API 服务';
          } else if (e instanceof ServerError) {
            errorMsg = `API 服务错误：${e.message} (HTTP ${e.status})`;
          } else if (e instanceof ApiError) {
            errorMsg = `API 错误：${e.message}`;
          } else {
            errorMsg = e instanceof Error ? e.message : String(e);
          }

          result.success = false;
          result.error = errorMsg;
          result.duration = duration;
          error.value = errorMsg;
          lastResult.value = result;
          isLoading.value = false;
          currentTaskId = null;
          log('error', 'Failed to create research task', { error: errorMsg });
          resolve(result);
        });
    });
  }

  onUnmounted(() => {
    if (client) {
      client.close();
    }
    if (unsubscribeStream) {
      unsubscribeStream();
    }
    progress.value = 0;
    currentStep.value = '';
  });

  checkAvailability();

  return {
    isAvailable,
    version,
    isLoading,
    lastResult,
    error,
    progress,
    currentStep,
    research,
    cancel,
    checkAvailability
  };
}
