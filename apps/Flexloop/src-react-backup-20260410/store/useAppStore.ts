import { create } from 'zustand'
import type { Message, Conversation, AgentInfo, ChatState } from '../types/chatTypes'
import { availableAgents, getMockResponse } from '../data/mockChat'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn('Failed to save to localStorage:', key)
  }
}

interface AppState extends ChatState {
  createConversation: () => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (conversationId: string, messageId: string, content: string) => void
  sendMessage: (content: string) => Promise<void>
  regenerateLastResponse: (conversationId: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setActiveAgent: (agentId: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const useAppStore = create<AppState>((set, get) => ({
  conversations: loadFromStorage<Conversation[]>('agentpit-conversations', []),
  activeConversationId: loadFromStorage<string | null>('agentpit-active-conversation', null),
  isStreaming: false,
  sidebarOpen: true,
  searchQuery: '',
  activeAgentId: loadFromStorage<string>('agentpit-active-agent', 'agent-1'),
  availableAgents,

  createConversation: () => {
    const id = generateId()
    const newConversation: Conversation = {
      id,
      title: '新对话',
      messages: [],
      agentId: get().activeAgentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => {
      const conversations = [newConversation, ...state.conversations]
      saveToStorage('agentpit-conversations', conversations)
      return { conversations, activeConversationId: id }
    })
    saveToStorage('agentpit-active-conversation', id)
    return id
  },

  deleteConversation: (id) => {
    set((state) => {
      const conversations = state.conversations.filter((c) => c.id !== id)
      let activeConversationId = state.activeConversationId
      if (activeConversationId === id) {
        activeConversationId = conversations.length > 0 ? conversations[0].id : null
      }
      saveToStorage('agentpit-conversations', conversations)
      saveToStorage('agentpit-active-conversation', activeConversationId)
      return { conversations, activeConversationId }
    })
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id })
    saveToStorage('agentpit-active-conversation', id)
  },

  addMessage: (conversationId, messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      timestamp: Date.now(),
    }
    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id !== conversationId) return c
        const updatedMessages = [...c.messages, newMessage]
        const title = c.messages.length === 0 && messageData.role === 'user' ? messageData.content.slice(0, 30) + (messageData.content.length > 30 ? '...' : '') : c.title
        return { ...c, messages: updatedMessages, title, updatedAt: Date.now() }
      })
      saveToStorage('agentpit-conversations', conversations)
      return { conversations }
    })
  },

  updateMessage: (conversationId, messageId, content) => {
    set((state) => {
      const conversations = state.conversations.map((c) => {
        if (c.id !== conversationId) return c
        const messages = c.messages.map((m) => (m.id === messageId ? { ...m, content, status: 'sent' as const, isStreaming: false } : m))
        return { ...c, messages, updatedAt: Date.now() }
      })
      saveToStorage('agentpit-conversations', conversations)
      return { conversations }
    })
  },

  sendMessage: async (content) => {
    const state = get()
    let conversationId = state.activeConversationId

    if (!conversationId) {
      conversationId = state.createConversation()
    }

    state.addMessage(conversationId, { role: 'user', content, status: 'sent' })

    set({ isStreaming: true })
    const assistantMessageId = generateId()
    state.addMessage(conversationId, { role: 'assistant', content: '', status: 'sending', isStreaming: true })

    const fullResponse = getMockResponse(content)

    await new Promise<void>((resolve) => {
      let currentIndex = 0
      const interval = setInterval(() => {
        currentIndex += Math.floor(Math.random() * 3) + 1
        if (currentIndex >= fullResponse.length) {
          currentIndex = fullResponse.length
          clearInterval(interval)
          state.updateMessage(conversationId!, assistantMessageId, fullResponse)
          set({ isStreaming: false })
          resolve()
        } else {
          state.updateMessage(conversationId!, assistantMessageId, fullResponse.slice(0, currentIndex))
        }
      }, 30)
    })
  },

  regenerateLastResponse: async (conversationId) => {
    const state = get()
    const conversation = state.conversations.find((c) => c.id === conversationId)
    if (!conversation || conversation.messages.length < 2) return

    const lastUserMessage = [...conversation.messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMessage) return

    set({ isStreaming: true })
    const assistantMessageId = generateId()
    state.addMessage(conversationId, { role: 'assistant', content: '', status: 'sending', isStreaming: true })

    const fullResponse = getMockResponse(lastUserMessage.content)

    await new Promise<void>((resolve) => {
      let currentIndex = 0
      const interval = setInterval(() => {
        currentIndex += Math.floor(Math.random() * 3) + 1
        if (currentIndex >= fullResponse.length) {
          currentIndex = fullResponse.length
          clearInterval(interval)
          state.updateMessage(conversationId, assistantMessageId, fullResponse)
          set({ isStreaming: false })
          resolve()
        } else {
          state.updateMessage(conversationId, assistantMessageId, fullResponse.slice(0, currentIndex))
        }
      }, 30)
    })
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveAgent: (agentId) => {
    set({ activeAgentId: agentId })
    saveToStorage('agentpit-active-agent', agentId)
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

export default useAppStore
