# AgentPit Podman 部署验证清单

## 使用说明
- 本清单用于验证部署是否成功
- 建议按顺序逐项检查
- 每项通过后打勾 ✓
- 遇到问题时记录详细信息以便排查

## 1. 环境准备验证

### 1.1 软件依赖
- [ ] **Podman 版本 >= 4.0**
  - 检查命令：`podman --version`
  - 预期输出：`podman version 4.x.x` 或更高版本
  - 备注：低于 4.0 可能缺少某些功能（如健康检查）

- [ ] **podman-compose 已安装**
  - 检查命令：`podman-compose --version`
  - 预期输出：显示版本号
  - 备注：也可使用 `docker-compose` 或 `podman-docker`

- [ ] **Node.js >= 18**（仅开发环境）
  - 检查命令：`node --version`
  - 预期输出：`v18.x.x` 或更高版本
  - 备注：生产环境不需要，仅在构建镜像时需要

### 1.2 配置文件
- [ ] **`.env.production` 存在**
  - 检查路径：项目根目录下的 `.env.production`
  - 必要配置项：
    - `NODE_ENV=production`
    - `VITE_API_BASE_URL=...`
    - 其他应用特定变量
  - 参考：`.env.production.example`

- [ ] **Podmanfile 存在**
  - 检查路径：项目根目录下的 `Podmanfile`
  - 关键内容验证：
    - 基础镜像正确（如 `nginx:alpine`）
    - 构建阶段完整（多阶段构建）
    - 安全配置合理（非 root 用户）

- [ ] **podman-compose.yml 存在**
  - 检查路径：项目根目录下的 `podman-compose.yml`
  - 关键配置验证：
    - 服务定义正确（web、nginx 等）
    - 端口映射正确（8080:80 或自定义）
    - 卷挂载正确（日志、静态资源等）
    - 健康检查配置存在

### 1.3 网络与端口
- [ ] **目标端口未被占用**
  - 检查命令：`netstat -tlnp | grep 8080` 或 `ss -tlnp | grep 8080`
  - 预期结果：无输出或端口空闲
  - 如被占用需修改端口或停止冲突服务

- [ ] **防火墙规则允许访问**
  - 检查方法：根据系统使用 `firewall-cmd`、`ufw` 或 `iptables`
  - 开发环境可临时关闭防火墙测试
  - 生产环境需正确配置规则

## 2. 构建验证

### 2.1 镜像构建
- [ ] **`podman build -t agentpit-vue3:latest .` 成功**
  - 执行位置：项目根目录
  - 观察要点：
    - 无 ERROR 级别消息
    - 构建步骤全部完成
    - 最终输出 "Successfully tagged"
  - 故障排查：
    - 检查 Dockerfile/Podmanfile 语法
    - 检查基础镜像是否可拉取
    - 检查网络连接

- [ ] **构建无错误或警告**
  - 观察构建日志
  - WARNING 可接受但需评估影响
  - 记录所有非预期输出

- [ ] **构建时间合理**
  - 首次构建：< 5 分钟（含依赖下载）
  - 后续构建：< 2 分钟（利用缓存）
  - 超时可能原因：
    - 网络慢（基础镜像下载）
    - 依赖包过多
    - 构建步骤复杂

### 2.2 镜像检查
- [ ] **`podman images` 显示镜像存在**
  - 检查命令：`podman images | grep agentpit`
  - 预期输出：显示 `agentpit-vue3:latest` 及其 IMAGE ID

- [ ] **镜像大小 < 100MB**
  - 检查命令：`podman images | grep agentpit`
  - 观察 SIZE 列
  - 优化建议：
    - 使用 alpine 基础镜像
    - 清理构建缓存
    - 多阶段构建减少最终层

- [ ] **镜像标签正确**
  - 应包含：`agentpit-vue3:latest`
  - 可选标签：版本号（如 `:v1.0.0`）、日期（`:20260410`）
  - 标签规范：小写字母、数字、`.` `-` `_`

## 3. 运行验证

### 3.1 容器启动
- [ ] **`podman-compose --profile production up -d` 成功**
  - 执行位置：项目根目录
  - 观察输出：
    - 显示 "Creating" 或 "Starting"
    - 无 "Error response from daemon"
    - 容器名称符合预期

- [ ] **容器状态为 running**
  - 检查命令：`podman ps` 或 `podman-compose ps`
  - 预期输出：STATUS 列显示 "Up X seconds/minutes"
  - 异常状态处理：
    - `Created` 但未启动：查看日志
    - `Restarting`：循环崩溃，检查健康检查
    - `Exited`：立即查看错误日志

- [ ] **端口映射 8080:80 正确**
  - 检查命令：`podman port <container_name>`
  - 预期输出：`80/tcp -> 0.0.0.0:8080`
  - 验证方法：浏览器访问 http://localhost:8080

### 3.2 进程检查
- [ ] **Nginx 进程运行正常**
  - 检查命令：`podman exec <container_name> ps aux`
  - 预期输出：看到 nginx master 和 worker 进程
  - worker 数量应与配置一致（通常 auto 或 CPU 核数）

- [ ] **非 root 用户运行**
  - 检查命令：`podman exec <container_name> whoami`
  - 预期输出：`nginx` 或 `www-data` 或其他非 root 用户
  - 验证 UID > 0：`podman exec <container_name> id`

- [ ] **内存占用 < 512MB**
  - 检查命令：`podman stats --no-stream`
  - 观察 MEM USAGE / MEM LIMIT 列
  - 正常范围：50-200MB（取决于应用规模）
  - 过高可能原因：内存泄漏、配置不当

## 4. 功能验证

### 4.1 应用访问
- [ ] **浏览器访问 http://localhost:8080 显示首页**
  - 测试工具：Chrome/Firefox/Edge
  - 验证点：
    - 页面完全加载（无白屏）
    - 内容渲染正常（文字、图片、布局）
    - 无 JavaScript 控制台错误（F12 -> Console）

- [ ] **页面标题正确**
  - 检查浏览器标签页标题
  - 预期值：与 `index.html` 中 `<title>` 一致
  - 例如："AgentPit - AI Agent Platform"

- [ ] **所有导航链接可点击**
  - 测试每个导航菜单项
  - 点击后页面跳转正常
  - 无 404 错误或白屏
  - 返回按钮工作正常

### 4.2 路由功能
- [ ] **刷新页面不出现 404**
  - 操作：在任意子路由页面按 F5 或 Ctrl+R
  - 预期：页面正常显示，不跳转到 Nginx 404 页面
  - 原理：Nginx 配置了 try_files fallback 到 index.html

- [ ] **SPA 路由 fallback 工作正常**
  - 直接访问：http://localhost:8080/some/deep/route
  - 即使路由不存在于服务端，也应返回 index.html
  - 由前端 Vue Router 处理 404 显示

- [ ] **直接访问子路由正常**
  - 测试 URL 示例：
    - `/chat`
    - `/marketplace`
    - `/settings`
    - `/customize`
  - 所有已注册路由均可直接访问

### 4.3 静态资源
- [ ] **JS/CSS 文件加载正常**
  - 检查方式：浏览器开发者工具 -> Network 标签
  - 筛选：JS、CSS 文件类型
  - 状态码：全部为 200（非 304 也算通过）
  - 注意：首次加载应为 200，后续可能为 304（缓存）

- [ ] **图片资源显示正常**
  - 检查页面中的所有图片（logo、图标、背景图等）
  - 无破损图片（alt 文本显示）
  - 图片加载速度合理

- [ ] **无 404 错误（控制台检查）**
  - 打开浏览器控制台（F12）
  - 切换到 Console 标签
  - 刷新页面
  - 不应有红色 404 错误信息
  - 允许的警告：第三方资源加载失败（如有）

## 5. 健康检查验证

### 5.1 健康端点
- [ ] **http://localhost:8080/health 返回 200**
  - 测试命令：`curl -I http://localhost:8080/health`
  - 或浏览器访问该地址
  - 预期 HTTP 状态码：200 OK

- [ ] **响应体包含 "OK"**
  - 测试命令：`curl http://localhost:8080/health`
  - 预期输出：`OK` 或 `{"status":"ok"}`
  - 取决于 healthcheck.sh 的实现

- [ ] **响应时间 < 1 秒**
  - 测试命令：`curl -o /dev/null -s -w '%{time_total}' http://localhost:8080/health`
  - 预期：< 1.000（秒）
  - 正常情况应在 10-100ms

### 5.2 自动健康检查
- [ ] **`podman inspect` 显示 healthy 状态**
  - 检查命令：`podman inspect --format='{{.State.Health.Status}}' <container_id>`
  - 预期输出：`healthy`
  - 其他状态：`starting`（刚启动）、`unhealthy`（连续失败）

- [ ] **连续 3 次检查都通过**
  - 脚本测试：
    ```bash
    for i in {1..3}; do
      curl -sf http://localhost:8080/health && echo "Check $i: PASS" || echo "Check $i: FAIL"
      sleep 1
    done
    ```
  - 全部 PASS 则通过

## 6. 性能验证

### 6.1 压缩
- [ ] **Gzip 压缩生效（响应头 Content-Encoding: gzip）**
  - 测试命令：`curl -H "Accept-Encoding: gzip" -I http://localhost:8080/assets/*.js`
  - 预期响应头：`Content-Encoding: gzip`
  - 浏览器验证：Network 标签 -> Response Headers

- [ ] **压缩率 > 60%（对于文本资源）**
  - 测试方法：
    ```bash
    # 未压缩大小
    curl -s http://localhost:8080/assets/main.js | wc -c
    # 压缩后大小
    curl -s -H "Accept-Encoding: gzip" http://localhost:8080/assets/main.js | wc -c
    ```
  - 计算：(原始大小 - 压缩大小) / 原始大小 * 100% > 60%

### 6.2 缓存
- [ ] **静态资源设置长期缓存（Cache-Control: public, immutable）**
  - 检查命令：`curl -I http://localhost:8080/assets/*.js`
  - 预期头：`Cache-Control: public, max-age=31536000, immutable`
  - 适用文件：带 hash 的 JS/CSS/字体/图片

- [ ] **index.html 不缓存（no-store）**
  - 检查命令：`curl -I http://localhost:8080/`
  - 预期头：`Cache-Control: no-store, no-cache, must-revalidate`
  - 原因：index.html 需要每次获取最新版本

### 6.3 加载速度
- [ ] **首页完全加载时间 < 3 秒（本地网络）**
  - 测试工具：Chrome DevTools -> Network 标签
  - 操作：清空缓存 -> 硬刷新 (Ctrl+Shift+R)
  - 观察：Load event 时间（底部状态栏或 Waterfall 图）
  - 本地网络应很快，生产环境 CDN 会更快

- [ ] **首屏渲染时间 < 1.5 秒**
  - 测试工具：Lighthouse（Chrome 扩展或 DevTools）
  - 运行：Performance audit
  - 关注指标：FCP (First Contentful Paint)、LCP (Largest Contentful Paint)
  - 目标：FCP < 1.0s, LCP < 2.5s

## 7. 安全性验证

### 7.1 容器安全
- [ ] **非 root 用户运行（uid > 0）**
  - 检查命令：`podman exec <container_name> id`
  - 预期输出：`uid=101(nginx) gid=101(nginx)` 或类似
  - 绝不应出现 `uid=0(root)`

- [ ] **只读文件系统启用**
  - 检查命令：`podman inspect <container_id> | grep -A5 '"ReadonlyRootfs"'
  - 预期值：`true`
  - 提高安全性，防止容器内修改系统文件

- [ ] **/tmp 和 /var/run 使用 tmpfs**
  - 检查命令：`podman inspect <container_id> | grep -A10 tmpfs`
  - 预期：看到 tmpfs 挂载配置
  - 用途：Nginx 临时文件、PID 文件等

### 7.2 安全响应头
- [ ] **X-Frame-Options: SAMEORIGIN**
  - 检查命令：`curl -I http://localhost:8080 | grep x-frame-options`
  - 防止点击劫持攻击

- [ ] **X-Content-Type-Options: nosniff**
  - 检查命令：`curl -I http://localhost:8080 | grep x-content-type-options`
  - 防止 MIME 类型嗅探攻击

- [ ] **X-XSS-Protection 启用**
  - 检查命令：`curl -I http://localhost:8080 | grep x-xss-protection`
  - 预期值：`1; mode=block`

- [ ] **Referrer-Policy 设置正确**
  - 检查命令：`curl -I http://localhost:8080 | grep referrer-policy`
  - 推荐值：`strict-origin-when-cross-origin` 或 `no-referrer-when-downgrade`

- [ ] **Content-Security-Policy 头存在**
  - 检查命令：`curl -I http://localhost:8080 | grep content-security-policy`
  - 应限制脚本、样式、图片等资源来源
  - 示例：`default-src 'self'; script-src 'self' ...`

- [ ] **Nginx 版本号隐藏（server_tokens off）**
  - 检查命令：`curl -I http://localhost:8080 | grep Server`
  - 预期输出：`Server: nginx`（无版本号）
  - 错误示例：`Server: nginx/1.24.0`

## 8. 日志验证

### 8.1 日志持久化
- [ ] **logs/ 目录存在**
  - 检查路径：项目根目录下 `logs/`
  - 应包含：`access.log`、`error.log`（启动后自动生成）

- [ ] **nginx 访问日志正常写入**
  - 检查文件：`logs/access.log`
  - 操作：多次刷新页面后查看
  - 预期：每条请求都有记录（IP、时间、URL、状态码等）

- [ ] **nginx 错误日志正常写入**
  - 检查文件：`logs/error.log`
  - 正常情况下应很少或为空
  - 如果有错误，分析原因并修复

- [ ] **容器重启后日志保留**
  - 测试步骤：
    1. 记录当前日志行数：`wc -l logs/access.log`
    2. 重启容器：`podman-compose restart`
    3. 再次检查：日志应保留且继续追加
  - 原因：使用了卷挂载（volume mount）

### 8.2 日志轮转
- [ ] **单个日志文件 < 10MB**
  - 检查命令：`ls -lh logs/`
  - 观察文件大小
  - 超过 10MB 需要轮转策略

- [ ] **保留最近 3 个日志文件**
  - 检查命令：`ls -la logs/*.log.*`
  - 应看到 `.1`, `.2`, `.3` 后缀的旧日志
  - 通过 logrotate 或 Nginx 内置功能实现

## 9. 开发环境验证（可选）

> ⚠️ 以下项目仅开发环境需要验证，生产环境可跳过

- [ ] **开发环境热重载工作**
  - 启动开发服务器：`npm run dev`
  - 修改任一 Vue 组件代码
  - 保存后浏览器自动更新（无需手动刷新）

- [ ] **源码修改自动编译**
  - Vite HMR (Hot Module Replacement) 生效
  - 控制台显示 `[hmr]` 更新日志
  - 编译错误在终端和浏览器覆盖层显示

- [ ] **浏览器自动刷新**
  - 修改 CSS：立即生效，无整页刷新
  - 修改组件逻辑：组件热替换，保留状态
  - 修改 main.ts 或路由配置：整页刷新

## 验证结果汇总

| 类别 | 总项数 | 通过 ✓ | 失败 ✗ | 跳过 ⊘ |
|------|--------|--------|--------|--------|
| 1. 环境准备验证 | 9 | ___ | ___ | ___ |
| 2. 构建验证 | 6 | ___ | ___ | ___ |
| 3. 运行验证 | 6 | ___ | ___ | ___ |
| 4. 功能验证 | 9 | ___ | ___ | ___ |
| 5. 健康检查验证 | 5 | ___ | ___ | ___ |
| 6. 性能验证 | 5 | ___ | ___ | ___ |
| 7. 安全性验证 | 9 | ___ | ___ | ___ |
| 8. 日志验证 | 6 | ___ | ___ | ___ |
| 9. 开发环境验证 | 3 | ___ | ___ | ___ |
| **总计** | **58** | **___** | **___** | **___** |

---

**结论**：

- [ ] **通过 ✓** ：所有必选项（1-8 类）全部通过，开发环境项（第 9 类）可选
- [ ] **有条件通过 ⚠** ：核心功能通过，但存在非阻塞性问题（如性能未达标但可用）
- [ ] **未通过 ✗** ：存在阻塞性问题（无法启动、关键功能失败、安全漏洞）

**阻塞问题列表**（如有）：
1.
2.
3.

**非阻塞问题列表**（如有）：
1.
2.
3.

**改进建议**：
-
-

---

**验证人**：_____________

**日期**：____年__月__日

**签名**：_____________

---

## 附录：常用调试命令

```bash
# 查看容器日志
podman logs -f <container_name>

# 进入容器内部
podman exec -it <container_name> /bin/sh

# 查看 Nginx 配置
podman exec <container_name> cat /etc/nginx/nginx.conf

# 测试 Nginx 配置语法
podman exec <container_name> nginx -t

# 重载 Nginx 配置
podman exec <container_name> nginx -s reload

# 查看容器资源占用
podman stats --no-stream

# 查看容器详细信息
podman inspect <container_id>

# 强制删除所有容器和镜像（慎用！）
podman system prune -a
```

## 附录：常见问题排查

### Q1: 容器启动后立即退出
- 检查 `podman logs <container_name>` 查看错误
- 常见原因：Nginx 配置错误、端口冲突、权限问题

### Q2: 健康检查一直 failing
- 手动执行健康检查脚本：`curl http://localhost:8080/health`
- 检查 healthcheck.sh 是否有执行权限
- 查看间隔时间和超时设置是否合理

### Q3: 静态资源 404
- 检查 nginx.conf 中的 root 和 alias 路径
- 确认构建产物是否正确复制到镜像中
- 检查 dist 目录结构是否符合预期

### Q4: 页面刷新 404
- 确认 nginx.conf 配置了 `try_files $uri $uri/ /index.html`
- SPA 应用必须配置此规则

### Q5: 性能不达标
- 启用 Gzip 压缩
- 配置合理的缓存策略
- 考虑使用 CDN 分发静态资源
- 优化图片格式（WebP）和大小

---

*文档版本*: v1.0
*最后更新*: 2026-04-10
*适用环境*: Linux/macOS (Podman)
