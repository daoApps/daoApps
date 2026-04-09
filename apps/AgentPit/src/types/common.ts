/**
 * 通用类型定义
 * 包含项目中广泛使用的基础类型和工具类型
 */

/** 通用标识符类型，支持字符串或数字 ID */
export type ID = string | number

/** 时间戳类型 */
export type Timestamp = number | string | Date

/** 通用状态类型 */
export const Status = {
  /** 活跃状态 */
  ACTIVE: 'active',
  /** 非活跃状态 */
  INACTIVE: 'inactive',
  /** 待处理状态 */
  PENDING: 'pending',
  /** 已完成状态 */
  COMPLETED: 'completed',
  /** 进行中状态 */
  IN_PROGRESS: 'in_progress',
  /** 已失败状态 */
  FAILED: 'failed',
  /** 已取消状态 */
  CANCELLED: 'cancelled'
} as const

export type Status = (typeof Status)[keyof typeof Status]

/** 时间戳接口，用于记录创建和更新时间 */
export interface Timestamps {
  /** 创建时间 */
  createdAt: string
  /** 最后更新时间 */
  updatedAt: string
}

/** 分页参数接口 */
export interface PaginationParams {
  /** 当前页码 (从1开始) */
  page: number
  /** 每页数量 */
  pageSize: number
}

/** 分页响应接口 */
export interface PaginationResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/** 通用响应结构 */
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean
  /** 数据载荷 */
  data: T
  /** 错误信息 */
  message?: string
  /** 错误代码 */
  code?: string
}

/** 排序方向 */
export type SortDirection = 'asc' | 'desc'

/** 排序参数 */
export interface SortParams {
  /** 排序字段 */
  field: string
  /** 排序方向 */
  direction: SortDirection
}

/** 通用筛选器接口 */
export interface FilterOption {
  label: string
  value: string | number
  icon?: string
}

/** 颜色配置接口 */
export interface ColorConfig {
  /** 主色调 */
  primary: string
  /** 辅助色 */
  secondary: string
  /** 强调色 */
  accent: string
  /** 背景色 */
  background: string
  /** 文字颜色 */
  text: string
}

/** 尺寸配置 */
export interface SizeConfig {
  width?: number | string
  height?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
}

/** 位置坐标 */
export interface Position {
  x: number
  y: number
}

/** 范围区间 */
export interface Range<T = number> {
  min: T
  max: T
}

/** 日期范围 */
export interface DateRange {
  start: string
  end: string
}

/** 选项接口（用于下拉选择等） */
export interface Option<T = string> {
  label: string
  value: T
  disabled?: boolean
  icon?: string
  description?: string
}

/** 标签接口 */
export interface Tag {
  id: string
  name: string
  color?: string
  icon?: string
}

/** 空值检查工具类型 */
export type Nullable<T> = T | null

/** 可选字段工具类型 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 必填字段工具类型 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
