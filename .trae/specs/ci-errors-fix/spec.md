# CI 错误修复 - Product Requirement Document

## Overview
- **Summary**: 修复 CI 流水线中记录的所有错误，包括缺失文件和失败的测试用例，确保所有 CI 检查能够通过。
- **Purpose**: 解决当前 CI 流水线中的错误，提高构建稳定性和测试覆盖率，确保代码质量。
- **Target Users**: 开发团队、DevOps 工程师

## Goals
- 修复所有缺失的文件和依赖
- 修复所有失败的测试用例
- 确保完整 CI 流程能够 100% 通过
- 更新错误处理状态和解决方案说明

## Non-Goals (Out of Scope)
- 不会重写或重构核心业务逻辑代码
- 不会添加新的功能或特性
- 不会大幅修改现有的测试架构

## Background & Context
- CI 流水线当前存在 6 个失败的测试套件
- 其中 3 个是由于缺失文件导致的导入错误
- 另外 3 个是由于测试逻辑与实际代码不匹配导致的失败
- 这些错误需要在 CI 流程中修复，以确保代码质量和构建稳定性

## Functional Requirements
- **FR-1**: 创建缺失的 mockCustomize.ts 文件
- **FR-2**: 修复 MessageList.spec.ts 中的时间戳测试
- **FR-3**: 修复 useChatStore 中的 deleteConversation 逻辑
- **FR-4**: 修复 SphinxComponents.spec.ts 中的按钮测试

## Non-Functional Requirements
- **NFR-1**: 修复后的 CI 运行时间不超过 5 分钟
- **NFR-2**: 所有测试用例必须 100% 通过，无任何失败或警告
- **NFR-3**: 修复方案必须符合项目的代码风格和 lint 规则

## Constraints
- **Technical**: 必须使用现有的测试框架和代码结构
- **Business**: 修复工作应在 1 个工作日内完成

## Assumptions
- 假设缺失的组件文件（MeetingCalendar.vue 和 UserProfileSettings.vue）是暂时缺失或已被移动
- 假设修复方案不会破坏现有功能

## Acceptance Criteria

### AC-1: 缺失文件修复
- **Given**: CI 运行时缺少 mockCustomize.ts 文件
- **When**: 创建缺失的 mockCustomize.ts 文件
- **Then**: 导入错误应被解决，相关测试套件应能正常运行
- **Verification**: `programmatic`

### AC-2: MessageList 时间戳测试修复
- **Given**: MessageList.spec.ts 测试期望 4+ 个时间戳元素但实际只找到 2 个
- **When**: 更新测试断言以匹配实际 DOM 渲染
- **Then**: MessageList 相关测试应通过
- **Verification**: `programmatic`

### AC-3: useChatStore deleteConversation 逻辑修复
- **Given**: deleteConversation 操作后 activeConversationId 为 null 而不是预期值
- **When**: 更新 deleteConversation 逻辑以正确处理 activeConversationId
- **Then**: useChatStore 相关测试应通过
- **Verification**: `programmatic`

### AC-4: SphinxComponents 按钮测试修复
- **Given**: SphinxComponents.spec.ts 测试按钮文本断言失败
- **When**: 更新测试以正确定位和检查按钮元素
- **Then**: SphinxComponents 相关测试应通过
- **Verification**: `programmatic`

### AC-5: 完整 CI 流程通过
- **Given**: 所有修复已实施
- **When**: 触发完整 CI 流程
- **Then**: 所有 CI 步骤应 100% 通过
- **Verification**: `programmatic`

### AC-6: 错误处理状态更新
- **Given**: 所有错误已修复
- **When**: 更新 CI_error.md 文件
- **Then**: 文件应包含所有错误的处理状态和解决方案
- **Verification**: `human-judgment`

## Open Questions
- [ ] 缺失的 MeetingCalendar.vue 和 UserProfileSettings.vue 文件是否需要创建？
- [ ] 修复方案是否会影响其他测试用例？