<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import type { Message } from '../../data/mockCollaboration'
import { mockMessages, presetAgents } from '../../data/mockCollaboration'

const emit = defineEmits<{
  (e: 'sendMessage', message: Message): void
}>()

const messages = ref<Message[]>([...mockMessages])
const newMessage = ref('')
const selectedAgentId = ref<string>('')
const wsStatus = ref<'connected' | 'disconnected' | 'connecting'>('connected')
const messageFilter = ref<'all' | 'request' | 'response' | 'notification' | 'warning' | 'conflict'>('all')
const messagesContainer = ref<HTMLElement | null>(null)

// Simulate WebSocket connection
onMounted(() => {
  simulateConnection()
  // Auto-scroll to bottom
  scrollToBottom()

  // Simulate incoming messages periodically
  setInterval(() => {
    if (Math.random() > 0.7) {
      simulateIncomingMessage()
    }
  }, 8000)
})

const simulateConnection = () => {
  wsStatus.value = 'connecting'
  setTimeout(() => {
    wsStatus.value = 'connected'
  }, 1000)
}

const simulateIncomingMessage = () => {
  const agents = presetAgents.filter(a => a.status === 'online' || a.status === 'busy')
  const fromAgent = agents[Math.floor(Math.random() * agents.length)]
  const toAgent = agents[Math.floor(Math.random() * agents.length)]

  if (fromAgent.id !== toAgent.id) {
    const types: Array<Message['type']> = ['request', 'response', 'notification', 'warning']
    const type = types[Math.floor(Math.random() * types.length)]

    const sampleContents: Record<string, string[]> = {
      request: [
        '请协助完成当前任务的下一阶段工作',
        '需要你提供最新的数据分析结果',
        '请审核我提交的方案并给出反馈',
        '能否帮忙优化一下代码性能？'
      ],
      response: [
        '已完成任务分配，正在处理中',
        '数据已整理完成，请查看附件',
        '审核通过，可以进入下一阶段',
        '优化建议已发送，请查收'
      ],
      notification: [
        '系统通知：新任务已创建',
        '提醒：任务截止时间临近',
        '更新：项目进度已同步至最新状态'
      ],
      warning: [
        '警告：检测到潜在的资源冲突',
        '注意：某个任务可能存在延迟风险',
        '提示：建议重新评估任务优先级'
      ]
    }

    const contents = sampleContents[type] || sampleContents.notification
    const content = contents[Math.floor(Math.random() * contents.length)]

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      fromAgentId: fromAgent.id,
      fromAgentName: fromAgent.name,
      toAgentId: toAgent.id,
      toAgentName: toAgent.name,
      type,
      content,
      timestamp: Date.now(),
      sessionId: 'session-1'
    }

    messages.value.push(newMsg)
    nextTick(() => scrollToBottom())
  }
}

const filteredMessages = computed(() => {
  if (messageFilter.value === 'all') return messages.value
  return messages.value.filter(m => m.type === messageFilter.value)
})

const getAgentAvatar = (agentId: string) => {
  const agent = presetAgents.find(a => a.id === agentId)
  return agent ? agent.avatar : '❓'
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) return '今天'
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return '昨天'

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const messageTypeConfig = computed(() => ({
  request: { color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', icon: '📨', label: '请求' },
  response: { color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800', icon: '✅', label: '响应' },
  notification: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600', icon: '📢', label: '通知' },
  warning: { color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800', icon: '⚠️', label: '警告' },
  conflict: { color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', icon: '⚔️', label: '冲突' }
}))

const wsStatusConfig = computed(() => ({
  connected: { color: 'text-green-500 bg-green-50 dark:bg-green-900/20', label: '已连接', dot: '●' },
  disconnected: { color: 'text-red-500 bg-red-50 dark:bg-red-900/20', label: '未连接', dot: '○' },
  connecting: { color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', label: '连接中...', dot: '◐' }
}))

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const currentUser = presetAgents[0] // Assume current user is planner

  const msg: Message = {
    id: `msg-${Date.now()}`,
    fromAgentId: currentUser.id,
    fromAgentName: currentUser.name,
    toAgentId: selectedAgentId.value || undefined,
    toAgentName: selectedAgentId.value ? presetAgents.find(a => a.id === selectedAgentId.value)?.name : undefined,
    type: 'request',
    content: newMessage.value.trim(),
    timestamp: Date.now(),
    sessionId: 'session-1'
  }

  messages.value.push(msg)
  emit('sendMessage', msg)
  newMessage.value = ''

  nextTick(() => scrollToBottom())

  // Simulate response after short delay
  setTimeout(() => {
    simulateIncomingMessage()
  }, 2000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const clearMessages = () => {
  if (confirm('确定要清空所有消息记录吗？')) {
    messages.value = []
  }
}

const groupedMessages = computed(() => {
  const groups: { date: string; messages: Message[] }[] = []
  let currentDate = ''

  filteredMessages.value.forEach(msg => {
    const dateKey = formatDate(msg.timestamp)
    if (dateKey !== currentDate) {
      currentDate = dateKey
      groups.push({ date: dateKey, messages: [msg] })
    } else {
      groups[groups.length - 1].messages.push(msg)
    }
  })

  return groups
})
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">通信面板</h2>

        <!-- WebSocket Status -->
        <div :class="['flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium', wsStatusConfig[wsStatus].color]">
          <span class="animate-pulse">{{ wsStatusConfig[wsStatus].dot }}</span>
          {{ wsStatusConfig[wsStatus].label }}
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto pb-1">
        <button
          v-for="(config, type) in messageTypeConfig"
          :key="type"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
            messageFilter === type
              ? config.color + ' ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          @click="messageFilter = type as any"
        >
          {{ config.icon }} {{ config.label }}
        </button>
        <button
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
            messageFilter === 'all'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          @click="messageFilter = 'all'"
        >
          📋 全部
        </button>
      </div>
    </div>

    <!-- Messages List -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- Grouped by Date -->
      <div v-for="group in groupedMessages" :key="group.date">
        <!-- Date Divider -->
        <div class="relative flex items-center justify-center my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <span class="relative px-3 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            {{ group.date }}
          </span>
        </div>

        <!-- Messages in Group -->
        <div class="space-y-3">
          <div
            v-for="msg in group.messages"
            :key="msg.id"
            class="group relative p-3 rounded-lg border hover:shadow-sm transition-all"
            :class="messageTypeConfig[msg.type].color"
          >
            <!-- Header -->
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ getAgentAvatar(msg.fromAgentId) }}</span>
                <div>
                  <span class="font-semibold text-sm">{{ msg.fromAgentName }}</span>
                  <span v-if="msg.toAgentName" class="text-xs ml-1.5">
                    → <span class="font-medium">{{ getAgentAvatar(msg.toAgentId!) }} {{ msg.toAgentName }}</span>
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 text-xs font-medium rounded bg-black/10 dark:bg-white/10">
                  {{ messageTypeConfig[msg.type].icon }} {{ messageTypeConfig[msg.type].label }}
                </span>
                <span class="text-xs opacity-75">{{ formatTime(msg.timestamp) }}</span>
              </div>
            </div>

            <!-- Content -->
            <p class="text-sm leading-relaxed pl-8">{{ msg.content }}</p>

            <!-- Actions on Hover -->
            <div class="mt-2 pt-2 border-t border-current/10 pl-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex items-center gap-2 text-xs">
                <button class="hover:underline">回复</button>
                <span>·</span>
                <button class="hover:underline">引用</button>
                <span>·</span>
                <button class="hover:underline">复制</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p class="text-sm font-medium">暂无消息</p>
        <p class="text-xs mt-1">智能体之间的通信将在此处显示</p>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <!-- Recipient Selector -->
      <div class="mb-2">
        <select
          v-model="selectedAgentId"
          class="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">发送给所有智能体</option>
          <option v-for="agent in presetAgents" :key="agent.id" :value="agent.id">
            {{ agent.avatar }} {{ agent.name }}
          </option>
        </select>
      </div>

      <!-- Message Input -->
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="输入消息... (Enter 发送)"
          class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="sendMessage"
        />
        <button
          :disabled="!newMessage.trim()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          @click="sendMessage"
        >
          发送
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{{ filteredMessages.length }} 条消息</span>
        <button
          class="hover:text-red-500 transition-colors"
          @click="clearMessages"
        >
          清空消息
        </button>
      </div>
    </div>
  </div>
</template>
