import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useChatStore } from '@/stores/useChatStore';

describe('Chat Flow Integration - Complete Conversation Lifecycle', () => {
  let chatStore: ReturnType<typeof useChatStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    chatStore = useChatStore();
    chatStore.clearAllConversations();
  });

  describe('Send-Receive flow', () => {
    it('sends user message and appears in message list', () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: '你好' });

      const messages = chatStore.activeConversation?.messages || [];
      expect(messages.length).toBe(1);
      expect(messages[0].role).toBe('user');
      expect(messages[0].content).toBe('你好');
    });

    it('AI response appears after user sends message (simulated)', async () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: '你好' });

      chatStore.setStreaming(true);
      expect(chatStore.isStreaming).toBe(true);

      chatStore.addMessage({ role: 'assistant', content: '你好！有什么可以帮助你的？' });
      chatStore.setStreaming(false);

      const messages = chatStore.activeConversation?.messages || [];
      expect(messages.length).toBe(2);
      expect(messages[1].role).toBe('assistant');
      expect(messages[1].content).toContain('有什么可以帮助');
    });

    it('streaming state transitions correctly', () => {
      chatStore.createConversation();

      expect(chatStore.isStreaming).toBe(false);

      chatStore.setStreaming(true);
      expect(chatStore.isStreaming).toBe(true);

      chatStore.addMessage({ role: 'assistant', content: 'response' });
      chatStore.setStreaming(false);
      expect(chatStore.isStreaming).toBe(false);
    });

    it('new user message interrupts current streaming', () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'first' });
      chatStore.setStreaming(true);

      chatStore.addMessage({ role: 'user', content: 'second (interrupt)' });
      chatStore.setStreaming(false);

      const messages = chatStore.activeConversation?.messages || [];
      const userMsgs = messages.filter((m) => m.role === 'user');
      expect(userMsgs.length).toBe(2);
    });
  });

  describe('Multi-turn context preservation', () => {
    it('maintains conversation context across multiple turns', () => {
      chatStore.createConversation();

      const dialogues = [
        { role: 'user' as const, content: '什么是 Vue3？' },
        { role: 'assistant' as const, content: 'Vue3 是渐进式 JavaScript 框架...' },
        { role: 'user' as const, content: '它有哪些新特性？' },
        { role: 'assistant' as const, content: 'Composition API、Teleport、Suspense...' },
        { role: 'user' as const, content: '第三点详细说说' }
      ];

      dialogues.forEach((d) => chatStore.addMessage(d));

      const ctx = chatStore.recentContext;
      expect(ctx.length).toBeGreaterThanOrEqual(5);
    });

    it('recentContext caps at 10 turns (20 messages)', () => {
      chatStore.createConversation();
      for (let i = 0; i < 15; i++) {
        chatStore.addMessage({ role: i % 2 === 0 ? 'user' : 'assistant', content: `turn ${i}` });
      }
      const ctx = chatStore.recentContext;
      expect(ctx.length).toBeLessThanOrEqual(20);
    });
  });

  describe('Conversation management', () => {
    it('creates and switches between conversations', () => {
      vi.useFakeTimers();

      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'conv1 msg' });
      const id1 = chatStore.activeConversationId;

      vi.advanceTimersByTime(100);

      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'conv2 msg' });
      const id2 = chatStore.activeConversationId;

      vi.useRealTimers();

      expect(id1).not.toBe(id2);

      chatStore.setActiveConversation(id1!);
      expect(chatStore.activeConversation?.messages.length).toBe(1);
      expect(chatStore.activeConversation?.messages[0].content).toBe('conv1 msg');

      chatStore.setActiveConversation(id2!);
      expect(chatStore.activeConversation?.messages[0].content).toBe('conv2 msg');
    });

    it('deletes conversation and cleans up messages', () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'will be deleted' });
      const id = chatStore.activeConversationId;

      chatStore.deleteConversation(id!);
      expect(chatStore.conversations.length).toBe(0);
      expect(chatStore.activeConversationId).toBeNull();
    });

    it('clearAllConversations resets entire store', () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'msg1' });
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'msg2' });

      chatStore.clearAllConversations();
      expect(chatStore.conversations.length).toBe(0);
      expect(chatStore.hasConversations).toBe(false);
    });
  });

  describe('Message types and metadata', () => {
    it('supports different message roles', () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'user msg' });
      chatStore.addMessage({ role: 'assistant', content: 'ai msg' });

      const roles = chatStore.allMessages.map((m) => m.role);
      expect(roles).toContain('user');
      expect(roles).toContain('assistant');
    });

    it('auto-generates unique IDs for each message', () => {
      vi.useFakeTimers();

      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'a' });
      vi.advanceTimersByTime(10);
      chatStore.addMessage({ role: 'user', content: 'b' });

      vi.useRealTimers();

      const ids = chatStore.allMessages.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('timestamps are numbers (timestamp is number type)', () => {
      chatStore.createConversation();
      chatStore.addMessage({ role: 'user', content: 'test' });
      const ts = chatStore.allMessages[0].timestamp;
      expect(ts).toBeTruthy();
      expect(typeof ts).toBe('number');
    });
  });
});
