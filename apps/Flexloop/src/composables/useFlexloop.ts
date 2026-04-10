import { ref, onUnmounted } from 'vue';
import { execFile } from 'child_process';

export interface FlexloopOptions {
  workflowId: string;
  action: 'analyze' | 'optimize' | 'validate' | 'execute';
  config?: Record<string, unknown>;
  input?: string;
  outputFormat?: 'json' | 'yaml' | 'table';
  timeout?: number;
}

export interface FlexloopResult {
  success: boolean;
  data?: unknown;
  rawOutput?: string;
  error?: string;
  duration: number;
  timestamp: string;
  action: string;
  workflowId: string;
}

const DEFAULT_TIMEOUT = 10000;
const MAX_HISTORY_SIZE = 10;

const VALID_ACTIONS = ['analyze', 'optimize', 'validate', 'execute'] as const;
const VALID_OUTPUT_FORMATS = ['json', 'yaml', 'table'] as const;

function getFlexloopPath(): string {
  return (
    import.meta.env.VITE_FLEXLOOP_PATH ||
    (import.meta.env.MODE === 'production' ? '/usr/local/bin/flexloop' : 'flexloop')
  );
}

function validateWorkflowId(workflowId: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(workflowId);
}

function logMessage(message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  if (data !== undefined) {
    console.log(`[Flexloop] [${timestamp}] ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[Flexloop] [${timestamp}] ${message}`);
  }
}

function createErrorResult(
  options: FlexloopOptions,
  errorMessage: string,
  startTime: number,
  rawOutput?: string
): FlexloopResult {
  return {
    success: false,
    error: errorMessage,
    rawOutput,
    duration: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    action: options.action,
    workflowId: options.workflowId
  };
}

function createSuccessResult(
  options: FlexloopOptions,
  data: unknown,
  rawOutput: string,
  startTime: number
): FlexloopResult {
  return {
    success: true,
    data,
    rawOutput,
    duration: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    action: options.action,
    workflowId: options.workflowId
  };
}

function parseOutput(output: string, format: string | undefined): unknown {
  if (!output) return output;

  try {
    if (format === 'json' || !format) {
      return JSON.parse(output);
    }
    return output;
  } catch {
    logMessage('JSON 解析失败，返回原始文本', { output });
    return output;
  }
}

export function useFlexloop() {
  const isAvailable = ref<boolean>(false);
  const version = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const lastResult = ref<FlexloopResult | null>(null);
  const recentHistory = ref<FlexloopResult[]>([]);

  let isInitialized = false;

  async function checkAvailability(): Promise<void> {
    const flexloopPath = getFlexloopPath();

    try {
      await new Promise<void>((resolve, reject) => {
        execFile(flexloopPath, ['--version'], { timeout: 5000 }, (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }

          version.value = stdout.trim() || 'unknown';
          isAvailable.value = true;
          resolve();
        });
      });

      logMessage('Flexloop 工具可用', { path: flexloopPath, version: version.value });
    } catch (error) {
      isAvailable.value = false;
      version.value = null;
      logMessage('Flexloop 工具不可用', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validateOptions(options: FlexloopOptions): string | null {
    if (!options.workflowId || typeof options.workflowId !== 'string') {
      return 'workflowId 必须为非空字符串';
    }

    if (!validateWorkflowId(options.workflowId)) {
      return 'workflowId 格式无效，只允许字母、数字和连字符，且不能以连字符开头';
    }

    if (!VALID_ACTIONS.includes(options.action)) {
      return `无效的 action 参数，允许值：${VALID_ACTIONS.join(', ')}`;
    }

    if (options.outputFormat && !VALID_OUTPUT_FORMATS.includes(options.outputFormat)) {
      return `无效的输出格式，允许值：${VALID_OUTPUT_FORMATS.join(', ')}`;
    }

    if (options.config && typeof options.config !== 'object') {
      return 'config 必须为对象类型';
    }

    return null;
  }

  function buildArguments(options: FlexloopOptions): string[] {
    const args: string[] = [];

    args.push(options.action);
    args.push('--workflow-id', options.workflowId);

    if (options.outputFormat) {
      args.push('--format', options.outputFormat);
    }

    if (options.config && Object.keys(options.config).length > 0) {
      args.push('--config', JSON.stringify(options.config));
    }

    if (options.input) {
      args.push('--input', options.input);
    }

    return args;
  }

  function addToHistory(result: FlexloopResult): void {
    recentHistory.value.unshift(result);

    if (recentHistory.value.length > MAX_HISTORY_SIZE) {
      recentHistory.value = recentHistory.value.slice(0, MAX_HISTORY_SIZE);
    }
  }

  async function execute(options: FlexloopOptions): Promise<FlexloopResult> {
    const startTime = Date.now();

    if (!isInitialized) {
      await checkAvailability();
      isInitialized = true;
    }

    isLoading.value = true;

    logMessage('开始执行 Flexloop 命令', {
      action: options.action,
      workflowId: options.workflowId,
      hasConfig: !!options.config,
      hasInput: !!options.input,
      outputFormat: options.outputFormat
    });

    const validationError = validateOptions(options);
    if (validationError) {
      const result = createErrorResult(options, validationError, startTime);
      lastResult.value = result;
      addToHistory(result);
      isLoading.value = false;
      logMessage('参数验证失败', { error: validationError });
      return result;
    }

    if (!isAvailable.value) {
      const result = createErrorResult(options, 'Flexloop 工具不可用，请检查安装和配置', startTime);
      lastResult.value = result;
      addToHistory(result);
      isLoading.value = false;
      return result;
    }

    const flexloopPath = getFlexloopPath();
    const args = buildArguments(options);
    const timeout = options.timeout || DEFAULT_TIMEOUT;

    try {
      const result = await new Promise<FlexloopResult>((resolve, reject) => {
        execFile(flexloopPath, args, { timeout }, (error, stdout, stderr) => {
          if (error) {
            let errorMessage = '执行失败';

            if ((error as NodeJS.ErrnoException).code === 'ETIMEDOUT') {
              errorMessage = `执行超时（${timeout}ms）`;
            } else if ('signal' in error && error.signal === 'SIGTERM') {
              errorMessage = '进程被终止';
            } else if (stderr) {
              errorMessage = stderr.trim() || error.message;
            } else {
              errorMessage = error.message;
            }

            resolve(createErrorResult(options, errorMessage, startTime, stdout || undefined));
            return;
          }

          const parsedData = parseOutput(stdout, options.outputFormat);
          resolve(createSuccessResult(options, parsedData, stdout, startTime));
        });
      });

      lastResult.value = result;
      addToHistory(result);
      logMessage(result.success ? '命令执行成功' : '命令执行失败', {
        action: result.action,
        workflowId: result.workflowId,
        duration: result.duration,
        hasError: !!result.error
      });

      isLoading.value = false;
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const result = createErrorResult(options, `意外错误：${errorMessage}`, startTime);
      lastResult.value = result;
      addToHistory(result);
      isLoading.value = false;
      logMessage('发生未预期的错误', { error: errorMessage });
      return result;
    }
  }

  async function analyzeWorkflow(workflowId: string): Promise<FlexloopResult> {
    return execute({
      workflowId,
      action: 'analyze',
      outputFormat: 'json'
    });
  }

  async function optimizeWorkflow(
    workflowId: string,
    config?: Record<string, unknown>
  ): Promise<FlexloopResult> {
    return execute({
      workflowId,
      action: 'optimize',
      config,
      outputFormat: 'json'
    });
  }

  async function validateWorkflow(workflowId: string): Promise<FlexloopResult> {
    return execute({
      workflowId,
      action: 'validate',
      outputFormat: 'json'
    });
  }

  function clearHistory(): void {
    recentHistory.value = [];
    logMessage('历史记录已清除');
  }

  checkAvailability().then(() => {
    isInitialized = true;
  });

  return {
    isAvailable,
    version,
    isLoading,
    lastResult,
    recentHistory,
    execute,
    analyzeWorkflow,
    optimizeWorkflow,
    validateWorkflow,
    clearHistory
  };
}
