# Tasks

- [x] Task 1: 创建部署目录结构和基础配置文件
  - [x] 创建 `deploy/` 目录
  - [x] 创建 `.env.production` 环境变量模板
  - [x] 创建 Nginx 配置模板
  - [x] 创建 systemd 服务单元文件模板

- [x] Task 2: 编写服务器环境准备脚本
  - [x] 创建 `scripts/deployment/prepare-server.sh` 脚本
  - [x] 实现系统更新和依赖安装（Node.js, npm, Nginx, Git, curl等）
  - [x] 实现防火墙配置和端口开放
  - [x] 创建应用用户和目录结构
  - [x] 添加权限配置

- [x] Task 3: 编写应用打包脚本
  - [x] 创建 `scripts/deployment/build-app.sh` 脚本
  - [x] 实现依赖安装（考虑monorepo结构）
  - [x] 执行生产构建
  - [x] 清理开发依赖和临时文件
  - [x] 生成构建产物压缩包

- [x] Task 4: 编写文件传输和部署脚本
  - [x] 创建 `scripts/deployment/deploy-to-server.sh` 脚本
  - [x] 支持SCP/SFTP/RSYNC多种传输方式
  - [x] 实现备份当前版本
  - [x] 上传并解压新版本
  - [x] 设置正确的文件权限

- [x] Task 5: 编写服务配置脚本
  - [x] 创建 `scripts/deployment/configure-services.sh` 脚本
  - [x] 根据模板生成实际Nginx配置
  - [x] 配置SSL证书（支持Let's Encrypt）
  - [x] 测试并重载Nginx配置
  - [x] 安装并启用systemd服务

- [x] Task 6: 编写部署验证脚本
  - [x] 创建 `scripts/deployment/verify-deployment.sh` 脚本
  - [x] 检查服务进程状态
  - [x] 验证HTTP端点可用性
  - [x] 验证关键API响应
  - [x] 生成验证报告
  - [x] 验证失败自动触发回滚

- [x] Task 7: 编写回滚脚本
  - [x] 创建 `scripts/deployment/rollback.sh` 脚本
  - [x] 恢复备份版本
  - [x] 重启服务
  - [x] 验证回滚后的服务状态

- [x] Task 8: 配置监控和日志
  - [x] 创建日志轮转配置
  - [x] 添加健康检查端点配置
  - [x] 创建监控告警配置（可选Prometheus）
  - [x] 文档化监控指标

- [x] Task 9: 编写主一键部署脚本
  - [x] 创建 `deploy.sh` 主脚本整合所有步骤
  - [x] 添加命令行参数解析
  - [x] 实现交互式配置
  - [x] 添加颜色输出和进度提示
  - [x] 错误处理和日志记录

- [x] Task 10: 编写部署文档
  - [x] 创建 `DEPLOYMENT.md` 文档
  - [x] 记录前置要求
  - [x] 说明配置项
  - [x] 提供使用示例
  - [x] 故障排查指南

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] 可与 [Task 2] 并行执行
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 1, Task 4]
- [Task 6] depends on [Task 5]
- [Task 7] 可与 [Task 6] 并行编写
- [Task 8] depends on [Task 5]
- [Task 9] depends on [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8]
- [Task 10] depends on all previous tasks
