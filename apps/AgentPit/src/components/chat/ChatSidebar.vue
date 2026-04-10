<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/useChatStore'
import { availableAgents } from '@/data/mockChat'

const chatStore = useChatStore()
const searchQuery = ref('')
const showAgentSelector = ref(false)

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) {
    return chatStore.conversations
  }
  const query = searchQuery.value.toLowerCase()
  return chatStore.conversations.filter(conv =>
    conv.title.toLowerCase().includes(query) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(query))
  )
})

const handleNewConversation = () => {
  chatStore.createConversation(chatStore.activeAgent || undefined)
}

const handleSelectConversation = (id: string) => {
  chatStore.setActiveConversation(id)
}

const handleDeleteConversation = (id: string, event: Event) => {
  event.stopPropagation()
  if (confirm('确定要删除这个对话吗？')) {
    chatStore.deleteConversation(id)
  }
}

const handleRenameConversation = (id: string, event: Event) => {
  event.stopPropagation()
  const conv = chatStore.conversations.find(c => c.id === id)
  if (conv) {
    const newTitle = prompt('请输入新的对话标题：', conv.title)
    if (newTitle && newTitle.trim()) {
      conv.title = newTitle.trim()
      chatStore.persistConversations()
    }
  }
}

const handleSwitchAgent = (agentId: string) => {
  const agent = availableAgents.find(a => a.id === agentId)
  if (agent) {
    chatStore.setActiveAgent(agent)
    showAgentSelector.value = false
  }
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
    <!-- 头部 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">对话历史</h2>
        <button
          class="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          title="新建对话"
          @click="handleNewConversation"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- 智能体选择器 -->
      <div class="relative mb-3">
        <button
          class="w-full px-3 py-2 text-left text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 transition-colors flex items-center justify-between"
          @click="showAgentSelector = !showAgentSelector"
        >
          <span class="flex items-center gap-2">
            <span v-if="chatStore.activeAgent">{{ chatStore.activeAgent.avatar }}</span>
            <span>{{ chatStore.activeAgent?.name || '选择智能体' }}</span>
          </span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="showAgentSelector" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
          <button
            v-for="agent in availableAgents"
            :key="agent.id"
            class="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            @click="handleSwitchAgent(agent.id)"
          >
            <span>{{ agent.avatar }}</span>
            <div>
              <div class="font-medium text-sm text-gray-900 dark:text-white">{{ agent.name }}</div>
              <div class="text-xs text-gray-500">{{ agent.description }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- 搜索框 -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索对话..."
        class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 对话列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="filteredConversations.length === 0" class="p-4 text-center text-gray-500 text-sm">
        {{ searchQuery ? '没有找到匹配的对话' : '暂无对话记录' }}
      </div>

      <div v-else class="py-2">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          :class="[
            'group mx-2 mb-1 px-3 py-3 rounded-lg cursor-pointer transition-all',
            chatStore.activeConversationId === conv.id
              ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
          ]"
          @click="handleSelectConversation(conv.id)"
          @contextmenu.prevent="handleDeleteConversation(conv.id, $event)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ conv.title }}
                </h3>
              </div>
              <p class="text-xs text-gray-500 truncate">
                {{ conv.messages[conv.messages.length - 1]?.content.slice(0, 50) || '空对话' }}
              </p>
              <div class="text-xs text-gray-400 mt-1">
                {{ formatTime(conv.updatedAt) }}
              </div>
            </div>

            <!-- 操作按钮（悬停显示） -->
            <div class="opacity-0 group-hover:opacity-100 flex gap-1 ml-2 transition-opacity">
              <button
                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="重命名"
                @click.stop="handleRenameConversation(conv.id, $event)"
              >
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                title="删除"
                @click.stop="handleDeleteConversation(conv.id, $event)"
              >
                <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
