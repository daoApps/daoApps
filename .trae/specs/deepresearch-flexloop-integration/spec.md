# DeepResearch 智能体集成规范

## Why

当前 Flexloop 项目中已有一个基础的 `useDeepResearch.ts` composable，但仅通过子进程调用 CLI 方式集成 DeepResearch，功能有限且稳定性不足。需要基于 DeepResearch 框架构建一个完整的智能体系统，提供标准化的 API 接口，使 Flexloop 能够通过更稳定可靠的方式调用 DeepResearch 的深度研究能力，实现自主学习、任务调度和自主决策等核心功能。

## What Changes

- **新增**：在 DeepResearch 项目中添加 RESTful API 服务层（FastAPI），提供标准化接口
- **新增**：Python 后端服务支持异步任务处理和状态查询
- **新增**：TypeScript 客户端 SDK，供 Flexloop 前端调用
- **升级**：重构 Flexloop 中的 `useDeepResearch` composable，改为调用 API 服务
- **新增**：任务状态管理和进度推送（支持 SSE）
- **新增**：错误处理和重试机制
- **新增**：完整的集成文档和使用示例
- **新增**：数据传输安全验证机制

## Impact

- Affected specs: `deepresearch-flexloop-integration`
- Affected code:
  - `tools/DeepResearch/src/deepresearch/api/` - 新增 API 服务层
  - `tools/DeepResearch/pyproject.toml` - 添加新的依赖
  - `apps/Flexloop/src/services/deepresearch/` - 新增客户端服务
  - `apps/Flexloop/src/composables/useDeepResearch.ts` - 重构现有实现
  - `apps/Flexloop/src/components/` - 新增研究结果展示组件
  - `apps/Flexloop/docs/` - 新增集成文档

## ADDED Requirements

### Requirement: API 服务接口

DeepResearch 项目 SHALL 提供一个独立的 FastAPI 服务，暴露以下端点：

- `POST /api/v1/research` - 创建新的研究任务
- `GET /api/v1/research/{task_id}` - 获取任务状态和结果
- `GET /api/v1/research/{task_id}/stream` - SSE 实时进度推送
- `DELETE /api/v1/research/{task_id}` - 取消任务
- `GET /api/v1/health` - 健康检查
- `GET /api/v1/version` - 获取版本信息

#### Scenario: 成功创建研究任务

- **WHEN** Flexloop 客户端调用 `POST /api/v1/research` 提交查询
- **THEN** API 服务返回 `task_id`，任务异步执行，返回 HTTP 202

#### Scenario: 查询任务状态

- **WHEN** 客户端调用 `GET /api/v1/research/{task_id}`
- **THEN** 返回任务当前状态（pending/running/completed/failed/cancelled）和结果数据

#### Scenario: 实时进度推送

- **WHEN** 客户端连接 `GET /api/v1/research/{task_id}/stream`
- **THEN** 服务端通过 SSE 推送阶段性进度和最终结果

### Requirement: 自主学习能力

智能体 SHALL 支持：

- 基于渐进式搜索的多轮迭代学习
- 交叉评估已获取知识，自动发现知识缺口并补充搜索
- 动态调整研究深度和广度
- 保留研究历史，支持增量学习

### Requirement: 任务调度

系统 SHALL 支持：

- 异步任务队列处理
- 任务优先级管理
- 并发控制
- 超时自动取消
- 任务取消机制

### Requirement: 自主决策

智能体 SHALL 能够：

- 判断问题是否需要深度搜索
- 自动澄清模糊问题
- 决定研究终止时机
- 评估信息完整性和新鲜度

### Requirement: TypeScript 客户端 SDK

Flexloop 项目 SHALL 提供：

- 完整的 TypeScript 类型定义
- 封装好的 API 客户端类
- 响应式 composable (`useDeepResearch`)
- 支持轮询和 SSE 两种模式
- 自动错误处理和重试

### Requirement: 通信安全

系统 SHALL 确保：

- API 密钥认证机制
- 请求输入验证和清理
- 输出内容净化（防止 XSS）
- CORS 配置支持跨域访问

### Requirement: 集成文档

项目 SHALL 提供：

- 部署指南（独立服务部署）
- 环境变量配置说明
- API 接口文档
- 前端集成示例
- 常见问题排查

## MODIFIED Requirements

### Requirement: 现有 useDeepResearch

重构现有的 `useDeepResearch` 实现：

- 保留原有的类型定义接口
- 改为调用 API 服务而非子进程
- 增加进度跟踪和状态管理
- 提供更好的错误信息

**BREAKING**: 原有子进程调用方式将被弃用，但保留兼容层。

