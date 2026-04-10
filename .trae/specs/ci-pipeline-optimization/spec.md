# CI 流水线优化 - Product Requirement Document

## Overview
- **Summary**: 优化 AgentPit 项目的 CI 流水线配置，解决当前测试环境问题，升级 Node.js 版本，完善测试覆盖报告，确保 CI 流程能够稳定、完整地运行。
- **Purpose**: 解决当前 CI 流水线中存在的测试环境配置、测试用例兼容性、Node.js 版本过时以及代码覆盖率报告缺失等问题，提高开发质量和构建稳定性。
- **Target Users**: 开发团队、DevOps 工程师

## Goals
- 修复测试环境中的浏览器 API 缺失问题，确保所有测试用例能够正常运行
- 更新集成测试用例，使其与当前代码逻辑保持一致
- 升级 CI 中的 Node.js 版本，获取最新特性和安全更新
- 配置并启用代码覆盖率报告上传功能
- 确保完整 CI 流程（lint、typecheck、test、build）能够 100% 通过

## Non-Goals (Out of Scope)
- 不会重写或重构核心业务逻辑代码
- 不会添加新的功能或特性
- 不会大幅修改现有的测试架构
- 不会升级生产环境的 Node.js 版本（仅 CI 环境）

## Background & Context
- 当前 CI 流水线已基本配置完成，但在单元测试阶段存在问题
- Vitest 配置中已启用 jsdom 环境，但部分测试仍因浏览器 API 缺失而失败
- CI 使用 Node.js 20.x，但 GitHub Actions 已提示该版本即将废弃
- 代码覆盖率报告上传功能已配置，但需要 Codecov token 才能正常工作
- 部分集成测试用例与当前代码实现不匹配，导致断言失败

## Functional Requirements
- **FR-1**: 配置 Vitest 测试环境，确保所有浏览器 API 都有正确的 polyfill 或模拟
- **FR-2**: 审查并更新所有集成测试用例，修复失败的断言
- **FR-3**: 升级 CI 配置中的 Node.js 版本至 24.x
- **FR-4**: 配置 Codecov token 环境变量，确保覆盖率报告能够正常上传

## Non-Functional Requirements
- **NFR-1**: 完整 CI 流水线运行时间不超过 5 分钟
- **NFR-2**: 所有测试用例必须 100% 通过，无任何失败或警告
- **NFR-3**: CI 配置变更必须有充分的注释，便于后续维护
- **NFR-4**: 代码覆盖率报告必须能够在 Codecov 平台正常显示

## Constraints
- **Technical**: 必须使用现有的 Vitest 测试框架，不得更换测试工具
- **Business**: 优化工作应在 1 个工作日内完成
- **Dependencies**: 依赖 GitHub Secrets 功能配置 Codecov token

## Assumptions
- 假设用户有权限在 GitHub 仓库中配置 Secrets
- 假设 Codecov 平台对该仓库已启用
- 假设升级 Node.js 版本不会导致构建或依赖兼容性问题
- 假设 Vitest 的 jsdom 环境能够满足所有浏览器 API 需求

## Acceptance Criteria

### AC-1: 测试环境配置优化
- **Given**: Vitest 配置已启用 jsdom 环境
- **When**: 运行 `npm run test:run` 命令
- **Then**: 所有与浏览器 API 相关的错误（如 `window.matchMedia is not a function`）都应被解决
- **Verification**: `programmatic`
- **Notes**: 可以通过添加 setupFiles 来全局模拟缺失的浏览器 API

### AC-2: 集成测试用例更新
- **Given**: 完整的测试套件已运行
- **When**: 所有失败的测试用例都已审查并修复
- **Then**: 运行 `npm run test:run` 应该显示 100% 通过
- **Verification**: `programmatic`
- **Notes**: 修复测试用例时不应修改核心业务逻辑，应调整测试断言或模拟数据

### AC-3: Node.js 版本升级
- **Given**: CI 配置文件已修改
- **When**: 触发新的 CI 运行
- **Then**: CI 应使用 Node.js 24.x 版本，且所有步骤能够正常执行
- **Verification**: `programmatic`
- **Notes**: 可以在 CI 日志中验证 Node.js 版本号

### AC-4: 代码覆盖率报告上传
- **Given**: Codecov token 已配置到 GitHub Secrets
- **When**: CI 流水线完成测试阶段
- **Then**: 覆盖率报告应成功上传到 Codecov 平台
- **Verification**: `human-judgment`
- **Notes**: 需要在 Codecov 平台手动验证报告是否正常显示

### AC-5: 完整 CI 流程通过
- **Given**: 所有优化工作已完成
- **When**: 提交 Pull Request 触发完整 CI 流程
- **Then**: CI 流水线的所有步骤（lint、typecheck、test、build）都应显示为通过状态
- **Verification**: `programmatic`

## Open Questions
- [ ] Codecov token 是否已获取并准备好配置到 GitHub Secrets？
- [ ] 是否有特定的测试覆盖率阈值要求？
- [ ] 除了 jsdom 外，是否需要考虑其他浏览器测试环境（如 Playwright）？
