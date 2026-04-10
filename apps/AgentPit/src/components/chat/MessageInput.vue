<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  disabled?: boolean
  isStreaming?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isStreaming: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  'attach-file': [type: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const MAX_CHARS = 2000

const charCount = computed(() => props.modelValue.length)
const isOverLimit = computed(() => charCount.value > MAX_CHARS)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  // 自动调整高度
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 200) + 'px'
  }
}

const handleSend = () => {
  if (!props.modelValue.trim() || props.disabled || props.isStreaming || isOverLimit.value) return
  emit('send')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

const handleAttach = (type: string) => {
  emit('attach-file', type)
}
</script>

<template>
  <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- 附件按钮栏 -->
      <div class="flex items-center gap-2 mb-3">
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-500 transition-colors"
          title="上传图片"
          @click="handleAttach('image')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-green-500 transition-colors"
          title="上传文件"
          @click="handleAttach('file')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-purple-500 transition-colors"
          title="插入代码块"
          @click="handleAttach('code')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      <!-- 输入区域 -->
      <div class="relative flex items-end gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <textarea
          ref="textareaRef"
          :value="modelValue"
          :disabled="disabled || isStreaming"
          :placeholder="isStreaming ? 'AI 正在回复中...' : '输入您的问题...（Shift+Enter 换行）'"
          rows="1"
          class="flex-1 px-4 py-3 bg-transparent resize-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed max-h-[200px]"
          style="min-height: 44px;"
          @input="handleInput"
          @keydown="handleKeyDown"
        ></textarea>

        <!-- 发送按钮 -->
        <button
          :disabled="!modelValue.trim() || disabled || isStreaming || isOverLimit"
          :class="[
            'mb-3 mr-3 p-2.5 rounded-xl transition-all',
            modelValue.trim() && !disabled && !isStreaming && !isOverLimit
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
          title="发送消息"
          @click="handleSend"
        >
          <svg v-if="!isStreaming" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <!-- 字符计数 -->
      <div class="flex justify-between items-center mt-2 px-1">
        <span class="text-xs text-gray-400">
          按 Enter 发送，Shift+Enter 换行
        </span>
        <span
:class="[
          'text-xs transition-colors',
          isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'
        ]">
          {{ charCount }} / {{ MAX_CHARS }}
        </span>
      </div>
    </div>
  </div>
</template>
