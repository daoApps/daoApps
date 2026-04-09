export interface UserProfile {
  nickname: string
  realName: string
  gender: 'male' | 'female' | 'other'
  birthday: string
  location: string
  email: string
  phone: string
  bio: string
  interests: string[]
  avatar: string
  socialAccounts: {
    wechat: { bound: boolean; username?: string }
    qq: { bound: boolean; username?: string }
    weibo: { bound: boolean; username?: string }
    github: { bound: boolean; username?: string }
  }
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  layoutDensity: 'comfortable' | 'compact' | 'spacious'
  sidebarMode: 'always' | 'auto' | 'hidden'
  reduceMotion: boolean
}

export interface NotificationSettings {
  browserPush: boolean
  emailNotification: boolean
  smsNotification: boolean
  inAppNotification: boolean
  systemNotifications: boolean
  socialInteractions: boolean
  transactionAlerts: boolean
  meetingReminders: boolean
  marketingMessages: boolean
  doNotDisturbStart: string
  doNotDisturbEnd: string
  emailFrequency: 'realtime' | 'daily' | 'weekly'
  smsFrequency: 'unlimited' | 'max5' | 'max10'
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod: 'sms' | 'email'
  devices: Device[]
  profileVisibility: 'public' | 'friends' | 'private'
  showOnlineStatus: boolean
  showReadReceipts: boolean
  showActivityStatus: boolean
}

export interface Device {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  lastActive: string
  isCurrentDevice: boolean
}

export interface FAQItem {
  id: string
  category: 'getting-started' | 'features' | 'faq' | 'troubleshooting' | 'support'
  title: string
  summary: string
  content: string
  tags: string[]
  updatedAt: string
  helpful: number
  notHelpful: number
}

export interface HelpArticle {
  id: string
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  updatedAt: string
  readTime: number
}

export const defaultUserProfile: UserProfile = {
  nickname: '智能体用户',
  realName: '',
  gender: 'other',
  birthday: '1990-01-01',
  location: '北京',
  email: 'user@example.com',
  phone: '138****8888',
  bio: '热爱技术，享受生活',
  interests: ['科技', '旅行', '阅读', '音乐'],
  avatar: '',
  socialAccounts: {
    wechat: { bound: true, username: 'user_wechat' },
    qq: { bound: false },
    weibo: { bound: true, username: '@智能体用户' },
    github: { bound: false },
  },
}

export const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  primaryColor: '#6366f1',
  fontSize: 'medium',
  layoutDensity: 'comfortable',
  sidebarMode: 'always',
  reduceMotion: false,
}

export const defaultNotificationSettings: NotificationSettings = {
  browserPush: true,
  emailNotification: true,
  smsNotification: false,
  inAppNotification: true,
  systemNotifications: true,
  socialInteractions: true,
  transactionAlerts: true,
  meetingReminders: true,
  marketingMessages: false,
  doNotDisturbStart: '22:00',
  doNotDisturbEnd: '08:00',
  emailFrequency: 'daily',
  smsFrequency: 'max5',
}

export const defaultSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  twoFactorMethod: 'sms',
  devices: [
    {
      id: 'device-1',
      name: '我的电脑',
      type: 'desktop',
      os: 'Windows 11',
      browser: 'Chrome 120',
      lastActive: new Date().toISOString(),
      isCurrentDevice: true,
    },
    {
      id: 'device-2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      os: 'iOS 17.2',
      browser: 'Safari',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isCurrentDevice: false,
    },
    {
      id: 'device-3',
      name: 'MacBook Pro',
      type: 'desktop',
      os: 'macOS Sonoma',
      browser: 'Chrome 120',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isCurrentDevice: false,
    },
  ],
  profileVisibility: 'friends',
  showOnlineStatus: true,
  showReadReceipts: true,
  showActivityStatus: false,
}

export const presetInterests = [
  '科技', '旅行', '阅读', '音乐', '电影', '美食',
  '运动', '游戏', '摄影', '艺术', '编程', '设计',
  '投资', '健身', '宠物', '园艺', '烹饪', '手工',
]

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'getting-started',
    title: '如何开始使用平台？',
    summary: '快速了解平台的注册流程和基本功能介绍',
    content: '欢迎使用我们的平台！开始使用非常简单：\n\n1. **注册账号**：点击页面右上角的"注册"按钮，填写基本信息即可完成注册。\n\n2. **完善资料**：登录后，建议您先完善个人资料，包括头像、昵称、兴趣标签等。\n\n3. **探索功能**：浏览首页的功能卡片，了解平台提供的各项服务。\n\n4. **创建内容**：尝试发布您的第一个帖子或创建第一个项目。\n\n5. **连接社交**：在设置中绑定您的社交账号，与好友互动。',
    tags: ['入门', '新手指南'],
    updatedAt: '2026-04-08',
    helpful: 156,
    notHelpful: 8,
  },
  {
    id: 'faq-2',
    category: 'getting-started',
    title: '账号安全设置建议',
    summary: '保护您账号安全的最佳实践和建议',
    content: '为了确保您的账号安全，我们强烈建议您：\n\n### 基础安全措施\n- 使用强密码（至少12位，包含大小写字母、数字和特殊字符）\n- 定期更换密码（建议每3个月）\n- 开启两步验证（2FA）\n\n### 高级安全选项\n- 绑定手机号和邮箱\n- 定期检查登录设备\n- 设置隐私权限\n- 启用登录通知\n\n### 密码管理建议\n- 不要在不同平台使用相同密码\n- 使用密码管理器\n- 避免使用个人信息作为密码',
    tags: ['安全', '账号保护'],
    updatedAt: '2026-04-07',
    helpful: 203,
    notHelpful: 12,
  },
  {
    id: 'faq-3',
    category: 'features',
    title: '会议日历功能详解',
    summary: '了解如何高效使用会议日历管理您的日程',
    content: '会议日历是平台的核心功能之一，帮助您高效管理时间：\n\n### 创建会议\n1. 点击"创建新会议"按钮\n2. 填写会议主题、时间、参与者等信息\n3. 选择会议类型（视频/线下/电话）\n4. 设置提醒时间和重复规则\n\n### 日历视图\n- **月视图**：查看整月日程安排\n- **周视图**：详细规划每周安排\n- **日视图**：专注于当天的具体事项\n\n### 高级功能\n- 拖拽调整会议时间\n- 与团队成员共享日历\n- 自动生成会议纪要\n- 智能推荐最佳会议时间',
    tags: ['会议', '日历', '效率'],
    updatedAt: '2026-04-06',
    helpful: 178,
    notHelpful: 15,
  },
  {
    id: 'faq-4',
    category: 'features',
    title: '旅游规划工具使用指南',
    summary: '从目的地选择到行程导出的完整教程',
    content: '旅游规划工具让您的旅行规划变得轻松愉快：\n\n### 步骤一：选择目的地\n- 使用搜索框查找城市或景点\n- 浏览推荐的景点列表\n- 查看景点详情（评分、门票价格、游览时间等）\n\n### 步骤二：规划行程\n- 设置出发和返回日期\n- 系统自动按天数分栏\n- 为每天添加活动（上午/下午/晚上时段）\n- 选择交通方式和住宿\n\n### 步骤三：预算管理\n- 实时计算总预算\n- 分类显示费用明细\n- 支持调整优化\n\n### 步骤四：导出分享\n- 导出为PDF文档\n- 生成图片格式\n- 创建分享链接给好友',
    tags: ['旅游', '规划', '旅行'],
    updatedAt: '2026-04-05',
    helpful: 145,
    notHelpful: 9,
  },
  {
    id: 'faq-5',
    category: 'faq',
    title: '如何修改个人资料？',
    summary: '更新您的个人信息和偏好设置',
    content: '修改个人资料非常简单：\n\n1. 进入"设置"页面\n2. 点击左侧菜单的"个人资料"\n3. 编辑您想要更改的信息\n4. 点击"保存更改"\n\n**注意**：某些敏感信息（如邮箱、手机号）需要验证后才能修改。',
    tags: ['个人资料', '账户设置'],
    updatedAt: '2026-04-05',
    helpful: 234,
    notHelpful: 18,
  },
  {
    id: 'faq-6',
    category: 'faq',
    title: '忘记密码怎么办？',
    summary: '找回或重置密码的详细步骤',
    content: '如果您忘记了密码，请按照以下步骤操作：\n\n1. 在登录页面点击"忘记密码"\n2. 输入您注册时使用的邮箱或手机号\n3. 查收验证码或重置链接\n4. 输入新密码并确认\n5. 使用新密码登录\n\n**提示**：如果您无法接收验证码，请联系客服获取帮助。',
    tags: ['密码', '找回密码', '登录问题'],
    updatedAt: '2026-04-04',
    helpful: 189,
    notHelpful: 11,
  },
  {
    id: 'faq-7',
    category: 'troubleshooting',
    title: '页面加载缓慢怎么办？',
    summary: '解决网页性能问题的常见方法',
    content: '如果遇到页面加载缓慢的问题，请尝试以下解决方案：\n\n### 浏览器端\n1. 清除浏览器缓存和Cookie\n2. 禁用不必要的浏览器扩展\n3. 尝试使用无痕模式\n4. 更新浏览器到最新版本\n\n### 网络环境\n1. 检查网络连接是否稳定\n2. 尝试切换网络（WiFi/移动数据）\n3. 关闭VPN或代理\n\n### 如果问题持续存在\n- 刷新页面（Ctrl+F5 / Cmd+Shift+R）\n- 清除应用缓存\n- 联系技术支持团队',
    tags: ['性能', '加载慢', '故障排除'],
    updatedAt: '2026-04-03',
    helpful: 167,
    notHelpful: 22,
  },
  {
    id: 'faq-8',
    category: 'support',
    title: '如何联系客服？',
    summary: '获取帮助和支持的各种渠道',
    content: '我们提供多种方式为您提供服务支持：\n\n### 在线客服\n- 工作时间：周一至周日 9:00-22:00\n- 平均响应时间：< 5分钟\n\n### 邮件支持\n- 邮箱地址：support@example.com\n- 响应时间：24小时内\n\n### 反馈表单\n- 在"帮助中心"页面提交反馈\n- 我们会在1-3个工作日内回复\n\n### 社区论坛\n- 访问用户社区提问\n- 其他用户或版主会帮助您',
    tags: ['客服', '联系方式', '支持'],
    updatedAt: '2026-04-02',
    helpful: 298,
    notHelpful: 5,
  },
]

export const helpArticles: HelpArticle[] = [
  {
    id: 'article-1',
    title: '新手入门完全指南',
    summary: '从零开始学习如何使用平台的全部功能',
    content: '这是一份详尽的新手入门指南...',
    category: 'getting-started',
    tags: ['入门', '教程', '新手'],
    updatedAt: '2026-04-09',
    readTime: 10,
  },
  {
    id: 'article-2',
    title: '高效办公技巧集锦',
    summary: '提升工作效率的实用技巧和方法',
    content: '掌握这些技巧，让工作事半功倍...',
    category: 'features',
    tags: ['效率', '办公', '技巧'],
    updatedAt: '2026-04-08',
    readTime: 8,
  },
  {
    id: 'article-3',
    title: '数据安全白皮书',
    summary: '了解我们如何保护您的数据和隐私',
    content: '数据安全是我们的首要任务...',
    category: 'security',
    tags: ['安全', '隐私', '数据'],
    updatedAt: '2026-04-07',
    readTime: 15,
  },
]

export const updateLogs = [
  {
    version: 'v2.5.0',
    date: '2026-04-09',
    features: [
      '新增生活服务模块（会议日历、旅游规划、游戏中心）',
      '优化系统设置界面，新增主题自定义功能',
      '改进通知系统，支持更精细的通知控制',
      '修复若干已知问题，提升系统稳定性',
    ],
  },
  {
    version: 'v2.4.0',
    date: '2026-04-01',
    features: [
      '新增社交模块好友系统和动态功能',
      '改进聊天体验，支持富文本消息',
      '优化移动端适配效果',
    ],
  },
  {
    version: 'v2.3.0',
    date: '2026-03-25',
    features: [
      '新增变现模块，支持多种收益渠道',
      '添加钱包功能和交易记录查询',
      '引入数据分析仪表盘',
    ],
  },
]
