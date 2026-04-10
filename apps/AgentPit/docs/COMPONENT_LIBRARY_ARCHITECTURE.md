# AgentPit 组件库架构设计文档

## 1. 概述

### 1.1 设计目标

AgentPit UI 组件库旨在为 AgentPit 项目提供一套统一、可复用、可维护的 Vue 3 组件体系，具有以下核心目标：

- **高复用性**：组件设计遵循单一职责原则，可在多个场景中复用
- **可维护性**：清晰的目录结构和代码组织，便于团队协作和维护
- **可扩展性**：组件提供灵活的配置和扩展点，支持自定义和主题定制
- **类型安全**：完整的 TypeScript 类型定义，提供良好的开发体验
- **文档完善**：组件使用文档、示例和 API 参考

### 1.2 技术栈

- **框架**：Vue 3 (Composition API)
- **样式**：Tailwind CSS 4.x
- **构建工具**：Vite
- **类型系统**：TypeScript
- **组件变体管理**：class-variance-authority (CVA)
- **样式合并**：clsx + tailwind-merge
- **文档**：VitePress
- **版本管理**：Semantic Versioning (语义化版本)

---

## 2. 目录结构

### 2.1 完整目录结构

```
packages/ui/
├── src/
│   ├── components/              # 组件目录
│   │   ├── Button/              # 按钮组件
│   │   │   ├── Button.vue       # 组件实现
│   │   │   ├── Button.types.ts  # 类型定义
│   │   │   └── index.ts         # 组件导出
│   │   ├── Card/                # 卡片组件
│   │   ├── Input/               # 输入框组件
│   │   ├── Avatar/              # 头像组件
│   │   ├── Badge/               # 徽章组件
│   │   ├── Modal/               # 模态框组件
│   │   ├── Dropdown/            # 下拉菜单组件
│   │   ├── Tabs/                # 标签页组件
│   │   ├── Loader/              # 加载组件
│   │   ├── Toast/               # 提示组件
│   │   └── index.ts             # 组件统一导出
│   ├── composables/             # 组合式函数
│   │   ├── useToggle.ts         # 开关状态管理
│   │   ├── useClickOutside.ts   # 点击外部检测
│   │   ├── useDebounce.ts       # 防抖
│   │   ├── useKeyPress.ts       # 键盘事件
│   │   ├── useLocalStorage.ts   # 本地存储
│   │   ├── useMediaQuery.ts     # 媒体查询
│   │   └── index.ts             # 统一导出
│   ├── types/                   # 类型定义
│   │   ├── common.ts            # 通用类型
│   │   ├── component.ts         # 组件基类类型
│   │   └── index.ts             # 类型统一导出
│   ├── utils/                   # 工具函数
│   │   ├── cn.ts                # 类名合并工具
│   │   ├── context.ts           # 上下文创建工具
│   │   ├── format.ts            # 格式化工具
│   │   ├── id.ts                # ID 生成器
│   │   └── index.ts             # 工具统一导出
│   ├── styles/                  # 样式系统
│   │   ├── tokens.ts            # 设计令牌
│   │   ├── theme.ts             # 主题配置
│   │   └── index.ts             # 样式导出
│   └── index.ts                 # 库入口文件
├── docs/                        # 文档目录 (VitePress)
│   ├── .vitepress/
│   │   └── config.ts            # VitePress 配置
│   ├── guide/                   # 指南文档
│   │   ├── getting-started.md
│   │   ├── installation.md
│   │   └── theming.md
│   ├── components/              # 组件文档
│   │   ├── button.md
│   │   ├── card.md
│   │   └── ...
│   └── index.md                 # 文档首页
├── package.json                 # 包配置
├── vite.config.ts               # Vite 构建配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
├── tsconfig.node.json           # Node TypeScript 配置
├── README.md                    # 项目说明
├── CHANGELOG.md                 # 变更日志
└── .gitignore
```

### 2.2 目录结构说明

#### 2.2.1 组件目录结构 (`src/components/`)

每个组件采用独立文件夹的组织方式，包含以下文件：

```
ComponentName/
├── ComponentName.vue       # 组件实现
├── ComponentName.types.ts  # Props、Emits 等类型定义
└── index.ts                # 组件导出
```

**设计原则**：
- 每个组件独立管理，职责明确
- 类型定义与组件实现分离，便于类型导出
- 统一通过 `index.ts` 导出，保持入口一致性

#### 2.2.2 组合式函数 (`src/composables/`)

存放可复用的 Vue 组合式函数，遵循以下原则：
- 以 `use` 前缀命名
- 单一职责，每个 composable 只做一件事
- 良好的类型定义
- 可独立测试

#### 2.2.3 类型定义 (`src/types/`)

- `common.ts`：通用类型（Size、Variant、Shape 等）
- `component.ts`：组件基础类型（BaseComponentProps 等）
- 各组件的类型定义放在各自组件目录下

#### 2.2.4 工具函数 (`src/utils/`)

- `cn.ts`：基于 clsx + tailwind-merge 的类名合并工具
- `context.ts`：Vue 上下文创建工具
- `format.ts`：日期、数字、货币格式化
- `id.ts`：唯一 ID 生成器

#### 2.2.5 样式系统 (`src/styles/`)

- `tokens.ts`：设计令牌（颜色、间距、圆角、阴影、断点等）
- `theme.ts`：主题配置
- `tailwind.config.ts`：Tailwind CSS 配置，引用设计令牌

---

## 3. 样式系统设计

### 3.1 设计令牌 (Design Tokens)

设计令牌是样式系统的基础，定义了所有可复用的设计值。

#### 3.1.1 颜色系统

```typescript
// src/styles/tokens.ts
export const colors = {
  primary: { 50, 100, ..., 900 },    // 主色调（蓝色系）
  accent: { 50, 100, ..., 900 },     // 强调色（紫色系）
  success: { 50, 100, ..., 900 },    // 成功色（绿色系）
  warning: { 50, 100, ..., 900 },    // 警告色（黄色系）
  danger: { 50, 100, ..., 900 },     // 危险色（红色系）
  gray: { 50, 100, ..., 900 },       // 灰度
}
```

#### 3.1.2 间距系统

```typescript
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  // ... 更多间距
}
```

#### 3.1.3 其他设计令牌

- `borderRadius`：圆角尺寸
- `shadows`：阴影层级
- `breakpoints`：响应式断点

### 3.2 Tailwind CSS 配置

```typescript
// packages/ui/tailwind.config.ts
import { colors, spacing, borderRadius, shadows, breakpoints } from './src/styles/tokens'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      boxShadow: shadows,
      screens: breakpoints,
    },
  },
}
```

### 3.3 组件样式实现

使用 `class-variance-authority (CVA)` 管理组件变体：

```typescript
// Button.vue 示例
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-accent-500 text-white hover:bg-accent-600',
        outline: 'border-2 border-gray-300 bg-transparent',
        // ... 更多变体
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        // ... 更多尺寸
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

使用 `cn` 工具函数合并类名：

```typescript
const buttonClasses = computed(() => cn(
  buttonVariants({ variant: props.variant, size: props.size }),
  props.block && 'w-full',
  props.class
))
```

---

## 4. 类型定义导出机制

### 4.1 类型组织原则

- **集中管理**：通用类型放在 `src/types/` 下
- **组件类型**：每个组件的类型定义放在组件目录下的 `ComponentName.types.ts`
- **统一导出**：通过 `index.ts` 文件统一导出所有类型

### 4.2 类型导出结构

#### 4.2.1 库入口类型导出

```typescript
// src/index.ts
export * from './components'
export * from './composables'
export * from './types'
export * from './utils'
export * from './styles'
```

#### 4.2.2 组件类型导出

```typescript
// src/components/Button/Button.types.ts
import type { BaseButtonProps } from '../../types/component'

export type ButtonVariant = 'default' | 'primary' | 'secondary' | ...
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  // ... 其他 props
}
```

#### 4.2.3 组件统一导出

```typescript
// src/components/index.ts
export { default as Button } from './Button/Button.vue'
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button.types'

export { default as Card } from './Card/Card.vue'
export type { CardProps, CardVariant } from './Card/Card.types'
// ... 更多组件
```

### 4.3 使用示例

```typescript
// 在项目中使用
import { Button, type ButtonProps } from '@agentpit/ui'

// 类型安全
const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'lg',
}
```

---

## 5. 文档生成方案

### 5.1 文档技术选型

- **文档框架**：VitePress
- **优势**：
  - 基于 Vite，构建速度快
  - 原生支持 Vue 组件
  - Markdown 编写，简单易用
  - 支持代码高亮和主题定制

### 5.2 文档结构

```
docs/
├── index.md                 # 首页
├── guide/
│   ├── getting-started.md   # 快速开始
│   ├── installation.md      # 安装指南
│   └── theming.md           # 主题定制
└── components/
    ├── button.md            # Button 组件文档
    ├── card.md              # Card 组件文档
    └── ...
```

### 5.3 组件文档模板

每个组件文档包含以下部分：

```markdown
# Button 按钮

## 基础用法

<DemoButtonBasic />

## 不同变体

<DemoButtonVariants />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | ButtonVariant | 'primary' | 按钮变体 |
| size | ButtonSize | 'md' | 按钮尺寸 |
| ... | ... | ... | ... |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | MouseEvent | 点击事件 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
```

### 5.4 文档命令

```json
// package.json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",      // 文档开发
    "docs:build": "vitepress build docs",  // 文档构建
    "docs:preview": "vitepress preview docs" // 文档预览
  }
}
```

---

## 6. 版本管理机制

### 6.1 语义化版本 (Semantic Versioning)

遵循 [SemVer 2.0.0](https://semver.org/) 规范：

- **主版本号 (MAJOR)**：不兼容的 API 修改
- **次版本号 (MINOR)**：向下兼容的功能性新增
- **修订号 (PATCH)**：向下兼容的问题修正

### 6.2 版本发布流程

1. **更新 CHANGELOG.md**：记录本次发布的变更
2. **更新 package.json 版本号**
3. **构建测试**：确保所有测试通过
4. **打 Git 标签**：`git tag vx.y.z`
5. **发布到 npm**：`npm publish`

### 6.3 变更日志 (CHANGELOG.md)

采用 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- 新增 Card 组件
- 新增 Avatar 组件

### Changed
- Button 组件支持 loading 状态

### Fixed
- 修复 Input 组件在 IE11 下的兼容性问题

## [1.1.0] - 2024-01-01

### Added
- 初始版本发布
- Button、Input 组件
```

### 6.4 分支策略

- `main`：稳定版本，对应 npm 最新版本
- `develop`：开发分支，包含最新功能
- `feature/*`：功能分支，从 develop 切出
- `hotfix/*`：热修复分支，从 main 切出

---

## 7. 设计原则

### 7.1 组件设计原则

#### 7.1.1 单一职责原则 (SRP)

每个组件只负责一件事，功能明确。

#### 7.1.2 开闭原则 (OCP)

组件对扩展开放，对修改关闭。通过 Props、Slots、Events 提供扩展点。

#### 7.1.3 依赖倒置原则 (DIP)

组件不依赖具体实现，而是依赖抽象。

### 7.2 组件 API 设计原则

#### 7.2.1 Props 设计

- 使用 TypeScript 严格类型定义
- 提供合理的默认值
- Props 命名语义化
- 避免过多 Props，考虑组合

#### 7.2.2 Events 设计

- 事件命名使用 kebab-case
- 事件参数保持简洁
- 提供 preventDefault/stopPropagation 控制

#### 7.2.3 Slots 设计

- 提供默认插槽
- 命名插槽语义化
- 作用域插槽传递必要数据

### 7.3 代码风格规范

#### 7.3.1 文件命名

- 组件文件：PascalCase（`Button.vue`）
- 类型文件：`ComponentName.types.ts`
- 组合式函数：camelCase（`useToggle.ts`）
- 工具函数：camelCase（`format.ts`）

#### 7.3.2 代码格式

- 使用 Prettier 统一格式化
- 使用 ESLint 进行代码检查
- 遵循 Vue 3 风格指南

---

## 8. 高复用性、可维护性、可扩展性设计

### 8.1 高复用性设计

#### 8.1.1 组件分层

- **原子组件**：Button、Input、Avatar 等基础组件
- **分子组件**：由原子组件组合而成（如 SearchInput = Input + Button）
- **组织组件**：页面级组件，由分子组件组成

#### 8.1.2 组合式函数复用

将通用逻辑抽取为 composables：

```typescript
// useToggle.ts - 可在多个组件中复用
export function useToggle(initialValue = false) {
  const value = ref(initialValue)
  const toggle = () => { value.value = !value.value }
  return { value, toggle }
}
```

#### 8.1.3 工具函数复用

提供通用的工具函数库。

### 8.2 可维护性设计

#### 8.2.1 清晰的目录结构

每个组件独立文件夹，职责明确。

#### 8.2.2 完整的类型定义

TypeScript 类型提供良好的开发体验和代码提示。

#### 8.2.3 组件文档化

每个组件都有完整的使用文档和示例。

#### 8.2.4 测试覆盖

- 单元测试：测试组件逻辑
- 组件测试：测试组件渲染和交互

### 8.3 可扩展性设计

#### 8.3.1 主题定制

通过 Tailwind CSS 配置支持主题定制：

```typescript
// 自定义主题
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#your-color',
        },
      },
    },
  },
}
```

#### 8.3.2 组件扩展

通过 Props、Slots、提供组件扩展点：

```vue
<template>
  <Button>
    <template #icon>
      <CustomIcon />
    </template>
    自定义按钮
  </Button>
</template>
```

#### 8.3.3 类名覆盖

支持通过 `class` prop 覆盖组件样式：

```vue
<Button class="custom-button-class" />
```

---

## 9. 构建和发布

### 9.1 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AgentPitUI',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})
```

### 9.2 类型声明

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./dist"
  }
}
```

### 9.3 发布配置

```json
// package.json
{
  "name": "@agentpit/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles/index.css"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  }
}
```

---

## 10. 总结

AgentPit UI 组件库架构设计围绕以下核心要点：

1. **清晰的目录结构**：组件、类型、工具、样式分层管理
2. **完整的样式系统**：基于设计令牌的 Tailwind CSS 配置
3. **类型安全**：完整的 TypeScript 类型定义和导出机制
4. **完善的文档**：VitePress 文档系统，提供组件使用指南
5. **规范的版本管理**：语义化版本 + CHANGELOG
6. **优秀的设计原则**：高复用性、可维护性、可扩展性

通过这套架构设计，AgentPit UI 组件库将为 AgentPit 项目提供坚实的 UI 基础，支持快速开发和长期维护。
