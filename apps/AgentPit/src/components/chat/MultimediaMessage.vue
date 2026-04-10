<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types/chat'

interface Props {
  message: Message
}

const props = defineProps<Props>()

const isImage = computed(() => props.message.messageType === 'image' && props.message.imageMeta)
const isFile = computed(() => props.message.messageType === 'file' && props.message.fileMeta)
const isCode = computed(() => props.message.messageType === 'code' && props.message.codeMeta)

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase()
  if (type.includes('pdf')) return '📄'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('excel') || type.includes('sheet')) return '📊'
  if (type.includes('image') || type.includes('png') || type.includes('jpg')) return '🖼️'
  if (type.includes('zip') || type.includes('rar')) return '📦'
  if (type.includes('code') || type.includes('text')) return '📄'
  return '📎'
}

const handleImageClick = () => {
  if (props.message.imageMeta?.url) {
    window.open(props.message.imageMeta.url, '_blank')
  }
}

const copyCode = () => {
  const code = props.message.codeMeta?.code
  if (code && typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(code)
  }
}

const getLanguageLabel = (lang: string): string => {
  const labels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    csharp: 'C#',
    go: 'Go',
    rust: 'Rust',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    sql: 'SQL',
    bash: 'Bash',
  }
  return labels[lang.toLowerCase()] || lang.toUpperCase()
}
</script>

<template>
  <!-- 图片消息 -->
  <div v-if="isImage" class="my-2">
    <div
      class="cursor-pointer group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all"
      @click="handleImageClick"
    >
      <img
        :src="message.imageMeta!.thumbnailUrl || message.imageMeta!.url"
        :alt="message.imageMeta!.alt || '图片'"
        :class="[
          'max-w-full h-auto rounded-lg transition-transform group-hover:scale-[1.02]',
          message.imageMeta!.width && message.imageMeta!.height ? '' : 'max-h-64 object-cover'
        ]"
        loading="lazy"
      />
      <!-- 悬停遮罩 -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span class="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
          点击查看大图
        </span>
      </div>
    </div>
    <p v-if="message.content" class="text-xs text-gray-500 mt-1">{{ message.content }}</p>
  </div>

  <!-- 文件消息 -->
  <div v-if="isFile" class="my-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer group">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
        {{ getFileIcon(message.fileMeta!.type) }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ message.fileMeta!.name }}
        </p>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ formatFileSize(message.fileMeta!.size) }} · {{ message.fileMeta!.type.split('/')[1]?.toUpperCase() || message.fileMeta!.type }}
        </p>
      </div>
      <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </div>
  </div>

  <!-- 代码块消息 -->
  <div v-if="isCode" class="my-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <!-- 代码头部 -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <span class="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {{ getLanguageLabel(message.codeMeta!.language) }}
      </span>
      <button
        class="text-xs text-gray-500 hover:text-blue-500 transition-colors"
        title="复制代码"
        @click="copyCode"
      >
        复制
      </button>
    </div>
    <!-- 代码内容 -->
    <pre class="p-4 overflow-x-auto bg-gray-900 text-gray-100 text-sm leading-relaxed"><code>{{ message.codeMeta!.code }}</code></pre>
  </div>
</template>
