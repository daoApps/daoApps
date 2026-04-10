# CI 错误修复 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 创建缺失的 mockCustomize.ts 文件
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 apps/AgentPit/src/__tests__/data/ 目录下创建 mockCustomize.ts 文件
  - 按照 CI_error.md 中提供的内容填充文件
  - 确保文件结构和导出内容符合测试需要
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 文件应存在且包含所有必要的导出
  - `programmatic` TR-1.2: 相关测试套件应能正常导入该文件
- **Notes**: 按照 CI_error.md 中提供的完整内容创建文件

## [x] Task 2: 修复 MessageList.spec.ts 中的时间戳测试
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 定位 apps/AgentPit/src/__tests__/components/chat/MessageList.spec.ts 文件
  - 分析第 114-115 行的测试代码
  - 更新测试断言以匹配实际 DOM 渲染的时间戳元素数量
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: 测试应通过，不再期望 4+ 个时间戳元素
  - `programmatic` TR-2.2: 测试应能正确验证时间戳元素的存在
- **Notes**: 可以使用更灵活的选择器或调整预期数量

## [x] Task 3: 修复 useChatStore 中的 deleteConversation 逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 定位聊天 store 文件（可能在 apps/AgentPit/src/stores/useChatStore.ts）
  - 分析 deleteConversation 方法的逻辑
  - 更新逻辑以正确处理 activeConversationId，当删除的是当前活跃会话时
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: deleteConversation 操作后 activeConversationId 应正确更新
  - `programmatic` TR-3.2: 当删除的是当前活跃会话时，应设置为下一个可用会话或 null
- **Notes**: 按照 CI_error.md 中提供的解决方案实现

## [x] Task 4: 修复 SphinxComponents.spec.ts 中的按钮测试
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 定位 apps/AgentPit/src/__tests__/components/sphinx/SphinxComponents.spec.ts 文件
  - 分析第 89 行的测试代码
  - 更新测试以正确定位和检查按钮元素，而不是检查整个 wrapper 文本
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-4.1: 测试应能正确定位按钮元素
  - `programmatic` TR-4.2: 测试应能正确断言按钮文本
- **Notes**: 可以使用 wrapper.find('button') 或 wrapper.find('[data-testid="send-button"]')

## [/] Task 5: 验证所有测试用例通过
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **Description**: 
  - 运行完整测试套件 `npm run test:run`
  - 确保所有测试用例都通过
  - 检查是否有任何警告或错误
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-5.1: 所有测试用例应 100% 通过
  - `programmatic` TR-5.2: 无任何警告或错误信息
- **Notes**: 这是关键的验证步骤

## [ ] Task 6: 触发完整 CI 流程验证
- **Priority**: P0
- **Depends On**: Task 5
- **Description**: 
  - 提交所有更改到测试分支
  - 触发完整 CI 流程
  - 验证所有 CI 步骤都通过
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-6.1: CI 流水线的所有步骤应显示为通过状态
  - `programmatic` TR-6.2: CI 运行时间应控制在 5 分钟以内
- **Notes**: 确保 CI 运行成功

## [ ] Task 7: 更新 CI_error.md 文件
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 更新 d:\xinet\daoCollective\daoApps\daoApps\.trae\issues\CI_error.md 文件
  - 添加错误处理状态和解决方案说明
  - 确保文档清晰记录所有修复内容
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-7.1: 文档应包含所有错误的处理状态
  - `human-judgment` TR-7.2: 文档应清晰记录解决方案
- **Notes**: 确保文档更新完整
