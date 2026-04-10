// src/services/api/chat.ts
import { httpClient } from './client';
import { API_CONFIG } from '../config';

// Mock 数据导入
import * as mockChat from '../../data/mockChat';

// 类型定义
export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status: 'sending' | 'sent' | 'failed';
}

// API 服务
export const chatApi = {
  // 获取对话列表
  async getConversations(): Promise<Conversation[]> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockChat.getConversations());
    }
    const response = await httpClient.get<Conversation[]>('/chat/conversations');
    return response.data;
  },

  // 获取消息历史
  async getMessages(conversationId: string): Promise<Message[]> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockChat.getMessages(conversationId));
    }
    const response = await httpClient.get<Message[]>(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  // 发送消息
  async sendMessage(conversationId: string, content: string): Promise<Message> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockChat.sendMessage(conversationId, content));
    }
    const response = await httpClient.post<Message>(
      `/chat/conversations/${conversationId}/messages`,
      { content }
    );
    return response.data;
  },

  // 流式接收消息（SSE）
  streamMessages(conversationId: string, callback: (message: Message) => void): EventSource {
    if (API_CONFIG.useMock) {
      // Mock 流式响应
      setTimeout(() => {
        callback({
          id: `mock-${Date.now()}`,
          content: '这是一条模拟的流式响应消息',
          sender: 'agent',
          timestamp: new Date().toISOString(),
          status: 'sent'
        });
      }, 1000);
      return {} as EventSource;
    }

    const eventSource = new EventSource(
      `${API_CONFIG.baseURL}/chat/conversations/${conversationId}/stream`
    );
    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        callback(message);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };
    return eventSource;
  }
};
