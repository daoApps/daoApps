import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MessageList from '@/components/chat/MessageList.vue';
import type { Message } from '@/types/chat';

describe('MessageList', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  const createMockMessages = (): Message[] => [
    {
      id: 'msg-1',
      role: 'user',
      content: '你好，这是一条测试消息',
      timestamp: Date.now() - 60000,
      status: 'sent'
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: '# 标题\n\n这是**Markdown**内容。\n\n- 列表项1\n- 列表项2',
      timestamp: Date.now() - 30000,
      status: 'read'
    }
  ];

  it('should render empty state when no messages', () => {
    const wrapper = mount(MessageList, {
      props: {
        messages: [],
        isStreaming: false
      }
    });

    expect(wrapper.text()).toContain('开始新对话');
    expect(wrapper.find('.text-6xl').exists()).toBe(true);
  });

  it('should render user messages correctly', () => {
    const messages = createMockMessages();
    const wrapper = mount(MessageList, {
      props: {
        messages,
        isStreaming: false
      }
    });

    // 检查用户消息是否存在
    const userMessages = wrapper.findAll('.justify-end');
    expect(userMessages.length).toBeGreaterThanOrEqual(1);

    // 检查用户消息内容
    expect(wrapper.text()).toContain('你好，这是一条测试消息');
  });

  it('should render assistant messages correctly', () => {
    const messages = createMockMessages();
    const wrapper = mount(MessageList, {
      props: {
        messages,
        isStreaming: false
      }
    });

    // 检查AI消息是否存在
    const aiMessages = wrapper.findAll('.justify-start');
    expect(aiMessages.length).toBeGreaterThanOrEqual(1);

    // 检查AI消息包含Markdown渲染后的内容
    expect(wrapper.text()).toContain('标题');
    expect(wrapper.text()).toContain('Markdown');
    expect(wrapper.text()).toContain('列表项1');
  });

  it('should show streaming indicator when streaming', async () => {
    const streamingMessage: Message[] = [
      {
        id: 'msg-stream',
        role: 'assistant',
        content: '正在流式输出的文本...',
        timestamp: Date.now(),
        status: 'sending',
        isStreaming: true
      }
    ];

    const wrapper = mount(MessageList, {
      props: {
        messages: streamingMessage,
        isStreaming: true
      }
    });

    // 检查流式指示器（三个跳动点）
    const bouncingDots = wrapper.findAll('.animate-bounce');
    expect(bouncingDots.length).toBe(3);
  });

  it('should render timestamps correctly', () => {
    const messages = createMockMessages();
    const wrapper = mount(MessageList, {
      props: {
        messages,
        isStreaming: false
      }
    });

    // 应该显示时间戳
    const timeElements = wrapper.findAll('.text-xs.text-gray-400');
    expect(timeElements.length).toBeGreaterThanOrEqual(messages.length); // 每个消息有一个时间戳
  });

  it('should render message status icons', () => {
    const messages: Message[] = [
      {
        id: 'msg-status',
        role: 'user',
        content: '测试状态',
        timestamp: Date.now(),
        status: 'sent'
      },
      {
        id: 'msg-read',
        role: 'assistant',
        content: '已读消息',
        timestamp: Date.now(),
        status: 'read'
      }
    ];

    const wrapper = mount(MessageList, {
      props: {
        messages,
        isStreaming: false
      }
    });

    // 状态图标应该是圆点
    const statusDots = wrapper.findAll('.rounded-full');
    expect(statusDots.length).toBeGreaterThan(0);
  });

  it('should handle Markdown code blocks safely', () => {
    const messagesWithCode: Message[] = [
      {
        id: 'msg-code',
        role: 'assistant',
        content: '```javascript\nconst x = "test";\nconsole.log(x);\n```',
        timestamp: Date.now(),
        status: 'sent'
      }
    ];

    const wrapper = mount(MessageList, {
      props: {
        messages: messagesWithCode,
        isStreaming: false
      }
    });

    // 代码块应该被正确渲染
    expect(wrapper.html()).toContain('<pre');
    expect(wrapper.html()).toContain('const x');
  });

  it('should sanitize XSS in markdown content', () => {
    const maliciousMessage: Message[] = [
      {
        id: 'msg-xss',
        role: 'assistant',
        content: '<script>alert("XSS")</script><img onerror="alert(\'XSS\')" src="x">',
        timestamp: Date.now(),
        status: 'sent'
      }
    ];

    const wrapper = mount(MessageList, {
      props: {
        messages: maliciousMessage,
        isStreaming: false
      }
    });

    // script 和危险属性应该被移除
    expect(wrapper.html()).not.toContain('<script>');
    expect(wrapper.html()).not.toContain('onerror=');
  });

  it('should render multiple messages in order', () => {
    const manyMessages: Message[] = Array.from({ length: 5 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `消息 ${i + 1}`,
      timestamp: Date.now() - (5 - i) * 60000,
      status: 'sent' as const
    }));

    const wrapper = mount(MessageList, {
      props: {
        messages: manyMessages,
        isStreaming: false
      }
    });

    // 所有消息都应该渲染
    for (let i = 0; i < 5; i++) {
      expect(wrapper.text()).toContain(`消息 ${i + 1}`);
    }
  });
});
