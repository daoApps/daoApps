
import { walletData, transactionHistory, generateRevenueData } from '@/data/mockMonetization';

export const monetizationApi = {
  getWallet: async (): Promise<{ balance: number; currency: string }> => {
    // 模拟数据
    return { balance: walletData.totalBalance, currency: walletData.currency };
  },
  getTransactions: async (): Promise<Array<{ id: string; amount: number; currency: string; type: string; description: string; timestamp: string; status: string }>> => {
    // 模拟数据
    return transactionHistory.map(t => ({
      id: t.id,
      amount: t.amount,
      currency: 'CNY',
      type: t.type,
      description: t.description,
      timestamp: t.timestamp,
      status: t.status
    }));
  },
  getRevenue: async (): Promise<{ monthly: number[] }> => {
    // 模拟数据
    const revenueData = generateRevenueData(30);
    return { monthly: revenueData.map(item => item.revenue) };
  },
  withdraw: async (params: { amount: number; currency: string; method: string; account: string }): Promise<{ id: string; amount: number; currency: string; description: string; timestamp: string; status: string }> => {
    // 模拟数据
    return { 
      id: `TXN${Date.now()}`, 
      amount: params.amount, 
      currency: params.currency, 
      description: '提现', 
      timestamp: new Date().toISOString(), 
      status: 'processing' 
    };
  }
};
