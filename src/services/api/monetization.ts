// src/services/api/monetization.ts
import { httpClient, withMock } from './client';
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
  getWallet: withMock(
    () => mockMonetization.getWallet(),
    () => httpClient.get<Wallet>('/monetization/wallet').then(res => res.data)
  ),

  // 获取收益数据
  getRevenue: withMock(
    () => mockMonetization.getRevenueData(),
    () => httpClient.get<RevenueData>('/monetization/revenue').then(res => res.data)
  ),

  // 获取交易历史
  getTransactions: withMock(
    () => mockMonetization.getTransactionHistory(),
    () => httpClient.get<Transaction[]>('/monetization/transactions').then(res => res.data)
  ),

  // 发起提现
  withdraw: withMock(
    (request: WithdrawRequest) => mockMonetization.withdraw(request),
    (request: WithdrawRequest) =>
      httpClient.post<Transaction>('/monetization/withdraw', request).then(res => res.data)
  )
};
