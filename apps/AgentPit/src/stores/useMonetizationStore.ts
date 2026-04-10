import { defineStore } from 'pinia';
import type {
  WalletData,
  TransactionRecord,
  RevenueDataPoint,
  Currency,
  TransactionCategory,
  TransactionType,
  TransactionStatus
} from '@/types/monetization';
import { monetizationApi } from '@/services/api/monetization';

interface MonetizationState {
  wallet: WalletData;
  transactions: TransactionRecord[];
  revenueData: RevenueDataPoint[];
  isLoading: boolean;
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
      }).format(state.wallet.totalBalance);
    },

    formattedAvailableBalance: (state): string => {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: state.wallet.currency
      }).format(state.wallet.availableBalance);
    },

    recentTransactions: (state): TransactionRecord[] => {
      return state.transactions.slice(0, 10);
    },

    totalIncome: (state): number => {
      return state.transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    },

    totalExpense: (state): number => {
      return state.transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    }
  },

  actions: {
    async fetchWalletData() {
      this.isLoading = true;
      try {
        // 从 API 获取钱包数据
        const walletData = await monetizationApi.getWallet();
        this.wallet = {
          totalBalance: walletData.balance,
          availableBalance: walletData.balance,
          frozenBalance: 0,
          currency: walletData.currency as Currency
        };

        // 从 API 获取交易历史
        const transactions = await monetizationApi.getTransactions();
        this.transactions = transactions.map((t: { id: string; amount: number; type: string; description: string; timestamp: string; status: string }) => ({
          id: t.id,
          amount: t.amount,
          type: t.type as TransactionType,
          category: '智能体服务' as TransactionCategory,
          description: t.description,
          timestamp: t.timestamp,
          status: t.status as TransactionStatus
        }));

        // 从 API 获取收益数据
        const revenueData = await monetizationApi.getRevenue();
        this.revenueData = revenueData.monthly.map((amount: number, index: number) => ({
          date: new Date(new Date().getFullYear(), index, 1).toISOString(),
          revenue: amount,
          expenses: 0,
          profit: amount
        }));
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async withdraw(amount: number, method: string, account: string) {
      try {
        const transaction = await monetizationApi.withdraw({
          amount,
          currency: this.wallet.currency,
          method,
          account
        });
        
        // 更新钱包余额
        this.wallet.availableBalance -= amount;
        
        // 添加交易记录
        this.addTransaction({
          id: transaction.id,
          amount: transaction.amount,
          type: 'expense' as TransactionType,
          category: '提现' as TransactionCategory,
          description: transaction.description,
          timestamp: transaction.timestamp,
          status: transaction.status as TransactionStatus
        });
        
        return transaction;
      } catch (error) {
        console.error('Failed to withdraw:', error);
        throw error;
      }
    },

    updateRealtimeBalance(newBalance: number) {
      this.wallet.availableBalance = newBalance;
    },

    addTransaction(transaction: TransactionRecord) {
      this.transactions.unshift(transaction);
    }
  }
});
