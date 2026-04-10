/**
 * 变现系统类型定义
 * 用于钱包、收益、交易等财务相关功能
 */

/** 货币类型 */
export type Currency = 'CNY' | 'USD' | 'EUR' | 'GBP';

/** 交易类型 */
export type TransactionType = 'income' | 'expense';

/** 交易状态 */
export type TransactionStatus = 'success' | 'processing' | 'failed';

/** 钱包数据接口 */
export interface WalletData {
  /** 总余额（包含冻结金额） */
  totalBalance: number;
  /** 可用余额 */
  availableBalance: number;
  /** 冻结余额（待结算/提现中） */
  frozenBalance: number;
  /** 货币单位 */
  currency: Currency;
}

/** 收益数据点接口 */
export interface RevenueDataPoint {
  /** 日期标签（如 "4月9日"） */
  date: string;
  /** 当日收入 */
  revenue: number;
  /** 当日支出 */
  expenses: number;
  /** 当日净利润 */
  profit: number;
}

/** 交易记录接口 */
export interface TransactionRecord {
  /** 交易编号（格式：TXN + YYYYMMDD + 序号） */
  id: string;
  /** 交易类型：收入或支出 */
  type: TransactionType;
  /** 交易金额 */
  amount: number;
  /** 交易状态 */
  status: TransactionStatus;
  /** 交易时间戳 */
  timestamp: string;
  /** 交易描述 */
  description: string;
  /** 收入/支出分类 */
  category: TransactionCategory;
}

/** 交易分类常量 */
export const TransactionCategory = {
  /** 智能体 API 服务收入 */
  AGENT_SERVICE: '智能体服务',
  /** Sphinx 建站分成 */
  SITE_COMMISSION: '建站分成',
  /** 商品销售收入 */
  PRODUCT_SALES: '商品销售',
  /** 任务执行报酬 */
  TASK_EXECUTION: '任务执行',
  /** 提现操作 */
  WITHDRAWAL: '提现',
  /** 平台服务费 */
  SERVICE_FEE: '服务费',
  /** 内容创作收益 */
  CONTENT_CREATION: '内容创作',
  /** 订阅服务收入 */
  SUBSCRIPTION: '订阅服务'
} as const;

export type TransactionCategory = (typeof TransactionCategory)[keyof typeof TransactionCategory];

/** 收入来源分布项 */
export interface SourceDistribution {
  /** 来源名称 */
  name: string;
  /** 占比百分比 (0-100) */
  value: number;
  /** 显示颜色（十六进制） */
  color: string;
}

/** 财务指标汇总 */
export interface FinancialMetrics {
  /** 总收入 */
  totalIncome: number;
  /** 总支出 */
  totalExpense: number;
  /** 净利润 */
  netProfit: number;
  /** 利润率 (%) */
  profitRate: number;
  /** 月度对比数据 */
  monthlyComparison: MonthlyComparison[];
}

/** 月度对比数据 */
export interface MonthlyComparison {
  /** 月份标签 */
  month: string;
  /** 当月收入 */
  income: number;
  /** 当月支出 */
  expense: number;
}

/** 提现请求接口 */
export interface WithdrawRequest {
  /** 提现金额 */
  amount: number;
  /** 提现方式 */
  method: WithdrawMethod;
  /** 目标账户信息 */
  accountInfo: string;
  /** 备注 */
  note?: string;
}

/** 提现方式 */
export type WithdrawMethod = 'bank_card' | 'alipay' | 'wechat';

/** 钱包操作类型 */
export type WalletActionType =
  | 'check_balance'
  | 'view_transactions'
  | 'withdraw'
  | 'view_revenue_chart'
  | 'view_source_distribution';
