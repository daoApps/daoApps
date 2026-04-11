# Flexloop 技能代码修复 Spec

## Why
Flexloop 项目的技能代码与参考实现（A2APersonalAgent）存在不一致，需要修复以确保功能完整性、安全性和与系统其他模块的兼容性。

## What Changes
- 统一技能命名规范，确保与参考实现保持一致
- 修复安全问题，包括硬编码凭证和环境变量管理
- 完善功能实现，确保所有必要的端点和功能都已实现
- 确保与系统其他模块的兼容性
- 添加单元测试和集成测试

## Impact
- Affected specs: Flexloop SSO, Token 消耗追踪, 部署工具, 安全工具
- Affected code: skills/agentpit-* 目录下的所有技能文件

## ADDED Requirements
### Requirement: 技能命名一致性
The system SHALL use consistent naming conventions for skills, matching the reference implementation.

#### Scenario: 技能名称统一
- **WHEN** checking skill names
- **THEN** all skills shall use the same naming pattern as the reference implementation

### Requirement: 安全配置管理
The system SHALL properly manage security credentials through environment variables.

#### Scenario: 凭证管理
- **WHEN** configuring OAuth credentials
- **THEN** credentials shall be read from environment variables with appropriate placeholders

### Requirement: 完整的功能实现
The system SHALL implement all required endpoints and functionality for each skill.

#### Scenario: 功能完整性
- **WHEN** testing skill functionality
- **THEN** all required endpoints and features shall be implemented

## MODIFIED Requirements
### Requirement: SSO 技能实现
The SSO skill SHALL be modified to match the reference implementation structure and functionality.

### Requirement: Token 消耗追踪技能实现
The Token usage tracking skill SHALL be modified to match the reference implementation structure and functionality.

### Requirement: 部署工具技能实现
The deployment tool skill SHALL be modified to match the reference implementation structure and functionality.

### Requirement: 安全工具技能实现
The security tool skill SHALL be modified to match the reference implementation structure and functionality.

## REMOVED Requirements
### Requirement: 硬编码凭证
**Reason**: Hard-coded credentials pose a security risk
**Migration**: Move all credentials to environment variables with appropriate placeholders