<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TransactionRecord } from '@/types/monetization'

interface Props {
  transactions: TransactionRecord[]
}

const props = defineProps<Props>()

type FilterType = 'all' | 'income' | 'expense'
type FilterStatus = 'all' | 'success' | 'processing' | 'failed'

const isExpanded = ref(false)
const searchQuery = ref('')
const filterType = ref<FilterType>('all')
const filterStatus = ref<FilterStatus>('all')
const currentPage = ref(1)

const ITEMS_PER_PAGE = 5

const statusConfig = {
  success: {
    label: '成功',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500'
  },
  processing: {
    label: '处理中',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500'
  },
  failed: {
    label: '失败',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500'
  }
}

const filteredTransactions = computed(() => {
  return props.transactions.filter((tx) => {
    const matchesSearch =
      searchQuery.value === '' ||
      tx.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesType = filterType.value === 'all' || tx.type === filterType.value
    const matchesStatus =
      filterStatus.value === 'all' || tx.status === filterStatus.value

    return matchesSearch && matchesType && matchesStatus
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredTransactions.value.length / ITEMS_PER_PAGE)
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredTransactions.value.slice(start, start + ITEMS_PER_PAGE)
})

const formatAmount = (amount: number, type: string) => {
  const prefix = type === 'income' ? '+' : '-'
  const colorClass = type === 'income' ? 'text-green-600' : 'text-red-600'
  return {
    prefix,
    formatted: `${prefix}¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
    colorClass
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div
      @click="isExpanded = !isExpanded"
      class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <h3 class="text-lg font-bold text-gray-900">交易历史</h3>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">
          共 {{ filteredTransactions.length }} 条记录
        </span>
        <svg
          :class="['w-5 h-5 text-gray-400 transition-transform duration-200', { 'rotate-180': isExpanded }]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="border-t border-gray-100">
      <div class="p-6 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              @input="currentPage = 1"
              type="text"
              placeholder="搜索交易ID或描述..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          <select
            v-model="filterType"
            @change="currentPage = 1"
            class="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
          >
            <option value="all">全部类型</option>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>

          <select
            v-model="filterStatus"
            @change="currentPage = 1"
            class="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
          >
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="processing">处理中</option>
            <option value="failed">失败</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  交易ID
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  时间
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="tx in paginatedTransactions"
                :key="tx.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-4">
                  <span class="text-sm font-mono text-gray-900">{{ tx.id }}</span>
                </td>
                <td class="py-4 px-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ tx.description }}</p>
                    <p class="text-xs text-gray-500">{{ tx.category }}</p>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ tx.type === 'income' ? '收入' : '支出' }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span :class="['font-semibold', formatAmount(tx.amount, tx.type).colorClass]">
                    {{ formatAmount(tx.amount, tx.type).formatted }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                      statusConfig[tx.status].bg,
                      statusConfig[tx.status].text
                    ]"
                  >
                    <span :class="['w-1.5 h-1.5 rounded-full', statusConfig[tx.status].dot]" />
                    {{ statusConfig[tx.status].label }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span class="text-sm text-gray-500">{{ tx.timestamp }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="paginatedTransactions.length === 0" class="text-center py-12">
            <p class="text-gray-400">暂无匹配的交易记录</p>
          </div>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-between pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            显示 {{ (currentPage - 1) * ITEMS_PER_PAGE + 1 }} -
            {{ Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length) }} 条，共
            {{ filteredTransactions.length }} 条
          </p>
          <div class="flex gap-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                currentPage === page
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
