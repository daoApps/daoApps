# DeepResearch 用户配置目录 Spec

## Why
当前 DeepResearch 项目将配置文件存储在 `config/` 目录下，但该目录已经被纳入版本控制，不适合存储用户的个性化配置。需要创建一个独立的用户配置目录，用于存储用户的真实配置，同时通过 .gitignore 排除该目录，避免用户配置被提交到版本库。

## What Changes
- 在 `d:\daoCollective\daoApps\daoApps\tools\DeepResearch` 中创建 `.config/` 子文件夹，作为用户真实配置存储目录
- 将 `.config/` 路径添加到 `.gitignore` 文件中，确保该目录不会被 Git 追踪

## Impact
- Affected specs: 配置管理系统
- Affected code:
  - `d:\daoCollective\daoApps\daoApps\tools\DeepResearch\.gitignore`
  - 新增目录: `d:\daoCollective\daoApps\daoApps\tools\DeepResearch\.config\`

## ADDED Requirements

### Requirement: 用户配置目录
系统 SHALL 在 DeepResearch 项目根目录下创建 `.config` 子文件夹，该目录用于存储用户的真实配置。

#### Scenario: 成功创建目录
- **WHEN** 在项目根目录执行目录创建操作
- **THEN** `.config` 目录被成功创建
- **AND** 目录权限设置适当（Windows 平台继承父目录权限）

#### Scenario: Git 忽略配置
- **WHEN** Git 检查文件状态
- **THEN** `.config/` 目录及其内容不会被 Git 追踪
- **AND** `.config/` 出现在 `.gitignore` 文件中

## MODIFIED Requirements
无

## REMOVED Requirements
无
