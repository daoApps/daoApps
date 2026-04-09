# AgentPit Vue3 迁移与容器化部署规范（完整版）

## Why
现有 AgentPit 项目基于 React 技术栈开发，需要按照新的技术标准迁移至 Vue3 生态系统，并实现 Podman 容器化部署方案，确保符合企业级开发规范和生产环境要求。同时需集成 DeepResearch 智能体工具链和 Flexloop 工具，实现智能体服务的标准化调用。本项目需遵循严格的性能指标、质量标准和执行规范。

## What Changes
- **BREAKING**: 将前端框架从 React 19 迁移至 Vue 3.4+ (Composition API)
- **BREAKING**: 状态管理从 Zustand 迁移至 Pinia
- **BREAKING**: 路由系统从 React Router 迁移至 Vue Router 4
- 新增 ESLint + Prettier 代码规范工具链（零错误率要求）
- 新增 Podman 容器化部署配置（多阶段构建，镜像 ≤500MB）
- 新增环境变量管理方案（严格区分环境，敏感信息外部注入）
- 新增 docker-compose/podman-compose 编排文件（资源限制 + 健康检查）
- 集成 DeepResearch 智能体服务调用接口（响应时间 ≤5秒）
- 集成 flexloop 工具调用模块（版本号明确指定）
- 新增项目执行规范（错误处理流程、Git 提交规范、复盘机制）
- 实现完整的 CI/CD 就绪配置

## Impact
- Affected specs: agentpit-platform-development (需同步更新)
- Affected code: 整个 `apps/AgentPit/` 目录重构
- Affected deployment: 新增容器化和编排配置
- Affected tooling: 集成 tools/ 目录下的工具链
- Affected process: Git 工作流、文档记录、复盘机制

---

## ADDED Requirements

### Requirement 1: Vue3 项目架构重构（强制 Composition API）

系统 SHALL 使用 Vue 3.4+ 框架完全重写前端应用，**强制采用 Composition API (`<script setup>` 语法)**，严格遵循 Vue 官方风格指南，确保代码一致性和可维护性。

#### 详细指标：
- **组件类型定义**: 所有组件必须包含完整的 TypeScript 接口/类型定义
- **文档注释**: 每个组件必须包含 JSDoc 风格的注释（用途、Props说明、Events、Slots）
- **组件复用率**: 可复用组件比例不低于 **60%**（总组件数中可复用组件占比）
- **单一职责**: 每个组件文件不超过 **300 行**（不含样式和注释）

#### Scenario: 成功案例
- **WHEN** 开发者运行 `npm run dev` 启动开发服务器
- **THEN** 系统应使用 Vite + Vue 3 启动开发环境，支持热模块替换(HMR)
- **AND** 所有组件均采用 Composition API 和 `<script setup>` 语法
- **AND** 目录结构符合 Vue 项目规范：`src/components/`, `src/views/`, `src/composables/`, `src/stores/`
- **AND** 所有组件通过 TypeScript 严格模式编译无警告

### Requirement 2: ESM 模块化与循环依赖处理

系统 SHALL 采用 **ECMAScript Modules (ESM)** 作为模块化方案，确保所有 JavaScript/TypeScript 文件遵循 ES6+ 标准，实现模块间的清晰依赖管理。

#### 详细指标：
- **导入导出机制**: 使用 `import/export` 语法，禁止使用 `require()`
- **路径别名**: 配置 `@/` 映射到 `src/` 目录，避免相对路径嵌套过深
- **循环依赖处理策略**:
  - 使用依赖注入（DI）模式解耦
  - 事件总线或 Pinia store 作为中间层
  - 工具函数提取到独立 utils 层
- **模块边界**: 跨模块通信必须通过明确的接口（store/composable/event），禁止直接引用内部实现

#### Scenario: 成功案例
- **WHEN** 开发者编写新模块或组件
- **THEN** 所有模块使用 ESM `import/export` 语法
- **AND** 无循环依赖警告（通过 ESLint plugin 检测）
- **AND** 模块依赖关系图清晰可追溯

### Requirement 3: Vite 构建优化与性能指标

系统 SHALL 使用 Vite 作为构建工具，配置开发环境热更新、生产环境代码压缩与优化，**构建产物体积必须控制在行业标准范围内**。

#### 性能指标（硬性要求）：

| 指标项 | 目标值 | 测量方法 |
|--------|--------|----------|
| JavaScript 文件 gzip 压缩后大小 | **单个文件 ≤ 150KB** | `gzip-size` 包检测 |
| 首屏加载时间（FCP） | **≤ 3 秒** | Lighthouse / WebPageTest |
| 最大内容绘制（LCP） | **≤ 2.5 秒** | Lighthouse |
| 累积布局偏移（CLS） | **≤ 0.1** | Lighthouse |
| 首次输入延迟（FID） | **≤ 100ms** | Lighthouse |
| 构建产物总体积（未压缩） | **≤ 2MB** | Vite build output |
| 代码分割 chunk 数量 | **合理分割**（避免过多 HTTP 请求） | 分析报告 |

#### 构建配置要求：
- **Tree-shaking**: 确保未使用的代码被消除
- **Code Splitting**: 路由级懒加载 + 第三方库单独打包
- **Minification**: Terser 压缩 + CSSnano 优化
- **Asset Optimization**: 图片压缩（imagemin）、字体子集化
- **Source Map**: 生产环境生成 .map 文件但不上传到 CDN

#### Scenario: 成功案例
- **WHEN** 执行 `npm run build` 生产构建
- **THEN** 构建成功且无 TypeScript 错误
- **AND** 每个 JS chunk gzip 后不超过 150KB
- **AND** 运行 `npx lighthouse` 评分 ≥ 90（Performance）

### Requirement 4: 代码规范检查（ESLint + Prettier 零错误率）

系统 SHALL 实现 **ESLint 和 Prettier 代码规范检查**，并集成到开发流程中，**确保提交代码前自动执行检查，错误率为零**。

#### 详细配置要求：

**ESLint 规则集**:
```javascript
// .eslintrc.cjs 核心配置
{
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/multi-word-component-names': 'warn',
    'vue/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

**Prettier 规则**:
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### 自动化流程：
- **Pre-commit Hook**: 使用 husky + lint-staged，提交前自动运行 `eslint --fix && prettier --write`
- **CI Pipeline**: PR 合并前运行完整 lint 检查，**任何 warning 或 error 都会阻断合并**
- **IDE 集成**: 提供 `.vscode/settings.json` 配置，确保编辑器保存时自动格式化

#### Scenario: 成功案例
- **WHEN** 开发者执行 `npm run lint`
- **THEN** ESLint 报告 **0 errors, 0 warnings**
- **AND** 执行 `npm run format:check` 显示无需格式化
- **AND** Git pre-commit hook 自动通过，无阻断

### Requirement 5: Podman 容器化部署（镜像 ≤ 500MB）

系统 SHALL 使用 **Podman 容器化技术**进行部署，确保容器基础镜像版本明确且安全，采用多阶段构建以减小镜像体积。

#### 详细指标：

| 指标项 | 要求 |
|--------|------|
| 基础镜像 | **官方镜像，版本号精确到 patch 级别**（如 `node:20.11.0-alpine3.19`） |
| 最终镜像大小 | **≤ 500MB**（未压缩）/ **≤ 150MB**（gzip 压缩后） |
| 安全扫描 | 通过 `podman scan` 或 Trivy 无 HIGH/CRITICAL 漏洞 |
| 运行用户 | **非 root 用户**（创建专用 user/group） |
| 层数限制 | **≤ 3 层**（减少攻击面） |

#### 多阶段构建示例：
```dockerfile
# Stage 1: Build
FROM node:20.11.0-alpine3.19 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:1.25.4-alpine3.19
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

#### Scenario: 成功案例
- **WHEN** 执行 `podman build -t agentpit:v1.0.0 -f Podmanfile .`
- **THEN** 构建成功且最终镜像大小 ≤ 500MB
- **AND** `podman images` 显示镜像信息正确
- **AND** `podman run -p 8080:8080 agentpit:v1.0.0` 正常启动

### Requirement 6: 环境变量管理与敏感信息安全

系统 SHALL 实现严格的环境变量管理方案，**严格区分开发、测试和生产环境配置，敏感信息不得硬编码**，必须通过环境变量或配置服务注入。

#### 环境文件结构：
```
.env                          # 默认变量（所有环境共享）
.env.development              # 开发环境覆盖
.env.staging                  # 测试/预发布环境
.env.production               # 生产环境
.env.local                    # 本地私有变量（不提交到 Git）
```

#### 敏感信息处理规则：
- **禁止硬编码**: API 密钥、数据库密码、Token 等不得出现在源代码中
- **注入方式**: 
  - 开发环境：`.env.local`（加入 `.gitignore`）
  - 生产环境：Kubernetes Secrets / Docker Secrets / 环境变量注入
- **类型安全**: `env.d.ts` 定义完整的 `ImportMetaEnv` 接口
- **验证机制**: 应用启动时校验必要的环境变量是否存在，缺失则报错退出

#### Scenario: 成功案例
- **WHEN** 应用程序启动
- **THEN** 从对应环境的 `.env` 文件加载配置
- **AND** 敏感信息通过环境变量注入，源码中无明文密钥
- **AND** TypeScript 编译时对 `import.meta.env.VITE_*` 有类型提示
- **AND** 缺少必要环境变量时启动失败并提示具体缺失项

### Requirement 7: 容器编排与服务治理（保留 3 个历史版本）

系统 SHALL 提供完整的容器编排方案（`podman-compose.yml`），定义服务依赖关系和资源限制，支持回滚操作（**保留至少 3 个历史版本**）。

#### 编排配置要求：

```yaml
# podman-compose.yml 核心配置
services:
  agentpit-frontend:
    image: agentpit:${VERSION:-latest}
    ports:
      - "${PORT:-8080}:8080"
    environment:
      - NODE_ENV=production
      - VITE_API_BASE_URL=${API_BASE_URL}
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
      reservations:
        cpus: '0.25'
        memory: 256M
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - agentpit-network
    volumes:
      - nginx-logs:/var/log/nginx
```

#### 版本管理与回滚：
- **版本标签**: 每次 CI/CD 构建生成语义化版本号（`v1.0.0`, `v1.0.1` 等）
- **镜像仓库**: 推送到私有 Registry，保留最近 **3 个稳定版本**
- **回滚命令**: 
  ```bash
  # 回滚到上一版本
  podman-compose down && VERSION=v1.0.${PREVIOUS} podman-compose up -d
  
  # 或使用标签
  podman tag agentpit:v1.0.2 agentpit:rollback-latest
  ```
- **蓝绿部署**: 支持两个版本并行运行，通过负载均衡切换流量

#### Scenario: 成功案例
- **WHEN** 执行 `podman-compose up -d`
- **THEN** 服务按依赖顺序启动，健康检查通过
- **AND** 资源限制生效（内存 ≤ 512M, CPU ≤ 0.5 核）
- **AND** 执行回滚脚本可在 60 秒内恢复到上一版本

### Requirement 8: DeepResearch 智能体集成（响应时间 ≤ 5 秒）

系统 SHALL 集成 DeepResearch 智能体服务，通过标准命令格式调用智能体问答和研究功能，**响应时间不超过 5 秒**。

#### 调用规范：
- **命令格式**: `deepresearch -c D:\\xinet\\daoCollective\\daoApps\\config`
- **前置条件检查**:
  1. 验证 `tools/DeepResearch` 目录存在
  2. 执行 `cd tools/DeepResearch && pdm install` 安装依赖（检查 `pdm.lock`）
  3. 验证配置文件路径存在（**禁止查看 config 内容**）
  4. 检查 Python 环境（≥ 3.9）
- **超时控制**: 设置 5 秒超时，超时后返回友好错误提示
- **日志记录**: 结构化 JSON 日志，字段包括：
  ```json
  {
    "timestamp": "2026-02-03T10:30:00Z",
    "tool": "DeepResearch",
    "action": "query",
    "parameters": {"query": "..."},
    "duration_ms": 2340,
    "status": "success",
    "result_summary": "...",
    "error": null
  }
  ```

#### Scenario: 成功案例
- **WHEN** 用户触发智能体研究任务
- **THEN** 系统在 **5 秒内**返回结果或超时提示
- **AND** 调用日志已记录到 `logs/deepresearch/YYYY-MM-DD.log`
- **AND** 日志保留至少 **30 天**（自动清理旧日志）

### Requirement 9: Flexloop 工具集成（版本明确指定）

系统 SHALL 正确集成 flexloop 工具，确保工具路径配置正确且**版本号在配置文件中明确指定**。

#### 集成规范：
- **工具路径**: `d:\xinet\daoCollective\daoApps\daoApps\tools\flexloop`
- **版本锁定**: 在 `tools/flexloop/pyproject.toml` 中明确版本号
- **依赖安装**: 调用前执行 `cd tools/flexloop && pdm install`（使用 `pdm.lock` 锁定版本）
- **版本验证**: 调用时检查实际安装版本是否符合要求，不符合则提示升级
- **日志记录**: 与 DeepResearch 相同的结构化日志格式

#### Scenario: 成功案例
- **WHEN** 系统需要调用 flexloop 功能
- **THEN** 版本号已在配置文件中明确声明
- **AND** `pdm lock` 文件存在且未被修改
- **AND** 调用日志完整记录于 `logs/flexloop/YYYY-MM-DD.log`

### Requirement 10: 统一日志系统（保留 30 天 + 自动归档）

系统 SHALL 实现统一的日志管理系统，**所有工具调用必须记录详细日志，按日期归档，保留至少 30 天**。

#### 日志规范：
- **存储位置**: `apps/AgentPit/logs/{tool_name}/YYYY-MM-DD.log`
- **格式**: JSON Lines（每行一个 JSON 对象）
- **字段结构**:
  ```typescript
  interface LogEntry {
    timestamp: string;       // ISO 8601 格式
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    module: string;          // 模块名称（如 'deepresearch', 'flexloop'）
    action: string;          // 操作类型
    parameters?: Record<string, unknown>;  // 输入参数（脱敏处理）
    duration_ms?: number;    // 执行耗时
    status: 'success' | 'failure' | 'timeout';
    result?: string;         // 结果摘要
    error?: {               // 错误信息（如有）
      code: string;
      message: string;
      stack?: string;
    };
    metadata?: Record<string, unknown>;  // 其他元数据
  }
  ```
- **归档策略**: 
  - 每日生成新日志文件
  - 超过 30 天的日志自动压缩为 `.gz` 并归档到 `logs/archive/`
  - 超过 90 天的归档文件自动删除
- **查询工具**: 提供 `scripts/query-logs.ts` 脚本支持按日期/级别/模块过滤

#### Scenario: 成功案例
- **WHEN** 任意工具被调用
- **THEN** 日志立即写入当日日志文件
- **AND** 日志包含完整的时间戳、参数、结果、耗时信息
- **AND** 30 天内的日志均可检索查询

### Requirement 11: 项目执行规范 - 错误处理流程

系统 SHALL 在开发过程中遇到任何技术错误或问题时，**必须立即调用指定的技能组合进行处理**。

#### 错误处理标准流程（三步法）：

**Step 1: 使用 `/spec` 定义问题规范**
- 创建问题描述文档，包含：
  - 问题 ID（格式：`BUG-YYYYMMDD-NNN`）
  - 问题描述（现象、复现步骤、预期 vs 实际行为）
  - 影响范围（影响的功能模块、用户群体、严重程度 P0-P3）
  - 环境信息（Node版本、浏览器、操作系统）
  - 截图/日志附件

**Step 2: 使用 `/skill-create` 创建解决方案**
- 设计针对性解决方案：
  - 根因分析（Root Cause Analysis）
  - 解决方案设计（代码变更、配置调整、架构优化）
  - 测试计划（单元测试、集成测试、回归测试）
  - 风险评估（可能的副作用、兼容性问题）

**Step 3: 使用 `task-execution-summary` 生成执行总结**
- 记录完整的问题解决过程：
  - 执行步骤详情
  - 遇到的额外问题和应对
  - 最终解决方案和代码变更
  - 验证结果（测试通过截图、性能数据）
  - 经验教训（如何避免类似问题、最佳实践总结）

#### 文档归档要求：
- 所有调试过程、问题分析、解决方案及经验教训必须完整记录在 **`.trae/issues/`** 目录下
- 文档命名规范：`{ProblemID}-{简短描述}.md`
- 文档模板：
  ```markdown
  # {ProblemID}: {标题}
  
  ## 问题描述
  ## 影响范围
  ## 复现步骤
  ## 根因分析
  ## 解决方案
  ## 代码变更
  ## 测试验证
  ## 经验教训
  ## 相关文档链接
  ```

#### Scenario: 成功案例
- **WHEN** 开发过程中遇到技术错误
- **THEN** 立即触发错误处理流程（三步法）
- **AND** 问题文档已创建在 `.trae/issues/` 目录
- **AND** 解决方案经过验证并记录完整
- **AND** 类似问题可通过文档快速定位解决方案

### Requirement 12: Git 版本控制规范（约定式提交）

系统 SHALL 遵循严格的 **Git 版本控制流程**，在完成关键功能模块、修复重要 bug 或达到阶段性目标时执行 git 提交操作，**提交信息需清晰描述变更内容（遵循约定式提交规范 Conventional Commits）**。

#### 提交规范（Conventional Commits v1.0）：

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

**Type 类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（非新功能、非 bug 修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具/辅助工具变更

**Scope 范围示例**:
- `vue3-migration`: Vue3 迁移相关
- `monetization`: 变现模块
- `chat`: 对话模块
- `deployment`: 部署配置
- `ci-cd`: CI/CD 流程

**提交示例**:
```
feat(chat): 实现流式输出打字机效果

- 添加 useTypewriter composable
- 支持 30-300ms 可调节打字速度
- 集成到 MessageList 组件
- 添加相关单元测试

Closes #123
```

#### 提交时机要求：
- ✅ **必须提交**: 完成一个 Task/SubTask、修复重要 Bug、达到阶段性里程碑
- ✅ **建议提交**: 完成一个组件、完成一个页面、重大重构节点
- ❌ **禁止提交**: 代码无法编译、测试失败、有 TODO 未处理

#### 分支策略：
- `main`: 生产环境代码（受保护，仅允许 PR 合并）
- `develop`: 开发主分支
- `feature/*`: 功能开发分支（从 develop 创建）
- `bugfix/*`: Bug 修复分支（从 develop 创建）
- `hotfix/*`: 紧急修复分支（从 main 创建）

#### Scenario: 成功案例
- **WHEN** 完成一个关键功能模块
- **THEN** 执行 `git add` + `git commit` 并附上规范的提交信息
- **AND** 提交信息遵循 Conventional Commits 格式
- **AND** 推送至远程仓库并创建 PR（如适用）

### Requirement 13: 阶段复盘机制（24 小时内完成）

系统 SHALL 在每个开发阶段结束后进行全面复盘，**总结项目进展、遇到的问题、解决方案、经验教训及改进方向，并将复盘结果详细记录在 `.trae` 目录下的指定文档中**，**复盘文档需在阶段结束后 24 小时内完成**。

#### 复盘触发条件：
- Phase 1 完成：Vue3 项目初始化与架构搭建
- Phase 2 完成：核心框架迁移（Router/Pinia/布局）
- Phase 3 完成：所有功能模块迁移完成
- Phase 4 完成：容器化部署配置就绪
- Phase 5 完成：工具集成与日志系统
- Phase 6 完成：测试通过并上线

#### 复盘文档模板（存放在 `.trae/reviews/`）：

```markdown
# Phase N 复盘报告：{阶段名称}

## 📋 基本信息
- **阶段名称**: {Phase Name}
- **时间范围**: YYYY-MM-DD ~ YYYY-MM-DD
- **参与人员**: {Team Members}
- **复盘日期**: YYYY-MM-DD HH:MM

## 📊 进展概览
### 已完成任务
- [ ] Task X: {任务描述} ✓
- [ ] Task Y: {任务描述} ✓

### 未完成任务
- [ ] Task Z: {任务描述} ✗（原因：...）

### 关键指标
| 指标 | 目标 | 实际 | 达成率 |
|------|------|------|--------|
| 任务完成数 | N | M | M/N% |
| 代码质量（ESLint错误数） | 0 | 0 | 100% |
| 组件迁移数量 | N | M | M/N% |
| 测试覆盖率 | >80% | XX% | XX% |

## 🔍 遇到的问题
### 问题 1: {标题}
- **严重程度**: P0/P1/P2/P3
- **问题描述**: ...
- **影响范围**: ...
- **根因分析**: ...

## 💡 解决方案
### 方案 1: {针对问题1}
- **实施步骤**: ...
- **效果验证**: ...
- **代码变更**: {PR链接或commit hash}

## 📝 经验教训
### ✅ 做得好的方面
1. ...
2. ...

### ⚠️ 需要改进的方面
1. ...
2. ...

### 💡 最佳实践总结
1. ...
2. ...

## 🎯 下阶段改进方向
1. **改进点 1**: 具体措施...
2. **改进点 2**: 具体措施...

## 📎 附件
- [性能报告](./reports/performance-phase-N.md)
- [测试报告](./reports/test-phase-N.md)
- [部署日志](./logs/deploy-phase-N.log)
```

#### 知识沉淀要求：
- 复盘文档必须在阶段结束后的 **24 小时内** 完成
- 文档需包含具体的改进措施和时间表
- 关键经验和最佳实践应同步更新到项目 Wiki 或 README
- 问题解决方案应关联到对应的 Issue 文档（Requirement 11）

#### Scenario: 成功案例
- **WHEN** 一个开发阶段全部完成
- **THEN** 在 24 小时内输出完整的复盘文档
- **AND** 文档存放在 `.trae/reviews/phase-{N}-review.md`
- **AND** 文档包含进展、问题、方案、经验、改进方向等完整内容
- **AND** 团队成员可查阅并基于此改进下一阶段工作

---

## MODIFIED Requirements

### Requirement: 项目目录结构（从 React 迁移至 Vue - 完整版）

原有的 React 项目结构 SHALL 重构为 Vue 3 标准结构，并增加文档和规范目录：

```
apps/AgentPit/
├── .trae/                      # 项目执行规范目录（新增）
│   ├── specs/                  # 规范文档
│   │   ├── agentpit-platform-development/
│   │   └── agentpit-vue3-deployment/
│   ├── issues/                 # 问题追踪（错误处理流程产出）
│   │   └── BUG-YYYYMMDD-NNN-描述.md
│   └── reviews/                # 阶段复盘文档
│       └── phase-N-review.md
├── public/                     # 静态资源
├── src/
│   ├── assets/                # 图片、字体等静态资源
│   ├── components/            # 可复用组件（复用率 ≥ 60%）
│   │   ├── layout/           # 布局组件
│   │   ├── home/             # 首页组件
│   │   ├── monetization/     # 变现模块
│   │   ├── sphinx/           # 建站模块
│   │   ├── chat/             # 对话模块
│   │   ├── social/           # 社交模块
│   │   ├── marketplace/      # 交易模块
│   │   ├── collaboration/    # 协作模块
│   │   ├── memory/           # 记忆模块
│   │   ├── customize/        # 定制模块
│   │   ├── lifestyle/        # 生活服务
│   │   └── settings/         # 设置模块
│   ├── views/                # 页面级组件（原 pages/）
│   ├── composables/          # 组合式函数（Vue3 特有）
│   ├── stores/               # Pinia 状态管理（原 store/）
│   ├── router/               # Vue Router 配置
│   │   └── index.ts
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数（含循环依赖处理层）
│   ├── data/                 # Mock 数据
│   ├── logs/                 # 运行时日志（新增）
│   │   ├── deepresearch/     # DeepResearch 工具日志
│   │   ├── flexloop/         # Flexloop 工具日志
│   │   └── app/              # 应用日志
│   ├── App.vue               # 根组件
│   └── main.ts               # 入口文件
├── scripts/                   # 工具脚本（新增）
│   ├── build.sh              # 构建脚本
│   ├── deploy.sh             # 部署脚本
│   ├── rollback.sh           # 回滚脚本
│   └── query-logs.ts         # 日志查询工具
├── docs/                      # 项目文档（新增）
│   ├── DEPLOYMENT.md         # 部署文档
│   ├── ARCHITECTURE.md       # 架构文档
│   └── API.md                # API 文档
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── .env.staging               # 测试环境变量
├── .env.local                 # 本地私有变量（gitignore）
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc                # Prettier 配置
├── .husky/                    # Git hooks（新增）
│   └── pre-commit            # Pre-commit hook
├── .lintstagedrc              # Lint-staged 配置（新增）
├── index.html                 # HTML 入口
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Podmanfile                 # 容器构建文件
├── podman-compose.yml         # 编排文件
├── nginx.conf                 # Nginx 配置（新增）
└── README.md                  # 项目说明（更新）
```

### Requirement: 组件编写规范（Vue3 Composition API - 完整版）

所有组件 SHALL 遵循 Vue 3 Composition API 规范，**必须包含完整的类型定义和文档注释**：

```vue
<!--
  @component ComponentName
  @description 组件用途描述（一句话）
  @author AuthorName
  @since 2026-02-03
  @example
  <ComponentName :title="Hello" :count="5" @update="handleUpdate" />
-->
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
/**
 * ComponentName - 组件详细描述
 * 
 * @description 
 * 该组件用于实现 XXXX 功能。
 * 主要特性：
 * - 特性1
 * - 特性2
 * 
 * @props
 * - title (string, required): 标题文本
 * - count (number, optional): 数量，默认值为 0
 * 
 * @emits
 * - update (value: string): 当 XXX 时触发
 * 
 * @slots
 * - default: 默认插槽，用于自定义内容
 * 
 * @composables
 * - useExampleStore: 状态管理
 * 
 * @dependencies
 * - vue: ^3.4.0
 * - pinia: ^2.1.0
 */

// 1. 导入（分组：Vue核心 → 第三方库 → 本地模块 → 类型）
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useExampleStore } from '@/stores/example'
import type { Item } from '@/types/item'

// 2. Props 和 Emits 定义（带完整类型注解）
interface Props {
  /** 标题文本 */
  title: string
  /** 数量 */
  count?: number
}

interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<Emits>()

// 3. 响应式状态
const state = ref<string>('')
const items = reactive<Item[]>([])
const isLoading = ref<boolean>(false)

// 4. 计算属性（带复杂逻辑时添加注释）
const doubledCount = computed(() => props.count * 2)

const filteredItems = computed(() => {
  return items.filter(item => item.isActive)
})

// 5. 方法（添加 JSDoc 注释）
/**
 * 处理点击事件
 * @param event - 鼠标事件对象
 */
function handleClick(event: MouseEvent): void {
  emit('update', state.value)
}

/**
 * 异步加载数据
 * @throws {Error} 当网络请求失败时抛出错误
 */
async function loadData(): Promise<void> {
  isLoading.value = true
  try {
    // 业务逻辑
  } catch (error) {
    console.error('加载数据失败:', error)
    throw error
  } finally {
    isLoading.value = false
  }
}

// 6. 监听器
watch(() => props.title, (newTitle) => {
  console.log('标题变更:', newTitle)
})

// 7. 生命周期
onMounted(() => {
  loadData()
})

// 8. 暴露给父组件的方法（如需要）
defineExpose({
  reload: loadData
})
</script>

<style scoped>
/* 组件样式（使用 BEM 命名规范） */
.component-name {
  /* ... */
}

.component-name__title {
  /* ... */
}

.component-name--active {
  /* ... */
}
</style>
```

### Requirement 14: 任务完成后的工作流回切与衔接机制（Phase 7）

系统 SHALL 在完成 `agentpit-vue3-deployment` 目录下的所有开发任务后，**立即切换回 `agentpit-platform-development` 目录**，确保整个项目开发流程的完整性和可追溯性。

#### 回切触发条件：
- ✅ Phase 1-6 所有任务完成（Task 1-24 全部标记为已完成）
- ✅ checklist.md 中所有验证项通过检查
- ✅ 阶段复盘文档已输出（`.trae/reviews/phase-6-review.md`）
- ✅ Git 提交已完成，代码已推送到远程仓库

#### 回切操作清单：

**Step 1: 环境配置调整**
- [ ] 确认当前工作目录为 `apps/AgentPit/`
- [ ] 检查 Vue3 项目构建产物完整性（dist/ 目录、Podman镜像等）
- [ ] 备份当前开发状态到 `.trae/backups/vue3-migration-backup-YYYYMMDD/`
- [ ] 记录当前分支名称和最新 commit hash
- [ ] 创建版本标签：`git tag -a v3.0.0-vue3-migration-complete -m "Vue3迁移完成"`

**Step 2: 文件依赖关系检查**
- [ ] 对比 React 版本和 Vue3 版本的文件结构差异
- [ ] 检查是否有遗留的 .tsx/.jsx 文件未迁移
- [ ] 验证所有 import 路径是否正确更新为 ESM 格式
- [ ] 检查 node_modules 依赖是否与 package.json 一致
- [ ] 运行 `npm run build` 确保无编译错误
- [ ] 运行 `npm run lint` 确保 **零错误零警告**

**Step 3: 代码冲突检查**
- [ ] 切换到目标规范目录：`cd .trae/specs/agentpit-platform-development`
- [ ] 读取 platform-development 的 tasks.md 和 checklist.md
- [ ] 检查两个 spec 目录间的任务重叠或冲突项
- [ ] 更新 platform-development 的 spec.md，标注 Vue3 迁移已完成
- [ ] 同步两个 spec 的状态信息（避免重复执行已完成的任务）

**Step 4: Git 版本控制操作（遵循约定式提交）**

```bash
# 1. 提交切换记录
git add .
git commit -chore(specs): 完成Vue3迁移并切换回platform-development规范

- 完成 Phase 1-6 所有任务（Task 1-24）
- 通过全部验证项（checklist.md）
- 输出阶段复盘文档（phase-6-review.md）
- 创建备份：vue3-migration-backup-YYYYMMDD
- 打标签：v3.0.0-vue3-migration-complete
- 切换至 agentpit-platform-development 规范目录
- 执行环境配置、依赖检查、冲突检测
- 准备进入下一开发阶段

Closes #agentpit-vue3-deployment
```

**Step 5: 分支信息更新与同步**
- [ ] 更新本地 develop 分支：`git checkout develop && git merge --no-ff feature/vue3-migration`
- [ ] 推送到远程仓库：`git push origin develop --tags`
- [ ] 创建 PR 合并到 main 分支（如适用）
- [ ] 更新团队协作文档（CONTRIBUTING.md 或 README.md）
- [ ] 通知相关团队成员迁移完成（通过 Slack/钉钉/邮件）

**Step 6: 规范目录切换确认**
- [ ] 当前活跃的 spec 目录从 `agentpit-vue3-deployment` 切换至 `agentpit-platform-development`
- [ ] 更新 `.trae/ACTIVE_SPEC` 文件记录当前活跃规范（新增）
- [ ] 在平台开发规范中创建衔接文档：`.trae/docs/vue3-migration-handoff.md`

#### 衔接文档模板（vue3-migration-handoff.md）：

```markdown
# Vue3 迁移完成交接文档

## 📋 基本信息
- **源规范**: agentpit-vue3-deployment
- **目标规范**: agentpit-platform-development
- **交接时间**: YYYY-MM-DD HH:MM
- **执行人**: {Name}
- **Git Tag**: v3.0.0-vue3-migration-complete
- **Commit Hash**: {abc1234}

## ✅ 已完成工作
### Vue3 迁移成果
- [x] 项目架构从 React 迁移至 Vue 3.4+ (Composition API)
- [x] 状态管理从 Zustand 迁移至 Pinia
- [x] 路由系统从 React Router 迁移至 Vue Router 4
- [x] 10大功能模块全部迁移完成（50+ 组件）
- [x] Podman 容器化部署配置就绪
- [x] DeepResearch + Flexloop 工具集成完成
- [x] ESLint + Prettier 零错误率达成
- [x] 性能指标达标（JS≤150KB, FCP≤3s）

### 关键技术决策
1. **组件复用率**: 达到 XX%（目标≥60%）
2. **构建优化**: 采用 Vite 代码分割策略
3. **容器方案**: Podman 多阶段构建，镜像大小 XXX MB
4. **日志系统**: JSON Lines 格式，30天保留期

## 📊 质量指标
| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| TypeScript 错误数 | 0 | 0 | ✅ |
| ESLint Errors | 0 | 0 | ✅ |
| ESLint Warnings | 0 | 0 | ✅ |
| 测试覆盖率 | >80% | XX% | ⏳ |
| 构建产物体积 | ≤2MB | X.XMB | ✅ |
| 镜像体积 | ≤500MB | XXXMB | ✅ |

## 🔗 衔接注意事项
### 下一步工作建议
1. 基于 Vue3 架构继续完善功能模块
2. 接入真实后端 API 替代 Mock 数据
3. 完善 DeepResearch 智能体服务集成测试
4. 进行生产环境部署演练

### 已知问题 / 待解决事项
- [ ] Issue #XXX: {问题描述}
- [ ] Issue #YYY: {问题描述}

## 📎 相关文档链接
- [Vue3 迁移规范](../specs/agentpit-vue3-deployment/spec.md)
- [任务清单](../specs/agentpit-vue3-deployment/tasks.md)
- [验证报告](../specs/agentpit-vue3-deployment/checklist.md)
- [Phase 6 复盘](../reviews/phase-6-review.md)

## ✍️ 签字确认
- **迁移执行人**: _______________ 日期: _______
- **接收方**: _______________ 日期: _______
- **审核人**: _______________ 日期: _______
```

#### Scenario: 成功案例
- **WHEN** agentpit-vue3-deployment 的所有 24 个任务完成并通过验证
- **THEN** 系统自动触发回切流程（Phase 7）
- **AND** 环境配置正确调整，无遗漏文件
- **AND** 文件依赖关系检查通过，无循环依赖
- **AND** 代码冲突检查完成，无合并冲突
- **AND** Git 操作遵循 Conventional Commits 规范
- **AND** 分支信息已同步到远程仓库
- **AND** 衔接文档已生成并存放在 `.trae/docs/`
- **AND** 活跃规范成功切换至 `agentpit-platform-development`

---

## REMOVED Requirements

### Requirement: React 相关依赖（已完全移除）

**Reason**: 项目迁移至 Vue 3 生态系统，不再需要 React 相关包

**Migration Plan**: 
- ❌ 移除 react, react-dom, react-router-dom 依赖
- ❌ 移除 Zustand 状态管理库
- ✅ 替换为 vue@^3.4.0, vue-router@^4.2.0, pinia^@2.1.0
- ✅ 所有 .tsx 文件重写为 .vue 单文件组件（SFC）
- ✅ Hooks 逻辑迁移至 Composables（useXxx 函数）
- ✅ JSX 语法迁移至 Vue Template 语法
