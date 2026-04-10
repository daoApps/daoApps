// src/services/api/chat.ts
import { httpClient, withMock, withMockStream } from './client';
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
  getConversations: withMock(
    () => mockChat.getConversations(),
    () => httpClient.get<Conversation[]>('/chat/conversations').then(res => res.data)
  ),

  // 获取消息历史
  getMessages: withMock(
    (conversationId: string) => mockChat.getMessages(conversationId),
    (conversationId: string) =>
      httpClient.get<Message[]>(`/chat/conversations/${conversationId}`).then(res => res.data)
  ),

  // 发送消息
  sendMessage: withMock(
    (conversationId: string, content: string) => mockChat.sendMessage(conversationId, content),
    (conversationId: string, content: string) =>
      httpClient.post<Message>(
        `/chat/conversations/${conversationId}/messages`,
        { content }
      ).then(res => res.data)
  ),

  // 流式接收消息（SSE）
  streamMessages: withMockStream(
    (conversationId: string, callback: (message: Message) => void) => {
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
    },
    (conversationId: string, callback: (message: Message) => void) => {
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
  )
};
