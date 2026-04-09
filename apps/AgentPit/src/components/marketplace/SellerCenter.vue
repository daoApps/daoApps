<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Seller } from '@/types/marketplace'
import { products as allProducts, orders as allOrders, sellers } from '@/data/mockMarketplace'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

interface Props {
  seller?: Seller
}

const props = defineProps<Props>()

type SellerTab = 'overview' | 'products' | 'orders' | 'publish'

const activeTab = ref<SellerTab>('overview')
const sellerData = computed(() => props.seller || sellers[0])
const myProducts = computed(() => allProducts.filter(p => p.seller.id === sellerData.value.id))
const myOrders = computed(() => allOrders.filter(o => o.items.some(i => i.product.seller.id === sellerData.value.id)))

const revenueData = [
  { month: '11月', revenue: 28000, orders: 42 },
  { month: '12月', revenue: 35000, orders: 56 },
  { month: '1月', revenue: 32000, orders: 48 },
  { month: '2月', revenue: 41000, orders: 65 },
  { month: '3月', revenue: 48000, orders: 78 },
  { month: '4月', revenue: 56000, orders: 92 }
]

const categoryData = [
  { name: '智能体模板', value: 45, color: '#0ea5e9' },
  { name: '开发工具', value: 25, color: '#10b981' },
  { name: 'API接口', value: 18, color: '#f59e0b' },
  { name: '数据集', value: 12, color: '#8b5cf6' }
]

const tabs: { key: SellerTab; label: string; icon: string }[] = [
  { key: 'overview', label: '数据概览', icon: '📊' },
  { key: 'products', label: '商品管理', icon: '📦' },
  { key: 'orders', label: '订单处理', icon: '📋' },
  { key: 'publish', label: '发布商品', icon: '➕' }
]

const totalRevenue = computed(() =>
  myOrders.value.reduce((sum, o) => sum + o.totalAmount, 0)
)

const totalVisitors = 28540

const publishFormData = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  type: 'digital' as 'digital' | 'physical' | 'service',
  images: [] as string[]
})

const handlePublishSubmit = () => {
  alert('商品发布成功！')
  resetPublishForm()
}

const resetPublishForm = () => {
  publishFormData.value = {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    type: 'digital',
    images: []
  }
}

const handleAddPublishImage = () => {
  if (publishFormData.value.images.length < 3) {
    const newImg = `https://images.unsplash.com/photo-${1550000000 + Math.floor(Math.random() * 999999999)}?w=800`
    publishFormData.value.images.push(newImg)
  }
}

const revenueChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e5e7eb',
    textStyle: { color: '#374151' },
    borderRadius: 12,
    padding: [12, 16]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: revenueData.map(d => d.month),
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#9ca3af', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
    axisLabel: { color: '#9ca3af', fontSize: 12 }
  },
  series: [{
    type: 'line',
    data: revenueData.map(d => d.revenue),
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
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
  }]
}))

const orderChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: [12, 16]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: revenueData.map(d => d.month),
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#9ca3af', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
    axisLabel: { color: '#9ca3af', fontSize: 12 }
  },
  series: [{
    type: 'bar',
    data: revenueData.map(d => d.orders),
    barWidth: '50%',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#34d399' }
        ]
      },
      borderRadius: [6, 6, 0, 0]
    }
  }]
}))
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-12">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img :src="sellerData.avatar" alt="" class="w-14 h-14 rounded-full" />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ sellerData.storeName }}</h1>
          <div class="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>卖家：{{ sellerData.name }}</span>
            <span v-if="sellerData.isVerified" class="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              认证商家
            </span>
            <span>{{ sellerData.followerCount.toLocaleString }} 粉丝</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          店铺设置
        </button>
      </div>
    </div>

    <div class="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'relative px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
          activeTab === tab.key
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <span>{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'overview'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">总销售额</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">¥{{ totalRevenue.toLocaleString() }}</p>
              <p class="text-xs mt-1 flex items-center gap-1 text-green-600">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                23.5% 较上月
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
              <span class="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">订单数</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ myOrders.length }}</p>
              <p class="text-xs mt-1 flex items-center gap-1 text-green-600">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                15.2% 较上月
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
              <span class="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">在售商品</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ myProducts.filter(p => p.stock > 0).length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
              <span class="text-2xl">🏪</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">访客数</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalVisitors.toLocaleString() }}</p>
              <p class="text-xs mt-1 flex items-center gap-1 text-green-600">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                32.1% 较上月
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
              <span class="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">收益趋势</h3>
          <v-chart :option="revenueChartOption" style="height: 280px" autoresize />
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">品类分布</h3>
          <div class="space-y-4">
            <div v-for="item in categoryData" :key="item.name">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.name }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.value }}%</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: `${item.value}%`, backgroundColor: item.color }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">月度订单量</h3>
        <v-chart :option="orderChartOption" style="height: 220px" autoresize />
      </div>
    </div>

    <div v-if="activeTab === 'products'" class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium">
            全部 ({{ myProducts.length }})
          </button>
          <button class="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
            上架中 ({{ myProducts.filter(p => p.stock > 0).length }})
          </button>
          <button class="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
            已下架 ({{ myProducts.filter(p => p.stock === 0).length }})
          </button>
        </div>
        <button
          @click="activeTab = 'publish'"
          class="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          发布新商品
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="product in myProducts"
          :key="product.id"
          class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
        >
          <img :src="product.images[0]" :alt="product.name" class="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-700" loading="lazy" />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{{ product.name }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ product.subCategory }}</p>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-sm font-semibold text-red-500">¥{{ product.price }}</span>
              <span class="text-xs text-gray-400">销量 {{ product.salesCount }}</span>
              <span class="text-xs text-gray-400">库存 {{ product.stock }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                product.stock > 0
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
              ]"
            >
              {{ product.stock > 0 ? '已上架' : '已下架' }}
            </button>
            <button class="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
              编辑
            </button>
            <button class="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'orders'" class="space-y-4">
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium">
          待处理 ({{ myOrders.filter(o => o.status === 'pending_shipment').length }})
        </button>
        <button class="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
          已发货 ({{ myOrders.filter(o => o.status === 'pending_receipt').length }})
        </button>
        <button class="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
          已完成 ({{ myOrders.filter(o => o.status === 'completed').length }})
        </button>
      </div>

      <div
        v-for="order in myOrders"
        :key="order.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4 text-sm">
            <span class="text-gray-500 dark:text-gray-400">订单号：{{ order.orderNumber }}</span>
            <span class="text-gray-400">{{ order.createdAt }}</span>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            order.status === 'pending_shipment' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
            order.status === 'pending_receipt' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' :
            'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          ]">
            {{ order.status === 'pending_shipment' ? '待发货' : order.status === 'pending_receipt' ? '待收货' : '已完成' }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <img
            v-for="item in order.items"
            :key="item.product.id"
            :src="item.product.images[0]"
            alt=""
            class="w-14 h-14 object-cover rounded-lg"
            loading="lazy"
          />
          <div class="flex-1">
            <p class="text-sm text-gray-900 dark:text-white">{{ order.items.map(i => i.product.name).join('、') }}</p>
          </div>
          <span class="text-lg font-bold text-red-500">¥{{ order.totalAmount.toLocaleString() }}</span>
        </div>

        <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <template v-if="order.status === 'pending_shipment'">
            <button class="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              发货
            </button>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              查看详情
            </button>
          </template>
          <template v-else>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              查看详情
            </button>
          </template>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'publish'" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">发布新商品</h2>

      <form @submit.prevent="handlePublishSubmit" class="space-y-6 max-w-2xl">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品标题 *</label>
          <input
            v-model="publishFormData.name"
            type="text"
            placeholder="请输入商品标题（最多60字）"
            maxlength="60"
            class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品描述 *</label>
          <textarea
            v-model="publishFormData.description"
            placeholder="详细描述您的商品特点、功能、使用场景等..."
            rows="5"
            maxlength="2000"
            class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p class="text-xs text-gray-400 mt-1">{{ publishFormData.description.length }}/2000</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">价格 (¥) *</label>
            <input
              v-model="publishFormData.price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">库存数量 *</label>
            <input
              v-model="publishFormData.stock"
              type="number"
              placeholder="数字产品可填999"
              min="0"
              class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品分类 *</label>
          <select
            v-model="publishFormData.category"
            class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          >
            <option value="">请选择分类</option>
            <option value="智能体模板">智能体模板</option>
            <option value="API接口">API接口</option>
            <option value="数据集">数据集</option>
            <option value="开发工具">开发工具</option>
            <option value="在线课程">在线课程</option>
            <option value="实体周边">实体周边</option>
            <option value="专业服务">专业服务</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品类型 *</label>
          <div class="flex gap-3">
            <template v-for="{ value, label, desc } in [
              { value: 'digital', label: '数字产品', desc: '模板、课程、工具等' },
              { value: 'physical', label: '实体商品', desc: '需要物流配送' },
              { value: 'service', label: '服务', desc: '咨询、定制等' }
            ]" :key="value">
              <button
                type="button"
                @click="publishFormData.type = value as any"
                :class="[
                  'flex-1 p-4 rounded-xl border-2 transition-all',
                  publishFormData.type === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                ]"
              >
                <p class="font-medium text-sm text-gray-900 dark:text-white">{{ label }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ desc }}</p>
              </button>
            </template>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品图片</label>
          <div class="flex gap-3">
            <template v-for="i in 3" :key="i">
              <button
                type="button"
                @click="i > publishFormData.images.length + 1 ? null : handleAddPublishImage()"
                :class="[
                  'w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors',
                  i <= publishFormData.images.length
                    ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                ]"
              >
                <template v-if="i <= publishFormData.images.length">
                  <img :src="publishFormData.images[i - 1]" alt="" class="w-full h-full object-cover rounded-lg" />
                </template>
                <template v-else>
                  <div class="text-center text-gray-400 dark:text-gray-500">
                    <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="text-xs block mt-1">上传</span>
                  </div>
                </template>
              </button>
            </template>
          </div>
          <p class="text-xs text-gray-400 mt-2">最多上传5张图片，建议尺寸800x800，支持JPG/PNG格式</p>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="!publishFormData.name || !publishFormData.price || !publishFormData.category"
            :class="[
              'flex-1 py-3 rounded-xl font-medium transition-all',
              publishFormData.name && publishFormData.price && publishFormData.category
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
          >
            发布商品
          </button>
          <button
            type="button"
            @click="resetPublishForm"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            重置
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
