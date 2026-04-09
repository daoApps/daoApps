<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { Message } from '@/types/chat'
import { useTypewriter } from '@/composables/useTypewriter'
import MultimediaMessage from './MultimediaMessage.vue'

interface Props {
  messages: Message[]
  isStreaming?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isStreaming: false
})

const messageListRef = ref<HTMLDivElement>()
const { displayedText, startTyping } = useTypewriter()

const renderMarkdown = (content: string): string => {
  try {
    const rawHtml = marked(content) as string
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    })
  } catch {
    return content
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

watch(() => props.messages.length, () => {
  scrollToBottom()
}, { immediate: true })

watch(() => props.isStreaming, (streaming) => {
  if (!streaming && props.messages.length > 0) {
    const lastMessage = props.messages[props.messages.length - 1]
    if (lastMessage?.role === 'assistant' && lastMessage.isStreaming) {
      startTyping(lastMessage.content)
    }
  }
})

onMounted(() => {
  scrollToBottom()
})

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'sending':
      return '<span class="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>'
    case 'sent':
      return '<span class="inline-block w-2 h-2 rounded-full bg-blue-400"></span>'
    case 'read':
      return '<span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>'
    default:
      return ''
  }
}
</script>

<template>
  <div ref="messageListRef" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
    <!-- 空状态 -->
    <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-4">💬</div>
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          开始新对话
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          选择一个快捷指令或直接输入您的问题，与 AI 助手开始对话
        </p>
      </div>
    </div>

    <!-- 消息列表 -->
    <template v-for="(message, index) in messages" :key="message.id">
      <!-- 用户消息 -->
      <div v-if="message.role === 'user'" class="flex justify-end">
        <div class="max-w-[80%] lg:max-w-[70%]">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
            <!-- 多媒体消息 -->
            <MultimediaMessage v-if="message.messageType && message.messageType !== 'text'" :message="message" />
            <!-- 文本内容 -->
            <div v-if="message.content" class="text-sm whitespace-pre-wrap break-words">{{ message.content }}</div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-1 px-2">
            <span class="text-xs text-gray-400">{{ formatTimestamp(message.timestamp) }}</span>
            <span v-html="getStatusIcon(message.status)"></span>
          </div>
        </div>
      </div>

      <!-- AI 消息 -->
      <div v-else class="flex justify-start">
        <div class="max-w-[80%] lg:max-w-[70%]">
          <div class="flex items-start gap-2 mb-1">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              🤖
            </div>
            <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <!-- 多媒体消息 -->
              <MultimediaMessage v-if="message.messageType && message.messageType !== 'text'" :message="message" />
              <!-- 流式输出时使用打字机效果 -->
              <div
                v-if="message.isStreaming && index === messages.length - 1 && (!message.messageType || message.messageType === 'text')"
                class="prose prose-sm dark:prose-invert max-w-none markdown-content"
                v-html="renderMarkdown(displayedText || message.content)"
              ></div>
              <!-- 正常渲染 Markdown -->
              <div
                v-else-if="!message.messageType || message.messageType === 'text'"
                class="prose prose-sm dark:prose-invert max-w-none markdown-content"
                v-html="renderMarkdown(message.content)"
              ></div>
              <!-- 流式指示器 -->
              <div v-if="isStreaming && message.isStreaming" class="flex items-center gap-1 mt-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-1 pl-10">
            <span class="text-xs text-gray-400">{{ formatTimestamp(message.timestamp) }}</span>
            <span v-html="getStatusIcon(message.status)"></span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.markdown-content :deep(p) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.75rem 0;
}

.markdown-content :deep(code) {
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', monospace;
}

.markdown-content :deep(:not(pre) > code) {
  background: #e2e8f0;
  color: #1e293b;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.dark .markdown-content :deep(:not(pre) > code) {
  background: #374151;
  color: #e5e7eb;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid #3b82f6;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #6b7280;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.dark .markdown-content :deep(strong) {
  color: #f3f4f6;
}

.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.75rem 0;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.dark .markdown-content :deep(th),
.dark .markdown-content :deep(td) {
  border-color: #374151;
}

.markdown-content :deep(th) {
  background: #f3f4f6;
  font-weight: 600;
}

.dark .markdown-content :deep(th) {
  background: #1f2937;
}
</style>
