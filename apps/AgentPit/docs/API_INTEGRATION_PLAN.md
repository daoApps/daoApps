# AgentPit API 集成方案

## 执行摘要

本文档提供了 AgentPit Vue3 项目从 Mock 数据向真实 API 迁移的完整方案。

### 当前状态
- 项目使用 11 个 Mock 数据文件
- 所有业务模块都依赖 Mock 数据
- 未建立 API 服务层架构

### 迁移目标
- 保持 Store 层接口不变
- 渐进式迁移（可回退）
- 统一的错误处理和数据缓存

---

## 现状分析

### Mock 数据清单

| 序号 | 文件名 | 数据类型 | 使用模块 | 优先级 |
|------|--------|----------|----------|--------|
| 1 | mockChat.ts | 聊天消息、对话历史 | ChatPage, ChatInterface, ChatSidebar | P0 |
| 2 | mockMonetization.ts | 钱包、收益、交易 | MonetizationPage, WalletCard, RevenueChart | P0 |
| 3 | mockSphinx.ts | 建站模板、预览 | SphinxPage, SiteWizard, TemplateGallery | P0 |
| 4 | mockHome.ts | 首页模块数据 | HomePage, ModuleCard | P0 |
| 5 | mockMarketplace.ts | 商品、订单、评价 | MarketplacePage, ProductGrid, ShoppingCart | P1 |
| 6 | mockSocial.ts | 用户资料、推荐、社交动态 | SocialPage, UserProfileCard, DatingMatch | P1 |
| 7 | mockCollaboration.ts | 多智能体配置、任务 | CollaborationPage, AgentWorkspace, TaskDistributor | P1 |
| 8 | mockMemory.ts | 文件、知识图谱、备份 | MemoryPage, FileManager, KnowledgeGraph | P1 |
| 9 | mockCustomize.ts | 智能体配置、技能、主题 | CustomizePage, AgentCreatorWizard, AbilityConfigurator | P2 |
| 10 | mockLifestyle.ts | 日历、旅游、游戏 | LifestylePage, MeetingCalendar, GameCenter | P2 |
| 11 | mockSettings.ts | 用户设置、主题、通知 | SettingsPage, UserProfileSettings, ThemePreferences | P2 |

### 数据使用追踪

#### Store 层依赖
- `useChatStore`: 依赖 mockChat.ts
- `useMonetizationStore`: 依赖 mockMonetization.ts
- `useAppStore`: 部分依赖 mockHome.ts
- `useUserStore`: 部分依赖 mockSettings.ts
- `useCartStore`: 依赖 mockMarketplace.ts

#### 组件层引用
- 大部分业务组件直接或间接通过 Store 使用 Mock 数据
- 部分组件可能有直接导入（需逐一检查）

---

## API 服务层架构设计

### 技术选型

| 组件 | 选择 | 理由 |
|------|------|------|
| HTTP 客户端 | 原生 fetch API + 轻量封装 | 无需额外依赖，现代浏览器原生支持 |
| 类型定义 | TypeScript Interfaces | 与现有项目保持一致 |
| 状态管理 | Pinia Store | 现有架构，无需重构 |
| 缓存策略 | Pinia + localStorage | 分层缓存，性能优化 |
| 错误处理 | 集中式错误处理类 | 统一错误码和用户提示 |

### 目录结构

```
src/
├── services/
│   ├── api/
│   │   ├── client.ts          # HTTP 客户端封装
│   │   ├── chat.ts            # 聊天相关 API
│   │   ├── monetization.ts    # 变现相关 API
│   │   ├── marketplace.ts     # 市场相关 API
│   │   ├── social.ts          # 社交相关 API
│   │   ├── collaboration.ts   # 协作相关 API
│   │   ├── memory.ts          # 记忆相关 API
│   │   ├── customize.ts       # 定制相关 API
│   │   ├── lifestyle.ts       # 生活服务相关 API
│   │   └── settings.ts        # 设置相关 API
│   ├── config.ts              # API 配置（环境变量）
│   ├── errors.ts              # 错误处理类
│   ├── cache.ts               # 缓存管理
│   └── index.ts               # 导出入口
└── stores/
    ├── useChatStore.ts        # 更新以支持 API
    ├── useMonetizationStore.ts # 更新以支持 API
    └── ... (其他 Store 更新)
```

### HTTP 客户端设计

#### 基础配置 (config.ts)

```typescript
// src/services/config.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  useMock: import.meta.env.VITE_USE_MOCK_API === 'true',
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  }
}
```

#### 客户端封装 (client.ts)

```typescript
// src/services/api/client.ts
import { API_CONFIG } from '../config'
import { ApiError, NetworkError, ServerError, ValidationError } from '../errors'

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: unknown
  headers?: Record<string, string>
  timeout?: number
}

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

class HttpClient {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { method, url, data, headers, timeout } = config
    const finalTimeout = timeout || API_CONFIG.timeout
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), finalTimeout)
    
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
        method,
        headers: { ...this.getHeaders(), ...headers },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new ServerError(response.status, response.statusText)
      }
      
      const result = await response.json()
      return result
      
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('请求超时')
      }
      
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new NetworkError('网络连接失败')
    }
  }

  async get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T>(url: string, data?: unknown, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T>(url: string, data?: unknown, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async patch<T>(url: string, data?: unknown, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  async delete<T>(url: string, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }
}

export const httpClient = new HttpClient()
```

### 错误处理设计

```typescript
// src/services/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'API_ERROR'
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class ServerError extends ApiError {
  constructor(
    public status: number,
    message: string
  ) {
    super(message, `SERVER_${status}`)
    this.name = 'ServerError'
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public fields: Record<string, string[]> = {}
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = '未授权访问') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}
```

### 缓存管理设计

```typescript
// src/services/cache.ts
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>()
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  set<T>(key: string, data: T, ttl = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  clearPattern(pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new CacheManager()
```

---

## 接口映射表

### P0 - 核心业务模块

#### Chat (聊天)
| 功能 | Mock 来源 | API 端点 | 方法 |
|------|-----------|----------|------|
| 获取对话列表 | mockChat.ts | /chat/conversations | GET |
| 获取消息历史 | mockChat.ts | /chat/conversations/:id | GET |
| 发送消息 | mockChat.ts | /chat/conversations/:id/messages | POST |
| 流式接收 | mockChat.ts | /chat/conversations/:id/stream | SSE |

#### Monetization (变现)
| 功能 | Mock 来源 | API 端点 | 方法 |
|------|-----------|----------|------|
| 获取钱包余额 | mockMonetization.ts | /monetization/wallet | GET |
| 获取收益数据 | mockMonetization.ts | /monetization/revenue | GET |
| 获取交易历史 | mockMonetization.ts | /monetization/transactions | GET |
| 发起提现 | mockMonetization.ts | /monetization/withdraw | POST |

#### Sphinx (建站)
| 功能 | Mock 来源 | API 端点 | 方法 |
|------|-----------|----------|------|
| 获取模板列表 | mockSphinx.ts | /sphinx/templates | GET |
| 预览网站 | mockSphinx.ts | /sphinx/preview/:id | GET |
| 生成网站 | mockSphinx.ts | /sphinx/generate | POST |
| 发布网站 | mockSphinx.ts | /sphinx/publish/:id | POST |

#### Home (首页)
| 功能 | Mock 来源 | API 端点 | 方法 |
|------|-----------|----------|------|
| 获取模块列表 | mockHome.ts | /home/modules | GET |

### P1 - 重要功能模块 (完整映射见完整文档)
### P2 - 辅助功能模块 (完整映射见完整文档)

---

## 迁移计划

### 阶段一：基础设施准备 (Week 1)
- [ ] 创建 API 服务层架构
- [ ] 配置环境变量
- [ ] 实现 HTTP 客户端
- [ ] 实现错误处理和缓存

### 阶段二：P0 模块迁移 (Week 2)
- [ ] Chat 模块迁移
- [ ] Monetization 模块迁移
- [ ] Sphinx 模块迁移
- [ ] Home 模块迁移

### 阶段三：P1 模块迁移 (Week 3)
- [ ] Marketplace 模块迁移
- [ ] Social 模块迁移
- [ ] Collaboration 模块迁移
- [ ] Memory 模块迁移

### 阶段四：P2 模块迁移 (Week 4)
- [ ] Customize 模块迁移
- [ ] Lifestyle 模块迁移
- [ ] Settings 模块迁移

### 阶段五：测试与优化 (Week 5)
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 移除 Mock 数据开关
- [ ] 文档完善

---

## 环境变量配置

创建 `.env.example` 文件：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080/api

# 是否使用 Mock 数据 (开发环境)
VITE_USE_MOCK_API=true

# API 超时时间 (毫秒)
VITE_API_TIMEOUT=30000

# DeepResearch 工具路径 (可选)
VITE_DEEP_RESEARCH_PATH=

# Flexloop 工具路径 (可选)
VITE_FLEXLOOP_PATH=
```

---

## 风险评估

| 风险项 | 可能性 | 影响 | 缓解措施 |
|--------|-------|------|---------|
| API 规格变更 | 🟡 Medium | 🔴 High | 与后端团队保持密切沟通，使用 API 版本控制 |
| 性能下降 | 🟢 Low | 🟡 Medium | 实现数据缓存，优化请求策略 |
| 错误处理不完善 | 🟡 Medium | 🟡 Medium | 充分测试边界情况，完善错误提示 |
| 迁移时间超期 | 🟡 Medium | 🟢 Low | 分阶段迁移，保持 Mock 数据作为回退选项 |

---

## 时间估算

| 阶段 | 工作量 | 负责人 |
|------|--------|--------|
| 基础设施准备 | 2 人日 | 前端开发 |
| P0 模块迁移 | 4 人日 | 前端开发 |
| P1 模块迁移 | 4 人日 | 前端开发 |
| P2 模块迁移 | 3 人日 | 前端开发 |
| 测试与优化 | 2 人日 | 前端开发 + QA |
| **总计** | **15 人日** | |

---

**文档版本**: v1.0  
**创建日期**: 2026-04-10  
**维护者**: AgentPit 开发团队
