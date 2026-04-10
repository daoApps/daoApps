# Flexloop Podman 容器化部署指南

> 🚀 使用 Podman 快速部署和管理 Flexloop Vue3 应用

---

## 📖 目录

- [快速开始](#快速开始)
- [前置要求](#前置要求)
- [环境说明](#环境说明)
- [安装指南](#安装指南)
- [配置详解](#配置详解)
- [常用操作](#常用操作)
- [开发环境](#开发环境)
- [生产部署](#生产部署)
- [故障排查](#故障排查)
- [最佳实践](#最佳实践)
- [CI/CD 集成](#cicd-集成)
- [API 参考](#api-参考)
- [更新日志](#更新日志)

---

## 🚀 快速开始

### 5 步完成首次部署（< 10 分钟）

```bash
# 1️⃣ 克隆项目
git clone https://github.com/your-org/agentpit.git
cd agentpit

# 2️⃣ 配置环境变量
cp .env.production.example .env.production
# 编辑 .env.production 填入真实 API 地址

# 3️⃣ 初始化环境
./init-container.sh

# 4️⃣ 一键部署
./deploy.sh
# 或者使用 Makefile
make deploy

# 5️⃣ 验证部署
./healthcheck.sh -v
# 打开浏览器访问 http://localhost:8080
```

✅ **恭喜！应用已成功运行**

---

## 📋 前置要求

### 必需软件

| 软件 | 最低版本 | 推荐版本 | 用途 |
|------|---------|---------|------|
| Podman | >= 4.0 | >= 4.5 | 容器运行时 |
| podman-compose | >= 1.0 | >= 1.2 | 容器编排 |
| Git | >= 2.0 | 最新版 | 版本控制 |
| curl | 任意 | 最新版 | 健康检查 |

### 可选软件（开发环境）

| 软件 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | >= 18 | 前端构建 |
| npm | >= 9 | 包管理 |
| make | >= 4.0 | 命令简化 |

### 系统要求

- **操作系统**：Linux (Ubuntu 20.04+, CentOS 8+, Arch Linux), macOS 12+, Windows 10/11 (WSL2)
- **CPU**：>= 2 核
- **内存**：>= 4 GB RAM
- **磁盘空间**：>= 10 GB 可用空间
- **网络**：稳定的互联网连接（首次构建需要下载基础镜像）

### 权限要求

- Linux：用户需要在 `podman` 组中，或使用 rootless 模式
- macOS/WLS2：无需特殊权限

---

## 🔧 环境说明

### 开发环境 vs 生产环境

| 特性 | 开发环境 | 生产环境 |
|------|---------|---------|
| **Profile** | development | production |
| **热重载** | ✅ 支持 | ❌ 不支持 |
| **源码映射** | ✅ 完整 | ❌ 仅构建产物 |
| **端口** | 5173 (Vite) | 8080 (Nginx) |
| **Mock 数据** | ✅ 启用 | ❌ 关闭 |
| **调试工具** | ✅ 包含 | ❌ 移除 |
| **资源限制** | 宽松 (1GB) | 严格 (512MB) |
| **安全配置** | 基础 | 强化（只读文件系统、非 root 用户） |
| **容器名称** | agentpit-dev | agentpit-frontend |
| **基础镜像** | node:20-alpine | nginx:alpine (构建后) |
| **重启策略** | no | unless-stopped |

### 何时使用哪个环境？

- **开发环境** (`make dev`)：
  - 日常开发和调试
  - 功能开发和单元测试
  - UI 调整和样式修改
  
- **生产环境** (`make prod` 或 `make deploy`)：
  - 预发布环境 (Staging)
  - 生产服务器部署
  - 性能测试和安全审计

---

## 📦 安装指南

### Linux (Ubuntu/Debian)

```bash
# 安装 Podman
sudo apt update
sudo apt install -y podman podman-compose

# 配置 rootless 模式（推荐）
podman system service --time=0 &

# 验证安装
podman --version
podman-compose --version
```

### CentOS/RHEL/Fedora

```bash
# Fedora/CentOS Stream 9+
sudo dnf install -y podman podman-compose

# RHEL 8+ (需要订阅或启用 EPEL)
sudo yum install -y podman podman-compose

# 验证安装
podman --version
```

### Arch Linux

```bash
sudo pacman -S podman podman-compose
```

### macOS (Homebrew)

```bash
brew install podman podman-compose

# 启动 Podman machine
podman machine init
podman machine start
```

### Windows (WSL2)

```powershell
# 在 WSL2 Ubuntu 中执行
sudo apt update && sudo apt install -y podman podman-compose
```

---

## ⚙️ 配置详解

### 核心配置文件说明

#### 1. Podmanfile（多阶段构建）

Flexloop 采用**多阶段构建策略**，优化镜像大小和安全性：

**阶段 1: 构建阶段 (build)**
- **基础镜像**: `node:20-alpine`（轻量级 Node.js 环境）
- **主要功能**:
  - 安装项目依赖 (`npm ci`)
  - 编译 TypeScript/Vue 源码 (`npm run build`)
  - 清理缓存和临时文件
- **关键指令**:
  ```dockerfile
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci --prefer-offline    # 使用离线缓存加速
  COPY . .
  RUN npm run build             # 执行 TypeScript 编译 + Vite 构建
  ```

**阶段 2: 生产阶段 (production)**
- **基础镜像**: `nginx:alpine`（高性能 Web 服务器）
- **主要功能**:
  - 安装 curl（用于健康检查）
  - 复制自定义 Nginx 配置
  - 复制构建产物到 Nginx 目录
  - 创建非 root 用户运行容器
  - 配置健康检查端点
- **安全特性**:
  ```dockerfile
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser                    # 非 root 用户运行
  EXPOSE 80
  HEALTHCHECK ...                 # 内置健康检查
  CMD ["nginx", "-g", "daemon off;"]
  ```

**多平台构建示例**:
```bash
# Linux amd64 + arm64 双架构构建
podman build --platform linux/amd64,linux/arm64 -t agentpit:latest .

# 单平台构建（默认）
podman build -t agentpit-vue3:latest .
```

#### 2. podman-compose.yml（容器编排）

**核心配置结构**:

```yaml
version: "3.8"

networks:          # 自定义网络隔离
  agentpit-network:
    driver: bridge

volumes:           # 持久化存储
  agentpit-logs:

services:
  agentpit-dev:        # 开发环境服务
    profiles: ["development"]
    
  agentpit-frontend:   # 生产环境服务
    profiles: ["production"]
```

**关键配置项说明**:

| 配置项 | 开发环境 | 生产环境 | 说明 |
|--------|---------|---------|------|
| `image` | node:20-alpine | agentpit-vue3:latest | 基础镜像 |
| `ports` | 5173:5173 | 8080:80 | 端口映射 |
| `volumes` | ./:/app (源码挂载) | agentpit-logs:/var/log/nginx | 数据卷 |
| `command` | npm run dev | nginx | 启动命令 |
| `environment` | NODE_ENV=development | NODE_ENV=production | 环境变量 |
| `resources.limits.memory` | 1G | 512M | 内存限制 |
| `restart` | no | unless-stopped | 重启策略 |
| `read_only` | false | true | 只读文件系统 |
| `healthcheck` | 无 | 有 (30s间隔) | 健康检查 |

**可选辅助服务**（已注释，按需启用）:
- Redis 缓存服务（会话管理、消息队列）
- PostgreSQL 数据库服务（关系型数据存储）

#### 3. nginx.conf（生产服务器配置）

**核心配置功能**:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;

    # 1️⃣ Gzip 压缩（减少传输体积 ~60%）
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/javascript ...;

    # 2️⃣ 健康检查端点
    location /health {
        return 200 'OK';
    }

    # 3️⃣ 静态资源长期缓存（带 hash 文件名）
    location ~* \.(js|css|png|jpg|...)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 4️⃣ SPA 路由 fallback（Vue Router 支持）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 5️⃣ 安全头设置
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Content-Security-Policy "...";
}
```

**性能优化点**:
- ✅ Gzip 压缩（压缩级别 6，平衡 CPU 和压缩率）
- ✅ 静态资源长期缓存（1 年，利用文件 hash 实现版本控制）
- ✅ index.html 不缓存（确保用户获取最新版本）
- ✅ 隐藏 Nginx 版本号（安全加固）

**安全头配置**:
- `X-Frame-Options`: 防止点击劫持
- `X-Content-Type-Options`: 防止 MIME 类型嗅探
- `X-XSS-Protection`: XSS 过滤器
- `Content-Security-Policy`: 内容安全策略

#### 4. 环境变量文件

**生产环境 (.env.production)**:

| 变量名 | 默认值 | 说明 | 是否必需 |
|--------|-------|------|---------|
| `NODE_ENV` | production | 运行环境（固定值） | ✅ 必需 |
| `VITE_API_BASE_URL` | https://api.agentpit.com/api | API 基础地址 | ⚠️ **必须修改** |
| `VITE_API_TIMEOUT` | 30000 | API 超时时间（毫秒） | 可选 |
| `VITE_USE_MOCK_API` | false | 是否使用 Mock 数据 | ⚠️ **生产必须为 false** |
| `TZ` | Asia/Shanghai | 时区设置 | 可选 |

**高级配置（可选）**:
```bash
VITE_CORS_ORIGINS=https://app.agentpit.com     # CORS 允许的源
VITE_ENABLE_MONITORING=true                     # 性能监控开关
VITE_SENTRY_DSN=                                # Sentry DSN
VITE_CDN_BASE_URL=https://cdn.agentpit.com      # CDN 地址
```

**开发环境 (.env.development)**:

| 变量名 | 默认值 | 说明 |
|--------|-------|------|
| `NODE_ENV` | development | 运行环境 |
| `VITE_API_BASE_URL` | http://localhost:3000/api | 本地 API 地址 |
| `VITE_API_TIMEOUT` | 30000 | API 超时时间 |
| `VITE_USE_MOCK_API` | true | **默认开启 Mock** |
| `VITE_DEEP_RESEARCH_PATH` | | DeepResearch 工具路径 |
| `VITE_FLEXLOOP_PATH` | | Flexloop 工具路径 |
| `TZ` | Asia/Shanghai | 时区 |

---

## 🎮 常用操作

### 构建与启动

```bash
# 构建镜像
make build

# 启动生产环境
make up        # 或 make prod

# 启动开发环境（带热重载）
make dev

# 完整部署（构建+启动+验证）
make deploy
```

### 查看与管理

```bash
# 查看运行状态
make status
make ps

# 查看实时日志
make logs

# 进入容器 Shell
make shell
```

### 停止与清理

```bash
# 停止服务
make down

# 重启服务
make restart

# 清理未使用的资源
make clean

# 深度清理（慎用）
make prune
```

### 版本管理

```bash
# 回滚到上一版本
make rollback

# 手动备份当前状态
make backup
```

### 环境检查与初始化

```bash
# 初始化环境（创建目录、检查配置）
./init-container.sh

# 开发环境初始化（额外检查 Node.js）
./init-container.sh --dev

# 仅检查不修改
./init-container.sh --check-only

# 清理并重新初始化
./init-container.sh --clean

# Makefile 环境检查
make check
```

---

## 🛠️ 开发环境

### 启动开发服务器

```bash
# 方式 1: 使用 Makefile（推荐）
make dev

# 方式 2: 使用 compose
podman-compose --profile development up agentpit-dev

# 方式 3: 直接使用 Vite（无需容器）
npm run dev
```

### 开发环境特性

- **热模块替换 (HMR)**：修改代码后即时反映（通过 Vite 实现）
- **Vue DevTools 支持**：可在浏览器中调试组件
- **错误覆盖**：编译错误直接显示在浏览器中
- **源码映射**：可直接调试 TypeScript/Vue 源码
- **Mock 数据支持**：无需后端即可进行前端开发
- **文件监听兼容性**：
  - `CHOKIDAR_USEPOLLING=true`（某些文件系统需要轮询模式）
  - `WATCHPACK_POLLING=true`（Webpack/Vite 兼容）

### 常见开发场景

#### 1. 添加新页面

```bash
# 1. 创建 Vue 组件
touch src/views/NewPage.vue

# 2. 配置路由 (src/router/index.ts)
# 3. 修改代码后自动热重载
# 4. 浏览器访问 http://localhost:5173/new-page
```

#### 2. 修改样式

```bash
# 修改 Tailwind CSS 类或 Vue 组件样式
# 保存后立即看到变化（HMR 生效）
```

#### 3. 调试 API 调用

```bash
# 方式 A: 使用 Mock 数据（默认）
# .env.development 中 VITE_USE_MOCK_API=true

# 方式 B: 连接本地后端
# 修改 VITE_API_BASE_URL=http://localhost:3000/api
# 设置 VITE_USE_MOCK_API=false

# 方式 C: 连接远程 API
# 修改 VITE_API_BASE_URL=https://staging-api.example.com/api
```

#### 4. 性能分析

```bash
# 查看 Vite 构建分析
npm run build -- --mode analyze

# 或使用浏览器 DevTools Performance 面板
```

---

## 🌐 生产部署

### 部署前检查清单

- [ ] 所有测试通过 (`npm run test:run`)
- [ ] `.env.production` 已配置正确的 API 地址
- [ ] `VITE_USE_MOCK_API=false`（生产环境必须关闭 Mock）
- [ ] 生产数据库已就绪（如需要）
- [ ] SSL 证书已准备好（如使用 HTTPS）
- [ ] 域名 DNS 已解析到服务器
- [ ] 服务器资源满足最低要求（CPU 2核, RAM 4GB, 磁盘 10GB）

### 部署步骤

```bash
# 1. 从 Git 拉取最新代码
git pull origin main

# 2. 配置生产环境变量（首次部署）
cp .env.production.example .env.production
vim .env.production  # 编辑配置

# 3. 初始化环境（可选但推荐）
./init-container.sh

# 4. 执行部署（推荐方式）
./deploy.sh

# 或使用 Makefile
make deploy

# 5. 验证部署
./healthcheck.sh -v --headers --body

# 6. 查看日志确认无错误
make logs
```

### 自定义部署选项

```bash
# 自定义端口部署
./deploy.sh -p 3000

# 自定义镜像名称
./deploy.sh -i my-custom-app:v1.0.0

# 开发环境部署
./deploy.sh -e development

# 组合使用
./deploy.sh -p 9090 -i app:prod -e production
```

### 生产环境优化建议

#### 1. 反向代理配置（Nginx/Caddy）

**Nginx 反向代理示例**:
```nginx
server {
    listen 443 ssl;
    server_name app.agentpit.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Caddy 反向代理示例**:
```
app.agentpit.com {
    reverse_proxy localhost:8080
}
```

#### 2. HTTPS 配置（Let's Encrypt）

```bash
# 使用 Certbot 自动申请证书
sudo certbot --nginx -d app.agentpit.com

# 或手动配置证书路径到 Nginx
```

#### 3. CDN 加速（CloudFlare/Aliyun CDN）

- 将静态资源配置到 CDN
- 修改 `VITE_CDN_BASE_URL` 指向 CDN 地址
- 利用 Nginx 的长期缓存策略（已内置）

#### 4. 监控告警（Prometheus + Grafana）

```yaml
# docker-compose.yml 中添加监控服务（可选）
monitoring:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
```

#### 5. 日志收集（ELK/Loki）

- Nginx 日志已持久化到 `agentpit-logs` 卷
- 可配置日志驱动输出到 ELK/Loki
- 当前配置：JSON 格式日志，单文件最大 10MB，保留 3 个轮转文件

---

## 🐛 故障排查

### 常见问题及解决方案

#### 问题 1：端口被占用

**症状**：启动时报错 "port already in use"

**解决方案**：
```bash
# 查找占用端口的进程
lsof -i :8080
# 或
netstat -tlnp | grep 8080

# 终止进程或更改端口
kill -9 <PID>
# 或使用自定义端口
make PORT=3000 up
```

#### 问题 2：容器无法启动

**症状**：容器立即退出或反复重启

**解决方案**：
```bash
# 查看容器日志
podman logs agentpit-frontend

# 检查配置文件
./init-container.sh --check-only

# 手动进入容器排查
podman run -it --rm agentpit-vue3:latest sh

# 查看容器退出码
podman inspect agentpit-frontend --format='{{.State.ExitCode}}'
```

#### 问题 3：构建失败

**症状**：`podman build` 报错

**常见原因及解决方案**：

**原因 A: Node.js 版本不兼容**
```bash
# 检查 package.json 要求的 Node.js 版本
cat package.json | grep engines

# Podmanfile 使用的是 node:20-alpine，确保兼容
```

**原因 B: 依赖下载失败（网络问题）**
```bash
# 配置 npm 镜像（国内用户）
# 在项目根目录创建 .npmrc
registry=https://registry.npmmirror.com

# 或使用代理
npm config set proxy http://proxy:port
```

**原因 C: 磁盘空间不足**
```bash
# 检查磁盘空间
df -h

# 清理 Podman 缓存和未使用的资源
podman system prune -a
```

**通用解决方案**：
```bash
# 清理缓存重新构建
podman builder prune
make clean
make build
```

#### 问题 4：健康检查失败

**症状**：容器启动但健康检查不通过

**解决方案**：
```bash
# 手动测试健康端点
curl -v http://localhost:8080/health

# 检查 Nginx 配置
podman exec agentpit-frontend cat /etc/nginx/conf.d/default.conf

# 查看 Nginx 错误日志
podman exec agentpit-frontend tail -f /var/log/nginx/error.log

# 查看 Nginx 访问日志
podman exec agentpit-frontend tail -f /var/log/nginx/access.log

# 重启健康检查失败的容器
podman restart agentpit-frontend
```

#### 问题 5：开发环境热重载不生效

**症状**：修改代码后浏览器没有更新

**解决方案**：
```bash
# 检查文件监听是否正常
# 确认 .env.development 中包含：
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true

# 重启开发容器
make down
make dev

# 检查 volume 挂载是否正确
podman inspect agentpit-dev --format='{{json .Mounts}}' | jq
```

#### 问题 6：权限问题（Linux）

**症状**：无法创建容器或访问卷

**解决方案**：
```bash
# 将当前用户添加到 podman 组
sudo usermod -aG podman $USER

# 重新登录或执行
newgrp podman

# 检查 Podman socket 权限
ls -la /run/podman/podman.sock

# 或使用 rootless 模式
podman system service --time=0 &
```

#### 问题 7：Windows WSL2 性能问题

**症状**：文件系统操作缓慢，构建时间长

**解决方案**：
```bash
# 将项目放在 WSL2 文件系统中（而非 Windows 文件系统）
# 推荐：/home/user/projects/agentpit
# 不推荐：/mnt/c/Users/user/projects/agentpit

# 启用 WSL2 的元数据优化
# 在 %USERPROFILE%\.wslconfig 中添加：
[wsl2]
metadata=true
```

#### 问题 8：镜像体积过大

**症状**：构建出的镜像占用过多磁盘空间

**解决方案**：
```bash
# 分析镜像层大小
podman history agentpit-vue3:latest

# 多阶段构建已经优化了镜像大小
# 最终镜像仅包含 Nginx + 构建产物

# 进一步优化：使用 distroless 镜像
# 修改 Podmanfile 第二阶段为：
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /app/dist /usr/share/nginx/html
# 注意：distroless 没有 shell，调试困难
```

#### 问题 9：网络连接问题

**症状**：容器内无法访问外部网络或 API

**解决方案**：
```bash
# 检查容器网络模式
podman inspect agentpit-frontend --format='{{.HostConfig.NetworkMode}}'

# 检查 DNS 配置
podman exec agentpit-frontend cat /etc/resolv.conf

# 测试容器内网络连通性
podman exec agentpit-frontend ping -c 3 8.8.8.8

# 手动指定 DNS
# 在 podman-compose.yml 中添加：
dns:
  - 8.8.8.8
  - 8.8.4.4
```

#### 问题 10：回滚失败

**症状**：执行 `make rollback` 提示找不到备份

**解决方案**：
```bash
# 检查备份标签文件是否存在
cat .last_backup_tag

# 如果不存在，说明之前没有成功部署过
# 需要重新从 Git 恢复或手动打标签回滚

# 手动查看可用镜像
podman images | grep agentpit

# 手动恢复到某个历史版本
podman tag agentpit-vue3:backup-20260410120000 agentpit-vue3:latest
make restart
```

### 故障排查工具箱

```bash
# 一键诊断脚本
./init-container.sh --check-only

# 详细健康检查
./healthcheck.sh -v --headers --body

# 查看容器详细状态
./deploy.sh status

# 查看实时日志
make logs

# 进入容器调试
make shell
```

---

## 💡 最佳实践

### 安全最佳实践

1. **始终使用非 root 用户运行容器**
   - Podmanfile 已配置 `USER appuser`
   - Compose 文件已配置 `user: "1000:1000"`

2. **启用只读文件系统**
   - 生产环境已启用 `read_only: true`
   - 仅 `/tmp` 和 `/var/run` 为可写 tmpfs

3. **定期更新基础镜像**
   ```bash
   # 定期拉取最新基础镜像
   podman pull node:20-alpine
   podman pull nginx:alpine
   
   # 重新构建以应用安全补丁
   make clean
   make build
   ```

4. **不要在镜像中存储敏感信息**
   - 使用 `.env` 文件管理配置
   - 敏感信息通过 CI/CD 环境变量注入
   - 不要将 `.env.production` 提交到 Git

5. **使用 .env 文件管理配置**
   - 提供 `.env.example` 作为模板
   - 实际配置文件加入 `.gitignore`

### 性能优化建议

1. **利用 Docker 层缓存（合理安排 COPY 顺序）**
   - Podmanfile 先复制 `package.json` 再复制源码
   - 依赖变更频率低于源码，最大化缓存命中

2. **启用 Gzip 压缩**
   - Nginx 已配置 Gzip（压缩级别 6）
   - 减少传输体积约 60%

3. **设置合理的缓存策略**
   - 静态资源（JS/CSS/图片）：长期缓存 1 年
   - HTML 文件：不缓存，确保获取最新版本
   - 利用 Vite 的文件 hash 机制实现缓存 busting

4. **使用 CDN 分发静态资源**
   - 配置 `VITE_CDN_BASE_URL`
   - 将静态资源推送到 CDN
   - 降低源站压力

5. **监控并优化镜像大小**
   ```bash
   # 查看镜像大小
   podman images | grep agentpit
   
   # 分析镜像层
   podman history agentpit-vue3:latest
   
   # 目标：生产镜像 < 100MB（当前配置可达成）
   ```

### 运维建议

1. **使用版本标签管理镜像**
   ```bash
   # 使用语义化版本号
   make IMAGE_NAME=agentpit-vue3:v1.2.3 build
   
   # 同时保留 latest 标签
   podman tag agentpit-vue3:v1.2.3 agentpit-vue3:latest
   ```

2. **实施自动化部署流水线**
   - 参考 [CI/CD 集成](#cicd-集成) 章节
   - 配置自动化的构建、测试、部署流程

3. **配置日志监控和告警**
   - 日志已持久化到 `agentpit-logs` 卷
   - 配置日志收集到 ELK/Loki/Grafana Loki
   - 设置关键错误告警

4. **定期备份重要数据**
   - 镜像备份：`make backup`
   - 自动备份：每次部署前自动备份上一版本
   - 备份位置：本地镜像仓库或远程 registry

5. **文档化所有自定义配置**
   - 保持本文档更新
   - 记录所有环境变量含义
   - 记录所有自定义修改

### 开发工作流建议

1. **分支管理策略**
   ```
   main (生产)
    └── develop (开发预发布)
         ├── feature/xxx (功能分支)
         ├── bugfix/xxx (修复分支)
         └── hotfix/xxx (紧急修复)
   ```

2. **提交信息规范**
   ```
   feat: 新增用户认证模块
   fix: 修复登录页面样式问题
   docs: 更新部署文档
   style: 格式化代码
   refactor: 重构 API 调用逻辑
   test: 添加单元测试
   chore: 更新依赖版本
   ```

3. **代码审查清单**
   - [ ] 代码符合项目规范
   - [ ] 无安全漏洞
   - [ ] 测试覆盖充分
   - [ ] 文档已更新
   - [ ] 容器化配置正确（如涉及）

---

## 🔄 CI/CD 集成

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Flexloop

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/agentpit

jobs:
  # ============================================
  # 构建 Stage
  # ============================================
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Podman
        uses: redhat-actions/podman-setup@v1
        with:
          podman-version: '4.9'

      - name: Build to Dockerfile
        id: build-image
        uses: redhat-actions/buildah-build@v2
        with:
          containerfiles: ./Podmanfile
          image: ${{ env.IMAGE_NAME }}
          tags: latest ${{ github.sha }}

      - name: Push to GitHub Container Registry
        if: github.event_name == 'push'
        uses: redhat-actions/push-to-registry@v2
        with:
          image: ${{ steps.build-image.outputs.image }}
          registry: ${{ env.REGISTRY }}/$(echo "${{ github.repository }}" | tr '[:upper:]' '[:lower:]')
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

  # ============================================
  # 测试 Stage
  # ============================================
  test:
    runs-on: ubuntu-latest
    needs: build-and-push
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:run

      - name: Run linting
        run: npm run lint:check

      - name: Run type check
        run: npm run type-check

  # ============================================
  # 部署 Stage（仅 main 分支触发）
  # ============================================
  deploy:
    runs-on: ubuntu-latest
    needs: [build-and-push, test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/agentpit
            git pull origin main
            
            # 配置环境变量（如果不存在）
            if [ ! -f .env.production ]; then
              cp .env.production.example .env.production
            fi
            
            # 执行部署
            chmod +x deploy.sh healthcheck.sh
            ./deploy.sh -e production
            
            # 验证部署
            ./healthcheck.sh -v

      - name: Notify deployment result
        if: always()
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: |
            {
              "text": "Flexloop deployment ${{ job.status }}: ${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### GitLab CI 示例

创建 `.gitlab-ci.yml`：

```yaml
stages:
  - build
  - test
  - deploy

variables:
  IMAGE_NAME: ${CI_REGISTRY_IMAGE}/agentpit:$CI_COMMIT_SHA
  IMAGE_LATEST: ${CI_REGISTRY_IMAGE}/agentpit:latest

# ============================================
# 构建 Stage
# ============================================
build:image:
  stage: build
  image: quay.io/podman/stable:v4.9
  services:
    - docker:dind
  before_script:
    - podman login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - podman build -t $IMAGE_NAME -t $IMAGE_LATEST .
    - podman push $IMAGE_NAME
    - podman push $IMAGE_LATEST
  only:
    - main
    - merge_requests

# ============================================
# 测试 Stage
# ============================================
test:unit:
  stage: test
  image: node:20-alpine
  before_script:
    - npm ci
  script:
    - npm run test:run
    - npm run lint:check
    - npm run type-check
  artifacts:
    reports:
      junit: coverage/junit.xml
    paths:
      - coverage/
    expire_in: 7 days

test:e2e:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 7 days

# ============================================
# 部署 Stage
# ============================================
deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client bash
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
        cd /opt/agentpit &&
        git pull origin main &&
        chmod +x deploy.sh healthcheck.sh &&
        ./deploy.sh -e production &&
        ./healthcheck.sh -v
      "
  only:
    - main
  environment:
    name: production
    url: https://app.agentpit.com
  when: manual  # 手动触发部署

deploy:staging:
  stage: deploy
  extends: deploy:production
  script:
    - ssh -o StrictHostKeyChecking=no $STAGING_SERVER_USER@$STAGING_SERVER_HOST "
        cd /opt/agentpit-staging &&
        git pull origin main &&
        chmod +x deploy.sh healthcheck.sh &&
        ./deploy.sh -e production -p 8081 &&
        ./healthcheck.sh -u http://localhost:8081/health -v
      "
  environment:
    name: staging
    url: https://staging.agentpit.com
```

### Jenkins Pipeline 示例（可选）

创建 `Jenkinsfile`：

```groovy
pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io/your-org/agentpit'
        CREDENTIALS = credentials('github-registry')
    }

    stages {
        // ============================================
        // 构建 Stage
        // ============================================
        stage('Build') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    podman build -t ${REGISTRY}:${BUILD_NUMBER} -t ${REGISTRY}:latest .
                '''
            }
        }

        // ============================================
        // 测试 Stage
        // ============================================
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test:run'
                sh 'npm run lint:check'
            }
            post {
                always {
                    junit 'coverage/junit.xml'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        // ============================================
        // 部署 Stage
        // ============================================
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production...'
                sh '''
                    podman tag ${REGISTRY}:${BUILD_NUMBER} ${REGISTRY}:latest
                    
                    # Push to registry
                    podman login -u ${CREDENTIALS_USR} -p ${CREDENTIALS_PSW} ${REGISTRY}
                    podman push ${REGISTRY}:${BUILD_NUMBER}
                    podman push ${REGISTRY}:latest
                '''

                // SSH 到服务器执行部署
                sshagent(['server-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no user@production-server '
                            cd /opt/agentpit &&
                            git pull origin main &&
                            ./deploy.sh -e production &&
                            ./healthcheck.sh -v
                        '
                    '''
                }
            }
        }

        // ============================================
        // 通知 Stage
        // ============================================
        stage('Notify') {
            steps {
                slackSend(
                    channel: '#deployments',
                    color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
                    message: "Flexloop deployment *${currentBuild.result}* - Build #${env.BUILD_NUMBER} (${env.GIT_COMMIT[0..7]})"
                )
            }
        }
    }

    post {
        failure {
            mail to: 'team@example.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: """Pipeline failed at stage: ${currentBuild.currentStage}
                           Check console output at: ${env.BUILD_URL}"""
        }
    }
}
```

---

## 📚 API 参考

### Makefile 命令参考表

| 命令 | 说明 | 示例 | 环境变量 |
|------|------|------|----------|
| `make help` | 显示帮助信息 | `make help` | - |
| `make build` | 构建镜像 | `make build` | `IMAGE_NAME`, `PORT`, `PROFILE` |
| `make up` | 启动容器 | `make up` | `PORT`, `PROFILE` |
| `make down` | 停止容器 | `make down` | `PROFILE` |
| `make restart` | 重启服务 | `make restart` | `PROFILE` |
| `make logs` | 查看实时日志 | `make logs` | `PROFILE` |
| `make deploy` | 完整部署流程 | `make deploy` | `PORT`, `IMAGE_NAME`, `PROFILE` |
| `make rollback` | 回滚到上一版本 | `make rollback` | - |
| `make status` | 显示容器状态 | `make status` | - |
| `make clean` | 清理未使用资源 | `make clean` | - |
| `make prune` | 深度清理（慎用） | `make prune` | - |
| `make dev` | 启动开发环境 | `make dev` | - |
| `make prod` | 启动生产环境 | `make prod` | - |
| `make test` | 运行测试套件 | `make test` | - |
| `make shell` | 进入容器 Shell | `make shell` | `CONTAINER_NAME` |
| `make ps` | 查看所有容器 | `make ps` | - |
| `make images` | 查看本地镜像 | `make images` | - |
| `make backup` | 手动备份镜像 | `make backup` | `IMAGE_NAME` |
| `make check` | 检查环境和配置 | `make check` | `PROFILE` |

**常用组合示例**：
```bash
# 自定义端口的生产部署
make PORT=3000 IMAGE_NAME=myapp:v1.0 PROFILE=production deploy

# 开发环境启动
make PROFILE=development dev

# 查看状态和日志
make status
make PROFILE=production logs
```

### 部署脚本命令参考 (deploy.sh)

**基本用法**：
```bash
./deploy.sh [选项] [命令]
```

**命令列表**：

| 命令 | 说明 | 示例 |
|------|------|------|
| （无） | 执行完整部署 | `./deploy.sh` |
| `rollback` | 回滚到上一版本 | `./deploy.sh rollback` |
| `status` | 显示容器运行状态 | `./deploy.sh status` |
| `clean` | 清理未使用的资源 | `./deploy.sh clean` |
| `help` | 显示帮助信息 | `./deploy.sh help` |

**选项列表**：

| 选项 | 长选项 | 参数 | 默认值 | 说明 |
|------|--------|------|--------|------|
| `-p` | `--port` | PORT | 8080 | 自定义端口号 |
| `-i` | `--image` | IMAGE_NAME | agentpit-vue3:latest | 自定义镜像名称 |
| `-e` | `--env` | ENVIRONMENT | production | 选择环境 (production/development) |
| `-h` | `--help` | - | - | 显示帮助信息 |

**使用示例**：
```bash
# 默认部署（生产环境，端口 8080）
./deploy.sh

# 自定义端口
./deploy.sh -p 3000

# 自定义镜像和环境
./deploy.sh -i myapp:v1.0 -e development

# 组合使用
./deploy.sh -p 9090 -i agentpit-prod:v2.1.0 -e production

# 回滚操作
./deploy.sh rollback

# 查看状态
./deploy.sh status

# 清理资源
./deploy.sh clean
```

**部署流程详情**：

完整部署 (`./deploy.sh`) 会依次执行以下步骤：

1. **配置验证** - 检查必要文件存在性
2. **环境检测** - 验证 Podman 和 podman-compose 已安装
3. **镜像备份** - 自动备份当前镜像（用于回滚）
4. **镜像构建** - 执行 `podman build`
5. **停止旧容器** - 停止并移除旧版本的容器
6. **启动新容器** - 使用 compose 启动新版本
7. **健康检查** - 等待应用就绪并验证
8. **状态报告** - 输出部署结果和访问地址

所有操作都会记录到 `logs/deploy.log`。

### 健康检查脚本参考 (healthcheck.sh)

**基本用法**：
```bash
./healthcheck.sh [选项]
```

**选项列表**：

| 选项 | 长选项 | 参数 | 默认值 | 说明 |
|------|--------|------|--------|------|
| `-u` | `--url` | URL | http://localhost:8080/health | 健康检查端点 URL |
| `-t` | `--timeout` | SECONDS | 5 | 请求超时时间（秒） |
| `-r` | `--retries` | COUNT | 3 | 失败后重试次数 |
| `-i` | `--interval` | SECONDS | 2 | 重试间隔时间（秒） |
| `-s` | `--string` | STRING | OK | 期望在响应体中包含的字符串 |
| `-v` | `--verbose` | - | - | 启用详细输出模式 |
| `--headers` | - | - | - | 显示响应头（需配合 -v） |
| `--body` | - | - | - | 显示响应体（需配合 -v） |
| `-h` | `--help` | - | - | 显示帮助信息 |

**退出码**：

| 退出码 | 含义 |
|--------|------|
| 0 | 健康检查通过 |
| 1 | 健康检查失败 |
| 2 | 参数错误 |

**使用示例**：
```bash
# 默认检查
./healthcheck.sh

# 详细模式
./healthcheck.sh -v

# 完整诊断信息
./healthcheck.sh -v --headers --body

# 自定义超时和重试
./healthcheck.sh -t 10 -r 5

# 检查不同端口
./healthcheck.sh -u http://localhost:3000/health

# CI/CD 中使用（静默模式）
./healthcheck.sh -t 5 -r 3 || exit 1
```

### 初始化脚本参考 (init-container.sh)

**基本用法**：
```bash
./init-container.sh [选项]
```

**选项列表**：

| 选项 | 说明 |
|------|------|
| `--dev` | 初始化开发环境（额外检查 Node.js/npm） |
| `--clean` | 清理后重新初始化（停止容器、删除日志等） |
| `--check-only` | 仅执行检查，不进行任何修改 |
| `-h`, `--help` | 显示帮助信息 |

**退出码**：

| 退出码 | 含义 |
|--------|------|
| 0 | 所有检查通过（可能有警告） |
| 1 | 存在失败项 |

**使用示例**：
```bash
# 标准初始化（生产环境）
./init-container.sh

# 开发环境初始化
./init-container.sh --dev

# 仅检查环境状态
./init-container.sh --check-only

# 清理并重新初始化
./init-container.sh --clean

# 开发环境清理
./init-container.sh --dev --clean
```

**检查项目**：

脚本会自动检查以下内容：

✅ **环境检测**：
- 操作系统类型和版本
- Podman 安装及版本
- podman-compose 安装情况（开发模式额外检查 Node.js/npm）
- 磁盘可用空间

✅ **配置验证**：
- `.env` 文件存在性
- `Podmanfile` 存在性
- `podman-compose.yml` 存在性

✅ **目录结构**：
- 创建 `logs/` 目录
- 初始化日志文件（`deploy.log`, `access.log`）

✅ **网络检查**：
- 端口 8080 占用情况
- Podman socket 连接状态
- 外部网络连通性

### 环境变量参考

**全局环境变量（可在命令行或 shell profile 中设置）**：

| 变量名 | 说明 | 默认值 | 适用范围 |
|--------|------|--------|----------|
| `IMAGE_NAME` | 镜像名称 | agentpit-vue3:latest | Makefile, deploy.sh |
| `CONTAINER_NAME` | 容器名称 | agentpit-frontend | Makefile |
| `PORT` | 服务端口号 | 8080 | deploy.sh, Makefile |
| `PROFILE` | 环境配置文件 | production | Makefile, deploy.sh |

**应用环境变量（在 .env 文件中配置）**：

详见 [配置详解 > 环境变量文件](#4-环境变量文件) 章节。

---

## 📝 更新日志

### v1.0.0 (2026-04-10)

#### ✨ 新功能
- ✨ 初始版本发布
- ✨ 支持开发和生产双环境部署
- ✨ 完整的部署脚本和工具链（deploy.sh, healthcheck.sh, init-container.sh）
- ✨ Makefile 统一命令入口（20+ 命令）
- ✨ 多平台支持（Linux/macOS/Windows WSL2）
- ✨ 多阶段构建优化（Node.js 构建 → Nginx 生产）
- ✨ 自动备份和回滚机制
- ✨ 全面的健康检查系统

#### 🔒 安全特性
- 🔒 非 root 用户运行容器（appuser）
- 🔒 只读文件系统（生产环境）
- 🔒 安全头配置（CSP、XSS 保护等）
- 🔒 Nginx 版本号隐藏
- 🔒 环境变量外部化管理

#### 🚀 性能优化
- 🚀 Gzip 压缩（级别 6，减少 ~60% 传输体积）
- 🚀 静态资源长期缓存策略（1 年）
- 🚀 SPA 路由 fallback 优化
- 🚀 层缓存优化（合理安排 COPY 顺序）
- 🚀 Alpine 基础镜像（最小化镜像体积）
- 🚀 资源限制配置（防止资源耗尽）

#### 📖 文档和工具
- 📖 完整的 Podman 使用文档（本文档）
- 📖 详细的配置文件注释
- 📖 彩色输出和进度提示
- 📖 一键故障排查工具
- 📖 CI/CD 集成示例（GitHub Actions, GitLab CI, Jenkins）
- 📖 10 个常见问题及解决方案

#### 🔧 技术栈
- **前端框架**: Vue 3.5 + TypeScript 6.0
- **构建工具**: Vite 8.0 + vue-tsc 3.2
- **CSS 框架**: Tailwind CSS 4.2
- **状态管理**: Pinia 3.0
- **路由**: Vue Router 4.5
- **Web 服务器**: Nginx (Alpine)
- **容器运行时**: Podman 4.x
- **容器编排**: podman-compose 1.x

---

## 📞 支持与反馈

### 获取帮助

- 📖 查看文档：本文档
- 💬 问题讨论：GitHub Discussions
- 🐛 Bug 报告：GitHub Issues
- 📧 联系团队：team@agentpit.com

### 贡献指南

欢迎贡献代码、文档或建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

感谢以下开源项目和社区：

- [Podman](https://podman.io/) - 无守护进程容器引擎
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Nginx](https://nginx.org/) - 高性能 Web 服务器
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

---

**最后更新**: 2026-04-10  
**文档版本**: v1.0.0  
**适用版本**: Flexloop v1.0.0+
