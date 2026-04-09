<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, Agent } from '../../data/mockCollaboration'
import { sampleTasks, presetAgents } from '../../data/mockCollaboration'

const props = defineProps<{
  agents?: Agent[]
}>()

const emit = defineEmits<{
  (e: 'taskUpdate', tasks: Task[]): void
  (e: 'taskSelect', task: Task): void
  (e: 'assignTask', taskId: string, agentId: string): void
}>()

const viewMode = ref<'kanban' | 'list'>('kanban')
const tasks = ref<Task[]>([...sampleTasks])
const draggedTask = ref<Task | null>(null)
const selectedTasks = ref<Set<string>>(new Set())
const showDependencies = ref(false)
const filterPriority = ref<string>('all')
const searchQuery = ref('')

// Kanban columns
const columns = [
  { id: 'pending', title: '待处理', color: 'gray', icon: '📋' },
  { id: 'in_progress', title: '进行中', color: 'blue', icon: '🔄' },
  { id: 'completed', title: '已完成', color: 'green', icon: '✅' }
]

const tasksByStatus = computed(() => {
  return {
    pending: filteredTasks.value.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.value.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.value.filter(t => t.status === 'completed')
  }
})

const filteredTasks = computed(() => {
  let result = [...tasks.value]

  // Filter by priority
  if (filterPriority.value !== 'all') {
    result = result.filter(t => t.priority === filterPriority.value)
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  return result
})

const getAgentName = (agentId?: string) => {
  if (!agentId) return '未分配'
  const agent = presetAgents.find(a => a.id === agentId)
  return agent ? agent.name : '未知智能体'
}

const getAgentAvatar = (agentId?: string) => {
  if (!agentId) return '❓'
  const agent = presetAgents.find(a => a.id === agentId)
  return agent ? agent.avatar : '❓'
}

const priorityConfig = computed(() => ({
  urgent: { color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', label: '紧急' },
  high: { color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800', label: '高' },
  medium: { color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', label: '中' },
  low: { color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', label: '低' }
}))

const onDragStart = (event: DragEvent, task: Task) => {
  draggedTask.value = task
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.id)
  }
  const target = event.target as HTMLElement
  target.classList.add('opacity-50')
}

const onDragEnd = (event: DragEvent) => {
  draggedTask.value = null
  const target = event.target as HTMLElement
  if (target) target.classList.remove('opacity-50')
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent, newStatus: string) => {
  event.preventDefault()
  if (!draggedTask.value) return

  const taskIndex = tasks.value.findIndex(t => t.id === draggedTask.value!.id)
  if (taskIndex > -1) {
    const updatedTasks = [...tasks.value]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      status: newStatus as Task['status'],
      ...(newStatus === 'completed' ? { endTime: Date.now(), progress: 100 } : {}),
      ...(newStatus === 'in_progress' && !updatedTasks[taskIndex].startTime ? { startTime: Date.now() } : {})
    }
    tasks.value = updatedTasks
    emit('taskUpdate', updatedTasks)
  }
}

const toggleTaskSelection = (taskId: string) => {
  if (selectedTasks.value.has(taskId)) {
    selectedTasks.value.delete(taskId)
  } else {
    selectedTasks.value.add(taskId)
  }
  selectedTasks.value = new Set(selectedTasks.value)
}

const batchUpdateStatus = (newStatus: string) => {
  if (selectedTasks.value.size === 0) return

  const updatedTasks = tasks.value.map(task => {
    if (selectedTasks.value.has(task.id)) {
      return {
        ...task,
        status: newStatus as Task['status'],
        ...(newStatus === 'completed' ? { endTime: Date.now(), progress: 100 } : {}),
        ...(newStatus === 'in_progress' && !task.startTime ? { startTime: Date.now() } : {})
      }
    }
    return task
  })

  tasks.value = updatedTasks
  emit('taskUpdate', updatedTasks)
  selectedTasks.value.clear()
}

const addNewTask = () => {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: `新任务 ${tasks.value.length + 1}`,
    description: '点击编辑任务描述',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    startTime: undefined,
    endTime: undefined,
    estimatedTime: 3600000
  }

  tasks.value.push(newTask)
  emit('taskUpdate', tasks.value)
}

const deleteTask = (taskId: string) => {
  tasks.value = tasks.value.filter(t => t.id !== taskId)
  emit('taskUpdate', tasks.value)
}

const deleteSelectedTasks = () => {
  if (selectedTasks.value.size === 0) return

  if (confirm(`确定要删除选中的 ${selectedTasks.value.size} 个任务吗？`)) {
    tasks.value = tasks.value.filter(t => !selectedTasks.value.has(t.id))
    emit('taskUpdate', tasks.value)
    selectedTasks.value.clear()
  }
}

const stats = computed(() => ({
  total: tasks.value.length,
  pending: tasks.value.filter(t => t.status === 'pending').length,
  inProgress: tasks.value.filter(t => t.status === 'in_progress').length,
  completed: tasks.value.filter(t => t.status === 'completed').length,
  avgProgress: Math.round(tasks.value.reduce((acc, t) => acc + t.progress, 0) / tasks.value.length || 0)
}))
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">任务分配器</h2>
        <div class="flex items-center gap-2">
          <!-- View Mode Toggle -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="viewMode = 'kanban'"
              :class="[
                'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              📋 看板
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              📝 列表
            </button>
          </div>

          <!-- Actions -->
          <button
            @click="addNewTask"
            class="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            + 新建任务
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex gap-2 mb-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="filterPriority"
          class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">所有优先级</option>
          <option value="urgent">紧急</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <!-- Stats Bar -->
      <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 px-2 py-1.5 bg-gray-50 dark:bg-gray-750 rounded">
        <span>总计 {{ stats.total }} 个任务</span>
        <span class="flex items-center gap-3">
          <span>待处理: <strong>{{ stats.pending }}</strong></span>
          <span>进行中: <strong>{{ stats.inProgress }}</strong></span>
          <span>已完成: <strong>{{ stats.completed }}</strong></span>
          <span>平均进度: <strong>{{ stats.avgProgress }}%</strong></span>
        </span>
      </div>
    </div>

    <!-- Batch Actions -->
    <div v-if="selectedTasks.size > 0" class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700 dark:text-blue-300">
          已选中 {{ selectedTasks.size }} 个任务
        </span>
        <div class="flex items-center gap-2">
          <button
            @click="batchUpdateStatus('in_progress')"
            class="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded transition-colors"
          >
            开始执行
          </button>
          <button
            @click="batchUpdateStatus('completed')"
            class="px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 rounded transition-colors"
          >
            标记完成
          </button>
          <button
            @click="deleteSelectedTasks"
            class="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded transition-colors"
          >
            删除选中
          </button>
          <button
            @click="selectedTasks.clear()"
            class="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            取消选择
          </button>
        </div>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="flex-1 overflow-x-auto p-4">
      <div class="flex gap-4 h-full min-w-max">
        <div
          v-for="column in columns"
          :key="column.id"
          class="flex-shrink-0 w-80 flex flex-col bg-gray-50 dark:bg-gray-750 rounded-lg p-3"
          @dragover="onDragOver"
          @drop="(e: DragEvent) => onDrop(e, column.id)"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-2">
              <span>{{ column.icon }}</span>
              <h3 class="font-semibold text-sm text-gray-900 dark:text-white">{{ column.title }}</h3>
              <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                {{ (tasksByStatus as any)[column.id]?.length || 0 }}
              </span>
            </div>
          </div>

          <!-- Tasks List -->
          <div class="flex-1 overflow-y-auto space-y-2 min-h-[200px]">
            <div
              v-for="task in (tasksByStatus as any)[column.id]"
              :key="task.id"
              :draggable="true"
              @dragstart="(e: DragEvent) => onDragStart(e, task)"
              @dragend="onDragEnd"
              class="group relative p-3 bg-white dark:bg-gray-700 rounded-lg border shadow-sm cursor-move hover:shadow-md transition-all"
              :class="[
                selectedTasks.has(task.id)
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500',
                (priorityConfig as any)[task.priority]?.color || ''
              ]"
            >
              <!-- Selection Checkbox -->
              <input
                type="checkbox"
                :checked="selectedTasks.has(task.id)"
                @change="toggleTaskSelection(task.id)"
                class="absolute top-3 left-3 rounded text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              />

              <!-- Priority Badge -->
              <span class="inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 ml-6">
                {{ (priorityConfig as any)[task.priority]?.label || '' }}
              </span>

              <!-- Title -->
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1 ml-6">{{ task.title }}</h4>

              <!-- Description -->
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 ml-6">{{ task.description }}</p>

              <!-- Progress Bar -->
              <div v-if="task.status === 'in_progress'" class="mb-3 ml-6">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500 dark:text-gray-400">进度</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ task.progress }}%</span>
                </div>
                <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-300"
                    :style="{ width: `${task.progress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600 ml-6">
                <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ getAgentAvatar(task.assignedAgentId) }}</span>
                  <span>{{ getAgentName(task.assignedAgentId) }}</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="$emit('taskSelect', task)"
                    class="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="查看详情"
                  >
                    👁️
                  </button>
                  <button
                    @click="deleteTask(task.id)"
                    class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="删除任务"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Dependencies Indicator -->
              <div v-if="showDependencies && task.dependencies && task.dependencies.length > 0" class="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-600 ml-6">
                <div class="text-xs text-purple-600 dark:text-purple-400">
                  🔗 依赖: {{ task.dependencies.length }} 个任务
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="((tasksByStatus as any)[column.id]?.length || 0) === 0" class="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500">
              <span class="text-3xl mb-2">{{ column.icon }}</span>
              <p class="text-xs">暂无任务</p>
              <p class="text-xs mt-1">拖拽任务到此处</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="flex-1 overflow-auto p-4">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-750 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input type="checkbox" @change="
                selectedTasks = new Set(selectedTasks.size === filteredTasks.length ? [] : filteredTasks.map(t => t.id))
              " class="rounded" />
            </th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">标题</th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">状态</th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">优先级</th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">负责人</th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">进度</th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="task in filteredTasks"
            :key="task.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-750"
            :class="{ 'bg-blue-50 dark:bg-blue-900/10': selectedTasks.has(task.id) }"
          >
            <td class="px-3 py-2">
              <input
                type="checkbox"
                :checked="selectedTasks.has(task.id)"
                @change="toggleTaskSelection(task.id)"
                class="rounded"
              />
            </td>
            <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ task.title }}</td>
            <td class="px-3 py-2">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                task.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                task.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
              ]">
                {{ task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待处理' }}
              </span>
            </td>
            <td class="px-3 py-2">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded',
                priorityConfig[task.priority].color
              ]">
                {{ priorityConfig[task.priority].label }}
              </span>
            </td>
            <td class="px-3 py-2 text-gray-600 dark:text-gray-400">
              {{ getAgentAvatar(task.assignedAgentId) }} {{ getAgentName(task.assignedAgentId) }}
            </td>
            <td class="px-3 py-2">
              <div class="w-24">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span>{{ task.progress }}%</span>
                </div>
                <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-blue-500 rounded-full"
                    :style="{ width: `${task.progress}%` }"
                  ></div>
                </div>
              </div>
            </td>
            <td class="px-3 py-2">
              <div class="flex items-center gap-1">
                <button
                  @click="$emit('taskSelect', task)"
                  class="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                >
                  👁️
                </button>
                <button
                  @click="deleteTask(task.id)"
                  class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer Actions -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-400">
        <input type="checkbox" v-model="showDependencies" class="rounded" />
        <span>显示依赖关系</span>
      </label>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        💡 拖拽任务卡片可更改状态
      </span>
    </div>
  </div>
</template>
