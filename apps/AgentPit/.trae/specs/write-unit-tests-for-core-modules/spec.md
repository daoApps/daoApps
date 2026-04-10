# Layout、Chat、Marketplace 核心模块单元测试 - Product Requirement Document

## Overview
- **Summary**: 为 AgentPit 项目中的 Layout、Chat、Marketplace 三个核心模块的组件编写全面的单元测试，确保组件的主要功能、交互逻辑和边界情况都能得到验证。
- **Purpose**: 通过全面的单元测试提升代码质量，确保组件在不同状态和用户操作下的行为符合预期，降低后续重构和功能迭代时的回归风险。
- **Target Users**: 开发团队、测试团队和代码维护者。

## Goals
- 为 Layout 模块的核心组件（Header、MainLayout、Sidebar）编写完整的单元测试
- 为 Chat 模块的核心组件（ChatInterface、MessageInput、QuickCommands）编写完整的单元测试
- 为 Marketplace 模块的核心组件（ProductGrid、ProductDetail、ShoppingCart）编写完整的单元测试
- 测试覆盖组件的渲染输出、状态变化、事件处理等关键功能点
- 确保测试覆盖率达到项目设定的标准（lines: 80%, functions: 80%, branches: 75%, statements: 80%）
- 所有测试用例能够稳定通过，无随机失败情况

## Non-Goals (Out of Scope)
- 不修改组件的功能实现，仅针对现有功能编写测试
- 不涉及 E2E 测试（项目已有 Playwright E2E 测试）
- 不针对其他模块（如 Customize、Memory、Monetization 等）编写测试
- 不进行性能测试或安全测试

## Background & Context
- AgentPit 项目使用 Vue 3 + TypeScript + Vite 技术栈
- 测试框架使用 Vitest + @vue/test-utils + jsdom
- 项目已有部分测试文件（MessageList.spec.ts 等），需要遵循现有测试风格
- 项目配置了测试覆盖率报告（使用 @vitest/coverage-v8）
- 组件使用 Pinia 进行状态管理，测试需要正确配置 Pinia

## Functional Requirements
- **FR-1**: 为 Layout 模块的 Header 组件编写测试，验证导航、搜索、主题切换、用户菜单等功能
- **FR-2**: 为 Layout 模块的 MainLayout 组件编写测试，验证侧边栏展开/收起、布局渲染等功能
- **FR-3**: 为 Layout 模块的 Sidebar 组件编写测试，验证导航项渲染、移动端侧边栏等功能
- **FR-4**: 为 Chat 模块的 ChatInterface 组件编写测试，验证消息发送、侧边栏切换等功能
- **FR-5**: 为 Chat 模块的 MessageInput 组件编写测试，验证输入、发送、字符限制等功能
- **FR-6**: 为 Marketplace 模块的 ProductGrid 组件编写测试，验证商品渲染、添加购物车、收藏等功能
- **FR-7**: 测试文件遵循项目的代码风格和测试规范

## Non-Functional Requirements
- **NFR-1**: 测试运行时间小于 10 秒
- **NFR-2**: 所有测试用例在多次运行中稳定通过（无随机失败）
- **NFR-3**: 测试代码具有良好的可读性和可维护性
- **NFR-4**: 测试覆盖组件的主要流程和边界情况

## Constraints
- **Technical**: 必须使用 Vitest + @vue/test-utils + jsdom，不能引入新的测试框架
- **Business**: 必须在现有组件基础上编写测试，不能修改组件功能
- **Dependencies**: 测试需要依赖 Pinia、Vue Router 等现有库

## Assumptions
- 项目的现有测试配置（vitest.config.ts）是正确的
- 组件的现有功能是符合预期的
- 测试可以使用 mock 数据和 mock store
- 项目的 TypeScript 类型定义是完整的

## Acceptance Criteria

### AC-1: Layout 模块测试覆盖
- **Given**: Layout 模块有 Header、MainLayout、Sidebar 三个核心组件
- **When**: 运行 Layout 模块的测试文件
- **Then**: 所有测试用例通过，且组件的主要功能都被测试覆盖
- **Verification**: `programmatic`
- **Notes**: 测试应包括组件渲染、props 传递、事件触发、状态变化等

### AC-2: Chat 模块测试覆盖
- **Given**: Chat 模块有 ChatInterface、MessageInput 等核心组件
- **When**: 运行 Chat 模块的测试文件
- **Then**: 所有测试用例通过，且组件的主要功能都被测试覆盖
- **Verification**: `programmatic`
- **Notes**: 测试应包括消息输入、发送、字符限制、流式输出等

### AC-3: Marketplace 模块测试覆盖
- **Given**: Marketplace 模块有 ProductGrid 等核心组件
- **When**: 运行 Marketplace 模块的测试文件
- **Then**: 所有测试用例通过，且组件的主要功能都被测试覆盖
- **Verification**: `programmatic`
- **Notes**: 测试应包括商品渲染、添加购物车、收藏、导航等

### AC-4: 测试覆盖率达标
- **Given**: 所有测试文件已编写完成
- **When**: 运行 `npm run test:coverage`
- **Then**: 测试覆盖率报告显示达到或超过 thresholds（lines: 80%, functions: 80%, branches: 75%, statements: 80%）
- **Verification**: `programmatic`
- **Notes**: 针对 Layout、Chat、Marketplace 三个模块的组件

### AC-5: 测试稳定通过
- **Given**: 所有测试文件已编写完成
- **When**: 连续多次运行 `npm run test:run`
- **Then**: 所有测试用例每次都稳定通过，无随机失败
- **Verification**: `programmatic`
- **Notes**: 至少连续运行 3 次

### AC-6: 测试代码质量
- **Given**: 所有测试文件已编写完成
- **When**: 代码审查测试文件
- **Then**: 测试代码遵循项目的代码风格，具有良好的可读性和可维护性
- **Verification**: `human-judgment`
- **Notes**: 参考现有测试文件（如 MessageList.spec.ts）的风格

## Open Questions
- 无
