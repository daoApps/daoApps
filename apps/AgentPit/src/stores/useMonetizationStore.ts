import { defineStore } from 'pinia'
import type { WalletData, TransactionRecord, RevenueDataPoint, Currency, TransactionCategory } from '@/types/monetization'

interface MonetizationState {
  wallet: WalletData
  transactions: TransactionRecord[]
  revenueData: RevenueDataPoint[]
  isLoading: boolean
}

export const useMonetizationStore = defineStore('monetization', {
  state: (): MonetizationState => ({
    wallet: {
      totalBalance: 234567.89,
      availableBalance: 198456.32,
      frozenBalance: 36111.57,
      currency: 'CNY' as Currency
    },
    transactions: [],
    revenueData: [],
    isLoading: false
  }),

  getters: {
    formattedTotalBalance: (state): string => {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: state.wallet.currency
      }).format(state.wallet.totalBalance)
    },

    formattedAvailableBalance: (state): string => {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: state.wallet.currency
      }).format(state.wallet.availableBalance)
    },

    recentTransactions: (state): TransactionRecord[] => {
      return state.transactions.slice(0, 10)
    },

    totalIncome: (state): number => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
    },

    totalExpense: (state): number => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    }
  },

  actions: {
    async fetchWalletData() {
      this.isLoading = true
      try {
        const { walletData, transactionHistory, monthlyRevenueData } = await import('@/data/mockMonetization')

        this.wallet = { ...walletData, currency: walletData.currency as Currency }
        this.transactions = transactionHistory.map(t => ({ ...t, category: t.category as TransactionCategory }))
        this.revenueData = monthlyRevenueData
      } catch (error) {
        console.error('Failed to fetch wallet data:', error)
      } finally {
        this.isLoading = false
      }
    },

    updateRealtimeBalance(newBalance: number) {
      this.wallet.availableBalance = newBalance
    },

    addTransaction(transaction: TransactionRecord) {
      this.transactions.unshift(transaction)
    }
  }
})
