import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useChatStore } from '@/stores/useChatStore';

describe('useChatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('State', () => {
    it('should have correct initial state', () => {
      const store = useChatStore();

      expect(store.conversations).toEqual([]);
      expect(store.activeConversationId).toBeNull();
      expect(store.activeAgent).toBeNull();
      expect(store.isStreaming).toBe(false);
      expect(store.streamingMessageId).toBeNull();
    });
  });

  describe('Getters', () => {
    it('activeConversation should return undefined when no active conversation', () => {
      const store = useChatStore();

      expect(store.activeConversation).toBeUndefined();
    });

    it('activeConversation should return the active conversation', () => {
      const store = useChatStore();

      const convId = store.createConversation();
      expect(store.activeConversation?.id).toBe(convId);
    });

    it('allMessages should return empty array when no active conversation', () => {
      const store = useChatStore();

      expect(store.allMessages).toEqual([]);
    });

    it('hasConversations should return false initially', () => {
      const store = useChatStore();

      expect(store.hasConversations).toBe(false);
    });

    it('hasConversations should return true after creating conversation', () => {
      const store = useChatStore();

      store.createConversation();
      expect(store.hasConversations).toBe(true);
    });
  });

  describe('Actions', () => {
    it('createConversation should create a new conversation', () => {
      const store = useChatStore();

      const convId = store.createConversation();

      expect(convId).toBeTruthy();
      expect(store.conversations.length).toBe(1);
      expect(store.activeConversationId).toBe(convId);
      expect(store.conversations[0].id).toBe(convId);
    });

    it('createConversation with agent should set activeAgent', () => {
      const store = useChatStore();

      const agent = {
        id: 'agent-1',
        name: 'Test Agent',
        avatar: '🤖',
        description: 'Test agent description'
      };

      store.createConversation(agent);

      expect(store.activeAgent).toEqual(agent);
    });

    it('setActiveConversation should change active conversation', () => {
      const store = useChatStore();

      const convId1 = store.createConversation();
      const convId2 = store.createConversation();

      store.setActiveConversation(convId1);
      expect(store.activeConversationId).toBe(convId1);

      store.setActiveConversation(convId2);
      expect(store.activeConversationId).toBe(convId2);
    });

    it('addMessage should add message to active conversation', () => {
      const store = useChatStore();

      store.createConversation();

      const msgId = store.addMessage({
        role: 'user',
        content: 'Hello'
      });

      expect(msgId).toBeTruthy();
      expect(store.allMessages.length).toBe(1);
      expect(store.allMessages[0].role).toBe('user');
      expect(store.allMessages[0].content).toBe('Hello');
    });

    it('updateMessage should update message content', () => {
      const store = useChatStore();

      store.createConversation();
      const msgId = store.addMessage({
        role: 'assistant',
        content: ''
      });

      store.updateMessage(msgId, 'Updated content');

      expect(store.allMessages[0].content).toBe('Updated content');
    });

    it('setStreaming should update streaming state', () => {
      const store = useChatStore();

      store.setStreaming(true, 'msg-123');
      expect(store.isStreaming).toBe(true);
      expect(store.streamingMessageId).toBe('msg-123');

      store.setStreaming(false);
      expect(store.isStreaming).toBe(false);
      expect(store.streamingMessageId).toBeNull();
    });

    it('setActiveAgent should set active agent', () => {
      const store = useChatStore();

      const agent = {
        id: 'agent-2',
        name: 'New Agent',
        avatar: '🎯',
        description: 'New agent description'
      };

      store.setActiveAgent(agent);
      expect(store.activeAgent).toEqual(agent);
    });

    it('deleteConversation should remove conversation and update activeConversationId', () => {
      const store = useChatStore();

      const convId1 = store.createConversation();
      const convId2 = store.createConversation();

      store.deleteConversation(convId1);

      expect(store.conversations.find((c) => c.id === convId1)).toBeUndefined();
      expect(store.activeConversationId).toBe(convId2);
    });

    it('clearAllConversations should remove all conversations', () => {
      const store = useChatStore();

      store.createConversation();
      store.createConversation();
      store.createConversation();

      store.clearAllConversations();

      expect(store.conversations).toEqual([]);
      expect(store.activeConversationId).toBeNull();
    });
  });
});
