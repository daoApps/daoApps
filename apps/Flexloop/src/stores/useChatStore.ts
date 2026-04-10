import { defineStore } from 'pinia';
import type { Message, Conversation, AgentInfo } from '@/types/chat';
import { chatApi } from '@/services/api/chat';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeAgent: AgentInfo | null;
  isStreaming: boolean;
  streamingMessageId: string | null;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    conversations: [],
    activeConversationId: null,
    activeAgent: null,
    isStreaming: false,
    streamingMessageId: null
  }),

  getters: {
    activeConversation: (state): Conversation | undefined => {
      return state.conversations.find((c) => c.id === state.activeConversationId);
    },

    allMessages: (state): Message[] => {
      const conv = state.conversations.find((c) => c.id === state.activeConversationId);
      return conv?.messages || [];
    },

    hasConversations: (state): boolean => state.conversations.length > 0,

    /** 获取最近 N 轮对话上下文（默认10轮） */
    recentContext: (state): Message[] => {
      const conv = state.conversations.find((c) => c.id === state.activeConversationId);
      if (!conv || !conv.messages.length) return [];

      const maxRounds = 10;
      const messages = conv.messages;
      let rounds = 0;
      const contextMessages: Message[] = [];

      // 从后往前遍历，收集完整的 user+assistant 对话轮次
      for (let i = messages.length - 1; i >= 0 && rounds < maxRounds; i--) {
        const msg = messages[i];
        if (msg) {
          contextMessages.unshift(msg);
          if (msg.role === 'assistant') {
            rounds++;
          }
        }
      }

      return contextMessages;
    },

    /** 获取当前会话的消息总数 */
    messageCount: (state): number => {
      const conv = state.conversations.find((c) => c.id === state.activeConversationId);
      return conv?.messages.length || 0;
    }
  },

  actions: {
    createConversation(agent?: AgentInfo): string {
      const id = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const conversation: Conversation = {
        id,
        title: '新对话',
        agentId: agent?.id || 'default',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      this.conversations.unshift(conversation);
      this.activeConversationId = id;

      if (agent) {
        this.activeAgent = agent;
      }

      this.persistConversations();
      return id;
    },

    setActiveConversation(id: string) {
      this.activeConversationId = id;
      const conv = this.conversations.find((c) => c.id === id);
      if (conv) {
        // 可以在这里设置对应的智能体信息
      }
    },

    addMessage(message: Omit<Message, 'id' | 'timestamp'>): string {
      const id = `msg-${Date.now()}`;
      const newMessage: Message = {
        ...message,
        id,
        timestamp: Date.now()
      };

      const conv = this.conversations.find((c) => c.id === this.activeConversationId);
      if (conv) {
        conv.messages.push(newMessage);

        // 如果是第一条用户消息，更新会话标题
        if (conv.messages.length === 1 && message.role === 'user') {
          conv.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
        }

        conv.updatedAt = Date.now();
        this.persistConversations();
      }

      return id;
    },

    updateMessage(id: string, content: string) {
      const conv = this.conversations.find((c) => c.id === this.activeConversationId);
      if (conv) {
        const msg = conv.messages.find((m) => m.id === id);
        if (msg) {
          msg.content = content;
          msg.status = 'sent';
          msg.isStreaming = false;
          conv.updatedAt = Date.now();
          this.persistConversations();
        }
      }
    },

    setStreaming(isStreaming: boolean, messageId?: string) {
      this.isStreaming = isStreaming;
      this.streamingMessageId = messageId || null;
    },

    setActiveAgent(agent: AgentInfo) {
      this.activeAgent = agent;
    },

    deleteConversation(id: string) {
      const index = this.conversations.findIndex((c) => c.id === id);
      if (index > -1) {
        this.conversations.splice(index, 1);
        if (this.activeConversationId === id) {
          this.activeConversationId =
            this.conversations.length > 0 ? this.conversations[0].id : null;
        }
        this.persistConversations();
      }
    },

    clearAllConversations() {
      this.conversations = [];
      this.activeConversationId = null;
      localStorage.removeItem('agentpit-conversations');
    },

    persistConversations() {
      localStorage.setItem('agentpit-conversations', JSON.stringify(this.conversations));
    },

    loadConversations() {
      const stored = localStorage.getItem('agentpit-conversations');
      if (stored) {
        try {
          this.conversations = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load conversations:', e);
        }
      }
    },

    async fetchConversations() {
      try {
        const conversations = await chatApi.getConversations();
        this.conversations = conversations;
        this.persistConversations();
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    },

    async fetchMessages(conversationId: string) {
      try {
        const messages = await chatApi.getMessages(conversationId);
        const conv = this.conversations.find((c) => c.id === conversationId);
        if (conv) {
          conv.messages = messages;
          this.persistConversations();
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    },

    async sendMessage(content: string) {
      if (!this.activeConversationId) return;

      const messageId = this.addMessage({
        role: 'user',
        content,
        status: 'sending'
      });

      try {
        await chatApi.sendMessage(this.activeConversationId, content);
        this.updateMessage(messageId, content);
      } catch (error) {
        console.error('Failed to send message:', error);
        // 可以在这里添加错误处理逻辑
      }
    }
  }
});
