<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMultiAgentCollaboration } from '../../composables/useMultiAgentCollaboration';
import type { Agent, Task, Message } from '../../data/mockCollaboration';
import type { MCPAgentInfo } from '../../services/mcp/types';
import AgentSelector from './AgentSelector.vue';
import AgentConfigPanel from './AgentConfigPanel.vue';
import TaskDistributor from './TaskDistributor.vue';
import CommunicationPanel from './CommunicationPanel.vue';
import CollaborationResult from './CollaborationResult.vue';

const deepResearchBaseUrl = import.meta.env.VITE_DEEPRESEARCH_API_URL || 'http://localhost:8000/api/v1';
const deepResearchApiKey = import.meta.env.VITE_DEEPRESEARCH_API_KEY;

const {
  agents,
  currentSessionId,
  sessionStatus,
  progress,
  tasks,
  messages,
  result,
  error,
  isLoading,
  isConnected,
  hasActiveSession,
  canCancel,
  loadAgents,
  createCollaboration,
  sendMessage,
  cancel,
  reset,
} = useMultiAgentCollaboration({
  baseURL: `${deepResearchBaseUrl}`,
  apiKey: deepResearchApiKey,
});

const selectedAgents = ref<MCPAgentInfo[]>([]);
const selectedAgentForConfig = ref<MCPAgentInfo | null>(null);
const activeRightPanel = ref<'config' | 'result'>('config');
const showShortcuts = ref(false);

const isRunning = computed(() => {
  return sessionStatus.value === 'running';
});

const currentSession = computed(() => currentSessionId.value);

onMounted(async () => {
  try {
    await loadAgents();
  } catch (e) {
    console.error('Failed to load agents from MCP:', e);
  }
});

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + Enter: Run collaboration
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    toggleRun();
  }

  // Ctrl/Cmd + S: Stop
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    stopCollaboration();
  }

  // ?: Show shortcuts
  const target = event.target as HTMLElement;
  if (event.key === '?' && !target?.closest('input, textarea')) {
    showShortcuts.value = !showShortcuts.value;
  }

  // Escape: Close modals
  if (event.key === 'Escape') {
    showShortcuts.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// Collaboration control functions
const toggleRun = () => {
  if (isRunning.value) {
    stopCollaboration();
  } else {
    startCollaboration();
  }
};

const startCollaboration = async () => {
  if (selectedAgents.value.length < 2) {
    alert('请至少选择 2 个智能体进行协作');
    return;
  }

  try {
    const title = '多智能体协作任务';
    await createCollaboration({
      title,
      agent_ids: selectedAgents.value.map(a => a.id),
    });
    activeRightPanel.value = 'result';
  } catch (e) {
    console.error('Failed to start collaboration:', e);
    alert(`启动协作失败: ${e instanceof Error ? e.message : String(e)}`);
  }
};

const stopCollaboration = async () => {
  if (!canCancel.value) {
    return;
  }
  try {
    await cancel();
    alert('协作已取消');
  } catch (e) {
    console.error('Failed to cancel collaboration:', e);
    alert(`取消失败: ${e instanceof Error ? e.message : String(e)}`);
  }
};

const resetWorkspace = () => {
  if (confirm('确定要重置工作台吗？这将清除所有当前配置和选择。')) {
    reset();
    selectedAgents.value = [];
    selectedAgentForConfig.value = null;
    activeRightPanel.value = 'config';
  }
};

// Event handlers
const onAgentsSelected = (agents: MCPAgentInfo[]) => {
  selectedAgents.value = agents;
};

const onConfigureAgent = (agent: MCPAgentInfo) => {
  selectedAgentForConfig.value = agent;
  activeRightPanel.value = 'config';
};

const onTaskUpdate = (updatedTasks: Task[]) => {
  console.log('Tasks updated:', updatedTasks);
};

const onTaskSelect = (task: Task) => {
  console.log('Task selected:', task);
};

const onSendMessage = (message: {
  fromAgentId: string;
  fromAgentName: string;
  toAgentId?: string;
  toAgentName?: string;
  content: string;
}) => {
  if (!currentSessionId.value) {
    console.warn('No active session, message not sent');
    return;
  }
  console.log('Message sent:', message);
  // Message will be handled by MCP and broadcast via SSE
};

// Status bar info
const statusInfo = computed(() => ({
  status: sessionStatus.value || 'idle',
  label: getStatusLabel(sessionStatus.value),
  agentsCount: selectedAgents.value.length,
  sessionTime: currentSessionId.value
    ? formatDuration(Date.now() - parseInt(currentSessionId.value.split('-')[1]!))
    : '00:00:00'
}));

const getStatusLabel = (status: string | null): string => {
  const labels: Record<string, string> = {
    pending: '等待中',
    running: '运行中',
    completed: '已完成',
    failed: '失败',
    cancelled: '已取消',
    idle: '就绪',
  };
  return labels[status || 'idle'] || '就绪';
};

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">🤝 多智能体协作工作台</h1>
          <span
            v-if="currentSession"
            class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
          >
            会话: {{ currentSession.slice(-8) }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- New Session -->
          <button
            :disabled="isRunning"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
            @click="resetWorkspace"
          >
            🔄 新建会话
          </button>

          <!-- Run/Stop Button -->
          <button
            :class="[
              'px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2',
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-green-500 hover:bg-green-600 text-white'
            ]"
            @click="toggleRun"
          >
            {{ isRunning ? '⏹️ 停止' : '▶️ 运行' }}
            <span class="text-xs opacity-75">(Ctrl+Enter)</span>
          </button>

          <!-- Settings -->
          <button
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
            @click="showShortcuts = !showShortcuts"
          >
            ⌨️ 快捷键 (?)
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area - Three Column Layout -->
    <div class="flex-1 overflow-hidden flex">
      <!-- Left Panel: Agent Selector -->
      <div
        class="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
      >
        <AgentSelector
          mode="multiple"
          @update:selected="onAgentsSelected"
          @configure="onConfigureAgent"
        />
      </div>

      <!-- Center Panel: Task Distributor & Communication -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Tabs for Center Panel -->
        <div
          class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center gap-1"
        >
          <button
            class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
          >
            📋 任务分配器
          </button>
        </div>

        <!-- Task Distributor -->
        <div class="flex-1 overflow-hidden">
          <TaskDistributor
            :agents="selectedAgents"
            :tasks="tasks"
            @task-update="onTaskUpdate"
            @task-select="onTaskSelect"
          />
        </div>

        <!-- Communication Panel (Bottom Section) -->
        <div class="h-80 border-t border-gray-200 dark:border-gray-700">
          <CommunicationPanel
            :session-id="currentSessionId"
            :messages="messages"
            :available-agents="selectedAgents"
            @send-message="onSendMessage"
          />
        </div>
      </div>

      <!-- Right Panel: Config or Results -->
      <div
        class="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex flex-col"
      >
        <!-- Panel Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-4 flex items-center gap-1">
          <button
            :class="[
              'px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors',
              activeRightPanel === 'config'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            @click="activeRightPanel = 'config'"
          >
            ⚙️ 配置面板
          </button>
          <button
            :class="[
              'px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors',
              activeRightPanel === 'result'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            @click="activeRightPanel = 'result'"
          >
            📊 协作结果
          </button>
        </div>

        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <AgentConfigPanel v-if="activeRightPanel === 'config'" :agent="selectedAgentForConfig" />
          <CollaborationResult v-else-if="activeRightPanel === 'result'" :is-running="isRunning" />
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div
      class="bg-gray-800 dark:bg-gray-950 text-white px-4 py-2 flex items-center justify-between text-xs"
    >
      <div class="flex items-center gap-4">
        <span
          :class="[
            'flex items-center gap-1.5',
            statusInfo.status === 'running' ? 'text-green-400' : 'text-gray-400'
          ]"
        >
          <span :class="statusInfo.status === 'running' ? 'animate-pulse' : ''">●</span>
          {{ statusInfo.label }}
        </span>
        <span class="text-gray-400">|</span>
        <span
          >🤖 已选智能体: <strong>{{ statusInfo.agentsCount }}</strong></span
        >
        <span class="text-gray-400">|</span>
        <span v-if="currentSession"
          >⏱️ 运行时间: <strong>{{ statusInfo.sessionTime }}</strong></span
        >
      </div>

      <div class="flex items-center gap-4 text-gray-400">
        <span>💡 按 ? 查看快捷键</span>
        <span>|</span>
        <span>多智能体协作系统 v1.0</span>
      </div>
    </div>

    <!-- Shortcuts Modal -->
    <div
      v-if="showShortcuts"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
      @click.self="showShortcuts = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
          @click="showShortcuts = false"
        >
          ✕
        </button>

        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">⌨️ 键盘快捷键</h2>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <span class="font-medium text-gray-900 dark:text-white">运行/停止协作</span>
            <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono"
              >Ctrl + Enter</kbd
            >
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <span class="font-medium text-gray-900 dark:text-white">停止协作</span>
            <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono"
              >Ctrl + S</kbd
            >
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <span class="font-medium text-gray-900 dark:text-white">显示/隐藏快捷键</span>
            <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono">?</kbd>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <span class="font-medium text-gray-900 dark:text-white">关闭弹窗</span>
            <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono">Esc</kbd>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            💡 提示：拖拽任务卡片可更改状态，拖拽智能体卡片可调整优先级顺序
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
