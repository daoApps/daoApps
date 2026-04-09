# AgentPit React → Vue3 前置迁移与全量测试规范

## Why
在执行 `agentpit-vue3-deployment` 的容器化部署流程之前，**必须优先完成从 React 到 Vue3 的框架迁移操作**。当前 `agentpit-platform-development` 项目基于 React 19 已实现了部分功能（Task 1-2：基础架构和首页），需要将这些已实现的功能以及待实现的功能全部迁移至 Vue 3.4+ 生态系统，并经过严格的单元测试、集成测试和 E2E 测试验证，确保应用功能完整性、稳定性和性能符合项目编码规范要求后，方可进入后续的 Podman 容器化部署阶段。

## What Changes
- **BREAKING**: 将 `apps/AgentPit/` 项目的前端框架从 React 19 完全替换为 Vue 3.4+
- **BREAKING**: 状态管理库从 Zustand 替换为 Pinia
- **BREAKING**: 路由系统从 React Router DOM v7 替换为 Vue Router v4
- 新增 Vue3 项目脚手架（保留现有业务逻辑和数据结构）
- 新增全面的测试套件（单元测试 + 集成测试 + E2E 测试）
- 新增迁移验证检查点（功能对等性、性能基线、代码质量）
- 建立迁移前后的功能对照表和回归测试矩阵

## Impact
- Affected specs: agentpit-platform-development（源）、agentpit-vue3-deployment（目标）
- Affected code: 整个 `apps/AgentPit/src/` 目录重构
- Affected testing: 新增 Vitest + Vue Test Utils + Playwright 测试体系
- Affected deployment: 此规范完成后才可触发 vue3-deployment 的 Phase 4-7

---

## ADDED Requirements

### Requirement 1: Vue3 项目初始化与依赖迁移

系统 SHALL 创建基于 Vue 3.4+ 的全新项目脚手架，同时保留原 React 项目的所有业务数据结构和 Mock 数据。

#### 详细步骤：
1. 备份现有 React 项目：`cp -r src/ src-react-backup-YYYYMMDD/`
2. 使用 Vite 初始化 Vue3 项目：`npm create vite@latest . -- --template vue-ts`
3. 安装核心依赖：
   ```bash
   # Vue 核心生态
   npm install vue@^3.4.0 vue-router@4 pinia @vueuse/core
   
   # UI 和样式（保留原有选择）
   npm install tailwindcss @tailwindcss/vite postcss autoprefixer
   
   # 图表库（从 recharts 迁移到 ECharts 或保持 recharts）
   npm install echarts vue-echarts   # 或 npm install recharts
   
   # 工具库
   npm install dayjs lodash-es clsx
   ```
4. 配置 TypeScript 严格模式（strict: true）
5. 配置路径别名 `@/` → `./src`

#### Scenario: 成功案例
- **WHEN** 执行 `npm run dev`
- **THEN** Vue3 开发服务器成功启动（默认端口 5173）
- **AND** 控制台无 TypeScript 编译错误
- **AND** 浏览器显示空白 Vue 应用页面（准备接收组件）

### Requirement 2: 核心框架层迁移（Router + Store + Layout）

系统 SHALL 将 React 的核心基础设施完全迁移至 Vue3 对等物，确保路由、状态管理和布局系统的功能对等性。

#### 2.1 路由系统迁移（React Router → Vue Router）

| React (v7) | Vue3 (v4) | 迁移要点 |
|------------|-----------|---------|
| `<BrowserRouter>` | `createRouter()` | 单例模式 |
| `<Routes>/<Route>` | `routes: []` 配置数组 | 声明式配置 |
| `<Link to="/path">` | `<RouterLink to="/path">` | 组件 API 相似 |
| `useNavigate()` | `useRouter().push()` | Hook 用法调整 |
| `<Outlet />` | `<RouterView />` | 嵌套路由出口 |
| `useParams()` | `useRoute().params` | 参数获取方式变化 |
| `<Navigate>` | `router.replace()` | 编程式导航 |

**迁移验证清单**：
- [ ] 所有 11 个页面路由定义正确（/, /monetization, /sphinx, /chat, /social, /marketplace, /collaboration, /memory, /customize, /lifestyle, /settings）
- [ ] 路由懒加载生效（动态 import）
- [ ] 404 错误页面正常工作
- [ ] 路由守卫（如需）正确拦截

#### 2.2 状态管理迁移（Zustand → Pinia）

| Zustand (React) | Pinia (Vue3) | 迁移要点 |
|----------------|--------------|---------|
| `create()` 定义 store | `defineStore()` 定义 store | 函数签名不同 |
| `useStore()` hook | `useXxxStore()` composable | 调用方式类似 |
| 直接修改 state | 通过 actions 修改 | 更严格的约束 |
| 中间件（persist） | 插件（pinia-plugin-persistedstate）| 持久化方案 |

**需迁移的 Store**：
```typescript
// React/Zustand → Vue3/Pinia 示例
interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

// Before (Zustand)
const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

// After (Pinia)
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarOpen: true,
    theme: 'light',
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
  },
})
```

**迁移验证清单**：
- [ ] useAppStore 在 Vue 组件中正常工作
- [ ] 状态持久化插件配置正确（localStorage）
- [ ] DevTools 可查看 store 状态（Vue DevTools）

#### 2.3 布局组件迁移（JSX → SFC）

| React Component | Vue3 SFC | 迁移要点 |
|---------------|----------|---------|
| `Header.tsx` (函数组件) | `Header.vue` (`<script setup>`) | Props 改为 defineProps() |
| `Sidebar.tsx` | `Sidebar.vue` | State 改为 ref/reactive |
| `Footer.tsx` | `Footer.vue` | JSX → Template 语法 |
| `MainLayout.tsx` (children) | `MainLayout.vue` (<slot>) | Children → Slot |

**布局组件验证**：
- [ ] Header 导航栏渲染正确，响应式菜单可用
- [ ] Sidebar 侧边栏展开/收起正常
- [ ] Footer 底部信息显示完整
- [ ] MainLayout 正确包裹 <RouterView />

### Requirement 3: 首页模块迁移验证（HomePage + ModuleCard）

系统 SHALL 将已实现的首页功能（六边形模块布局）完整迁移至 Vue3，并验证视觉效果和交互行为与原 React 版本一致。

#### 迁移重点：
- **ModuleCard.tsx → ModuleCard.vue**
  - Props 接口转换
  - useState 动画控制 → ref + onMounted
  - useEffect 清理 → onUnmounted
  - JSX 渐变/圆角类名 → 保持 Tailwind 类名不变
  
- **HomePage.tsx → HomePage.vue**
  - 组件导入路径更新
  - 路由跳转：useNavigate() → useRouter().push()
  - 动画效果：CSS Transition 或 <TransitionGroup>

#### 功能验证清单：
- [ ] 页面标题："利用该智能体，借助Sphinx构建一个可以自动变现的网站"
- [ ] 副标题："打造您的自动赚钱平台 ✨"
- [ ] 9 个核心功能模块卡片全部显示（自动变现、Sphinx构建、智能体交互等）
- [ ] 4 个额外功能卡片显示（约友、开会、旅游、游戏）
- [ ] 卡片悬停动画效果（放大、阴影、位移）
- [ ] 入场动画（staggered reveal，延迟显示）
- [ ] 点击卡片正确跳转到对应路由
- [ ] 响应式网格布局（桌面4列、平板3列、手机2列）
- [ ] 渐变背景和视觉风格与设计图一致

### Requirement 4: 全量功能模块迁移（Task 3-12）

系统 SHALL 将 `agentpit-platform-development` 中规划的所有功能模块（Task 3-12）直接在 Vue3 架构下实现（而非先在 React 实现再迁移），确保代码一次性符合 Vue3 最佳实践。

#### 功能模块清单及迁移优先级：

| Task | 模块名称 | Vue3 组件目录 | 核心功能点 | 优先级 |
|------|---------|-------------|-----------|--------|
| Task 3 | 自动变现 | components/monetization/ | WalletCard, RevenueChart, TransactionHistory, WithdrawModal, FinancialReport | P0 |
| Task 4 | Sphinx建站 | components/sphinx/ | SiteWizard, TemplateGallery, AISiteBuilder, SitePreview, PublishPanel | P0 |
| Task 5 | 智能体对话 | components/chat/ | ChatInterface, MessageList, MessageInput, QuickCommands, ChatSidebar | P0 |
| Task 6 | 社交连接 | components/social/ | UserProfileCard, DatingMatch, MeetingRoom, SocialFeed, FriendsSystem | P1 |
| Task 7 | 交易市场 | components/marketplace/ | ProductGrid, ProductDetail, SearchFilter, ShoppingCart, OrderManagement | P1 |
| Task 8 | 多智能体协作 | components/collaboration/ | AgentWorkspace, AgentSelector, TaskDistributor, CollaborationResult | P1 |
| Task 9 | 存储记忆 | components/memory/ | FileManager, KnowledgeGraph, MemorySearch, BackupSettings | P2 |
| Task 10 | 定制智能体 | components/customize/ | AgentCreatorWizard, AbilityConfigurator, BusinessModelSetup | P2 |
| Task 11 | 生活服务 | components/lifestyle/ | MeetingCalendar, TravelPlanner, GameCenter | P2 |
| Task 12 | 系统设置 | components/settings/ | UserProfileSettings, ThemePreferences, NotificationSettings | P2 |

#### 迁移原则：
1. **P0 模块（Task 3-5）**：必须在迁移第一阶段完成并进行全量测试
2. **P1 模块（Task 6-8）**：在第二阶段完成，进行核心流程测试
3. **P2 模块（Task 9-12）**：在第三阶段完成，进行 smoke test
4. 所有模块使用 Composition API (`<script setup lang="ts">`)
5. 复用 Mock 数据文件（从原项目的 data/ 目录复制并适配类型）

### Requirement 5: 单元测试覆盖（Vitest + Vue Test Utils）

系统 SHALL 为所有 Vue3 组件和 Composables 编写单元测试，**核心组件覆盖率 ≥ 80%，工具函数覆盖率 ≥ 90%**。

#### 测试技术栈：
```bash
npm install -D vitest @vue/test-utils jsdom @testing-library/vue
```

#### 测试分类和要求：

| 测试类别 | 覆盖目标 | 工具 | 覆盖率要求 |
|---------|---------|------|-----------|
| **组件渲染测试** | 所有 .vue 组件 | @vue/test-utils | 100%（至少挂载成功） |
| **Props/Events 测试** | 可复用组件 | VTU + expect | ≥ 80% |
| **Composables 测试** | useXxx 函数 | vitest | ≥ 90% |
| **Store 测试** | Pinia stores | vitest | ≥ 85% |
| **工具函数测试** | utils/ 目录 | vitest | ≥ 95% |
| **Router 测试** | 路由配置 | vitest + vue-router-mock | 100% |

#### 必须包含的测试用例示例（以 Header.vue 为例）：

```typescript
// __tests__/components/layout/Header.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Header from '@/components/layout/Header.vue'

describe('Header.vue', () => {
  it('should render navigation links correctly', () => {
    const wrapper = mount(Header)
    const navLinks = wrapper.findAllComponents({ name: 'RouterLink' })
    expect(navLinks).toHaveLength(11) // 11 个页面路由
  })
  
  it('should toggle mobile menu on button click', async () => {
    const wrapper = mount(Header)
    const menuButton = wrapper.find('[data-testid="mobile-menu-btn"]')
    await menuButton.trigger('click')
    expect(wrapper.emitted()['toggle-mobile-menu']).toBeTruthy()
  })
  
  it('should display user avatar when logged in', () => {
    const wrapper = mount(Header, {
      props: { isLoggedIn: true, userAvatar: '/avatar.png' }
    })
    expect(wrapper.find('img[alt="user-avatar"]').exists()).toBe(true)
  })
})
```

#### 测试命令：
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

### Requirement 6: 集成测试（模块间交互验证）

系统 SHALL 编写集成测试，验证跨模块的数据流、事件传递和状态同步是否正常工作。

#### 集成测试场景：

| 场景 | 涉及模块 | 验证内容 |
|------|---------|---------|
| **路由导航集成** | Router + Views + Layout | 点击导航链接后页面切换、URL更新、布局刷新 |
| **状态管理集成** | Pinia Store + 多组件 | 侧边栏状态变更影响多个组件显示 |
| **对话流集成** | ChatInterface + MessageList + Store | 发送消息→更新列表→触发AI响应→流式输出 |
| **购物车集成** | ProductGrid + ShoppingCart + Store | 添加商品→更新数量→计算总价→结算 |
| **主题切换集成** | ThemePreferences + 全局组件 | 切换主题→所有组件样式实时更新 |

#### 集成测试示例（路由导航）：

```typescript
// __tests__/integration/router-navigation.test.ts
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import MainLayout from '@/components/layout/MainLayout.vue'

describe('Router Navigation Integration', () => {
  it('should navigate to MonetizationPage when clicking monetization card', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    })
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
      },
    })
    
    await router.push('/')
    await router.isReady()
    
    // 找到自动变现卡片并点击
    const monetizationCard = wrapper.find('[data-testid="card-monetization"]')
    await monetizationCard.trigger('click')
    
    // 验证路由跳转
    expect(router.currentRoute.value.path).toBe('/monetization')
  })
})
```

### Requirement 7: E2E 端到端测试（Playwright）

系统 SHALL 使用 Playwright 编写端到端测试，模拟真实用户操作流程，验证整个应用的完整性和稳定性。

#### 安装配置：
```bash
npm install -D @playwright/test
npx playwright install chromium
```

#### E2E 测试场景（关键用户旅程）：

| # | 用户旅程 | 步骤数 | 验证目标 | 优先级 |
|---|---------|-------|---------|--------|
| E2E-1 | **首页浏览与导航** | 5 | 打开首页→查看模块卡片→点击进入子页面→返回首页 | P0 |
| E2E-2 | **智能体对话完整流程** | 8 | 进入对话页→输入问题→等待响应→查看流式输出→发送新消息→查看上下文 | P0 |
| E2E-3 | **自动变现钱包操作** | 6 | 进入变现页→查看余额→点击提现→填写表单→提交→查看成功提示 | P0 |
| E2E-4 | **交易市场购物流程** | 10 | 浏览商品→搜索过滤→加入购物车→修改数量→去结算→填写信息→提交订单 | P1 |
| E2E-5 | **社交连接互动** | 7 | 进入社交页→查看推荐用户→点击关注→查看动态→发布评论 | P1 |
| E2E-6 | **主题切换全局生效** | 4 | 进入设置页→切换深色模式→返回首页→验证所有页面样式变化 | P1 |
| E2E-7 | **响应式布局验证** | 3 | 桌面视图→平板视图→手机视图→验证布局自适应 | P2 |

#### E2E 测试示例（智能体对话）：

```typescript
// e2e/chat-conversation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Chat Conversation Flow', () => {
  test('complete chat interaction with streaming response', async ({ page }) => {
    // 1. 导航到对话页面
    await page.goto('/chat')
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible()
    
    // 2. 输入消息
    const input = page.locator('[data-testid="message-input"]')
    await input.fill('你好，请介绍一下你自己')
    
    // 3. 点击发送
    const sendBtn = page.locator('[data-testid="send-button"]')
    await sendBtn.click()
    
    // 4. 验证用户消息显示
    await expect(page.locator('[data-testid="user-message"]').first()).toContainText('你好')
    
    // 5. 等待 AI 响应（流式输出）
    const aiResponse = page.locator('[data-testid="ai-message"]')
    await expect(aiResponse).toBeVisible({ timeout: 5000 })
    
    // 6. 验证响应内容非空
    const responseText = await aiResponse.textContent()
    expect(responseText?.length).toBeGreaterThan(10)
    
    // 7. 发送第二条消息（测试上下文）
    await input.fill('刚才你说的第三点是什么？')
    await sendBtn.click()
    
    // 8. 验证上下文保持
    const messages = page.locator('[data-testid="message-bubble"]')
    await expect(messages).toHaveCount(4) // 2个用户 + 2个AI
  })
})
```

#### E2E 测试执行环境：
- **浏览器**: Chromium（CI 环境）/ Chrome + Firefox + Safari（本地）
- **视口尺寸**: Desktop (1280x720), Tablet (768x1024), Mobile (375x667)
- **超时设置**: action timeout = 5s, navigation timeout = 10s
- **截图失败**: 失败时自动截图存档

### Requirement 8: 迁移回归测试矩阵（功能对等性验证）

系统 SHALL 建立完整的回归测试矩阵，逐一对比 React 版本和 Vue3 版本的功能表现，确保无功能缺失或行为偏差。

#### 回归测试矩阵模板：

| 功能点 | React 版本行为 | Vue3 版本行为 | 一致性 | 备注 |
|-------|--------------|--------------|--------|------|
| 首页加载时间 | < 2s | < 2s | ⏳ 待测 | 性能基线对比 |
| 模块卡片悬停 | 放大105%, 上移8px | 同左 | ⏳ 待测 | CSS 动画一致性 |
| 路由跳转 | push('/path') | router.push('/path') | ⏳ 待测 | URL 变化一致 |
| 状态持久化 | localStorage | localStorage | ⏳ 待测 | 数据格式兼容 |
| 表单验证 | 错误提示 | 错误提示 | ⏳ 待测 | 校验规则一致 |
| 图表渲染 | recharts | echarts/vue-echarts | ⏳ 待测 | 视觉效果近似 |
| ... | ... | ... | ... | ... |

#### 回归测试通过标准：
- ✅ **Pass**: 行为完全一致或可接受的微小差异（如动画时长±100ms）
- ⚠️ **Acceptable**: 存在差异但不影响用户体验（如字体渲染细微差别）
- ❌ **Fail**: 功能缺失、行为异常或严重体验降级（需立即修复）

### Requirement 9: 性能基准测试（Lighthouse CI）

系统 SHALL 在迁移前后分别运行 Lighthouse 性能审计，确保 Vue3 版本满足以下性能指标：

| 指标 | React 基线（如有） | Vue3 目标 | 测量方法 |
|------|------------------|-----------|---------|
| **FCP (First Contentful Paint)** | ≤ 2.5s | **≤ 3.0s** | Lighthouse |
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | **≤ 2.5s** | Lighthouse |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | **≤ 0.1** | Lighthouse |
| **TBT (Total Blocking Time)** | ≤ 200ms | **≤ 300ms** | Lighthouse |
| **TTFB (Time to First Byte)** | ≤ 600ms | **≤ 800ms** | Lighthouse |
| **JS Bundle Size (gzip)** | - | **≤ 150KB/chunk** | bundle-analyzer |
| **首屏加载体积** | - | **≤ 200KB** | WebPageTest |

#### 性能测试脚本：
```bash
# 安装 Lighthouse CI
npm install -D @lhci/cli

# 运行性能审计
npx lighthouse http://localhost:5173 --output=lighthouse-report.html --preset=desktop
```

### Requirement 10: 代码质量门禁（ESLint + Prettier 零错误）

系统 SHALL 在迁移过程中严格执行代码质量标准，**确保 ESLint 错误数为 0，警告数为 0**，Prettier 格式化无 diff。

#### 质量门禁配置：

```javascript
// .eslintrc.cjs (Vue3 项目)
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'warn',
    'vue/no-unused-vars': 'error',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
```

#### 门禁命令：
```bash
# 运行 lint 检查（必须通过）
npm run lint       # 预期：0 errors, 0 warnings
npm run format:check  # 预期：No files need formatting

# 如果不通过，CI 应该阻断
# 在 package.json 中配置：
# "pretest": "npm run lint && npm run format:check"
```

## MODIFIED Requirements

### Requirement: 任务执行顺序调整

**原始顺序**（agentpit-vue3-deployment）：
```
Phase 1: Vue3 项目初始化
Phase 2: 核心框架迁移
Phase 3: 功能模块迁移 (Task 7-16)
Phase 4: Podman 容器化部署
...
```

**调整为**（新增前置迁移规范后）：
```
⭐ Pre-Phase 0: React → Vue3 前置迁移与全量测试（本规范）
  ├── Step 1: Vue3 项目初始化与依赖迁移
  ├── Step 2: 核心框架层迁移（Router + Store + Layout）
  ├── Step 3: 首页模块迁移验证
  ├── Step 4: 全量功能模块实现（Task 3-12）
  ├── Step 5: 单元测试（覆盖率 ≥ 80%）
  ├── Step 6: 集成测试（跨模块交互）
  ├── Step 7: E2E 测试（关键用户旅程）
  ├── Step 8: 回归测试矩阵（功能对等性）
  ├── Step 9: 性能基准测试（Lighthouse）
  └── Step 10: 代码质量门禁（零错误）
      ↓ (全部通过后)
Phase 1-7 of agentpit-vue3-deployment（容器化部署...）
```

**依赖关系**：
- `agentpit-vue3-migration`（本规范）是 `agentpit-vue3-deployment` 的**前置条件**
- 只有当本规范的 checklist.md 所有项通过后，才可触发 vue3-deployment 的 Phase 4-7

## REMOVED Requirements

无（本规范为纯增量需求，不涉及删除）

---

## 验收标准（Definition of Done）

### 迁移完成的标志：
1. ✅ 所有 `.tsx/.jsx` 文件已替换为 `.vue` 单文件组件
2. ✅ 无任何 React 相关依赖残留（package.json 中无 react/react-dom）
3. ✅ `npm run build` 成功，产物体积符合要求（JS chunk gzip ≤ 150KB）
4. ✅ `npm run lint` 结果：**0 errors, 0 warnings**
5. ✅ `npm run test:coverage` 显示：
   - 组件覆盖率 ≥ 80%
   - Store 覆盖率 ≥ 85%
   - 工具函数覆盖率 ≥ 95%
6. ✅ `npm run test:e2e`（Playwright）7 个关键场景全部通过
7. ✅ Lighthouse Performance Score ≥ 90（Performance 分类）
8. ✅ 回归测试矩阵中所有 P0 功能标记为 Pass 或 Acceptable
9. ✅ Git 提交记录遵循 Conventional Commits 规范
10. ✅ 迁移文档已生成（`.trae/docs/react-to-vue3-migration-report.md`）
