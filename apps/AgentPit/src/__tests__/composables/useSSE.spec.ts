import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSSE } from '@/composables/useSSE';

describe('useSSE', () => {
  let sse: ReturnType<typeof useSSE>;

  beforeEach(() => {
    vi.useFakeTimers();
    sse = useSSE();
  });

  afterEach(() => {
    vi.useRealTimers();
    sse.disconnect();
  });

  describe('Initial State', () => {
    it('should initialize with disconnected state', () => {
      expect(sse.connectionState.value).toBe('disconnected');
    });

    it('should initialize with empty messages array', () => {
      expect(sse.messages.value).toEqual([]);
    });

    it('should initialize with null error', () => {
      expect(sse.error.value).toBeNull();
    });
  });

  describe('connect', () => {
    it('should set state to connecting when starting connection', () => {
      sse.connect('https://example.com');
      expect(sse.connectionState.value).toBe('connecting');
      expect(sse.error.value).toBeNull();
    });
  });

  describe('disconnect', () => {
    it('should set state to disconnected', () => {
      sse.disconnect();
      expect(sse.connectionState.value).toBe('disconnected');
    });

    it('should be safe to call disconnect multiple times', () => {
      expect(() => {
        sse.disconnect();
        sse.disconnect();
        sse.disconnect();
      }).not.toThrow();
    });
  });

  describe('clearMessages', () => {
    it('should clear all messages', () => {
      sse.clearMessages();
      expect(sse.messages.value).toEqual([]);
    });

    it('should be safe to call clearMessages when already empty', () => {
      expect(() => {
        sse.clearMessages();
        sse.clearMessages();
      }).not.toThrow();
    });
  });
});
