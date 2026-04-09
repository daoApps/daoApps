<script setup lang="ts">
import { computed } from 'vue'
import type { Agent } from '../../data/mockCollaboration'

const props = defineProps<{
  agent: Agent
  isSelected?: boolean
  showDetails?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', agent: Agent): void
  (e: 'configure', agent: Agent): void
}>()

const statusConfig = computed(() => {
  const configs: Record<string, { color: string; bg: string; label: string }> = {
    online: { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: '在线' },
    busy: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: '忙碌' },
    offline: { color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', label: '离线' },
    idle: { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '空闲' },
    working: { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '工作中' },
    waiting: { color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '等待中' },
    error: { color: 'text-red-600', bg: 'bg-red-200 dark:bg-red-900/40', label: '错误' }
  }
  return configs[props.agent.status] || configs.offline
})

const modeConfig = computed(() => {
  const configs: Record<string, { icon: string; label: string }> = {
    leader: { icon: '👑', label: '领导者' },
    collaborator: { icon: '🤝', label: '协作者' },
    reviewer: { icon: '🔍', label: '审核者' }
  }
  return configs[agent.value.collaborationMode] || configs.collaborator
})

const agent = computed(() => props.agent)

const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

const lastActiveTime = computed(() => {
  return formatTime(Date.now() - Math.random() * 3600000)
})
</script>

<template>
  <div
    class="relative rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md"
    :class="[
      isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
    ]"
    @click="$emit('select', agent)"
  >
    <!-- Header -->
    <div class="p-3 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ agent.avatar }}</span>
          <div>
            <h3 class="font-semibold text-sm text-gray-900 dark:text-white">{{ agent.name }}</h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ agent.role }}</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <span :class="[statusConfig.color, statusConfig.bg, 'px-2 py-0.5 rounded-full text-xs font-medium']">
            {{ statusConfig.label }}
          </span>
        </div>
      </div>

      <!-- Mode Badge -->
      <div class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
        <span>{{ modeConfig.icon }}</span>
        <span>{{ modeConfig.label }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="showDetails" class="p-3 space-y-3">
      <!-- Level & Accuracy -->
      <div class="grid grid-cols-2 gap-2">
        <div class="text-center p-2 rounded bg-gray-50 dark:bg-gray-700/50">
          <div class="text-xs text-gray-500 dark:text-gray-400">能力等级</div>
          <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ agent.level }}</div>
        </div>
        <div class="text-center p-2 rounded bg-gray-50 dark:bg-gray-700/50">
          <div class="text-xs text-gray-500 dark:text-gray-400">准确率</div>
          <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ agent.accuracy }}%</div>
        </div>
      </div>

      <!-- CPU Usage Gauge -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600 dark:text-gray-400">CPU 使用率</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ Math.floor(Math.random() * 60 + 20) }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
            :style="{ width: `${Math.floor(Math.random() * 60 + 20)}%` }"
          ></div>
        </div>
      </div>

      <!-- Memory Usage -->
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600 dark:text-gray-400">内存使用</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ Math.floor(Math.random() * 50 + 30) }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-300"
            :style="{ width: `${Math.floor(Math.random() * 50 + 30)}%` }"
          ></div>
        </div>
      </div>

      <!-- Current Task Progress -->
      <div v-if="agent.status === 'working' || agent.status === 'busy'">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-600 dark:text-gray-400">当前任务</span>
          <span class="font-medium text-blue-600 dark:text-blue-400">{{ Math.floor(Math.random() * 80 + 10) }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-300 animate-pulse"
            :style="{ width: `${Math.floor(Math.random() * 80 + 10)}%` }"
          ></div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">已完成任务</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ agent.completedTasks }} 个</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">平均耗时</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ agent.avgTime }} 分钟</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">最后活跃</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ lastActiveTime }}</span>
        </div>
      </div>
    </div>

    <!-- Configure Button -->
    <div v-if="showDetails" class="px-3 pb-3">
      <button
        class="w-full px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
        @click.stop="$emit('configure', agent)"
      >
        ⚙️ 配置参数
      </button>
    </div>
  </div>
</template>
