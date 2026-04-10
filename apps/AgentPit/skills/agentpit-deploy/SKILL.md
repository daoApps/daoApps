# Flexloop 自动化部署技能

## 技能信息
- **名称**：flexloop-deploy
- **版本**：1.0.0
- **描述**：自动化部署Flexloop项目到指定服务器
- **作者**：Flexloop Team
- **邮箱**：admin@flexloop.tech

## 功能特性
- 一键部署项目到远程服务器
- 自动检查服务器环境
- 上传构建文件
- 配置Nginx服务
- 尝试申请SSL证书
- 详细的错误处理和日志记录
- 部署验证

## 配置参数
- **server_ip**：服务器IP地址
- **server_user**：服务器用户名
- **ssh_key**：SSH密钥路径
- **domain**：域名
- **project_path**：本地项目路径

## 使用方法
```bash
# 执行部署
./deploy.sh

# 带参数执行
./deploy.sh --server_ip 34.126.124.215 --server_user a1 --ssh_key ~/.ssh/id_rsa_google_longterm --domain pagent.agentpit.io
```

## 部署流程
1. 检查本地环境
2. 构建项目
3. 建立SSH连接
4. 检查服务器环境
5. 上传项目文件
6. 配置Nginx
7. 尝试申请SSL证书
8. 验证部署结果

## 错误处理
- 网络连接错误：检查网络连接和SSH配置
- 构建失败：检查项目依赖和构建配置
- 服务器错误：检查服务器状态和权限
- SSL证书错误：检查域名解析和网络连接

## 日志记录
- 部署过程日志保存在 `logs/deploy.log`
- 错误信息详细记录，便于排查问题

## 注意事项
- 确保SSH密钥有正确的权限（600）
- 确保服务器有足够的存储空间
- 确保域名已正确解析到服务器IP
- 确保服务器网络连接正常

## 后续维护
- 定期更新部署脚本
- 监控SSL证书状态
- 备份部署配置和日志