<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Agent } from '../../data/mockCollaboration';
import type { MCPAgentInfo } from '../../services/mcp/types';

const props = defineProps<{
  agent: Agent | MCPAgentInfo | null;
}>();

const emit = defineEmits<{
  (e: 'update:config', config: AgentConfig): void;
}>();

export interface AgentConfig {
  timeout: number;
  retryCount: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  responseStyle: 'formal' | 'friendly' | 'humorous';
  outputDetail: 'concise' | 'normal' | 'detailed';
  enableTools: string[];
  customParams: Record<string, string | number | boolean>;
  maxConcurrentTasks: number;
  enableAutoRetry: boolean;
  priorityWeight: number;
}

const defaultConfig: AgentConfig = {
  timeout: 30000,
  retryCount: 3,
  logLevel: 'info',
  responseStyle: 'formal',
  outputDetail: 'normal',
  enableTools: [],
  customParams: {},
  maxConcurrentTasks: 1,
  enableAutoRetry: true,
  priorityWeight: 5
};

const config = ref<AgentConfig>({ ...defaultConfig });
const savedPresets = ref<{ name: string; config: AgentConfig }[]>([]);
const presetName = ref('');
const showSaveDialog = ref(false);
const validationErrors = ref<Record<string, string>>({});

// Dynamic fields based on agent type
const agentSpecificFields = computed(() => {
  if (!props.agent) return [];

  const fieldMap: Record<
    string,
    {
      key: string;
      label: string;
      type: 'text' | 'number' | 'select';
      options?: string[];
      defaultValue: any;
    }[]
  > = {
    'agent-planner': [
      {
        key: 'planningDepth',
        label: '规划深度',
        type: 'select',
        options: ['shallow', 'medium', 'deep'],
        defaultValue: 'medium'
      },
      {
        key: 'autoDecompose',
        label: '自动分解任务',
        type: 'select',
        options: ['yes', 'no'],
        defaultValue: 'yes'
      }
    ],
    'agent-writer': [
      {
        key: 'writingStyle',
        label: '写作风格',
        type: 'select',
        options: ['professional', 'casual', 'creative'],
        defaultValue: 'professional'
      },
      { key: 'maxWords', label: '最大字数', type: 'number', defaultValue: 2000 },
      {
        key: 'includeSEO',
        label: 'SEO优化',
        type: 'select',
        options: ['yes', 'no'],
        defaultValue: 'yes'
      }
    ],
    'agent-coder': [
      {
        key: 'language',
        label: '首选语言',
        type: 'select',
        options: ['typescript', 'python', 'java', 'go'],
        defaultValue: 'typescript'
      },
      {
        key: 'codeStyle',
        label: '代码风格',
        type: 'select',
        options: ['strict', 'moderate', 'loose'],
        defaultValue: 'moderate'
      },
      {
        key: 'enableTests',
        label: '自动生成测试',
        type: 'select',
        options: ['yes', 'no'],
        defaultValue: 'yes'
      }
    ],
    'agent-researcher': [
      {
        key: 'searchDepth',
        label: '搜索深度',
        type: 'select',
        options: ['quick', 'standard', 'thorough'],
        defaultValue: 'standard'
      },
      { key: 'sourcesCount', label: '来源数量', type: 'number', defaultValue: 10 },
      {
        key: 'verifySources',
        label: '验证来源',
        type: 'select',
        options: ['yes', 'no'],
        defaultValue: 'yes'
      }
    ],
    'agent-designer': [
      {
        key: 'designSystem',
        label: '设计系统',
        type: 'select',
        options: ['material', 'ant-design', 'custom'],
        defaultValue: 'material'
      },
      {
        key: 'responsive',
        label: '响应式设计',
        type: 'select',
        options: ['yes', 'no'],
        defaultValue: 'yes'
      },
      {
        key: 'accessibility',
        label: '无障碍支持',
        type: 'select',
        options: ['wcag-a', 'wcag-aa', 'wcag-aaa'],
        defaultValue: 'wcag-aa'
      }
    ],
    'agent-analyst': [
      {
        key: 'analysisMethod',
        label: '分析方法',
        type: 'select',
        options: ['quantitative', 'qualitative', 'mixed'],
        defaultValue: 'mixed'
      },
      {
        key: 'visualizationType',
        label: '可视化类型',
        type: 'select',
        options: ['charts', 'tables', 'dashboards'],
        defaultValue: 'charts'
      }
    ],
    'agent-translator': [
      {
        key: 'targetLanguage',
        label: '目标语言',
        type: 'select',
        options: ['english', 'japanese', 'korean', 'french', 'german'],
        defaultValue: 'english'
      },
      {
        key: 'preserveFormat',
        label: '保留格式',
        type: 'select',
        options: ['yes', 'no'],
        defaultValue: 'yes'
      },
      { key: 'domainGlossary', label: '领域术语表', type: 'text', defaultValue: '' }
    ],
    'agent-consultant': [
      {
        key: 'consultingFocus',
        label: '咨询重点',
        type: 'select',
        options: ['strategy', 'operations', 'finance', 'marketing'],
        defaultValue: 'strategy'
      },
      {
        key: 'riskTolerance',
        label: '风险容忍度',
        type: 'select',
        options: ['low', 'medium', 'high'],
        defaultValue: 'medium'
      },
      { key: 'industryExpertise', label: '行业专长', type: 'text', defaultValue: '' }
    ]
  };

  return fieldMap[props.agent.id] || [];
});

// Initialize config when agent changes
watch(
  () => props.agent,
  (newAgent) => {
    if (newAgent) {
      config.value = {
        ...defaultConfig,
        responseStyle: 'responseStyle' in newAgent ? newAgent.responseStyle : defaultConfig.responseStyle,
        outputDetail: 'outputDetail' in newAgent ? newAgent.outputDetail : defaultConfig.outputDetail,
        enableTools: 'tools' in newAgent ? [...newAgent.tools] : []
      };

      // Set agent-specific defaults
      agentSpecificFields.value.forEach((field) => {
        config.value.customParams[field.key] = field.defaultValue;
      });
    }
  },
  { immediate: true }
);

const validateField = (field: string, value: any): string | null => {
  switch (field) {
    case 'timeout':
      if (!value || value < 1000) return '超时时间至少为 1000ms';
      if (value > 300000) return '超时时间不能超过 5分钟';
      break;
    case 'retryCount':
      if (value < 0) return '重试次数不能为负数';
      if (value > 10) return '重试次数不能超过 10 次';
      break;
    case 'priorityWeight':
      if (value < 1 || value > 10) return '优先级权重必须在 1-10 之间';
      break;
  }
  return null;
};

const updateConfig = () => {
  // Validate all fields
  validationErrors.value = {};

  const timeoutError = validateField('timeout', config.value.timeout);
  if (timeoutError) validationErrors.value.timeout = timeoutError;

  const retryError = validateField('retryCount', config.value.retryCount);
  if (retryError) validationErrors.value.retryCount = retryError;

  const priorityError = validateField('priorityWeight', config.value.priorityWeight);
  if (priorityError) validationErrors.value.priorityWeight = priorityError;

  if (Object.keys(validationErrors.value).length === 0) {
    emit('update:config', { ...config.value });
  }
};

const savePreset = () => {
  if (!presetName.value.trim()) return;

  savedPresets.value.push({
    name: presetName.value,
    config: { ...config.value }
  });

  localStorage.setItem('agent-config-presets', JSON.stringify(savedPresets.value));
  presetName.value = '';
  showSaveDialog.value = false;
};

const loadPreset = (preset: { name: string; config: AgentConfig }) => {
  config.value = { ...preset.config };
  updateConfig();
};

const deletePreset = (index: number) => {
  savedPresets.value.splice(index, 1);
  localStorage.setItem('agent-config-presets', JSON.stringify(savedPresets.value));
};

// Load presets from localStorage on mount
try {
  const stored = localStorage.getItem('agent-config-presets');
  if (stored) {
    savedPresets.value = JSON.parse(stored);
  }
} catch (e) {
  console.error('Failed to load presets:', e);
}
</script>

<template>
  <div
    class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div v-if="agent" class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">配置面板</h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ agent.name }}</span>
      </div>
      <h2 v-else class="text-lg font-semibold text-gray-900 dark:text-white">配置面板</h2>

      <p v-if="!agent" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        请先选择一个智能体进行配置
      </p>
    </div>

    <!-- Config Form -->
    <div v-if="agent" class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- General Settings -->
      <section>
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
        >
          ⚙️ 通用设置
        </h3>

        <div class="space-y-3">
          <!-- Timeout -->
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              超时时间 (毫秒)
            </label>
            <input
              v-model.number="config.timeout"
              type="number"
              class="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="
                validationErrors.timeout ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              "
              @change="updateConfig"
            />
            <p v-if="validationErrors.timeout" class="mt-1 text-xs text-red-500">
              {{ validationErrors.timeout }}
            </p>
          </div>

          <!-- Retry Count -->
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              重试次数
            </label>
            <input
              v-model.number="config.retryCount"
              type="number"
              min="0"
              max="10"
              class="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="
                validationErrors.retryCount
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              "
              @change="updateConfig"
            />
            <p v-if="validationErrors.retryCount" class="mt-1 text-xs text-red-500">
              {{ validationErrors.retryCount }}
            </p>
          </div>

          <!-- Log Level -->
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              日志级别
            </label>
            <select
              v-model="config.logLevel"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
          </div>

          <!-- Priority Weight -->
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              优先级权重 ({{ config.priorityWeight }})
            </label>
            <input
              v-model.number="config.priorityWeight"
              type="range"
              min="1"
              max="10"
              class="w-full"
              @input="updateConfig"
            />
            <p v-if="validationErrors.priorityWeight" class="mt-1 text-xs text-red-500">
              {{ validationErrors.priorityWeight }}
            </p>
          </div>
        </div>
      </section>

      <!-- Response Settings -->
      <section>
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
        >
          💬 响应设置
        </h3>

        <div class="space-y-3">
          <!-- Response Style -->
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              响应风格
            </label>
            <select
              v-model="config.responseStyle"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            >
              <option value="formal">正式</option>
              <option value="friendly">友好</option>
              <option value="humorous">幽默</option>
            </select>
          </div>

          <!-- Output Detail -->
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              输出详细程度
            </label>
            <select
              v-model="config.outputDetail"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            >
              <option value="concise">简洁</option>
              <option value="normal">正常</option>
              <option value="detailed">详细</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Tools Toggle -->
      <section>
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
        >
          🔧 工具启用
        </h3>

        <div class="space-y-2">
          <template v-if="agent && 'tools' in agent">
            <label
              v-for="tool in agent.tools"
              :key="tool"
              class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                v-model="config.enableTools"
                type="checkbox"
                :value="tool"
                class="rounded text-blue-500"
                @change="updateConfig"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">{{ tool }}</span>
            </label>
          </template>
          <p v-else class="text-xs text-gray-500 dark:text-gray-400">该智能体没有可配置的工具</p>
        </div>
      </section>

      <!-- Agent-Specific Fields -->
      <section v-if="agentSpecificFields.length > 0">
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
        >
          🎯 特殊配置
        </h3>

        <div class="space-y-3">
          <div v-for="field in agentSpecificFields" :key="field.key">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ field.label }}
            </label>

            <input
              v-if="field.type === 'text'"
              v-model="config.customParams[field.key]"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            />

            <input
              v-else-if="field.type === 'number'"
              v-model.number="config.customParams[field.key]"
              type="number"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            />

            <select
              v-else-if="field.type === 'select'"
              v-model="config.customParams[field.key]"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            >
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Advanced Options -->
      <section>
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
        >
          🔬 高级选项
        </h3>

        <div class="space-y-2">
          <label
            class="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span class="text-sm text-gray-700 dark:text-gray-300">自动重试</span>
            <input
              v-model="config.enableAutoRetry"
              type="checkbox"
              class="rounded text-blue-500"
              @change="updateConfig"
            />
          </label>

          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大并发任务数
            </label>
            <input
              v-model.number="config.maxConcurrentTasks"
              type="number"
              min="1"
              max="5"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="updateConfig"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Presets Section -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">💾 配置预设</h3>
        <button
          class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
          @click="showSaveDialog = !showSaveDialog"
        >
          + 保存当前配置
        </button>
      </div>

      <!-- Save Dialog -->
      <div v-if="showSaveDialog" class="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <input
          v-model="presetName"
          type="text"
          placeholder="输入预设名称..."
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 mb-2"
          @keyup.enter="savePreset"
        />
        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
            @click="savePreset"
          >
            保存
          </button>
          <button
            class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
            @click="showSaveDialog = false"
          >
            取消
          </button>
        </div>
      </div>

      <!-- Preset List -->
      <div v-if="savedPresets.length > 0" class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="(preset, index) in savedPresets"
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded group"
        >
          <button
            class="flex-1 text-left text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            @click="loadPreset(preset)"
          >
            📋 {{ preset.name }}
          </button>
          <button
            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
            @click="deletePreset(index)"
          >
            ✕
          </button>
        </div>
      </div>

      <p v-else class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">暂无保存的预设</p>
    </div>
  </div>
</template>
