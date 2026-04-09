# AgentPit Vue3 迁移与部署 - 任务清单

## Tasks

### Phase 1: Vue3 项目初始化与架构迁移

- [ ] Task 1: 创建 Vue3 + Vite 项目基础
  - [ ] SubTask 1.1: 使用 `npm create vite@latest . -- --template vue-ts` 初始化项目
  - [ ] SubTask 1.2: 安装核心依赖（vue-router@4, pinia, @vueuse/core）
  - [ ] SubTask 1.3: 配置 TypeScript 严格模式和路径别名 (@/ → src/)
  - [ ] SubTask 1.4: 配置 Vite 构建优化（代码分割、chunk 策略）
  - [ ] SubTask 1.5: 创建标准目录结构（components/, views/, stores/, composables/, router/, utils/）

- [ ] Task 2: 配置代码规范工具链
  - [ ] SubTask 2.1: 安装并配置 ESLint（@vue/eslint-config-typescript, @vue/eslint-config-prettier）
  - [ ] SubTask 2.2: 安装并配置 Prettier（.prettierrc，规则：单引号、2空格缩进、尾逗号）
  - [ ] SubTask 2.3: 创建 .eslintrc.cjs 配置文件（Vue3 规则、TypeScript 规则）
  - [ ] SubTask 2.4: 配置 package.json scripts（lint, lint:fix, format, format:check）
  - [ ] SubTask 2.5: 集成 Git pre-commit hook（使用 husky + lint-staged）

- [ ] Task 3: 配置环境变量管理
  - [ ] SubTask 3.1: 创建 .env.development 文件（开发环境配置）
  - [ ] SubTask 3.2: 创建 .env.production 文件（生产环境配置）
  - [ ] SubTask 3.3: 创建 .env.staging 文件（测试环境配置）
  - [ ] SubTask 3.4: 创建 env.d.ts 类型定义文件（ImportMetaEnv 接口）
  - [ ] SubTask 3.5: 实现环境变量加载和验证逻辑

### Phase 2: 核心框架迁移

- [ ] Task 4: 迁移路由系统至 Vue Router
  - [ ] SubTask 4.1: 创建 router/index.ts 路由配置文件
  - [ ] SubTask 4.2: 定义所有页面路由（/, /monetization, /sphinx, /chat 等 11 个路由）
  - [ ] SubTask 4.3: 实现路由懒加载（import() 动态导入）
  - [ ] SubTask 4.4: 配置路由守卫（导航守卫、权限检查预留接口）
  - [ ] SubTask 4.5: 实现 404 错误页面

- [ ] Task 5: 迁移状态管理至 Pinia
  - [ ] SubTask 5.1: 创建 Pinia 实例并挂载到 Vue 应用
  - [ ] SubTask 5.2: 迁移 useAppStore 至 Pinia store（sidebarOpen, theme 等）
  - [ ] SubTask 5.3: 创建 chat store（对话历史、消息状态）
  - [ ] SubTask 5.4: 创建 user store（用户信息、认证状态）
  - [ ] SubTask 5.5: 集成 pinia-plugin-persistedstate 持久化插件

- [ ] Task 6: 迁移布局组件至 Vue SFC
  - [ ] SubTask 6.1: 将 Header.tsx 迁移为 Header.vue（Composition API）
  - [ ] SubTask 6.2: 将 Sidebar.tsx 迁移为 Sidebar.vue
  - [ ] SubTask 6.3: 将 Footer.tsx 迁移为 Footer.vue
  - [ ] SubTask 6.4: 将 MainLayout.tsx 迁移为 MainLayout.vue（使用 <slot>）
  - [ ] SubTask 6.5: 实现 App.vue 根组件和 main.ts 入口文件

### Phase 3: 功能模块组件迁移

- [ ] Task 7: 迁移首页与导航模块
  - [ ] SubTask 7.1: 将 ModuleCard.tsx 迁移为 ModuleCard.vue
  - [ ] SubTask 7.2: 将 HomePage.tsx 迁移为 views/HomePage.vue
  - [ ] SubTask 7.3: 保持六边形布局和动画效果（Vue Transition）

- [ ] Task 8: 迁移自动变现系统（Monetization）
  - [ ] SubTask 8.1: 迁移 WalletCard.vue
  - [ ] SubTask 8.2: 迁移 RevenueChart.vue（保持 recharts 或迁移至 ECharts）
  - [ ] SubTask 8.3: 迁移 TransactionHistory.vue
  - [ ] SubTask 8.4: 迁移 WithdrawModal.vue
  - [ ] SubTask 8.5: 迁移 FinancialReport.vue 和整合 MonetizationPage.vue

- [ ] Task 9: 迁移 Sphinx 建站模块
  - [ ] SubTask 9.1: 迁移 SiteWizard.vue
  - [ ] SubTask 9.2: 迁移 TemplateGallery.vue
  - [ ] SubTask 9.3: 迁移 AISiteBuilder.vue
  - [ ] SubTask 9.4: 迁移 SitePreview.vue 和 PublishPanel.vue
  - [ ] SubTask 9.5: 整合 SphinxPage.vue

- [ ] Task 10: 迁移智能体对话模块（Chat）
  - [ ] SubTask 10.1: 迁移 ChatInterface.vue
  - [ ] SubTask 10.2: 迁移 MessageList.vue（流式输出效果）
  - [ ] SubTask 10.3: 迁移 MessageInput.vue
  - [ ] SubTask 10.4: 迁移 QuickCommands.vue 和 ChatSidebar.vue
  - [ ] SubTask 10.5: 整合 ChatPage.vue

- [ ] Task 11: 迁移社交连接系统（Social）
  - [ ] SubTask 11.1: 迁移 UserProfileCard.vue
  - [ ] SubTask 11.2: 迁移 UserRecommendList.vue 和 DatingMatch.vue
  - [ ] SubTask 11.3: 迁移 MeetingRoom.vue 和 SocialFeed.vue
  - [ ] SubTask 11.4: 迁移 FriendsSystem.vue 和 NotificationPanel.vue
  - [ ] SubTask 11.5: 整合 SocialPage.vue

- [ ] Task 12: 迁移交易市场模块（Marketplace）
  - [ ] SubTask 12.1: 迁移 ProductGrid.vue 和 ProductDetail.vue
  - [ ] SubTask 12.2: 迁移 SearchFilter.vue
  - [ ] SubTask 12.3: 迁移 ShoppingCart.vue
  - [ ] SubTask 12.4: 迁移 OrderManagement.vue 和 ReviewSystem.vue
  - [ ] SubTask 12.5: 迁移 SellerCenter.vue 并整合 MarketplacePage.vue

- [ ] Task 13: 迁移多智能体协作系统（Collaboration）
  - [ ] SubTask 13.1: 迁移 AgentWorkspace.vue
  - [ ] SubTask 13.2: 迁移 AgentSelector.vue 和 AgentConfigPanel.vue
  - [ ] SubTask 13.3: 迁移 TaskDistributor.vue 和 CommunicationPanel.vue
  - [ ] SubTask 13.4: 迁移 CollaborationResult.vue 和 AgentStatusCard.vue
  - [ ] SubTask 13.5: 整合 CollaborationPage.vue

- [ ] Task 14: 迁移存储记忆系统（Memory）
  - [ ] SubTask 14.1: 迁移 FileManager.vue
  - [ ] SubTask 14.2: 迁移 KnowledgeGraph.vue（SVG 动画）
  - [ ] SubTask 14.3: 迁移 MemorySearch.vue 和 MemoryTimeline.vue
  - [ ] SubTask 14.4: 迁移 BackupSettings.vue 和 StorageQuota.vue
  - [ ] SubTask 14.5: 整合 MemoryPage.vue

- [ ] Task 15: 迁移定制化智能体模块（Customize）
  - [ ] SubTask 15.1: 迁移 AgentCreatorWizard.vue（5步向导）
  - [ ] SubTask 15.2: 迁移 BasicInfoForm.vue 和 AppearanceCustomizer.vue
  - [ ] SubTask 15.3: 迁移 AbilityConfigurator.vue 和 BusinessModelSetup.vue
  - [ ] SubTask 15.4: 迁移 AgentPreview.vue 和 MyAgentsList.vue
  - [ ] SubTask 15.5: 迁移 AgentAnalytics.vue 并整合 CustomizePage.vue

- [ ] Task 16: 迁移生活服务与设置模块（Lifestyle & Settings）
  - [ ] SubTask 16.1: 迁移 MeetingCalendar.vue 和 TravelPlanner.vue
  - [ ] SubTask 16.2: 迁移 GameCenter.vue 和 LifestyleDashboard.vue
  - [ ] SubTask 16.3: 迁移 UserProfileSettings.vue 和 ThemePreferences.vue
  - [ ] SubTask 16.4: 迁移 NotificationSettings.vue 和 PrivacySecurity.vue
  - [ ] SubTask 16.5: 迁移 HelpCenter.vue 并整合 LifestylePage.vue 和 SettingsPage.vue

### Phase 4: Podman 容器化部署

- [ ] Task 17: 创建容器化配置
  - [ ] SubTask 17.1: 编写 Podmanfile（多阶段构建：node:20-alpine build → nginx:alpine production）
  - [ ] SubTask 17.2: 创建 nginx.conf 配置文件（SPA 路由支持、Gzip 压缩、缓存策略）
  - [ ] SubTask 17.3: 创建 .dockerignore 文件（排除 node_modules、.env 等）
  - [ ] SubTask 17.4: 配置非 root 用户运行（security context）
  - [ ] SubTask 17.5: 添加健康检查端点（HEALTHCHECK /health）

- [ ] Task 18: 创建容器编排配置
  - [ ] SubTask 18.1: 编写 podman-compose.yml（定义前端服务、端口映射、卷挂载）
  - [ ] SubTask 18.2: 配置资源限制（memory: 512M, cpu: 0.5）
  - [ ] SubTask 18.3: 配置网络隔离和重启策略
  - [ ] SubTask 18.4: 创建环境变量注入方案（从 .env.production 或 secrets）
  - [ ] SubTask 18.5: 编写部署脚本 deploy.sh（构建→推送→更新→健康检查）

- [ ] Task 19: 实现自动化部署流程
  - [ ] SubTask 19.1: 创建 scripts/build.sh 构建脚本（类型检查→单元测试→构建镜像）
  - [ ] SubTask 19.2: 创建 scripts/deploy.sh 部署脚本（滚动更新、回滚支持）
  - [ ] SubTask 19.3: 创建 scripts/rollback.sh 回滚脚本（版本切换）
  - [ ] SubTask 19.4: 实现版本标签管理（git tag + 镜像 tag 一致性）
  - [ ] SubTask 19.5: 创建部署文档 DEPLOYMENT.md

### Phase 5: 工具集成与日志系统

- [ ] Task 20: 集成 DeepResearch 智能体服务
  - [ ] SubTask 20.1: 创建 composables/useDeepResearch.ts（封装调用逻辑）
  - [ ] SubTask 20.2: 实现命令执行函数（child_process.exec 调用 deepresearch）
  - [ ] SubTask 20.3: 实现调用前验证（路径存在性、权限检查、依赖安装 pdm install）
  - [ ] SubTask 20.4: 实现日志记录系统（结构化 JSON 日志，按日期归档）
  - [ ] SubTask 20.5: 创建 DeepResearch 组件集成到 UI（可选的后台任务触发界面）

- [ ] Task 21: 集成 Flexloop 工具
  - [ ] SubTask 21.1: 创建 composables/useFlexloop.ts
  - [ ] SubTask 21.2: 实现 flexloop 工具路径验证和版本检查
  - [ ] SubTask 21.3: 封装工具调用方法（参数传递、结果解析）
  - [ ] SubTask 21.4: 记录详细调用日志

- [ ] Task 22: 实现统一日志系统
  - [ ] SubTask 22.1: 创建 utils/logger.ts 日志工具类
  - [ ] SubTask 22.2: 支持多级别日志（DEBUG, INFO, WARN, ERROR）
  - [ ] SubTask 22.3: 实现日志轮转（按日期/大小分割文件）
  - [ ] SubTask 22.4: 结构化日志格式（JSON：时间戳、级别、模块、消息、元数据）
  - [ ] SubTask 22.5: 创建 logs/ 目录结构和 .gitignore 配置

### Phase 6: 测试与质量保证

- [ ] Task 23: 迁移测试套件至 Vue Test Utils
  - [ ] SubTask 23.1: 安装 Vitest + @vue/test-utils
  - [ ] SubTask 23.2: 配置 vitest.config.ts（Vue 组件测试支持）
  - [ ] SubTask 23.3: 为核心组件编写单元测试（Header, Sidebar, ModuleCard）
  - [ ] SubTask 23.4: 为 Pinia stores 编写状态管理测试
  - [ ] SubTask 23.5: 配置测试覆盖率报告（阈值 > 80%）

- [ ] Task 24: 性能优化与最终验证
  - [ ] SubTask 24.1: 实现路由级懒加载和组件异步加载
  - [ ] SubTask 24.2: 优化打包体积分析（vite-bundle-visualizer）
  - [ ] SubTask 24.3: 配置生产环境构建优化（Tree-shaking、Minification）
  - [ ] SubTask 24.4: 执行完整 ESLint 检查确保零错误零警告
  - [ ] SubTask 24.5: 执行跨浏览器兼容性测试（Chrome/Firefox/Safari/Edge）

## Task Dependencies

### 关键依赖链
- **Phase 1** (Task 1-3) 必须首先完成
- **Phase 2** (Task 4-6) 依赖 Phase 1
- **Phase 3** (Task 7-16) 可并行执行，依赖 Phase 2
- **Phase 4** (Task 17-19) 可在 Phase 3 进行中开始准备
- **Phase 5** (Task 20-22) 依赖 Phase 1 完成
- **Phase 6** (Task 23-24) 依赖 Phase 3 全部完成

## Parallel Execution Groups

- **Group A (串行)**: Task 1 → Task 2 → Task 3 （项目基础搭建）
- **Group B (串行)**: Task 4 → Task 5 → Task 6 （核心框架迁移）
- **Group C (高度并行)**: Task 7-16 （功能模块迁移，可同时进行 3-4 个）
- **Group D (可并行)**: Task 17-19 （容器化配置，可与 Group C 重叠）
- **Group E (可并行)**: Task 20-22 （工具集成，可在 Group B 后开始）
- **Group F (串行)**: Task 23 → Task 24 （最终测试优化）
- **Group G (串行)**: Task 25 （工作流回切与衔接，必须在最后执行）

## Estimated Effort

| Phase | Tasks | 复杂度 | 预估工时 |
|-------|-------|--------|----------|
| Phase 1 | 1-3 | 中等 | 4-6 小时 |
| Phase 2 | 4-6 | 高 | 6-8 小时 |
| Phase 3 | 7-16 | 很高 | 20-30 小时 |
| Phase 4 | 17-19 | 中等 | 6-8 小时 |
| Phase 5 | 20-22 | 中等 | 4-6 小时 |
| Phase 6 | 23-24 | 中等 | 4-6 小时 |
| Phase 7 | 25 | 中等 | 2-3 小时 |
| **总计** | **25 个任务** | - | **46-67 小时** |

### Phase 7: 工作流回切与衔接（必须最后执行）

- [ ] Task 25: 完成回切至 agentpit-platform-development 规范目录
  - [ ] SubTask 25.1: 环境配置调整与备份
    - 确认当前工作目录为 `apps/AgentPit/`
    - 检查 Vue3 项目构建产物完整性（dist/、Podman镜像）
    - 备份当前开发状态到 `.trae/backups/vue3-migration-backup-YYYYMMDD/`
    - 记录分支名称和最新 commit hash
    - 创建版本标签：`git tag v3.0.0-vue3-migration-complete`
  - [ ] SubTask 25.2: 文件依赖关系检查
    - 对比 React/Vue3 版本文件结构差异
    - 检查遗留的 .tsx/.jsx 文件
    - 验证 import 路径 ESM 格式正确性
    - 运行 `npm run build` 和 `npm run lint` 确保零错误
  - [ ] SubTask 25.3: 代码冲突检查与规范同步
    - 切换到目标规范目录：`cd .trae/specs/agentpit-platform-development`
    - 读取 platform-development 的 tasks.md 和 checklist.md
    - 检查两个 spec 目录间的任务重叠或冲突
    - 更新 platform-development spec.md 标注 Vue3 迁移完成
    - 同步状态信息避免重复执行
  - [ ] SubTask 25.4: Git 版本控制操作（Conventional Commits）
    - 提交切换记录：`chore(specs): 完成Vue3迁移并切换回platform-development规范`
    - 更新 develop 分支并合并 feature/vue3-migration
    - 推送到远程仓库并打标签
    - 创建 PR 合并到 main 分支
  - [ ] SubTask 25.5: 衔接文档生成与团队通知
    - 创建交接文档：`.trae/docs/vue3-migration-handoff.md`
    - 更新 `.trae/ACTIVE_SPEC` 文件记录活跃规范切换
    - 更新团队协作文档（CONTRIBUTING.md / README.md）
    - 通知相关团队成员迁移完成

## Task Dependencies (Phase 7)

### 关键依赖链
- **Phase 7** (Task 25) 必须在 **Phase 1-6 全部完成后** 执行
- Task 25 是整个 Vue3 迁移项目的**最后一个任务**
- Task 25 完成后，活跃规范从 `agentpit-vue3-deployment` → `agentpit-platform-development`

## 回切检查清单

在执行 Task 25 前，必须确认以下前置条件全部满足：

- [ ] Phase 1-6 所有 24 个任务标记为已完成 `[x]`
- [ ] checklist.md 中所有验证项通过检查
- [ ] 阶段复盘文档已输出（`.trae/reviews/phase-6-review.md`）
- [ ] Git 工作区干净（无未提交更改）
- [ ] 远程仓库已同步最新代码
- [ ] 构建产物和镜像可正常运行
