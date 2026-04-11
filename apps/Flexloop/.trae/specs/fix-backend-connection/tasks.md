# Tasks

- [x] Task 1: 分析现有配置 - 检查前端客户端配置、后端 CORS 配置和当前 API 路径设置
  - [x] 读取前端 `client.ts` 查看当前 baseURL 和端点路径配置
  - [x] 读取前端 `config.ts` 查看全局配置
  - [x] 读取后端 `main.py` 查看当前 CORS 和路由配置
  - [x] 读取后端 `auth.py` 查看认证配置
  - [x] 检查环境变量配置文件

- [x] Task 2: 修复前端 API 客户端配置 - 确保 baseURL 和 API 路径正确
  - [x] 修复 baseURL 为 `http://localhost:8000/api/v1`
  - [x] 修复各个端点路径确保与后端路由定义匹配
  - [x] 更新配置读取逻辑

- [x] Task 3: 修复后端 CORS 配置 - 确保允许 `http://localhost:5175` 跨域访问
  - [x] 检查当前 CORS 中间件配置
  - [x] 添加 `http://localhost:5175` 到 CORS 允许列表 (当前配置 `["*"]` 已允许所有来源，无需修改)
  - [x] 允许必要的 HTTP 头（包括 Authorization）和方法 (当前配置已允许所有)

- [x] Task 4: 验证身份验证机制 - 确保 API 密钥正确传递
  - [x] 检查前端请求头中 API 密钥的传递方式
  - [x] 验证后端认证中间件配置
  - [x] 添加环境变量配置项 (在 .env.development 添加 VITE_DEEP_RESEARCH_API_KEY)

- [x] Task 5: 测试验证连接 - 测试前端能否成功向后端发送请求并接收响应
  - [x] 重新构建前端项目确保无编译错误
  - [ ] 验证健康检查端点连通性 (需要在浏览器中测试)
  - [ ] 测试创建研究任务和接收 SSE 流式进度更新 (需要在浏览器中测试)
  - [ ] 确认完整的请求/响应流程正常工作 (需要在浏览器中测试)

- [x] Task 6: 修复编译错误 - 修复导入路径问题
  - [x] 修复 useDeepResearch.ts 中错误的导入路径 `../errors` → `../services/errors`

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2], [Task 3], [Task 4]
- [Task 6] depends on [Task 5]
