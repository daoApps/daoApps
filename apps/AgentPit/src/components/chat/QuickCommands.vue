<script setup lang="ts">
import { ref, computed } from 'vue'
import { quickCommands } from '@/data/mockChat'
import type { QuickCommandCategory } from '@/types/chat'

interface Props {
  visible?: boolean
}

withDefaults(defineProps<Props>(), {
  visible: true
})

const emit = defineEmits<{
  select: [command: string]
}>()

const selectedCategory = ref<QuickCommandCategory | 'all'>('all')

const categories: { value: QuickCommandCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'general', label: '通用', icon: '💬' },
  { value: 'creative', label: '创意', icon: '✨' },
  { value: 'analysis', label: '分析', icon: '📊' },
  { value: 'coding', label: '编程', icon: '💻' }
]

const filteredCommands = computed(() => {
  if (selectedCategory.value === 'all') {
    return quickCommands
  }
  return quickCommands.filter(cmd => cmd.category === selectedCategory.value)
})

const handleSelectCommand = (prompt: string) => {
  emit('select', prompt)
}
</script>

<template>
  <div v-if="visible" class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- 分类标签 -->
      <div class="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
        <button
          v-for="cat in categories"
          :key="cat.value"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
            selectedCategory === cat.value
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          @click="selectedCategory = cat.value"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- 快捷指令网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="command in filteredCommands"
          :key="command.id"
          class="group p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-left"
          @click="handleSelectCommand(command.prompt)"
        >
          <div class="flex items-start gap-2">
            <span class="text-xl group-hover:scale-110 transition-transform">{{ command.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                {{ command.label }}
              </div>
              <div class="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {{ command.prompt.slice(0, 40) }}{{ command.prompt.length > 40 ? '...' : '' }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
