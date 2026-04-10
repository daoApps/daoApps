# CI 流水线优化 - 验证清单

## 测试环境配置验证
- [ ] vitest.config.ts 中已配置 setupFiles
- [ ] 创建了测试 setup 文件，模拟了 window.matchMedia 等浏览器 API
- [ ] 运行 npm run test:run 不再出现浏览器 API 相关错误
- [ ] 代码审查确认 setupFiles 配置合理且有注释

## Node.js 版本升级验证
- [ ] .github/workflows/ci.yml 中的 Node.js 版本已从 20.x 升级到 24.x
- [ ] 已添加 FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true 环境变量（可选）
- [ ] CI 日志显示 Node.js 24.x 版本号
- [ ] CI 的 checkout、setup、install、lint、typecheck 步骤正常通过
- [ ] 代码审查确认版本配置正确

## 集成测试用例修复验证
- [ ] shopping-cart.spec.ts 中的所有测试通过
- [ ] router-integration.spec.ts 中的所有测试通过
- [ ] form-validation.spec.ts 中的所有测试通过
- [ ] chat-flow.spec.ts 中的所有测试通过
- [ ] 未修改核心业务逻辑代码
- [ ] 代码审查确认测试用例修改合理

## 完整测试套件验证
- [ ] npm run test:run 显示所有测试 100% 通过
- [ ] 无任何警告或错误信息
- [ ] 测试覆盖率报告正常生成
- [ ] 覆盖率数据合理且符合预期阈值

## Codecov 集成验证
- [ ] CI 配置正确引用了 Codecov token 环境变量
- [ ] 覆盖率报告包含 lcov.info 文件
- [ ] codecov-action 配置正确
- [ ] 用户确认 Codecov token 已配置到 GitHub Secrets
- [ ] （可选）Codecov 平台上报告正常显示

## 完整 CI 流程验证
- [ ] CI 流水线的所有步骤（lint、typecheck、test、build）都显示为通过状态
- [ ] CI 运行时间控制在 5 分钟以内
- [ ] 无任何警告或错误信息
- [ ] （可选）覆盖率报告成功上传到 Codecov
