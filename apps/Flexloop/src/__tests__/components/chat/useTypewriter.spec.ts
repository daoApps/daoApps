import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTypewriter } from '@/composables/useTypewriter';

describe('useTypewriter', () => {
  let typewriter: ReturnType<typeof useTypewriter>;

  beforeEach(() => {
    vi.useFakeTimers();
    typewriter = useTypewriter();
  });

  afterEach(() => {
    vi.useRealTimers();
    typewriter.stopTyping();
  });

  describe('Initial State', () => {
    it('should initialize with empty displayedText', () => {
      expect(typewriter.displayedText.value).toBe('');
    });

    it('should initialize with isTyping as false', () => {
      expect(typewriter.isTyping.value).toBe(false);
    });
  });

  describe('startTyping', () => {
    it('should start typing and set isTyping to true', () => {
      const text = 'Hello World';
      typewriter.startTyping(text, 50);

      expect(typewriter.isTyping.value).toBe(true);
      expect(typewriter.displayedText.value).toBe('');
    });

    it('should display text character by character', () => {
      const text = 'Hi';
      typewriter.startTyping(text, 50);

      // 第一次定时器触发
      vi.advanceTimersByTime(51);
      expect(typewriter.displayedText.value.length).toBeGreaterThan(0);
      expect(typewriter.displayedText.value.length).toBeLessThanOrEqual(text.length);

      // 继续直到完成
      while (typewriter.isTyping.value) {
        vi.advanceTimersByTime(51);
      }

      expect(typewriter.displayedText.value).toBe(text);
      expect(typewriter.isTyping.value).toBe(false);
    });

    it('should handle empty text', () => {
      typewriter.startTyping('', 30);

      expect(typewriter.isTyping.value).toBe(false);
      expect(typewriter.displayedText.value).toBe('');
    });

    it('should complete typing for long text', async () => {
      const longText = 'This is a longer piece of text for testing the typewriter effect.';
      typewriter.startTyping(longText, 20);

      // 等待所有字符输出完毕
      await vi.waitFor(
        () => {
          expect(typewriter.displayedText.value).toBe(longText);
          expect(typewriter.isTyping.value).toBe(false);
        },
        { timeout: 10000 }
      );
    });
  });

  describe('stopTyping', () => {
    it('should stop typing and set isTyping to false', () => {
      const text = 'Hello World';
      typewriter.startTyping(text, 1000); // 很慢的速度

      vi.advanceTimersByTime(10); // 开始打字

      typewriter.stopTyping();

      expect(typewriter.isTyping.value).toBe(false);
    });

    it('should stop before completing all characters', () => {
      const text = 'A very long message that takes time to type out completely';
      typewriter.startTyping(text, 200);

      // 让它开始
      vi.advanceTimersByTime(210);

      // 停止
      typewriter.stopTyping();

      // 文本应该不完整
      expect(typewriter.displayedText.value.length).toBeLessThan(text.length);
      expect(typewriter.isTyping.value).toBe(false);
    });
  });

  describe('Restart Typing', () => {
    it('should reset and start new text when called again', () => {
      typewriter.startTyping('First text', 50);
      vi.advanceTimersByTime(60);

      const firstLength = typewriter.displayedText.value.length;

      // 启动新的文本
      typewriter.startTyping('Second text', 50);

      expect(typewriter.displayedText.value).toBe('');
      expect(typewriter.isTyping.value).toBe(true);
    });
  });

  describe('Random Character Addition', () => {
    it('should add 1-3 characters at a time (simulating random)', () => {
      const text = 'Testing random character addition';
      typewriter.startTyping(text, 30);

      let previousLength = 0;
      let iterations = 0;
      const maxIterations = 100;

      while (typewriter.isTyping.value && iterations < maxIterations) {
        vi.advanceTimersByTime(31);

        const currentLength = typewriter.displayedText.value.length;
        if (currentLength > previousLength) {
          const charsAdded = currentLength - previousLength;
          expect(charsAdded).toBeGreaterThanOrEqual(1);
          expect(charsAdded).toBeLessThanOrEqual(3);
        }
        previousLength = currentLength;
        iterations++;
      }

      // 最终应该完成
      expect(typewriter.displayedText.value).toBe(text);
    });
  });
});
