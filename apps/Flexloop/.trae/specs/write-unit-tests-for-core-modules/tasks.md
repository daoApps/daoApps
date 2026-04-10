# Layout、Chat、Marketplace 核心模块单元测试 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 为 Layout 模块的 Header 组件编写测试
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 Header.spec.ts 测试文件
  - 测试组件的基础渲染和 Props 传递（logoText、showSearch、showNotifications）
  - 测试导航菜单的渲染和当前路由高亮
  - 测试搜索功能：输入搜索内容、触发搜索事件
  - 测试主题切换功能：点击切换按钮、验证 store 方法调用
  - 测试用户菜单：点击头像展开菜单、点击菜单项
  - 测试移动端菜单按钮：点击触发 toggle-sidebar 事件
- **Acceptance Criteria Addressed**: AC-1, AC-6
- **Test Requirements**:
  - `programmatic` TR-1.1: Header 组件能够正确渲染所有元素（Logo、导航、搜索框、通知图标、主题切换、用户头像）
  - `programmatic` TR-1.2: Props 能够正确影响组件渲染（showSearch、showNotifications）
  - `programmatic` TR-1.3: 搜索功能能够正确触发 search 事件
  - `programmatic` TR-1.4: 主题切换按钮能够正确调用 appStore.toggleDarkMode()
  - `programmatic` TR-1.5: 用户菜单能够正确展开和收起
  - `programmatic` TR-1.6: 移动端菜单按钮能够正确触发 toggle-sidebar 事件
- **Notes**: 需要 mock useAppStore 和 useRoute

## [ ] Task 2: 为 Layout 模块的 Sidebar 组件编写测试
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 Sidebar.spec.ts 测试文件
  - 测试导航项的渲染：所有 navItems 都应该正确显示
  - 测试当前路由高亮：当前路径的导航项应该有激活样式
  - 测试侧边栏展开/收起：isExpanded 状态变化时 UI 应该正确更新
  - 测试折叠按钮：点击后调用 appStore.toggleSidebar()
  - 测试徽章显示：有 badge 的导航项应该显示徽章
  - 测试移动端侧边栏：isMobileOpen 状态变化时应该正确显示/隐藏
- **Acceptance Criteria Addressed**: AC-1, AC-6
- **Test Requirements**:
  - `programmatic` TR-2.1: 所有导航项都应该正确渲染，包括图标和文字
  - `programmatic` TR-2.2: 当前路由的导航项应该有激活样式
  - `programmatic` TR-2.3: 侧边栏展开时显示文字，收起时只显示图标
  - `programmatic` TR-2.4: 折叠按钮点击后应该调用 appStore.toggleSidebar()
  - `programmatic` TR-2.5: 有 badge 的导航项应该正确显示徽章数字
  - `programmatic` TR-2.6: 移动端侧边栏在 isMobileOpen 为 true 时应该显示
- **Notes**: 需要 mock useAppStore 和 useRoute

## [ ] Task 3: 为 Layout 模块的 MainLayout 组件编写测试
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 创建 MainLayout.spec.ts 测试文件
  - 测试布局的基础渲染：Header、Sidebar、Footer 和插槽内容都应该显示
  - 测试侧边栏宽度变化：sidebarOpen 状态变化时，侧边栏宽度和主内容区 margin 应该更新
  - 测试 handleToggleSidebar 方法：应该调用 appStore.toggleSidebar()
  - 测试响应式布局：移动端应该隐藏侧边栏
- **Acceptance Criteria Addressed**: AC-1, AC-6
- **Test Requirements**:
  - `programmatic` TR-3.1: MainLayout 应该正确渲染 Header、Sidebar 和 Footer 组件
  - `programmatic` TR-3.2: 插槽内容应该正确显示
  - `programmatic` TR-3.3: sidebarOpen 为 true 时，侧边栏宽度为 w-64，主内容区 margin 为 lg:ml-64
  - `programmatic` TR-3.4: sidebarOpen 为 false 时，侧边栏宽度为 w-16，主内容区 margin 为 lg:ml-16
  - `programmatic` TR-3.5: handleToggleSidebar 被调用时，应该调用 appStore.toggleSidebar()
- **Notes**: 需要 mock useAppStore

## [ ] Task 4: 为 Chat 模块的 MessageInput 组件编写测试
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 MessageInput.spec.ts 测试文件
  - 测试输入功能：v-model 双向绑定应该正常工作
  - 测试自动调整高度：输入内容时 textarea 高度应该自动调整
  - 测试发送功能：点击发送按钮或按 Enter 键应该触发 send 事件
  - 测试字符限制：超过 MAX_CHARS (2000) 时应该显示红色警告
  - 测试禁用状态：disabled 或 isStreaming 为 true 时应该禁用输入和发送
  - 测试附件按钮：点击不同的附件按钮应该触发 attach-file 事件
  - 测试 Shift+Enter：按 Shift+Enter 应该换行而不是发送
- **Acceptance Criteria Addressed**: AC-2, AC-6
- **Test Requirements**:
  - `programmatic` TR-4.1: v-model 双向绑定应该正常工作，输入内容能够正确更新
  - `programmatic` TR-4.2: 点击发送按钮应该触发 send 事件
  - `programmatic` TR-4.3: 按 Enter 键（不按 Shift）应该触发 send 事件
  - `programmatic` TR-4.4: 按 Shift+Enter 应该换行，不触发 send 事件
  - `programmatic` TR-4.5: 字符数超过 2000 时，计数应该显示红色，发送按钮应该禁用
  - `programmatic` TR-4.6: disabled 或 isStreaming 为 true 时，textarea 和发送按钮应该禁用
  - `programmatic` TR-4.7: 点击附件按钮（图片、文件、代码）应该触发 attach-file 事件，参数正确
- **Notes**: 这是一个相对独立的组件，测试应该比较简单

## [ ] Task 5: 为 Chat 模块的 ChatInterface 组件编写测试
- **Priority**: P1
- **Depends On**: Task 4
- **Description**: 
  - 创建 ChatInterface.spec.ts 测试文件
  - 测试组件基础渲染：ChatSidebar、MessageList、MessageInput、QuickCommands 应该正确显示
  - 测试消息发送：调用 handleSendMessage 应该添加用户消息和 AI 消息
  - 测试快捷指令：选择快捷指令应该填充输入框并发送
  - 测试侧边栏切换：toggleSidebar 应该切换 showSidebar 状态
  - 测试流式输出：isStreaming 为 true 时应该显示加载状态
- **Acceptance Criteria Addressed**: AC-2, AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: ChatInterface 应该正确渲染所有子组件
  - `programmatic` TR-5.2: 发送消息应该调用 chatStore.addMessage
  - `programmatic` TR-5.3: 选择快捷指令应该调用 handleSendMessage
  - `programmatic` TR-5.4: 点击侧边栏切换按钮应该更新 showSidebar 状态
  - `programmatic` TR-5.5: isStreaming 为 true 时，MessageInput 应该显示禁用状态
- **Notes**: 需要 mock useChatStore、useLanguageDetection 等 composables

## [ ] Task 6: 为 Marketplace 模块的 ProductGrid 组件编写测试
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 ProductGrid.spec.ts 测试文件
  - 测试空状态：products 为空数组时应该显示空状态提示
  - 测试商品渲染：每个商品卡片应该正确显示图片、名称、价格、评分、销量等信息
  - 测试标签显示：商品的 tags 应该正确显示（新品、热销、折扣、推荐）
  - 测试折扣显示：有 originalPrice 的商品应该显示折扣百分比
  - 测试收藏功能：点击收藏按钮应该切换收藏状态，触发 toggleFavorite 事件
  - 测试添加购物车：点击购物车按钮应该触发 addToCart 事件
  - 测试商品导航：点击商品卡片应该导航到商品详情页
  - 测试星星评分：评分应该正确渲染星星数量
- **Acceptance Criteria Addressed**: AC-3, AC-6
- **Test Requirements**:
  - `programmatic` TR-6.1: products 为空时应该显示空状态提示
  - `programmatic` TR-6.2: 每个商品卡片应该正确显示商品信息（图片、名称、价格、评分、销量）
  - `programmatic` TR-6.3: 商品标签应该正确显示，样式正确
  - `programmatic` TR-6.4: 有折扣的商品应该显示折扣百分比
  - `programmatic` TR-6.5: 点击收藏按钮应该切换 favorites 状态，触发 toggleFavorite 事件
  - `programmatic` TR-6.6: 点击购物车按钮应该触发 addToCart 事件，参数正确
  - `programmatic` TR-6.7: 点击商品卡片应该调用 router.push，导航到正确的路径
  - `programmatic` TR-6.8: 星星评分应该正确渲染，与 rating 一致
- **Notes**: 需要 mock useRouter，使用 mock 商品数据

## [ ] Task 7: 运行测试并修复问题
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5, Task 6
- **Description**: 
  - 运行所有新编写的测试
  - 修复测试中发现的问题（可能是测试代码问题，也可能是组件实现问题）
  - 确保所有测试用例都能通过
- **Acceptance Criteria Addressed**: AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-7.1: 运行 `npm run test:run` 时所有测试用例都通过
  - `programmatic` TR-7.2: 连续运行 3 次测试，所有测试用例都稳定通过
- **Notes**: 如果发现组件实现有问题，需要和团队确认后再修改

## [ ] Task 8: 生成并检查测试覆盖率报告
- **Priority**: P1
- **Depends On**: Task 7
- **Description**: 
  - 运行 `npm run test:coverage` 生成覆盖率报告
  - 检查 Layout、Chat、Marketplace 模块组件的覆盖率
  - 确保覆盖率达到或超过 thresholds（lines: 80%, functions: 80%, branches: 75%, statements: 80%）
  - 如果覆盖率不达标，添加更多测试用例
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-8.1: 测试覆盖率报告显示 Layout 模块组件达到覆盖率要求
  - `programmatic` TR-8.2: 测试覆盖率报告显示 Chat 模块组件达到覆盖率要求
  - `programmatic` TR-8.3: 测试覆盖率报告显示 Marketplace 模块组件达到覆盖率要求
- **Notes**: 主要关注组件文件的覆盖率，不包括 types、data 等目录
