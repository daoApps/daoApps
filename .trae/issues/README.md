# 问题追踪机制说明

> **目录位置**: `.trae/issues/`  
> **版本**: v1.0  
> **最后更新**: 2026-04-10

---

## 一、目录结构说明

```
.trae/issues/
├── README.md                          # 本文件 - 机制说明文档
├── _template.md                       # 标准问题追踪模板（新建 issue 时复制）
├── BUG-20260410-001-TS编译错误334个.md   # 示例 issue 文档
├── BUG-YYYYMMDD-NNN-{描述}.md          # 实际 issue 文件...
└── _archive/                           # （可选）已关闭的归档 issue
    └── BUG-YYYYMMDD-NNN-{描述}.md
```

### 文件命名规范

**格式**: `BUG-YYYYMMDD-NNN-{简短描述}.md`

| 组成部分 | 说明 | 示例 |
|---------|------|------|
| `BUG-` | 固定前缀，标识为 bug/issue | `BUG-` |
| `YYYYMMDD` | 发现日期（8位数字） | `20260410` |
| `-NNN` | 当日序号（3位数字，从001开始） | `-001` |
| `-{简短描述}` | 问题简短中文描述（无特殊字符） | `-TS编译错误334个` |

**完整示例**: `BUG-20260410-001-TS编译错误334个.md`

---

## 二、问题级别定义

### P0 — 致命 (Critical)

| 属性 | 定义 |
|------|------|
| **定义** | 系统完全不可用、数据丢失风险、安全漏洞、生产构建失败 |
| **响应时间** | **1 小时内**开始处理 |
| **解决目标** | 4 小时内修复或提供临时方案 |
| **通知范围** | 全团队 + 技术负责人 + 产品负责人 |
| **触发条件** | 阻塞所有开发/部署/核心功能 |
| **示例** | TypeScript 编译错误导致构建失败、服务端崩溃、数据库连接丢失 |
| **后续动作** | **必须触发不定期复盘** |

### P1 — 严重 (Major)

| 属性 | 定义 |
|------|------|
| **定义** | 核心功能受损、主要用户流程中断、严重影响用户体验 |
| **响应时间** | **4 小时内**开始处理 |
| **解决目标** | 24 小时内修复 |
| **通知范围** | 相关开发人员 + 技术负责人 |
| **触发条件** | 影响核心业务流程但系统仍可部分运行 |
| **示例** | 主要页面白屏、支付功能异常、关键 API 返回 500、路由跳转失败 |
| **后续动作** | **必须触发不定期复盘** |

### P2 — 一般 (Moderate)

| 属性 | 定义 |
|------|------|
| **定义** | 非核心功能异常、存在绕过方案、影响次要用户体验 |
| **响应时间** | **24 小时内**确认并分配 |
| **解决目标** | 本周内修复 |
| **通知范围** | 负责模块的开发者 |
| **触发条件** | 功能有缺陷但不阻塞主流程 |
| **示例** | 次要按钮样式错误、非必要字段校验失败、边缘场景 bug |
| **后续动作** | 定期复盘时统一回顾 |

### P3 — 低优先级 (Low)

| 属性 | 定义 |
|------|------|
| **定义** | 美化优化建议、性能微调、体验改进、技术债务 |
| **响应时间** | **本周内**确认 |
| **解决目标** | 下个迭代或按优先级排期 |
| **通知范围** | 可在站会中提出 |
| **触发条件** | 不影响功能正确性，仅涉及质量提升 |
| **示例** | 加载动画优化、控制台警告清理、代码重构建议 |
| **后续动作** | 技术债务池统一管理 |

---

## 三、问题生命周期

### 3.1 状态流转图

```
                    ┌─────────────┐
                    │    新建      │
                    │   (New)     │
                    └──────┬──────┘
                           │ 发现/报告
                           ▼
                    ┌─────────────┐
              ┌─────│    确认      │◄────────────┐
              │     │ (Confirmed) │             │
              │     └──────┬──────┘             │
              │            │ 分配               │ 重新打开
              │            ▼                    │ (reopen)
              │     ┌─────────────┐             │
              │     │   处理中     │─────────────┘
              │     │(In Progress)│
              │     └──────┬──────┘
              │            │ 修复完成
              │            ▼
              │     ┌─────────────┐
              │     │   已解决     │
              │     │  (Resolved)  │
              │     └──────┬──────┘
              │            │ 验证通过
              │            ▼
              │     ┌─────────────┐
              └────►│   已关闭     │
                    │  (Closed)    │
                    └─────────────┘
```

### 3.2 各状态详细说明

| 状态 | 英文 | 进入条件 | 退出条件 | 操作人 |
|------|------|---------|---------|--------|
| **新建** | New | 问题被发现或报告 | 确认为有效问题后进入"确认"；确认为无效则直接关闭 | 任何人 |
| **确认** | Confirmed | 问题被验证为真实存在 | 分配给具体开发者后进入"处理中" | 技术负责人 |
| **处理中** | In Progress | 开发者开始修复工作 | 代码修改完成并通过自测后进入"已解决" | 负责开发者 |
| **已解决** | Resolved | 修复代码已提交 | 验证通过后进入"已关闭"；验证失败返回"处理中" | 开发者/QA |
| **已关闭** | Closed | 问题验证通过且无回归 | 如问题复现可重新打开 | QA/技术负责人 |
| **重新打开** | Reopened | 已关闭的问题再次出现 | 重新进入"处理中"状态 | 任何人 |

### 3.3 时间线要求

| 状态转换 | 最大等待时间 | 超时升级机制 |
|---------|-------------|-------------|
| 新建 → 确认 | 2 小时 | 自动升级严重程度一级 |
| 确认 → 处理中 | P0:1h / P1:4h / P2:24h / P3:本周 | 超时上报技术负责人 |
| 处理中 → 已解决 | P0:4h / P1:24h / P2:72h / P3:两周 | 申请延期或升级 |
| 已解决 → 已关闭 | 24 小时内 | 自动通过或要求补充验证 |

---

## 四、错误处理三步法流程

本项目采用标准化的 **捕获 → 记录 → 响应** 三步法进行错误处理：

### Step 1: 捕获 (Capture)

#### 1.1 全局错误边界

```typescript
// src/App.vue 或 main.ts
app.config.errorHandler = (err, instance, info) => {
  // 捕获 Vue 组件渲染错误
  Logger.error('Global Vue Error', { err, instance, info })
}
```

```typescript
// src/utils/errorBoundary.ts
window.onerror = (message, source, lineno, colno, error) => {
  // 捕获 JS 运行时错误
  Logger.error('Runtime Error', { message, source, lineno, colno, error })
}

window.onunhandledrejection = (event) => {
  // 捕获未处理的 Promise rejection
  Logger.error('Unhandled Rejection', { reason: event.reason })
}
```

#### 1.2 组件级错误处理

```vue
<!-- 使用 ErrorBoundary 组件包裹关键模块 -->
<template>
  <ErrorBoundary @error="handleError" fallback="组件加载失败">
    <MonetizationModule />
  </ErrorBoundary>
</template>
```

#### 1.3 API 层错误拦截

```typescript
// src/api/client.ts
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 统一处理 HTTP 错误
    const errorInfo = {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      timestamp: new Date().toISOString()
    }
    
    // 根据状态码分类处理
    switch (error.response?.status) {
      case 401: handleUnauthorized(); break
      case 403: handleForbidden(); break
      case 404: handleNotFound(); break
      case 500: handleServerError(); break
      default: handleUnknownError(errorInfo)
    }
    
    Logger.error('API Error', errorInfo)
    return Promise.reject(error)
  }
)
```

### Step 2: 记录 (Record)

#### 2.1 结构化日志记录

```typescript
// src/utils/logger.ts
interface LogEntry {
  level: 'error' | 'warn' | 'info'
  timestamp: string
  module: string           // 来源模块
  action: string           // 触发操作
  error?: Error            // 错误对象
  context?: Record<string, any>  // 上下文信息
  userId?: string          // 用户标识（如可用）
  sessionId?: string       // 会话标识
}

class Logger {
  static error(message: string, context: object) {
    const entry: LogEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      module: this.getCallerModule(),
      action: message,
      ...context
    }
    
    // 控制台输出
    console.error(`[${entry.module}] ${message}`, entry)
    
    // 发送到日志服务（生产环境）
    if (import.meta.env.PROD) {
      this.sendToLogService(entry)
    }
    
    // 触发 issue 创建（P0/P1 级别）
    if (this.shouldCreateIssue(entry)) {
      this.createIssueDocument(entry)
    }
  }
}
```

#### 2.2 Issue 文档创建

当捕获到需要追踪的错误时，按以下步骤创建 issue 文档：

1. **复制模板**: 复制 `_template.md` 为新文件
2. **填写基本信息**: 编号、标题、严重程度、时间等
3. **记录问题描述**: 现象、复现步骤、预期/实际行为
4. **执行 RCA 分析**: 至少 3 层 Why 分析
5. **制定解决方案**: 修复方案、实施步骤、验证方法
6. **跟踪修复进度**: 更新时间线和状态

### Step 3: 响应 (Respond)

#### 3.1 用户友好提示

```typescript
// src/composables/useErrorHandler.ts
export function useErrorHandler() {
  const showErrorToast = (error: AppError) => {
    const messages: Record<string, string> = {
      NETWORK_ERROR: '网络连接失败，请检查网络后重试',
      SERVER_ERROR: '服务器暂时不可用，请稍后再试',
      UNAUTHORIZED: '登录已过期，请重新登录',
      VALIDATION_ERROR: '输入信息有误，请检查后提交',
      UNKNOWN_ERROR: '发生了未知错误，请联系客服'
    }
    
    toast.error(messages[error.code] || messages.UNKNOWN_ERROR)
  }
  
  return { showErrorToast }
}
```

#### 3.2 自动恢复与降级

```typescript
// 自动重试机制
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 3, delay = 1000 } = options
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await sleep(delay * Math.pow(2, i)) // 指数退避
    }
  }
  
  throw new Error('Max retries exceeded')
}

// 功能降级示例
function getChartData(): ChartData[] {
  try {
    return fetchRealTimeData()  // 尝试获取实时数据
  } catch (error) {
    Logger.warn('Real-time data failed, using cached', { error })
    return getCachedData()      // 降级到缓存数据
  }
}
```

#### 3.3 开发者通知机制

| 严重程度 | 通知方式 | 通知对象 | 时机 |
|---------|---------|---------|------|
| **P0** | 即时消息 + 邮件 + 电话 | 全团队 + TL | 立即 |
| **P1** | 即时消息 + 邮件 | 相关开发者 + TL | 30 分钟内 |
| **P2** | 邮件 + 站会提及 | 负责开发者 | 当日 |
| **P3** | Issue 列表更新 | 团队可见 | 下次站会 |

---

## 五、问题分类体系

### 5.1 分类维度

| 分类编码 | 类别名 | 说明 | 典型示例 |
|---------|-------|------|---------|
| **TS** | TypeScript 错误 | 类型检查、编译错误 | 类型不匹配、缺少属性、泛型错误 |
| **RT** | 运行时错误 | 执行期间的异常 | null 引用、undefined 访问、异步错误 |
| **API** | API 错误 | 后端接口相关 | HTTP 4xx/5xx、超时、数据格式错误 |
| **BLD** | 构建错误 | 构建打包过程失败 | webpack/vite 配置错误、依赖冲突 |
| **TST** | 测试失败 | 单元/集成/E2E 测试未通过 | 断言失败、mock 错误、环境问题 |
| **UI** | UI/UX 问题 | 界面显示或交互异常 | 样式错乱、布局错位、动画失效 |
| **PF** | 性能问题 | 性能指标不达标 | 加载缓慢、内存泄漏、卡顿 |
| **SEC** | 安全问题 | 安全漏洞或风险 | XSS、CSRF、敏感信息泄露 |
| **DEP** | 依赖问题 | 第三方库相关问题 | 版本冲突、废弃 API、许可证问题 |
| **CFG** | 配置错误 | 项目配置文件问题 | tsconfig、vite.config、env 配置 |

### 5.2 标签系统

每个 issue 应包含至少一个分类标签，格式：`[分类编码]`

**示例**: 
- `[TS] TypeScript 334 个编译错误`
- `[API] 用户登录接口 500 错误`
- `[BLD] Vite 生产构建失败`

---

## 六、响应时间要求汇总

| 级别 | 响应时限 | 解决时限 | 升级条件 | 复盘要求 |
|------|---------|---------|---------|---------|
| **P0 致命** | 1 小时 | 4 小时 | 超 30min 未响应 | ✅ 必须触发 |
| **P1 严重** | 4 小时 | 24 小时 | 超 8h 未响应 | ✅ 必须触发 |
| **P2 一般** | 24 小时 | 本周内 | 超 48h 未响应 | ⚠️ 视情况 |
| **P3 低** | 本周内 | 下迭代 | 超 1 周未响应 | ❌ 不强制 |

### SLA 计算规则

1. **工作时间计算**: 仅在工作日 9:00-18:00 内计算（可根据团队实际情况调整）
2. **节假日顺延**: 法定节假日不计入响应时间
3. **并行问题**: 同一开发者同时处理多个问题时，P0/P1 优先
4. **升级路径**: P0→TL+PM / P1→TL / P2→Team Lead / P3→Self-managed

---

## 七、与复盘机制的联动

### 7.1 强制复盘触发条件

以下情况 **必须** 触发不定期复盘：

| 条件 | 详细说明 | 复盘类型 |
|------|---------|---------|
| **P0 问题发生** | 任何 P0 级别问题 | 📋 完整复盘（7 步流程） |
| **P1 问题发生** | 任何 P1 级别问题 | 📋 完整复盘（7 步流程） |
| **同类问题复发** | 相同根因的问题出现 ≥2 次 | 📋 根因专项复盘 |
| **重大影响** | 影响用户 >100 人或损失 >阈值 | 📋 影响评估复盘 |
| **新类型问题** | 首次遇到的全新类别问题 | 📋 经验提取复盘 |

### 7.2 复盘与 Issue 的关联方式

1. **Issue 文档引用复盘**: 在 issue 的「关联信息」章节添加复盘文档链接
2. **复盘文档引用 Issue**: 在复盘文档的「问题清单」中引用对应 issue 编号
3. **双向追溯**: 确保从 issue 能找到复盘，从复盘能找到 issue

**关联示例**:

在 Issue 文档中：
```markdown
### 9.3 相关复盘文档

| 文档路径 | 复盘名称 | 关键结论 |
|---------|---------|---------|
| `.trae/reviews/phase0-7-systematic-review.md` | Phase 0-7 系统性复盘 | 334 TS 错误已通过分层策略修复 |
```

在复盘文档中：
```markdown
### 2.1 问题清单总览

| # | 问题 | Issue 编号 | 严重度 | 状态 |
|---|------|-----------|--------|------|
| P1 | TypeScript 334 个编译错误 | BUG-20260410-001 | 🔴 致命 | ✅ 已解决 |
```

### 7.3 复盘产出转化为预防措施

复盘完成后，将经验教训和预防措施同步回对应的 issue 文档：

1. 从复盘文档中提取 **最佳实践**
2. 更新 issue 的「预防措施」章节
3. 将通用预防措施添加到项目规范或 CI/CD 流程
4. 对于工具/配置改进，创建新的 issue 进行跟踪

---

## 八、使用指南

### 8.1 新建 Issue 的完整流程

```
1. 发现问题
   ↓
2. 评估严重程度 (P0-P3)
   ↓
3. 复制 .trae/issues/_template.md
   ↓
4. 重命名为 BUG-YYYYMMDD-NNN-{描述}.md
   ↓
5. 填写第一至第三章（基本信息、描述、影响）
   ↓
6. 执行初步 RCA（至少 3 层 Why）
   ↓
7. 制定解决方案和实施计划
   ↓
8. 开始修复工作
   ↓
9. 更新进度和时间线
   ↓
10. 完成验证，填写回归测试结果
    ↓
11. 提取经验教训和预防措施
    ↓
12. 关闭 Issue（或归档）
```

### 8.2 快速参考卡片

#### 创建新 Issue 时必须填写的字段：

- [ ] **编号**: 按命名规范生成
- [ ] **标题**: 简明扼要（≤50 字符）
- [ ] **严重程度**: P0/P1/P2/P3
- [ ] **现象描述**: 清晰描述看到了什么
- [ ] **复现步骤**: 可操作的步骤列表
- [ ] **预期 vs 实际**: 对比说明
- [ ] **RCA 分析**: 至少 3 层 Why
- [ ] **解决方案**: 具体可执行的修复方案
- [ ] **验证方法**: 如何确认修复有效

#### Issue 状态变更 checklist：

- [ ] 新建 → 确认: 已验证问题真实性
- [ ] 确认 → 处理中: 已分配负责人
- [ ] 处理中 → 已解决: 代码已提交
- [ ] 已解决 → 已关闭: 验证通过无回归
- [ ] 任意 → 重新打开: 记录复现原因

### 8.3 常用命令速查

```bash
# 查看 issue 列表
ls .trae/issues/*.md | grep -v "_template" | grep -v "README"

# 统计各状态 issue 数量
grep -l "状态.*处理中" .trae/issues/*.md | wc -l

# 查找特定级别的 open issues
grep -rl "P0\|P1" .trae/issues/*.md | grep -v "已关闭"

# 搜索特定类型的 issues
grep -rl "\[TS\]" .trae/issues/*.md
```

---

## 九、维护与改进

### 9.1 定期审查

| 审查项 | 频率 | 负责人 | 动作 |
|-------|------|--------|------|
| Open Issues 清理 | 每周 | Tech Lead | 关闭过期/无效 issues |
| 模板更新 | 每季度 | 团队共识 | 根据实际使用反馈优化 |
| 机制有效性评估 | 每月 | PM + TL | 统计 MTTR（平均修复时间） |
| 归档旧 Issues | 每月 | 任意开发者 | 移动已关闭 >30 天的 issues 到 `_archive/` |

### 9.2 反馈渠道

- 在周会中讨论机制改进建议
- 通过 issue 提出机制本身的优化需求
- 定期收集团队成员的使用体验

---

## 十、附录

### A. 与其他机制的协作关系

```
                    ┌─────────────────┐
                    │   Code Review   │
                    │   (PR 审核)     │
                    └────────┬────────┘
                             │ 可能发现新问题
                             ▼
                    ┌─────────────────┐
                    │  Issue Tracking │ ◄────┐
                    │  (本机制)        │      │
                    └────────┬────────┘      │
                             │ P0/P1 触发     │
                             ▼                │
                    ┌─────────────────┐      │
                    │   Postmortem    │──────┘
                    │   (复盘机制)     │  产出预防措施
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   CI/CD Pipeline│
                    │  (自动化检查)   │ ← 应用预防措施
                    └─────────────────┘
```

### B. 工具推荐

| 用途 | 推荐工具 | 备注 |
|------|---------|------|
| Issue 管理（可选） | GitHub Issues / Jira / Linear | 本地 Markdown 方案为轻量替代 |
| 日志收集 | Sentry / Datadog | 生产环境必备 |
| 错误监控 | Sentry | 前端错误自动捕获 |
| 性能监控 | Lighthouse CI | 构建流水线集成 |
| 告警通知 | Slack / 钉钉 / 企业微信 | 根据 team 习惯选择 |

### C. 参考资料

- [本项目的复盘机制](../reviews/README.md)
- [复盘文档模板](../reviews/_template.md)
- [Phase 0-7 系统性复盘（含 334 TS 错误完整案例）](../reviews/phase0-7-systematic-review.md)

---

**文档维护人**: AgentPit 开发团队  
**最后审核**: 待审核  
**下次审查日期**: 2026-05-10
