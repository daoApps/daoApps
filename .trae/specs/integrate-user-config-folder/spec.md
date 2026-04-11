# 集成用户配置文件夹 Spec

## Why
当前 DeepResearch 项目的用户配置文件夹 `.config` 位于项目根目录，但需要将其集成到 `src/deepresearch` 目录中作为用户配置存储位置。需要实现自动检测、加载配置文件，并建立配置变更监听机制，确保系统能够自动应用新配置。

## What Changes
- 修改 `get_config_dir()` 方法，使其优先检测并加载 `src/deepresearch/.config/` 目录中的用户配置
- 添加配置文件变更监听机制，使用文件系统监控检测配置文件变更
- 当配置文件更新时自动重新加载配置，无需重启应用
- 处理配置文件夹已存在的冲突情况，确保向后兼容
- 验证配置加载的准确性和自动识别功能的可靠性

## Impact
- Affected specs: 配置管理系统
- Affected code:
  - `d:\daoCollective\daoApps\daoApps\tools\DeepResearch\src\deepresearch\config\base.py` - 修改配置目录检测逻辑
  - 新增配置热加载监听功能
  - 需要测试配置加载和自动重载功能

## ADDED Requirements

### Requirement: 用户配置目录自动识别
系统 SHALL 优先检测并加载 `src/deepresearch/.config/` 目录中的用户配置文件。

#### Scenario: 配置目录存在
- **WHEN** `src/deepresearch/.config/` 目录存在且包含配置文件
- **THEN** 系统自动识别并加载该目录中的配置
- **AND** 该目录优先级高于项目根目录的 `.config/`

#### Scenario: 配置目录不存在
- **WHEN** `src/deepresearch/.config/` 目录不存在
- **THEN** 系统回退到原有的配置目录查找逻辑

### Requirement: 配置冲突处理
系统 SHALL 正确处理配置文件夹已存在的情况，确保不发生冲突。

#### Scenario: 多个配置目录都存在
- **WHEN** 项目根目录 `.config/` 和 `src/deepresearch/.config/` 都存在
- **THEN** 优先使用 `src/deepresearch/.config/` 中的配置
- **AND** 不会覆盖或删除原有目录中的配置文件

### Requirement: 配置变更监听
系统 SHALL 建立配置文件变更监听机制，当配置文件更新时自动应用新配置。

#### Scenario: 配置文件修改
- **WHEN** 用户修改 `.config/` 目录中的配置文件
- **THEN** 系统检测到文件变更
- **AND** 自动清除配置缓存并重新加载配置
- **AND** 应用程序立即使用新配置

#### Scenario: 配置文件新增/删除
- **WHEN** 用户在 `.config/` 目录中新增或删除配置文件
- **THEN** 系统检测到变更
- **AND** 触发配置重新加载

### Requirement: 配置热加载
系统 SHALL 支持配置热加载，无需重启应用即可应用新配置。

- **WHEN** 配置文件发生变更
- **THEN** 配置自动重新加载
- **AND** 所有新的配置查询都获取最新值
- **AND** 不影响正在进行的操作

## MODIFIED Requirements

### Requirement: 配置目录获取
修改 `get_config_dir()` 方法的查找顺序：
1. 自定义配置目录（通过 `set_config_dir` 设置）
2. 环境变量 `DEEPRESEARCH_CONFIG_DIR`
3. **新增**: `src/deepresearch/.config/` 用户配置目录
4. 默认 `config/` 目录

## REMOVED Requirements
无
