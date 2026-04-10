// src/services/api/monetization.ts
import { httpClient } from './client';
import { API_CONFIG } from '../config';

// Mock 数据导入
import * as mockMonetization from '../../data/mockMonetization';

// 类型定义
export interface Wallet {
  balance: number;
  currency: string;
  lastUpdate: string;
}

export interface RevenueData {
  total: number;
  daily: number[];
  monthly: number[];
  trends: string[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface WithdrawRequest {
  amount: number;
  currency: string;
  method: string;
  account: string;
}

// API 服务
export const monetizationApi = {
  // 获取钱包余额
  async getWallet(): Promise<Wallet> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockMonetization.getWallet());
    }
    const response = await httpClient.get<Wallet>('/monetization/wallet');
    return response.data;
  },

  // 获取收益数据
  async getRevenue(): Promise<RevenueData> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockMonetization.getRevenueData());
    }
    const response = await httpClient.get<RevenueData>('/monetization/revenue');
    return response.data;
  },

  // 获取交易历史
  async getTransactions(): Promise<Transaction[]> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockMonetization.getTransactionHistory());
    }
    const response = await httpClient.get<Transaction[]>('/monetization/transactions');
    return response.data;
  },

  // 发起提现
  async withdraw(request: WithdrawRequest): Promise<Transaction> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockMonetization.withdraw(request));
    }
    const response = await httpClient.post<Transaction>('/monetization/withdraw', request);
    return response.data;
  }
};
