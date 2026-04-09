<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order } from '@/types/marketplace'
import { orders as allOrders } from '@/data/mockMarketplace'

interface Props {
  orders?: Order[]
}

const props = defineProps<Props>()

const activeTab = ref('all')
const expandedOrders = ref<Set<string>>(new Set())

const orders = computed(() => props.orders || allOrders)

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending_payment: { label: '待付款', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  pending_shipment: { label: '待发货', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  pending_receipt: { label: '待收货', color: 'text-primary-600 dark:text-primary-400', bgColor: 'bg-primary-100 dark:bg-primary-900/30' },
  completed: { label: '已完成', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: '已取消', color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700' },
  refunding: { label: '退款中', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' }
}

const tabs = [
  { key: 'all', label: '全部订单' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'pending_shipment', label: '待发货' },
  { key: 'pending_receipt', label: '待收货' },
  { key: 'completed', label: '已完成' }
]

const toggleExpand = (orderId: string) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId)
  } else {
    expandedOrders.value.add(orderId)
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">我的订单</h1>

    <div class="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'relative px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
          activeTab === tab.key
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        {{ tab.label }}
        <span
          v-if="tab.key !== 'all'"
          class="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded-full"
        >
          {{ orders.filter(o => o.status === tab.key).length }}
        </span>
      </button>
    </div>

    <div
      v-if="filteredOrders.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <svg class="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-900 dark:text-white mb-1">暂无相关订单</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">快去市场挑选心仪的商品吧</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="px-6 py-4">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-4 text-sm">
              <span class="text-gray-500 dark:text-gray-400">订单号：{{ order.orderNumber }}</span>
              <span class="text-gray-400">{{ order.createdAt }}</span>
            </div>
            <span :class="['px-3 py-1 rounded-full text-xs font-medium', statusConfig[order.status]?.bgColor, statusConfig[order.status]?.color]">
              {{ statusConfig[order.status]?.label || '未知状态' }}
            </span>
          </div>

          <div class="space-y-3">
            <div v-for="item in order.items" :key="item.product.id" class="flex items-center gap-4">
              <img
                :src="item.product.images[0]"
                :alt="item.product.name"
                class="w-20 h-20 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                loading="lazy"
              />
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{{ item.product.name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.product.subCategory }}</p>
                <p class="text-xs text-gray-400 mt-1">x{{ item.quantity }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">¥{{ (item.price * item.quantity).toLocaleString() }}</p>
                <p class="text-xs text-gray-400 mt-1">单价 ¥{{ item.price }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              @click="toggleExpand(order.id)"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
            >
              {{ expandedOrders.has(order.id) ? '收起详情' : '查看详情' }}
              <svg
                :class="['w-4 h-4 transition-transform', expandedOrders.has(order.id) ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">实付：</span>
              <span class="text-lg font-bold text-red-500">¥{{ order.totalAmount.toLocaleString() }}</span>
            </div>
          </div>

          <div
            v-if="expandedOrders.has(order.id)"
            class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4 bg-gray-50 dark:bg-gray-700/30 -mx-6 px-6 py-4 rounded-b-xl"
          >
            <div>
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                收货地址
              </h5>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ order.shippingAddress.recipient }} {{ order.shippingAddress.phone }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ order.shippingAddress.province }}{{ order.shippingAddress.city }}{{ order.shippingAddress.district }}{{ order.shippingAddress.detail }}
              </p>
            </div>

            <div>
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                支付方式
              </h5>
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ order.paymentMethod || '未支付' }}</p>
            </div>

            <div v-if="order.trackingNumber">
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V4a1 1 0 00-1-1H4a1 1 0 00-1 1v16a1 1 0 001 1h2m8-1H9m4-1h2m0 0h2m-4 0v-4m0 4l-4-4" />
                </svg>
                物流信息
              </h5>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">运单号：{{ order.trackingNumber }}</p>

              <div v-if="order.logisticsInfo && order.logisticsInfo.length > 0" class="relative pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-3">
                <div
                  v-for="(step, idx) in order.logisticsInfo"
                  :key="idx"
                  class="relative"
                >
                  <div
                    :class="[
                      'absolute -left-[21px] w-3 h-3 rounded-full border-2',
                      idx === 0 ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    ]"
                  />
                  <div :class="['text-xs', idx === 0 ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400']">
                    {{ step.description }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ step.time }}</div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 pt-2">
              <template v-if="order.status === 'pending_payment'">
                <button class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                  立即付款
                </button>
                <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  取消订单
                </button>
              </template>

              <template v-if="order.status === 'pending_shipment'">
                <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  提醒发货
                </button>
              </template>

              <template v-if="order.status === 'pending_receipt'">
                <button class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  确认收货
                </button>
                <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  查看物流
                </button>
              </template>

              <template v-if="order.status === 'completed'">
                <button class="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                  去评价
                </button>
                <button class="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  再次购买
                </button>
                <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  申请售后
                </button>
              </template>

              <template v-if="order.status === 'refunding'">
                <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  查看进度
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
