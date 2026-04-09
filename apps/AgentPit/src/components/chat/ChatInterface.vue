<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/useChatStore'
import { getMockResponse } from '@/data/mockChat'
import { useLanguageDetection } from '@/composables/useLanguageDetection'
import ChatSidebar from './ChatSidebar.vue'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import QuickCommands from './QuickCommands.vue'

const chatStore = useChatStore()
const inputText = ref('')
const showQuickCommands = ref(true)
const showSidebar = ref(true)
const isMobile = ref(false)
const {
  detectedLanguage,
  languageLabel,
  languageIcon,
  detectLanguage
} = useLanguageDetection()

// 监听输入文本变化，实时检测语言
watch(inputText, (newText) => {
  if (newText.length > 2) {
    detectLanguage(newText)
  }
})

const currentMessages = computed(() => chatStore.allMessages)

onMounted(() => {
  chatStore.loadConversations()

  // 检测移动端
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
      showSidebar.value = false
    }
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 如果没有活跃会话，创建一个
  if (!chatStore.activeConversationId && chatStore.conversations.length === 0) {
    chatStore.createConversation(chatStore.activeAgent ?? undefined)
  } else if (chatStore.conversations.length > 0 && !chatStore.activeConversationId) {
    const firstConv = chatStore.conversations[0]
    if (firstConv) {
      chatStore.setActiveConversation(firstConv.id)
    }
  }
})

const handleSendMessage = async () => {
  const content = inputText.value.trim()
  if (!content || chatStore.isStreaming) return

  // 确保有活跃会话
  if (!chatStore.activeConversationId) {
    chatStore.createConversation(chatStore.activeAgent || undefined)
  }

  // 添加用户消息
  chatStore.addMessage({
    role: 'user',
    content,
    status: 'sent',
    isStreaming: false
  })

  inputText.value = ''

  // 创建空的 AI 消息（用于流式输出）
  const aiMessageId = chatStore.addMessage({
    role: 'assistant',
    content: '',
    status: 'sending',
    isStreaming: true
  })

  // 开始流式输出
  chatStore.setStreaming(true, aiMessageId)

  try {
    // 获取 Mock 响应（传入上下文以支持多轮对话）
    const context = chatStore.recentContext
    const responseContent = getMockResponse(content, context)

    // 模拟流式输出
    await simulateStreaming(responseContent, aiMessageId)
  } catch (error) {
    console.error('发送消息失败:', error)
    chatStore.updateMessage(aiMessageId, '抱歉，处理您的请求时出现了错误。请稍后重试。')
  } finally {
    chatStore.setStreaming(false)
  }
}

const simulateStreaming = (fullText: string, messageId: string): Promise<void> => {
  return new Promise((resolve) => {
    let currentIndex = 0
    const intervalMs = 30
    const charsPerInterval = [1, 2, 3]

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const randomIndex = Math.floor(Math.random() * charsPerInterval.length)
        const charsToAdd = Math.min(
          charsPerInterval[randomIndex] ?? 1,
          fullText.length - currentIndex
        )
        const newText = fullText.slice(0, currentIndex + charsToAdd)
        chatStore.updateMessage(messageId, newText)
        currentIndex += charsToAdd
      } else {
        clearInterval(interval)
        resolve()
      }
    }, intervalMs)
  })
}

const handleSelectQuickCommand = (prompt: string) => {
  inputText.value = prompt
  handleSendMessage()
}

const handleAttachFile = (type: string) => {
  console.log(`附件类型: ${type}`)
  alert(`${type === 'image' ? '图片' : type === 'file' ? '文件' : '代码'}上传功能开发中...`)
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}
</script>

<template>
  <div class="h-screen flex bg-gray-100 dark:bg-gray-950 overflow-hidden">
    <!-- 左侧边栏 - 对话历史 -->
    <Transition name="slide">
      <aside
        v-if="showSidebar"
        class="w-80 flex-shrink-0 lg:block hidden md:block"
        :class="{ '!block': showSidebar && isMobile, 'fixed inset-y-0 left-0 z-30': isMobile }"
      >
        <ChatSidebar />
      </aside>
    </Transition>

    <!-- 主聊天区域 -->
    <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 relative">
      <!-- 移动端头部 -->
      <div v-if="isMobile" class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="text-center">
          <h1 class="text-base font-semibold text-gray-900 dark:text-white">智能对话</h1>
          <div v-if="chatStore.activeAgent" class="flex items-center justify-center gap-1 mt-0.5">
            <span>{{ chatStore.activeAgent.avatar }}</span>
            <span class="text-xs text-gray-500">{{ chatStore.activeAgent.name }}</span>
          </div>
        </div>
        <button @click="showQuickCommands = !showQuickCommands" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      <!-- 桌面端头部 -->
      <header v-if="!isMobile" class="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">智能对话</h1>
            <div v-if="chatStore.activeAgent" class="flex items-center gap-2 mt-1">
              <span class="text-lg">{{ chatStore.activeAgent.avatar }}</span>
              <span class="text-sm text-gray-500">{{ chatStore.activeAgent.name }} — {{ chatStore.activeAgent.description }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- 连接状态指示器 -->
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span class="text-xs font-medium text-green-700 dark:text-green-400">已连接</span>
            </div>

            <!-- 语言检测指示器 -->
            <div
              v-if="detectedLanguage !== 'unknown' && inputText.length > 2"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
              :title="`检测到输入语言：${languageLabel}`"
            >
              <span>{{ languageIcon }}</span>
              <span class="text-xs font-medium text-blue-700 dark:text-blue-400">{{ languageLabel }}</span>
            </div>
            <button
              @click="showQuickCommands = !showQuickCommands"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              {{ showQuickCommands ? '隐藏快捷指令' : '显示快捷指令' }}
            </button>
          </div>
        </div>
      </header>

      <!-- 消息列表区域 -->
      <MessageList
        :messages="currentMessages"
        :is-streaming="chatStore.isStreaming"
        class="flex-1"
      />

      <!-- 快捷指令面板 -->
      <QuickCommands
        v-show="showQuickCommands && !chatStore.isStreaming"
        :visible="showQuickCommands"
        @select="handleSelectQuickCommand"
      />

      <!-- 输入框区域 -->
      <MessageInput
        v-model="inputText"
        :disabled="chatStore.isStreaming"
        :is-streaming="chatStore.isStreaming"
        @send="handleSendMessage"
        @attach-file="handleAttachFile"
      />
    </main>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

@media (max-width: 768px) {
  aside.fixed {
    width: 280px;
  }
}
</style>
