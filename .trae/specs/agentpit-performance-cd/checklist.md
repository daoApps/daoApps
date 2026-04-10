# AgentPit 性能审计与 CD 流水线 - 检查清单

## Lighthouse 审计实施

- [ ] **Checkpoint 1**: @lhci/cli 工具已成功安装
- [ ] **Checkpoint 2**: lighthouserc.js 配置文件已创建并包含正确的审计目标
- [ ] **Checkpoint 3**: 性能测试成功执行并生成报告
- [ ] **Checkpoint 4**: FCP ≤ 1.8s，LCP ≤ 2.5s，CLS ≤ 0.1
- [ ] **Checkpoint 5**: Lighthouse 性能评分 ≥ 80
- [ ] **Checkpoint 6**: Lighthouse 可访问性评分 ≥ 90
- [ ] **Checkpoint 7**: Lighthouse 最佳实践评分 ≥ 90

## CD 流水线配置

- [ ] **Checkpoint 8**: Staging 环境自动部署配置完成
- [ ] **Checkpoint 9**: Production 环境人工审核部署配置完成
- [ ] **Checkpoint 10**: 部署前自动化测试配置完成
- [ ] **Checkpoint 11**: 测试通过率达到 100%
- [ ] **Checkpoint 12**: 环境变量管理配置完成
- [ ] **Checkpoint 13**: 部署后健康检查配置完成
- [ ] **Checkpoint 14**: 健康检查响应时间 ≤ 30 秒
- [ ] **Checkpoint 15**: 部署失败回滚策略配置完成
- [ ] **Checkpoint 16**: 回滚时间 ≤ 2 分钟
- [ ] **Checkpoint 17**: 部署报告生成配置完成
- [ ] **Checkpoint 18**: 部署报告包含所有必要信息

## 集成与验证

- [ ] **Checkpoint 19**: Lighthouse 测试集成到 CI/CD 流水线
- [ ] **Checkpoint 20**: 性能指标不达标时阻止部署
- [ ] **Checkpoint 21**: 性能测试报告被存储和可访问
- [ ] **Checkpoint 22**: 所有任务完成且验证通过