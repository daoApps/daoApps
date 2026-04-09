import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMonetizationStore } from '@/stores/useMonetizationStore'

describe('useMonetizationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('State', () => {
    it('should have correct initial state', () => {
      const store = useMonetizationStore()

      expect(store.wallet.totalBalance).toBe(234567.89)
      expect(store.wallet.availableBalance).toBe(198456.32)
      expect(store.wallet.frozenBalance).toBe(36111.57)
      expect(store.wallet.currency).toBe('CNY')
      expect(store.transactions).toEqual([])
      expect(store.revenueData).toEqual([])
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Getters', () => {
    it('formattedTotalBalance should return formatted currency string', () => {
      const store = useMonetizationStore()

      expect(store.formattedTotalBalance).toContain('234,567.89')
    })

    it('formattedAvailableBalance should return formatted currency string', () => {
      const store = useMonetizationStore()

      expect(store.formattedAvailableBalance).toContain('198,456.32')
    })

    it('recentTransactions should return first 10 transactions', () => {
      const store = useMonetizationStore()

      // 添加超过 10 条交易记录
      for (let i = 0; i < 15; i++) {
        store.addTransaction({
          id: `TXN-${i}`,
          type: 'income',
          amount: 100,
          status: 'success',
          timestamp: new Date().toISOString(),
          description: `Test transaction ${i}`,
          category: 'Test'
        })
      }

      expect(store.recentTransactions.length).toBe(10)
    })

    it('totalIncome should calculate total income correctly', () => {
      const store = useMonetizationStore()

      store.addTransaction({
        id: 'TXN-1',
        type: 'income',
        amount: 1000,
        status: 'success',
        timestamp: new Date().toISOString(),
        description: 'Income 1',
        category: 'Test'
      })

      store.addTransaction({
        id: 'TXN-2',
        type: 'income',
        amount: 2000,
        status: 'success',
        timestamp: new Date().toISOString(),
        description: 'Income 2',
        category: 'Test'
      })

      store.addTransaction({
        id: 'TXN-3',
        type: 'expense',
        amount: 500,
        status: 'success',
        timestamp: new Date().toISOString(),
        description: 'Expense 1',
        category: 'Test'
      })

      expect(store.totalIncome).toBe(3000)
    })

    it('totalExpense should calculate total expense correctly', () => {
      const store = useMonetizationStore()

      store.addTransaction({
        id: 'TXN-1',
        type: 'expense',
        amount: 500,
        status: 'success',
        timestamp: new Date().toISOString(),
        description: 'Expense 1',
        category: 'Test'
      })

      expect(store.totalExpense).toBe(500)
    })
  })

  describe('Actions', () => {
    it('fetchWalletData should load data from mock', async () => {
      const store = useMonetizationStore()

      await store.fetchWalletData()

      expect(store.transactions.length).toBeGreaterThan(0)
      expect(store.revenueData.length).toBeGreaterThan(0)
      expect(store.isLoading).toBe(false)
    })

    it('updateRealtimeBalance should update available balance', () => {
      const store = useMonetizationStore()

      store.updateRealtimeBalance(150000)

      expect(store.wallet.availableBalance).toBe(150000)
    })

    it('addTransaction should add transaction to beginning of list', () => {
      const store = useMonetizationStore()

      const transaction = {
        id: 'TXN-NEW',
        type: 'income' as const,
        amount: 9999,
        status: 'success' as const,
        timestamp: '2024-04-10T10:00:00Z',
        description: 'New transaction',
        category: 'Test'
      }

      store.addTransaction(transaction)

      expect(store.transactions[0]).toEqual(transaction)
      expect(store.transactions.length).toBe(1)
    })
  })
})
