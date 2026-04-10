<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, GaugeChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import type { FinancialMetrics, SourceDistribution } from '@/types/monetization';

use([CanvasRenderer, PieChart, GaugeChart, TitleComponent, TooltipComponent, LegendComponent]);

interface Props {
  metrics: FinancialMetrics;
  sourceData: SourceDistribution[];
}

const props = defineProps<Props>();

const kpiCards = computed(() => [
  {
    title: '今日收益',
    value: `¥${(props.metrics.totalIncome / 30).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
    change: '+12.5%',
    isPositive: true,
    icon: '📈',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    title: '本月收益',
    value: `¥${props.metrics.totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
    change: '+8.3%',
    isPositive: true,
    icon: '💰',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    title: '总资产',
    value: `¥${(props.metrics.totalIncome + props.metrics.netProfit).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
    change: '+15.7%',
    isPositive: true,
    icon: '🏦',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  {
    title: '收益率',
    value: `${props.metrics.profitRate.toFixed(1)}%`,
    change: '+2.1%',
    isPositive: true,
    icon: '📊',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  }
]);

const gaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#10b981' },
            { offset: 0.5, color: '#f59e0b' },
            { offset: 1, color: '#ef4444' }
          ]
        }
      },
      progress: {
        show: true,
        width: 20
      },
      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 20
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 24,
        fontWeight: 'bold',
        offsetCenter: [0, '-5%'],
        formatter: '{value}%'
      },
      data: [{ value: props.metrics.profitRate }]
    }
  ]
}));

const aiPredictions = computed(() => [
  {
    type: 'suggestion',
    title: '收益建议',
    content: '根据您近30天的数据，建议增加智能体API服务的推广力度，预计可提升15-20%的月度收益。',
    icon: '💡',
    color: 'border-l-4 border-blue-500 bg-blue-50'
  },
  {
    type: 'warning',
    title: '风险提示',
    content: '本月支出较上月增长12%，建议优化任务执行成本，关注服务费支出趋势。',
    icon: '⚠️',
    color: 'border-l-4 border-yellow-500 bg-yellow-50'
  },
  {
    type: 'prediction',
    title: 'AI 趋势预测',
    content: '基于机器学习模型分析，预计下月收益将在 ¥42,000 - ¥48,000 区间，置信度 87%。',
    icon: '🤖',
    color: 'border-l-4 border-green-500 bg-green-50'
  }
]);
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(card, index) in kpiCards"
        :key="index"
        :class="[card.bgColor, 'rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow']"
      >
        <div class="flex items-center justify-between mb-3">
          <p :class="[card.textColor, 'text-sm font-medium']">{{ card.title }}</p>
          <span class="text-2xl">{{ card.icon }}</span>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-2">{{ card.value }}</p>
        <div class="flex items-center gap-1">
          <svg
            :class="['w-4 h-4', card.isPositive ? 'text-green-500' : 'text-red-500']"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span
            :class="['text-sm font-semibold', card.isPositive ? 'text-green-600' : 'text-red-600']"
          >
            {{ card.change }}
          </span>
          <span class="text-xs text-gray-500 ml-1">vs 上期</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">收益率仪表盘</h3>
        <div class="h-[250px]">
          <VChart :option="gaugeOption" autoresize class="w-full h-full" />
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">AI 智能分析</h3>
        <div class="space-y-4">
          <div
            v-for="(prediction, index) in aiPredictions"
            :key="index"
            :class="[prediction.color, 'rounded-lg p-4 hover:shadow-md transition-shadow']"
          >
            <div class="flex items-start gap-3">
              <span class="text-xl mt-0.5">{{ prediction.icon }}</span>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-1">{{ prediction.title }}</h4>
                <p class="text-sm text-gray-700 leading-relaxed">{{ prediction.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
