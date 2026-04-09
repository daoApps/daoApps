# AgentPit React → Vue3 组件映射表

## 项目概述

**项目名称**: AgentPit - 智能体生态平台
**迁移目标**: React (Vite + TypeScript) → Vue3 (Vite + TypeScript + Pinia)
**备份日期**: 2026-04-10
**备份目录**: `src-react-backup-20260410/`
**新代码目录**: `src/`

## 映射总览

### 统计信息

| 类别 | React 文件数 | Vue3 目标文件数 | 迁移复杂度 |
|------|------------|----------------|-----------|
| 核心框架 | 3 | 3 | ⭐⭐ |
| 页面组件 | 11 | 11 | ⭐⭐⭐ |
| 布局组件 | 4 | 4 | ⭐⭐ |
| 业务组件 | 49 | 49 | ⭐⭐⭐⭐ |
| 数据层 | 9 | 9 | ⭐⭐ |
| 类型定义 | 1 | 7+ | ⭐⭐ |
| 状态管理 | 1 | 1 | ⭐⭐⭐ |
| **总计** | **78** | **84+** | - |

---

## 一、核心框架组件映射

| React 组件 | Vue3 组件 | 路径 | 迁移状态 | 增强点 |
|-----------|----------|------|---------|--------|
| `App.tsx` | `App.vue` | `/src/App.vue` | ⏳ 待迁移 | 使用 `<Suspense>` 实现异步组件加载 |
| `main.tsx` | `main.ts` | `/src/main.ts` | ⏳ 待迁移 | 使用 `createApp()` API，集成 Pinia |
| `App.css` | 全局样式 | `/src/style.css` | ⏳ 待迁移 | 迁移至 scoped 样式或 CSS Modules |

### 路由配置映射

| React 实现 | Vue3 实现 | 说明 |
|-----------|----------|------|
| `react-router-dom` (BrowserRouter) | `vue-router` (createRouter) | 嵌套路由结构保持一致 |
| `<Routes>` + `<Route>` | `<router-view>` + 路由配置 | 支持懒加载和滚动行为 |
| `useNavigate()` | `router.push()` / `<router-link>` | 编程式导航和声明式导航 |
| `<Outlet>` | `<router-view>` | 嵌套视图渲染 |

#### 路由路径对照表

| React 路径 | Vue3 路径 | 对应页面 | 组件名 |
|-----------|----------|---------|--------|
| `/` | `/` | 首页 | HomePage |
| `/monetization` | `/monetization` | 变现系统 | MonetizationPage |
| `/sphinx` | `/sphinx` | Sphinx建站 | SphinxPage |
| `/chat` | `/chat` | 智能聊天 | ChatPage |
| `/social` | `/social` | 社交连接 | SocialPage |
| `/marketplace` | `/marketplace` | 交易市场 | MarketplacePage |
| `/collaboration` | `/collaboration` | 智能体协作 | CollaborationPage |
| `/memory` | `/memory` | 存储记忆 | MemoryPage |
| `/customize` | `/customize` | 定制智能体 | CustomizePage |
| `/customize/my-agents` | `/customize/my-agents` | 我的智能体 | CustomizePage |
| `/customize/:id/edit` | `/customize/:id/edit` | 编辑智能体 | CustomizePage |
| `/customize/:id/analytics` | `/customize/:id/analytics` | 数据分析 | CustomizePage |
| `/lifestyle` | `/lifestyle` | 生活服务 | LifestylePage |
| `/settings` | `/settings` | 系统设置 | SettingsPage |

---

## 二、布局组件映射

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 增强点 |
|-----------|----------|---------|---------|--------|
| [MainLayout.tsx](../src-react-backup-20260410/components/layout/MainLayout.tsx) | MainLayout.vue | 主布局容器（Header + Sidebar + Content） | ⏳ 待迁移 | 使用 `<Teleport>` 处理模态框 |
| [Header.tsx](../src-react-backup-20260410/components/layout/Header.tsx) | Header.vue | 顶部导航栏 | ⏳ 待迁移 | Transition 动画效果 |
| [Sidebar.tsx](../src-react-backup-20260410/components/layout/Sidebar.tsx) | Sidebar.vue | 侧边栏菜单 | ⏳ 待迁移 | 响应式折叠动画 |
| [Footer.tsx](../src-react-backup-20260410/components/layout/Footer.tsx) | Footer.vue | 底部版权信息 | ⏳ 待迁移 | - |

---

## 三、页面组件映射

### 3.1 首页模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 关键特性 |
|-----------|----------|---------|---------|---------|
| [HomePage.tsx](../src-react-backup-20260410/pages/HomePage.tsx) | HomePage.vue | 首页入口，展示功能模块卡片 | ⏳ 待迁移 | 渐变背景、动画入场效果 |
| [ModuleCard.tsx](../src-react-backup-20260410/components/home/ModuleCard.tsx) | ModuleCard.vue | 功能模块卡片组件 | ⏳ 待迁移 | 悬停缩放、渐变背景、路由跳转 |

**ModuleCard Props 接口**:
```typescript
interface ModuleCardProps {
  title: string        // 模块标题
  subtitle: string     // 副标题
  icon: string         // Emoji 图标
  route: string        // 路由路径
  gradientFrom: string // 渐变起始色 (Tailwind class)
  gradientTo: string   // 渐变结束色 (Tailwind class)
  delay?: number       // 动画延迟 (ms)
}
```

**核心模块列表** (9个):
1. 💰 自动变现 (`/monetization`)
2. 🏛️ Sphinx 构建 (`/sphinx`)
3. 💬 智能体与人交互 (`/chat`)
4. 🤝 人与人的真实连接 (`/social`)
5. 🛒 交易 (`/marketplace`)
6. 🧠 智能体核心 (`/collaboration`)
7. 🤖 智能体与智能体交互自动协作 (`/collaboration`)
8. ☁️ 存储记忆 (`/memory`)
9. ⚙️ 定制可以自动变现的智能体 (`/customize`)

**扩展模块列表** (4个):
1. 💑 约友 (`/lifestyle`)
2. 📹 开会 (`/social`)
3. ✈️ 旅游 (`/lifestyle`)
4. 🎮 游戏 (`/lifestyle`)

---

### 3.2 变现系统模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [MonetizationPage.tsx](../src-react-backup-20260410/pages/MonetizationPage.tsx) | MonetizationPage.vue | 变现系统主页面 | ⏳ 待迁移 | ⭐⭐⭐ |
| [WalletCard.tsx](../src-react-backup-20260410/components/monetization/WalletCard.tsx) | WalletCard.vue | 钱包余额卡片 | ⏳ 待迁移 | ⭐⭐ |
| [RevenueChart.tsx](../src-react-backup-20260410/components/monetization/RevenueChart.tsx) | RevenueChart.vue | 收益图表 | ⏳ 待迁移 | ⭐⭐⭐ |
| [TransactionHistory.tsx](../src-react-backup-20260410/components/monetization/TransactionHistory.tsx) | TransactionHistory.vue | 交易记录列表 | ⏳ 待迁移 | ⭐⭐ |
| [WithdrawModal.tsx](../src-react-backup-20260410/components/monetization/WithdrawModal.tsx) | WithdrawModal.vue | 提现弹窗 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `WalletData`: 钱包数据（总余额、可用余额、冻结余额）
- `RevenueDataPoint`: 收益数据点（日期、收入、支出、利润）
- `TransactionRecord`: 交易记录（类型、金额、状态、分类）
- `SourceDistribution`: 收入来源分布

---

### 3.3 Sphinx 建站模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [SphinxPage.tsx](../src-react-backup-20260410/pages/SphinxPage.tsx) | SphinxPage.vue | AI建站主页面 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [AISiteBuilder.tsx](../src-react-backup-20260410/components/sphinx/AISiteBuilder.tsx) | AISiteBuilder.vue | AI站点构建器 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [SiteWizard.tsx](../src-react-backup-20260410/components/sphinx/SiteWizard.tsx) | SiteWizard.vue | 建站向导流程 | ⏳ 待迁移 | ⭐⭐⭐ |
| [TemplateGallery.tsx](../src-react-backup-20260410/components/sphinx/TemplateGallery.tsx) | TemplateGallery.vue | 模板画廊 | ⏳ 待迁移 | ⭐⭐ |
| [SitePreview.tsx](../src-react-backup-20260410/components/sphinx/SitePreview.tsx) | SitePreview.vue | 站点预览 | ⏳ 待迁移 | ⭐⭐⭐ |
| [PublishPanel.tsx](../src-react-backup-20260410/components/sphinx/PublishPanel.tsx) | PublishPanel.vue | 发布面板 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `Template`: 网站模板（分类：电商、博客、企业、作品集、着陆页）
- `SiteConfig`: 站点配置（名称、域名、SEO设置）
- `PublishHistory`: 发布历史记录

---

### 3.4 聊天系统模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [ChatPage.tsx](../src-react-backup-20260410/pages/ChatPage.tsx) | ChatPage.vue | 聊天主页面 | ⏳ 待迁移 | ⭐⭐⭐⭐ |

**核心数据类型** (来自 [chatTypes.ts](../src-react-backup-20260410/types/chatTypes.ts)):
- `Message`: 消息（角色、内容、时间戳、状态、流式标记）
- `Conversation`: 会话（消息列表、Agent ID、标题）
- `AgentInfo`: 智能体信息（名称、头像、描述）
- `QuickCommand`: 快捷指令（类别：通用、创意、分析、编程）
- `ChatState`: 全局聊天状态

---

### 3.5 社交连接模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [SocialPage.tsx](../src-react-backup-20260410/pages/SocialPage.tsx) | SocialPage.vue | 社交主页面 | ⏳ 待迁移 | ⭐⭐⭐ |

---

### 3.6 交易市场模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [MarketplacePage.tsx](../src-react-backup-20260410/pages/MarketplacePage.tsx) | MarketplacePage.vue | 交易市场主页 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [ProductGrid.tsx](../src-react-backup-20260410/components/marketplace/ProductGrid.tsx) | ProductGrid.vue | 商品网格展示 | ⏳ 待迁移 | ⭐⭐⭐ |
| [ProductDetail.tsx](../src-react-backup-20260410/components/marketplace/ProductDetail.tsx) | ProductDetail.vue | 商品详情页 | ⏳ 待迁移 | ⭐⭐⭐ |
| [SearchFilter.tsx](../src-react-backup-20260410/components/marketplace/SearchFilter.tsx) | SearchFilter.vue | 搜索筛选器 | ⏳ 待迁移 | ⭐⭐ |
| [ShoppingCart.tsx](../src-react-backup-20260410/components/marketplace/ShoppingCart.tsx) | ShoppingCart.vue | 购物车 | ⏳ 待迁移 | ⭐⭐⭐ |
| [OrderManagement.tsx](../src-react-backup-20260410/components/marketplace/OrderManagement.tsx) | OrderManagement.vue | 订单管理 | ⏳ 待迁移 | ⭐⭐⭐ |
| [ReviewSystem.tsx](../src-react-backup-20260410/components/marketplace/ReviewSystem.tsx) | ReviewSystem.vue | 评价系统 | ⏳ 待迁移 | ⭐⭐ |
| [SellerCenter.tsx](../src-react-backup-20260410/components/marketplace/SellerCenter.tsx) | SellerCenter.vue | 卖家中心 | ⏳ 待迁移 | ⭐⭐⭐ |

**核心数据类型**:
- `Product`: 商品（数字产品/实体商品/服务，含标签、规格）
- `Seller`: 卖家信息（店铺名、评分、粉丝数）
- `Category`: 分类（数字产品、在线课程、实体周边、专业服务、解决方案）
- `Order`: 订单（多状态流转、物流追踪）
- `Review`: 评价（评分、图片、验证购买）
- `CartItem`: 购物车项

---

### 3.7 智能体协作模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [CollaborationPage.tsx](../src-react-backup-20260410/pages/CollaborationPage.tsx) | CollaborationPage.vue | 协作主页面 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [AgentSelector.tsx](../src-react-backup-20260410/components/collaboration/AgentSelector.tsx) | AgentSelector.vue | 智能体选择器 | ⏳ 待迁移 | ⭐⭐⭐ |
| [AgentWorkspace.tsx](../src-react-backup-20260410/components/collaboration/AgentWorkspace.tsx) | AgentWorkspace.vue | 智能体工作区 | ⏳ 待迁移 | ⭐⭐⭐ |
| [AgentStatusCard.tsx](../src-react-backup-20260410/components/collaboration/AgentStatusCard.tsx) | AgentStatusCard.vue | 智能体状态卡片 | ⏳ 待迁移 | ⭐⭐ |
| [AgentConfigPanel.tsx](../src-react-backup-20260410/components/collaboration/AgentConfigPanel.tsx) | AgentConfigPanel.vue | 智能体配置面板 | ⏳ 待迁移 | ⭐⭐⭐ |
| [TaskDistributor.tsx](../src-react-backup-20260410/components/collaboration/TaskDistributor.tsx) | TaskDistributor.vue | 任务分发器 | ⏳ 待迁移 | ⭐⭐⭐ |
| [CommunicationPanel.tsx](../src-react-backup-20260410/components/collaboration/CommunicationPanel.tsx) | CommunicationPanel.vue | 通信面板 | ⏳ 待迁移 | ⭐⭐⭐ |
| [CollaborationResult.tsx](../src-react-backup-20260410/components/collaboration/CollaborationResult.tsx) | CollaborationResult.vue | 协作结果展示 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `Agent`: 智能体（角色、技能、等级、协作模式）
- `Task`: 任务（优先级、进度、子任务、依赖关系）
- `CollaborationSession`: 协作会话（参与Agent、任务列表）
- `Message`: Agent间通信消息

**预设智能体列表** (8个):
1. 🎯 任务规划师 (agent-planner)
2. ✍️ 内容创作专家 (agent-writer)
3. 💻 编程工程师 (agent-coder)
4. 📊 数据分析师 (agent-analyst)
5. 🎨 设计顾问 (agent-designer)
6. 🔍 研究员 (agent-researcher)
7. 💼 商业顾问 (agent-consultant)
8. 🌐 翻译官 (agent-translator)

---

### 3.8 存储记忆模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [MemoryPage.tsx](../src-react-backup-20260410/pages/MemoryPage.tsx) | MemoryPage.vue | 记忆系统主页 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [FileManager.tsx](../src-react-backup-20260410/components/memory/FileManager.tsx) | FileManager.vue | 文件管理器 | ⏳ 待迁移 | ⭐⭐⭐ |
| [KnowledgeGraph.tsx](../src-react-backup-20260410/components/memory/KnowledgeGraph.tsx) | KnowledgeGraph.vue | 知识图谱可视化 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [MemorySearch.tsx](../src-react-backup-20260410/components/memory/MemorySearch.tsx) | MemorySearch.vue | 记忆搜索 | ⏳ 待迁移 | ⭐⭐⭐ |
| [MemoryTimeline.tsx](../src-react-backup-20260410/components/memory/MemoryTimeline.tsx) | MemoryTimeline.vue | 时间线视图 | ⏳ 待迁移 | ⭐⭐ |
| [BackupSettings.tsx](../src-react-backup-20260410/components/memory/BackupSettings.tsx) | BackupSettings.vue | 备份设置 | ⏳ 待迁移 | ⭐⭐ |
| [StorageQuota.tsx](../src-react-backup-20260410/components/memory/StorageQuota.tsx) | StorageQuota.vue | 存储配额 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `FileItem`: 文件项（文档/图片/视频/音频/代码/归档）
- `KnowledgeNode`: 知识节点（概念/实体/事件/人物/地点/技能）
- `MemoryEntry`: 记忆条目（对话/笔记/书签/事件/学习/想法）
- `BackupRecord`: 备份记录
- `SyncDevice`: 同步设备

---

### 3.9 定制智能体模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [CustomizePage.tsx](../src-react-backup-20260410/pages/CustomizePage.tsx) | CustomizePage.vue | 定制主页面 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [AgentCreatorWizard.tsx](../src-react-backup-20260410/components/customize/AgentCreatorWizard.tsx) | AgentCreatorWizard.vue | 智能体创建向导 | ⏳ 待迁移 | ⭐⭐⭐⭐ |
| [BasicInfoForm.tsx](../src-react-backup-20260410/components/customize/BasicInfoForm.tsx) | BasicInfoForm.vue | 基本信息表单 | ⏳ 待迁移 | ⭐⭐ |
| [AppearanceCustomizer.tsx](../src-react-backup-20260410/components/customize/AppearanceCustomizer.tsx) | AppearanceCustomizer.vue | 外观定制器 | ⏳ 待迁移 | ⭐⭐⭐ |
| [AbilityConfigurator.tsx](../src-react-backup-20260410/components/customize/AbilityConfigurator.tsx) | AbilityConfigurator.vue | 能力配置器 | ⏳ 待迁移 | ⭐⭐⭐ |
| [BusinessModelSetup.tsx](../src-react-backup-20260410/components/customize/BusinessModelSetup.tsx) | BusinessModelSetup.vue | 商业模式设置 | ⏳ 待迁移 | ⭐⭐⭐ |
| [AgentPreview.tsx](../src-react-backup-20260410/components/customize/AgentPreview.tsx) | AgentPreview.vue | 智能体预览 | ⏳ 待迁移 | ⭐⭐ |
| [AgentAnalytics.tsx](../src-react-backup-20260410/components/customize/AgentAnalytics.tsx) | AgentAnalytics.vue | 数据分析面板 | ⏳ 待迁移 | ⭐⭐⭐ |
| [MyAgentsList.tsx](../src-react-backup-20260410/components/customize/MyAgentsList.tsx) | MyAgentsList.vue | 我的智能体列表 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `Avatar`: 头像库（人物/动物/抽象/科技，共32个）
- `ThemeColor`: 主题色彩方案（12种预设主题）
- `Ability`: 能力定义（通用/专业/工具/创意，共17种能力）
- `RoleTemplate`: 角色模板（12种预设角色）
- `AgentConfig`: 智能体完整配置（基本信息+外观+能力+商业模式）

---

### 3.10 生活服务模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [LifestylePage.tsx](../src-react-backup-20260410/pages/LifestylePage.tsx) | LifestylePage.vue | 生活服务主页 | ⏳ 待迁移 | ⭐⭐⭐ |
| [LifestyleDashboard.tsx](../src-react-backup-20260410/components/lifestyle/LifestyleDashboard.tsx) | LifestyleDashboard.vue | 生活服务仪表盘 | ⏳ 待迁移 | ⭐⭐ |
| [MeetingCalendar.tsx](../src-react-backup-20260410/components/lifestyle/MeetingCalendar.tsx) | MeetingCalendar.vue | 会议日历 | ⏳ 待迁移 | ⭐⭐⭐ |
| [TravelPlanner.tsx](../src-react-backup-20260410/components/lifestyle/TravelPlanner.tsx) | TravelPlanner.vue | 旅游规划 | ⏳ 待迁移 | ⭐⭐⭐ |
| [GameCenter.tsx](../src-react-backup-20260410/components/lifestyle/GameCenter.tsx) | GameCenter.vue | 游戏中心 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `Meeting`: 会议（视频/线下/电话，重复规则）
- `TravelDestination`: 旅游目的地（自然/文化/娱乐/美食/购物）
- `TravelItinerary`: 行程安排（每日活动、预算）
- `Hotel`: 酒店信息
- `Game`: 游戏（休闲/解谜/竞技/社交/冒险）
- `Achievement`: 成就系统
- `LeaderboardEntry`: 排行榜条目

---

### 3.11 系统设置模块

| React 组件 | Vue3 组件 | 功能说明 | 迁移状态 | 复杂度 |
|-----------|----------|---------|---------|-------|
| [SettingsPage.tsx](../src-react-backup-20260410/pages/SettingsPage.tsx) | SettingsPage.vue | 设置主页面 | ⏳ 待迁移 | ⭐⭐⭐ |
| [SettingsLayout.tsx](../src-react-backup-20260410/components/settings/SettingsLayout.tsx) | SettingsLayout.vue | 设置布局 | ⏳ 待迁移 | ⭐⭐ |
| [UserProfileSettings.tsx](../src-react-backup-20260410/components/settings/UserProfileSettings.tsx) | UserProfileSettings.vue | 个人资料设置 | ⏳ 待迁移 | ⭐⭐ |
| [ThemePreferences.tsx](../src-react-backup-20260410/components/settings/ThemePreferences.tsx) | ThemePreferences.vue | 主题偏好 | ⏳ 待迁移 | ⭐⭐ |
| [NotificationSettings.tsx](../src-react-backup-20260410/components/settings/NotificationSettings.tsx) | NotificationSettings.vue | 通知设置 | ⏳ 待迁移 | ⭐⭐ |
| [PrivacySecurity.tsx](../src-react-backup-20260410/components/settings/PrivacySecurity.tsx) | PrivacySecurity.vue | 隐私安全 | ⏳ 待迁移 | ⭐⭐ |
| [HelpCenter.tsx](../src-react-backup-20260410/components/settings/HelpCenter.tsx) | HelpCenter.vue | 帮助中心 | ⏳ 待迁移 | ⭐⭐ |

**核心数据类型**:
- `UserProfile`: 用户资料（社交账号绑定）
- `ThemeSettings`: 主题设置（亮/暗/跟随系统）
- `NotificationSettings`: 通知偏好（浏览器/邮件/短信/应用内）
- `SecuritySettings`: 安全设置（双因素认证、设备管理）
- `FAQItem`: 常见问题
- `HelpArticle`: 帮助文章

---

## 四、状态管理映射

| React 实现 | Vue3 实现 | 说明 |
|-----------|----------|------|
| Zustand (`create()`) | Pinia (`defineStore()`) | 集中化状态管理 |
| `useAppStore.ts` | `stores/useAppStore.ts` | 全局应用状态 |

### Store 结构对比

**React (Zustand)**:
```typescript
interface AppState extends ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  sidebarOpen: boolean
  searchQuery: string
  activeAgentId: string
  availableAgents: AgentInfo[]
  // Actions...
}
```

**Vue3 (Pinia)**:
```typescript
export const useAppStore = defineStore('app', {
  state: () => ({
    conversations: [] as Conversation[],
    activeConversationId: null as string | null,
    isStreaming: false,
    sidebarOpen: true,
    searchQuery: '',
    activeAgentId: 'agent-1',
    availableAgents: [] as AgentInfo[],
  }),
  actions: {
    // 迁移所有 action 方法
  },
  persist: true  // 使用 pinia-plugin-persistedstate
})
```

**关键差异**:
- ✅ Zustand 的 `set()` → Pinia 的直接 state 赋值
- ✅ localStorage 持久化 → `pinia-plugin-persistedstate`
- ✅ 保持所有业务逻辑不变

---

## 五、数据文件映射

| React 数据文件 | Vue3 数据文件 | 内容概要 | 数据量 |
|--------------|-------------|---------|-------|
| `mockMonetization.ts` | `data/mockMonetization.ts` | 变现系统 Mock 数据 | ~190 行 |
| `mockSphinx.ts` | `data/mockSphinx.ts` | Sphinx 建站 Mock 数据 | ~172 行 |
| `mockChat.ts` | `data/mockChat.ts` | 聊天系统 Mock 数据 | ~101 行 |
| `mockMarketplace.ts` | `data/mockMarketplace.ts` | 交易市场 Mock 数据 | ~1196 行 |
| `mockCollaboration.ts` | `data/mockCollaboration.ts` | 智能体协作 Mock 数据 | ~467 行 |
| `mockMemory.ts` | `data/mockMemory.ts` | 存储记忆 Mock 数据 | ~329 行 |
| `mockCustomize.ts` | `data/mockCustomize.ts` | 定制智能体 Mock 数据 | ~715 行 |
| `mockLifestyle.ts` | `data/mockLifestyle.ts` | 生活服务 Mock 数据 | ~404 行 |
| `mockSettings.ts` | `data/mockSettings.ts` | 系统设置 Mock 数据 | ~299 行 |

---

## 六、技术栈对照表

| 类别 | React 技术栈 | Vue3 技术栈 | 迁移说明 |
|------|------------|------------|---------|
| **框架** | React 18+ | Vue 3.4+ | Composition API |
| **构建工具** | Vite | Vite | 配置基本一致 |
| **语言** | TypeScript | TypeScript | 类型完全兼容 |
| **路由** | react-router-dom v6 | vue-router v4 | API略有不同 |
| **状态管理** | Zustand | Pinia | 需重写 Store |
| **样式** | Tailwind CSS | Tailwind CSS | 直接复用 |
| **图标** | Emoji / Lucide | Emoji / Lucide | 直接复用 |
| **HTTP** | (Mock 数据) | (Mock 数据) | 后续接入 Axios |
| **表单** | 受控组件 | v-model | 语法简化 |

---

## 七、迁移优先级建议

### Phase 1: 基础框架 (高优先级)
1. ✅ 项目初始化（已完成）
2. ⏳ 路由配置
3. ⏳ 布局组件（MainLayout, Header, Sidebar, Footer）
4. ⏳ 首页（HomePage + ModuleCard）

### Phase 2: 核心业务 (中高优先级)
5. ⏳ 聊天系统（ChatPage）
6. ⏳ 状态管理迁移（Zustand → Pinia）
7. ⏳ 变现系统（MonetizationPage）

### Phase 3: 扩展功能 (中优先级)
8. ⏳ 交易市场（MarketplacePage）
9. ⏳ Sphinx 建站（SphinxPage）
10. ⏳ 智能体协作（CollaborationPage）
11. ⏳ 定制智能体（CustomizePage）

### Phase 4: 辅助功能 (低优先级)
12. ⏳ 社交连接（SocialPage）
13. ⏳ 存储记忆（MemoryPage）
14. ⏳ 生活服务（LifestylePage）
15. ⏳ 系统设置（SettingsPage）

---

## 八、注意事项与风险点

### ⚠️ 高风险项
1. **聊天流式响应**: React 版使用 setInterval 模拟打字机效果，需在 Vue3 中重构
2. **知识图谱可视化**: 可能需要引入 D3.js 或 ECharts，确保 Vue3 兼容性
3. **复杂表单**: AgentCreatorWizard 多步骤表单需仔细处理状态同步
4. **路由嵌套**: React Router 的嵌套路由需转换为 Vue Router 的嵌套视图

### ✅ 低风险项
1. **静态展示页面**: HomePage、SettingsPage 等
2. **数据列表组件**: ProductGrid、TransactionHistory 等
3. **纯 UI 组件**: WalletCard、AgentStatusCard 等

### 📋 迁移检查清单
- [ ] 所有组件使用 `<script setup lang="ts">`
- [ ] Props 定义使用 TypeScript 接口
- [ ] 移除所有 React 特有导入（useState, useEffect 等）
- [ ] className → :class 或 class=""
- [ ] onClick → @click
- [ ] {children} → <slot />
- [ ] style={{}} → :style 或 style=""
- [ ] 确保 Tailwind CSS 类名完整保留
- [ ] 所有 Mock 数据已适配为 ESM 导出
- [ ] 类型定义统一提取到 types/ 目录

---

## 九、文档版本信息

- **创建日期**: 2026-04-10
- **创建人**: AI Migration Assistant
- **版本**: v1.0.0
- **基于源码**: src-react-backup-20260410/
- **适用范围**: AgentPit 项目 React → Vue3 完整迁移

---

## 十、相关文档链接

- [Vue3 组件开发指南](./VUE3_COMPONENT_GUIDE.md)
- [React 业务逻辑分析文档](./REACT_BUSINESS_LOGIC_ANALYSIS.md)
- [TypeScript 类型定义规范](../src/types/README.md)
