import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MessageInput from '@/components/chat/MessageInput.vue';

describe('MessageInput', () => {
  it('should render correctly with default props', () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should update modelValue when user types (v-model)', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    });
    const textarea = wrapper.find('textarea');
    await textarea.setValue('Hello World');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello World']);
  });

  it('should emit send event when send button is clicked', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test message'
      }
    });
    const sendButton = wrapper.findAll('button').at(-1)!;
    await sendButton.trigger('click');
    expect(wrapper.emitted('send')).toHaveLength(1);
  });

  it('should not emit send event when send button is clicked with empty text', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    });
    const sendButton = wrapper.findAll('button').at(-1)!;
    await sendButton.trigger('click');
    expect(wrapper.emitted('send')).toBeUndefined();
  });

  it('should emit send event when Enter key is pressed', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test message'
      }
    });
    const textarea = wrapper.find('textarea');
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false });
    expect(wrapper.emitted('send')).toHaveLength(1);
  });

  it('should not emit send event when Shift+Enter is pressed', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test message'
      }
    });
    const textarea = wrapper.find('textarea');
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true });
    expect(wrapper.emitted('send')).toBeUndefined();
  });

  it('should show red text when character count exceeds 2000', async () => {
    const longText = 'a'.repeat(2001);
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: longText
      }
    });
    const charCountElement = wrapper.find('.text-red-500');
    expect(charCountElement.exists()).toBe(true);
  });

  it('should show gray text when character count is under 2000', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Hello World'
      }
    });
    const charCountElement = wrapper.find('.text-gray-400');
    expect(charCountElement.exists()).toBe(true);
  });

  it('should disable send button when character count exceeds 2000', async () => {
    const longText = 'a'.repeat(2001);
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: longText
      }
    });
    const sendButton = wrapper.findAll('button').at(-1)!;
    expect(sendButton.attributes('disabled')).toBeDefined();
  });

  it('should disable textarea and send button when disabled is true', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test',
        disabled: true
      }
    });
    const textarea = wrapper.find('textarea');
    expect(textarea.attributes('disabled')).toBeDefined();
    const sendButton = wrapper.findAll('button').at(-1)!;
    expect(sendButton.attributes('disabled')).toBeDefined();
  });

  it('should disable textarea and send button when isStreaming is true', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test',
        isStreaming: true
      }
    });
    const textarea = wrapper.find('textarea');
    expect(textarea.attributes('disabled')).toBeDefined();
    const sendButton = wrapper.findAll('button').at(-1)!;
    expect(sendButton.attributes('disabled')).toBeDefined();
  });

  it('should emit attach-file event with "image" when image button is clicked', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    });
    const buttons = wrapper.findAll('button');
    const imageButton = buttons[0];
    await imageButton.trigger('click');
    expect(wrapper.emitted('attach-file')).toHaveLength(1);
    expect(wrapper.emitted('attach-file')?.[0]).toEqual(['image']);
  });

  it('should emit attach-file event with "file" when file button is clicked', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    });
    const buttons = wrapper.findAll('button');
    const fileButton = buttons[1];
    await fileButton.trigger('click');
    expect(wrapper.emitted('attach-file')).toHaveLength(1);
    expect(wrapper.emitted('attach-file')?.[0]).toEqual(['file']);
  });

  it('should emit attach-file event with "code" when code button is clicked', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    });
    const buttons = wrapper.findAll('button');
    const codeButton = buttons[2];
    await codeButton.trigger('click');
    expect(wrapper.emitted('attach-file')).toHaveLength(1);
    expect(wrapper.emitted('attach-file')?.[0]).toEqual(['code']);
  });

  it('should not emit send event when isStreaming is true', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test message',
        isStreaming: true
      }
    });
    const sendButton = wrapper.findAll('button').at(-1)!;
    await sendButton.trigger('click');
    expect(wrapper.emitted('send')).toBeUndefined();
  });

  it('should not emit send event when disabled is true', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test message',
        disabled: true
      }
    });
    const sendButton = wrapper.findAll('button').at(-1)!;
    await sendButton.trigger('click');
    expect(wrapper.emitted('send')).toBeUndefined();
  });
});
