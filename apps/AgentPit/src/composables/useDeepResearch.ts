import { ref, onUnmounted } from 'vue'
import { execFile } from 'child_process'
import { promisify } from 'util'
import DOMPurify from 'dompurify'
import * as fs from 'fs'
import * as path from 'path'

const execFileAsync = promisify(execFile)

export interface DeepResearchOptions {
  query: string
  depth?: number
  format?: 'markdown' | 'json' | 'summary'
  timeout?: number
  maxResults?: number
}

export interface DeepResearchResult {
  success: boolean
  data?: string
  error?: string
  duration: number
  timestamp: string
  query: string
}

const DEFAULT_TIMEOUT = 5000
const MAX_QUERY_LENGTH = 1000
const DEFAULT_PATH = process.platform === 'win32' ? 'deepresearch' : '/usr/local/bin/deepresearch'

function getToolPath(): string {
  return process.env.DEEP_RESEARCH_PATH || DEFAULT_PATH
}

function sanitizeQuery(query: string): { clean: boolean; sanitized: string } {
  const trimmed = query.trim()
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return { clean: false, sanitized: '' }
  }
  const purified = DOMPurify.sanitize(trimmed)
  return { clean: purified === trimmed && purified.length > 0, sanitized: purified }
}

function log(level: 'info' | 'error', message: string, data?: Record<string, unknown>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  }
  console[level]('[DeepResearch]', JSON.stringify(logEntry))
}

async function checkToolExists(toolPath: string): Promise<boolean> {
  try {
    if (fs.existsSync(toolPath)) {
      return true
    }
  } catch {
    // fs.existsSync may throw in some environments
  }

  try {
    const checkCommand = process.platform === 'win32' ? 'where' : 'which'
    await execFileAsync(checkCommand, [toolPath], { timeout: 3000 })
    return true
  } catch {
    return false
  }
}

async function checkDependencies(): Promise<{ available: boolean; missing: string[] }> {
  const missing: string[] = []

  for (const cmd of ['pdm', 'pip']) {
    try {
      const checkCommand = process.platform === 'win32' ? 'where' : 'which'
      await execFileAsync(checkCommand, [cmd], { timeout: 2000 })
    } catch {
      missing.push(cmd)
    }
  }

  return { available: missing.length === 0, missing }
}

export function useDeepResearch() {
  const isAvailable = ref(false)
  const version = ref<string | null>(null)
  const isLoading = ref(false)
  const lastResult = ref<DeepResearchResult | null>(null)
  const error = ref<string | null>(null)

  let currentProcess: ReturnType<typeof execFile> | null = null

  async function checkAvailability(): Promise<boolean> {
    const toolPath = getToolPath()

    log('info', 'Checking DeepResearch tool availability', { toolPath })

    const exists = await checkToolExists(toolPath)

    if (!exists) {
      error.value = `DeepResearch 工具未找到：${toolPath}。请确认工具已安装或设置 DEEP_RESEARCH_PATH 环境变量`
      isAvailable.value = false
      log('error', 'Tool not found', { toolPath, error: error.value })
      return false
    }

    const deps = await checkDependencies()
    if (!deps.available) {
      error.value = `缺少必要的依赖：${deps.missing.join(', ')}。请安装 Python 包管理工具`
      isAvailable.value = false
      log('error', 'Missing dependencies', { missing: deps.missing })
      return false
    }

    try {
      const { stdout } = await execFileAsync(toolPath, ['--version'], { timeout: 5000 })
      version.value = stdout.trim()
      isAvailable.value = true
      error.value = null
      log('info', 'Tool availability confirmed', { version: version.value })
      return true
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      error.value = `版本检查失败：${errorMsg}`
      isAvailable.value = false
      log('error', 'Version check failed', { error: errorMsg })
      return false
    }
  }

  async function research(options: DeepResearchOptions): Promise<DeepResearchResult> {
    const startTime = Date.now()
    const result: DeepResearchResult = {
      success: false,
      duration: 0,
      timestamp: new Date().toISOString(),
      query: options.query
    }

    const { clean, sanitized } = sanitizeQuery(options.query)
    if (!clean) {
      const errorMsg = options.query.trim().length > MAX_QUERY_LENGTH
        ? `查询内容超过最大长度限制（${MAX_QUERY_LENGTH} 字符）`
        : '查询内容包含不安全字符，已被过滤'
      result.error = errorMsg
      error.value = errorMsg
      lastResult.value = result
      result.duration = Date.now() - startTime
      log('error', 'Query validation failed', { error: errorMsg, queryLength: options.query.length })
      return result
    }

    if (!isAvailable.value) {
      const available = await checkAvailability()
      if (!available) {
        result.error = error.value || 'DeepResearch 工具不可用'
        lastResult.value = result
        result.duration = Date.now() - startTime
        return result
      }
    }

    isLoading.value = true
    error.value = null

    const toolPath = getToolPath()
    const timeout = options.timeout ?? DEFAULT_TIMEOUT
    const depth = Math.max(1, Math.min(5, options.depth ?? 3))
    const format = options.format ?? 'markdown'
    const maxResults = options.maxResults ?? 10

    const args = [
      '--query',
      sanitized,
      '--depth',
      String(depth),
      '--format',
      format,
      '--max-results',
      String(maxResults)
    ]

    log('info', 'Executing DeepResearch command', {
      query: sanitized,
      depth,
      format,
      maxResults,
      timeout
    })

    try {
      const { stdout, stderr } = await execFileAsync(toolPath, args, {
        timeout,
        maxBuffer: 10 * 1024 * 1024
      })

      result.success = true
      result.data = stdout
      result.duration = Date.now() - startTime
      lastResult.value = result
      log('info', 'Research completed successfully', {
        duration: result.duration,
        outputLength: stdout.length
      })
    } catch (e) {
      const execError = e as { code?: string; message?: string; killed?: boolean }

      if (execError.killed || execError.code === 'ETIMEDOUT') {
        result.error = `执行超时（${timeout / 1000} 秒）。查询可能过于复杂，建议简化查询内容或增加超时时间`
        log('error', 'Execution timeout', { timeout, query: sanitized })
      } else {
        result.error = execError.message || stderr || '执行过程中发生未知错误'
        log('error', 'Execution failed', {
          error: result.error,
          code: execError.code,
          query: sanitized
        })
      }

      result.duration = Date.now() - startTime
      error.value = result.error
      lastResult.value = result
    } finally {
      isLoading.value = false
    }

    return result
  }

  onUnmounted(() => {
    if (currentProcess) {
      currentProcess.kill()
      currentProcess = null
    }
  })

  checkAvailability()

  return {
    isAvailable,
    version,
    isLoading,
    lastResult,
    error,
    research,
    checkAvailability
  }
}
