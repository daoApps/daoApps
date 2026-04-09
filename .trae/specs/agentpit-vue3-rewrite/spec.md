# AgentPit Vue3 全新重构与增强实现规范

## Why
基于已完成的 React 源码备份（`src-react-backup-20260410`），采用**全新实现的迁移策略**而非代码转换方式，使用 Vue 3.4+ 框架从零重构整个 AgentPit 平台。这种策略能够充分利用 Vue3 的 Composition API、响应式系统、更好的 TypeScript 支持等特性，同时确保核心业务逻辑与用户体验的一致性，并在此过程中完善和增强之前未完成的功能模块。

## What Changes
- **BREAKING**: 完全移除 React 依赖，建立基于 Vue 3.4+ 的全新项目架构
- **BREAKING**: 状态管理从 Zustand 迁移至 Pinia（更符合 Vue3 生态）
- **BREAKING**: 路由系统从 React Router v7 迁移至 Vue Router v4
- 采用 Vue3 最佳实践重构所有组件（Composition API + `<script setup>`）
- 建立完整的功能映射表（React 组件 ↔ Vue3 组件）
- 利用 Vue3 特性增强功能（Teleport、Suspense、自定义指令、响应式优化）
- 新增之前未完成的高级功能模块
- 建立三阶段验证体系（单元测试 + 集成测试 + E2E 测试）
- **NEW**: Podman 容器化部署（多阶段构建，镜像≤500MB，健康检查）
- **NEW**: 统一日志系统（JSON Lines格式，30天自动归档）
- **NEW**: DeepResearch + Flexloop 工具集成（调用前验证，超时控制）
- **NEW**: 项目执行规范（错误处理流程、阶段复盘机制）

## Impact
- Affected specs: `agentpit-platform-development`（基准规格）、`agentpit-vue3-migration`（旧迁移方案，将被本规范替代）、`agentpit-vue3-deployment`（后续部署阶段）
- Affected code: `apps/AgentPit/src/` 目录完全重构为 Vue3 架构
- Reference code: `apps/AgentPit/src-react-backup-20260410/` 作为功能对照基准
- Testing: 建立 Vitest + Vue Test Utils + Playwright 全量测试体系
- Deployment: 新增 Podman 容器化配置与容器编排方案
- Tooling: 新增 DeepResearch + Flexloop 工具集成与统一日志系统
- Process: 新增错误处理流程、阶段复盘机制与交接文档规范

---

## ADDED Requirements

### Requirement 1: Vue3 项目初始化与架构设计

系统 SHALL 创建基于 Vue 3.4+ Composition API 的现代化项目架构，遵循 Vue3 官方最佳实践和社区标准。

#### 详细步骤：
1. 使用 Vite 初始化 Vue3 + TypeScript 项目模板
2. 安装核心依赖生态：
   ```bash
   # Vue 核心与路由状态管理
   npm install vue@^3.4.0 vue-router@4 pinia pinia-plugin-persistedstate @vueuse/core

   # UI 与样式（Tailwind CSS v4）
   npm install tailwindcss @tailwindcss/vite postcss autoprefixer

   # 图表库（ECharts for Vue3）
   npm install echarts vue-echarts

   # 工具库
   npm install dayjs lodash-es clsx class-variance-authority
   ```
3. 配置 TypeScript 严格模式（strict: true, noUncheckedIndexedAccess: true）
4. 配置路径别名 `@/` → `./src`
5. 创建标准化目录结构：
   ```
   src/
   ├── components/          # 可复用组件
   │   ├── layout/          # 布局组件
   │   ├── home/            # 首页组件
   │   ├── monetization/    # 变现模块
   │   ├── sphinx/          # 建站模块
   │   ├── chat/            # 对话模块
   │   ├── social/          # 社交模块
   │   ├── marketplace/     # 交易市场
   │   ├── collaboration/   # 协作模块
   │   ├── memory/          # 记忆存储
   │   ├── customize/       # 定制智能体
   │   ├── lifestyle/       # 生活服务
   │   └── settings/        # 设置中心
   ├── views/               # 页面级组件
   ├── composables/         # 组合式函数（Vue3 特性）
   ├── stores/              # Pinia Store
   ├── router/              # 路由配置
   ├── utils/               # 工具函数
   ├── types/               # TypeScript 类型定义
   ├── data/                # Mock 数据
   ├── assets/              # 静态资源
   └── styles/              # 全局样式
   ```

#### Scenario: 成功案例
- **WHEN** 执行 `npm run dev`
- **THEN** Vue3 开发服务器成功启动在端口 5173
- **AND** 控制台无 TypeScript 编译错误
- **AND** 浏览器显示空白 Vue 应用页面（准备接收组件）

### Requirement 2: 功能映射表建立

系统 SHALL 建立完整的 React → Vue3 组件映射关系表，作为迁移过程中的功能对照基准。

#### 映射表结构：

| React 组件 (src-react-backup) | Vue3 组件 (新实现) | 功能描述 | 迁移优先级 | 增强点 |
|------------------------------|-------------------|---------|-----------|--------|
| `App.tsx` | `App.vue` | 应用根组件 | P0 | 使用 `<Suspense>` 处理异步组件 |
| `main.tsx` | `main.ts` | 应用入口 | P0 | 使用 `createApp()` API |
| `components/layout/Header.tsx` | `components/layout/Header.vue` | 导航栏 | P0 | 使用 Teleport 处理下拉菜单 |
| `components/layout/Sidebar.tsx` | `components/layout/Sidebar.vue` | 侧边栏 | P0 | 使用 `<Transition>` 动画 |
| `components/layout/Footer.tsx` | `components/layout/Footer.vue` | 页脚 | P1 | - |
| `components/layout/MainLayout.tsx` | `components/layout/MainLayout.vue` | 主布局 | P0 | 使用插槽（Slots）增强灵活性 |
| `pages/HomePage.tsx` | `views/HomePage.vue` | 首页 | P0 | 使用 CSS Grid 替代 Flex 提升布局能力 |
| `components/home/ModuleCard.tsx` | `components/home/ModuleCard.vue` | 六边形卡片 | P0 | 使用 Vue3 `<TransitionGroup>` 实现动画 |
| `components/monetization/WalletCard.tsx` | `components/monetization/WalletCard.vue` | 钱包卡片 | P0 | - |
| `components/monetization/RevenueChart.tsx` | `components/monetization/RevenueChart.vue` | 收益图表 | P0 | 使用 vue-echarts 重构 |
| ... | ... | ... | ... | ... |

#### 映射表维护规则：
- 每完成一个组件迁移，更新映射表状态为 ✅ 已完成
- 记录每个组件的增强点和改进说明
- 标注与原 React 版本的差异及原因

### Requirement 3: 核心框架层实现（Router + Store + Layout）

系统 SHALL 实现基于 Vue3 生态的核心基础设施层。

#### 3.1 路由系统（Vue Router v4）

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '首页 - AgentPit' }
  },
  {
    path: '/monetization',
    component: () => import('@/views/MonetizationPage.vue'),
    meta: { title: '自动变现 - AgentPit' }
  },
  // ... 其他 9 个路由
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 - 页面未找到' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})
```

**路由特性要求**：
- 所有页面组件必须懒加载（动态 import）
- 实现路由守卫（导航钩子）处理权限和元数据
- 支持 HTML5 History 模式
- 配置滚动行为（页面切换时回到顶部）

#### 3.2 状态管理（Pinia Stores）

```typescript
// stores/useAppStore.ts
import { defineStore } from 'pinia'

interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  isLoading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarOpen: true,
    theme: 'dark',
    isLoading: false
  }),

  getters: {
    isDarkTheme: (state) => state.theme === 'dark'
  },

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
    },
    setLoading(loading: boolean) {
      this.isLoading = loading
    }
  },

  persist: {
    key: 'agentpit-app-store',
    storage: localStorage,
    pick: ['sidebarOpen', 'theme']
  }
})
```

**Store 设计原则**：
- 使用 Options API 风格（更清晰的类型推断）
- 配置持久化插件（localStorage）
- 明确区分 state/getters/actions
- 每个 Store 单一职责

#### 3.3 布局组件系统

**Header.vue 关键实现要点**：
```vue
<template>
  <header class="header">
    <nav class="nav-container">
      <div class="logo">AgentPit</div>

      <!-- 使用 v-model 双向绑定 -->
      <button @click="toggleSidebar" class="menu-toggle">
        <MenuIcon />
      </button>

      <!-- 响应式导航菜单 -->
      <Transition name="slide">
        <nav v-show="isMobileMenuOpen" class="mobile-menu">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path">
            {{ item.label }}
          </router-link>
        </nav>
      </Transition>

      <!-- 用户信息区域 -->
      <div class="user-section">
        <span>{{ userStore.username }}</span>
        <Avatar :src="userStore.avatar" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useUserStore } from '@/stores/useUserStore'

const appStore = useAppStore()
const userStore = useUserStore()
const isMobileMenuOpen = ref(false)

const toggleSidebar = () => appStore.toggleSidebar()
</script>
```

**Vue3 特性应用清单**：
- ✅ `<script setup lang="ts">` - 更简洁的组合式 API
- ✅ `ref()` / `reactive()` / `computed()` - 响应式系统
- ✅ `<Transition>` / `<TransitionGroup>` - 内置动画
- ✅ `v-model` - 双向数据绑定
- ✅ `<Teleport>` - 传送门（用于 Modal、Dropdown）
- ✅ `<Suspense>` - 异步组件加载
- ✅ 自定义指令（v-focus、v-permission 等）

### Requirement 4: 首页模块重构（HomePage + ModuleCard）

系统 SHALL 重新实现首页模块，充分利用 Vue3 的响应式系统和动画能力。

#### ModuleCard.vue 增强实现：

```vue
<template>
  <!-- 使用 CSS clip-path 实现六边形 -->
  <div
    class="module-card hexagon"
    :class="{ 'card-hover': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="navigateToModule"
  >
    <div class="card-content">
      <component :is="iconComponent" class="card-icon" />
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
    </div>

    <!-- 悬停时的渐变遮罩效果 -->
    <Transition name="fade">
      <div v-if="isHovered" class="hover-overlay">
        <span class="action-text">点击进入 →</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  title: string
  description: string
  icon: string
  routePath: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#6366f1'
})

const router = useRouter()
const isHovered = ref(false)

// 动态导入图标组件（利用 Vue3 异步组件 + Suspense）
const iconComponent = defineAsyncComponent(() =>
  import(`@/icons/${props.icon}.vue`)
)

const navigateToModule = () => {
  router.push(props.routePath)
}
</script>

<style scoped>
.module-card {
  /* CSS 变量支持主题切换 */
  --card-color: v-bind('props.color');
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 使用 v-bind() 在 CSS 中使用 JavaScript 变量 */
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.card-hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}
</style>
```

**Vue3 增强点**：
1. **`v-bind()` in CSS** - 在样式中直接使用组件 props（Vue3 独有特性）
2. **`defineAsyncComponent()`** - 图标按需加载，减小初始包体积
3. **`<Transition>` 内置组件** - 无需第三方动画库
4. **`withDefaults()` + `defineProps()`** - 更好的 Props 类型推导
5. **响应式悬停效果** - 使用 `ref()` 管理交互状态

#### HomePage.vue 动画系统：

```vue
<template>
  <div class="home-page">
    <section class="hero-section">
      <h1 class="hero-title">
        <TransitionGroup name="stagger">
          <span
            v-for="(char, index) in titleChars"
            :key="index"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            {{ char }}
          </span>
        </TransitionGroup>
      </h1>
      <p class="hero-subtitle">{{ subtitle }}</p>
    </section>

    <!-- 卡片网格 - 使用 TransitionGroup 实现交错入场动画 -->
    <section class="modules-grid">
      <TransitionGroup name="card-list">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          v-bind="module"
        />
      </TransitionGroup>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import ModuleCard from '@/components/home/ModuleCard.vue'
import { modulesData } from '@/data/mockHome'

const appStore = useAppStore()
const modules = ref(modulesData)

// 将标题拆分为字符数组用于交错动画
const titleChars = computed(() => 'AgentPit 智能体平台'.split(''))

onMounted(() => {
  // 页面加载完成后触发入场动画
  appStore.setLoading(false)
})
</script>
```

### Requirement 5: P0 核心业务模块重构（Monetization + Sphinx + Chat）

系统 SHALL 优先重构三个最高优先级的业务模块，并在重构过程中增强功能。

#### 5.1 自动变现系统（Monetization）增强

**新增功能**（React 版本未实现）：
- 💰 **实时收益仪表盘**：使用 WebSocket 模拟实时数据更新
- 📊 **智能财务分析**：基于历史数据的 AI 趋势预测
- 🔔 **收益预警通知**：当收益异常时自动提醒
- 📱 **多币种支持**：USD/CNY/EUR 自动转换

**WalletCard.vue 核心逻辑**：
```vue
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMonetizationStore } from '@/stores/useMonetizationStore'

const store = useMonetizationStore()
let websocket: WebSocket | null = null

// 响应式余额（实时更新）
const balance = computed(() => store.balance)
const todayEarnings = computed(() => store.todayEarnings)

// 模拟 WebSocket 实时数据推送
onMounted(() => {
  websocket = new WebSocket('wss://api.agentpit.com/realtime')
  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    store.updateRealtimeBalance(data.balance)
  }
})

onUnmounted(() => {
  websocket?.close()
})
</script>
```

#### 5.2 Sphinx 快速建站系统增强

**新增功能**：
- 🤖 **AI 代码生成**：集成 OpenAI API 自动生成网站代码
- 🎨 **可视化拖拽编辑器**：所见即所得的页面构建
- 📱 **响应式预览**：实时预览移动端/平板/桌面端效果
- 🚀 **一键部署**：集成 Vercel/Netlify 自动部署

**AISiteBuilder.vue AI 对话界面**：
```vue
<template>
  <div class="ai-builder">
    <div class="chat-messages">
      <MessageBubble
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
        :is-typing="msg.isTyping"
      >
        <!-- 使用 v-html 渲染 Markdown（需要 sanitize） -->
        <div v-if="msg.role === 'assistant'" v-html="renderMarkdown(msg.content)" />
      </MessageBubble>
    </div>

    <MessageInput
      v-model="inputText"
      placeholder="描述你想要创建的网站..."
      @send="sendMessage"
      :loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAIStore } from '@/stores/useAIStore'
import MessageBubble from '@/components/chat/MessageBubble.vue'
import MessageInput from '@/components/chat/MessageInput.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const aiStore = useAIStore()
const inputText = ref('')
const isLoading = ref(false)

const messages = computed(() => aiStore.messages)

const renderMarkdown = (content: string) => {
  return DOMPurify.sanitize(marked(content))
}

const sendMessage = async () => {
  if (!inputText.value.trim()) return

  isLoading.value = true
  await aiStore.sendAIMessage(inputText.value)
  inputText.value = ''
  isLoading.value = false
}
</script>
```

#### 5.3 智能体对话系统（Chat）增强

**新增功能**：
- ⚡ **流式输出（SSE）**：使用 Server-Sent Events 实现 AI 打字机效果
- 💬 **多轮对话上下文**：保持 10 轮对话历史
- 🎯 **快捷指令面板**：预设常用问题快速发送
- 📎 **多媒体消息**：支持图片、文件、代码块
- 🌐 **多语言支持**：中英文自动检测与翻译

**useTypewriter.ts 组合式函数（Composable）**：
```typescript
// composables/useTypewriter.ts
import { ref, watch } from 'vue'

export function useTypewriter(initialText = '') {
  const displayedText = ref('')
  const isTyping = ref(false)
  let currentIndex = 0
  let intervalId: ReturnType<typeof setInterval> | null = null

  const startTyping = (fullText: string, speed = 30) => {
    displayedText.value = ''
    currentIndex = 0
    isTyping.value = true

    intervalId = setInterval(() => {
      if (currentIndex < fullText.length) {
        displayedText.value += fullText[currentIndex]
        currentIndex++
      } else {
        stopTyping()
      }
    }, speed)
  }

  const stopTyping = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isTyping.value = false
  }

  // 监听文本变化，自动开始打字效果
  watch(initialText, (newText) => {
    if (newText) {
      startTyping(newText)
    }
  })

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopTyping()
  })

  return {
    displayedText,
    isTyping,
    startTyping,
    stopTyping
  }
}
```

### Requirement 6: P1/P2 功能模块实现与增强

系统 SHALL 实现剩余的业务模块，并针对每个模块进行 Vue3 特性的深度应用。

#### 6.1 社交连接系统（Social）[P1]

**模块组成**：
- UserProfileCard.vue - 用户资料卡（使用 `<Teleport>` 显示浮层）
- DatingMatch.vue - Tinder 式滑动匹配（使用 `<TransitionGroup>` 实现卡片堆叠动画）
- MeetingRoom.vue - 视频会议房间（WebRTC 集成）
- SocialFeed.vue - 社交信息流（虚拟滚动优化性能）
- FriendsSystem.vue - 好友管理系统
- NotificationPanel.vue - 通知面板（使用 `provide/inject` 跨组件通信）

**Vue3 特性应用**：
```vue
<!-- DatingMatch.vue - 卡片堆叠动画 -->
<template>
  <div class="dating-match">
    <TransitionGroup name="card-stack">
      <div
        v-for="user in visibleUsers"
        :key="user.id"
        class="match-card"
        :style="{ zIndex: users.indexOf(user) }"
      >
        <img :src="user.avatar" :alt="user.name" />
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.bio }}</p>
        </div>
        <div class="actions">
          <button @click="dislike(user)">❌</button>
          <button @click="like(user)">💚</button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
```

#### 6.2 交易市场（Marketplace）[P1]

**模块组成**：
- ProductGrid.vue - 商品网格（虚拟滚动 + 懒加载图片）
- ProductDetail.vue - 商品详情（图片画廊、评价列表）
- SearchFilter.vue - 搜索筛选（防抖输入、多条件组合）
- ShoppingCart.vue - 购物车（Pinia Store 持久化）
- OrderManagement.vue - 订单管理（分页、状态筛选）
- ReviewSystem.vue - 评价系统（星级评分组件）
- SellerCenter.vue - 卖家中心（数据统计图表）

**搜索防抖 Composable**：
```typescript
// composables/useDebounce.ts
import { ref, watch } from 'vue'

export function useDebounce<T>(value: T, delay = 300) {
  const debouncedValue = ref(value)
  let timeoutId: ReturnType<typeof setTimeout>

  watch(
    () => value,
    (newValue) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    }
  )

  return debouncedValue
}
```

#### 6.3 多智能体协作系统（Collaboration）[P1]

**模块组成**：
- AgentWorkspace.vue - 协作工作台主界面
- AgentSelector.vue - 智能体选择器（拖拽排序）
- AgentConfigPanel.vue - 配置面板（动态表单）
- TaskDistributor.vue - 任务分配器（看板视图）
- CommunicationPanel.vue - 通信面板（WebSocket 实时消息）
- CollaborationResult.vue - 结果展示（Markdown 渲染）
- AgentStatusCard.vue - 状态卡片（实时状态指示器）

#### 6.4 存储记忆系统（Memory）[P2]

**模块组成**：
- FileManager.vue - 文件管理器（树形结构、拖拽上传）
- KnowledgeGraph.vue - 知识图谱（D3.js/SVG 力导向图）
- MemorySearch.vue - 记忆搜索（全文检索高亮）
- MemoryTimeline.vue - 时间线视图（垂直时间轴）
- BackupSettings.vue - 备份设置（增量备份策略）
- StorageQuota.vue - 存储配额（环形进度条）

**知识图谱增强**：
```vue
<!-- KnowledgeGraph.vue - 使用 D3.js 渲染力导向图 -->
<template>
  <div class="knowledge-graph" ref="graphContainer">
    <svg :width="width" :height="height">
      <!-- 使用 v-for 渲染节点和边 -->
      <g v-for="link in links" :key="link.id" class="link">
        <line
          :x1="link.source.x"
          :y1="link.source.y"
          :x2="link.target.x"
          :y2="link.target.y"
        />
      </g>

      <g v-for="node in nodes" :key="node.id" class="node" :transform="`translate(${node.x}, ${node.y})`">
        <circle :r="node.radius" :fill="node.color" />
        <text dy=".35em" text-anchor="middle">{{ node.label }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

const graphContainer = ref<HTMLElement>()
const width = ref(800)
const height = ref(600)

const nodes = ref([])
const links = ref([])

onMounted(() => {
  // D3 力导向图模拟
  const simulation = d3.forceSimulation(nodes.value)
    .force('link', d3.forceLink(links.value).id((d: any) => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width.value / 2, height.value / 2))

  simulation.on('tick', () => {
    // 更新节点位置（触发 Vue 响应式更新）
    nodes.value = [...nodes.value]
  })
})
</script>
```

#### 6.5 定制化智能体（Customize）[P2]

**模块组成**：
- AgentCreatorWizard.vue - 5步向导流程（步骤条组件）
- BasicInfoForm.vue - 基本信息（表单验证）
- AppearanceCustomizer.vue - 外观定制（颜色选择器、头像上传）
- AbilityConfigurator.vue - 能力配置（技能树可视化）
- BusinessModelSetup.vue - 商业模式（定价策略配置）
- AgentPreview.vue - 实时预览（iframe 沙箱）
- MyAgentsList.vue - 我的智能体列表（CRUD 操作）
- AgentAnalytics.vue - 数据分析（ECharts 报表）

**表单验证增强（Vue3 + VeeValidate）**：
```vue
<!-- BasicInfoForm.vue -->
<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <Field name="name" v-slot="{ field, errors }">
      <input v-bind="field" placeholder="智能体名称" />
      <span class="error">{{ errors[0] }}</span>
    </Field>

    <Field name="description" v-slot="{ field, errors }" as="textarea">
      <textarea v-bind="field" placeholder="描述你的智能体..." />
      <span class="error">{{ errors[0] }}</span>
    </Field>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? '保存中...' : '下一步' }}
    </button>
  </Form>
</template>

<script setup lang="ts">
import { useForm, Field, Form } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('名称不能为空').min(2, '至少2个字符').max(20, '最多20个字符'),
  description: yup.string().required('描述不能为空').max(200, '最多200个字符')
})

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values) => {
  await saveAgentBasicInfo(values)
})
</script>
```

#### 6.6 生活服务与设置（Lifestyle & Settings）[P2]

**生活服务模块**：
- MeetingCalendar.vue - 会议日历（FullCalendar 集成）
- TravelPlanner.vue - 旅游规划（地图标记、行程安排）
- GameCenter.vue - 游戏中心（3 个内置小游戏：贪吃蛇、俄罗斯方块、2048）
- LifestyleDashboard.vue - 生活服务总览

**设置模块**：
- UserProfileSettings.vue - 个人资料设置
- ThemePreferences.vue - 主题偏好（暗色/亮色/跟随系统）
- NotificationSettings.vue - 通知设置
- PrivacySecurity.vue - 隐私安全（双因素认证）
- HelpCenter.vue - 帮助中心（FAQ 折叠面板、在线客服入口）

**主题切换增强**：
```typescript
// composables/useTheme.ts
import { ref, watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

export function useTheme() {
  const appStore = useAppStore()

  const toggleTheme = () => {
    const newTheme = appStore.theme === 'light' ? 'dark' : 'light'
    appStore.setTheme(newTheme)
  }

  // 监听系统主题变化
  watch(
    () => appStore.theme,
    (theme) => {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    },
    { immediate: true }
  )

  // 初始化时检查系统偏好
  onMounted(() => {
    if (!appStore.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      appStore.setTheme(prefersDark ? 'dark' : 'light')
    }
  })

  return {
    theme: computed(() => appStore.theme),
    toggleTheme,
    isDark: computed(() => appStore.theme === 'dark')
  }
}
```

### Requirement 7: 三阶段测试体系建立

系统 SHALL 建立完整的单元测试、集成测试和 E2E 测试体系，确保迁移质量。

#### 7.1 单元测试（Vitest + Vue Test Utils）

**覆盖率目标**：
- 组件（Components）：≥ 80%
- 状态管理（Stores）：≥ 85%
- 工具函数（Utils）：≥ 95%
- 组合式函数（Composables）：≥ 90%

**示例测试文件**：
```typescript
// __tests__/components/home/ModuleCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModuleCard from '@/components/home/ModuleCard.vue'

describe('ModuleCard.vue', () => {
  it('should render props correctly', () => {
    const wrapper = mount(ModuleCard, {
      props: {
        title: '自动变现',
        description: '全自动收益管理',
        icon: 'wallet',
        routePath: '/monetization'
      }
    })

    expect(wrapper.text()).toContain('自动变现')
    expect(wrapper.text()).toContain('全自动收益管理')
  })

  it('should navigate to correct route on click', async () => {
    const wrapper = mount(ModuleCard, {
      props: {
        title: '测试',
        description: '测试描述',
        icon: 'test',
        routePath: '/test-route'
      },
      global: {
        plugins: [createRouter({ ... })]
      }
    })

    await wrapper.trigger('click')
    expect(router.currentRoute.value.path).toBe('/test-route')
  })

  it('should show hover effect on mouseenter', async () => {
    const wrapper = mount(ModuleCard, {
      props: {
        title: '测试',
        description: '测试',
        icon: 'test',
        routePath: '/test'
      }
    })

    expect(wrapper.find('.card-hover').exists()).toBe(false)

    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.card-hover').exists()).toBe(true)
  })
})
```

**Store 测试示例**：
```typescript
// __tests__/stores/useAppStore.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should toggle sidebar state', () => {
    const store = useAppStore()

    expect(store.sidebarOpen).toBe(true)
    store.toggleSidebar()
    expect(store.sidebarOpen).toBe(false)
    store.toggleSidebar()
    expect(store.sidebarOpen).toBe(true)
  })

  it('should compute isDarkTheme correctly', () => {
    const store = useAppStore()

    store.setTheme('dark')
    expect(store.isDarkTheme).toBe(true)

    store.setTheme('light')
    expect(store.isDarkTheme).toBe(false)
  })
})
```

#### 7.2 集成测试（跨模块交互）

**关键测试场景**：
1. **路由导航集成**：点击首页 ModuleCard → 页面跳转 → URL 更新 → 页面渲染正确
2. **状态管理集成**：侧边栏 Header 按钮 → 触发 Store action → Sidebar 组件响应变化
3. **对话流集成**：输入消息 → 发送 API → 消息列表更新 → AI 响应流式显示
4. **购物车集成**：添加商品 → 修改数量 → 计算总价 → 结算跳转
5. **主题切换集成**：Settings 修改主题 → 全局 CSS 变量更新 → 所有组件响应

```typescript
// __tests__/integration/routing.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebMemoryHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import MonetizationPage from '@/views/MonetizationPage.vue'

describe('Routing Integration', () => {
  it('should navigate from home to monetization page', async () => {
    const router = createRouter({
      history: createWebMemoryHistory(),
      routes: [
        { path: '/', component: HomePage },
        { path: '/monetization', component: MonetizationPage }
      ]
    })

    const wrapper = mount(HomePage, {
      global: { plugins: [router] }
    })

    await router.push('/')
    await router.isReady()

    // 点击变现模块卡片
    const monetizationCard = wrapper.find('[data-testid="module-monetization"]')
    await monetizationCard.trigger('click')

    expect(router.currentRoute.value.path).toBe('/monetization')

    // 验证目标页面渲染
    expect(wrapper.html()).toContain('钱包余额')
  })
})
```

#### 7.3 E2E 测试（Playwright）

**7 个关键用户旅程**：

| 场景 ID | 名称 | 步骤数 | 优先级 | 验证点 |
|---------|------|--------|--------|--------|
| E2E-1 | 首页浏览与导航 | 5 | P0 | 加载性能、卡片显示、路由跳转 |
| E2E-2 | 智能体对话完整流程 | 8 | P0 | 消息发送、流式输出、上下文保持 |
| E2E-3 | 自动变现钱包操作 | 6 | P0 | 余额展示、提现流程、交易记录 |
| E2E-4 | 交易市场购物流程 | 10 | P1 | 商品浏览、加入购物车、结算下单 |
| E2E-5 | 社交互动匹配 | 7 | P1 | 用户推荐、滑动匹配、好友请求 |
| E2E-6 | 主题切换全局生效 | 4 | P2 | 设置修改、CSS变量更新、持久化 |
| E2E-7 | 响应式布局适配 | 6 | P2 | 移动端/平板/桌面端断点测试 |

**Playwright 测试示例**：
```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage Navigation', () => {
  test('should load homepage and display all module cards', async ({ page }) => {
    await page.goto('/')

    // 验证页面标题
    await expect(page.locator('h1')).toContainText('AgentPit')

    // 验证 13 个模块卡片全部显示
    const moduleCards = page.locator('.module-card')
    await expect(moduleCards).toHaveCount(13)

    // 验证核心模块可见
    await expect(page.locator('[data-testid="module-monetization"]')).toBeVisible()
    await expect(page.locator('[data-testid="module-sphinx"]')).toBeVisible()
    await expect(page.locator('[data-testid="module-chat"]')).toBeVisible()
  })

  test('should navigate to monetization page when card clicked', async ({ page }) => {
    await page.goto('/')

    // 点击变现模块卡片
    await page.click('[data-testid="module-monetization"]')

    // 验证 URL 更新
    await expect(page).toHaveURL('/monetization')

    // 验证目标页面内容
    await expect(page.locator('h1')).toContainText('自动变现')
  })
})
```

### Requirement 8: 性能优化与质量门禁

系统 SHALL 达到严格的性能指标和代码质量标准。

#### 性能指标（硬性要求）：

| 指标 | 目标值 | 测量工具 |
|------|--------|----------|
| First Contentful Paint (FCP) | ≤ 3s | Lighthouse CI |
| Largest Contentful Paint (LCP) | ≤ 2.5s | Lighthouse CI |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | Lighthouse CI |
| Time to Interactive (TTI) | ≤ 4s | Lighthouse CI |
| JS Bundle Size (gzip) | ≤ 150KB per chunk | webpack-bundle-analyzer |
| Lighthouse Performance Score | ≥ 90 | Lighthouse CI |
| Final Container Image Size | ≤ 500MB | Podman/Docker |

#### 性能优化策略：

1. **路由懒加载**：所有页面组件动态 import
2. **组件异步加载**：大型组件使用 `defineAsyncComponent`
3. **图标按需加载**：图标库 tree-shaking 或动态导入
4. **虚拟滚动**：长列表使用 `vue-virtual-scroller`
5. **图片懒加载**：使用 `loading="lazy"` 属性
6. **代码分割**：Vite 自动 code splitting
7. **Tree Shaking**：移除未使用的代码
8. **Gzip/Brotli 压缩**：服务器启用压缩

#### 代码质量标准：

- ESLint：**0 errors, 0 warnings**（零容忍政策）
- Prettier：格式化统一（单引号、2 空格、无尾逗号）
- TypeScript：strict 模式，无 any 类型
- Pre-commit Hook：husky + lint-staged 强制执行
- Conventional Commits：Git 提交规范化

### Requirement 9: Podman 容器化部署（镜像 ≤ 500MB）

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

#### 容器编排配置：

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
  ```

### Requirement 10: 环境变量管理与敏感信息安全

系统 SHALL 实现严格的环境变量管理方案，**严格区分开发、测试和生产环境配置，敏感信息不得硬编码**。

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

### Requirement 11: 统一日志系统（保留 30 天 + 自动归档）

系统 SHALL 实现统一的日志管理系统，**所有工具调用必须记录详细日志，按日期归档，保留至少 30 天**。

#### 日志规范：

- **存储位置**: `apps/AgentPit/logs/{tool_name}/YYYY-MM-DD.log`
- **格式**: JSON Lines（每行一个 JSON 对象）
- **字段结构**:
  ```typescript
  interface LogEntry {
    timestamp: string;       // ISO 8601 格式
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    module: string;          // 模块名称
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
  }
  ```
- **归档策略**:
  - 每日生成新日志文件
  - 超过 30 天的日志自动压缩为 `.gz` 并归档到 `logs/archive/`
  - 超过 90 天的归档文件自动删除
- **查询工具**: 提供 `scripts/query-logs.ts` 脚本支持按日期/级别/模块过滤

### Requirement 12: DeepResearch 智能体集成（响应时间 ≤ 5 秒）

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

### Requirement 13: Flexloop 工具集成（版本明确指定）

系统 SHALL 正确集成 flexloop 工具，确保工具路径配置正确且**版本号在配置文件中明确指定**。

#### 集成规范：

- **工具路径**: `d:\xinet\daoCollective\daoApps\daoApps\tools\flexloop`
- **版本锁定**: 在 `tools/flexloop/pyproject.toml` 中明确版本号
- **依赖安装**: 调用前执行 `cd tools/flexloop && pdm install`（使用 `pdm.lock` 锁定版本）
- **版本验证**: 调用时检查实际安装版本是否符合要求，不符合则提示升级
- **日志记录**: 与 DeepResearch 相同的结构化日志格式

### Requirement 14: 项目执行规范 - 错误处理流程

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

### Requirement 15: Git 版本控制规范（约定式提交）

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

**提交示例**:
```
feat(chat): 实现流式输出打字机效果

- 添加 useTypewriter composable
- 支持 30-300ms 可调节打字速度
- 集成到 MessageList 组件
- 添加相关单元测试

Closes #123
```

#### 分支策略：
- `main`: 生产环境代码（受保护，仅允许 PR 合并）
- `develop`: 开发主分支
- `feature/*`: 功能开发分支（从 develop 创建）
- `bugfix/*`: Bug 修复分支（从 develop 创建）
- `hotfix/*`: 紧急修复分支（从 main 创建）

### Requirement 16: 阶段复盘机制（不定期）

系统 SHALL 在关键节点进行**不定期复盘**，而非固定时间周期。复盘是对已完成工作的经验总结和反思，应在以下时机触发：

#### 复盘触发条件（不定期）：
- **里程碑达成**：完成重要功能模块、解决关键问题、通过重要评审时
- **阶段结束**：每个 Phase 完成后进行回顾
- **问题解决后**：重大 bug 或技术难题解决后进行经验沉淀
- **团队认为必要时**：任何值得复盘总结的时刻

**复盘原则**：
- 及时性：问题解决后尽快复盘（通常1-3天内），而非等待固定周期
- 灵活性：根据实际情况调整复盘深度和形式
- 实用性：聚焦可执行的改进建议，避免形式主义

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
```

### Requirement 17: 回归测试矩阵（功能对等性验证）

系统 SHALL 建立完整的回归测试矩阵，对比 React 版本和 Vue3 版本的功能行为一致性。

#### 回归测试对照表：

| 功能模块 | React 版本行为 | Vue3 版本预期行为 | 测试状态 | 差异说明 |
|---------|---------------|------------------|---------|---------|
| **首页** | | | | |
| - 标题动画 | 字符逐个淡入 | 字符逐个淡入（使用 TransitionGroup） | ⏳ 待测 | 实现方式不同，视觉效果一致 |
| - 卡片网格 | 3列响应式网格 | 3列响应式网格（CSS Grid） | ⏳ 待测 | 使用原生 CSS Grid 替代 Tailwind |
| - 悬停效果 | 上浮 + 阴影 | 上浮 + 阴影 + 缩放（增强版） | ⏳ 待测 | Vue3 版本增加 scale 效果 |
| **变现模块** | | | | |
| - 钱包余额展示 | 数字格式化显示 | 数字格式化显示（使用 Intl.NumberFormat） | ⏳ 待测 | 格式化库更换，结果一致 |
| - 收益图表 | Recharts 柱状图 | ECharts 柱状图 | ⏳ 待测 | 图表库更换，视觉略有差异但数据一致 |
| - 提现弹窗 | Modal 组件 | 使用 Teleport 的 Modal | ⏳ 待测 | 实现机制不同，用户体验一致 |
| **聊天模块** | | | | |
| - 消息气泡 | 左右对齐 | 左右对齐 | ⏳ 待测 | 一致 |
| - 流式输出 | setInterval 模拟 | Composable 封装（useTypewriter） | ⏳ 待测 | 代码组织更好，效果一致 |
| - 快捷指令 | 固定按钮面板 | 固定按钮面板 + 可折叠 | ⏳ 待测 | Vue3 版本增加折叠功能 |
| **...其他模块** | | | | |

#### 差异评估标准：
- ✅ **通过**：功能完全一致或 Vue3 版本有合理增强
- ⚠️ **可接受**：存在微小差异但不影响核心体验
- ❌ **失败**：功能缺失或严重偏差，需修复

### Requirement 18: 迁移文档与交付物

系统 SHALL 生成完整的迁移文档和交付物，确保项目可追溯性和团队协作效率。

#### 必需文档清单：

1. **迁移报告**（`.trae/docs/vue3-rewrite-report.md`）
   - 迁移概述与背景
   - 技术栈对比（React vs Vue3）
   - 功能映射表（完整版）
   - 增强功能清单
   - 性能对比数据
   - 问题与解决方案记录
   - 经验教训总结

2. **组件迁移清单**（`.trae/docs/component-migration-checklist.md`）
   - 每个组件的迁移状态（✅/⏳/❌）
   - React 代码行数 vs Vue3 代码行数
   - 增强点说明
   - 测试覆盖率

3. **API 变更日志**（`.trae/docs/api-changelog.md`）
   - 组件 Props 接口变更
   - Store 接口变更
   - 路由配置变更
   - 工具函数签名变更

4. **性能基线报告**（`.trae/docs/performance-baseline.md`）
   - Lighthouse 审计报告
   - Bundle 分析报告
   - Core Web Vitals 指标
   - 优化建议

5. **Git 提交记录**
   - 使用 Conventional Commits 规范
   - 每个功能模块独立提交
   - 创建版本标签：`v3.0.0-vue3-rewrite-complete`

---

## MODIFIED Requirements

### Requirement: 原平台开发规范调整

将 `agentpit-platform-development/spec.md` 中的技术栈要求从 **React + TypeScript** 修改为 **Vue3 + TypeScript**，其余功能需求保持不变。

**修改内容**：
- ~~基于 React + TypeScript~~ → 基于 **Vue 3.4+ Composition API + TypeScript**
- ~~Zustand 状态管理~~ → **Pinia 状态管理**
- ~~React Router DOM v7~~ → **Vue Router v4**
- 新增 Vue3 特性要求（Composition API、Teleport、Suspense、自定义指令等）
- 新增性能优化要求（Bundle Size ≤ 150KB gzip、Lighthouse ≥ 90）

## REMOVED Requirements

### Requirement: 旧的简单迁移方案

**Reason**: 用户明确要求采用**全新实现的迁移策略**而非代码转换方式，因此废弃之前的 `agentpit-vue3-migration` 规范中的简单迁移任务。

**Migration**: 本规范（`agentpit-vue3-rewrite`）完全替代 `agentpit-vue3-migration`，采用更高标准的重构方案，包含：
- 更详细的功能映射表
- 更多 Vue3 特性增强
- 更完善的测试体系
- 更严格的性能要求
- 更完整的文档交付物

### Requirement 19: 工作流回切与衔接机制

系统 SHALL 在完成本规范所有开发任务后，**立即切换回 `agentpit-platform-development` 规范目录**，确保整个项目开发流程的完整性和可追溯性。

#### 回切触发条件：
- ✅ 所有 Phase 任务全部完成并通过验证
- ✅ 阶段复盘文档已输出
- ✅ Git 提交已完成，代码已推送到远程仓库
- ✅ 容器化部署验证通过

#### 回切操作清单：

**Step 1: 环境配置调整**
- [ ] 确认当前工作目录为 `apps/AgentPit/`
- [ ] 检查 Vue3 项目构建产物完整性
- [ ] 备份当前开发状态到 `.trae/backups/vue3-rewrite-backup-YYYYMMDD/`
- [ ] 记录当前分支名称和最新 commit hash
- [ ] 创建版本标签：`git tag -a v3.0.0-vue3-rewrite-complete -m "Vue3重构完成"`

**Step 2: 文件依赖关系检查**
- [ ] 对比 React 备份版本和 Vue3 重构版本的文件结构差异
- [ ] 验证所有 import 路径是否正确
- [ ] 检查 node_modules 依赖是否与 package.json 一致
- [ ] 运行 `npm run build` 确保无编译错误
- [ ] 运行 `npm run lint` 确保零错误零警告

**Step 3: 规范目录切换确认**
- [ ] 当前活跃的 spec 目录从 `agentpit-vue3-rewrite` 切换至 `agentpit-platform-development`
- [ ] 更新 `.trae/ACTIVE_SPEC` 文件记录当前活跃规范
- [ ] 在平台开发规范中创建衔接文档：`.trae/docs/vue3-rewrite-handoff.md`

#### 衔接文档模板：

```markdown
# Vue3 重构完成交接文档

## 📋 基本信息
- **源规范**: agentpit-vue3-rewrite
- **目标规范**: agentpit-platform-development
- **交接时间**: YYYY-MM-DD HH:MM
- **Git Tag**: v3.0.0-vue3-rewrite-complete
- **Commit Hash**: {abc1234}

## ✅ 已完成工作
### Vue3 重构成果
- [x] 项目架构从 React 重构至 Vue 3.4+ (Composition API)
- [x] 状态管理从 Zustand 迁移至 Pinia
- [x] 路由系统从 React Router 迁移至 Vue Router 4
- [x] 10大功能模块全部实现（50+ 组件）
- [x] Podman 容器化部署配置就绪
- [x] DeepResearch + Flexloop 工具集成完成
- [x] ESLint + Prettier 零错误率达成
- [x] 性能指标达标（JS≤150KB, FCP≤3s, Lighthouse≥90）

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

## 📎 相关文档链接
- [Vue3 重构规范](../specs/agentpit-vue3-rewrite/spec.md)
- [任务清单](../specs/agentpit-vue3-rewrite/tasks.md)
- [验证报告](../specs/agentpit-vue3-rewrite/checklist.md)
- [Phase 复盘](../reviews/)
```
