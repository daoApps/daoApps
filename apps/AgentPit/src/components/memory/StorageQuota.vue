<script setup lang="ts">
import { ref, computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import type { StorageStats } from '@/types/memory';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

interface Props {
  stats?: StorageStats;
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => ({
    totalSpace: 10737418240,
    usedSpace: 6442450944,
    categories: {
      documents: 2147483648,
      images: 1610612736,
      videos: 536870912,
      code: 268435456,
      other: 134217728
    },
    largeFiles: []
  })
});

const emit = defineEmits<{
  cleanup: [];
  upgrade: [plan: string];
}>();

const showUpgradeModal = ref(false);
const isCleaningUp = ref(false);
const usagePercentage = computed(() =>
  Math.round((props.stats.usedSpace / props.stats.totalSpace) * 100)
);

const usageLevel = computed(() => {
  if (usagePercentage.value >= 95)
    return { color: '#ef4444', label: '严重', bg: 'bg-red-50 dark:bg-red-900/20' };
  if (usagePercentage.value >= 80)
    return { color: '#f59e0b', label: '警告', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
  return { color: '#10b981', label: '正常', bg: 'bg-green-50 dark:bg-green-900/20' };
});

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const pieChartData = computed(() => [
  { value: props.stats.categories.documents, name: '文档', itemStyle: { color: '#3b82f6' } },
  { value: props.stats.categories.images, name: '图片', itemStyle: { color: '#10b981' } },
  { value: props.stats.categories.videos, name: '视频', itemStyle: { color: '#f59e0b' } },
  { value: props.stats.categories.code, name: '代码', itemStyle: { color: '#8b5cf6' } },
  { value: props.stats.categories.other, name: '其他', itemStyle: { color: '#6b7280' } }
]);

const pieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: {
      color: '#9ca3af'
    }
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: pieChartData.value
    }
  ]
}));

const handleCleanup = async () => {
  isCleaningUp.value = true;

  // 模拟清理过程
  await new Promise((resolve) => setTimeout(resolve, 2000));

  isCleaningUp.value = false;
  emit('cleanup');
};

const circumference = 2 * Math.PI * 54;
const strokeDashoffset = computed(() => {
  return circumference - (circumference * usagePercentage.value) / 100;
});
</script>

<template>
  <div
    class="storage-quota__container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
  >
    <!-- 标题栏 -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            💾 存储配额
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">查看存储使用情况和管理空间</p>
        </div>

        <!-- 预警状态 -->
        <div :class="[usageLevel.bg, 'px-4 py-2 rounded-lg flex items-center gap-2']">
          <span
            class="w-2 h-2 rounded-full animate-pulse"
            :style="{ backgroundColor: usageLevel.color }"
          ></span>
          <span class="text-sm font-medium" :style="{ color: usageLevel.color }">
            {{ usageLevel.label }} · {{ usagePercentage.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 左侧：环形进度条 -->
      <div class="space-y-6">
        <div class="flex items-center justify-center">
          <!-- SVG 环形图 -->
          <div class="relative w-56 h-56">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <!-- 背景圆 -->
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="12"
                class="dark:stroke-gray-700"
              />
              <!-- 进度圆 -->
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                :stroke="usageLevel.color"
                stroke-width="12"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                stroke-linecap="round"
                class="transition-all duration-1000 ease-out"
              />
            </svg>

            <!-- 中心文字 -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-gray-900 dark:text-white"
                >{{ usagePercentage.toFixed(1) }}%</span
              >
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">已使用</span>
            </div>
          </div>
        </div>

        <!-- 存储数据 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatBytes(stats.usedSpace) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已用空间</div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ formatBytes(stats.totalSpace - stats.usedSpace) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">剩余空间</div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3">
          <button
            :disabled="isCleaningUp"
            class="flex-1 px-4 py-2.5 font-medium rounded-lg transition-all"
            :class="
              isCleaningUp
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 border border-orange-300 dark:border-orange-700'
            "
            @click="handleCleanup"
          >
            {{ isCleaningUp ? '🧹 清理中...' : '🧹 一键清理' }}
          </button>

          <button
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
            @click="showUpgradeModal = true"
          >
            ⬆️ 升级配额
          </button>
        </div>
      </div>

      <!-- 右侧：分类饼图 -->
      <div class="space-y-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">📊 存储分类统计</h3>
        <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4" style="height: 320px">
          <VChart ref="chartRef" :option="pieOption" autoresize class="w-full h-full" />
        </div>

        <!-- 分类详情 -->
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(category, key) in stats.categories"
            :key="key"
            class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
          >
            <span
              class="w-3 h-3 rounded-full flex-shrink-0"
              :style="{
                backgroundColor: {
                  documents: '#3b82f6',
                  images: '#10b981',
                  videos: '#f59e0b',
                  code: '#8b5cf6',
                  other: '#6b7280'
                }[key]
              }"
            ></span>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-medium text-gray-900 dark:text-white truncate">
                {{
                  {
                    documents: '📄 文档',
                    images: '🖼️ 图片',
                    videos: '🎬 视频',
                    code: '💻 代码',
                    other: '📦 其他'
                  }[key]
                }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatBytes(category) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 大文件列表 -->
    <div class="px-6 pb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">📁 大文件 TOP 10</h3>
        <span class="text-xs text-gray-500 dark:text-gray-400">按大小排序</span>
      </div>

      <div v-if="stats.largeFiles.length === 0" class="text-center py-8 text-gray-400">
        <p class="text-3xl mb-2">📂</p>
        <p class="text-sm">暂无大文件记录</p>
      </div>

      <div v-else class="space-y-2 max-h-[400px] overflow-y-auto">
        <TransitionGroup name="list" tag="div" class="space-y-2">
          <div
            v-for="(file, index) in stats.largeFiles.slice(0, 10)"
            :key="file.name"
            class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <!-- 排名 -->
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              :class="
                index < 3
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              "
            >
              {{ index + 1 }}
            </div>

            <!-- 文件信息 -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ file.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                修改于 {{ formatTimestamp(file.modifiedAt) }}
              </div>
            </div>

            <!-- 大小 -->
            <div class="text-right flex-shrink-0">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatBytes(file.size) }}
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- 升级配额模态框 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showUpgradeModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          @click="showUpgradeModal = false"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4"
            @click.stop
          >
            <div class="text-center mb-8">
              <div
                class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl"
              >
                ⚡
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">升级存储配额</h3>
              <p class="text-gray-600 dark:text-gray-400">选择适合您的存储方案，获得更多空间</p>
            </div>

            <!-- 套餐选项 -->
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div
                v-for="plan in [
                  {
                    name: '基础版',
                    space: '50 GB',
                    price: '¥29/月',
                    features: ['50GB 存储空间', '基础备份功能', '邮件支持'],
                    popular: false
                  },
                  {
                    name: '专业版',
                    space: '200 GB',
                    price: '¥79/月',
                    features: ['200GB 存储空间', '自动增量备份', '优先技术支持', '高级搜索功能'],
                    popular: true
                  },
                  {
                    name: '企业版',
                    space: '1 TB',
                    price: '¥199/月',
                    features: [
                      '1TB 存储空间',
                      '无限备份历史',
                      '专属客户经理',
                      'API 接口访问',
                      '定制化方案'
                    ],
                    popular: false
                  }
                ]"
                :key="plan.name"
                class="relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
                :class="
                  plan.popular
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                "
                @click="emit('upgrade', plan.name)"
              >
                <div
                  v-if="plan.popular"
                  class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full"
                >
                  推荐
                </div>

                <div class="text-center mb-4">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ plan.name }}
                  </div>
                  <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 my-2">
                    {{ plan.price }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ plan.space }}</div>
                </div>

                <ul class="space-y-2">
                  <li
                    v-for="feature in plan.features"
                    :key="feature"
                    class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span class="text-green-500 mt-0.5">✓</span>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                @click="showUpgradeModal = false"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
