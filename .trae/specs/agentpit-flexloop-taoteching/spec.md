# AgentPit → Flexloop 品牌重塑与帛书版道德经哲学融入 Spec

## Why

当前项目名为 AgentPit，名称带有"坑"（Pit）的负面含义，未能体现帛书版道德经的核心思想。而 flexloop（柔性循环）的概念与道德经中"周行而不殆"、"反者道之动"、"柔弱胜刚强"等核心思想高度契合。使用 flexloop 重命名并融入帛书版道德经哲学理念，能够更好地体现项目的哲学内涵和技术设计理念。

## What Changes

- **BREAKING** 项目名称从 `AgentPit` 全面更名为 `Flexloop`（玄环）
- 更新所有 UI 界面中的品牌名称、标题、标语、版权信息等
- 更新所有文档、部署脚本、配置文件中的项目名称
- 调整项目描述，融入帛书版道德经核心思想
- 保持现有的 flexloop 技术实现（[useFlexloop.ts](file:///d:/daoCollective/daoApps/daoApps/apps/AgentPit/src/composables/useFlexloop.ts)），增强其哲学内涵的体现
- 保持技术架构不变，只进行品牌和表述层面的修正

## Impact

- Affected capabilities: 品牌展示、用户界面、文档说明
- Affected code:
  - `index.html` - 页面标题
  - `package.json` - 项目名称
  - `src/views/HomePage.vue` - 首页标题和副标题
  - `src/components/layout/Header.vue` - 头部 Logo 和导航
  - `src/components/layout/Footer.vue` - 底部品牌和版权
  - `src/components/settings/HelpCenter.vue` - 帮助中心版本信息
  - `src/data/mockSettings.ts` - FAQ 中的品牌提及
  - 所有部署脚本（`deploy.sh`, `deploy.ps1`, `deploy-podman.sh` 等）
  - 所有文档文件（`README.md`, `DEPLOYMENT_GUIDE.md` 等）
  - 所有 skills 中的 SKILL.md 文档
  - 环境配置文件（`.env.development`, `.env.production.example`）
  - 容器配置文件（`Podmanfile`, `podman-compose.yml`）

## ADDED Requirements

### Requirement: 帛书版道德经哲学融入

系统品牌和界面表述应当体现以下帛书版道德经核心思想：

- **反者道之动** - 循环往复的运动变化，对应 flexloop 的循环工作流
- **周行而不殆** - 循环运行而不止息，体现系统的持续运行
- **柔弱胜刚强** - 柔性适应胜过刚性对抗，体现 flexloop 的柔性设计
- **道法自然** - 顺应自然规律，体现系统的自适应特性
- **有无相生** - 有生于无，无中生有，体现智能体的创生理念

#### Scenario: 用户访问首页
- **WHEN** 用户访问首页
- **THEN** 首页主标题显示"Flexloop 玄环"，副标题体现道德经哲学理念
- **AND** 整体风格保持技术专业性，不过度玄学

#### Scenario: 用户查看品牌信息
- **WHEN** 用户查看页脚或帮助中心
- **THEN** 品牌名称统一为"Flexloop"，中文名为"玄环"
- **AND** 版权信息更新为"© {year} Flexloop Team"

### Requirement: Flexloop 技术与哲学统一

现有的 `useFlexloop.ts` 技术实现已经存在，应当：

- 保持现有的 API 接口不变
- 注释中可以体现哲学思想，但不改变功能实现
- 确保技术实现与哲学理念相呼应：循环工作流、柔性执行、自适应调整

## MODIFIED Requirements

### Requirement: 项目命名

**修改前**: 项目命名为 AgentPit，意为"智能体之坑"，带有负面隐喻

**修改后**: 项目命名为 **Flexloop 玄环**，含义：
- Flex（柔性）对应"柔弱胜刚强"
- Loop（循环）对应"反者道之动，周行而不殆"
- 玄环对应帛书《老子》"玄之又玄，众妙之门"，循环无端之意

### Requirement: 首页副标题

**修改前**: "打造您的自动赚钱平台 ✨"

**修改后**: "道法自然，柔性循环，智能共生 ✨"

### Requirement: 品牌标语

**修改前**: "智能体协作平台，为您提供全方位的AI解决方案"

**修改后**: "柔性循环智能平台，循道而行，自然而然"

## REMOVED Requirements

None

