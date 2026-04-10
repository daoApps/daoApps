# Flexloop Skills 安全检查清单

> 🔒 **版本**: v1.0.0
> **最后更新**: 2026-04-10
> **适用范围**: `skills/` 目录下所有 SKILL.md 和配置文件

---

## 📋 检查前准备

- [ ] 已安装最新版本的 security-scan.sh 和 validate-security.sh
- [ ] 已阅读并理解 OWASP Top 10 安全风险
- [ ] 准备好记录检查结果的表格或工具

---

## Section 1: 敏感数据审计 ✅

### 1.1 OAuth 凭证检查
- [ ] **agentpit-sso/SKILL.md** 中无明文 Client ID
  - 搜索命令: `grep -r "cmnkgi6yk" skills/`
  - 预期结果: 无匹配（或在自检示例中）

- [ ] **agentpit-sso/SKILL.md** 中无明文 Client Secret
  - 搜索命令: `grep -r "clientSecret.*:" skills/ | grep -v "[CLIENT_SECRET]"`
  - 预期结果: 无匹配

- [ ] 所有 OAuth 配置使用 `[CLIENT_ID]` / `[CLIENT_SECRET]` 占位符
  - 验证方法: 目视检查 OAUTH_CONFIG 区域
  - 标准: 必须是方括号包裹的大写名称

### 1.2 API 密钥检查
- [ ] 无硬编码的 OpenAI API Key (`sk-...`)
- [ ] 无硬编码的 Anthropic API Key (`sk-ant-api03-...`)
- [ ] 无硬编码的其他第三方服务密钥

### 1.3 数据库凭据检查
- [ ] DATABASE_URL 不包含真实密码
- [ ] 连接串中的密码部分使用 `[DB_PASSWORD]` 或类似占位符
- [ ] 如果有多个环境配置，每个都经过检查

---

## Section 2: 代码安全实践 ✅

### 2.1 环境变量使用
- [ ] 敏感配置通过 `process.env.XXX` 读取
- [ ] 提供合理的 fallback 值（占位符格式）
- [ ] 包含运行时空值检查逻辑
- [ ] 错误消息不暴露其他凭证信息

### 2.2 日志安全
- [ ] 日志中不记录完整的 Client Secret
- [ ] Token 和密钥在日志中被部分遮蔽（如 `****xxxx`）
- [ ] 错误堆栈不包含敏感环境变量值

### 2.3 前端安全
- [ ] Client Secret 仅存在于服务端代码
- [ ] 前端 JavaScript/Vue 代码中无任何 Secret
- [ ] 浏览器开发者工具中无法找到敏感信息

---

## Section 3: 文件保护 ✅

### 3.1 Git 忽略规则
- [ ] `.gitignore` 包含 `.env.local`
- [ ] `.gitignore` 包含 `.env.production`
- [ ] `.gitignore` 包含 `*.key`, `*.pem`
- [ ] `.gitignore` 允许提交 `.env.skills.template`
- [ ] `skills/.gitignore` 存在且配置正确

### 3.2 模板文件安全
- [ ] `.env.skills.template` 仅包含占位符
- [ ] `.env.production.example` 仅包含占位符或说明文字
- [ ] 模板文件中有清晰的安全警告注释

---

## Section 4: 自动化工具验证 ✅

### 4.1 运行安全扫描
```bash
# 运行完整的 security-scan.sh
chmod +x skills/security/security-scan.sh
./skills/security/security-scan.sh --report > scan-report.md

# 预期结果: 0 个严重问题，0 个高风险问题
```

- [ ] 扫描完成且退出码为 0
- [ ] 报告显示 "✅ 未发现安全问题"
- [ ] 如有问题，已记录到报告并计划修复

### 4.2 运行快速验证
```bash
# 运行 validate-security.sh
chmod +x skills/security/validate-security.sh
./skills/security/validate-security.sh --verbose

# 预期结果: 全部 PASS
```

- [ ] 6 项检查全部通过
- [ ] 无 WARN 或 FAIL 项

### 4.3 手动 Grep 验证
```bash
# 关键词搜索（应无结果或仅出现在示例中）
grep -rn "cmnkgi6yk" skills/
grep -rn "clientSecret.*:" skills/ | grep -v "\[CLIENT_SECRET\]"
grep -rn "sk-[a-zA-Z0-9]{48}" skills/
```

- [ ] 以上命令均返回空或仅匹配示例/说明文字

---

## Section 5: 文档完整性 ✅

### 5.1 安全说明章节
- [ ] agentpit-sso/SKILL.md 包含 "🔒 安全最佳实践" 章节
- [ ] 包含至少 5 条安全规则
- [ ] 包含常见问题及解决方案表格
- [ ] 包含自检方法和命令示例

### 5.2 Security Skill 完整性
- [ ] `skills/security/SKILL.md` 存在且内容完整
- [ ] 包含敏感信息检测规则定义
- [ ] 包含可执行的 security-scan.sh 脚本
- [ ] 包含日志脱敏工具函数
- [ ] 包含环境变量管理规范

---

## Section 6: 持续监控建议 ✅

### 6.1 CI/CD 集成
- [ ] 将 validate-security.sh 加入 pre-commit hook
- [ ] 或在 GitHub Actions/GitLab CI 中添加安全扫描步骤
- [ ] PR 创建时自动运行安全检查

### 6.2 定期审查
- [ ] 计划每月运行一次完整安全扫描
- [ ] 新增 Skill 时强制执行安全审查流程
- [ ] 团队成员接受基础安全培训

### 6.3 事件响应
- [ ] 制定凭证泄露应急响应预案
- [ ] 记录紧急联系人和处理流程
- [ ] 定期测试预案有效性

---

## 📊 检查结果记录表

| 检查项 | 结果 | 检查人 | 日期 | 备注 |
|--------|------|--------|------|------|
| 1.1 OAuth Client ID | ✅/❌ | | | |
| 1.2 OAuth Client Secret | ✅/❌ | | | |
| 1.3 API Keys | ✅/❌ | | | |
| 2.1 环境变量使用 | ✅/❌ | | | |
| 2.2 日志安全 | ✅/❌ | | | |
| 3.1 Git Ignore 规则 | ✅/❌ | | | |
| 3.2 模板文件安全 | ✅/❌ | | | |
| 4.1 Security Scan | ✅/❌ | | | |
| 4.2 Validate Script | ✅/❌ | | | |
| 5.1 安全文档 | ✅/❌ | | | |

**总体评估**: [ ✅ 通过 / ⚠️ 有条件通过 / ❌ 需要修复 ]

**签名**: _______________

**日期**: ____年__月__日

---

## 🔗 相关资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Secrets Scanning](https://docs.github.com/code-security/secret-scanning)
- [A2APersonalAgent 项目参考实现](../../A2A/A2APersonalAgent/.agents/skills/)
- [Flexloop Security Scanner](./security/SKILL.md)

---

**最后更新**: 2026-04-10
**下次审查日期**: 建议每月一次
