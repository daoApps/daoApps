import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';
import ChatInterface from '@/components/chat/ChatInterface.vue';

vi.mock('@/components/chat/ChatSidebar.vue', () => ({
  default: {
    name: 'ChatSidebar',
    template: '<div data-testid="chat-sidebar"></div>'
  }
}));

vi.mock('@/components/chat/MessageList.vue', () => ({
  default: {
    name: 'MessageList',
    props: ['messages', 'isStreaming'],
    template: '<div data-testid="message-list"></div>'
  }
}));

vi.mock('@/components/chat/MessageInput.vue', () => ({
  default: {
    name: 'MessageInput',
    props: ['modelValue', 'disabled', 'isStreaming'],
    emits: ['update:modelValue', 'send', 'attach-file'],
    template: '<div data-testid="message-input"></div>'
  }
}));

vi.mock('@/components/chat/QuickCommands.vue', () => ({
  default: {
    name: 'QuickCommands',
    props: ['visible'],
    emits: ['select'],
    template: '<div data-testid="quick-commands"></div>'
  }
}));

vi.mock('@/composables/useLanguageDetection', () => ({
  useLanguageDetection: () => ({
    detectedLanguage: ref('unknown'),
    languageLabel: ref('未知'),
    languageIcon: ref('❓'),
    detectLanguage: vi.fn()
  })
}));

vi.mock('@/data/mockChat', () => ({
  getMockResponse: vi.fn(() => 'Mock response')
}));

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1200
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: vi.fn()
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: vi.fn()
});

describe('ChatInterface', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
  });

  it('should render all child components correctly', async () => {
    const wrapper = mount(ChatInterface, {
      global: {
        plugins: [pinia]
      }
    });

    await flushPromises();

    expect(wrapper.find('[data-testid="chat-sidebar"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="message-list"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="message-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="quick-commands"]').exists()).toBe(true);
  });

  it('should toggle sidebar when toggleSidebar is called', async () => {
    const wrapper = mount(ChatInterface, {
      global: {
        plugins: [pinia]
      }
    });

    await flushPromises();

    const vm = wrapper.vm as any;
    expect(vm.showSidebar).toBe(true);

    vm.toggleSidebar();
    await wrapper.vm.$nextTick();
    expect(vm.showSidebar).toBe(false);

    vm.toggleSidebar();
    await wrapper.vm.$nextTick();
    expect(vm.showSidebar).toBe(true);
  });

  it('should hide sidebar initially on mobile', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    const wrapper = mount(ChatInterface, {
      global: {
        plugins: [pinia]
      }
    });

    await flushPromises();

    const vm = wrapper.vm as any;
    expect(vm.isMobile).toBe(true);
  });

  it('should render desktop header when not on mobile', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200
    });

    const wrapper = mount(ChatInterface, {
      global: {
        plugins: [pinia]
      }
    });

    await flushPromises();

    expect(wrapper.text()).toContain('智能对话');
    expect(wrapper.text()).toContain('已连接');
  });

  it('should render mobile header when on mobile', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    const wrapper = mount(ChatInterface, {
      global: {
        plugins: [pinia]
      }
    });

    await flushPromises();

    expect(wrapper.text()).toContain('智能对话');
  });
});
