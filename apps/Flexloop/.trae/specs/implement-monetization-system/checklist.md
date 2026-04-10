# Checklist

- [ ] FinancialReport.tsx 文件存在于 src/components/monetization/ 目录下
- [ ] FinancialReport 组件导出默认函数组件
- [ ] FinancialReport 包含四个关键指标卡片（总收入、总支出、净利润、收益率）
- [ ] FinancialReport 包含收入来源环形饼图（PieChart with innerRadius）
- [ ] FinancialReport 包含月度对比数据展示
- [ ] FinancialReport 使用 TypeScript 类型（FinancialMetrics, SourceDistribution）
- [ ] FinancialReport 样式符合项目设计规范（Tailwind CSS, 渐变, 圆角, 阴影）
- [ ] MonetizationPage.tsx 整合了全部5个子组件（WalletCard, RevenueChart, TransactionHistory, WithdrawModal, FinancialReport）
- [ ] MonetizationPage 正确导入 mockMonetization.ts 数据
- [ ] MonetizationPage 实现了提现弹窗的开关状态管理
- [ ] MonetizationPage 响应式布局正常工作（移动端/平板/桌面）
- [ ] 无 TypeScript 编译错误
- [ ] 组件代码结构清晰，遵循 React 最佳实践
