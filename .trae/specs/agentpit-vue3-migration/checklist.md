# React → Vue3 前置迁移与全量测试 - 验证清单

## Pre-Phase 0: 项目准备与环境搭建 ✅

### Task 1: 备份现有 React 项目并初始化 Vue3 脚手架
- [ ] React 源码已备份到 `src-react-backup-YYYYMMDD/` 目录
- [ ] Vite + Vue3 + TypeScript 项目成功创建
- [ ] package.json 包含 vue@^3.4.0, vue-router@4, pinia, tailwindcss 等核心依赖
- [ ] tsconfig.json 配置了严格模式和路径别名 (@/)
- [ ] 标准目录结构已创建（components/, views/, stores/, composables/, router/, utils/）
- [ ] `npm run dev` 可正常启动 Vue3 开发服务器

### Task 2: 配置代码规范工具链和开发脚本
- [ ] ESLint 安装完成（@vue/eslint-config-typescript, @vue/eslint-config-prettier）
- [ ] Prettier 安装完成并配置 .prettierrc
- [ ] .eslintrc.cjs 存在且包含 Vue3 规则（零错误目标）
- [ ] package.json scripts 包含 dev/build/test/lint/format 命令
- [ ] Git pre-commit hook 已配置（husky + lint-staged）

### Task 3: 迁移 Mock 数据和类型定义
- [ ] 所有 data/*.ts 文件从 React 项目复制到 Vue3 项目
- [ ] 类型定义已适配（移除 React 类型，添加 Vue 类型）
- [ ] 数据文件导入无 TypeScript 编译错误

## Phase 1: 核心框架层迁移 ✅

### Task 4: 实现路由系统（Vue Router v4）
- [ ] router/index.ts 定义了完整的 11 个页面路由
- [ ] 所有路由使用动态 import() 实现懒加载
- [ ] 404 错误页面组件存在且可访问
- [ ] App.vue 正确挂载 <RouterView> 组件
- [ ] 路由配置单元测试通过（覆盖率 ≥ 90%）

### Task 5: 实现状态管理（Pinia Stores）
- [ ] useAppStore 创建成功（sidebarOpen, theme 等状态）
- [ ] useChatStore 创建成功（对话历史、消息状态）
- [ ] 持久化插件配置正确（localStorage 存储恢复）
- [ ] Store 单元测试通过（覆盖率 ≥ 85%）

### Task 6: 迁移布局组件（Layout Components）
- [ ] Header.vue 渲染正确（导航栏、响应式菜单、用户信息区）
- [ ] Sidebar.vue 展开收起动画流畅
- [ ] Footer.vue 底部信息显示完整
- [ ] MainLayout.vue 整合 Header/Sidebar/Footer/<RouterView>
- [ ] 布局组件单元测试通过（覆盖率 ≥ 80%）

## Phase 2: 首页模块迁移验证 ✅

### Task 7: 迁移首页和模块卡片组件
- [ ] ModuleCard.vue 六边形卡片样式正确（渐变、圆角、阴影）
- [ ] ModuleCard 悬停动画效果正常（放大105%、上移8px、阴影增强）
- [ ] HomePage.vue 页面标题正确："利用该智能体，借助Sphinx构建一个可以自动变现的网站"
- [ ] HomePage 副标题正确："打造您的自动赚钱平台 ✨"
- [ ] **9 个核心功能模块卡片全部显示**：
  - [ ] 💰 自动变现（全自动收益）
  - [ ] 🏛️ Sphinx 构建（快速建站）
  - [ ] 💬 智能体与人交互
  - [ ] 🤝 人与人的真实连接
  - [ ] 🛒 交易
  - [ ] 🧠 智能体核心
  - [ ] 🤖 智能体协作
  - [ ] ☁️ 存储记忆
  - [ ] ⚙️ 定制智能体
- [ ] **4 个额外功能模块卡片全部显示**：
  - [ ] 💑 约友（约会交友）
  - [ ] 📹 开会（视频会议）
  - [ ] ✈️ 旅游
  - [ ] 🎮 游戏
- [ ] 入场动画效果正常（staggered reveal，延迟 100ms）
- [ ] 点击任意卡片可跳转到对应路由页面
- [ ] 响应式网格布局验证：
  - [ ] 桌面端（≥1024px）：4 列网格
  - [ ] 平板端（768-1023px）：3 列网格
  - [ ] 手机端（<768px）：2 列网格
- [ ] 渐变背景视觉效果与设计图一致

## Phase 3: P0 功能模块实现（核心业务）✅

### Task 8: 自动变现系统（Monetization）[P0]
- [ ] WalletCard.vue 显示余额信息（总余额、可用余额、冻结金额）
- [ ] RevenueChart.vue 图表渲染正确（ECharts 折线图/柱状图）
- [ ] TransactionHistory.vue 交易列表支持分页和筛选
- [ ] WithdrawModal.vue 提现表单验证正常（余额检查、格式校验）
- [ ] FinancialReport.vue 指标卡片和饼图展示完整
- [ ] MonetizationPage.vue 整合所有子组件并正常工作
- [ ] 自动变现模块单元测试通过

### Task 9: Sphinx 快速建站系统（Sphinx）[P0]
- [ ] SiteWizard.vue 5 步向导流程清晰（步骤指示器+内容切换）
- [ ] TemplateGallery.vue 模板预览切换流畅
- [ ] AISiteBuilder.vue AI 对话界面响应自然
- [ ] SitePreview.vue 和 PublishPanel.vue 功能完整
- [ ] SphinxPage.vue 整合所有子组件
- [ ] Sphinx 建站模块集成测试通过

### Task 10: 智能体对话系统（Chat）[P0]
- [ ] ChatInterface.vue 主聊天界面布局正确
- [ ] MessageList.vue 流式输出打字机效果正常（逐字显示，30-300ms 间隔）
- [ ] MessageInput.vue 输入框和快捷指令可用
- [ ] QuickCommands.vue 快捷命令面板功能完整
- [ ] ChatSidebar.vue 对话历史侧边栏正常
- [ ] useTypewriter composable 工作正常
- [ ] ChatPage.vue 整合完成
- [ ] 对话模块全量测试通过（包含流式输出场景）

## Phase 4: P1 功能模块实现（重要业务）✅

### Task 11: 社交连接系统（Social）[P1]
- [ ] UserProfileCard.vue 用户资料卡信息完整
- [ ] DatingMatch.vue Tinder 式滑动交互流畅
- [ ] MeetingRoom.vue 会议 UI 功能完整
- [ ] SocialFeed.vue 社交动态流显示正确
- [ ] FriendsSystem.vue 好友操作正常
- [ ] SocialPage.vue Tab 导航切换整合完成

### Task 12: 交易市场（Marketplace）[P1]
- [ ] ProductGrid.vue 商品网格展示美观
- [ ] ProductDetail.vue 详情页信息完整
- [ ] SearchFilter.vue 搜索过滤响应快速
- [ ] ShoppingCart.vue 购物车操作正常
- [ ] OrderManagement.vue 订单管理功能完整
- [ ] MarketplacePage.vue 整合完成

### Task 13: 多智能体协作系统（Collaboration）[P1]
- [ ] AgentWorkspace.vue 工作台主界面功能完整
- [ ] AgentSelector.vue 多选模式正常
- [ ] AgentConfigPanel.vue 配置面板设置灵活
- [ ] TaskDistributor.vue 任务分配进度可视化
- [ ] CollaborationResult.vue 结果汇总对比视图清晰
- [ ] CollaborationPage.vue 整合完成

## Phase 5: P2 功能模块实现（辅助功能）✅

### Task 14: 存储记忆系统（Memory）[P2]
- [ ] FileManager.vue 文件管理器操作正常
- [ ] KnowledgeGraph.vue SVG 动画渲染正确
- [ ] MemorySearch.vue 检索搜索返回结果准确
- [ ] BackupSettings.vue 备份同步可配置
- [ ] StorageQuota.vue 存储配额显示正确
- [ ] MemoryPage.vue 整合完成

### Task 15: 定制化智能体（Customize）[P2]
- [ ] AgentCreatorWizard.vue 5 步向导流程完整
- [ ] BasicInfoForm.vue 表单验证通过
- [ ] AppearanceCustomizer.vue 实时预览正常
- [ ] AbilityConfigurator.vue 能力配置面板功能正常
- [ ] BusinessModelSetup.vue 收益计算器可用
- [ ] CustomizePage.vue 整合完成

### Task 16: 生活服务与设置（Lifestyle & Settings）[P2]
- [ ] MeetingCalendar.vue 日历会议安排功能完整
- [ ] TravelPlanner.vue 旅游行程构建器可用
- [ ] GameCenter.vue 含 3 个内置小游戏可运行
- [ ] LifestyleDashboard.vue 生活服务聚合仪表盘
- [ ] UserProfileSettings.vue 个人资料编辑保存正常
- [ ] ThemePreferences.vue 主题切换生效
- [ ] NotificationSettings.vue / PrivacySecurity.vue / HelpCenter.vue 功能完整
- [ ] LifestylePage.vue 和 SettingsPage.vue 整合完成

## Phase 6: 全量测试体系建立 ✅

### Task 17: 单元测试套件（Vitest + Vue Test Utils）
- [ ] Vitest 配置文件正确（vitest.config.ts）
- [ ] Layout 组件测试全部通过（Header, Sidebar, Footer, MainLayout）
- [ ] Store 测试全部通过（useAppStore, useChatStore 等）
- [ ] Composables 测试全部通过（useTypewriter 等）
- [ ] 工具函数测试全部通过（utils/ 目录）
- [ ] **测试覆盖率达标**：
  - [ ] 组件覆盖率 ≥ **80%**
  - [ ] Store 覆盖率 ≥ **85%**
  - [ ] 工具函数覆盖率 ≥ **95%**
- [ ] `npm run test:coverage` 报告生成无错误

### Task 18: 集成测试套件（跨模块交互）
- [ ] 路由导航集成测试：点击卡片→页面跳转→URL 更新→布局刷新
- [ ] 状态管理集成测试：侧边栏状态变更影响多组件同步更新
- [ ] 对话流集成测试：发送消息→列表更新→AI响应→流式输出
- [ ] 购物车集成测试：添加商品→修改数量→计算总价→结算提交
- [ ] 主题切换集成测试：设置页切换→全局所有组件样式实时更新
- [ ] 所有集成测试用例通过

### Task 19: E2E 测试套件（Playwright）
- [ ] Playwright 配置文件正确（playwright.config.ts）
- [ ] **E2E-1 首页浏览与导航**：5 步全部通过
- [ ] **E2E-2 智能体对话完整流程**：8 步全部通过（含流式输出等待）
- [ ] **E2E-3 自动变现钱包操作**：6 步全部通过
- [ ] **E2E-4 交易市场购物流程**：10 步全部通过
- [ ] **E2E-5 社交互动**：7 步全部通过
- [ ] **E2E-6 主题切换全局生效**：4 步全部通过
- [ ] **E2E-7 响应式布局验证**：3 种视口全部通过
- [ ] `npx playwright test` 执行结果：**7/7 场景通过**
- [ ] E2E 测试失败时截图存档正常

## Phase 7: 质量门禁与性能验证 ✅

### Task 20: 代码质量检查（ESLint + Prettier 零错误）
- [ ] `npm run lint` 执行结果：**0 errors, 0 warnings** ✅
- [ ] `npm run format:check` 执行结果：**No files need formatting** ✅
- [ ] 如有 lint 错误已全部修复并重新验证
- [ ] pre-commit hook 在 Git 提交时自动触发并通过

### Task 21: 回归测试矩阵（功能对等性验证）
- [ ] 首页加载时间对比：Vue3 ≤ 3s（满足目标）
- [ ] P0 模块（Task 8-10）功能行为一致性验证：**全部 Pass 或 Acceptable**
- [ ] P1 模块（Task 11-13）核心流程完整性：**全部 Pass 或 Acceptable**
- [ ] 回归测试矩阵文档生成（标记每个功能点状态）
- [ ] 无 Fail 级别的功能缺失或严重偏差

### Task 22: 性能基准测试（Lighthouse CI）
- [ ] Lighthouse Performance 审计执行成功
- [ ] **FCP (First Contentful Paint) ≤ 3.0s** ✅
- [ ] **LCP (Largest Contentful Paint) ≤ 2.5s** ✅
- [ ] **CLS (Cumulative Layout Shift) ≤ 0.1** ✅
- [ ] JS Bundle 分析报告生成：
  - [ ] 每个 chunk gzip 后大小 ≤ **150KB**
  - [ ] 总体积合理（≤ 2MB 未压缩）
- [ ] Lighthouse Performance Score ≥ **90**

### Task 23: 迁移文档与 Git 提交
- [ ] 迁移报告已生成：`.trae/docs/react-to-vue3-migration-report.md`
- [ ] Git 提交遵循 Conventional Commits 规范
  - [ ] 提交类型：`feat(migration): complete react-to-vue3 migration`
  - [ ] 提交信息包含：任务摘要、测试结果、性能数据
- [ ] 版本标签创建成功：`v3.0.0-vue3-migration-complete`
- [ ] 代码推送到远程仓库（GitHub/GitLab）
- [ ] `.trae/ACTIVE_SPEC` 文件更新为：`agentpit-vue3-deployment`
  - [ ] 表示下一阶段可触发 Podman 容器化部署

## 最终验收总结 ✅

### 迁移完成标志（Definition of Done）
- [ ] ✅ 无任何 `.tsx/.jsx` 文件残留（全部替换为 `.vue`）
- [ ] ✅ package.json 中无 React 相关依赖（react, react-dom, react-router-dom, zustand）
- [ ] ✅ `npm run build` 成功，产物符合体积要求
- [ ] ✅ `npm run lint`: **0 errors, 0 warnings**
- [ ] ✅ 单元测试覆盖率达标（组件≥80%, Store≥85%, 工具≥95%）
- [ ] ✅ E2E 测试 7/7 场景全部通过
- [ ] ✅ Lighthouse Performance Score ≥ 90
- [ ] ✅ 回归测试矩阵中 P0/P1 功能全部 Pass/Acceptable
- [ ] ✅ Git 提交记录规范，版本标签已创建
- [ ] ✅ 迁移文档齐全，ACTIVE_SPEC 已指向下一阶段

### 与下一阶段衔接
- [ ] 本规范（agentpit-vue3-migration）**全部验证项通过** ✅
- [ ] 准备进入 **agentpit-vue3-deployment** 的 **Phase 4 (Podman 容器化部署）**
- [ ] 无阻塞问题，可以开始容器化配置和 CI/CD 流程
