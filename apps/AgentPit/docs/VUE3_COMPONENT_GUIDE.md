# AgentPit Vue3 组件开发指南

**版本**: v1.0.0
**创建日期**: 2026-04-10
**适用范围**: AgentPit 项目 React → Vue3 迁移
**目标框架**: Vue 3.4+ Composition API + TypeScript

---

## 目录

1. [Vue3 SFC 结构模板](#1-vue3-sfc-结构模板)
2. [React → Vue3 语法对照表](#2-react--vue3-语法对照表)
3. [代码规范要求](#3-代码规范要求)
4. [组件迁移实战示例](#4-组件迁移实战示例)
5. [常见问题与解决方案](#5-常见问题与解决方案)
6. [最佳实践清单](#6-最佳实践清单)

---

## 1. Vue3 SFC 结构模板

### 1.1 标准组件结构（推荐）

```vue
<template>
  <!-- HTML 模板区域 -->
  <div class="component-wrapper">
    <h2 class="component-title">{{ title }}</h2>

    <!-- 使用 v-for 渲染列表 -->
    <ul v-for="item in items" :key="item.id">
      <li>{{ item.name }}</li>
    </ul>

    <!-- 条件渲染 -->
    <div v-if="isLoading">加载中...</div>
    <div v-else>内容已加载</div>

    <!-- 事件绑定 -->
    <button @click="handleClick" :disabled="isDisabled">
      {{ buttonText }}
    </button>

    <!-- 动态样式绑定 -->
    <div
      :class="['card', { 'active': isActive }]"
      :style="{ color: textColor }"
    >
      动态样式示例
    </div>

    <!-- 插槽（替代 React 的 children） -->
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
/**
 * 组件名称: ComponentName
 * 功能描述: 简要说明组件的作用
 */

// ============================================
// 1. 导入依赖
// ============================================
import { ref, computed, onMounted, watch, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import type { ModuleCardProps } from '@/types/module'

// ============================================
// 2. Props 定义（必须使用 TypeScript 接口）
// ============================================
interface Props {
  /** 标题 */
  title: string
  /** 副标题（可选） */
  subtitle?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  disabled: false,
  customClass: ''
})

// ============================================
// 3. Emits 定义（事件声明）
// ============================================
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'click', event: MouseEvent): void
  (e: 'delete', id: number): void
}>()

// ============================================
// 4. 响应式状态（ref / reactive）
// ============================================

/** 加载状态 */
const isLoading = ref(false)

/** 激活状态 */
const isActive = ref(false)

/** 文字颜色（可动态修改） */
const textColor = ref('#333333')

/** 列表数据 */
const items = ref<{ id: number; name: string }[]>([])

/** 复杂对象使用 reactive */
const formData = reactive({
  username: '',
  email: '',
  age: 0
})

// ============================================
// 5. 计算属性（computed）
// ============================================

/** 按钮文字（根据状态动态变化） */
const buttonText = computed(() => {
  return props.disabled ? '已禁用' : '点击我'
})

/** 过滤后的列表 */
const filteredItems = computed(() => {
  return items.value.filter(item => item.name.length > 0)
})

/** 是否可以提交 */
const canSubmit = computed(() => {
  return formData.username.length > 0 && formData.email.includes('@')
})

// ============================================
// 6. 方法定义
// ============================================

/** 处理点击事件 */
const handleClick = (event: MouseEvent) => {
  emit('click', event)
  isActive.value = !isActive.value
}

/** 更新值并通知父组件 */
const handleUpdate = (value: string) => {
  emit('update', value)
}

/** 异步加载数据 */
const fetchData = async () => {
  isLoading.value = true
  try {
    // 模拟 API 调用
    const response = await fetch('/api/data')
    const data = await response.json()
    items.value = data
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/** 删除项目 */
const handleDelete = (id: number) => {
  emit('delete', id)
}

// ============================================
// 7. 监听器（watch）
// ============================================

/** 监听 props 变化 */
watch(
  () => props.title,
  (newTitle, oldTitle) => {
    console.log(`标题从 "${oldTitle}" 变为 "${newTitle}"`)
  },
  { immediate: false }
)

/** 监听响应式对象（深度监听） */
watch(
  () => ({ ...formData }),
  (newVal) => {
    console.log('表单数据变更:', newVal)
  },
  { deep: true }
)

// ============================================
// 8. 生命周期钩子
// ============================================

onMounted(() => {
  console.log('组件已挂载')
  fetchData()
})

// 可选的其他生命周期:
// onBeforeMount()  // 挂载前
// onUpdated()      // 更新后
// onUnmounted()    // 卸载后
</script>

<style scoped>
/* 使用 scoped 确保样式只作用于当前组件 */

.component-wrapper {
  @apply p-6 bg-white rounded-lg shadow-md;
}

.component-title {
  @apply text-2xl font-bold text-gray-800 mb-4;
}

/* CSS 变量与 JS 联动（v-bind） */
.card {
  --dynamic-color: v-bind(textColor);
  border: 2px solid var(--dynamic-color);
  transition: all 0.3s ease;
}

.card.active {
  @apply bg-blue-50 shadow-lg transform scale-105;
}

/* Tailwind CSS 类名优先，必要时使用原生 CSS */
ul {
  list-style: none;
  padding: 0;
}

li {
  @apply py-2 px-4 hover:bg-gray-100 rounded cursor-pointer transition-colors;
}
</style>
```

### 1.2 页面级组件模板

```vue
<template>
  <div class="page-container">
    <!-- 页面标题区 -->
    <header class="page-header">
      <h1>页面标题</h1>
      <p>页面描述信息</p>
    </header>

    <!-- 主内容区 -->
    <main class="page-content">
      <ModuleCard
        v-for="module in modules"
        :key="module.title"
        v-bind="module"
        @click="handleNavigate(module.route)"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModuleCard from '@/components/home/ModuleCard.vue'
import { MODULE_CONFIG_MAP } from '@/types/module'
import type { ModuleData } from '@/types/module'

const router = useRouter()

/** 模块数据列表 */
const modules = ref<ModuleData[]>(Object.values(MODULE_CONFIG_MAP))

/** 导航处理 */
const handleNavigate = (route: string) => {
  router.push(route)
}

onMounted(() => {
  console.log('页面加载完成')
})
</script>

<style scoped>
.page-container {
  @apply min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900;
}
</style>
```

---

## 2. React → Vue3 语法对照表

### 2.1 核心概念映射

| React 概念 | Vue3 对应 | 说明 |
|-----------|----------|------|
| `useState` | `ref()` / `reactive()` | 基础类型用 ref，对象用 reactive |
| `useEffect` | `onMounted()` / `onUnmounted()` / `watch()` | 按生命周期拆分 |
| `useMemo` | `computed()` | 计算属性自动缓存 |
| `useCallback` | 直接定义函数 | Vue3 无需缓存函数引用 |
| `useRef` | `ref()` / `templateRef()` | DOM 引用使用 templateRef |
| `useContext` | `provide()` / `inject()` | 依赖注入机制 |
| `useState` + reducer | Pinia Store | 复杂状态管理 |

### 2.2 模板语法对照

#### JSX → Template

```jsx
// ❌ React JSX
<div className={`card ${isActive ? 'active' : ''}`}>
  <h1>{title}</h1>
  {items.map(item => <span key={item.id}>{item.name}</span>)}
  <button onClick={handleClick} style={{ color: '#fff' }}>
    点击
  </button>
  {children}
</div>
```

```vue
<!-- ✅ Vue3 Template -->
<div :class="['card', { active: isActive }]">
  <h1>{{ title }}</h1>
  <span v-for="item in items" :key="item.id">{{ item.name }}</span>
  <button @click="handleClick" :style="{ color: '#fff' }">
    点击
  </button>
  <slot />  <!-- 替代 children -->
</div>
```

#### 属性和事件绑定

| React | Vue3 | 示例 |
|------|------|------|
| `className="..."` | `class="..."` 或 `:class="[...]"` | 静态/动态类名 |
| `style={{ }}` | `:style="{ }"` 或 `style="..."` | 内联样式 |
| `onClick={fn}` | `@click="fn"` | 点击事件 |
| `onChange={fn}` | `@change="fn"` / `v-model` | 表单变更 |
| `onSubmit={fn}` | `@submit.prevent="fn"` | 表单提交（带修饰符） |
| `{children}` | `<slot />` | 子组件插槽 |
| `props.title` | `props.title` 或直接用 `title` | Props 访问 |
| `ref={domRef}` | `ref="domRef"` 或 `:ref="el => ..."` | DOM 引用 |
| `key={id}` | `:key="id"` | 列表 key |
| `dangerouslySetInnerHTML` | `v-html="content"` | HTML 内容（谨慎使用） |

#### 条件渲染和列表

```jsx
// React
{isLoading && <Spinner />}
{error ? <Error /> : <Content />}
{items.map(item => <Item key={item.id} {...item} />)}
```

```vue
<!-- Vue3 -->
<Spinner v-if="isLoading" />
<Error v-if="error" else-if="!isLoading" />
<Content v-else />
<Item
  v-for="item in items"
  :key="item.id"
  v-bind="item"
/>
```

### 2.3 Hooks → Composition API 对照

#### 状态管理

```typescript
// ❌ React
const [count, setCount] = useState(0)
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])

setCount(prev => prev + 1)
setUser({ name: '张三', age: 25 })
setItems([...prevItems, newItem])
```

```typescript
// ✅ Vue3
const count = ref(0)           // 基础类型
const user = ref<User | null>(null)  // 可空对象
const items = ref<Item[]>([])       // 数组

count.value++                      // 直接赋值触发更新
user.value = { name: '张三', age: 25 }
items.value.push(newItem)           // 直接操作数组
```

#### 副作用和生命周期

```typescript
// ❌ React
useEffect(() => {
  fetchData()
}, [])  // 仅挂载时执行

useEffect(() => {
  return () => cleanup()
}, [dependency])  // 依赖变化时执行

useEffect(() => {
  watchSomething(something)
}, [something])   // 监听某个变量
```

```typescript
// ✅ Vue3
onMounted(() => {
  fetchData()
})

watch(dependency, (newVal, oldVal) => {
  cleanup()
})

watch(something, (newVal) => {
  watchSomething(newVal)
}, { immediate: true })
```

#### 计算属性

```typescript
// ❌ React
const doubleCount = useMemo(() => count * 2, [count])
const filteredList = useMemo(
  () => items.filter(item => item.active),
  [items]
)
```

```typescript
// ✅ Vue3
const doubleCount = computed(() => count.value * 2)
const filteredList = computed(() =>
  items.value.filter(item => item.active)
)
// 自动追踪依赖，无需手动声明
```

### 2.4 路由导航对照

```typescript
// ❌ React Router
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const navigate = useNavigate()
const { id } = useParams()
const location = useLocation()

navigate('/path')                    // 编程式导航
navigate('/path', { replace: true }) // 替换当前历史
<Link to="/path">链接</Link>         // 声明式导航
<NavLink to="/path" activeClassName="active">  // 带激活状态的链接
```

```typescript
// ✅ Vue Router
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.push('/path')                // 编程式导航
router.replace('/path')             // 替换当前历史
router.back()                       // 返回上一页
<router-link to="/path">链接</router-link>        // 声明式导航
<router-link to="/path" active-class="active">     // 带激活状态
```

---

## 3. 代码规范要求

### 3.1 文件命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| **组件文件** | PascalCase.vue | `ModuleCard.vue`, `Header.vue` |
| **工具文件** | camelCase.ts | `formatDate.ts`, `utils.ts` |
| **类型文件** | camelCase.ts | `chatTypes.ts`, `common.ts` |
| **Store文件** | useXxxStore.ts | `useAppStore.ts` |
| **Composable** | useXxx.ts | `useChat.ts`, `useAuth.ts` |
| **常量文件** | UPPER_SNAKE_CASE.ts | `API_CONSTANTS.ts` |

### 3.2 组件编写规范

#### ✅ 必须遵守的规则

1. **使用 `<script setup lang="ts">`**
   ```vue
   <script setup lang="ts">
   // 所有组件必须使用此格式
   </script>
   ```

2. **Props 必须使用 TypeScript 接口**
   ```typescript
   interface Props {
     title: string
     count?: number
   }
   const props = withDefaults(defineProps<Props>(), {
     count: 0
   })
   ```

3. **Emits 必须显式声明**
   ```typescript
   const emit = defineEmits<{
     (e: 'update', value: string): void
     (e: 'delete', id: number): void
   }>()
   ```

4. **样式必须使用 scoped**
   ```vue
   <style scoped>
   /* 避免全局样式污染 */
   .my-component { }
   </style>
   ```

5. **组件命名使用 PascalCase**
   ```typescript
   // ✅ 正确
   export default ModuleCard

   // ❌ 错误
   export default moduleCard
   export default module_card
   ```

6. **优先使用 Composition API**
   ```typescript
   // ✅ 推荐：Composition API
   import { ref, computed } from 'vue'

   // ❌ 不推荐：Options API（除非特殊场景）
   export default {
     data() { return {} }
   }
   ```

7. **导入路径使用 @ 别名**
   ```typescript
   // ✅ 正确
   import ModuleCard from '@/components/ModuleCard.vue'
   import type { User } from '@/types/user'

   // ❌ 错误
   import ModuleCard from '../../../components/ModuleCard.vue'
   ```

#### 📝 推荐的最佳实践

1. **组合式函数（Composables）抽取逻辑**
   ```typescript
   // composables/useChat.ts
   import { ref } from 'vue'

   export function useChat() {
     const messages = ref([])

     const sendMessage = async (content: string) => {
       // 业务逻辑...
     }

     return {
       messages,
       sendMessage
     }
   }

   // 在组件中使用
   const { messages, sendMessage } = useChat()
   ```

2. **使用 TypeScript 类型守卫**
   ```typescript
   function isProduct(item: any): item is Product {
     return item && typeof item.id === 'string' && 'price' in item
   }
   ```

3. **错误边界处理**
   ```typescript
   try {
     await riskyOperation()
   } catch (error) {
     console.error('操作失败:', error)
     // 显示用户友好的错误提示
     showErrorToast('操作失败，请稍后重试')
   }
   ```

4. **性能优化意识**
   ```typescript
   // 长列表使用虚拟滚动
   import { useVirtualList } from '@vueuse/core'

   // 大计算量使用 computed 缓存
   const expensiveResult = computed(() => {
     // 自动缓存，仅在依赖变化时重算
   })

   // 防抖/节流
   import { useDebounceFn } from '@vueuse/core'
   const debouncedSearch = useDebounceFn(search, 500)
   ```

### 3.3 目录结构规范

```
src/
├── components/          # 可复用组件
│   ├── common/          # 通用组件（Button、Modal、Input）
│   ├── layout/          # 布局组件（Header、Sidebar、Footer）
│   └── home/            # 首页专用组件
│       └── ModuleCard.vue
├── views/               # 页面级组件（或 pages/）
│   ├── HomePage.vue
│   └── ChatPage.vue
├── stores/              # Pinia 状态管理
│   └── useAppStore.ts
├── composables/         # 组合式函数（可复用逻辑）
│   ├── useChat.ts
│   └── useAuth.ts
├── types/               # TypeScript 类型定义
│   ├── index.ts         # 统一导出
│   ├── common.ts
│   ├── chat.ts
│   └── ...
├── data/                # Mock 数据和静态资源
│   ├── mockChat.ts
│   └── ...
├── utils/               # 工具函数
│   ├── format.ts
│   └── validate.ts
├── api/                 # API 接口层（后续接入）
│   └── request.ts
├── router/              # 路由配置
│   └── index.ts
├── App.vue              # 根组件
├── main.ts              # 入口文件
└── style.css            # 全局样式
```

---

## 4. 组件迁移实战示例

### 4.1 迁移 ModuleCard 组件

#### React 版本（源码）

```tsx
// src-react-backup-20260410/components/home/ModuleCard.tsx
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface ModuleCardProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  route: string
  gradientFrom: string
  gradientTo: string
  delay?: number
}

const ModuleCard = ({
  title,
  subtitle,
  icon,
  route,
  gradientFrom,
  gradientTo,
  delay = 0
}: ModuleCardProps) => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const handleClick = () => {
    navigate(route)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative cursor-pointer transform transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`
        relative overflow-hidden rounded-3xl p-6
        bg-gradient-to-br ${gradientFrom} ${gradientTo}
        shadow-lg hover:shadow-2xl transition-shadow duration-300
        border border-white/20 backdrop-blur-sm
        min-h-[200px] flex flex-col items-center justify-center text-center
      `}>
        <div className={`
          relative z-10 w-20 h-20 mb-4 rounded-2xl
          bg-white/20 backdrop-blur-md flex items-center justify-center
          transform transition-transform duration-300
          ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
        `}>
          <div className="text-4xl">{icon}</div>
        </div>
        <h3 className={`
          relative z-10 text-xl font-bold text-white mb-2
          transition-all duration-300
          ${isHovered ? 'text-yellow-200' : ''}
        `}>
          {title}
        </h3>
        <p className="relative z-10 text-sm text-white/90 font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default ModuleCard
```

#### Vue3 版本（迁移后）

```vue
<!-- src/components/home/ModuleCard.vue -->
<template>
  <div
    class="module-card-wrapper"
    :class="[
      'relative cursor-pointer transform transition-all duration-500 ease-out',
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95',
      isHovered ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'
    ]"
    :style="{ transitionDelay: `${delay}ms` }"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'relative overflow-hidden rounded-3xl p-6',
        'bg-gradient-to-br', gradientFrom, gradientTo,
        'shadow-lg hover:shadow-2xl transition-shadow duration-300',
        'border border-white/20 backdrop-blur-sm',
        'min-h-[200px] flex flex-col items-center justify-center text-center'
      ]"
    >
      <!-- 图标容器 -->
      <div
        :class="[
          'relative z-10 w-20 h-20 mb-4 rounded-2xl',
          'bg-white/20 backdrop-blur-md flex items-center justify-center',
          'transform transition-transform duration-300',
          isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
        ]"
      >
        <div class="text-4xl">{{ icon }}</div>
      </div>

      <!-- 标题 -->
      <h3
        :class="[
          'relative z-10 text-xl font-bold text-white mb-2',
          'transition-all duration-300',
          isHovered ? 'text-yellow-200' : ''
        ]"
      >
        {{ title }}
      </h3>

      <!-- 副标题 -->
      <p class="relative z-10 text-sm text-white/90 font-medium">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ModuleCardProps } from '@/types/module'

// ============================================
// Props 定义
// ============================================
const props = withDefaults(defineProps<ModuleCardProps>(), {
  delay: 0
})

// ============================================
// 路由实例
// ============================================
const router = useRouter()

// ============================================
// 响应式状态
// ============================================
const isVisible = ref(false)
const isHovered = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

// ============================================
// 生命周期
// ============================================
onMounted(() => {
  timer = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

// ============================================
// 方法
// ============================================
const handleClick = () => {
  router.push(props.route)
}
</script>

<style scoped>
/* 可在此处添加组件特定的自定义样式 */
/* 主要样式通过 Tailwind CSS 类名实现 */
</style>
```

#### 关键迁移点说明

1. **接口定义保留**: `ModuleCardProps` 从 types/ 导入
2. **React.ReactNode → string**: icon 类型简化为字符串（Emoji）
3. **useState → ref**: `isVisible` 和 `isHovered` 改为 ref
4. **useEffect → onMounted/onUnmounted**: 定时器在挂载时启动，卸载时清理
5. **useNavigate → useRouter**: 路由跳转方式调整
6. **className → :class**: 动态类名使用数组语法
7. **onClick → @click**: 事件绑定语法转换
8. **{{children}} → template**: 此组件无插槽需求

### 4.2 迁移 ChatPage 组件（复杂案例）

由于聊天系统涉及流式输出、状态管理等复杂逻辑，迁移要点：

```vue
<!-- src/views/ChatPage.vue (核心骨架) -->
<template>
  <div class="chat-container">
    <!-- 侧边栏：会话列表 -->
    <aside class="chat-sidebar">
      <ConversationList
        :conversations="conversations"
        :active-id="activeConversationId"
        @select="setActiveConversation"
        @create="createConversation"
        @delete="deleteConversation"
      />
    </aside>

    <!-- 主区域：消息显示 -->
    <main class="chat-main">
      <MessageList
        :messages="currentMessages"
        :is-streaming="isStreaming"
      />

      <!-- 输入框 -->
      <ChatInput
        :disabled="isStreaming"
        @send="sendMessage"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()
const { conversations, activeConversationId, isStreaming } = storeToRefs(appStore)

// 解构 actions（保持响应式）
const {
  setActiveConversation,
  createConversation,
  deleteConversation,
  sendMessage
} = appStore
</script>
```

**关键差异**:
- Zustand → Pinia (`storeToRefs` 保持响应式解构)
- 手动 localStorage → `pinia-plugin-persistedstate`
- setInterval 流式输出 → 可优化为 async/await + requestAnimationFrame

---

## 5. 常见问题与解决方案

### Q1: 如何处理 React 的 children？

**React**:
```tsx
const Wrapper = ({ children }) => (
  <div className="wrapper">{children}</div>
)
```

**Vue3**:
```vue
<!-- 方式1：默认插槽 -->
<template>
  <div class="wrapper"><slot /></div>
</template>

<!-- 使用 -->
<Wrapper>内容</Wrapper>

<!-- 方式2：具名插槽 -->
<template>
  <div>
    <slot name="header" />
    <slot />  <!-- 默认插槽 -->
    <slot name="footer" />
  </div>
</template>

<!-- 使用 -->
<Wrapper>
  <template #header><h1>标题</h1></template>
  <p>主内容</p>
  <template #footer><footer>底部</footer></template>
</Wrapper>
```

### Q2: 如何实现类似 React 的 HOC（高阶组件）？

**Vue3 推荐方案**: 使用 Composables 或 provide/inject

```typescript
// composables/withLoading.ts
export function useLoading() {
  const isLoading = ref(false)

  const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    isLoading.value = true
    try {
      return await asyncFn()
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, withLoading }
}

// 使用
const { isLoading, withLoading } = useLoading()
const data = await withLoading(fetchData)
```

### Q3: 如何迁移 React Context？

**React**:
```tsx
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  )
}
```

**Vue3**:
```typescript
// 提供
provide('theme', 'dark')

// 注入
const theme = inject<string>('theme', 'light')  // 第二个参数为默认值
```

### Q4: 如何处理表单受控组件？

**React**:
```tsx
<input
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
```

**Vue3**:
```vue
<input
  v-model="formData.name"
/>

<!-- 或自定义处理 -->
<input
  :value="formData.name"
  @input="formData.name = $event.target.value"
/>
```

### Q5: 如何迁移第三方 UI 库？

| React 库 | Vue3 替代方案 |
|-----------|-------------|
| Ant Design | Ant Design Vue |
| Material UI | Vuetify / Quasar |
| Chakra UI | Headless UI + 自定义样式 |
| React Query | VueQuery / TanStack Query Vue |
| React Router | Vue Router |
| Redux/Zustand | Pinia |

---

## 6. 最佳实践清单

### ✅ 迁移检查清单

- [ ] 所有组件使用 `<script setup lang="ts">`
- [ ] Props 定义使用 TypeScript 接口 + `withDefaults`
- [ ] Emits 显式声明类型
- [ ] 样式使用 `scoped` 避免污染
- [ ] 移除所有 React 特有导入（useState, useEffect 等）
- [ ] `className` 改为 `:class` 或 `class=""`
- [ ] `onClick` 改为 `@click`
- [ ] `{children}` 改为 `<slot />`
- [ ] `style={{}}` 改为 `:style`
- [ ] `ref={domRef}` 改为 `ref="domRef"` 或 `:ref`
- [ ] Tailwind CSS 类名完整保留
- [ ] Mock 数据已适配为 ESM 导出
- [ ] 类型定义统一提取到 types/ 目录
- [ ] 路由配置使用 Vue Router 4 语法
- [ ] 状态管理迁移至 Pinia
- [ ] 组件文件命名为 PascalCase.vue

### ⚠️ 性能优化检查

- [ ] 长列表使用虚拟滚动（`@vueuse/virtual`）
- [ ] 大计算量使用 `computed` 缓存
- [ ] 频繁操作使用防抖/节流（`@vueuse/core`）
- [ ] 图片懒加载使用 `v-lazy` 或原生 `loading="lazy"`
- [ ] 路由组件使用懒加载（`() => import('./Page.vue')`）

### 🔒 安全性检查

- [ ] XSS 防护：避免 `v-html` 使用用户输入
- [ ] CSRF Token：表单提交携带验证
- [ ] 输入校验：前后端双重验证
- [ ] 敏感信息：不在日志中打印密码等

### ♿ 无障碍性（A11y）检查

- [ ] 图片添加 alt 属性
- [ ] 表单元素关联 label
- [ ] 键盘导航支持（Tab 顺序合理）
- [ ] ARIA 属性正确使用（role, aria-label 等）
- [ ] 颜色对比度符合 WCAG 标准

---

## 附录：常用代码片段库

### A.1 Pinia Store 模板

```typescript
// stores/useExampleStore.ts
import { defineStore } from 'pinia'

interface ExampleState {
  count: number
  user: User | null
}

export const useExampleStore = defineStore('example', {
  state: (): ExampleState => ({
    count: 0,
    user: null
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    isLoggedIn: (state) => !!state.user
  },

  actions: {
    increment() {
      this.count++
    },

    async fetchUser(id: string) {
      try {
        const res = await fetch(`/api/users/${id}`)
        this.user = await res.json()
      } catch (error) {
        console.error('获取用户失败:', error)
        throw error
      }
    }
  },

  // 启用持久化（需安装 pinia-plugin-persistedstate）
  persist: {
    key: 'example-store',
    storage: localStorage,
    paths: ['user']  // 只持久化部分字段
  }
})
```

### A.2 Composable 模板

```typescript
// composables/useWindowSize.ts
import { onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}
```

### A.3 工具函数模板

```typescript
// utils/format.ts
/**
 * 格式化日期为本地字符串
 * @param date - 日期对象或时间戳
 * @param format - 格式模式（默认 'YYYY-MM-DD HH:mm:ss'）
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  // 实现格式化逻辑...
  return d.toLocaleString('zh-CN')
}

/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
```

---

## 文档维护信息

- **创建人**: AI Migration Assistant
- **最后更新**: 2026-04-10
- **适用版本**: Vue 3.4+ / TypeScript 5.x / Vite 5.x
- **相关文档**:
  - [MIGRATION_MAPPING.md](./MIGRATION_MAPPING.md) - 组件映射表
  - [REACT_BUSINESS_LOGIC_ANALYSIS.md](./REACT_BUSINESS_LOGIC_ANALYSIS.md) - 业务逻辑分析

---

**祝迁移顺利！🚀 如有疑问请参考 Vue3 官方文档或联系技术支持。**
