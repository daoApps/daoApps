# Rename AgentPit Folder to Flexloop Spec

## Why

项目品牌已经从 AgentPit 更名为 Flexloop，但文件夹名称仍然保留为 `AgentPit`。为了保持一致性，需要将文件夹从 `AgentPit` 重命名为 `Flexloop`，并更新项目中所有引用该路径的配置文件和代码。

## What Changes

- **BREAKING** 将文件夹 `apps/AgentPit` 重命名为 `apps/Flexloop`
- 更新所有配置文件中的路径引用：
  - `.github/workflows/cd.yml` - 更新所有工作目录和路径
  - `.github/workflows/ci.yml` - 更新所有工作目录和路径
  - `scripts/deployment/build-app.sh` - 更新默认构建输出路径检测
- 更新项目根目录中所有其他引用 `apps/AgentPit` 的文件
- 保持文件夹内所有文件和子文件夹结构不变
- 验证重命名后项目能正常编译和运行

## Impact

- Affected capabilities: 项目结构、部署流程
- Affected code:
  - `apps/AgentPit/` → `apps/Flexloop/` (folder rename)
  - `.github/workflows/cd.yml` - GitHub Actions 配置
  - `.github/workflows/ci.yml` - GitHub Actions 配置
  - `scripts/deployment/build-app.sh` - 构建脚本
  - 任何其他硬编码了 `AgentPit` 路径的配置文件

## ADDED Requirements

### Requirement: Folder Rename

项目文件夹 `apps/AgentPit`  SHALL 被重命名为 `apps/Flexloop`，保持内部文件和子文件夹结构完整不变。

#### Scenario: Rename Complete
- **WHEN** 文件夹重命名完成
- **THEN** 所有原有的文件和子文件夹都出现在 `apps/Flexloop` 下
- **AND** 文件内容保持不变，只有路径引用需要更新

### Requirement: Path Reference Update

所有配置文件和代码中引用 `apps/AgentPit` 路径的地方 SHALL 都更新为 `apps/Flexloop`。

#### Scenario: Configuration Updated
- **WHEN** 用户查看 CI/CD 配置
- **THEN** 所有 `./apps/AgentPit` 路径都改为 `./apps/Flexloop`
- **AND** 所有 `working-directory` 设置都更新为新路径

## MODIFIED Requirements

### Requirement: Project Folder Structure

**修改前**: 应用位于 `apps/AgentPit/`

**修改后**: 应用位于 `apps/Flexloop/`

## REMOVED Requirements

None
