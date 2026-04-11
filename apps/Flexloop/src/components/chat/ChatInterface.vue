<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useChatStore } from '@/stores/useChatStore';
import { useLanguageDetection } from '@/composables/useLanguageDetection';
import { useDeepResearch } from '@/composables/useDeepResearch';
import ChatSidebar from './ChatSidebar.vue';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';
import QuickCommands from './QuickCommands.vue';

const chatStore = useChatStore();
const { isAvailable, error: deepResearchError, progress, currentStep, research } = useDeepResearch();
const inputText = ref('');
const showQuickCommands = ref(true);
const showSidebar = ref(true);
const isMobile = ref(false);
const { detectedLanguage, languageLabel, languageIcon, detectLanguage } = useLanguageDetection();

// 监听输入文本变化，实时检测语言
watch(inputText, (newText) => {
  if (newText.length > 2) {
    detectLanguage(newText);
  }
});

const currentMessages = computed(() => chatStore.allMessages);

onMounted(() => {
  chatStore.loadConversations();

  // 检测移动端
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
    if (isMobile.value) {
      showSidebar.value = false;
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  // 如果没有活跃会话，创建一个
  if (!chatStore.activeConversationId && chatStore.conversations.length === 0) {
    chatStore.createConversation(chatStore.activeAgent ?? undefined);
  } else if (chatStore.conversations.length > 0 && !chatStore.activeConversationId) {
    const firstConv = chatStore.conversations[0];
    if (firstConv) {
      chatStore.setActiveConversation(firstConv.id);
    }
  }
});

const handleSendMessage = async () => {
  const content = inputText.value.trim();
  if (!content || chatStore.isStreaming) return;

  // 确保有活跃会话
  if (!chatStore.activeConversationId) {
    chatStore.createConversation(chatStore.activeAgent || undefined);
  }

  // 添加用户消息
  chatStore.addMessage({
    role: 'user',
    content,
    status: 'sent',
    isStreaming: false
  });

  inputText.value = '';

  // 创建空的 AI 消息（用于流式输出）
  const aiMessageId = chatStore.addMessage({
    role: 'assistant',
    content: '',
    status: 'sending',
    isStreaming: true
  });

  // 开始流式输出
  chatStore.setStreaming(true, aiMessageId);

  try {
    // 检查 DeepResearch 是否可用
    if (!isAvailable.value) {
      const errorMsg = deepResearchError.value || 'DeepResearch API 服务不可用';
      chatStore.updateMessage(aiMessageId, `⚠️ ${errorMsg}\n\n请确保后端服务已启动在 http://localhost:8000`);
      return;
    }

    // 调用 DeepResearch 后端，进度通过 progress 和 currentStep 响应式更新
    let lastProgress = 0;
    const updateProgress = () => {
      if (progress.value > lastProgress) {
        lastProgress = progress.value;
        // 更新进度到消息内容（显示当前步骤）
        const progressText = `**${currentStep.value}** ${progress.value.toFixed(0)}%\n\n`;
        chatStore.updateMessage(aiMessageId, progressText);
      }
    };

    // 进度更新定时器
    const progressInterval = setInterval(updateProgress, 500);

    try {
      // 调用 DeepResearch 后端
      const result = await research({
        query: content
      });

      clearInterval(progressInterval);

      if (result.success && result.data) {
        // 深度研究完成，输出最终结果
        chatStore.updateMessage(aiMessageId, result.data);
      } else {
        // 研究失败，显示错误
        chatStore.updateMessage(aiMessageId, `❌ 深度研究失败: ${result.error || '未知错误'}`);
      }
    } finally {
      clearInterval(progressInterval);
      chatStore.setStreaming(false);
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    chatStore.updateMessage(aiMessageId, `抱歉，处理您的请求时出现了错误: ${errorMsg}`);
    chatStore.setStreaming(false);
  }
};

const handleSelectQuickCommand = (prompt: string) => {
  inputText.value = prompt;
  handleSendMessage();
};

const handleAttachFile = (type: string) => {
  console.log(`附件类型: ${type}`);
  alert(`${type === 'image' ? '图片' : type === 'file' ? '文件' : '代码'}上传功能开发中...`);
};

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
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
      <div
        v-if="isMobile"
        class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="toggleSidebar"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div class="text-center">
          <h1 class="text-base font-semibold text-gray-900 dark:text-white">智能对话</h1>
          <div v-if="chatStore.activeAgent" class="flex items-center justify-center gap-1 mt-0.5">
            <span>{{ chatStore.activeAgent.avatar }}</span>
            <span class="text-xs text-gray-500">{{ chatStore.activeAgent.name }}</span>
          </div>
        </div>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="showQuickCommands = !showQuickCommands"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      </div>

      <!-- 桌面端头部 -->
      <header
        v-if="!isMobile"
        class="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-900"
      >
        <div class="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">智能对话</h1>
            <div v-if="chatStore.activeAgent" class="flex items-center gap-2 mt-1">
              <span class="text-lg">{{ chatStore.activeAgent.avatar }}</span>
              <span class="text-sm text-gray-500"
                >{{ chatStore.activeAgent.name }} — {{ chatStore.activeAgent.description }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- 连接状态指示器 -->
            <div
              class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20"
            >
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
              <span class="text-xs font-medium text-blue-700 dark:text-blue-400">{{
                languageLabel
              }}</span>
            </div>
            <button
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              @click="showQuickCommands = !showQuickCommands"
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
