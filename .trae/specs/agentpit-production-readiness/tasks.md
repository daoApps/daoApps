# AgentPit 生产就绪性提升 - 任务清单

## Tasks

### 🔴 P0 - 关键任务（必须完成）

- [ ] Task 1: 解决 ESLint 环境兼容性问题
  - **优先级**: P0
  - **依赖于**: 无
  - **描述**:
    - [ ] 1.1 分析当前 Node.js 版本（运行 `node --version`）
    - [ ] 1.2 检查 ESLint 和其依赖的 Node.js 兼容性要求
    - [ ] 1.3 运行 `npm run lint:check` 并捕获完整错误信息
    - [ ] 1.4 根据错误类型确定解决方案：
      - 方案 A: 升级/降级 Node.js 到兼容版本（推荐 v20 LTS）
      - 方案 B: 更新 ESLint 相关依赖到兼容版本
      - 方案 C: 修改 ESLint 配置以绕过环境问题
    - [ ] 1.5 实施选定的解决方案
    - [ ] 1.6 验证修复：运行 `npm run lint:check` 确认 Exit Code 0 或仅报告代码问题
    - [ ] 1.7 更新 package.json 的 engines 字段（如需要）
    - [ ] 1.8 文档化解决方案和遇到的坑
  - **验收标准**: AC-ESLINT-1, AC-ESLINT-2
  - **预计时间**: 1-2 小时
  - **注意**: 这是阻塞其他任务的关键路径，必须首先解决

- [ ] Task 2: 执行生产构建验证
  - **优先级**: P0
  - **依赖于**: Task 1（ESLint 问题解决后）
  - **描述**:
    - [ ] 2.1 运行 TypeScript 类型检查：`npx vue-tsc -b`
    - [ ] 2.2 运行生产构建：`npm run build`
    - [ ] 2.3 检查构建产物：
      - [ ] 2.3.1 验证 dist/ 目录存在且结构正确
      - [ ] 2.3.2 检查 HTML 文件引用的资源路径正确
      - [ ] 2.3.3 验证 JS/CSS 文件已压缩并带内容哈希
      - [ ] 2.3.4 确认资源大小合理（无异常膨胀）
    - [ ] 2.4 启动预览服务器：`npm run preview`
    - [ ] 2.5 手动验证关键页面可正常访问：
      - 首页
      - 聊天页面
      - 变现系统页面
      - 市场页面
    - [ ] 2.6 安装 Lighthouse CI（如未安装）：`npm install -D @lhci/cli`
    - [ ] 2.7 配置 lighthouserc.json（如不存在）
    - [ ] 2.8 运行 Lighthouse审计：`npx lhci autorun`
    - [ ] 2.9 分析 Lighthouse 报告：
      - [ ] 2.9.1 Performance 分数 ≥ 80?
      - [ ] 2.9.2 Accessibility 分数 ≥ 90?
      - [ ] 2.9.3 Best Practices 分数 ≥ 90?
      - [ ] 2.9.4 识别 Critical 级别的问题
    - [ ] 2.10 如有性能问题，记录并创建后续优化任务
    - [ ] 2.11 生成构建报告文档
  - **验收标准**: AC-BUILD-1, AC-BUILD-2
  - **预计时间**: 2-3 小时
  - **注意**: 构建失败需立即修复，不能跳过

- [ ] Task 3: Git 提交与版本标签规范化
  - **优先级**: P0
  - **依赖于**: Task 2（构建验证通过后）
  - **描述**:
    - [ ] 3.1 前置检查：
      - [ ] 3.1.1 确认工作目录干净：`git status`
      - [ ] 3.1.2 确认 TypeScript 零错误：`npx vue-tsc -b`
      - [ ] 3.1.3 确认所有文件已保存
    - [ ] 3.2 阅读 git-versioning-guide.md 了解详细规范
    - [ ] 3.3 执行 Commit 1: 项目初始化与基础架构
      ```bash
      git add package.json tsconfig.json tsconfig.app.json tsconfig.node.json \
              vite.config.ts eslint.config.js .prettierrc \
              index.html .gitignore src/main.ts src/App.vue
      git commit -m "chore(project): initialize Vue3 + Vite + TypeScript project scaffold"
      ```
    - [ ] 3.4 执行 Commit 2: 核心框架层实现
      ```bash
      git add src/router/ src/stores/ src/components/layout/
      git commit -m "feat(core): implement router, state management and layout system"
      ```
    - [ ] 3.5 执行 Commit 3: 首页 + P0 核心业务模块
      ```bash
      git add src/views/HomePage.vue src/components/home/
      git add src/views/MonetizationPage.vue src/components/monetization/
      # ... 其他 P0 模块
      git commit -m "feat(modules): implement home page and P0 core business modules"
      ```
    - [ ] 3.6 执行 Commit 4: P1 + P2 业务模块
      ```bash
      git add src/views/SocialPage.vue src/components/social/
      # ... 其他 P1/P2 模块
      git commit -m "feat(modules): implement P1/P2 business modules and lifestyle features"
      ```
    - [ ] 3.7 执行 Commit 5: 测试体系建立
      ```bash
      git add __tests__/ e2e/ vitest.config.ts playwright.config.ts
      git commit -m "test(coverage): establish comprehensive testing framework"
      ```
    - [ ] 3.8 执行 Commit 6: 质量门禁 + 文档交付
      ```bash
      git add .trae/docs/ .trae/reviews/
      git commit -m "docs(delivery): complete quality gates and documentation"
      ```
    - [ ] 3.9 执行 Commit 7: 生产就绪性改进（可选，如有额外修改）
      ```bash
      # 添加本次任务的所有改进
      git commit -m "feat(production): improve production readiness (ESLint fix, build optimization, CI/CD setup)"
      ```
    - [ ] 3.10 创建 Annotated Tag：
      ```bash
      git tag -a v3.0.0-production-ready -m "AgentPit Production Ready Version..."
      ```
    - [ ] 3.11 推送到远程仓库：
      ```bash
      git push origin main
      git push origin v3.0.0-production-ready
      ```
    - [ ] 3.12 验证推送成功：
      ```bash
      git log --oneline -10
      git tag -l "v3.*"
      git ls-remote --tags origin
      ```
  - **验收标准**: AC-GIT-1, AC-GIT-2
  - **预计时间**: 1-2 小时
  - **注意**: 提交前务必确认构建通过，避免将破坏性代码推送到远程

### 🟡 P1 - 重要任务（建议完成）

- [ ] Task 4: Mock 数据梳理与 API 对接方案设计
  - **优先级**: P1
  - **依赖于**: 无（可与 P0 任务并行）
  - **描述**:
    - [ ] 4.1 扫描所有 Mock 数据文件：
      - [ ] 4.1.1 列出 src/data/*.ts 所有文件
      - [ ] 4.1.2 分析每个文件导出的数据结构和接口
    - [ ] 4.2 追踪 Mock 数据使用位置：
      - [ ] 4.2.1 在 Store 中的导入和使用方式
      - [ ] 4.2.2 在组件中的直接引用
      - [ ] 4.2.3 使用 Grep 工具搜索所有 import 语句
    - [ ] 4.3 创建 API 对接清单表格：
      | Mock 文件 | 数据类型 | 使用组件 | 建议端点 | 优先级 |
      |-----------|---------|----------|----------|--------|
    - [ ] 4.4 设计 API 服务层架构：
      - [ ] 4.4.1 选择 HTTP 客户端（fetch vs axios）
      - [ ] 4.4.2 设计请求/响应拦截器
      - [ ] 4.4.3 设计错误处理机制
      - [ ] 4.4.4 设计 token 认证流程
      - [ ] 4.4.5 设计数据缓存策略
    - [ ] 4.5 编写 API 对接方案文档（API_INTEGRATION_PLAN.md）
    - [ ] 4.6 与后端团队确认 API 规范（如适用）
    - [ ] 4.7 定义环境变量配置：
      - VITE_API_BASE_URL
      - VITE_USE_MOCK_API（开发/生产切换开关）
  - **验收标准**: AC-API-1
  - **预计时间**: 3-4 小时
  - **输出**: API 对接清单、服务层设计方案、环境变量定义

- [ ] Task 5: CI/CD 流水线搭建
  - **优先级**: P1
  - **依赖于**: Task 1（ESLint 配置稳定后）
  - **描述**:
    - [ ] 5.1 创建 GitHub Actions 工作流目录：
      ```bash
      mkdir -p .github/workflows
      ```
    - [ ] 5.2 创建 CI 工作流文件 `.github/workflows/ci.yml`：
      - [ ] 5.2.1 配置触发条件（push to main, pull_request to main）
      - [ ] 5.2.2 定义作业矩阵（Node.js 18/20）
      - [ ] 5.2.3 实现步骤：
        - Checkout 代码
        - Setup Node.js
        - Install dependencies（npm ci）
        - Run Prettier check
        - Run ESLint check
        - Run TypeScript type check
        - Run unit tests（Vitest）
        - Upload coverage report
        - Run production build
        - Upload build artifacts
    - [ ] 5.3 创建 CD 工作流文件 `.github/workflows/cd.yml`（可选）：
      - [ ] 5.3.1 配置触发条件（push tags, manual dispatch）
      - [ ] 5.3.2 定义环境和部署阶段
      - [ ] 5.3.3 实现 staging 部署步骤
      - [ ] 5.3.4 实现 production 部署步骤（需批准）
      - [ ] 5.3.5 配置部署通知（Slack/Email）
    - [ ] 5.4 配置 GitHub Secrets（文档说明）：
      - DEPLOY_HOST
      - DEPLOY_USER
      - DEPLOY_KEY
      - API_TOKEN（如需要）
      - NOTIFICATION_WEBHOOK（如需要）
    - [ ] 5.5 创建 Lighthouse CI 配置 `.lighthouserc.json`：
      ```json
      {
        "ci": {
          "collect": {
            "url": ["http://localhost:4173"],
            "numberOfRuns": 3
          },
          "assert": {
            "assertions": {
              "categories:performance": ["warn", {"minScore": 0.8}],
              "categories:accessibility": ["error", {"minScore": 0.9}],
              "categories:best-practices": ["error", {"minScore": 0.9}]
            }
          }
        }
      }
      ```
    - [ ] 5.6 测试 CI 流水线：
      - [ ] 5.6.1 推送一个测试 PR 到 main
      - [ ] 5.6.2 观察 Actions 运行状态
      - [ ] 5.6.3 修复任何配置错误
    - [ ] 5.7 编写 CI/CD 使用文档
  - **验收标准**: AC-CICD-1, AC-CICD-2, AC-CICD-3
  - **预计时间**: 4-6 小时
  - **输出**: ci.yml, cd.yml（可选）, lighthouserc.json, CI/CD 文档

## Task Dependencies

```
Task 1 (ESLint Fix)
    ↓
Task 2 (Build Verification)
    ↓
Task 3 (Git Commits & Tags)

Task 4 (API Design) ← 可并行
Task 5 (CI/CD Setup) ← 依赖 Task 1，可与 Task 2-3 并行
```

## Parallel Execution Groups

- **Group A** (必须串行):
  - Task 1 → Task 2 → Task 3

- **Group B** (可与 Group A 并行):
  - Task 4 (API 对接方案设计)

- **Group C** (依赖 Group A 中的 Task 1，之后可并行):
  - Task 5 (CI/CD 搭建)

## Notes

1. **时间估算说明**: 以上时间为理想情况下的预估，实际可能因遇到问题而延长
2. **优先级调整**: 如果时间紧迫，可以只完成 P0 任务（Task 1-3），P1 任务可以后续迭代
3. **文档重要性**: 每个任务完成后都应更新相关文档，便于团队协作和知识传承
4. **回滚准备**: 在执行 Git 操作前，建议先创建备份分支：`git branch backup-before-commits`
5. **沟通协调**: Task 4（API 对接）可能需要与后端团队协调，建议提前启动
