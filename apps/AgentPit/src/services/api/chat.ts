import type { Conversation, Message } from '@/types/chat';
import { mockConversations } from '@/data/mockChat';

export const chatApi = {
  getConversations: async (): Promise<Conversation[]> => {
    // 模拟数据
    return mockConversations;
  },
  getMessages: async (conversationId: string): Promise<Message[]> => {
    // 模拟数据
    const conversation = mockConversations.find((conv) => conv.id === conversationId);
    return conversation?.messages || [];
  },
  sendMessage: async (_conversationId: string, _content: string): Promise<void> => {
    // 模拟发送消息
  }
};
