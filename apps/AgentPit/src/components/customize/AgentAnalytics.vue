<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent
} from 'echarts/components';
import { analyticsData } from '../../data/mockCustomize';

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent
]);

const data = ref(analyticsData);
const trendRange = ref<'week' | 'month' | 'quarter'>('week');
const chartRefs = {
  trend: ref<InstanceType<typeof VChart> | null>(null),
  source: ref<InstanceType<typeof VChart> | null>(null),
  questions: ref<InstanceType<typeof VChart> | null>(null),
  revenue: ref<InstanceType<typeof VChart> | null>(null)
};

const kpiCards = [
  {
    key: 'todayCalls',
    label: '今日调用量',
    value: () => data.value.overview.todayCalls,
    suffix: '',
    change: data.value.overview.callsGrowth,
    icon: '📞',
    color: 'from-blue-500 to-blue-600',
    detail: `本周 ${data.value.overview.weekCalls.toLocaleString()} · 本月 ${data.value.overview.monthCalls.toLocaleString()}`
  },
  {
    key: 'activeUsers',
    label: '活跃用户数',
    value: () => data.value.overview.activeUsers,
    suffix: '',
    change: 8.3,
    icon: '👥',
    color: 'from-green-500 to-emerald-600',
    detail: '较上周增长 8.3%'
  },
  {
    key: 'avgResponseTime',
    label: '平均响应时间',
    value: () => data.value.overview.avgResponseTime,
    suffix: 'ms',
    change: -5.2,
    icon: '⚡',
    color: 'from-purple-500 to-violet-600',
    detail: '响应速度提升 5.2%'
  },
  {
    key: 'satisfactionScore',
    label: '用户满意度',
    value: () => data.value.overview.satisfactionScore,
    suffix: '/5',
    change: 0.3,
    icon: '⭐',
    color: 'from-amber-500 to-orange-500',
    detail: '基于 1,247 条评价'
  }
];

const getTrendData = () => {
  interface TrendData {
    date: string;
    value: number;
  }
  const ranges: Record<string, TrendData[]> = {
    week: data.value.callTrend,
    month: [
      ...data.value.callTrend,
      ...data.value.callTrend.map((d) => ({
        date: d.date.replace('04-', '03-'),
        value: Math.floor(d.value * 0.85)
      }))
    ].slice(0, 14),
    quarter: Array.from({ length: 12 }, (_, i) => ({
      date: `${((i % 3) + 1).toString().padStart(2, '0')}-${(((i * 7 + 5) % 28) + 1).toString().padStart(2, '0')}`,
      value: Math.floor(Math.random() * 800 + 700 + i * 50)
    }))
  };
  return ranges[trendRange.value] || data.value.callTrend;
};

const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#eee',
    textStyle: { color: '#333', fontSize: 12 }
  },
  grid: { top: 30, right: 20, bottom: 25, left: 45 },
  xAxis: {
    type: 'category',
    data: getTrendData().map((d) => d.date),
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#9ca3af', fontSize: 11 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLabel: { color: '#9ca3af', fontSize: 11 }
  },
  series: [
    {
      type: 'line',
      data: getTrendData().map((d) => d.value),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3, color: '#3B82F6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59,130,246,0.25)' },
            { offset: 1, color: 'rgba(59,130,246,0.02)' }
          ]
        }
      },
      itemStyle: { color: '#3B82F6', borderColor: '#fff', borderWidth: 2 }
    }
  ]
}));

const sourceOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: { fontSize: 12, color: '#6b7280' }
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: data.value.userSource.map((s) => ({ name: s.name, value: s.value })),
      color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    }
  ]
}));

const questionsOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 60, bottom: 5, left: 100 },
  xAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLabel: { color: '#9ca3af', fontSize: 10 }
  },
  yAxis: {
    type: 'category',
    data: data.value.topQuestions.map((q) => q.question),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#4b5563', fontSize: 11, width: 120, overflow: 'truncate', ellipsis: '...' }
  },
  series: [
    {
      type: 'bar',
      data: data.value.topQuestions.map((q) => q.count),
      barWidth: 16,
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#60A5FA' },
            { offset: 1, color: '#3B82F6' }
          ]
        }
      }
    }
  ]
}));

const revenueOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { top: 20, right: 20, bottom: 25, left: 50 },
  xAxis: {
    type: 'category',
    data: data.value.revenueTrend.map((d) => d.date),
    axisLabel: { color: '#9ca3af', fontSize: 11 }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#9ca3af',
      fontSize: 11,
      formatter: (v: number) => `¥${(v / 1000).toFixed(1)}k`
    }
  },
  series: [
    {
      type: 'line',
      data: data.value.revenueTrend.map((d) => d.value),
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16,185,129,0.3)' },
            { offset: 1, color: 'rgba(16,185,129,0.02)' }
          ]
        }
      },
      lineStyle: { width: 2, color: '#10B981' },
      itemStyle: { color: '#10B981' }
    }
  ]
}));

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => {
    const handleResize = () => {
      Object.values(chartRefs).forEach((ref) => {
        if (ref.value?.resize) ref.value.resize();
      });
    };
    window.addEventListener('resize', handleResize);
    resizeObserver = new ResizeObserver(handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {});
  resizeObserver?.disconnect();
});

watch(trendRange, () => nextTick(() => chartRefs.trend.value?.resize()));

const exportReport = (format: 'csv' | 'excel') => {
  alert(`正在导出${format.toUpperCase()}格式报表...\n（模拟功能）`);
};
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.key"
        class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-2xl">{{ kpi.icon }}</span>
          <span
            class="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"
            :class="
              kpi.change >= 0
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            "
          >
            {{ kpi.change >= 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ kpi.value().toLocaleString() }}{{ kpi.suffix }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ kpi.label }}</p>
        <p class="text-[10px] text-gray-400 mt-1.5">{{ kpi.detail }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800 dark:text-gray-200">调用量趋势</h3>
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              v-for="(label, val) in { week: '7天', month: '30天', quarter: '90天' }"
              :key="val"
              class="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
              :class="
                trendRange === val
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700'
              "
              @click="trendRange = val as any"
            >
              {{ label }}
            </button>
          </div>
        </div>
        <VChart ref="chartRefs.trend" :option="trendOption" autoresize style="height: 280px" />
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
      >
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-4">用户来源分布</h3>
        <VChart ref="chartRefs.source" :option="sourceOption" autoresize style="height: 280px" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
      >
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-4">热门问题 Top 10</h3>
        <VChart
          ref="chartRefs.questions"
          :option="questionsOption"
          autoresize
          style="height: 340px"
        />
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
      >
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-4">收入趋势</h3>
        <VChart ref="chartRefs.revenue" :option="revenueOption" autoresize style="height: 280px" />
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800 dark:text-gray-200">用户反馈</h3>
        <span class="text-xs text-gray-400">最近 {{ data.feedbacks.length }} 条</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="fb in data.feedbacks"
          :key="fb.id"
          class="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex gap-0.5 shrink-0 pt-0.5">
            <span
              v-for="s in 5"
              :key="s"
              class="text-sm"
              :class="s <= fb.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'"
              >★</span
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ fb.content }}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="text-[10px] text-gray-400">{{ fb.time }}</span>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded"
                :class="
                  fb.replied
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                "
              >
                {{ fb.replied ? '已回复' : '待回复' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
    >
      <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-4">性能监控指标</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          class="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10"
        >
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ data.performance.successRate }}%
          </p>
          <p class="text-xs text-gray-500 mt-1">成功率</p>
          <div
            class="mt-2 w-full h-1.5 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-green-500 rounded-full"
              :style="{ width: `${data.performance.successRate}%` }"
            ></div>
          </div>
        </div>
        <div
          class="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10"
        >
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ data.performance.errorRate }}%
          </p>
          <p class="text-xs text-gray-500 mt-1">错误率</p>
          <div class="mt-2 w-full h-1.5 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
            <div
              class="h-full bg-red-500 rounded-full"
              :style="{ width: `${data.performance.errorRate}%` }"
            ></div>
          </div>
        </div>
        <div
          class="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10"
        >
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ data.performance.avgTokenConsumption }}
          </p>
          <p class="text-xs text-gray-500 mt-1">平均 Token 消耗</p>
          <p class="text-[10px] text-gray-400 mt-1">/次请求</p>
        </div>
        <div
          class="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10"
        >
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ data.performance.peakConcurrency }}
          </p>
          <p class="text-xs text-gray-500 mt-1">峰值并发数</p>
          <p class="text-[10px] text-gray-400 mt-1">同时在线</p>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
        @click="exportReport('csv')"
      >
        📄 导出 CSV
      </button>
      <button
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5"
        @click="exportReport('excel')"
      >
        📊 导出 Excel
      </button>
    </div>
  </div>
</template>
