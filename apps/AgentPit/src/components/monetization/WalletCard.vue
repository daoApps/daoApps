<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WalletData, Currency } from '@/types/monetization'

interface Props {
  data: WalletData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  recharge: []
  withdraw: []
}>()

const selectedCurrency = ref<Currency>(props.data.currency)
const isUpdating = ref(false)

const currencies: { value: Currency; label: string }[] = [
  { value: 'CNY', label: 'CNY' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
]

const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formattedTotalBalance = computed(() =>
  formatCurrency(props.data.totalBalance, selectedCurrency.value)
)
const formattedAvailableBalance = computed(() =>
  formatCurrency(props.data.availableBalance, selectedCurrency.value)
)
const formattedFrozenBalance = computed(() =>
  formatCurrency(props.data.frozenBalance, selectedCurrency.value)
)

const switchCurrency = (currency: Currency) => {
  selectedCurrency.value = currency
}
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-6 shadow-xl">
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-white/80 text-sm font-medium">总余额</p>
          <h2 class="text-3xl font-bold text-white mt-1 flex items-center gap-2">
            {{ formattedTotalBalance }}
            <span
              v-if="isUpdating"
              class="inline-block w-3 h-3 bg-yellow-300 rounded-full animate-pulse"
              title="实时更新中..."
            />
          </h2>
        </div>
        <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <span class="text-3xl">💰</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-white/15 backdrop-blur-sm rounded-xl p-4">
          <p class="text-white/70 text-xs font-medium mb-1">可用余额</p>
          <p class="text-lg font-semibold text-white">{{ formattedAvailableBalance }}</p>
        </div>
        <div class="bg-white/15 backdrop-blur-sm rounded-xl p-4">
          <p class="text-white/70 text-xs font-medium mb-1">冻结金额</p>
          <p class="text-lg font-semibold text-white">{{ formattedFrozenBalance }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="currency in currencies"
          :key="currency.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
            selectedCurrency === currency.value
              ? 'bg-white text-teal-600 shadow-md'
              : 'bg-white/20 text-white hover:bg-white/30'
          ]"
          @click="switchCurrency(currency.value)"
        >
          {{ currency.label }}
        </button>
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 bg-white hover:bg-white/90 text-teal-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          @click="emit('recharge')"
        >
          充值
        </button>
        <button
          class="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/30"
          @click="emit('withdraw')"
        >
          提现
        </button>
      </div>
    </div>
  </div>
</template>
