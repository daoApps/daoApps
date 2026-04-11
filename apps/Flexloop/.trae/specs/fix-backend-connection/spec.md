# 修复前后端连接配置 Spec

## Why
后端 DeepResearch API 已经在 `http://localhost:8000` 成功运行，但 Flexloop 前端应用无法正确连接到后端服务。需要检查并修复连接配置，确保前端能够成功向后端发送请求并接收响应。

后端 API 信息：
- 基础地址：`http://localhost:8000`
- API 前缀：`/api/v1`
- 文档地址：`http://localhost:8000/api/v1/redoc` 和 `http://localhost:8000/api/v1/docs`
- 健康检查：`http://localhost:8000/api/v1/health`

## What Changes
- 检查并修复前端 DeepResearch 客户端配置中的 baseURL 和 API 路径
- 验证后端 CORS 配置是否允许 `http://localhost:5175` 跨域访问
- 检查并修复身份验证 API 密钥传递机制
- 确保 API 请求路径与后端路由定义完全匹配（包含 `/api/v1` 前缀）
- 添加适当的错误处理和连接状态检测

## Impact
- Affected specs: DeepResearch 集成功能
- Affected code:
  - `Flexloop/src/services/deepresearch/client.ts` - 前端 API 客户端
  - `Flexloop/src/services/config.ts` - 全局配置
  - `Flexloop/vite.config.ts` - Vite 配置
  - `DeepResearch/src/deepresearch/api/main.py` - 后端主文件
  - `DeepResearch/src/deepresearch/api/auth.py` - 认证配置

## ADDED Requirements
### Requirement: 正确的前后端连接
前端应用 SHOULD 能够成功连接到 DeepResearch 后端 API，发送研究请求并接收流式响应。

#### Scenario: 成功连接后端
- **WHEN** 用户在前端发起深度研究请求
- **THEN** 前端能够正确连接到后端 `http://localhost:8000/api/v1`
- **AND** 后端能够接收请求并开始处理
- **AND** 前端能够接收 SSE 流式进度更新
- **AND** 最终能够显示完整的研究结果

#### Scenario: 连接失败处理
- **WHEN** 后端服务不可用
- **THEN** 前端应该显示清晰的错误信息
- **AND** 不会导致应用崩溃

## MODIFIED Requirements
### Requirement: CORS 配置
后端 API MUST 正确配置 CORS，允许来自前端开发服务器 `http://localhost:5175` 的跨域请求。

### Requirement: API 基础路径
前端客户端 MUST 使用正确的 baseURL 配置 `http://localhost:8000/api/v1`，确保请求发送到正确的后端地址。
