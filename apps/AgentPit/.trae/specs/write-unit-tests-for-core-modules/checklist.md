# Layout、Chat、Marketplace 核心模块单元测试 - Verification Checklist

## 测试文件创建检查
- [ ] Header.spec.ts 测试文件已创建
- [ ] Sidebar.spec.ts 测试文件已创建
- [ ] MainLayout.spec.ts 测试文件已创建
- [ ] MessageInput.spec.ts 测试文件已创建
- [ ] ChatInterface.spec.ts 测试文件已创建
- [ ] ProductGrid.spec.ts 测试文件已创建

## Layout 模块测试覆盖检查
- [ ] Header 组件的基础渲染测试通过
- [ ] Header 组件的 Props 传递测试通过（logoText、showSearch、showNotifications）
- [ ] Header 组件的导航菜单渲染和当前路由高亮测试通过
- [ ] Header 组件的搜索功能测试通过
- [ ] Header 组件的主题切换功能测试通过
- [ ] Header 组件的用户菜单展开/收起测试通过
- [ ] Header 组件的移动端菜单按钮测试通过
- [ ] Sidebar 组件的导航项渲染测试通过
- [ ] Sidebar 组件的当前路由高亮测试通过
- [ ] Sidebar 组件的侧边栏展开/收起测试通过
- [ ] Sidebar 组件的折叠按钮测试通过
- [ ] Sidebar 组件的徽章显示测试通过
- [ ] Sidebar 组件的移动端侧边栏测试通过
- [ ] MainLayout 组件的基础渲染测试通过
- [ ] MainLayout 组件的侧边栏宽度变化测试通过
- [ ] MainLayout 组件的 handleToggleSidebar 方法测试通过

## Chat 模块测试覆盖检查
- [ ] MessageInput 组件的 v-model 双向绑定测试通过
- [ ] MessageInput 组件的发送功能测试通过（点击按钮和按 Enter）
- [ ] MessageInput 组件的 Shift+Enter 换行测试通过
- [ ] MessageInput 组件的字符限制测试通过
- [ ] MessageInput 组件的禁用状态测试通过
- [ ] MessageInput 组件的附件按钮测试通过
- [ ] ChatInterface 组件的基础渲染测试通过
- [ ] ChatInterface 组件的消息发送测试通过
- [ ] ChatInterface 组件的快捷指令测试通过
- [ ] ChatInterface 组件的侧边栏切换测试通过
- [ ] ChatInterface 组件的流式输出状态测试通过

## Marketplace 模块测试覆盖检查
- [ ] ProductGrid 组件的空状态测试通过
- [ ] ProductGrid 组件的商品渲染测试通过
- [ ] ProductGrid 组件的商品标签显示测试通过
- [ ] ProductGrid 组件的折扣显示测试通过
- [ ] ProductGrid 组件的收藏功能测试通过
- [ ] ProductGrid 组件的添加购物车功能测试通过
- [ ] ProductGrid 组件的商品导航测试通过
- [ ] ProductGrid 组件的星星评分测试通过

## 测试质量检查
- [ ] 测试代码遵循项目的代码风格
- [ ] 测试代码具有良好的可读性
- [ ] 测试用例描述清晰明确
- [ ] 测试使用了适当的 mock 数据
- [ ] 测试没有随机失败的情况
- [ ] 测试运行时间合理（< 10 秒）

## 测试覆盖率检查
- [ ] 运行 `npm run test:coverage` 生成了覆盖率报告
- [ ] Layout 模块组件的 lines 覆盖率 >= 80%
- [ ] Layout 模块组件的 functions 覆盖率 >= 80%
- [ ] Layout 模块组件的 branches 覆盖率 >= 75%
- [ ] Layout 模块组件的 statements 覆盖率 >= 80%
- [ ] Chat 模块组件的 lines 覆盖率 >= 80%
- [ ] Chat 模块组件的 functions 覆盖率 >= 80%
- [ ] Chat 模块组件的 branches 覆盖率 >= 75%
- [ ] Chat 模块组件的 statements 覆盖率 >= 80%
- [ ] Marketplace 模块组件的 lines 覆盖率 >= 80%
- [ ] Marketplace 模块组件的 functions 覆盖率 >= 80%
- [ ] Marketplace 模块组件的 branches 覆盖率 >= 75%
- [ ] Marketplace 模块组件的 statements 覆盖率 >= 80%

## 稳定性检查
- [ ] 连续运行 3 次 `npm run test:run`，所有测试用例都通过
- [ ] 没有间歇性失败的测试用例
- [ ] 测试之间没有相互影响
