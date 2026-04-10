# 自动变现系统模块实现 Spec

## Why
AgentPit 项目需要一个完整的自动变现系统模块（MonetizationPage），用于展示用户的财务数据、收益趋势、交易记录和提现功能。当前页面仅为简单占位符，无法满足实际业务需求。

## What Changes
- 创建 FinancialReport.tsx 财务报表面板组件
- 重构 MonetizationPage.tsx 主页面，整合所有子组件
- 所有组件使用 TypeScript 类型安全
- 遵循项目现有的设计风格（渐变背景、圆角、阴影）
- 使用 Tailwind CSS 和 Recharts 图表库

## Impact
- Affected code:
  - `src/components/monetization/FinancialReport.tsx` (新建)
  - `src/pages/MonetizationPage.tsx` (重构)
  - `src/data/mockMonetization.ts` (已有)
  - `src/components/monetization/WalletCard.tsx` (已有)
  - `src/components/monetization/RevenueChart.tsx` (已有)
  - `src/components/monetization/TransactionHistory.tsx` (已有)
  - `src/components/monetization/WithdrawModal.tsx` (已有)

## ADDED Requirements

### Requirement: 财务报表面板组件
系统 SHALL 提供 FinancialReport 组件，包含以下功能：

1. **关键指标卡片区域**：
   - 总收入（Total Revenue）
   - 总支出（Total Expenses）
   - 净利润（Net Profit）
   - 收益率（ROI Rate）
   - 每个卡片显示数值和环比变化百分比
   - 使用图标区分不同指标

2. **收入来源分布**：
   - 环形饼图展示收入来源占比
   - 包含图例列表，显示各来源名称、金额、占比
   - 数据来源：智能体服务、建站分成、商品销售、其他

3. **月度对比数据**：
   - 表格或迷你图表展示最近6个月的收支对比
   - 显示每月的收入、支出、净利润

#### Scenario: 用户查看财务报表
- **WHEN** 用户访问变现页面并滚动到财务报表区域
- **THEN** 显示四个关键指标卡片，每个卡片展示对应数值和变化趋势
- **AND** 显示收入来源的环形饼图及详细图例
- **AND** 显示最近6个月的月度对比数据

### Requirement: 变现主页面整合
系统 SHALL 提供完整的 MonetizationPage 页面，整合所有子组件：

1. **页面布局**：
   - 顶部：WalletCard 钱包组件（全宽）
   - 中上部：RevenueChart 收益图表区域
   - 中下部：FinancialReport 财务报表 + TransactionHistory 并排或上下排列
   - WithdrawModal 作为全局弹窗组件

2. **状态管理**：
   - 提现弹窗的打开/关闭状态
   - 各组件间的数据传递

3. **响应式设计**：
   - 移动端单列布局
   - 平板端双列布局
   - 桌面端多列网格布局

#### Scenario: 用户访问变现页面
- **WHEN** 用户导航到 /monetization 路由
- **THEN** 显示完整的变现仪表盘，包含钱包、图表、交易历史和财务报表
- **WHEN** 用户点击提现按钮
- **THEN** 打开提现弹窗，用户可完成提现操作

## MODIFIED Requirements

### Requirement: MonetizationPage 页面
原页面仅包含静态的"收益概览"和"变现渠道"占位内容。
修改为完整的动态变现系统仪表盘，整合 WalletCard、RevenueChart、TransactionHistory、FinancialReport、WithdrawModal 五个子组件，从 mockMonetization.ts 加载模拟数据进行渲染。
