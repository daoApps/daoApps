<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDebounce } from '../../composables/useDebounce'
import { sampleAgents, type AgentItem } from '../../data/mockCustomize'

const emit = defineEmits<{
  create: []
  edit: [agent: AgentItem]
}>()

const agents = ref<AgentItem[]>([...sampleAgents])
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('createdAt')
const selectedIds = ref<Set<string>>(new Set())
const showDeleteConfirm = ref(false)
const deleteTargetId = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 9

const debouncedSearch = useDebounce(() => searchQuery.value, 300)

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
  { value: 'disabled', label: '已停用' },
  { value: 'reviewing', label: '审核中' }
]

const sortOptions = [
  { value: 'createdAt', label: '最新创建' },
  { value: 'updatedAt', label: '最近编辑' },
  { value: 'name-asc', label: '名称 A-Z' },
  { value: 'name-desc', label: '名称 Z-A' }
]

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: '已发布', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  draft: { label: '草稿', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
  disabled: { label: '已停用', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  reviewing: { label: '审核中', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' }
}

const filteredAgents = computed(() => {
  let result = [...agents.value]
  const query = debouncedSearch.value.toLowerCase().trim()
  if (query) {
    result = result.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.tags.some(t => t.toLowerCase().includes(query)) ||
      a.description.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value !== 'all') {
    result = result.filter(a => a.status === statusFilter.value)
  }
  switch (sortBy.value) {
    case 'createdAt':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'updatedAt':
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
  }
  return result
})

const paginatedAgents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAgents.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredAgents.value.length / pageSize))

// const allSelected = computed(() =>
//   paginatedAgents.value.length > 0 && paginatedAgents.value.every(a => selectedIds.value.has(a.id))
// )

// const toggleSelectAll = () => {
//   if (allSelected.value) {
//     paginatedAgents.value.forEach(a => selectedIds.value.delete(a.id))
//   } else {
//     paginatedAgents.value.forEach(a => selectedIds.value.add(a.id))
//   }
// }

const toggleSelect = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

const confirmDelete = (id: string | null = null) => {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

const executeDelete = () => {
  if (deleteTargetId.value) {
    agents.value = agents.value.filter(a => a.id !== deleteTargetId.value)
  } else {
    agents.value = agents.value.filter(a => !selectedIds.value.has(a.id))
  }
  selectedIds.value.clear()
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

const handleEdit = (agent: AgentItem) => {
  emit('edit', agent)
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-md w-full">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索智能体名称或标签..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          aria-label="搜索智能体"
        />
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select v-model="statusFilter"
          class="flex-1 sm:flex-initial px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="状态筛选"
        >
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <select v-model="sortBy"
          class="flex-1 sm:flex-initial px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="排序方式"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <button
          @click="$emit('create')"
          class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <span>+</span> 新建
        </button>
      </div>
    </div>

    <div v-if="selectedIds.size > 0" class="flex items-center justify-between px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <span class="text-sm text-blue-700 dark:text-blue-300">已选择 {{ selectedIds.size }} 项</span>
      <div class="flex gap-2">
        <button @click="confirmDelete()" class="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          批量删除
        </button>
        <button @click="selectedIds.clear()" class="px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors">取消选择</button>
      </div>
    </div>

    <TransitionGroup name="list" tag="div" v-if="paginatedAgents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="agent in paginatedAgents"
        :key="agent.id"
        class="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
      >
        <div class="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            :checked="selectedIds.has(agent.id)"
            @change="toggleSelect(agent.id)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            :aria-label="`选择${agent.name}`"
          />
        </div>

        <div class="p-5 pt-8">
          <div class="flex items-start gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              {{ agent.avatar }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ agent.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{{ agent.description }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="tag in agent.tags.slice(0, 3)"
              :key="tag"
              class="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded"
            >{{ tag }}</span>
            <span v-if="agent.tags.length > 3" class="text-[10px] text-gray-400">+{{ agent.tags.length - 3 }}</span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <span
              class="text-[11px] px-2 py-0.5 rounded-full font-medium"
              :class="[statusConfig[agent.status]?.bg || '', statusConfig[agent.status]?.color || '']"
            >{{ statusConfig[agent.status]?.label || agent.status }}</span>
            <span class="text-[10px] text-gray-400">{{ formatDate(agent.updatedAt) }} 更新</span>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white/95 dark:from-gray-800/95 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-end gap-1.5">
          <button @click="handleEdit(agent)" class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">编辑</button>
          <button class="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">复制</button>
          <button v-if="agent.status === 'draft'" class="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">发布</button>
          <button v-if="agent.status === 'published'" class="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors">停用</button>
          <button @click="confirmDelete(agent.id)" class="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">删除</button>
        </div>
      </div>
    </TransitionGroup>

    <div v-else-if="filteredAgents.length === 0" class="text-center py-16">
      <span class="text-5xl block mb-4">🤖</span>
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">暂无智能体</h3>
      <p class="text-sm text-gray-400 mb-6">创建您的第一个 AI 智能体，开启智能化之旅</p>
      <button @click="$emit('create')" class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5">
        <span>+</span> 创建智能体
      </button>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >上一页</button>
      <div class="flex gap-1">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
          :class="
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          "
        >{{ page }}</button>
      </div>
      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >下一页</button>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="showDeleteConfirm = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <div class="text-center">
              <span class="text-4xl block mb-3">⚠️</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">确认删除</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ deleteTargetId ? '确定要删除此智能体吗？' : `确定要删除选中的 ${selectedIds.size} 个智能体吗？` }}
                <br><span class="text-red-500 font-medium">此操作不可撤销！</span>
              </p>
            </div>
            <div class="flex gap-3 mt-6">
              <button @click="showDeleteConfirm = false" class="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">取消</button>
              <button @click="executeDelete" class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">确认删除</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .animate-scale-in,
.modal-leave-to .animate-scale-in {
  transform: scale(0.95);
}
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
