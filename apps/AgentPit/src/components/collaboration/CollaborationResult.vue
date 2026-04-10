<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CollaborationResult as CollabResult } from '../../data/mockCollaboration';

const props = defineProps<{
  result?: CollabResult | null;
  isRunning?: boolean;
}>();

const emit = defineEmits<{
  (e: 'export', format: string): void;
  (e: 'clear'): void;
}>();

const activeTab = ref<'output' | 'history'>('output');
const viewMode = ref<'markdown' | 'json' | 'raw'>('markdown');

// Mock result data for demonstration
const mockResult: CollabResult = {
  id: 'result-1',
  sessionId: 'session-1',
  summary: [
    '# 产品发布会策划方案 - 协作成果',
    '',
    '## 项目概述',
    '',
    '本次协作任务由 **5 个智能体** 共同完成，历时 **2 小时**，成功产出完整的发布会策划方案。',
    '',
    '## 参与智能体',
    '',
    '1. **任务规划师** (🎯) - 项目整体规划与进度管理',
    '2. **内容创作专家** (✍️) - 活动文案与宣传材料撰写',
    '3. **数据研究员** (🔬) - 市场调研与竞品分析',
    '4. **UI/UX 设计师** (🎨) - 视觉设计与用户体验优化',
    '5. **业务分析师** (📊) - 预算编制与 ROI 分析',
    '',
    '## 核心成果',
    '',
    '### 📋 完整策划方案',
    '',
    '- **活动主题**: "智启未来 · 创无止境"',
    '- **时间安排**: 2026年5月15日 14:00-17:00',
    '- **活动场地**: 国际会议中心 A厅（容纳500人）',
    '- **预算总额**: ¥285,000',
    '',
    '### 📊 关键数据',
    '',
    '```json',
    '{',
    '  "参与智能体": 5,',
    '  "总任务数": 12,',
    '  "完成任务数": 10,',
    '  "完成率": "83.3%",',
    '  "平均准确率": "96.8%",',
    '  "总耗时": "2小时15分钟",',
    '  "预算节省": "12%"',
    '}',
    '```',
    '',
    '### 🎯 主要亮点',
    '',
    '1. ✅ 市场调研覆盖 **3 个主要竞争对手**',
    '2. ✅ 策划方案包含 **4 大核心模块**',
    '3. ✅ 预算方案通过 **3 轮优化**，节省成本 12%',
    '4. ✅ 宣传材料支持 **5 种语言版本**',
    '5. ✅ 风险预案涵盖 **8 类常见问题**',
    '',
    '## 下一步建议',
    '',
    '1. 🔄 启动供应商招标流程',
    '2. 👥 组建执行团队并分配职责',
    '3. 📅 制定详细的时间节点表',
    '4. 💰 完善预算审批流程',
    '5. 🚀 开始预热宣传活动',
    '',
    '---',
    '',
    `*生成时间: ${new Date().toLocaleString('zh-CN')}*`
  ].join('\n'),
  agentResults: [
    {
      agentId: 'agent-planner',
      agentName: '任务规划师',
      output: `## 任务分解与项目计划\n\n### 一级任务清单\n1. [x] 市场背景调研\n2. [x] 活动主题创意\n3. [ ] 预算编制（进行中：45%）\n4. [ ] 场地布置方案\n5. [ ] 流程设计\n\n### 时间线规划\n- 第1周：调研与创意阶段\n- 第2周：方案细化与预算\n- 第3周：执行准备\n- 第4周：最终确认与演练`,
      score: 98,
      feedback: '优秀的项目管理能力，任务分解清晰合理',
      timestamp: Date.now() - 7200000
    },
    {
      agentId: 'agent-writer',
      agentName: '内容创作专家',
      output: `## 宣传文案创作\n\n### 主标语\n"智启未来 · 创无止境"\n\n### 辅助文案\n- 引领行业新趋势\n- 见证创新的力量\n- 共创美好明天\n\n### 新闻稿框架\n已完成初稿，包含产品亮点、市场定位、用户价值三大板块。`,
      score: 95,
      feedback: '文案质量高，风格统一，符合品牌调性',
      timestamp: Date.now() - 3600000
    },
    {
      agentId: 'agent-researcher',
      agentName: '数据研究员',
      output: `## 市场调研报告摘要\n\n### 竞品分析\n1. **竞品A**: 已发布新品，定价偏高\n2. **竞品B**: 计划下月发布，需提前应对\n3. **竞品C**: 市场份额稳定，无明显动作\n\n### 建议策略\n- 提前2周启动预热\n- 强调差异化优势\n- 定价策略建议中等偏上`,
      score: 97,
      feedback: '数据分析详实，洞察深刻，建议具有可操作性',
      timestamp: Date.now() - 1800000
    }
  ],
  overallScore: 96,
  exportFormats: ['markdown', 'json', 'pdf', 'docx']
};

const currentResult = computed(() => props.result || mockResult);

const formattedJSON = computed(() => {
  try {
    return JSON.stringify(currentResult.value, null, 2);
  } catch {
    return '{}';
  }
});

const renderMarkdown = (text: string) => {
  // Simple markdown-like rendering
  return text
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm">$1</code>'
    )
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n/g, '<br/>');
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJSON.value);
    alert('已复制到剪贴板！');
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const downloadAsFile = (format: string) => {
  let content = '';
  let mimeType = '';
  let extension = '';

  switch (format) {
    case 'markdown':
      content = currentResult.value.summary;
      mimeType = 'text/markdown';
      extension = 'md';
      break;
    case 'json':
      content = formattedJSON.value;
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'pdf':
      alert('PDF 导出功能需要后端支持');
      return;
    case 'docx':
      alert('DOCX 导出功能需要后端支持');
      return;
    default:
      return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `collaboration-result-${Date.now()}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  emit('export', format);
};

const executionHistory = ref([
  {
    id: 'exec-1',
    timestamp: Date.now() - 7200000,
    action: '启动协作会话',
    status: 'success',
    details: '初始化 5 个智能体'
  },
  {
    id: 'exec-2',
    timestamp: Date.now() - 7000000,
    action: '分配任务',
    status: 'success',
    details: '向 3 个智能体分配初始任务'
  },
  {
    id: 'exec-3',
    timestamp: Date.now() - 6500000,
    action: '执行中',
    status: 'running',
    details: '各智能体正在处理任务...'
  },
  {
    id: 'exec-4',
    timestamp: Date.now() - 3600000,
    action: '消息同步',
    status: 'success',
    details: '收到 12 条通信消息'
  },
  {
    id: 'exec-5',
    timestamp: Date.now() - 1800000,
    action: '结果汇总',
    status: 'success',
    details: '收集所有智能体的输出结果'
  },
  {
    id: 'exec-6',
    timestamp: Date.now(),
    action: '完成',
    status: 'completed',
    details: '协作任务完成，整体评分 96 分'
  }
]);

const formatHistoryTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const historyStatusConfig = {
  success: { color: 'text-green-600 bg-green-50 dark:bg-green-900/20', icon: '✅' },
  running: { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', icon: '🔄' },
  error: { color: 'text-red-600 bg-red-50 dark:bg-red-900/20', icon: '❌' },
  completed: { color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', icon: '🎉' }
};
</script>

<template>
  <div
    class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">协作结果</h2>

        <!-- Score Badge -->
        <div v-if="currentResult" class="flex items-center gap-2">
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-bold',
              currentResult.overallScore >= 90
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : currentResult.overallScore >= 70
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            ]"
          >
            ⭐ {{ currentResult.overallScore }}分
          </span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-2">
        <button
          :class="[
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'output'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          @click="activeTab = 'output'"
        >
          📄 输出结果
        </button>
        <button
          :class="[
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'history'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          @click="activeTab = 'history'"
        >
          📜 执行历史
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="activeTab === 'output'" class="flex-1 overflow-hidden flex flex-col">
      <!-- View Mode Toggle & Actions -->
      <div
        v-if="currentResult"
        class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded p-1">
          <button
            :class="[
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              viewMode === 'markdown'
                ? 'bg-white dark:bg-gray-600 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            @click="viewMode = 'markdown'"
          >
            Markdown
          </button>
          <button
            :class="[
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              viewMode === 'json'
                ? 'bg-white dark:bg-gray-600 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            @click="viewMode = 'json'"
          >
            JSON
          </button>
          <button
            :class="[
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              viewMode === 'raw'
                ? 'bg-white dark:bg-gray-600 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            @click="viewMode = 'raw'"
          >
            原文
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            @click="copyToClipboard"
          >
            📋 复制
          </button>
          <div class="relative group">
            <button
              class="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
            >
              ⬇️ 导出
            </button>
            <div
              class="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
            >
              <button
                v-for="format in currentResult.exportFormats"
                :key="format"
                class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg capitalize"
                @click="downloadAsFile(format)"
              >
                {{ format.toUpperCase() }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Output Content -->
      <div class="flex-1 overflow-auto p-4">
        <!-- Loading State -->
        <div
          v-if="isRunning"
          class="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500"
        >
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-sm font-medium">正在生成协作结果...</p>
          <p class="text-xs mt-2">请稍候，智能体正在协同工作</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!currentResult"
          class="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500"
        >
          <svg
            class="w-16 h-16 mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p class="text-sm font-medium">暂无结果</p>
          <p class="text-xs mt-1">运行协作任务后将在此显示结果</p>
        </div>

        <!-- Markdown View -->
        <div
          v-else-if="viewMode === 'markdown'"
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="renderMarkdown(currentResult.summary)"
        ></div>

        <!-- JSON View -->
        <pre
          v-else-if="viewMode === 'json'"
          class="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto h-full"
        ><code>{{ formattedJSON }}</code></pre>

        <!-- Raw View -->
        <pre
          v-else-if="viewMode === 'raw'"
          class="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto whitespace-pre-wrap"
          >{{ currentResult.summary }}</pre
        >
      </div>

      <!-- Agent Results Summary -->
      <div
        v-if="currentResult && currentResult.agentResults.length > 0"
        class="border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">🤖 各智能体贡献</h3>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div
            v-for="(agentResult, index) in currentResult.agentResults"
            :key="index"
            class="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-sm text-gray-900 dark:text-white">{{
                agentResult.agentName
              }}</span>
              <span
                :class="[
                  'px-2 py-0.5 text-xs font-bold rounded-full',
                  agentResult.score >= 95
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : agentResult.score >= 85
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                ]"
              >
                {{ agentResult.score }}分
              </span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ agentResult.output }}
            </p>
            <p
              v-if="agentResult.feedback"
              class="text-xs text-blue-600 dark:text-blue-400 mt-1 italic"
            >
              💬 {{ agentResult.feedback }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- History Tab -->
    <div v-else class="flex-1 overflow-y-auto p-4">
      <div class="space-y-3">
        <div
          v-for="(entry, index) in executionHistory"
          :key="entry.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <!-- Timeline Line -->
          <div class="flex flex-col items-center">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                (historyStatusConfig as any)[entry.status]?.color || ''
              ]"
            >
              {{ (historyStatusConfig as any)[entry.status]?.icon || '' }}
            </div>
            <div
              v-if="index < executionHistory.length - 1"
              class="w-0.5 h-full bg-gray-200 dark:bg-gray-600 my-1"
            ></div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-sm text-gray-900 dark:text-white">{{
                entry.action
              }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{
                formatHistoryTime(entry.timestamp)
              }}</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ entry.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
