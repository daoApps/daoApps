# Tasks

- [ ] Task 1: 创建模拟数据文件 `src/data/mockSocial.ts`
  - [ ] 定义 TypeScript 类型接口（User, Post, Meeting, Notification, MatchRecord）
  - [ ] 创建 15-20 个模拟用户数据（含多样化资料：年龄、位置、兴趣、在线状态）
  - [ ] 创建 10+ 条社交动态数据（含不同类型内容、图片、标签、互动数）
  - [ ] 创建 5 个会议数据（含不同状态：即将开始/进行中/已结束）
  - [ ] 创建 8 条通知数据（含多种类型：喜欢/评论/好友请求/系统/会议）
  - [ ] 创建匹配历史记录数据
  - [ ] 导出所有数据常量

- [ ] Task 2: 创建 UserProfileCard 组件 `src/components/social/UserProfileCard.tsx`
  - [ ] 定义 Props 接口（user, isFollowing, onFollow, onMessage 等）
  - [ ] 实现用户头像 + 在线状态指示器
  - [ ] 实现基本信息展示区（姓名、年龄、位置、简介）
  - [ ] 实现兴趣标签列表
  - [ ] 实现关注/粉丝统计行
  - [ ] 实现关注按钮（状态切换逻辑）
  - [ ] 实现发消息按钮
  - [ ] 添加 hover 效果和过渡动画

- [ ] Task 3: 创建 UserRecommendationList 组件 `src/components/social/UserRecommendationList.tsx`
  - [ ] 定义 Props 接口（users, onUserClick, onFollow 等）
  - [ ] 实现响应式网格布局（2/3/4 列自适应）
  - [ ] 实现推荐用户卡片组件（头像、姓名、年龄、位置、匹配度、共同兴趣）
  - [ ] 实现卡片 hover 上浮 + 阴影增强效果
  - [ ] 实现顶部筛选排序栏（按匹配度/距离/活跃度排序，兴趣标签过滤）
  - [ ] 实现无限滚动加载更多逻辑
  - [ ] 集成 UserProfileCard 作为点击详情弹层

- [ ] Task 4: 创建 DatingMatch 组件 `src/components/social/DatingMatch.tsx`
  - [ ] 定义 State 接口（currentIndex, matches, history 等）
  - [ ] 实现中央大卡片 UI（全屏用户卡片展示）
  - [ ] 实现左滑跳过 + 右滑喜欢 + 上滑超级喜欢的手势/按钮交互
  - [ ] 实现卡片飞出动画（CSS transform + transition）
  - [ ] 实现匹配成功检测与庆祝动画弹窗
  - [ ] 实现底部匹配历史记录导航
  - [ ] 实现历史记录列表视图

- [ ] Task 5: 创建 MeetingRoom 组件 `src/components/social/MeetingRoom.tsx`
  - [ ] 定义 State 接口（meetings, currentView, selectedMeeting 等）
  - [ ] 实现会议列表视图（即将开始/进行中/历史分组）
  - [ ] 实现创建会议表单（标题、描述、时间、参与者）
  - [ ] 实现会议详情页（信息展示、参与者、加入按钮）
  - [ ] 实现日历集成视图（月历形式标记会议日期）
  - [ ] 实现会议状态切换和提醒通知模拟

- [ ] Task 6: 创建 SocialFeed 组件 `src/components/social/SocialFeed.tsx`
  - [ ] 定义 State 接口（posts, newPostContent, likedPosts 等）
  - [ ] 实现发布编辑器（文本输入、图片上传入口、话题标签、发布按钮）
  - [ ] 实现动态时间线列表布局
  - [ ] 实现动态卡片组件（作者信息、内容、图片九宫格、互动栏）
  - [ ] 实现点赞切换（高亮状态 + 计数更新）
  - [ ] 实现评论展开/收起功能
  - [ ] 实现分享选项和收藏功能
  - ] 实现话题标签点击筛选

- [ ] Task 7: 创建 FriendsSystem 组件 `src/components/social/FriendsSystem.tsx`
  - [ ] 定义 State 接口（friends, requests, searchQuery, groups 等）
  - [ ] 实现 Tab 切换（好友/关注/粉丝/请求）
  - [ ] 实现好友列表（在线状态分组 + 搜索过滤）
  - [ ] 实现关注/粉丝列表
  - [ ] 实现好友请求处理（接受/拒绝/撤销操作）
  - [ ] 实现全局用户搜索功能
  - [ ] 实现分组管理（CRUD 操作 + 好友分配）

- [ ] Task 8: 创建 NotificationPanel 组件 `src/components/social/NotificationPanel.tsx`
  - [ ] 定义 Props/State 接口（notifications, filter, unreadCount 等）
  - [ ] 实现通知列表渲染（图标、标题、摘要、时间、未读标识）
  - [ ] 实现分类筛选 Tab（全部/喜欢/评论/好友请求/系统/会议）
  - [ ] 实现全部已读功能
  - [ ] 实现未读计数角标显示
  - [ ] 实现设置入口链接
  - [ ] 实现点击通知跳转逻辑

- [ ] Task 9: 重写 SocialPage 主页面 `src/pages/SocialPage.tsx`
  - [ ] 导入所有子组件和 mock 数据
  - [ ] 实现 Tab 状态管理（activeTab state）
  - [ ] 实现顶部标题区域
  - [ ] 实现 Tab 导航栏 UI（6 个 Tab：推荐/约会/会议/动态/好友/通知）
  - [ ] 实现内容区条件渲染（根据 activeTab 渲染对应组件）
  - [ ] 实现响应式布局（移动端底部 Tab 栏适配）
  - [ ] 实现浮动通知铃铛按钮 + NotificationPanel 抽屉
  - [ ] 整体样式调优和过渡动画

# Task Dependencies
- [Task 2-8] depend on [Task 1]（所有组件依赖 mock 数据）
- [Task 9] depends on [Task 2, 3, 4, 5, 6, 7, 8]（主页面依赖所有子组件）
