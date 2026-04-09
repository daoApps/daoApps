<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import type { RevenueDataPoint, SourceDistribution } from '@/types/monetization'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

interface Props {
  data: RevenueDataPoint[]
  sourceData: SourceDistribution[]
}

const props = defineProps<Props>()

type TimeRange = '7' | '30' | '90' | '365'
type ChartView = 'line' | 'bar'

const selectedRange = ref<TimeRange>('30')
const chartView = ref<ChartView>('line')

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '7', label: '7天' },
  { value: '30', label: '30天' },
  { value: '90', label: '90天' },
  { value: '365', label: '1年' }
]

const lineChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#f0f0f0',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    },
    formatter: (params: any) => {
      let result = `<div style="font-weight:600;margin-bottom:8px">${params[0].axisValue}</div>`
      params.forEach((item: any) => {
        result += `<div style="display:flex;align-items:center;gap:6px;margin:4px 0">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color}"></span>
          <span>${item.seriesName}: ¥${item.value.toLocaleString()}</span>
        </div>`
      })
      return result
    }
  },
  legend: {
    data: ['收入', '净利润'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.date),
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: {
      color: '#6b7280',
      fontSize: 12,
      formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`
    },
    splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' as const } }
  },
  series: [
    {
      name: '收入',
      type: 'line',
      data: props.data.map(item => item.revenue),
      smooth: true,
      lineStyle: { width: 3, color: '#0ea5e9' },
      itemStyle: { color: '#0ea5e9' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
            { offset: 1, color: 'rgba(14, 165, 233, 0.05)' }
          ]
        }
      }
    },
    {
      name: '净利润',
      type: 'line',
      data: props.data.map(item => item.profit),
      smooth: true,
      lineStyle: { width: 3, color: '#10b981' },
      itemStyle: { color: '#10b981' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ]
        }
      }
    }
  ]
}))

const barChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#f0f0f0',
    borderWidth: 1,
    textStyle: { color: '#333' }
  },
  legend: {
    data: ['收入', '支出'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.date),
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: {
      color: '#6b7280',
      fontSize: 12,
      formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`
    },
    splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' as const } }
  },
  series: [
    {
      name: '收入',
      type: 'bar',
      data: props.data.map(item => item.revenue),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#0ea5e9' },
            { offset: 1, color: '#0284c7' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    },
    {
      name: '支出',
      type: 'bar',
      data: props.data.map(item => item.expenses),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#f59e0b' },
            { offset: 1, color: '#d97706' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
}))

const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: { color: '#6b7280' }
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      data: props.sourceData.map(item => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: item.color }
      }))
    }
  ]
}))

const currentChartOption = computed(() =>
  chartView.value === 'line' ? lineChartOption.value : barChartOption.value
)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h3 class="text-lg font-bold text-gray-900">收益趋势</h3>

      <div class="flex flex-wrap gap-3">
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            @click="selectedRange = range.value"
            :class="[
              'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
              selectedRange === range.value
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ range.label }}
          </button>
        </div>

        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="chartView = 'line'"
            :class="[
              'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
              chartView === 'line'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            折线图
          </button>
          <button
            @click="chartView = 'bar'"
            :class="[
              'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
              chartView === 'bar'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            柱状图
          </button>
        </div>
      </div>
    </div>

    <div class="h-[300px] mb-8">
      <VChart :option="currentChartOption" autoresize class="w-full h-full" />
    </div>

    <div class="border-t border-gray-100 pt-6">
      <h4 class="text-base font-semibold text-gray-900 mb-4">收入来源分布</h4>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div class="h-[250px]">
          <VChart :option="pieChartOption" autoresize class="w-full h-full" />
        </div>

        <div class="space-y-3">
          <div
            v-for="item in sourceData"
            :key="item.name"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
              <span class="text-sm font-medium text-gray-700">{{ item.name }}</span>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
