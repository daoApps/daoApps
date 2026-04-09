export type MessageRole = 'user' | 'assistant'

export type MessageStatus = 'sending' | 'sent' | 'read'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  status?: MessageStatus
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  agentId: string
  createdAt: number
  updatedAt: number
}

export interface AgentInfo {
  id: string
  name: string
  avatar: string
  description: string
}

export type QuickCommandCategory = 'general' | 'creative' | 'analysis' | 'coding'

export interface QuickCommand {
  id: string
  label: string
  prompt: string
  category: QuickCommandCategory
  icon?: string
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  sidebarOpen: boolean
  searchQuery: string
  activeAgentId: string
  availableAgents: AgentInfo[]
}
