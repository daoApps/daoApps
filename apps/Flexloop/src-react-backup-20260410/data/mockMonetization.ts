export interface WalletData {
  totalBalance: number
  availableBalance: number
  frozenBalance: number
  currency: string
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  expenses: number
  profit: number
}

export interface TransactionRecord {
  id: string
  type: 'income' | 'expense'
  amount: number
  status: 'success' | 'processing' | 'failed'
  timestamp: string
  description: string
  category: string
}

export interface SourceDistribution {
  name: string
  value: number
  color: string
}

export interface FinancialMetrics {
  totalIncome: number
  totalExpense: number
  netProfit: number
  profitRate: number
  monthlyComparison: {
    month: string
    income: number
    expense: number
  }[]
}

export const walletData: WalletData = {
  totalBalance: 234567.89,
  availableBalance: 198456.32,
  frozenBalance: 36111.57,
  currency: 'CNY'
}

export const generateRevenueData = (days: number): RevenueDataPoint[] => {
  const data: RevenueDataPoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })

    const baseRevenue = 5000 + Math.random() * 3000
    const baseExpenses = baseRevenue * (0.2 + Math.random() * 0.15)

    data.push({
      date: dateStr,
      revenue: Math.round(baseRevenue * 100) / 100,
      expenses: Math.round(baseExpenses * 100) / 100,
      profit: Math.round((baseRevenue - baseExpenses) * 100) / 100
    })
  }

  return data
}

export const weeklyRevenueData = generateRevenueData(7)
export const monthlyRevenueData = generateRevenueData(30)

export const transactionHistory: TransactionRecord[] = [
  {
    id: 'TXN20240409001',
    type: 'income',
    amount: 12500.00,
    status: 'success',
    timestamp: '2024-04-09 14:32:18',
    description: '智能体API服务收入',
    category: '智能体服务'
  },
  {
    id: 'TXN20240409002',
    type: 'income',
    amount: 8900.50,
    status: 'success',
    timestamp: '2024-04-09 11:20:45',
    description: 'Sphinx建站分成收益',
    category: '建站分成'
  },
  {
    id: 'TXN20240408001',
    type: 'expense',
    amount: 2000.00,
    status: 'success',
    timestamp: '2024-04-08 16:45:22',
    description: '提现至银行卡',
    category: '提现'
  },
  {
    id: 'TXN20240803002',
    type: 'income',
    amount: 3456.78,
    status: 'processing',
    timestamp: '2024-04-08 09:15:33',
    description: '商品销售收入（待确认）',
    category: '商品销售'
  },
  {
    id: 'TXN20240707003',
    type: 'expense',
    amount: 150.00,
    status: 'failed',
    timestamp: '2024-04-07 20:10:05',
    description: '平台服务费支付失败',
    category: '服务费'
  },
  {
    id: 'TXN20240706004',
    type: 'income',
    amount: 6789.12,
    status: 'success',
    timestamp: '2024-04-06 13:28:41',
    description: '自动化任务执行报酬',
    category: '任务执行'
  },
  {
    id: 'TXN20240505005',
    type: 'income',
    amount: 15678.90,
    status: 'success',
    timestamp: '2024-04-05 10:55:19',
    description: '企业级智能体定制服务',
    category: '智能体服务'
  },
  {
    id: 'TXN20240404006',
    type: 'expense',
    amount: 3500.00,
    status: 'success',
    timestamp: '2024-04-04 15:42:37',
    description: '提现至支付宝账户',
    category: '提现'
  },
  {
    id: 'TXN20240303007',
    type: 'income',
    amount: 4321.56,
    status: 'success',
    timestamp: '2024-04-03 08:30:12',
    description: '内容创作自动分发收益',
    category: '内容创作'
  },
  {
    id: 'TXN20240202008',
    type: 'income',
    amount: 9876.54,
    status: 'success',
    timestamp: '2024-04-02 17:05:28',
    description: '数据分析服务订阅收入',
    category: '智能体服务'
  }
]

export const sourceDistribution: SourceDistribution[] = [
  { name: '智能体服务', value: 45, color: '#0ea5e9' },
  { name: '建站分成', value: 25, color: '#10b981' },
  { name: '商品销售', value: 18, color: '#f59e0b' },
  { name: '其他收入', value: 12, color: '#8b5cf6' }
]

export const financialMetrics: FinancialMetrics = {
  totalIncome: 345678.90,
  totalExpense: 98765.43,
  netProfit: 246913.47,
  profitRate: 71.4,
  monthlyComparison: [
    { month: '11月', income: 28000, expense: 8500 },
    { month: '12月', income: 32000, expense: 9200 },
    { month: '1月', income: 29500, expense: 8800 },
    { month: '2月', income: 35800, expense: 10200 },
    { month: '3月', income: 38900, expense: 11500 },
    { month: '4月', income: 42000, expense: 12300 }
  ]
}
