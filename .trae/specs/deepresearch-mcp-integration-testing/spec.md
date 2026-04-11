# DeepResearch MCP 集成测试规范

## Why

DeepResearch MCP 多智能体协作平台已经完成开发并部署，需要进行全面的集成测试，验证：
1. 两个服务（DeepResearch 后端 + Flexloop 前端）连接正常
2. MCP API 端点功能正常
3. 深度研究能力正确集成并能被调用
4. 系统在各种场景下的稳定性和性能

## What Changes

- **新增**：完整的测试执行计划和测试用例
- **新增**：生成详细的测试报告
- **验证**：现有功能是否正确实现，不需要修改代码

## Impact

- Affected specs: `deepresearch-mcp-platform-for-flexloop`
- Testing scope:
  - DeepResearch MCP API 服务连接性
  - Flexloop 前端 MCP 客户端连接
  - 5 组不同类型测试用例执行
  - 响应时间、准确性统计
  - 边界情况和错误处理测试

## ADDED Requirements

### Requirement: 服务连接性测试
系统 SHALL 能够：
- 成功连接 DeepResearch API 服务
- 成功连接 Flexloop 前端开发服务器
- 验证所有 MCP API 端点可访问

#### Scenario: 基本连接测试
- **WHEN** 调用 `GET /api/v1/mcp/agents`
- **THEN** 返回 8 个预置智能体，状态码 200

### Requirement: 多类型测试用例执行
系统 SHALL 支持至少 5 组不同类型测试：

1. **简单任务协作**：单一任务，2-3 个智能体协作
2. **复杂项目规划**：多个任务，多个专业智能体分工
3. **跨角色评审**：一个创作，一个评审协作模式
4. **边界情况**：只选 1 个智能体、选所有 8 个智能体
5. **错误场景**：无效 session_id、未认证请求

#### Scenario: 测试用例执行
- **WHEN** 按照测试用例逐步执行
- **THEN** 每个用例都能得到正确响应
- **THEN** 记录每个用例的响应时间和结果

### Requirement: DeepResearch 能力验证
系统 SHALL 正确调用 DeepResearch 底层能力：
- LLM 调用正常
- 智能体节点执行正常
- 消息传递正常
- 结果聚合正确

#### Scenario: 用户指令验证
- **WHEN** 用户发送具体问题/指令
- **THEN** MCP 正确分配给对应专业智能体
- **THEN** 智能体基于专业能力生成输出
- **THEN** 结果聚合返回给前端显示

### Requirement: 性能和错误处理测试
系统 SHALL：
- 记录每个 API 调用的响应时间
- 统计平均响应时间
- 验证错误情况返回正确的错误信息
- 不发生崩溃或内存泄漏

## 测试环境

- **DeepResearch 后端**：`http://localhost:8000`
- **Flexloop 前端**：`http://localhost:5173`
- **预置智能体**：8 个（任务规划师、内容创作专家、编程工程师、数据研究员、UI/UX 设计师、业务分析师、翻译专家、战略顾问）
- **测试工具**：curl + 浏览器访问 + 手动验证
