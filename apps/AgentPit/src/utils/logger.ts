type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

interface LogEntry {
  timestamp: string
  level: LogLevel
  module: string
  message: string
  meta?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

interface LoggerConfig {
  bufferSize: number
  flushInterval: number
  maxFileSize: number
  archiveDays: number
  deleteArchiveDays: number
  logDir: string
}

const DEFAULT_CONFIG: LoggerConfig = {
  bufferSize: 50,
  flushInterval: 5000,
  maxFileSize: 10 * 1024 * 1024,
  archiveDays: 30,
  deleteArchiveDays: 90,
  logDir: 'logs'
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  DEBUG: '\x1b[36m',
  INFO: '\x1b[32m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m'
}

const RESET = '\x1b[0m'

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

function isNodeEnv(): boolean {
  return typeof window === 'undefined' && typeof (globalThis as Record<string, unknown>).process !== 'undefined'
}

class ChildLogger {
  private _module: string

  constructor(module: string) {
    this._module = module
  }

  debug(message: string, meta?: Record<string, unknown>) {
    return Logger.debug(this._module, message, meta)
  }

  info(message: string, meta?: Record<string, unknown>) {
    return Logger.info(this._module, message, meta)
  }

  warn(message: string, meta?: Record<string, unknown>) {
    return Logger.warn(this._module, message, meta)
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>) {
    return Logger.error(this._module, message, error, meta)
  }
}

type NodeFS = {
  existsSync: (path: string) => boolean
  mkdirSync: (path: string, options: { recursive: boolean }) => void
  statSync: (path: string) => { size: number }
  appendFileSync: (path: string, data: string, encoding: string) => void
  readdirSync: (path: string) => string[]
  renameSync: (src: string, dest: string) => void
  unlinkSync: (path: string) => void
}

type NodePath = {
  resolve: (...segments: string[]) => string
  join: (...segments: string[]) => string
}

class LogWriter {
  private buffer: LogEntry[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private currentLogFile: string | null = null
  private currentLogSize = 0
  private initialized = false
  private _config: LoggerConfig

  constructor(config: LoggerConfig) {
    this._config = config
  }

  async init(): Promise<void> {
    if (this.initialized) return
    this.initialized = true

    if (!isNodeEnv()) return

    const [fs, path] = await Promise.all([
      import('node:fs') as Promise<NodeFS>,
      import('node:path') as Promise<NodePath>
    ])

    const logDir = path.resolve(this._config.logDir)
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const archiveDir = path.join(logDir, 'archive')
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true })
    }

    this.flushTimer = setInterval(() => this.flush(), this._config.flushInterval)

    this.cleanupArchives()
  }

  async write(entry: LogEntry, immediate = false): Promise<void> {
    if (!this.initialized) await this.init()

    if (immediate) {
      await this.writeToFile([entry])
      return
    }

    this.buffer.push(entry)
    if (this.buffer.length >= this._config.bufferSize) {
      await this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return

    const entries = [...this.buffer]
    this.buffer = []

    try {
      await this.writeToFile(entries)
    } catch (error) {
      console.error('[Logger] Flush failed:', error)
      this.buffer.unshift(...entries)
    }
  }

  private getNodeModules(): { fs: NodeFS; path: NodePath } {
    const req = (globalThis as unknown as { require: (id: string) => unknown }).require
    return {
      fs: req('node:fs') as NodeFS,
      path: req('node:path') as NodePath
    }
  }

  private async writeToFile(entries: LogEntry[]): Promise<void> {
    if (!isNodeEnv()) return

    const [fs, pathMod] = await Promise.all([
      import('node:fs') as Promise<NodeFS>,
      import('node:path') as Promise<NodePath>
    ])

    const dateStr = new Date().toISOString().split('T')[0]
    const logFileName = `app-${dateStr}.log`
    const logFilePath = pathMod.resolve(this._config.logDir, logFileName)

    let targetFile = logFilePath
    if (this.currentLogFile && this.currentLogFile !== logFilePath) {
      this.currentLogFile = logFilePath
      this.currentLogSize = 0
    }

    if (fs.existsSync(targetFile)) {
      const stats = fs.statSync(targetFile)
      this.currentLogSize = stats.size
    } else {
      this.currentLogFile = targetFile
      this.currentLogSize = 0
    }

    if (this.currentLogSize > this._config.maxFileSize) {
      targetFile = this.getRotatedFileName(logFilePath)
      this.currentLogFile = targetFile
      this.currentLogSize = 0
    }

    const content = entries.map((e) => JSON.stringify(e)).join('\n') + '\n'
    fs.appendFileSync(targetFile, content, 'utf-8')

    const textEncoder = new TextEncoder()
    this.currentLogSize += textEncoder.encode(content).byteLength

    this.checkAndArchive(dateStr)
  }

  private getRotatedFileName(basePath: string): string {
    const { fs } = this.getNodeModules()
    let counter = 1
    while (true) {
      const rotatedPath = basePath.replace('.log', `.${counter}.log`)
      if (!fs.existsSync(rotatedPath)) return rotatedPath
      counter++
    }
  }

  private checkAndArchive(currentDateStr: string): void {
    if (!isNodeEnv()) return

    const { fs, path: pathMod } = this.getNodeModules()

    const logDir = pathMod.resolve(this._config.logDir)
    const files = fs.readdirSync(logDir).filter((f: string) => f.startsWith('app-') && f.endsWith('.log'))

    for (const file of files) {
      const match = file.match(/app-(\d{4}-\d{2}-\d{2})(?:\.(\d+))?\.log/)
      if (!match) continue

      const fileDate = match![1]
      const fileAgeMs = Date.now() - new Date(fileDate).getTime()
      const fileAgeDays = fileAgeMs / (1000 * 60 * 60 * 24)

      if (fileAgeDays >= this._config.archiveDays && fileDate !== currentDateStr) {
        const srcPath = pathMod.join(logDir, file)
        const destPath = pathMod.join(logDir, 'archive', file)
        fs.renameSync(srcPath, destPath)
      }
    }
  }

  private cleanupArchives(): void {
    if (!isNodeEnv()) return

    const { fs, path: pathMod } = this.getNodeModules()

    const archiveDir = pathMod.resolve(this._config.logDir, 'archive')
    if (!fs.existsSync(archiveDir)) return

    const files = fs.readdirSync(archiveDir)
    for (const file of files) {
      const match = file.match(/app-(\d{4}-\d{2}-\d{2})(?:\.(\d+))?\.log/)
      if (!match) continue

      const fileDate = match![1]
      const fileAgeMs = Date.now() - new Date(fileDate).getTime()
      const fileAgeDays = fileAgeMs / (1000 * 60 * 60 * 24)

      if (fileAgeDays >= this._config.deleteArchiveDays) {
        fs.unlinkSync(pathMod.join(archiveDir, file))
      }
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    this.flush()
  }
}

class LoggerClass {
  private writer: LogWriter
  private minLevel: LogLevel
  private isDev: boolean

  constructor(config?: Partial<LoggerConfig>) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    this.writer = new LogWriter(mergedConfig)
    this.isDev = import.meta.env.MODE === 'development'
    this.minLevel = this.isDev ? 'DEBUG' : 'INFO'
  }

  async init(): Promise<void> {
    if (!this.isDev) {
      await this.writer.init()
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel]
  }

  private formatConsole(level: LogLevel, entry: LogEntry): string {
    const color = LEVEL_COLORS[level]
    const timestamp = entry.timestamp.replace('T', ' ').replace('Z', '')
    const prefix = `${color}[${level}]${RESET} ${timestamp} [${entry.module}]`
    const metaStr = entry.meta ? ` ${JSON.stringify(entry.meta)}` : ''
    let errorStr = ''
    if (entry.error) {
      errorStr = `\n  ${entry.error.name}: ${entry.error.message}`
      if (entry.error.stack) {
        errorStr += '\n' + entry.error.stack
      }
    }
    return `${prefix} ${entry.message}${metaStr}${errorStr}`
  }

  private createEntry(level: LogLevel, module: string, message: string, meta?: Record<string, unknown>, error?: Error | unknown): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message
    }

    if (meta && Object.keys(meta).length > 0) {
      entry.meta = meta
    }

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    } else if (error != null) {
      entry.error = {
        name: 'UnknownError',
        message: String(error)
      }
    }

    return entry
  }

  private output(entry: LogEntry, immediate = false): void {
    if (!this.shouldLog(entry.level)) return

    if (this.isDev) {
      const formatted = this.formatConsole(entry.level, entry)
      switch (entry.level) {
        case 'DEBUG':
          console.debug(formatted)
          break
        case 'INFO':
          console.info(formatted)
          break
        case 'WARN':
          console.warn(formatted)
          break
        case 'ERROR':
          console.error(formatted)
          break
      }
    } else {
      this.writer.write(entry, immediate)
    }
  }

  debug(module: string, message: string, meta?: Record<string, unknown>): void {
    const entry = this.createEntry('DEBUG', module, message, meta)
    this.output(entry)
  }

  info(module: string, message: string, meta?: Record<string, unknown>): void {
    const entry = this.createEntry('INFO', module, message, meta)
    this.output(entry)
  }

  warn(module: string, message: string, meta?: Record<string, unknown>): void {
    const entry = this.createEntry('WARN', module, message, meta)
    this.output(entry)
  }

  error(module: string, message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const entry = this.createEntry('ERROR', module, message, meta, error)
    this.output(entry, true)
  }

  child(module: string): ChildLogger {
    return new ChildLogger(module)
  }

  destroy(): void {
    this.writer.destroy()
  }
}

export const Logger = new LoggerClass()

export type { LogLevel, LogEntry, LoggerConfig }
export { ChildLogger }
