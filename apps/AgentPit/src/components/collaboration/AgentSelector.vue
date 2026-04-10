<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Agent } from '../../data/mockCollaboration';
import { presetAgents } from '../../data/mockCollaboration';
import AgentStatusCard from './AgentStatusCard.vue';

const props = withDefaults(
  defineProps<{
    mode?: 'single' | 'multiple';
    preselected?: string[];
  }>(),
  {
    mode: 'multiple',
    preselected: () => []
  }
);

const emit = defineEmits<{
  (e: 'update:selected', agents: Agent[]): void;
  (e: 'configure', agent: Agent): void;
}>();

const searchQuery = ref('');
const selectedAgents = ref<Agent[]>([]);
const draggedAgent = ref<Agent | null>(null);
const showDetails = ref(true);

const filteredAgents = computed(() => {
  if (!searchQuery.value.trim()) return presetAgents;

  const query = searchQuery.value.toLowerCase();
  return presetAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(query) ||
      agent.role.toLowerCase().includes(query) ||
      agent.specialty.some((s) => s.toLowerCase().includes(query)) ||
      agent.skills.some((s) => s.toLowerCase().includes(query))
  );
});

const selectedCount = computed(() => selectedAgents.value.length);

const toggleAgentSelection = (agent: Agent) => {
  if (props.mode === 'single') {
    selectedAgents.value = [agent];
    emit('update:selected', selectedAgents.value);
    return;
  }

  const index = selectedAgents.value.findIndex((a) => a.id === agent.id);
  if (index > -1) {
    selectedAgents.value.splice(index, 1);
  } else {
    selectedAgents.value.push(agent);
  }
  emit('update:selected', [...selectedAgents.value]);
};

const isSelected = (agentId: string) => {
  return selectedAgents.value.some((a) => a.id === agentId);
};

const selectAllOnline = () => {
  const onlineAgents = presetAgents.filter((a) => a.status === 'online' || a.status === 'idle');
  selectedAgents.value = onlineAgents;
  emit('update:selected', [...selectedAgents.value]);
};

const clearSelection = () => {
  selectedAgents.value = [];
  emit('update:selected', []);
};

// Drag and Drop handlers
const onDragStart = (event: DragEvent, agent: Agent) => {
  draggedAgent.value = agent;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', agent.id);
  }
  const target = event.target as HTMLElement;
  target.classList.add('opacity-50');
};

const onDragEnd = (event: DragEvent) => {
  draggedAgent.value = null;
  const target = event.target as HTMLElement;
  target.classList.remove('opacity-50');
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDrop = (event: DragEvent, targetAgent: Agent) => {
  event.preventDefault();
  if (!draggedAgent.value || draggedAgent.value.id === targetAgent.id) return;

  // Reorder agents in selection
  const draggedIndex = selectedAgents.value.findIndex((a) => a.id === draggedAgent.value!.id);
  const targetIndex = selectedAgents.value.findIndex((a) => a.id === targetAgent.id);

  if (draggedIndex > -1 && targetIndex > -1) {
    const newSelected = [...selectedAgents.value];
    const [removed] = newSelected.splice(draggedIndex, 1);
    newSelected.splice(targetIndex, 0, removed);
    selectedAgents.value = newSelected;
    emit('update:selected', [...selectedAgents.value]);
  }
};

// Initialize with preselected agents
if (props.preselected.length > 0) {
  selectedAgents.value = presetAgents.filter((a) => props.preselected.includes(a.id));
}
</script>

<template>
  <div
    class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">智能体选择器</h2>

      <!-- Search -->
      <div class="relative mb-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索智能体..."
          class="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
            @click="selectAllOnline"
          >
            ✓ 全选在线
          </button>
          <button
            class="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            @click="clearSelection"
          >
            ✕ 清空
          </button>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          已选 {{ selectedCount }}/{{ presetAgents.length }}
        </span>
      </div>
    </div>

    <!-- Agent List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div
        v-for="agent in filteredAgents"
        :key="agent.id"
        :draggable="true"
        @dragstart="(e: DragEvent) => onDragStart(e, agent)"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @drop="(e: DragEvent) => onDrop(e, agent)"
      >
        <AgentStatusCard
          :agent="agent"
          :is-selected="isSelected(agent.id)"
          :show-details="showDetails"
          @select="toggleAgentSelection"
          @configure="$emit('configure', $event)"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredAgents.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <svg
          class="mx-auto w-12 h-12 mb-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        <p class="text-sm">未找到匹配的智能体</p>
      </div>
    </div>

    <!-- Footer Info -->
    <div
      class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg"
    >
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>💡 提示：拖拽卡片可调整优先级</span>
        <label class="flex items-center gap-1 cursor-pointer">
          <input v-model="showDetails" type="checkbox" class="rounded" />
          <span>显示详情</span>
        </label>
      </div>
    </div>
  </div>
</template>
