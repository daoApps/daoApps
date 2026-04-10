# Flexloop UI 组件库

Flexloop UI 是一个基于 Vue 3 和 Tailwind CSS 的现代化组件库，专为 Flexloop 项目设计。

## 特性

- 🎨 基于 Tailwind CSS 的设计系统
- 💪 Vue 3 Composition API
- 📦 TypeScript 支持
- 🔧 高度可定制
- 📚 完整的文档和示例

## 快速开始

### 安装

```bash
npm install @agentpit/ui
```

### 使用

```vue
<script setup>
import { Button } from '@agentpit/ui'
import '@agentpit/ui/styles'
</script>

<template>
  <Button variant="primary">Click me</Button>
</template>
```

## 组件列表

- Button - 按钮组件
- Card - 卡片组件
- Input - 输入框组件
- Avatar - 头像组件
- Badge - 徽章组件
- Modal - 模态框组件
- Dropdown - 下拉菜单组件
- Tabs - 标签页组件
- Loader - 加载组件
- Toast - 提示组件

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 文档开发
npm run docs:dev

# 文档构建
npm run docs:build
```
