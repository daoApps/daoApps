# React → Vue3 前置迁移与全量测试 - 任务清单

## Tasks

### Pre-Phase 0: 项目准备与环境搭建

- [ ] Task 1: 备份现有 React 项目并初始化 Vue3 脚手架
  - [ ] SubTask 1.1: 备份当前 React 源码到 `src-react-backup-YYYYMMDD/`
  - [ ] SubTask 1.2: 使用 Vite 创建 Vue3 + TypeScript 项目（`npm create vite@latest . -- --template vue-ts`）
  - [ ] SubTask 1.3: 安装核心依赖（vue, vue-router, pinia, tailwindcss, echarts 等）
  - [ ] SubTask 1.4: 配置 TypeScript 严格模式和路径别名（@/）
  - [ ] SubTask 1.5: 创建标准目录结构（components/, views/, stores/, composables/, router/, utils/, types/, data/）

- [ ] Task 2: 配置代码规范工具链和开发脚本
  - [ ] SubTask 2.1: 安装 ESLint + Prettier + Vue3 插件
  - [ ] SubTask 2.2: 创建 .eslintrc.cjs（Vue3 规则，零错误目标）
  - [ ] SubTask 2.3: 创建 .prettierrc（单引号、2空格、无尾逗号）
  - [ ] SubTask 2.4: 配置 package.json scripts（dev/build/test/lint/format）
  - [ ] SubTask 2.5: 配置 Git pre-commit hook（husky + lint-staged）

- [ ] Task 3: 迁移 Mock 数据和类型定义
  - [ ] SubTask 3.1: 从 React 备份复制所有 data/*.ts 文件到 Vue3 项目
  - [ ] SubTask 3.2: 适配类型定义（移除 React 特有类型，添加 Vue 类型）
  - [ ] SubTask 3.3: 验证数据文件导入无 TypeScript 错误

### Phase 1: 核心框架层迁移

- [ ] Task 4: 实现路由系统（Vue Router v4）
  - [ ] SubTask 4.1: 创建 router/index.ts 定义 11 个页面路由
  - [ ] SubTask 4.2: 配置路由懒加载（动态 import）
  - [ ] SubTask 4.3: 实现 404 错误页面组件
  - [ ] SubTask 4.4: 在 App.vue 中挂载 <RouterView>
  - [ ] SubTask 4.5: 编写路由配置单元测试

- [ ] Task 5: 实现状态管理（Pinia Stores）
  - [ ] SubTask 5.1: 创建 useAppStore（sidebarOpen, theme 等全局状态）
  - [ ] SubTask 5.2: 创建 useChatStore（对话历史、消息状态）
  - [ ] SubTask 5.3: 配置持久化插件（pinia-plugin-persistedstate）
  - [ ] SubTask 5.4: 编写 Store 单元测试（覆盖率 ≥ 85%）

- [ ] Task 6: 迁移布局组件（Layout Components）
  - [ ] SubTask 6.1: 实现 Header.vue（导航栏、响应式菜单、用户信息）
  - [ ] SubTask 6.2: 实现 Sidebar.vue（侧边栏、折叠动画、导航链接）
  - [ ] SubTask 6.3: 实现 Footer.vue（底部信息、版权声明）
  - [ ] SubTask 6.4: 实现 MainLayout.vue（整合 Header/Sidebar/Footer/RouterView）
  - [ ] SubTask 6.5: 编写布局组件单元测试（覆盖率 ≥ 80%）

### Phase 2: 首页模块迁移验证

- [ ] Task 7: 迁移首页和模块卡片组件
  - [ ] SubTask 7.1: 实现 ModuleCard.vue（六边形卡片、悬停动画、路由跳转）
  - [ ] SubTask 7.2: 实现 views/HomePage.vue（标题、副标题、卡片网格、渐变背景）
  - [ ] SubTask 7.3: 验证 9 个核心功能模块卡片显示正确
  - [ ] SubTask 7.4: 验证 4 个额外功能卡片显示正确
  - [ ] SubTask 7.5: 验证入场动画和交互效果（staggered reveal）
  - [ ] SubTask 7.6: 编写首页组件集成测试

### Phase 3: P0 功能模块实现（核心业务）

- [ ] Task 8: 实现自动变现系统（Monetization）[P0]
  - [ ] SubTask 8.1: 实现 WalletCard.vue（余额展示、充值提现按钮）
  - [ ] SubTask 8.2: 实现 RevenueChart.vue（ECharts 图表、时间范围切换）
  - [ ] SubTask 8.3: 实现 TransactionHistory.vue（交易列表、分页筛选）
  - [ ] SubTask 8.4: 实现 WithdrawModal.vue（提现表单、余额验证）
  - [ ] SubTask 8.5: 实现 FinancialReport.vue（指标卡片、饼图）
  - [ ] SubTask 8.6: 整合 views/MonetizationPage.vue 并编写测试

- [ ] Task 9: 实现 Sphinx 快速建站系统（Sphinx）[P0]
  - [ ] SubTask 9.1: 实现 SiteWizard.vue（5步向导流程）
  - [ ] SubTask 9.2: 实现 TemplateGallery.vue（模板网格、预览弹窗）
  - [ ] SubTask 9.3: 实现 AISiteBuilder.vue（AI 对话界面）
  - [ ] SubTask 9.4: 实现 SitePreview.vue 和 PublishPanel.vue
  - [ ] SubTask 9.5: 整合 views/SphinxPage.vue 并编写测试

- [ ] Task 10: 实现智能体对话系统（Chat）[P0]
  - [ ] SubTask 10.1: 实现 ChatInterface.vue（主聊天容器）
  - [ ] SubTask 10.2: 实现 MessageList.vue（消息气泡、流式输出打字机效果）
  - [ ] SubTask 10.3: 实现 MessageInput.vue（输入框、快捷指令）
  - [ ] SubTask 10.4: 实现 QuickCommands.vue 和 ChatSidebar.vue
  - [ ] SubTask 10.5: 创建 composables/useTypewriter.ts（流式输出逻辑）
  - [ ] SubTask 10.6: 整合 views/ChatPage.vue 并编写全量测试

### Phase 4: P1 功能模块实现（重要业务）

- [ ] Task 11: 实现社交连接系统（Social）[P1]
  - [ ] SubTask 11.1: 实现 UserProfileCard.vue + UserRecommendList.vue
  - [ ] SubTask 11.2: 实现 DatingMatch.vue（Tinder 式滑动）
  - [ ] SubTask 11.3: 实现 MeetingRoom.vue + SocialFeed.vue
  - [ ] SubTask 11.4: 实现 FriendsSystem.vue + NotificationPanel.vue
  - [ ] SubTask 11.5: 整合 views/SocialPage.vue（Tab 导航切换）

- [ ] Task 12: 实现交易市场（Marketplace）[P1]
  - [ ] SubTask 12.1: 实现 ProductGrid.vue + ProductDetail.vue
  - [ ] SubTask 12.2: 实现 SearchFilter.vue + ShoppingCart.vue
  - [ ] SubTask 12.3: 实现 OrderManagement.vue + ReviewSystem.vue
  - [ ] SubTask 12.4: 实现 SellerCenter.vue
  - [ ] SubTask 12.5: 整合 views/MarketplacePage.vue

- [ ] Task 13: 实现多智能体协作系统（Collaboration）[P1]
  - [ ] SubTask 13.1: 实现 AgentWorkspace.vue（主工作台）
  - [ ] SubTask 13.2: 实现 AgentSelector.vue + AgentConfigPanel.vue
  - [ ] SubTask 13.3: 实现 TaskDistributor.vue + CommunicationPanel.vue
  - [ ] SubTask 13.4: 实现 CollaborationResult.vue + AgentStatusCard.vue
  - [ ] SubTask 13.5: 整合 views/CollaborationPage.vue

### Phase 5: P2 功能模块实现（辅助功能）

- [ ] Task 14: 实现存储记忆系统（Memory）[P2]
  - [ ] SubTask 14.1: 实现 FileManager.vue（云存储文件管理器）
  - [ ] SubTask 14.2: 实现 KnowledgeGraph.vue（SVG 力导向图）
  - [ ] SubTask 14.3: 实现 MemorySearch.vue + MemoryTimeline.vue
  - [ ] SubTask 14.4: 实现 BackupSettings.vue + StorageQuota.vue
  - [ ] SubTask 14.5: 整合 views/MemoryPage.vue

- [ ] Task 15: 实现定制化智能体（Customize）[P2]
  - [ ] SubTask 15.1: 实现 AgentCreatorWizard.vue（5步向导）
  - [ ] SubTask 15.2: 实现 BasicInfoForm.vue + AppearanceCustomizer.vue
  - [ ] SubTask 15.3: 实现 AbilityConfigurator.vue + BusinessModelSetup.vue
  - [ ] SubTask 15.4: 实现 AgentPreview.vue + MyAgentsList.vue + AgentAnalytics.vue
  - [ ] SubTask 15.5: 整合 views/CustomizePage.vue

- [ ] Task 16: 实现生活服务与设置（Lifestyle & Settings）[P2]
  - [ ] SubTask 16.1: 实现 MeetingCalendar.vue + TravelPlanner.vue
  - [ ] SubTask 16.2: 实现 GameCenter.vue（含 3 个内置小游戏）
  - [ ] SubTask 16.3: 实现 LifestyleDashboard.vue
  - [ ] SubTask 16.4: 实现 UserProfileSettings.vue + ThemePreferences.vue
  - [ ] SubTask 16.5: 实现 NotificationSettings.vue + PrivacySecurity.vue + HelpCenter.vue
  - [ ] SubTask 16.6: 整合 views/LifestylePage.vue 和 views/SettingsPage.vue

### Phase 6: 全量测试体系建立

- [ ] Task 17: 建立单元测试套件（Vitest + Vue Test Utils）
  - [ ] SubTask 17.1: 配置 Vitest（vitest.config.ts，包含 Vue 插件）
  - [ ] SubTask 17.2: 为所有 Layout 组件编写测试（Header, Sidebar, Footer, MainLayout）
  - [ ] SubTask 17.3: 为所有 Store 编写测试（useAppStore, useChatStore 等）
  - [ ] SubTask 17.4: 为 Composables 编写测试（useTypewriter 等）
  - [ ] SubTask 17.5: 为工具函数编写测试（utils/ 目录）
  - [ ] SubTask 17.6: 运行 `npm run test:coverage` 确保达标（组件≥80%, Store≥85%, 工具≥95%）

- [ ] Task 18: 建立集成测试套件（跨模块交互）
  - [ ] SubTask 18.1: 测试路由导航集成（点击卡片→页面跳转→URL 更新）
  - [ ] SubTask 18.2: 测试状态管理集成（侧边栏状态变更影响多组件）
  - [ ] SubTask 18.3: 测试对话流集成（发送→列表更新→AI 响应→流式输出）
  - [ ] SubTask 18.4: 测试购物车集成（添加→修改→计算总价→结算）
  - [ ] SubTask 18.5: 测试主题切换集成（设置→全局生效）

- [ ] Task 19: 建立 E2E 测试套件（Playwright）
  - [ ] SubTask 19.1: 安装配置 Playwright（Chromium + 配置文件）
  - [ ] SubTask 19.2: 实现 E2E-1：首页浏览与导航（5 步）
  - [ ] SubTask 19.3: 实现 E2E-2：智能体对话完整流程（8 步）
  - [ ] SubTask 19.4: 实现 E2E-3：自动变现钱包操作（6 步）
  - [ ] SubTask 19.5: 实现 E2E-4：交易市场购物流程（10 步）
  - [ ] SubTask 19.6: 实现 E2E-5~7：社交互动、主题切换、响应式布局
  - [ ] SubTask 19.7: 运行 `npx playwright test` 确保 7 个场景全部通过

### Phase 7: 质量门禁与性能验证

- [ ] Task 20: 执行代码质量检查（ESLint + Prettier 零错误）
  - [ ] SubTask 20.1: 运行 `npm run lint`，确认 **0 errors, 0 warnings**
  - [ ] SubTask 20.2: 运行 `npm run format:check`，确认无需格式化
  - [ ] SubTask 20.3: 修复所有 lint 错误和警告（如有）
  - [ ] SubTask 20.4: 验证 pre-commit hook 正常工作

- [ ] Task 21: 执行回归测试矩阵（功能对等性验证）
  - [ ] SubTask 21.1: 对比 React 版本和 Vue3 版本的首页加载性能
  - [ ] SubTask 21.2: 验证所有 P0 模块功能行为一致性
  - [ ] SubTask 21.3: 验证所有 P1 模块核心流程完整性
  - [ ] SubTask 21.4: 记录差异项并评估是否可接受
  - [ ] SubTask 21.5: 生成回归测试报告（通过/失败/可接受标记）

- [ ] Task 22: 执行性能基准测试（Lighthouse CI）
  - [ ] SubTask 22.1: 启动开发服务器（`npm run dev`）
  - [ ] SubTask 22.2: 运行 Lighthouse Performance 审计
  - [ ] SubTask 22.3: 验证 FCP ≤ 3s, LCP ≤ 2.5s, CLS ≤ 0.1
  - [ ] SubTask 22.4: 分析 JS Bundle 大小（gzip 后每个 chunk ≤ 150KB）
  - [ ] SubTask 22.5: 生成性能报告并存档

- [ ] Task 23: 生成迁移文档和 Git 提交
  - [ ] SubTask 23.1: 生成迁移报告（`.trae/docs/react-to-vue3-migration-report.md`）
  - [ ] SubTask 23.2: 执行 Git Conventional Commits 提交
  - [ ] SubTask 23.3: 创建版本标签：`git tag v3.0.0-vue3-migration-complete`
  - [ ] SubTask 23.4: 推送到远程仓库
  - [ ] SubTask 23.5: 更新 ACTIVE_SPEC 文件指向 vue3-deployment（为下一阶段做准备）

## Task Dependencies

### 关键依赖链：
```
Task 1 (项目初始化) 
  ↓
Task 2 (工具链) + Task 3 (数据迁移) [可并行]
  ↓
Task 4 (Router) + Task 5 (Store) + Task 6 (Layout) [Phase 1 可并行]
  ↓
Task 7 (首页) [Phase 2]
  ↓
Task 8-10 (P0 模块) [Phase 3，高度并行]
  ↓
Task 11-13 (P1 模块) [Phase 4，可与 P0 重叠开始]
  ↓
Task 14-16 (P2 模块) [Phase 5]
  ↓
Task 17-19 (测试体系) [Phase 6，可在 Phase 3 开始后启动]
  ↓
Task 20-23 (质量验证) [Phase 7，必须最后执行]
```

### 与 vue3-deployment 的关系：
- ✅ 本规范的 **Task 23 完成后** → 触发 `agentpit-vue3-deployment` 的 **Phase 4 (Podman 容器化部署)**
- ❌ 不得跳过本规范直接进入部署阶段

## Parallel Execution Groups

| Group | Tasks | 并行度 | 说明 |
|-------|-------|--------|------|
| **A** | Task 1 | 串行 | 必须首先完成 |
| **B** | Task 2 + Task 3 | 2 并行 | 工具链和数据可同时准备 |
| **C** | Task 4 + Task 5 + Task 6 | 3 并行 | 核心框架三层可并行 |
| **D** | Task 7 | 串行 | 首页单独验证 |
| **E** | Task 8 + Task 9 + Task 10 | 3 并行 | P0 模块高优先级并行 |
| **F** | Task 11 + Task 12 + Task 13 | 3 并行 | P1 模块次优先级并行 |
| **G** | Task 14 + Task 15 + Task 16 | 3 并行 | P2 模块可大量并行 |
| **H** | Task 17 + Task 18 + Task 19 | 3 并行 | 测试体系可提前启动 |
| **I** | Task 20 + Task 21 + Task 22 | 3 并行 | 质量门禁可并行 |
| **J** | Task 23 | 串行 | 最终收尾 |

## Estimated Effort

| Phase | Tasks | 复杂度 | 预估工时 |
|-------|-------|--------|----------|
| Pre-Phase 0 | 1-3 | 低 | 3-4 小时 |
| Phase 1 | 4-6 | 中 | 6-8 小时 |
| Phase 2 | 7 | 低 | 2-3 小时 |
| Phase 3 | 8-10 | 高 | 12-18 小时 |
| Phase 4 | 11-13 | 高 | 10-15 小时 |
| Phase 5 | 14-16 | 中 | 8-12 小时 |
| Phase 6 | 17-19 | 高 | 10-15 小时 |
| Phase 7 | 20-23 | 中 | 6-8 小时 |
| **总计** | **23 个任务** | - | **57-83 小时** |
