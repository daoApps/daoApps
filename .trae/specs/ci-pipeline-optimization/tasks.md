# CI 流水线优化 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 配置 Vitest 测试环境 setupFiles
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 `vitest.config.ts` 中配置 `setupFiles`
  - 创建测试 setup 文件，全局模拟缺失的浏览器 API（如 `window.matchMedia`）
  - 确保所有浏览器相关的错误都被解决
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 运行 `npm run test:run` 不应出现 `window.matchMedia is not a function` 错误
  - `programmatic` TR-1.2: 所有与浏览器 API 相关的错误都应被解决
  - `human-judgement` TR-1.3: 代码审查应验证 setupFiles 配置合理且有注释
- **Notes**: 可以参考常见的 jsdom 测试环境配置方案

## [/] Task 2: 升级 CI Node.js 版本至 24.x
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 `.github/workflows/ci.yml` 中的 Node.js 版本配置
  - 将 `node-version` 从 `20.x` 升级到 `24.x`
  - 考虑添加 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` 环境变量以避免警告
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-2.1: CI 日志应显示 Node.js 24.x 版本号
  - `programmatic` TR-2.2: CI 的所有步骤（checkout、setup、install、lint、typecheck）都应正常通过
  - `human-judgement` TR-2.3: 代码审查应验证版本配置正确
- **Notes**: 可以先在当前测试分支上测试升级效果

## [ ] Task 3: 审查并修复集成测试用例（shopping-cart.spec.ts）
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 分析 `shopping-cart.spec.ts` 中的失败测试
  - 修复断言错误（NaN 相关问题、商品名称未定义等）
  - 确保购物车功能测试能够准确反映当前实现
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-3.1: `shopping-cart.spec.ts` 中的所有测试应通过
  - `programmatic` TR-3.2: 不应修改核心业务逻辑代码
  - `human-judgement` TR-3.3: 代码审查应验证测试用例修改合理
- **Notes**: 优先修复最简单且最明确的测试失败

## [ ] Task 4: 审查并修复集成测试用例（router-integration.spec.ts）
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 分析 `router-integration.spec.ts` 中的失败测试
  - 修复路由断言和导航相关的错误
  - 确保路由集成测试与当前路由配置一致
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-4.1: `router-integration.spec.ts` 中的所有测试应通过
  - `programmatic` TR-4.2: 路由配置本身不应被修改
  - `human-judgement` TR-4.3: 代码审查应验证测试用例修改合理
- **Notes**: 检查测试中的路由路径是否与实际路由配置匹配

## [ ] Task 5: 审查并修复集成测试用例（form-validation.spec.ts）
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 分析 `form-validation.spec.ts` 中的失败测试
  - 修复验证强度断言错误
  - 确保表单验证测试与当前验证逻辑一致
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-5.1: `form-validation.spec.ts` 中的所有测试应通过
  - `programmatic` TR-5.2: 验证逻辑本身不应被修改
  - `human-judgement` TR-5.3: 代码审查应验证测试用例修改合理
- **Notes**: 检查测试期望的验证强度是否与实际实现一致

## [ ] Task 6: 审查并修复集成测试用例（chat-flow.spec.ts）
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 分析 `chat-flow.spec.ts` 中的失败测试
  - 修复消息类型、消息数量和会话 ID 相关的断言错误
  - 确保聊天流程测试与当前聊天实现一致
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-6.1: `chat-flow.spec.ts` 中的所有测试应通过
  - `programmatic` TR-6.2: 聊天核心逻辑不应被修改
  - `human-judgement` TR-6.3: 代码审查应验证测试用例修改合理
- **Notes**: 检查测试中的时间戳、ID 生成逻辑是否与当前实现匹配

## [ ] Task 7: 验证所有测试用例 100% 通过
- **Priority**: P0
- **Depends On**: Task 1, Task 3, Task 4, Task 5, Task 6
- **Description**: 
  - 运行完整测试套件 `npm run test:run`
  - 确保没有任何测试失败
  - 检查是否有警告需要解决
- **Acceptance Criteria Addressed**: AC-2, AC-5
- **Test Requirements**:
  - `programmatic` TR-7.1: `npm run test:run` 应显示所有测试通过
  - `programmatic` TR-7.2: 不应有任何警告或错误信息
  - `human-judgement` TR-7.3: 测试覆盖率报告应生成且数据合理
- **Notes**: 这是关键的验证步骤，确保后续 CI 能够通过

## [ ] Task 8: 配置 Codecov 集成
- **Priority**: P1
- **Depends On**: Task 7
- **Description**: 
  - 更新 CI 配置以支持 Codecov token 环境变量
  - 确保覆盖率报告正确生成并包含 lcov.info 文件
  - 验证 codecov-action 配置正确
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-8.1: CI 配置文件应正确引用 Codecov token
  - `human-judgement` TR-8.2: 代码审查应验证 CI 配置合理
  - `human-judgement` TR-8.3: 用户应确认 Codecov token 已配置到 GitHub Secrets
- **Notes**: 此任务需要用户配合在 GitHub 仓库配置 Secrets

## [ ] Task 9: 完整 CI 流程验证
- **Priority**: P0
- **Depends On**: Task 2, Task 7, Task 8
- **Description**: 
  - 推送所有更改到测试分支
  - 触发完整 CI 流程
  - 验证所有步骤（lint、typecheck、test、build）都通过
  - 验证覆盖率报告上传（如果 token 已配置）
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-9.1: CI 流水线的所有步骤都应显示为通过状态
  - `programmatic` TR-9.2: CI 运行时间应控制在 5 分钟以内
  - `human-judgement` TR-9.3: 如果 Codecov token 已配置，应验证报告在 Codecov 平台正常显示
- **Notes**: 这是最终验证步骤，确保所有优化工作都达到预期效果
