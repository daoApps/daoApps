---
name: "flexloop-tokens"
description: "在 Flexloop 项目中生成 AI Token 消耗上报接口，包含 Prisma 数据模型、API 路由、定时任务和数据统计功能。当用户需要追踪 AI 模型调用成本、记录 Token 使用情况、实现用量计费或生成消耗报表时调用此技能。"
---

# Flexloop Token 消耗上报接口生成器

## 概述

此技能用于在 Flexloop 项目中快速实现 **AI Token 消耗追踪系统**，完整覆盖数据模型设计、API 接口开发、自动化采集和统计分析全链路。

## 功能特性

### 📊 核心功能
- 📝 **Token 用量记录**: 自动记录每次 AI 模型调用的输入/输出 Token 数
- 💰 **成本计算**: 根据不同模型的定价自动计算费用
- 📈 **实时统计**: 按用户/时间/模型维度聚合消耗数据
- ⏰ **定时汇总**: 定期生成日/周/月消耗报告
- 🔔 **预警通知**: 当用量接近配额时发送告警
- 📋 **导出功能**: 支持 CSV/JSON 格式导出消耗明细

### 🎯 适用场景
- 追踪 OpenAI/Anthropic/Claude 等 LLM 的 Token 消耗
- 实现按量计费（Pay-as-you-go）模式
- 监控团队/个人 AI 使用预算
- 优化 Prompt 以降低 Token 成本
- 合规审计和成本分摊

### 🛠️ 技术栈要求
- **ORM**: Prisma 6.x
- **数据库**: PostgreSQL (推荐) / MySQL / SQLite
- **框架**: Next.js 15 (App Router) 或 Express.js
- **调度**: node-cron 或 Vercel Cron
- **类型**: TypeScript Strict Mode

---

## 实现步骤

### 阶段 1: 数据模型设计

#### 1.1 Prisma Schema 定义

**文件**: `prisma/schema.prisma` (追加以下模型)

```prisma
// ============================================
// Flexloop Token 消耗追踪数据模型
// ============================================

model TokenUsage {
  id              String   @id @default(cuid())
  
  // 关联信息
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  // 会话标识（可选，用于关联具体对话）
  sessionId       String?
  conversationId  String?
  
  // 模型和提供商信息
  provider        String   // "openai" | "anthropic" | "google" | "agentpit"
  model           String   // "gpt-4o" | "claude-3.5-sonnet" | "gemini-pro" 等
  modelType       String?  // "chat" | "completion" | "embedding" | "image"
  
  // Token 统计
  promptTokens    Int      @default(0)  // 输入 Token 数
  completionTokens Int     @default(0)  // 输出 Token 数
  totalTokens     Int      @default(0)  // 总 Token 数
  
  // 成本计算（单位: USD）
  promptCost      Decimal  @default(0) @db.Decimal(10, 6)
  completionCost  Decimal  @default(0) @db.Decimal(10, 6)
  totalCost       Decimal  @default(0) @db.Decimal(10, 6)
  
  // 元数据
  endpoint        String?  // API 端点标识
  functionName    String?  // 如果是 Function Calling
  latencyMs       Int?     // 请求延迟（毫秒）
  success         Boolean  @default(true)
  errorMessage    String?  @db.Text
  
  // 时间戳
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@index([userId])
  @@index([provider, model])
  @@index([createdAt])
  @@map("token_usages")
}

// Token 消耗汇总表（用于快速查询统计）
model TokenUsageSummary {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  // 时间维度
  date            DateTime @db.Date  // 统计日期
  period          String             // "daily" | "weekly" | "monthly"
  
  // 聚合数据
  totalRequests   Int      @default(0)
  totalTokens     BigInt   @default(0)
  totalCost       Decimal  @default(0) @db.Decimal(12, 2)
  
  // 按模型分解
  modelBreakdown  Json?    // [{ model: "gpt-4", tokens: 10000, cost: 0.3 }]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, date, period])
  @@index([date, period])
  @@map("token_usage_summaries")
}

// 用户 Token 配额设置
model TokenQuota {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  // 配额设置
  dailyLimit      Int?     // 每日 Token 上限（0 表示无限制）
  monthlyLimit    Int?     // 每月 Token 上限
  costBudget      Decimal? @db.Decimal(10, 2)  // 月度成本预算（USD）
  
  // 当前使用量缓存
  usedToday       Int      @default(0)
  usedThisMonth   Int      @default(0)
  costThisMonth   Decimal  @default(0) @db.Decimal(10, 2)
  
  lastResetAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("token_quotas")
}

// 扩展 User 模型（如果尚未包含 tokenUsage 字段）
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  image           String?
  
  // 关联关系
  tokenUsages     TokenUsage[]
  tokenSummaries  TokenUsageSummary[]
  tokenQuota      TokenQuota?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### 1.2 运行数据库迁移

```bash
# 生成迁移文件
npx prisma migrate dev --name add_token_tracking

# 应用迁移到数据库
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

---

### 阶段 2: 模型定价配置

#### 2.1 Token 定价表

**文件**: `src/lib/token-pricing.ts`

```typescript
/**
 * AI 模型 Token 定价配置（单位: USD / 1K tokens）
 * 
 * 数据来源: 各官方定价页面（2026 年 4 月更新）
 * 文档: https://openai.com/pricing / https://www.anthropic.com/pricing
 */

export interface ModelPricing {
  provider: string
  model: string
  inputPrice: number    // 每 1K 输入 Token 价格
  outputPrice: number   // 每 1K 输出 Token 价格
  unit: 'per_1k_tokens'
  currency: 'USD'
  maxContextWindow?: number
  lastUpdated: string
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // ===== OpenAI Models =====
  'gpt-4o': {
    provider: 'openai',
    model: 'gpt-4o',
    inputPrice: 0.0025,
    outputPrice: 0.01,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 128000,
    lastUpdated: '2026-04-01',
  },
  'gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    inputPrice: 0.00015,
    outputPrice: 0.0006,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 128000,
    lastUpdated: '2026-04-01',
  },
  'gpt-4-turbo': {
    provider: 'openai',
    model: 'gpt-4-turbo',
    inputPrice: 0.01,
    outputPrice: 0.03,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 128000,
    lastUpdated: '2026-04-01',
  },
  
  // ===== Anthropic Claude Models =====
  'claude-sonnet-4-20250514': {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    inputPrice: 0.003,
    outputPrice: 0.015,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 200000,
    lastUpdated: '2026-04-01',
  },
  'claude-3.5-sonnet': {
    provider: 'anthropic',
    model: 'claude-3.5-sonnet',
    inputPrice: 0.003,
    outputPrice: 0.015,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 200000,
    lastUpdated: '2026-04-01',
  },
  'claude-3-opus': {
    provider: 'anthropic',
    model: 'claude-3-opus',
    inputPrice: 0.015,
    outputPrice: 0.075,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 200000,
    lastUpdated: '2026-04-01',
  },
  
  // ===== Google Gemini Models =====
  'gemini-1.5-pro': {
    provider: 'google',
    model: 'gemini-1.5-pro',
    inputPrice: 0.00125,
    outputPrice: 0.005,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 1000000,
    lastUpdated: '2026-04-01',
  },
  'gemini-1.5-flash': {
    provider: 'google',
    model: 'gemini-1.5-flash',
    inputPrice: 0.000075,
    outputPrice: 0.0003,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 1000000,
    lastUpdated: '2026-04-01',
  },
  
  // ===== Flexloop Custom Models =====
  'agentpit-default': {
    provider: 'agentpit',
    model: 'agentpit-default',
    inputPrice: 0.002,
    outputPrice: 0.008,
    unit: 'per_1k_tokens',
    currency: 'USD',
    maxContextWindow: 32000,
    lastUpdated: '2026-04-10',
  },
}

/**
 * 计算 Token 成本
 */
export function calculateTokenCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): { promptCost: number; completionCost: number; totalCost: number } {
  const pricing = MODEL_PRICING[model]
  
  if (!pricing) {
    console.warn(`Unknown model: ${model}. Using default pricing.`)
    return {
      promptCost: 0,
      completionCost: 0,
      totalCost: 0,
    }
  }
  
  const promptCost = (promptTokens / 1000) * pricing.inputPrice
  const completionCost = (completionTokens / 1000) * pricing.outputPrice
  const totalCost = promptCost + completionCost
  
  return {
    promptCost: Math.round(promptCost * 1000000) / 1000000, // 保留 6 位小数
    completionCost: Math.round(completionCost * 1000000) / 1000000,
    totalCost: Math.round(totalCost * 1000000) / 1000000,
  }
}

/**
 * 获取模型信息
 */
export function getModelInfo(model: string): ModelPricing | undefined {
  return MODEL_PRICING[model]
}
```

---

### 阶段 3: API 路由实现

#### 3.1 Token 消耗上报接口

**文件**: `src/app/api/tokens/usage/route.ts` (POST - 上报数据)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateTokenCost } from '@/lib/token-pricing'
import { auth } from '@/lib/auth' // 你的认证库

interface TokenUsagePayload {
  provider: string
  model: string
  modelType?: string
  promptTokens: number
  completionTokens: number
  sessionId?: string
  conversationId?: string
  endpoint?: string
  functionName?: string
  latencyMs?: number
  success?: boolean
  errorMessage?: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. 解析请求数据
    const body: TokenUsagePayload = await request.json()
    
    // 3. 数据验证
    const requiredFields = ['provider', 'model', 'promptTokens', 'completionTokens']
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // 4. 计算 Token 成本
    const costs = calculateTokenCost(body.model, body.promptTokens, body.completionTokens)
    
    const totalTokens = body.promptTokens + body.completionTokens

    // 5. 写入数据库
    const usageRecord = await prisma.tokenUsage.create({
      data: {
        userId: session.user.id,
        provider: body.provider,
        model: body.model,
        modelType: body.modelType,
        promptTokens: body.promptTokens,
        completionTokens: body.completionTokens,
        totalTokens,
        promptCost: costs.promptCost,
        completionCost: costs.completionCost,
        totalCost: costs.totalCost,
        sessionId: body.sessionId,
        conversationId: body.conversationId,
        endpoint: body.endpoint,
        functionName: body.functionName,
        latencyMs: body.latencyMs,
        success: body.success ?? true,
        errorMessage: body.errorMessage,
      },
    })

    // 6. 异步更新用户配额（不阻塞响应）
    updateUserQuota(session.user.id, totalTokens, costs.totalCost).catch(console.error)

    // 7. 返回成功响应
    return NextResponse.json({
      success: true,
      id: usageRecord.id,
      message: 'Token usage recorded successfully',
      cost: costs.totalCost,
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to record token usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * 异步更新用户配额使用量
 */
async function updateUserQuota(userId: string, tokensUsed: number, costIncurred: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  await prisma.tokenQuota.upsert({
    where: { userId },
    update: {
      usedToday: { increment: tokensUsed },
      usedThisMonth: { increment: tokensUsed },
      costThisMonth: { increment: costIncurred },
      lastResetAt: today,
    },
    create: {
      userId,
      usedToday: tokensUsed,
      usedThisMonth: tokensUsed,
      costThisMonth: costIncurred,
      lastResetAt: today,
    },
  })
}
```

#### 3.2 Token 消耗查询接口

**文件**: `src/app/api/tokens/usage/route.ts` (GET - 查询统计数据)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'daily' // daily | weekly | monthly
    const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 100)
    const startDate = searchParams.get('from')
    const endDate = searchParams.get('to')

    // 构建查询条件
    const whereClause: any = {
      userId: session.user.id,
    }

    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) whereClause.createdAt.gte = new Date(startDate)
      if (endDate) whereClause.createdAt.lte = new Date(endDate)
    }

    // 根据时间范围获取数据
    let dateFilter: Date
    switch (period) {
      case 'weekly':
        dateFilter = new Date()
        dateFilter.setDate(dateFilter.getDate() - 7)
        break
      case 'monthly':
        dateFilter = new Date()
        dateFilter.setMonth(dateFilter.getMonth() - 1)
        break
      case 'daily':
      default:
        dateFilter = new Date()
        dateFilter.setDate(dateFilter.getDate() - 1)
        break
    }

    whereClause.createdAt = whereClause.createdAt ?? {}
    whereClause.createdAt.gte = whereClause.createdAt.gte ?? dateFilter

    // 并行执行多个查询
    const [
      usageRecords,
      aggregationResult,
      quotaInfo,
    ] = await Promise.all([
    // 详细记录（最近 N 条）
    prisma.tokenUsage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        provider: true,
        model: true,
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        totalCost: true,
        success: true,
        latencyMs: true,
        createdAt: true,
      },
    }),

    // 聚合统计
    prisma.tokenUsage.groupBy({
      by: ['model'],
      where: whereClause,
      _count: { id: true },
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        totalCost: true,
      },
      _avg: {
        latencyMs: true,
      },
      orderBy: { _sum: { totalTokens: 'desc' } },
    }),

    // 用户配额信息
    prisma.tokenQuota.findUnique({
      where: { userId: session.user.id },
      select: {
        dailyLimit: true,
        monthlyLimit: true,
        costBudget: true,
        usedToday: true,
        usedThisMonth: true,
        costThisMonth: true,
      },
    }),
    ])

    // 计算总计
    const totals = usageRecords.reduce(
      (acc, record) => ({
        totalTokens: acc.totalTokens + record.totalTokens,
        totalCost: acc.totalCost + Number(record.totalCost),
        totalRequests: acc.totalRequests + 1,
      }),
      { totalTokens: 0, totalCost: 0, totalRequests: 0 }
    )

    return NextResponse.json({
      success: true,
      period,
      dateRange: {
        from: dateFilter.toISOString(),
        to: new Date().toISOString(),
      },
      summary: {
        ...totals,
        averageCostPerRequest: totals.totalRequests > 0 
          ? totals.totalCost / totals.totalRequests 
          : 0,
        averageTokensPerRequest: totals.totalRequests > 0
          ? Math.round(totals.totalTokens / totals.totalRequests)
          : 0,
      },
      byModel: aggregationResult.map(item => ({
        model: item.model,
        requests: item._count.id,
        tokens: item._sum.totalTokens ?? 0,
        cost: Number(item._sum.totalCost ?? 0),
        avgLatencyMs: Math.round(item._avg.latencyMs ?? 0),
      })),
      recentUsages: usageRecords,
      quota: quotaInfo ? {
        ...quotaInfo,
        dailyRemaining: quotaInfo.dailyLimit 
          ? Math.max(0, quotaInfo.dailyLimit - quotaInfo.usedToday)
          : null,
        monthlyRemaining: quotaInfo.monthlyLimit
          ? Math.max(0, quotaInfo.monthlyLimit - quotaInfo.usedThisMonth)
          : null,
        budgetRemaining: quotaInfo.costBudget
          ? Math.max(0, Number(quotaInfo.costBudget) - Number(quotaInfo.costThisMonth))
          : null,
        usagePercentage: quotaInfo.costBudget
          ? Math.round((Number(quotaInfo.costThisMonth) / Number(quotaInfo.costBudget)) * 100)
          : null,
      } : null,
    })

  } catch (error) {
    console.error('Failed to fetch token usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token usage statistics' },
      { status: 500 }
    )
  }
}
```

#### 3.3 Token 消耗导出接口

**文件**: `src/app/api/tokens/export/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv' // csv | json
    const startDate = searchParams.get('from')
    const endDate = searchParams.get('to') || new Date().toISOString()

    const whereClause: any = {
      userId: session.user.id,
      createdAt: {
        lte: new Date(endDate),
      },
    }

    if (startDate) {
      whereClause.createdAt.gte = new Date(startDate)
    }

    const records = await prisma.tokenUsage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        provider: true,
        model: true,
        modelType: true,
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        promptCost: true,
        completionCost: true,
        totalCost: true,
        success: true,
        errorMessage: true,
        latencyMs: true,
        endpoint: true,
        functionName: true,
        createdAt: true,
      },
      take: 10000, // 限制导出数量
    })

    if (format === 'json') {
      return new NextResponse(JSON.stringify(records, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="token-usage-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    }

    // CSV 格式导出
    const headers = [
      'ID', 'Timestamp', 'Provider', 'Model', 'Type',
      'Prompt Tokens', 'Completion Tokens', 'Total Tokens',
      'Prompt Cost ($)', 'Completion Cost ($)', 'Total Cost ($)',
      'Success', 'Latency (ms)', 'Endpoint', 'Function Name',
    ]

    const csvRows = records.map(record => [
      record.id,
      record.createdAt.toISOString(),
      record.provider,
      record.model,
      record.modelType || '',
      record.promptTokens,
      record.completionTokens,
      record.totalTokens,
      Number(record.promptCost).toFixed(6),
      Number(record.completionCost).toFixed(6),
      Number(record.totalCost).toFixed(6),
      record.success,
      record.latencyMs || '',
      record.endpoint || '',
      record.functionName || '',
    ])

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="token-usage-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

  } catch (error) {
    console.error('Export failed:', error)
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}
```

---

### 阶段 4: 客户端 SDK 封装

#### 4.1 Token Tracker 工具类

**文件**: `src/lib/token-tracker.ts`

```typescript
/**
 * Flexloop Token 消耗追踪客户端
 * 
 * 用法:
 *   import { tokenTracker } from '@/lib/token-tracker'
 *   
 *   // 自动追踪（推荐）
 *   const response = await tokenTracker.track(() => openai.chat.completions.create({...}))
 *   
 *   // 手动上报
 *   await tokenTracker.report({ provider: 'openai', model: 'gpt-4o', ... })
 */

export interface TrackOptions {
  provider: string
  model: string
  modelType?: string
  sessionId?: string
  conversationId?: string
  endpoint?: string
  functionName?: string
}

export interface UsageData extends TrackOptions {
  promptTokens: number
  completionTokens: number
  latencyMs: number
  success: boolean
  errorMessage?: string
}

class TokenTracker {
  private apiBaseUrl: string
  private enabled: boolean

  constructor(options?: { apiBaseUrl?: string; enabled?: boolean }) {
    this.apiBaseUrl = options?.apiBaseUrl || '/api/tokens'
    this.enabled = options?.enabled ?? process.env.NODE_ENV === 'production'
  }

  /**
   * 追踪一个异步函数调用并自动上报 Token 使用量
   */
  async track<T>(
    options: TrackOptions,
    fn: () => Promise<{ usage?: { prompt_tokens?: number; completion_tokens?: number }; data?: T }>
  ): Promise<T | null> {
    if (!this.enabled) {
      const result = await fn()
      return result.data ?? result
    }

    const startTime = performance.now()
    
    try {
      const result = await fn()
      const endTime = performance.now()
      const latencyMs = Math.round(endTime - startTime)

      // 从响应中提取 Token 使用量（支持多种格式）
      const usage = result.usage || (result as any)?.data?.usage
      
      const promptTokens = usage?.prompt_tokens || 0
      const completionTokens = usage?.completion_tokens || 0

      if (promptTokens > 0 || completionTokens > 0) {
        await this.report({
          ...options,
          promptTokens,
          completionTokens,
          latencyMs,
          success: true,
        }).catch(console.error)
      }

      return result.data ?? result

    } catch (error) {
      const endTime = performance.now()
      const latencyMs = Math.round(endTime - startTime)

      await this.report({
        ...options,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      }).catch(console.error)

      throw error
    }
  }

  /**
   * 手动上报 Token 使用数据
   */
  async report(data: UsageData): Promise<void> {
    if (!this.enabled) return

    try {
      await fetch(`${this.apiBaseUrl}/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.warn('Failed to report token usage:', error)
      // 静默失败，不影响主流程
    }
  }

  /**
   * 批量上报（减少网络请求）
   */
  async reportBatch(usages: UsageData[]): Promise<void> {
    if (!this.enabled || usages.length === 0) return

    try {
      await Promise.allSettled(
        usages.map(usage => this.report(usage))
      )
    } catch (error) {
      console.warn('Batch report failed:', error)
    }
  }
}

export const tokenTracker = new TokenTracker()
```

#### 4.2 React/Vue Hook 封装

**文件**: `src/composables/useTokenTracking.ts` (Vue) 或 `src/hooks/useTokenTracking.ts` (React)

```typescript
// Vue 3 Composition API 版本
import { tokenTracker } from '@/lib/token-tracker'

export function useTokenTracking() {
  const trackTokenUsage = async (
    provider: string,
    model: string,
    apiCall: () => Promise<any>,
    options?: Partial<Parameters<typeof tokenTracker.track>[0]>
  ) => {
    return tokenTracker.track(
      { provider, model, ...options },
      apiCall
    )
  }

  const reportUsage = (data: Parameters<typeof tokenTracker.report>[0]) => {
    return tokenTracker.report(data)
  }

  return {
    trackTokenUsage,
    reportUsage,
  }
}
```

---

### 阶段 5: 定时任务与数据汇总

#### 5.1 每日汇总任务

**文件**: `src/cron/daily-token-summary.ts`

```typescript
import { prisma } from '@/lib/prisma'

/**
 * 每日 Token 消耗汇总任务
 * 
 * 建议运行时间: 每天 UTC 00:05 (北京时间 08:05)
 * Vercel Cron: {"schedule": "5 0 * * *"}
 */

export async function generateDailySummaries(): Promise<void> {
  console.log('Starting daily token summary generation...')
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    // 获取昨天有活动的所有用户
    const activeUsers = await prisma.tokenUsage.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    })

    console.log(`Found ${activeUsers.length} active users`)

    for (const { userId } of activeUsers) {
      // 聚合该用户昨天的数据
      const summary = await prisma.tokenUsage.aggregate({
        where: {
          userId,
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _count: { id: true },
        _sum: {
          promptTokens: true,
          completionTokens: true,
          totalTokens: true,
          totalCost: true,
        },
      })

      // 按模型分解
      const modelBreakdown = await prisma.tokenUsage.groupBy({
        by: ['model'],
        where: {
          userId,
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _sum: {
          totalTokens: true,
          totalCost: true,
        },
      })

      // 更新或创建汇总记录
      await prisma.tokenUsageSummary.upsert({
        where: {
          userId_date_period: {
            userId,
            date: yesterday,
            period: 'daily',
          },
        },
        update: {
          totalRequests: summary._count.id,
          totalTokens: summary._sum.totalTokens ?? BigInt(0),
          totalCost: summary._sum.totalCost ?? 0,
          modelBreakdown: modelBreakdown.map(m => ({
            model: m.model,
            tokens: Number(m._sum.totalTokens ?? 0),
            cost: Number(m._sum.totalCost ?? 0),
          })),
        },
        create: {
          userId,
          date: yesterday,
          period: 'daily',
          totalRequests: summary._count.id,
          totalTokens: summary._sum.totalTokens ?? BigInt(0),
          totalCost: summary._sum.totalCost ?? 0,
          modelBreakdown: modelBreakdown.map(m => ({
            model: m.model,
            tokens: Number(m._sum.totalTokens ?? 0),
            cost: Number(m._sum.totalCost ?? 0),
          })),
        },
      })
    }

    console.log('Daily token summary generation completed successfully.')

  } catch (error) {
    console.error('Failed to generate daily summaries:', error)
    throw error
  }
}

// Vercel Serverless Function 导出
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // 验证 Cron 密钥（防止未授权调用）
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  await generateDailySummaries()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
```

---

### 阶段 6: 前端展示组件

#### 6.1 Token 使用仪表板

**文件**: `src/components/dashboard/TokenUsageDashboard.vue` (Vue) 或 `src/components/dashboard/TokenUsageDashboard.tsx` (React)

```vue
<template>
  <div class="space-y-6">
    <!-- 概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="总请求数"
        :value="summary.totalRequests.toLocaleString()"
        icon="📊"
        color="blue"
      />
      <StatCard
        title="总 Token 数"
        :value="formatNumber(summary.totalTokens)"
        icon="🪙"
        color="purple"
      />
      <StatCard
        title="总花费"
        :value="`$${summary.totalCost.toFixed(4)}`"
        icon="💰"
        color="green"
      />
      <StatCard
        title="平均成本/请求"
        :value="`$${summary.averageCostPerRequest.toFixed(6)}`"
        icon="📈"
        color="orange"
      />
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 模型使用分布 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">模型使用分布</h3>
        <ModelUsageChart :data="byModel" />
      </div>

      <!-- 时间趋势图 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">使用趋势</h3>
        <UsageTrendChart :data="recentUsages" />
      </div>
    </div>

    <!-- 配额进度条 -->
    <div v-if="quota" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">月度配额使用情况</h3>
      <ProgressBar
        :current="Number(quota.costThisMonth)"
        :total="Number(quota.costBudget)"
        label="成本预算"
        unit="$"
      />
      <div class="mt-4 text-sm text-gray-600">
        已使用 ${{ quota.costThisMonth?.toFixed(2) }} / 
        预算 ${{ quota.costBudget }} 
        ({{ quota.usagePercentage }}%)
      </div>
    </div>

    <!-- 最近记录表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold">最近使用记录</h3>
        <button
          @click="exportData"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          导出 CSV
        </button>
      </div>
      <UsageTable :records="recentUsages" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatCard from './StatCard.vue'
import ModelUsageChart from './charts/ModelUsageChart.vue'
import UsageTrendChart from './charts/UsageTrendChart.vue'
import ProgressBar from './ProgressBar.vue'
import UsageTable from './UsageTable.vue'

const summary = ref({
  totalRequests: 0,
  totalTokens: 0,
  totalCost: 0,
  averageCostPerRequest: 0,
})

const byModel = ref([])
const recentUsages = ref([])
const quota = ref(null)

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const fetchData = async () => {
  try {
    const response = await fetch('/api/tokens/usage?period=daily&limit=50')
    const data = await response.json()
    
    if (data.success) {
      summary.value = data.summary
      byModel.value = data.byModel
      recentUsages.value = data.recentUsages
      quota.value = data.quota
    }
  } catch (error) {
    console.error('Failed to fetch token usage:', error)
  }
}

const exportData = async () => {
  window.open('/api/tokens/export?format=csv&from=' + 
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), '_blank')
}

onMounted(fetchData)
</script>
```

---

## 使用示例

### 示例 1: 在 AI 调用中使用

```typescript
import { tokenTracker } from '@/lib/token-tracker'

// 方式一: 自动追踪（推荐）
const response = await tokenTracker.track(
  {
    provider: 'openai',
    model: 'gpt-4o',
    sessionId: 'session-123',
    conversationId: 'conv-456',
  },
  async () => {
    return await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [...],
    })
  }
)

// 方式二: 手动上报
await tokenTracker.report({
  provider: 'anthropic',
  model: 'claude-3.5-sonnet',
  promptTokens: 1500,
  completionTokens: 800,
  latencyMs: 2340,
  success: true,
})
```

### 示例 2: Vue 组件中使用 Composable

```vue
<script setup lang="ts">
import { useTokenTracking } from '@/composables/useTokenTracking'

const { trackTokenUsage } = useTokenTracking()

const sendMessage = async (message: string) => {
  const response = await trackTokenUsage(
    'agentpit',
    'agentpit-default',
    () => fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }).then(r => r.json())
  )

  console.log('AI Response:', response)
}
</script>
```

---

## API 参考

### POST /api/tokens/usage

**用途**: 上报一次 Token 使用记录

**请求体**:
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "modelType": "chat",
  "promptTokens": 1500,
  "completionTokens": 800,
  "sessionId": "session-123",
  "conversationId": "conv-456",
  "endpoint": "/api/chat",
  "latencyMs": 2340,
  "success": true
}
```

**响应** (201 Created):
```json
{
  "success": true,
  "id": "clxxxxxxx",
  "message": "Token usage recorded successfully",
  "cost": 0.012750
}
```

### GET /api/tokens/usage

**用途**: 查询 Token 使用统计

**查询参数**:
- `period`: `daily` | `weekly` | `monthly` (默认: `daily`)
- `limit`: 返回记录数 (默认: 30, 最大: 100)
- `from`: 开始日期 (ISO 8601)
- `to`: 结束日期 (ISO 8601)

**响应** (200 OK):
```json
{
  "success": true,
  "period": "daily",
  "summary": {
    "totalTokens": 125000,
    "totalCost": 1.2345,
    "totalRequests": 45,
    "averageCostPerRequest": 0.02743,
    "averageTokensPerRequest": 2778
  },
  "byModel": [...],
  "recentUsages": [...],
  "quota": {...}
}
```

### GET /api/tokens/export

**用途**: 导出 Token 使用数据

**查询参数**:
- `format`: `csv` | `json` (默认: `csv`)
- `from`, `to`: 日期范围

**响应**: CSV 或 JSON 文件下载

---

## 环境变量配置

```bash
# .env.local

# 数据库连接（Prisma）
DATABASE_URL="postgresql://user:password@localhost:5432/agentpit"

# Cron 任务密钥（用于保护定时任务端点）
CRON_SECRET=your-super-secret-cron-key-here

# Token 追踪开关（可选，生产环境默认开启）
ENABLE_TOKEN_TRACKING=true
```

---

## 测试清单

- [ ] POST /api/tokens/usage 能正确记录 Token 使用
- [ ] 成本计算准确（对比官方定价计算器）
- [ ] GET /api/tokens/usage 返回正确的统计数据
- [ ] 按时间范围筛选数据正常工作
- [ ] 导出功能生成有效的 CSV/JSON 文件
- [ ] 用户配额限制生效
- [ ] 未认证用户无法访问 API
- [ ] 定时汇总任务正常运行
- [ ] 大批量数据导入性能可接受
- [ ] 前端仪表盘正确展示数据

---

## 性能优化建议

1. **数据库索引**: 确保在 `userId`, `createdAt`, `(provider, model)` 上有索引
2. **批量写入**: 高频场景考虑使用消息队列缓冲写入
3. **数据归档**: 超过 90 天的数据移至冷存储
4. **缓存层**: 对热门查询结果使用 Redis 缓存
5. **分页查询**: 前端列表使用游标分页替代偏移分页

---

**版本**: v1.0.0
**最后更新**: 2026-04-10
**适用项目**: Flexloop 全栈应用 (Next.js + Prisma + PostgreSQL)
