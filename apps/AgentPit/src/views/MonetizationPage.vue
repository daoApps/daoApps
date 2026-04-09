<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import WalletCard from '@/components/monetization/WalletCard.vue'
import RevenueChart from '@/components/monetization/RevenueChart.vue'
import TransactionHistory from '@/components/monetization/TransactionHistory.vue'
import WithdrawModal from '@/components/monetization/WithdrawModal.vue'
import FinancialReport from '@/components/monetization/FinancialReport.vue'
import NotificationBar from '@/components/monetization/NotificationBar.vue'
import { useMonetizationStore } from '@/stores/useMonetizationStore'
import { useRealtimeData } from '@/composables/useRealtimeData'

const store = useMonetizationStore()
const showWithdrawModal = ref(false)

const { notifications, startRealtimeUpdates, removeNotification } = useRealtimeData(store)

onMounted(async () => {
  await store.fetchWalletData()
  startRealtimeUpdates()
})

const handleRecharge = () => {
  console.log('充值功能')
}

const handleWithdrawSuccess = (amount: number, method: string) => {
  console.log(`提现成功: ¥${amount}, 方式: ${method}`)
}

const handleWithdraw = () => {
  showWithdrawModal.value = true
}
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">自动变现</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">智能化的收益管理和变现策略</p>
      </div>

      <NotificationBar :notifications="notifications" @remove="removeNotification" />

      <FinancialReport
        v-if="store.revenueData.length > 0"
        :metrics="{
          totalIncome: store.totalIncome,
          totalExpense: store.totalExpense,
          netProfit: store.totalIncome - store.totalExpense,
          profitRate: 71.4,
          monthlyComparison: []
        }"
        :source-data="[
          { name: '智能体服务', value: 45, color: '#0ea5e9' },
          { name: '建站分成', value: 25, color: '#10b981' },
          { name: '商品销售', value: 18, color: '#f59e0b' },
          { name: '其他收入', value: 12, color: '#8b5cf6' }
        ]"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <WalletCard
            :data="store.wallet"
            @recharge="handleRecharge"
            @withdraw="handleWithdraw"
          />
        </div>

        <div class="lg:col-span-2">
          <RevenueChart
            :data="store.revenueData"
            :source-data="[
              { name: '智能体服务', value: 45, color: '#0ea5e9' },
              { name: '建站分成', value: 25, color: '#10b981' },
              { name: '商品销售', value: 18, color: '#f59e0b' },
              { name: '其他收入', value: 12, color: '#8b5cf6' }
            ]"
          />
        </div>
      </div>

      <TransactionHistory :transactions="store.transactions" />

      <WithdrawModal
        :is-open="showWithdrawModal"
        :available-balance="store.wallet.availableBalance"
        @close="showWithdrawModal = false"
        @success="handleWithdrawSuccess"
      />
    </div>
  </MainLayout>
</template>
