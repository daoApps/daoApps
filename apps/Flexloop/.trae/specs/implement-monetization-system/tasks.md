# Tasks

- [ ] Task 1: 创建 FinancialReport.tsx 财务报表面板组件
  - [ ] 实现关键指标卡片区域（总收入、总支出、净利润、收益率）
  - [ ] 实现收入来源环形饼图（使用 Recharts PieChart）
  - [ ] 实现月度对比数据表格
  - [ ] 从 mockMonetization.ts 导入 FinancialMetrics 和 SourceDistribution 类型与数据
  - [ ] 应用 Tailwind CSS 样式，保持与现有组件一致的设计风格

- [ ] Task 2: 重构 MonetizationPage.tsx 主页面
  - [ ] 整合 WalletCard 组件到页面顶部
  - [ ] 整合 RevenueChart 组件到页面上部
  - [ ] 整合 FinancialReport 和 TransactionHistory 组件到页面中下部
  - [ ] 集成 WithdrawModal 弹窗组件
  - [ ] 实现提现弹窗的状态管理（打开/关闭）
  - [ ] 导入 mockMonetization.ts 的所有模拟数据
  - [ ] 实现响应式网格布局（移动端/平板/桌面适配）

# Task Dependencies
- [Task 2] depends on [Task 1] (MonetizationPage 需要 FinancialReport 组件先完成)
