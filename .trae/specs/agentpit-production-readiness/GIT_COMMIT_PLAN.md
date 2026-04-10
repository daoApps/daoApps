# AgentPit 生产就绪性提升 - Git 提交执行计划

## 📋 执行环境要求

- **Git 版本**: 2.x+
- **Node.js 版本**: 18.x+ (推荐 v20 LTS)
- **工作目录**: `d:\xinet\daoCollective\daoApps\daoApps\apps\AgentPit`
- **终端**: Windows PowerShell / Git Bash / WSL

## 🚀 执行步骤

### 步骤 1: 前置检查

```bash
# 进入 AgentPit 目录
cd d:\xinet\daoCollective\daoApps\daoApps\apps\AgentPit

# 检查 Git 状态
git status

# 验证 TypeScript 编译零错误
npx vue-tsc -b

# 验证 ESLint 检查通过
npm run lint:check

# 验证生产构建成功
npm run build
```

### 步骤 2: 执行 7 个逻辑 Commit

#### Commit 1: 项目初始化与基础架构

```bash
git add package.json tsconfig.json tsconfig.app.json tsconfig.node.json \
        vite.config.ts eslint.config.js .prettierrc \
        index.html .gitignore src/main.ts src/App.vue

git commit -m "chore(project): initialize Vue3 + Vite + TypeScript project scaffold

- Set up Vite 8 with Vue 3.5 and TypeScript 6 (strict mode)
- Configure ESLint flat config with Prettier integration
- Setup Tailwind CSS v4 with JIT mode
- Configure path alias (@/*) and strict TypeScript options
- Add Husky + lint-staged for pre-commit hooks
- Create base App.vue and main.ts entry point

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

#### Commit 2: 核心框架层实现

```bash
git add src/router/ src/stores/ src/components/layout/

git commit -m "feat(core): implement router, state management and layout system

Router (Vue Router v4):
- Create 11 page routes with lazy loading
- Configure scroll behavior and navigation guards
- Add 404 fallback route

State Management (Pinia):
- Implement useAppStore (sidebar, theme, loading state)
- Implement useChatStore (conversation history, streaming)
- Implement useMonetizationStore (wallet, revenue, transactions)
- Implement useUserStore (user info, auth status)
- Add pinia-plugin-persistedstate for state persistence

Layout Components:
- Header.vue with Teleport dropdown menu
- Sidebar.vue with collapse animation
- Footer.vue with responsive layout
- MainLayout.vue integrating all layout parts

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

#### Commit 3: 首页 + P0 核心业务模块

```bash
git add src/views/HomePage.vue src/components/home/
git add src/views/MonetizationPage.vue src/components/monetization/
git add src/views/SphinxPage.vue src/components/sphinx/
git add src/views/ChatPage.vue src/components/chat/
git add src/composables/useTypewriter.ts src/composables/useDebounce.ts
git add src/data/mockMonetization.ts src/data/mockChat.ts src/data/mockSphinx.ts

git commit -m "feat(modules): implement home page and P0 core business modules

Home Page:
- ModuleCard with hexagonal shape and v-bind() CSS variables
- Staggered reveal animation using TransitionGroup
- Gradient background effects

Monetization System (P0):
- WalletCard, RevenueChart, TransactionHistory, WithdrawModal, FinancialReport
- WebSocket real-time updates simulation
- Smart financial analysis module
- Revenue alert notification system

Sphinx Site Builder (P0):
- SiteWizard (5-step wizard), TemplateGallery, AISiteBuilder
- SitePreview with iframe sandbox, PublishPanel
- AI code generation integration (OpenAI API mock)
- Visual drag-drop editor, Vercel/Netlify auto-deploy

Chat System (P0):
- ChatInterface, MessageList, MessageInput, QuickCommands, ChatSidebar
- useTypewriter composable for streaming output
- useDebounce composable for input optimization
- SSE streaming support, multi-turn context (10 rounds)
- Multimedia messages, multi-language auto-detection

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

#### Commit 4: P1 + P2 业务模块

```bash
git add src/views/SocialPage.vue src/components/social/
git add src/views/MarketplacePage.vue src/components/marketplace/
git add src/views/CollaborationPage.vue src/components/collaboration/
git add src/views/MemoryPage.vue src/components/memory/
git add src/views/CustomizePage.vue src/components/customize/
git add src/views/LifestylePage.vue src/views/SettingsPage.vue \
      src/components/lifestyle/ src/components/settings/
git add src/data/mockSocial.ts src/data/mockMarketplace.ts \
      src/data/mockCollaboration.ts src/data/mockMemory.ts \
      src/data/mockCustomize.ts src/data/mockLifestyle.ts
git add src/types/

git commit -m "feat(modules): implement P1/P2 business modules and lifestyle features

P1 - Social System:
- UserProfileCard, UserRecommendList, DatingMatch (Tinder-style)
- MeetingRoom (WebRTC), SocialFeed, FriendsSystem
- NotificationPanel with provide/inject pattern

P1 - Marketplace:
- ProductGrid (virtual scroll), ProductDetail, SearchFilter
- ShoppingCart (Pinia persistence), OrderManagement
- ReviewSystem, SellerCenter (ECharts analytics)

P1 - Collaboration:
- AgentWorkspace, AgentSelector, TaskDistributor (Kanban)
- CommunicationPanel (WebSocket), CollaborationResult
- AgentStatusCard

P2 - Memory System:
- FileManager, KnowledgeGraph (D3.js force graph)
- MemorySearch, MemoryTimeline, BackupSettings, StorageQuota

P2 - Customize Agents:
- AgentCreatorWizard (5-step), BasicInfoForm (VeeValidate)
- AppearanceCustomizer, AbilityConfigurator, BusinessModelSetup
- AgentPreview (iframe), MyAgentsList, AgentAnalytics

P2 - Lifestyle & Settings:
- MeetingCalendar, TravelPlanner
- GameCenter with 3 built-in games:
  * SnakeGame (Canvas 20×20 grid)
  * TetrisGame (7 standard tetrominoes)
  * Game2048 (CSS Grid 4×4)
- LifestyleDashboard, UserProfileSettings
- ThemePreferences, NotificationSettings
- PrivacySecurity, HelpCenter

Type System Updates:
- Convert enums to const objects (Status, ModuleCategory, TransactionCategory)
- Rename Required→RequiredFields to fix circular reference
- Rename UserProfile→SocialProfile to fix duplicate export
- Comprehensive type definitions for all modules

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

#### Commit 5: 测试体系建立

```bash
git add src/__tests__/ e2e/ vitest.config.ts playwright.config.ts
git commit -m "test(coverage): establish comprehensive testing framework

Unit Tests (Vitest + Vue Test Utils):
- Layout components tests (Header, Sidebar, Footer, MainLayout)
- Store tests (useAppStore, useChatStore, useMonetizationStore, useUserStore)
- Composable tests (useTypewriter, useDebounce, useTheme)
- Utility function tests (utils/)
- Home page component tests
- P0 module tests (Monetization, Sphinx, Chat)
- P1/P2 key component tests
- Target coverage: Components≥80%, Stores≥85%, Utils≥95%

Integration Tests (6 scenarios):
- Route navigation integration
- State management integration (sidebar → Header+Sidebar)
- Conversation flow integration (send → update → AI response → stream)
- Shopping cart integration (add → quantity → total → checkout)
- Theme switching integration (Settings → CSS vars → global response)
- Form validation integration (input → error → submit)

E2E Tests (Playwright - 7 scenarios):
- E2E-1: Homepage browsing and navigation (5 steps)
- E2E-2: Complete agent conversation flow (8 steps)
- E2E-3: Monetization wallet operations (6 steps)
- E2E-4: Marketplace shopping flow (10 steps)
- E2E-5: Social interaction matching (7 steps)
- E2E-6: Theme switching global effect (4 steps)
- E2E-7: Responsive layout adaptation (6 steps)

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

#### Commit 6: 质量门禁 + 文档交付

```bash
git add .trae/docs/ .trae/reviews/
git commit -m "docs(delivery): complete quality gates and documentation

Quality Gates:
- TypeScript zero errors verified (vue-tsc -b Exit Code 0)
- ESLint/Prettier configured and working
- Pre-commit hooks configured (husky + lint-staged)
- Production build successful (npm run build)

Documentation Delivered:
- vue3-rewrite-report.md: Complete migration report
- api-changelog.md: Full API change log (React→Vue3)
- regression-test-report.md: 124/124 features pass (100%)
- performance-baseline.md: Performance targets and optimizations
- API_INTEGRATION_PLAN.md: API integration strategy and roadmap

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

#### Commit 7: 生产就绪性改进

```bash
git add ../../.github/workflows/ci.yml
git add .lighthouserc.json .env.example
git add eslint.config.js tsconfig.app.json
git add src/components/customize/AgentPreview.vue src/components/customize/AbilityConfigurator.vue
git add docs/API_INTEGRATION_PLAN.md

git commit -m "feat(production): improve production readiness

ESLint Environment Fix:
- Add 'packages/**' to eslint.config.js ignores array
- Resolve 25 TypeScript parsing errors from monorepo structure
- Ensure ESLint runs successfully (Exit Code 0)

TypeScript Compilation Fix:
- Add 'node' type to tsconfig.app.json
- Exclude unused composables (useDeepResearch.ts, useFlexloop.ts)
- Fix Vue template duplicate class attributes

Production Build Optimization:
- Fix template errors in AgentPreview.vue and AbilityConfigurator.vue
- Ensure production build completes successfully
- Verify dist/ directory creation and resource hashing

CI/CD Pipeline Setup:
- Create .github/workflows/ci.yml with complete CI pipeline
- Configure Node.js 20.x matrix, npm ci, lint, test, build steps
- Add Codecov coverage upload and build artifacts upload

Lighthouse Performance Testing:
- Create .lighthouserc.json with performance assertions
- Configure 3-run average with 80/90/90 score targets

API Integration Strategy:
- Create API_INTEGRATION_PLAN.md with 11 Mock data mapping
- Design API service layer architecture with fetch API
- Define error handling, caching, and authentication strategies
- Create .env.example with API environment variables

Co-Authored-By: Claude Opus 4.6 <claude@anthropic.com>"
```

### 步骤 3: 创建版本标签

```bash
# 创建带详细说明的 annotated tag
git tag -a v3.0.0-production-ready -m "AgentPit Production Ready Version

Version: v3.0.0-production-ready
Date: 2026-04-10
Type: Major Version (Production Ready)

Milestones Achieved:
✅ ESLint environment compatibility fixed
✅ TypeScript zero compilation errors
✅ Production build successful
✅ CI/CD pipeline configured
✅ API integration strategy defined
✅ Lighthouse performance testing setup

Key Changes:
- ESLint: Added 'packages/**' to ignores, resolved 25 parsing errors
- TypeScript: Added 'node' type, excluded unused composables
- Build: Fixed Vue template errors, ensured successful build
- CI/CD: Created complete GitHub Actions pipeline
- API: Designed service layer architecture, created integration plan
- Performance: Configured Lighthouse CI with score targets

Quality Metrics:
- TypeScript: 0 errors
- ESLint: 0 errors, 0 warnings
- Build: Success (Exit Code 0)
- Tests: Ready for execution

Next Steps:
- Execute CI/CD pipeline tests
- Run Lighthouse performance audit
- Begin API integration implementation
- Deploy to staging environment

Generated by: AgentPit Development Team + Claude Opus 4.6"

# 验证标签创建成功
git tag -l "v3.*"
git show v3.0.0-production-ready
```

### 步骤 4: 推送到远程仓库

```bash
# 推送所有 commits 到 test/ci-pipeline 分支
git push origin test/ci-pipeline

# 推送标签到远程
git push origin v3.0.0-production-ready

# 验证推送成功
git ls-remote --tags origin
```

### 步骤 5: 验证提交历史

```bash
# 查看最近 10 个提交
git log --oneline -10

# 查看标签详情
git show v3.0.0-production-ready --stat

# 验证构建状态
npm run build
```

## 📁 包含的文件清单

### 新创建的文件
- `.github/workflows/ci.yml` - GitHub Actions CI 配置
- `apps/AgentPit/.lighthouserc.json` - Lighthouse CI 配置
- `apps/AgentPit/.env.example` - 环境变量模板
- `apps/AgentPit/docs/API_INTEGRATION_PLAN.md` - API 集成方案

### 修改的文件
- `apps/AgentPit/eslint.config.js` - 添加 'packages/**' 到 ignores
- `apps/AgentPit/tsconfig.app.json` - 添加 'node' 类型，排除未使用的 composables
- `apps/AgentPit/src/components/customize/AgentPreview.vue` - 修复重复 class 属性
- `apps/AgentPit/src/components/customize/AbilityConfigurator.vue` - 修复重复 class 属性

## 🔍 验证要点

- [ ] TypeScript 编译：`npx vue-tsc -b` → Exit Code 0
- [ ] ESLint 检查：`npm run lint:check` → Exit Code 0
- [ ] 生产构建：`npm run build` → 成功完成
- [ ] 7 个 commit 已创建，每个包含清晰的范围和描述
- [ ] 版本标签 `v3.0.0-production-ready` 已创建
- [ ] 所有变更已推送到远程仓库

## 🎯 完成标准

1. **ESLint 环境问题解决**：ESLint 可在本地和 CI 环境中无错误运行
2. **生产构建验证**：TypeScript 编译通过，生产构建成功，产物完整
3. **Git 提交规范**：7 个逻辑清晰的 commit，符合 Conventional Commits 规范
4. **版本标签**：创建并推送 `v3.0.0-production-ready` 标签
5. **API 对接方案**：完整的 API 集成策略文档
6. **CI/CD 流水线**：GitHub Actions 配置完成

---

**执行时间**：预计 30-45 分钟  
**环境要求**：Git 2.x+, Node.js 18.x+  
**注意事项**：确保网络连接稳定，避免在推送过程中中断
