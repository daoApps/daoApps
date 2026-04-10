# 🔒 安全标准和工具更新通知

## 致团队成员：

### 重要安全更新

我们已完成 AgentPit 项目的安全标准升级和工具集成，现通知如下：

## 1. 新增安全验证工具

### 1.1 validate-security.sh
- **位置**: `skills/security/validate-security.sh`
- **功能**: 快速验证 Skills 文件中是否包含明文敏感凭证
- **检查项目**:
  - 明文 OAuth Client ID 和 Client Secret
  - 硬编码的 API Key（OpenAI、Anthropic 等）
  - 数据库连接串含密码
  - JWT Secret 硬编码
  - 占位符格式一致性
  - .gitignore 覆盖范围

### 1.2 集成到 Git 工作流
- **已添加到 pre-commit hook**
- **触发时机**: 每次 `git commit` 时自动运行
- **行为**: 
  - 发现严重问题（退出码 2）：阻止提交
  - 发现警告（退出码 1）：允许提交但提示修复
  - 全部通过（退出码 0）：正常提交

## 2. 安全标准更新

### 2.1 凭证管理规范
- **强制使用占位符**: 所有敏感凭证必须使用 `[UPPER_CASE_NAME]` 格式
- **环境变量读取**: 代码中必须使用 `process.env.XXX` 读取配置
- **模板文件**: `.env.skills.template` 仅包含占位符和说明

### 2.2 Git 忽略规则
- **必须忽略**: `.env.local`, `.env.production`, `*.key`, `*.pem`
- **允许提交**: `.env.skills.template`（仅包含占位符）

## 3. 如何使用

### 3.1 运行安全验证
```bash
# 验证 skills 目录
bash skills/security/validate-security.sh

# 验证指定目录
bash skills/security/validate-security.sh ./src

# 详细模式
bash skills/security/validate-security.sh --verbose
```

### 3.2 检查清单
- 每次修改 Skills 文件后运行验证
- 新增 Skill 时执行完整安全审查
- 定期（建议每月）运行完整安全扫描

## 4. 问题处理

### 4.1 常见警告
- **cmnkgi6yk 字符串**: 仅在自检示例中允许出现
- **数据库连接串**: 确保使用占位符格式
- **非标准占位符**: 统一使用 `[UPPER_CASE_NAME]` 格式

### 4.2 严重问题
- **硬编码 API Key**: 必须立即移除
- **明文 Client Secret**: 必须使用占位符
- **JWT Secret 硬编码**: 必须使用环境变量

## 5. 相关文档

- **安全检查清单**: `SECURITY_CHECKLIST.md`
- **Security Skill 文档**: `skills/security/SKILL.md`
- **环境变量模板**: `skills/.env.skills.template`

## 6. 责任分工

- **开发者**: 确保代码符合安全标准
- **代码审查**: 合并 PR 前检查安全验证结果
- **维护者**: 定期更新安全规则和工具

## 7. 生效日期

本安全标准和工具集成自 **2026-04-10** 起生效，请所有团队成员严格遵守。

---

**AgentPit 安全团队**
2026-04-10