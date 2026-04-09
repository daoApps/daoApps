/**
 * 聊天系统类型定义
 * 从 React 版本的 chatTypes.ts 迁移并增强
 */

/** 消息角色类型 */
export type MessageRole = 'user' | 'assistant'

/** 消息状态类型 */
export type MessageStatus = 'sending' | 'sent' | 'read'

/** 消息内容类型 */
export type MessageType = 'text' | 'image' | 'file' | 'code'

/** 文件消息元数据 */
export interface FileMetadata {
  name: string
  size: number
  type: string
  url?: string
}

/** 图片消息元数据 */
export interface ImageMetadata {
  url: string
  alt?: string
  width?: number
  height?: number
  thumbnailUrl?: string
}

/** 代码块消息元数据 */
export interface CodeMetadata {
  language: string
  code: string
}

/** 消息接口 */
export interface Message {
  /** 消息唯一标识 */
  id: string
  /** 消息角色（用户或助手） */
  role: MessageRole
  /** 消息内容（支持 Markdown） */
  content: string
  /** 发送时间戳（毫秒） */
  timestamp: number
  /** 消息发送/阅读状态 */
  status?: MessageStatus
  /** 是否正在流式输出 */
  isStreaming?: boolean
  /** 消息内容类型（默认为文本） */
  messageType?: MessageType
  /** 文件消息的元数据 */
  fileMeta?: FileMetadata
  /** 图片消息的元数据 */
  imageMeta?: ImageMetadata
  /** 代码块消息的元数据 */
  codeMeta?: CodeMetadata
}

/** 会话接口 */
export interface Conversation {
  /** 会话唯一标识 */
  id: string
  /** 会话标题（通常取首条消息前30字符） */
  title: string
  /** 消息列表 */
  messages: Message[]
  /** 关联的智能体 ID */
  agentId: string
  /** 会话创建时间 */
  createdAt: number
  /** 最后更新时间 */
  updatedAt: number
}

/** 智能体基本信息 */
export interface AgentInfo {
  /** 智能体唯一标识 */
  id: string
  /** 智能体显示名称 */
  name: string
  /** 智能体头像（Emoji 或 URL） */
  avatar: string
  /** 智能体描述 */
  description: string
}

/** 快捷指令类别 */
export type QuickCommandCategory = 'general' | 'creative' | 'analysis' | 'coding'

/** 快捷指令接口 */
export interface QuickCommand {
  /** 指令唯一标识 */
  id: string
  /** 显示标签 */
  label: string
  /** 实际发送的内容 */
  prompt: string
  /** 指令分类 */
  category: QuickCommandCategory
  /** 图标（Emoji） */
  icon?: string
}

/** 聊天全局状态接口 */
export interface ChatState {
  /** 所有会话列表 */
  conversations: Conversation[]
  /** 当前激活的会话 ID */
  activeConversationId: string | null
  /** 是否正在进行流式输出 */
  isStreaming: boolean
  /** 侧边栏是否展开 */
  sidebarOpen: boolean
  /** 搜索关键词 */
  searchQuery: string
  /** 当前选中的智能体 ID */
  activeAgentId: string
  /** 可用的智能体列表 */
  availableAgents: AgentInfo[]
}

/** 聊天事件类型 */
export type ChatEventType =
  | 'message_sent'
  | 'message_received'
  | 'streaming_start'
  | 'streaming_end'
  | 'conversation_created'
  | 'conversation_deleted'
  | 'agent_switched'

/** 聊天事件回调 */
export type ChatEventCallback = (event: ChatEventType, data?: any) => void

/** 流式输出配置 */
export interface StreamingConfig {
  /** 每次追加的字符数范围 */
  charsPerInterval: [number, number]
  /** 输出间隔时间（毫秒） */
  intervalMs: number
}

/** 默认流式输出配置 */
export const DEFAULT_STREAMING_CONFIG: StreamingConfig = {
  charsPerInterval: [1, 3],
  intervalMs: 30
}
