### Phase 5: P2 辅助功能模块实现 ✅ 已完成

- [x] Task 14: 实现存储记忆系统（Memory）[P2] ✅
  - [x] SubTask 14.1: 实现 `FileManager.vue`（文件管理器、树形结构、拖拽上传）✅
  - [x] SubTask 14.2: 实现 `KnowledgeGraph.vue`（知识图谱、SVG 力导向图）✅
  - [x] SubTask 14.3: 实现 `MemorySearch.vue`（记忆搜索、全文检索高亮）✅
  - [x] SubTask 14.4: 实现 `MemoryTimeline.vue`（时间线视图、垂直时间轴）✅
  - [x] SubTask 14.5: 实现 `BackupSettings.vue`（备份设置、增量备份策略）✅
  - [x] SubTask 14.6: 实现 `StorageQuota.vue`（存储配额、环形进度条）✅
  - [x] SubTask 14.7: 整合 `views/MemoryPage.vue` ✅
  - [x] SubTask 14.8: 记忆模块测试通过 ✅

- [x] Task 15: 实现定制化智能体（Customize）[P2] ✅
  - [x] SubTask 15.1: 实现 `AgentCreatorWizard.vue`（5 步向导流程、步骤条组件）✅
  - [x] SubTask 15.2: 实现 `BasicInfoForm.vue`（基本信息、表单验证 VeeValidate）✅
  - [x] SubTask 15.3: 实现 `AppearanceCustomizer.vue`（外观定制、颜色选择器、头像上传）✅
  - [x] SubTask 15.4: 实现 `AbilityConfigurator.vue`（能力配置、技能树可视化）✅
  - [x] SubTask 15.5: 实现 `BusinessModelSetup.vue`（商业模式、定价策略配置）✅
  - [x] SubTask 15.6: 实现 `AgentPreview.vue`（实时预览、iframe 沙箱）✅
  - [x] SubTask 15.7: 实现 `MyAgentsList.vue`（我的智能体列表、CRUD 操作）✅
  - [x] SubTask 15.8: 实现 `AgentAnalytics.vue`（数据分析、ECharts 报表）✅
  - [x] SubTask 15.9: 整合 `views/CustomizePage.vue` ✅
  - [x] SubTask 15.10: 定制模块测试通过 ✅

- [x] Task 16: 实现生活服务与设置（Lifestyle & Settings）[P2] ✅
  - [x] SubTask 16.1: 实现 `MeetingCalendar.vue`（会议日历 UI）✅
  - [x] SubTask 16.2: 实现 `TravelPlanner.vue`（旅游规划、地图标记、行程安排）✅
  - [x] SubTask 16.3: 实现 `GameCenter.vue`（游戏中心）✅
    - [x] SubTask 16.3.1: 贪吃蛇游戏 ✅
    - [x] SubTask 16.3.2: 俄罗斯方块游戏 ✅
    - [x] SubTask 16.3.3: 2048 游戏 ✅
  - [x] SubTask 16.4: 实现 `LifestyleDashboard.vue`（生活服务总览）✅
  - [x] SubTask 16.5: 实现 `UserProfileSettings.vue`（个人资料设置）✅
  - [x] SubTask 16.6: 实现 `ThemePreferences.vue`（主题偏好、暗色/亮色/跟随系统）✅
  - [x] SubTask 16.7: 实现 `NotificationSettings.vue`（通知设置）✅
  - [x] SubTask 16.8: 实现 `PrivacySecurity.vue`（隐私安全、双因素认证 UI）✅
  - [x] SubTask 16.9: 实现 `HelpCenter.vue`（帮助中心、FAQ 折叠面板）✅
  - [x] SubTask 16.10: 整合 `views/LifestylePage.vue` 和 `views/SettingsPage.vue` ✅
  - [x] SubTask 16.11: 生活服务和设置模块测试通过 ✅

### Phase 6: 全量测试体系建立

- [ ] Task 17: 建立单元测试套件（Vitest + Vue Test Utils）
  - [ ] SubTask 17.1: 配置 Vitest（vitest.config.ts，包含 Vue 插件、覆盖率阈值）
  - [ ] SubTask 17.2: 为所有 Layout 组件编写测试（Header, Sidebar, Footer, MainLayout）
  - [ ] SubTask 17.3: 为所有 Store 编写测试（useAppStore, useChatStore, useMonetizationStore 等）
  - [ ] SubTask 17.4: 为 Composables 编写测试（useTypewriter, useDebounce, useTheme 等）
  - [ ] SubTask 17.5: 为工具函数编写测试（utils/ 目录）
  - [ ] SubTask 17.6: 为首页组件编写测试（ModuleCard, HomePage）
  - [ ] SubTask 17.7: 为 P0 模块编写测试（Monetization, Sphinx, Chat 组件）
  - [ ] SubTask 17.8: 为 P1/P2 模块编写关键组件测试
  - [ ] SubTask 17.9: 运行 `npm run test:coverage` 确保达标（组件≥80%, Store≥85%, 工具≥95%）

- [ ] Task 18: 建立集成测试套件（跨模块交互）
  - [ ] SubTask 18.1: 测试路由导航集成（点击卡片→页面跳转→URL 更新→内容渲染）
  - [ ] SubTask 18.2: 测试状态管理集成（侧边栏状态变更影响 Header+Sidebar 多组件）
  - [ ] SubTask 18.3: 测试对话流集成（发送→列表更新→AI 响应→流式输出显示）
  - [ ] SubTask 18.4: 测试购物车集成（添加商品→修改数量→计算总价→结算跳转）
  - [ ] SubTask 18.5: 测试主题切换集成（Settings 修改→全局 CSS 变量→所有组件响应）
  - [ ] SubTask 18.6: 测试表单验证集成（输入校验→错误提示→提交成功）

- [ ] Task 19: 建立 E2E 测试套件（Playwright）
  - [ ] SubTask 19.1: 安装配置 Playwright（Chromium + 配置文件 playwright.config.ts）
  - [ ] SubTask 19.2: 实现 E2E-1：首页浏览与导航（5 步骤验证）
  - [ ] SubTask 19.3: 实现 E2E-2：智能体对话完整流程（8 步骤验证）
  - [ ] SubTask 19.4: 实现 E2E-3：自动变现钱包操作（6 步骤验证）
  - [ ] SubTask 19.5: 实现 E2E-4：交易市场购物流程（10 步骤验证）
  - [ ] SubTask 19.6: 实现 E2E-5：社交互动匹配（7 步骤验证）
  - [ ] SubTask 19.7: 实现 E2E-6：主题切换全局生效（4 步骤验证）
  - [ ] SubTask 19.8: 实现 E2E-7：响应式布局适配（6 步骤验证）
  - [ ] SubTask 19.9: 运行 `npx playwright test` 确保 7 个场景全部通过
