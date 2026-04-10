# AgentPit Vue3 重构 - API 变更日志

## 📋 文档说明

本文档记录了从 **React 技术栈** 迁移到 **Vue3 技术栈** 过程中的所有 API 接口变更，包括：
- 框架级 API 变更（React → Vue3）
- 第三方库 API 变更
- 内部接口变更（Store/Composable/Types）
- 破坏性变更（Breaking Changes）
- 新增 API 接口

**版本**: v3.0.0-vue3-rewrite
**日期**: 2026-04-10
**适用范围**: AgentPit 前端应用全部代码

---

## 一、框架级 API 变更 (React → Vue3)

### 1.1 组件定义

| React API | Vue3 API | 变更类型 | 示例 |
|-----------|---------|---------|------|
| `function Component() {}` | `defineComponent()` 或 `<script setup>` | 语法变更 | SFC 替代 JSX |
| `useState()` | `ref()` / `reactive()` | API 变更 | 响应式系统不同 |
| `useEffect()` | `onMounted()` / `onUnmounted()` / `watch()` | API 变更 | 生命周期钩子 |
| `useContext()` | `inject()` | API 变更 | 跨组件通信 |
| `useCallback()` | computed / 普通函数 | API 变更 | Vue 自动缓存 |
| `useMemo()` | `computed()` | API 变更 | 计算属性 |
| `useRef()` | `ref()` / `templateRef` | API 变更 | DOM 引用 |
| `useState({reducer})` | Pinia Store (`defineStore`) | 架构变更 | 状态管理方案改变 |
| `React.createContext()` | `provide()` / `inject()` | API 变更 | 依赖注入模式 |
| `forwardRef()` | `defineExpose()` + `refs` | API 变更 | 组件暴露方法 |
| `Children` props | `<slot>` | 语法变更 | 插槽机制 |

### 1.2 模板语法

| React (JSX) | Vue3 (Template) | 说明 |
|-------------|------------------|------|
| `{expression}` | `{{ expression }}` | 插值语法 |
| `className="xxx"` | `class="xxx"` 或 `:class="{xxx}"` | 类名绑定 |
| `style={{color: 'red'}}` | `:style="{ color: 'red' }"` | 样式绑定 |
| `onClick={handler}` | `@click="handler"` | 事件绑定 |
| `onChange={handler}` | `@change="handler"` / `v-model` | 双向绑定 |
| `{items.map(item => <Item />)}` | `v-for="item in items"` | 列表渲染 |
| `{condition && <Comp />}` | `v-if="condition"` | 条件渲染 |
| `<Component ref={ref} />` | `<Component ref="ref" />` | 模板引用 |
| `<>...</>` (Fragment) | `<template>...</template>` 或根元素 | 片段 |
| `dangerouslySetInnerHTML` | `v-html` (需谨慎) | HTML 渲染 |

### 1.3 生命周期

| React Lifecycle | Vue3 Lifecycle (Options API) | Vue3 Lifecycle (Composition API) | 说明 |
|-----------------|----------------------------|------------------------------|------|
| `constructor()` | `beforeCreate()` | - | 实例初始化 |
| `componentDidMount()` | `mounted()` | `onMounted()` | DOM 挂载完成 |
| `componentDidUpdate()` | `updated()` | `onUpdated()` | 更新完成 |
| `componentWillUnmount()` | `unmounted()` | `onUnmounted()` | 卸载前清理 |

### 1.4 路由 API

| React Router API | Vue Router API | 说明 |
|-----------------|---------------|------|
| `<BrowserRouter>` | `createRouter(createWebHistory())` | 路由器创建 |
| `<Routes><Route />` | `router-view` + routes 配置 | 路由配置 |
| `<Link to="/path">` | `<RouterLink to="/path">` | 导航链接 |
| `useNavigate()` | `useRouter().push()` | 编程式导航 |
| `useParams()` | `useRoute().params` | 路由参数 |
| `<Outlet />` | `<RouterView />` | 嵌套路由出口 |
| `<Navigate to="..." />` | `router.replace()` | 重定向 |
| `lazy(() => import())` | `defineAsyncComponent(() => import())` | 懒加载 |

---

## 二、状态管理 API 变更 (Redux → Pinia)

### 2.1 Store 定义

```typescript
// ❌ Redux (Old)
const appSlice = createSlice({
  name: 'app',
  initialState: { sidebarOpen: false },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen }
  }
})
export const { toggleSidebar } = appSlice.actions
export default appSlice.reducer

// ✅ Pinia (New)
export const useAppStore = defineStore('app', {
  state: () => ({ sidebarOpen: false }),
  actions: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen }
  },
  getters: {
    isSidebarOpen: (state) => state.sidebarOpen
  }
})
```

### 2.2 Store 使用

| Redux API | Pinia API | 示例 |
|-----------|----------|------|
| `useSelector(state => state.app.sidebarOpen)` | `const appStore = useAppStore(); appStore.sidebarOpen` | 读取状态 |
| `dispatch(toggleSidebar())` | `appStore.toggleSidebar()` | 触发 action |
| `useDispatch()` | `useAppStore()` (直接调用) | 获取 dispatch |
| `connect(mapStateToProps)` | `storeToRefs(appStore)` | 组件连接 |
| `createSelector()` | `computed(() => ...)` | 派生状态 |
| `combineReducers()` | 多个 Store 文件 | Store 组合 |
| `redux-thunk` | `async/await` in actions | 异步 action |
| `redux-persist` | `pinia-plugin-persistedstate` | 持久化 |

### 2.3 DevTools

| Redux | Pinia |
|-------|-------|
| Redux DevTools Extension | Vue DevTools (Pinia Tab) |
| Time Travel Debugging | State Inspection |
| Action Logging | Mutation Tracking |

---

## 三、第三方库 API 变更

### 3.1 ECharts

| React (echarts-for-react) | Vue3 (vue-echarts) | 变更说明 |
|--------------------------|---------------------|---------|
| `<ReactECharts option={option} />` | `<v-chart :option="option" />` | 组件名和 prop 不同 |
| `ref.current.getEchartsInstance()` | `chartRef.value` (template ref) | 实例获取方式 |
| `useResizeObserver` | 自动响应式 (默认) | 尺寸自适应 |

### 3.2 表单验证

| React (Formik + Yup) | Vue3 (VeeValidate + Yup) | 变更说明 |
|---------------------|------------------------|---------|
| `<Formik initialValues={...}>` | `<Form :initial-values="...">` | 包裹组件 |
| `<Field name="email" />` | `<Field name="email" v-slot="...">` | 字段组件 |
| `<ErrorMessage name="email" />` | `<ErrorMessage name="email" />` | 错误显示 |
| `yup.object().shape({...})` | `yup.object().shape({...})` | Schema 定义 (相同) |
| `handleSubmit(values)` | `onSubmit(values)` | 提交处理 |

### 3.3 Markdown 渲染

| React (react-markdown) | Vue3 (marked + DOMPurify) | 变更说明 |
|----------------------|--------------------------|---------|
| `<ReactMarkdown>{markdown}</ReactMarkdown>` | `<div v-html="renderedMarkdown"></div>` | 渲染方式 |
| 自动 XSS 防护 | 手动 `DOMPurify.sanitize()` | 安全处理 |
| remarkPlugins/gfmPlugins | marked options | 插件配置 |

### 3.4 CSS 方案

| React (CSS Modules/Styled Components) | Vue3 (Tailwind CSS v4) | 变更说明 |
|--------------------------------------|----------------------|---------|
| `import styles from './App.module.css'` | 直接使用 utility classes | 导入方式 |
| `.className { color: red }` | `<div class="text-red-500">` | 类名使用 |
| `styled.div\`\`` | `<div :class="[conditional, 'static']">` | 动态样式 |
| CSS-in-JS runtime cost | JIT compile time (zero runtime) | 性能影响 |
| Scoped styles by default | Utility-first (global but conflict-free) | 作用域 |

---

## 四、内部接口变更

### 4.1 Type System 变更

#### 枚举类型重构 (Breaking Change)

```typescript
// ❌ Before (enum - 不兼容 erasableSyntaxOnly)
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
// Usage: Status.ACTIVE

// ✅ After (const object + type)
export const Status = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const
export type Status = (typeof Status)[keyof typeof Status]
// Usage: Status.ACTIVE (same usage, compatible)
```

**影响的枚举**:
1. `Status` (types/common.ts) - 7 个值
2. `ModuleCategory` (types/module.ts) - N 个值
3. `TransactionCategory` (types/monetization.ts) - 8 个值

#### 类型重命名 (Breaking Change)

```typescript
// ❌ Before (conflicts with built-in)
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>

// ✅ After (renamed to avoid circular reference)
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
```

```typescript
// ❌ Before (duplicate export)
export interface UserProfile { /* social fields */ }  // in social.ts
export interface UserProfile { /* user fields */ }     // in user.ts

// ✅ After (renamed)
export interface SocialProfile { /* social fields */ } // in social.ts
export interface UserProfile { /* user fields */ }      // in user.ts (kept)
```

### 4.2 Store Interface 扩展 (Non-Breaking)

```typescript
// useAppStore 新增的属性和方法:
interface AppState {
  // 已有:
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  isLoading: boolean
  currentPage: string
  
  // 新增:
  mobileSidebarOpen: boolean  // 移动端侧边栏状态
}

// 新增 Getters:
isMobileSidebarOpen: boolean
isDarkTheme: boolean  // 注意: 原 isDarkMode → isDarkTheme

// 新增 Actions:
setMobileSidebarOpen(open: boolean): void
toggleMobileSidebar(): void
toggleDarkMode(): void
applyTheme(): void  // private method
```

### 4.3 Composable 接口 (New)

```typescript
// composables/useTypewriter.ts
export function useTypewriter(): {
  text: Ref<string>
  isTyping: Ref<boolean>
  startTyping: (content: string, speed?: number) => void
  stopTyping: () => void
}

// composables/useDebounce.ts
export function useDebounce<T>(fn: T, delay: number): T
// Usage: const debouncedSearch = useDebounce(searchFunction, 300)
```

---

## 五、破坏性变更清单 (Breaking Changes)

### 5.1 必须手动处理的变更

| # | 变更项 | 影响范围 | 处理方式 | 优先级 |
|---|--------|---------|---------|--------|
| BC-1 | `Status.ACTIVE` 用法不变，但类型定义变为 const object | 所有使用 Status 的文件 | 无需代码更改（API 兼容） | 🟢 低 |
| BC-2 | `Required<T,K>` → `RequiredFields<T,K>` | types/common.ts 消费者 | 全局搜索替换 | 🔴 高 |
| BC-3 | `UserProfile` (social) → `SocialProfile` | social 相关组件 | 类型 import 更新 | 🔴 高 |
| BC-4 | `appStore.isDarkMode` → `appStore.isDarkTheme` | Header.vue 等 | 属性名更新 | 🟡 中 |
| BC-5 | `require()` 不可用 (ESM only) | AgentCreatorWizard, AgentPreview | 改为 static import | 🔴 高 |
| BC-6 | `alert()` 不是全局函数 | SiteWizard.vue | 改为 `window.alert()` | 🟡 中 |

### 5.2 已自动处理的变更

以下变更已在迁移过程中完成，无需额外操作：

- ✅ All enum → const object conversions (3 处)
- ✅ All `require()` → `import` (2 处)
- ✅ All `isDarkMode` → `isDarkTheme` (已修复)
- ✅ All `UserProfile` → `SocialProfile` imports (已更新)
- ✅ Store interface extensions (已实现)

---

## 六、新增 API 接口 (Additions)

### 6.1 新增 Composables

| Composable | 文件路径 | 功能描述 |
|-----------|---------|---------|
| `useTypewriter()` | src/composables/useTypewriter.ts | 流式输出打字机效果 |
| `useDebounce()` | src/composables/useDebounce.ts | 防抖输入封装 |
| `useTheme()` | src/composables/useTheme.ts | 主题切换逻辑 (如存在) |
| `useLocalStorage()` | src/composables/useLocalStorage.ts | localStorage 封装 (如存在) |
| `useMediaQuery()` | src/composables/useMediaQuery.ts | 响应式媒体查询 (如存在) |

### 6.2 新增 Store 方法

| Store | 新增方法/属性 | 功能 |
|------|--------------|------|
| useAppStore | `mobileSidebarOpen` | 移动端侧边栏状态 |
| useAppStore | `setMobileSidebarOpen()` | 设置移动端侧边栏 |
| useAppStore | `toggleMobileSidebar()` | 切换移动端侧边栏 |
| useAppStore | `toggleDarkMode()` | 切换暗色模式 |
| useAppStore | `applyTheme()` | 应用主题到 DOM |
| useMonetizationStore | 类型安全的 Currency/TransactionCategory | Wallet 数据 cast |

### 6.3 新增组件 Props/Events

| 组件 | 新增 Props | 新增 Events |
|------|-----------|------------|
| AbilityConfigurator | - | `update:abilities` (typed) |
| AppearanceCustomizer | - | `update:appearance` (typed) |
| BusinessModelSetup | - | `update:businessModel` (typed) |
| Multiple Modals | - | Teleport-based global events |

---

## 七、废弃 API (Deprecated)

以下 React API 在 Vue3 版本中不再使用：

| 废弃 API | 替代方案 | 说明 |
|---------|---------|------|
| `useState()` | `ref()` / `reactive()` | Vue 响应式系统 |
| `useEffect()` | `onMounted()` / `watch()` | 生命周期钩子 |
| `useContext()` | `inject()` | 依赖注入 |
| `connect()` | `storeToRefs()` | Store 连接 |
| `dispatch()` | Store actions direct call | Action 调用 |
| `createSelector()` | `computed()` | 派生状态 |
| `Redux DevTools` | Vue DevTools | 调试工具 |
| `React.lazy()` | `defineAsyncComponent()` | 懒加载 |
| `Suspense` (React) | `Suspense` (Vue) | 异步边界 (API 不同) |
| `ReactDOM.createPortal()` | `<Teleport>` | Portal 传送 |
| `CSS Modules` | Tailwind CSS | 样式方案 |
| `styled-components` | Utility classes + scoped style | CSS-in-JS |
| `Formik` | VeeValidate | 表单库 |
| `react-markdown` | marked + DOMPurify | Markdown |
| `echarts-for-react` | vue-echarts | 图表封装 |

---

## 八、兼容性矩阵

### 8.1 浏览器兼容性

| 浏览器 | React 版本支持 | Vue3 版本支持 | 备注 |
|--------|--------------|---------------|------|
| Chrome | 90+ | 90+ | ✅ 相同 |
| Firefox | 88+ | 88+ | ✅ 相同 |
| Safari | 14+ | 14+ | ✅ 相同 |
| Edge | 90+ | 90+ | ✅ 相同 |
| Mobile Chrome | 最新 | 最新 | ✅ 相同 |
| Mobile Safari | iOS 14+ | iOS 14+ | ✅ 相同 |

### 8.2 Node.js 版本要求

| 工具 | React 版本 | Vue3 版本 | 说明 |
|------|-----------|----------|------|
| Node.js | >= 14.x | >= 18.x (推荐 20.x) | Vite 要求更高版本 |
| npm | >= 6.x | >= 8.x | pnpm 也支持 |
| pnpm | 可选 | 推荐 | 更快的包管理器 |

### 8.3 TypeScript 版本

| 配置 | React 版本 | Vue3 版本 |
|------|-----------|----------|
| TS Version | ~4.x-5.x | ~6.0.2 |
| strict mode | 可选 | ✅ 强制开启 |
| erasableSyntaxOnly | 不适用 | ✅ 开启 (Vite 要求) |

---

## 九、迁移检查清单

对于从 React 版本升级到 Vue3 版本的开发者：

### 必读文档
- [ ] 本变更日志 (API changes)
- [ ] 组件迁移清单 (component-migration-checklist.md)
- [ ] 完整迁移报告 (vue3-rewrite-report.md)

### 代码更新要点
- [ ] 将所有 `import { UserProfile }` (social) 改为 `SocialProfile`
- [ ] 将所有 `Required<..., ...>` 改为 `RequiredFields<..., ...>`
- [ ] 将所有 `appStore.isDarkMode` 改为 `appStore.isDarkTheme`
- [ ] 确认无 `require()` 调用（ESM only）
- [ ] 确认无 `alert()` 直接调用（改用 `window.alert()`）

### 测试验证
- [ ] 运行 `npm run type-check` 确认零错误
- [ ] 运行 `npm run lint` 确认零 warnings
- [ ] 运行 `npm run test` 确认测试通过
- [ ] 手动验证核心页面功能正常

---

## 十、版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0.0 | 2026-04-10 | 初始版本，完整记录 Phase 0-6 所有 API 变更 | AgentPit Team |

---

**文档维护人**: 项目开发团队
**反馈渠道**: 通过 `.trae/issues/` 提交 issue 或在复盘会议讨论
**下次更新**: Phase 8-9 完成后或重大 API 变更时
