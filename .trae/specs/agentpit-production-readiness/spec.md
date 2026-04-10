# AgentPit 生产就绪性提升 Spec

## Why
AgentPit Vue3 重构项目已完成核心功能开发，但在生产环境部署前仍存在关键问题需要解决：ESLint 环境兼容性问题阻碍代码质量检查、生产构建未经验证、缺乏规范的 Git 提交历史和版本标签、大量 Mock 数据需替换为真实 API 调用、以及缺少 CI/CD 自动化流水线。这些问题直接影响项目的可维护性、可靠性和交付质量。

## What Changes
- 🔴 **解决 ESLint 环境问题**：分析并修复 Node.js 版本与 ESLint 配置的兼容性问题，确保 lint 检查顺利执行
- 🔴 **执行生产构建验证**：运行完整的构建流程并使用 Lighthouse 进行性能测试，确保构建产物达到生产标准
- 🔴 **Git 提交与版本标签规范化**：按照 git-versioning-guide.md 执行 7 个逻辑清晰的 Git 提交，创建版本标签
- 🟡 **真实 API 对接**：梳理所有 Mock 数据模块，制定 API 对接方案，实现错误处理和数据转换逻辑
- 🟡 **CI/CD 流水线搭建**：配置 GitHub Actions 自动化流水线，包含代码检查、测试、构建和部署环节

## Impact
- Affected specs: agentpit-vue3-rewrite, agentpit-improvements, agentpit-continuation
- Affected code:
  - `apps/AgentPit/eslint.config.js` - ESLint 配置优化
  - `apps/AgentPit/package.json` - 构建脚本和环境配置
  - `apps/AgentPit/src/data/*.ts` - Mock 数据替换为 API 调用
  - `apps/AgentPit/src/stores/*.ts` - Store 层添加 API 集成
  - `.github/workflows/` - 新增 CI/CD 配置文件
  - Git 历史记录和版本标签

## ADDED Requirements

### Requirement: ESLint 环境兼容性保障
系统 SHALL 确保 ESLint 在当前开发环境和 CI 环境中能够无错误运行。

#### Scenario: Node.js 版本兼容性检查
- **WHEN** 开发者运行 `npm run lint` 或 `npm run lint:check`
- **THEN** 命令应成功执行，返回 Exit Code 0（无 lint 错误）或仅报告代码质量问题（非环境错误）
- **AND** 不应出现 "ERR_OSSL_EVP_UNSUPPORTED" 或其他 Node.js 版本相关的运行时错误

#### Scenario: CI 环境 ESLint 执行
- **WHEN** GitHub Actions 工作流触发 ESLint 检查步骤
- **THEN** 使用预配置的 Node.js 版本（推荐 v20 LTS）成功执行 lint 检查
- **AND** 检查结果应与本地环境一致

### Requirement: 生产构建质量验证
系统 SHALL 确保生产环境构建成功且产物符合性能标准。

#### Scenario: 成功的生产构建
- **WHEN** 运行 `npm run build`（包含 vue-tsc 类型检查和 vite build）
- **THEN** 构建过程无错误完成，Exit Code 为 0
- **AND** 生成完整的 dist/ 目录，包含压缩后的 JS/CSS/HTML 文件
- **AND** 构建日志显示正确的 chunk 分割和资源哈希

#### Scenario: Lighthouse 性能测试
- **WHEN** 使用 Lighthouse 对构建产物进行审计（Performance、Accessibility、Best Practices、SEO）
- **THEN** Performance 分数 ≥ 80（移动端和桌面端）
- **AND** Accessibility 分数 ≥ 90
- **AND** Best Practices 分数 ≥ 90
- **AND** 无 Critical 级别的性能问题

### Requirement: 规范化的版本控制
系统 SHALL 遵循 Conventional Commits 规范进行 Git 提交，并创建语义化版本标签。

#### Scenario: 7 个逻辑提交的执行
- **WHEN** 按照 git-versioning-guide.md 的指导执行 Git 提交
- **THEN** 完成 7 个独立的 commit，每个 commit 有明确的 scope 和描述
- **AND** 提交消息符合 `<type>(<scope>): <subject>` 格式
- **AND** 每个 commit 的变更范围合理，避免过大或过小的提交

#### Scenario: 版本标签创建与推送
- **WHEN** 所有提交完成后创建 annotated tag
- **THEN** 标签名称遵循语义化版本规范（如 v3.0.0-vue3-rewrite-complete）
- **AND** 标签消息包含完整的版本说明、里程碑和关键指标
- **AND** 标签成功推送到远程仓库

### Requirement: API 集成架构设计
系统 SHALL 提供从 Mock 数据到真实 API 的迁移路径和实现方案。

#### Scenario: Mock 数据梳理与分析
- **WHEN** 分析 src/data/ 目录下的所有 mock 数据文件
- **THEN** 输出完整的 Mock 数据清单，包括：
  - 文件名和路径
  - 导出的数据结构和类型
  - 使用该数据的组件/Store 列表
  - 建议的 API 端点映射
- **AND** 识别优先级（P0: 核心业务 > P1: 重要功能 > P2: 辅助功能）

#### Scenario: API 服务层实现
- **WHEN** 创建 API 服务层（src/services/api.ts）
- **THEN** 实现通用的 HTTP 客户端封装（基于 fetch 或 axios）
- **AND** 包含请求/响应拦截器、错误处理、token 管理
- **AND** 支持请求取消、重试机制、超时设置

#### Scenario: Store 层 API 集成
- **WHEN** 将 Pinia Store 中的 Mock 数据替换为 API 调用
- **THEN** 保持 Store 的接口不变（对组件透明）
- **AND** 添加 loading、error 状态管理
- **AND** 实现数据缓存和更新策略

### Requirement: CI/CD 自动化流水线
系统 SHALL 配置完整的持续集成和持续部署流水线。

#### Scenario: PR 触发的 CI 流水线
- **WHEN** 向 main 分支提交 Pull Request
- **THEN** 自动触发以下检查：
  - 代码格式检查（Prettier）
  - 代码质量检查（ESLint）
  - TypeScript 类型检查（vue-tsc）
  - 单元测试执行（Vitest）
  - 测试覆盖率报告生成
  - 生产构建验证（vite build）
- **AND** 所有检查通过后才允许合并

#### Scenario: 主分支推送触发的 CD 流水线
- **WHEN** 代码合并到 main 分支
- **THEN** 自动执行：
  - 运行完整的测试套件
  - 执行生产构建
  - 构建容器镜像（可选）
  - 部署到 staging 环境
  - 运行 E2E 测试（可选）
  - 部署到 production 环境（需手动批准）
- **AND** 发送部署通知到相关频道

#### Scenario: 环境变量和密钥管理
- **WHEN** CI/CD 流水线需要访问敏感信息
- **THEN** 使用 GitHub Secrets 安全存储：
  - API 密钥和 Token
  - 部署凭证
  - 服务账户密钥
- **AND** 避免在代码中硬编码敏感信息

## MODIFIED Requirements

### Requirement: 项目依赖管理
修改 package.json 以支持新的构建和部署需求：

- 添加 `@lhci/cli` 作为开发依赖（用于 Lighthouse CI）
- 更新 Node.js engine 字段指定兼容版本范围
- 添加 `preview:prod` 脚本用于预览生产构建产物
- 可选：添加 `axios` 作为 HTTP 客户端（如果选择 axios 而非 fetch）

### Requirement: ESLint 配置优化
优化 eslint.config.js 以提高兼容性和稳定性：

- 添加 Node.js 版本兼容性配置
- 优化 parserOptions 以减少误报
- 添加 CI 特定的规则覆盖（如需）
- 确保配置在 Node.js 18/20/22 上都能正常运行

## REMOVED Requirements

### Requirement: 硬编码的 Mock 数据导入
**原因**: Mock 数据应在开发阶段使用，生产环境必须连接真实 API
**Migration**:
1. 保留 mock 数据文件用于开发和测试
2. 创建环境变量开关（VITE_USE_MOCK_API=true/false）
3. 在 Store 层根据环境变量选择数据源
4. 逐步将各模块从 Mock 迁移到 API
