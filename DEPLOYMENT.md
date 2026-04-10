# DAO Apps 服务器部署指南

本文档介绍如何使用自动化部署脚本将 DAO Apps 部署到生产服务器。

## 前置要求

### 本地机器
- Bash 环境
- SSH 客户端
- curl
- SCP/SFTP/RSYNC 其中一种
- Node.js 20+ 用于本地构建

### 目标服务器
- Ubuntu/Debian 或 CentOS/RHEL 系统
- root 或 sudo 权限
- 开放 22/80/443 端口

## 快速开始

### 1. 准备目标服务器环境

首次部署前，需要先在目标服务器上准备环境：

```bash
# 1. 将 prepare-server.sh 上传到服务器
scp scripts/deployment/prepare-server.sh root@your-server:/tmp/

# 2. SSH 登录服务器并执行
ssh root@your-server
chmod +x /tmp/prepare-server.sh
sudo /tmp/prepare-server.sh
```

这个脚本会自动：
- 更新系统包
- 安装 Node.js 20.x, Nginx, Git, Certbot 等
- 配置防火墙
- 创建 daoapps 用户和目录结构

### 2. 配置部署环境

在本地机器上：

```bash
# 复制环境模板
cp deploy/.env.production deploy/.env.production.local

# 编辑配置，填入你的服务器信息
nano deploy/.env.production.local
```

主要配置项：

```bash
# 服务器连接信息
SERVER_HOST=your-server-ip      # 服务器IP或域名
SERVER_USER=root                # SSH用户名
SERVER_PORT=22                  # SSH端口
SERVER_SSH_KEY=~/.ssh/id_rsa   # SSH私钥路径（可选）

# 应用信息
APP_NAME=daoapps
APP_DOMAIN=your-domain.com      # 你的域名
APP_PORT=3000                   # 应用监听端口
APP_WORKDIR=/var/www/daoapps    # 应用安装目录

# SSL配置（启用HTTPS）
SSL_ENABLED=true                 # true 或 false

# 日志配置
LOG_DIR=/var/log/daoapps
```

### 3. 执行一键部署

在本地机器上：

```bash
chmod +x deploy.sh
./deploy.sh
```

脚本会自动执行以下步骤：
1. 构建应用程序
2. 传输文件到服务器
3. 配置 Nginx 和 systemd
4. 设置日志轮转
5. 验证部署

## 命令行选项

```bash
# 查看帮助
./deploy.sh --help

# 使用自定义环境文件
./deploy.sh --env myenv.local

# 跳过构建步骤（使用已有的构建包）
./deploy.sh --skip-build

# 指定传输方式（scp/sftp/rsync）
./deploy.sh --transport rsync

# 跳过验证步骤
./deploy.sh --no-verify

# 回滚到上一个版本
./deploy.sh --rollback

# 回滚N步
./deploy.sh --rollback --steps 2
```

## 目录结构

部署后服务器上的目录结构：

```
/var/www/daoapps/
├── current/          # 当前运行版本（符号链接）
└── releases/         # 所有版本历史
    ├── release_20240101_120000/
    └── release_20240102_140000/

/var/backups/daoapps/
└── backups/          # 部署前备份

/var/log/daoapps/
├── app.log           # 应用日志
└── error.log         # 错误日志
```

## 常用操作

### 检查服务状态

```bash
ssh root@your-server
systemctl status daoapps
```

### 查看日志

```bash
# 实时查看日志
journalctl -u daoapps -f

# 查看最近100行
journalctl -u daoapps -n 100
```

### 重启服务

```bash
systemctl restart daoapps
```

### 获取SSL证书

如果你之前没有启用SSL，可以手动获取：

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 手动回滚

如果自动回滚失败，可以手动执行：

```bash
# 查看可用版本
ssh root@your-server
ls -lt /var/www/daoapps/releases/

# 切换到指定版本
ln -sfn /var/www/daoapps/releases/release_XXXX /var/www/daoapps/current
systemctl restart daoapps
```

## 监控

### 健康检查

默认会配置 `/health` 端点，可以用于监控系统：

```bash
curl https://your-domain.com/health
```

### Prometheus 监控

如果你安装了 Prometheus，可以将 `deploy/prometheus.yml` 复制到 `/etc/prometheus/prometheus.yml` 进行配置。

### 日志轮转

已经配置了自动日志轮转，保留最近14天的日志。

## 故障排查

### 问题：服务启动失败

**检查：**
```bash
systemctl status daoapps
journalctl -u daoapps -n 50
```

**常见原因：**
- 端口被占用
- 依赖缺失
- 权限不正确

### 问题：Nginx返回502错误

**检查：**
- 应用是否正常启动
- 端口是否正确
- 防火墙是否允许访问

**解决：**
```bash
# 检查端口是否监听
netstat -tuln | grep 3000

# 检查Nginx配置
nginx -t
```

### 问题：部署验证失败

如果验证失败，脚本会自动回滚到上一个版本。如果自动回滚失败：

```bash
# 手动回滚
./deploy.sh --rollback
```

### 问题：构建失败

**检查：**
- Node.js版本是否 >= 20
- 网络是否能访问npm源
- 磁盘空间是否充足

## 安全建议

1. **SSH密钥认证**：使用SSH密钥代替密码登录
2. **防火墙**：确保只开放必要端口（22, 80, 443）
3. **普通用户运行**：应用以 daoapps 普通用户运行，不使用 root
4. **定期更新**：定期更新系统和依赖包
5. **SSL证书**：始终启用HTTPS

## 文件说明

| 文件 | 位置 | 说明 |
|------|------|------|
| deploy.sh | 项目根目录 | 主一键部署脚本 |
| .env.production | deploy/ | 环境配置模板 |
| nginx.conf.template | deploy/ | Nginx配置模板 |
| daoapps.service | deploy/ | systemd服务模板 |
| daoapps.logrotate | deploy/ | 日志轮转配置 |
| prometheus.yml | deploy/ | Prometheus配置模板 |
| prepare-server.sh | scripts/deployment/ | 服务器环境准备 |
| build-app.sh | scripts/deployment/ | 应用构建 |
| deploy-to-server.sh | scripts/deployment/ | 文件传输部署 |
| configure-services.sh | scripts/deployment/ | 服务配置 |
| verify-deployment.sh | scripts/deployment/ | 部署验证 |
| rollback.sh | scripts/deployment/ | 版本回滚 |
| setup-monitoring.sh | scripts/deployment/ | 监控配置 |

## CI/CD 集成

你可以将这些脚本集成到 GitHub Actions、GitLab CI 等CI/CD流程中：

```yaml
# .github/workflows/deploy.yml 示例
- name: Deploy to production
  run: ./deploy.sh --skip-build
  env:
    SERVER_HOST: ${{ secrets.SERVER_HOST }}
    SERVER_USER: ${{ secrets.SERVER_USER }}
    APP_DOMAIN: ${{ secrets.APP_DOMAIN }}
```

## 协议

MIT License
