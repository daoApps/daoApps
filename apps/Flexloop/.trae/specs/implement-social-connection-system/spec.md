# 社交连接系统模块 Spec

## Why
当前 SocialPage 仅为简单的静态占位符页面，无法满足用户对完整社交功能的需求。需要构建一个功能丰富、交互流畅的社交连接系统，包含用户推荐、约会匹配、视频会议、社交动态、好友管理、通知中心等核心社交场景，提升用户在 AgentPit 平台上的社交体验和用户粘性。

## What Changes
- **新建** `src/data/mockSocial.ts` — 包含 15-20 个模拟用户的完整数据集（用户资料、动态内容、会议数据、通知数据、匹配历史）
- **新建** `src/components/social/UserProfileCard.tsx` — 用户资料卡组件（头像、基本信息、关注/粉丝统计、关注按钮、消息按钮、在线状态指示器）
- **新建** `src/components/social/UserRecommendationList.tsx` — 推荐用户列表组件（卡片网格布局、匹配度显示、共同兴趣标签、无限滚动加载、筛选排序功能）
- **新建** `src/components/social/DatingMatch.tsx` — 约会交友匹配组件（Tinder 式卡片滑动界面、左滑跳过/右滑喜欢/超级喜欢、匹配成功动画、历史记录查看）
- **新建** `src/components/social/MeetingRoom.tsx` — 视频会议 UI 组件（会议列表展示、创建会议表单、会议详情页、日历集成视图、提醒通知功能）
- **新建** `src/components/social/SocialFeed.tsx` — 社交动态信息流组件（时间线布局、动态卡片、发布编辑器、点赞评论分享收藏交互、话题标签支持）
- **新建** `src/components/social/FriendsSystem.tsx` — 好友关注系统组件（好友列表、关注/粉丝列表、好友请求处理、搜索功能、分组管理）
- **新建** `src/components/social/NotificationPanel.tsx` — 消息通知面板组件（通知列表、未读标记、分类筛选、全部已读操作、设置入口）
- **重写** `src/pages/SocialPage.tsx` — 整合所有子组件的主页面（顶部 Tab 导航切换、响应式布局、状态管理协调）

## Impact
- Affected specs: 无（新功能模块）
- Affected code:
  - `src/pages/SocialPage.tsx`（完全重写）
  - 新增 `src/data/mockSocial.ts` 及 `src/components/social/` 目录下 7 个组件文件

## ADDED Requirements

### Requirement: 模拟数据层
系统 SHALL 提供完整的模拟数据集 `mockSocial.ts`，包含以下数据结构：

#### 数据结构要求
- **User 类型**: id, name, avatar, age, location, bio, interests(string[]), onlineStatus, followersCount, followingCount, matchScore
- **Post 类型**: id, authorId, content, images?(string[]), likes, comments, shares, createdAt, tags?(string[])
- **Meeting 类型**: id, title, description, hostId, participants(string[]), startTime, endTime, status, type
- **Notification 类型**: id, type, title, message, fromUserId?, isRead, createdAt, actionUrl?
- **MatchRecord 类型**: userId, action('like'|'superlike'|'skip'), matched, timestamp

#### Scenario: 数据完整性
- **WHEN** 组件引用模拟数据时
- **THEN** 数据 SHALL 包含 15-20 个用户、至少 10 条动态、5 个会议记录、8 条通知、若干匹配记录

### Requirement: UserProfileCard 组件
系统 SHALL 提供 UserProfileCard 组件用于展示用户详细资料信息。

#### UI 元素
- 圆形头像（带在线状态指示点）
- 用户名 + 年龄 + 位置信息
- 个人简介文本
- 兴趣标签列表（可点击）
- 关注数 / 粉丝数统计行
- 关注按钮（已关注/未关注状态切换）
- 发消息按钮

#### Scenario: 基本展示
- **WHEN** 传入 user prop 时
- **THEN** 组件 SHALL 渲染完整的用户资料卡片，包含所有上述 UI 元素

### Requirement: UserRecommendationList 组件
系统 SHALL 提供 UserRecommendationList 组件用于展示推荐用户网格列表。

#### 功能特性
- 响应式网格布局（移动端 2 列，平板 3 列，桌面端 4 列）
- 每张卡片显示头像、姓名、年龄、位置、匹配度百分比、共同兴趣标签
- 卡片 hover 效果：轻微上浮 + 阴影增强
- 点击卡片打开 UserProfileCard 详情
- 无限滚动加载更多推荐
- 顶部筛选栏：按匹配度/距离/活跃度排序；兴趣标签过滤

#### Scenario: 推荐列表渲染
- **WHEN** 组件挂载时
- **THEN** SHALL 从 mockSocial 加载用户数据并以网格形式渲染推荐卡片

### Requirement: DatingMatch 组件
系统 SHALL 提供 DatingMatch 组件提供 Tinder 式滑动匹配体验。

#### 核心交互
- 中央大卡片展示当前推荐用户（全屏或大区域卡片）
- 左侧按钮 / 左滑 = 跳过（带旋转飞出动画）
- 右侧按钮 / 右滑 = 喜欢（带飞出动画）
- 上方按钮 / 上滑 = 超级喜欢（带特殊高亮动画）
- 匹配成功时弹出庆祝动画弹窗
- 底部导航查看匹配历史记录

#### Scenario: 滑动匹配流程
- **WHEN** 用户右滑一个用户且该用户也喜欢了当前用户时
- **THEN** SHALL 触发匹配成功动画并记录到匹配历史

### Requirement: MeetingRoom 组件
系统 SHALL 提供 MeetingRoom 组件提供视频会议管理界面。

#### 页面结构
- 会议列表视图：展示即将开始的会议、进行中的会议、历史会议
- 创建会议表单：标题、描述、时间选择、参与者邀请
- 会议详情页：会议信息、参与者列表、加入会议按钮
- 日历集成：以日历形式可视化展示会议安排
- 提醒通知：会议开始前推送通知

#### Scenario: 会议创建与展示
- **WHEN** 用户填写表单并提交创建会议时
- **THEN** 新会议 SHALL 出现在会议列表中并在日历视图中标记

### Requirement: SocialFeed 组件
系统 SHALL 提供 SocialFeed 组件提供社交动态信息流。

#### 核心功能
- 时间线布局的动态列表（最新在前）
- 动态卡片：作者头像+名称、发布时间、文字内容、图片（最多9宫格）、互动栏（点赞/评论/分享/收藏数量+图标）
- 发布编辑器：文本输入框、图片上传入口、话题标签添加、发布按钮
- 点赞切换（已点赞高亮）、评论展开收起、分享选项、收藏功能
- 话题标签点击可筛选相关动态

#### Scenario: 动态发布与展示
- **WHEN** 用户在编辑器输入内容并点击发布时
- **THEN** 新动态 SHALL 出现在信息流顶部

### Requirement: FriendsSystem 组件
系统 SHALL 提供 FriendsSystem 组件管理好友关系。

#### 功能模块
- 好友列表：在线/离线状态分组，搜索过滤
- 关注/粉丝列表：分 Tab 展示关注的人和粉丝
- 好友请求：接收到的请求列表 + 已发送请求列表，接受/拒绝/撤销操作
- 搜索：全局用户搜索（按用户名/兴趣）
- 分组管理：创建/编辑/删除好友分组，拖拽分配好友到分组

#### Scenario: 好友请求处理
- **WHEN** 用户收到好友请求并点击接受时
- **THEN** 该用户 SHALL 移入好友列表并从请求列表中移除

### Requirement: NotificationPanel 组件
系统 SHALL 提供 NotificationPanel 组件集中展示消息通知。

#### 功能需求
- 通知列表：时间倒序排列，每条通知含图标、标题、摘要、时间、未读标识
- 分类筛选：全部 / 喜欢 / 评论 / 好友请求 / 系统 / 会议
- 全部已读：一键将所有通知标记为已读
- 未读计数角标
- 设置入口：链接到通知偏好设置
- 点击通知跳转对应页面

#### Scenario: 通知阅读与筛选
- **WHEN** 用户点击"全部已读"按钮时
- **THEN** 所有未读通知的状态 SHALL 更新为已读，未读计数归零

### Requirement: SocialPage 主页面
系统 SHALL 重写 SocialPage 作为社交模块的主入口页面，整合所有子组件。

#### 页面架构
- 顶部标题区：页面标题 + 副标题
- Tab 导航栏：推荐 | 约会 | 会议 | 动态 | 好友 | 通知（6 个 Tab）
- 内容区：根据选中 Tab 渲染对应子组件
- 响应式设计：移动端底部 Tab 栏，桌面端顶部 Tab 栏
- 浮动通知铃铛按钮（始终可见，点击展开 NotificationPanel 抽屉）

#### Scenario: Tab 切换
- **WHEN** 用户点击不同 Tab 时
- **THEN** 内容区 SHALL 平滑切换为对应子组件，Tab 高亮状态同步更新

## MODIFIED Requirements
无（新功能模块，不修改已有功能）

## REMOVED Requirements
无
