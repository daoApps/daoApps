# daoApps Monorepo 包配置规范

## 概述

本文档定义了将 `d:\xinet\daoCollective\daoApps\daoApps\tools\DeepResearch` 和 `d:\xinet\daoCollective\daoApps\daoApps\tools\flexloop` 配置为本项目 monorepo 包的规范。该配置参考了 `pdm-example-monorepo` 项目的配置模式。

## 为什么

为了更好地管理项目中的 Python 工具包，需要将 DeepResearch 和 flexloop 配置为 monorepo 结构，确保：
1. 包之间的依赖关系清晰明确
2. 包可以作为独立模块被正确引用
3. 统一的依赖管理和构建流程
4. 符合 PDM monorepo 最佳实践

## 什么会改变

- **修改**: 项目根目录的 `pyproject.toml` 文件，添加 monorepo 包配置
- **新增**: 开发依赖配置，使用 `-e` 可编辑模式引用本地包
- **新增**: 确保包路径映射正确
- **新增**: 验证配置的完整性和正确性

## 影响

- **受影响的项目**: daoApps 根项目、DeepResearch、flexloop
- **受影响的工作流**: Python 依赖管理、包引用、开发流程
- **兼容性**: 需要 PDM 2.0+ 版本

## 新增需求

### 需求 1: Monorepo 包配置
系统应在根项目的 pyproject.toml 中配置 DeepResearch 和 flexloop 作为本地可编辑包。

#### 场景: 包引用
- **WHEN** 配置 monorepo 包
- **THEN** 应在 `[tool.pdm.dev-dependencies]` 中添加以下配置：
  - `-e deepresearch @ file:///${PROJECT_ROOT}/tools/DeepResearch`
  - `-e taolib @ file:///${PROJECT_ROOT}/tools/flexloop`

### 需求 2: 包路径验证
系统应确保包的路径映射正确，能够被 PDM 正确识别。

#### 场景: 路径验证
- **WHEN** 验证包路径
- **THEN** 包路径应指向包含有效 pyproject.toml 文件的目录
- **THEN** 包应使用可编辑模式安装

### 需求 3: 依赖关系管理
系统应确保包之间的依赖关系正确配置。

#### 场景: 依赖管理
- **WHEN** 管理包依赖
- **THEN** 根项目应能正确解析和安装所有包的依赖
- **THEN** 包之间的依赖应使用相对路径引用

## 参考配置

### 参考项目: pdm-example-monorepo
- 使用 `[tool.pdm.dev-dependencies]` 配置本地包
- 使用 `-e` 可编辑模式
- 使用 `file:///${PROJECT_ROOT}/` 路径格式
- 简洁的依赖配置

## 配置文件结构

```toml
[project]
dependencies = []
requires-python = ">=3.14"

[tool.pdm.dev-dependencies]
dev = [
    "-e deepresearch @ file:///${PROJECT_ROOT}/tools/DeepResearch",
    "-e taolib @ file:///${PROJECT_ROOT}/tools/flexloop",
]

# 其他现有配置...
```
