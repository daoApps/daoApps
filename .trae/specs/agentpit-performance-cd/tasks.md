# AgentPit 性能审计与 CD 流水线 - 任务清单

## [ ] Task 1: 安装和配置 Lighthouse CI
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 安装 @lhci/cli 工具
  - 创建 lighthouserc.js 配置文件
  - 配置审计目标和断言设置
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: @lhci/cli 工具成功安装
  - `human-judgment` TR-1.2: lighthouserc.js 配置文件包含正确的审计目标、收集器和断言设置
- **Notes**:
  - 建议使用全局安装方式：`npm install -g @lhci/cli`
  - 配置文件应包含性能基准指标的断言设置

## [ ] Task 2: 执行 Lighthouse 性能测试
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 启动项目预览服务器
  - 执行完整的性能测试
  - 分析测试结果
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `programmatic` TR-2.1: 性能测试成功执行并生成报告
  - `programmatic` TR-2.2: FCP ≤ 1.8s，LCP ≤ 2.5s，CLS ≤ 0.1
  - `programmatic` TR-2.3: Lighthouse 性能评分 ≥ 80，可访问性评分 ≥ 90，最佳实践评分 ≥ 90
- **Notes**:
  - 执行命令：`lhci collect --url=http://localhost:4173 && lhci assert`
  - 确保预览服务器在执行测试前已启动

## [ ] Task 3: 配置 Staging 环境自动部署
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 配置 GitHub Actions workflow
  - 设置 develop 分支触发条件
  - 实现自动部署到 staging 环境
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-3.1: 代码合并到 develop 分支时自动触发部署
  - `programmatic` TR-3.2: 部署成功完成
- **Notes**:
  - 使用现有的 CI 流程作为基础
  - 确保部署步骤包含必要的环境设置

## [ ] Task 4: 配置 Production 环境人工审核部署
- **Priority**: P0
- **Depends On**: Task 3
- **Description**:
  - 配置 main 分支的部署流程
  - 设置人工审核步骤
  - 实现 production 环境部署
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 代码合并到 main 分支时触发部署流程
  - `human-judgment` TR-4.2: 部署需要人工审核才能继续
  - `programmatic` TR-4.3: 审核通过后成功部署到 production 环境
- **Notes**:
  - 使用 GitHub Actions 的环境审批功能
  - 确保 production 环境的部署步骤与 staging 环境保持一致

## [ ] Task 5: 实现部署前自动化测试
- **Priority**: P0
- **Depends On**: Task 3
- **Description**:
  - 配置部署前的测试步骤
  - 执行单元测试、集成测试和 E2E 测试
  - 验证测试通过率
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: 部署前执行完整的测试套件
  - `programmatic` TR-5.2: 所有测试通过（通过率 100%）
- **Notes**:
  - 测试命令：`npm run test:run`
  - 确保测试环境配置正确

## [ ] Task 6: 配置环境变量管理
- **Priority**: P0
- **Depends On**: Task 3
- **Description**:
  - 配置不同环境的环境变量
  - 使用 GitHub Secrets 管理敏感信息
  - 验证环境变量在部署过程中的正确使用
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgment` TR-6.1: 不同环境使用不同的配置参数
  - `human-judgment` TR-6.2: 敏感信息通过 GitHub Secrets 管理，不硬编码
- **Notes**:
  - 参考现有的 .env.example 文件
  - 确保所有必要的环境变量都已配置

## [ ] Task 7: 实现部署后健康检查
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 配置健康检查步骤
  - 验证服务可正常访问
  - 检查响应时间
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `programmatic` TR-7.1: 部署后自动执行健康检查
  - `programmatic` TR-7.2: 服务可正常访问
  - `programmatic` TR-7.3: 响应时间 ≤ 30 秒
- **Notes**:
  - 可以使用 curl 或专门的健康检查工具
  - 检查关键 API 端点的响应

## [ ] Task 8: 配置部署失败回滚策略
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 配置部署失败的检测机制
  - 实现自动回滚功能
  - 验证回滚过程
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `programmatic` TR-8.1: 部署失败时自动触发回滚
  - `programmatic` TR-8.2: 回滚成功完成
  - `programmatic` TR-8.3: 回滚时间 ≤ 2 分钟
- **Notes**:
  - 可以使用 GitHub Actions 的失败处理机制
  - 确保回滚过程不会影响服务的正常运行

## [ ] Task 9: 生成部署报告
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 配置部署报告生成
  - 包含部署时间、版本信息、变更内容和测试结果
  - 存储和通知部署报告
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `human-judgment` TR-9.1: 部署报告包含所有必要信息
  - `human-judgment` TR-9.2: 报告格式清晰易读
- **Notes**:
  - 可以使用 GitHub Actions 的 artifacts 功能存储报告
  - 考虑配置通知机制，如邮件或 Slack 通知

## [ ] Task 10: 集成 Lighthouse 到 CI/CD 流水线
- **Priority**: P1
- **Depends On**: Task 1, Task 3
- **Description**:
  - 配置 Lighthouse 测试作为 CI/CD 流水线的一部分
  - 确保性能指标达标后才能部署
  - 存储性能测试报告
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `programmatic` TR-10.1: Lighthouse 测试作为 CI/CD 流水线的一部分执行
  - `programmatic` TR-10.2: 性能指标不达标时阻止部署
  - `human-judgment` TR-10.3: 性能测试报告被存储和可访问
- **Notes**:
  - 可以在部署前执行 Lighthouse 测试
  - 使用 GitHub Actions 的 artifacts 功能存储测试报告