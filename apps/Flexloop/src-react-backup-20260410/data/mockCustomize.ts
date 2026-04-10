export interface Avatar {
  id: string
  emoji: string
  category: 'person' | 'animal' | 'abstract' | 'tech'
  name: string
}

export interface ThemeColor {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  preview: string
}

export interface Ability {
  id: string
  name: string
  description: string
  category: 'general' | 'professional' | 'tool' | 'creative'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  isPremium: boolean
  price?: number
  dependencies?: string[]
}

export interface RoleTemplate {
  id: string
  name: string
  icon: string
  description: string
  recommendedAbilities: string[]
}

export interface AgentConfig {
  basicInfo: {
    name: string
    description: string
    roleType: string
    targetUsers: string
    language: string
  }
  appearance: {
    avatarId: string
    customAvatar?: string
    themeId: string
    customColors?: {
      primary: string
      secondary: string
      accent: string
    }
    bubbleStyle: {
      borderRadius: number
      opacity: number
      borderStyle: string
    }
    fontFamily: string
    greeting: string
  }
  abilities: {
    enabledAbilities: { [key: string]: Ability }
    systemPrompt: string
    exampleConversations: string[]
    restrictions: string[]
  }
  businessModel: {
    mode: 'free' | 'subscription' | 'payPerUse' | 'freemium' | 'adRevenue'
    pricing: {
      currency: string
      monthlyPrice?: number
      yearlyPrice?: number
      perUsePrice?: number
      trialDays?: number
    }
    membershipLevels: Array<{
      name: string
      price: number
      features: string[]
    }>
    serviceLimits: {
      dailyLimit?: number
      monthlyLimit?: number
      responseTime: string
    }
    paymentMethods: string[]
    platformCommission: number
  }
}

export const avatarLibrary: Avatar[] = [
  // 人物类 (8个)
  { id: 'p1', emoji: '👨‍💼', category: 'person', name: '商务人士' },
  { id: 'p2', emoji: '👩‍💼', category: 'person', name: '商务女士' },
  { id: 'p3', emoji: '👨‍🎓', category: 'person', name: '学生' },
  { id: 'p4', emoji: '👩‍🎓', category: 'person', name: '女学生' },
  { id: 'p5', emoji: '🧑‍⚕️', category: 'person', name: '医生' },
  { id: 'p6', emoji: '👨‍⚕️', category: 'person', name: '男医生' },
  { id: 'p7', emoji: '👩‍🏫', category: 'person', name: '教师' },
  { id: 'p8', emoji: '🧑‍💻', category: 'person', name: '程序员' },

  // 动物类 (8个)
  { id: 'a1', emoji: '🤖', category: 'animal', name: '机器人' },
  { id: 'a2', emoji: '🦊', category: 'animal', name: '狐狸' },
  { id: 'a3', emoji: '🐱', category: 'animal', name: '猫咪' },
  { id: 'a4', emoji: '🐶', category: 'animal', name: '狗狗' },
  { id: 'a5', emoji: '🦉', category: 'animal', name: '猫头鹰' },
  { id: 'a6', emoji: '🐼', category: 'animal', name: '熊猫' },
  { id: 'a7', emoji: '🦁', category: 'animal', name: '狮子' },
  { id: 'a8', emoji: '🐰', category: 'animal', name: '兔子' },

  // 抽象类 (8个)
  { id: 'ab1', emoji: '✨', category: 'abstract', name: '星星' },
  { id: 'ab2', emoji: '🌟', category: 'abstract', name: '闪光' },
  { id: 'ab3', emoji: '💫', category: 'abstract', name: '眩晕' },
  { id: 'ab4', emoji: '🔮', category: 'abstract', name: '水晶球' },
  { id: 'ab5', emoji: '💎', category: 'abstract', name: '钻石' },
  { id: 'ab6', emoji: '🎭', category: 'abstract', name: '面具' },
  { id: 'ab7', emoji: '🌈', category: 'abstract', name: '彩虹' },
  { id: 'ab8', emoji: '🎪', category: 'abstract', name: '马戏团' },

  // 科技类 (8个)
  { id: 't1', emoji: '🚀', category: 'tech', name: '火箭' },
  { id: 't2', emoji: '💡', category: 'tech', name: '灯泡' },
  { id: 't3', emoji: '🔬', category: 'tech', name: '显微镜' },
  { id: 't4', emoji: '⚡', category: 'tech', name: '闪电' },
  { id: 't5', emoji: '🎯', category: 'tech', name: '靶心' },
  { id: 't6', emoji: '🧠', category: 'tech', name: '大脑' },
  { id: 't7', emoji: '🛡️', category: 'tech', name: '盾牌' },
  { id: 't8', emoji: '🔮', category: 'tech', name: '魔法' }
]

export const themeColors: ThemeColor[] = [
  {
    id: 'theme-1',
    name: '经典蓝',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#2563EB',
    background: '#EFF6FF',
    preview: 'linear-gradient(135deg, #3B82F6, #60A5FA)'
  },
  {
    id: 'theme-2',
    name: '优雅紫',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#7C3AED',
    background: '#F5F3FF',
    preview: 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
  },
  {
    id: 'theme-3',
    name: '活力橙',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#EA580C',
    background: '#FFF7ED',
    preview: 'linear-gradient(135deg, #F97316, #FB923C)'
  },
  {
    id: 'theme-4',
    name: '清新绿',
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#059669',
    background: '#ECFDF5',
    preview: 'linear-gradient(135deg, #10B981, #34D399)'
  },
  {
    id: 'theme-5',
    name: '热情红',
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#DC2626',
    background: '#FEF2F2',
    preview: 'linear-gradient(135deg, #EF4444, #F87171)'
  },
  {
    id: 'theme-6',
    name: '神秘黑',
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#111827',
    background: '#F9FAFB',
    preview: 'linear-gradient(135deg, #1F2937, #374151)'
  },
  {
    id: 'theme-7',
    name: '浪漫粉',
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#DB2777',
    background: '#FDF2F8',
    preview: 'linear-gradient(135deg, #EC4899, #F472B6)'
  },
  {
    id: 'theme-8',
    name: '阳光黄',
    primary: '#EAB308',
    secondary: '#FACC15',
    accent: '#CA8A04',
    background: '#FEFCE8',
    preview: 'linear-gradient(135deg, #EAB308, #FACC15)'
  },
  {
    id: 'theme-9',
    name: '海洋青',
    primary: '#06B6D4',
    secondary: '#22D3EE',
    accent: '#0891B2',
    background: '#ECFEFF',
    preview: 'linear-gradient(135deg, #06B6D4, #22D3EE)'
  },
  {
    id: 'theme-10',
    name: '自然棕',
    primary: '#92400E',
    secondary: '#B45309',
    accent: '#78350F',
    background: '#FFFbeb',
    preview: 'linear-gradient(135deg, #92400E, #B45309)'
  },
  {
    id: 'theme-11',
    name: '薄荷绿',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    accent: '#0D9488',
    background: '#F0FDFA',
    preview: 'linear-gradient(135deg, #14B8A6, #2DD4BF)'
  },
  {
    id: 'theme-12',
    name: '靛蓝紫',
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#4F46E5',
    background: '#EEF2FF',
    preview: 'linear-gradient(135deg, #6366F1, #818CF8)'
  }
]

export const abilities: Ability[] = [
  // 通用能力
  {
    id: 'conversation-understanding',
    name: '对话理解',
    description: '深度理解用户意图，支持多轮对话和上下文关联',
    category: 'general',
    level: 'advanced',
    isPremium: false
  },
  {
    id: 'context-memory',
    name: '上下文记忆',
    description: '记住对话历史和用户偏好，提供个性化服务',
    category: 'general',
    level: 'intermediate',
    isPremium: false
  },
  {
    id: 'emotion-recognition',
    name: '情感识别',
    description: '识别用户情绪状态，调整回应风格和语气',
    category: 'general',
    level: 'advanced',
    isPremium: true,
    price: 29
  },
  {
    id: 'multi-language',
    name: '多语言支持',
    description: '支持100+语言的实时翻译和交流',
    category: 'general',
    level: 'expert',
    isPremium: true,
    price: 49
  },

  // 专业能力 - 法律
  {
    id: 'legal-advice',
    name: '法律咨询',
    description: '提供基础法律知识解答和法律条文查询',
    category: 'professional',
    level: 'advanced',
    isPremium: true,
    price: 99,
    dependencies: ['conversation-understanding']
  },
  // 专业能力 - 医疗
  {
    id: 'medical-info',
    name: '医疗信息',
    description: '提供健康知识和医疗信息查询（不替代医生诊断）',
    category: 'professional',
    level: 'advanced',
    isPremium: true,
    price: 89,
    dependencies: ['conversation-understanding']
  },
  // 专业能力 - 金融
  {
    id: 'financial-analysis',
    name: '金融分析',
    description: '财务数据分析、投资建议和市场趋势预测',
    category: 'professional',
    level: 'expert',
    isPremium: true,
    price: 149,
    dependencies: ['conversation-understanding', 'data-analysis']
  },
  // 专业能力 - 教育
  {
    id: 'education-tutoring',
    name: '教育辅导',
    description: '个性化学习计划、知识点讲解和学习进度跟踪',
    category: 'professional',
    level: 'advanced',
    isPremium: true,
    price: 79,
    dependencies: ['conversation-understanding']
  },
  // 专业能力 - 编程
  {
    id: 'coding-assistant',
    name: '编程助手',
    description: '代码生成、调试、重构和技术方案设计',
    category: 'professional',
    level: 'expert',
    isPremium: true,
    price: 129,
    dependencies: ['code-execution']
  },
  // 专业能力 - 数据分析
  {
    id: 'data-analysis',
    name: '数据分析',
    description: '数据处理、统计分析和可视化报告生成',
    category: 'professional',
    level: 'advanced',
    isPremium: true,
    price: 99,
    dependencies: ['conversation-understanding']
  },

  // 工具调用
  {
    id: 'web-search',
    name: '网络搜索',
    description: '实时搜索互联网信息，获取最新资讯和数据',
    category: 'tool',
    level: 'intermediate',
    isPremium: false
  },
  {
    id: 'code-execution',
    name: '代码执行',
    description: '安全执行代码片段，支持Python、JavaScript等语言',
    category: 'tool',
    level: 'advanced',
    isPremium: false
  },
  {
    id: 'image-analysis',
    name: '图像分析',
    description: '图像内容识别、OCR文字提取和视觉理解',
    category: 'tool',
    level: 'advanced',
    isPremium: true,
    price: 59
  },
  {
    id: 'file-processing',
    name: '文件处理',
    description: '文档解析、格式转换和批量处理',
    category: 'tool',
    level: 'intermediate',
    isPremium: false
  },
  {
    id: 'api-integration',
    name: 'API集成',
    description: '连接第三方API服务，扩展功能边界',
    category: 'tool',
    level: 'expert',
    isPremium: true,
    price: 199
  },

  // 创意能力
  {
    id: 'poetry-writing',
    name: '诗歌创作',
    description: '创作各种风格的诗歌作品，包括古体诗和现代诗',
    category: 'creative',
    level: 'advanced',
    isPremium: false
  },
  {
    id: 'story-writing',
    name: '故事编写',
    description: '创作小说、短篇故事和剧本等文学作品',
    category: 'creative',
    level: 'advanced',
    isPremium: true,
    price: 39
  },
  {
    id: 'brainstorming',
    name: '头脑风暴',
    description: '创意点子生成、问题解决方案头脑风暴',
    category: 'creative',
    level: 'intermediate',
    isPremium: false
  },
  {
    id: 'design-suggestions',
    name: '设计建议',
    description: 'UI/UX设计建议、色彩搭配和布局优化',
    category: 'creative',
    level: 'intermediate',
    isPremium: true,
    price: 49
  },
  {
    id: 'music-composition',
    name: '音乐创作',
    description: '旋律生成、歌词创作和音乐风格建议',
    category: 'creative',
    level: 'expert',
    isPremium: true,
    price: 129
  }
]

export const roleTemplates: RoleTemplate[] = [
  {
    id: 'general-assistant',
    name: '通用助手',
    icon: '🤖',
    description: '全能型AI助手，适合日常问答和信息检索',
    recommendedAbilities: ['conversation-understanding', 'context-memory', 'web-search', 'file-processing']
  },
  {
    id: 'legal-advisor',
    name: '法律顾问',
    icon: '⚖️',
    description: '专业的法律咨询助手，提供法律知识解答',
    recommendedAbilities: ['conversation-understanding', 'legal-advice', 'web-search', 'file-processing']
  },
  {
    id: 'medical-advisor',
    name: '医疗顾问',
    icon: '🏥',
    description: '医疗健康信息助手，提供健康知识普及',
    recommendedAbilities: ['conversation-understanding', 'medical-info', 'emotion-recognition', 'web-search']
  },
  {
    id: 'financial-advisor',
    name: '金融顾问',
    icon: '💰',
    description: '金融分析和投资建议专家',
    recommendedAbilities: ['conversation-understanding', 'financial-analysis', 'data-analysis', 'web-search']
  },
  {
    id: 'education-tutor',
    name: '教育导师',
    icon: '📚',
    description: '个性化教育辅导和学习伙伴',
    recommendedAbilities: ['conversation-understanding', 'education-tutoring', 'context-memory', 'brainstorming']
  },
  {
    id: 'writing-partner',
    name: '写作伙伴',
    icon: '✍️',
    description: '创意写作助手，协助各类文本创作',
    recommendedAbilities: ['poetry-writing', 'story-writing', 'brainstorming', 'context-memory']
  },
  {
    id: 'design-expert',
    name: '设计专家',
    icon: '🎨',
    description: 'UI/UX设计和创意设计顾问',
    recommendedAbilities: ['design-suggestions', 'image-analysis', 'brainstorming', 'web-search']
  },
  {
    id: 'coding-expert',
    name: '技术专家',
    icon: '💻',
    description: '编程开发和技术架构顾问',
    recommendedAbilities: ['coding-assistant', 'code-execution', 'api-integration', 'web-search']
  },
  {
    id: 'travel-guide',
    name: '旅行助手',
    icon: '✈️',
    description: '旅行规划和目的地推荐专家',
    recommendedAbilities: ['conversation-understanding', 'web-search', 'context-memory', 'emotion-recognition']
  },
  {
    id: 'food-critic',
    name: '美食顾问',
    icon: '🍜',
    description: '美食推荐和烹饪指导助手',
    recommendedAbilities: ['conversation-understanding', 'web-search', 'brainstorming', 'image-analysis']
  },
  {
    id: 'fitness-coach',
    name: '健身教练',
    icon: '💪',
    description: '健身计划和健康管理指导',
    recommendedAbilities: ['conversation-understanding', 'education-tutoring', 'context-memory', 'emotion-recognition']
  },
  {
    id: 'custom-role',
    name: '自定义角色',
    icon: '🎯',
    description: '根据您的需求定制专属角色和能力组合',
    recommendedAbilities: ['conversation-understanding', 'context-memory', 'web-search']
  }
]

export const sampleAgents = [
  {
    id: 'agent-001',
    name: '法律小助手',
    description: '专业的法律咨询智能体，提供基础法律知识解答',
    roleType: 'legal-advisor',
    status: 'published' as const,
    avatar: '⚖️',
    theme: 'theme-11',
    createdAt: '2024-01-15',
    revenue: 15800,
    users: 2340,
    conversations: 15680,
    rating: 4.8
  },
  {
    id: 'agent-002',
    name: '编程大师',
    description: '全栈编程开发助手，支持多种编程语言',
    roleType: 'coding-expert',
    status: 'published' as const,
    avatar: '💻',
    theme: 'theme-1',
    createdAt: '2024-02-20',
    revenue: 28500,
    users: 4560,
    conversations: 28900,
    rating: 4.9
  },
  {
    id: 'agent-003',
    name: '学习伴侣',
    description: '个性化教育辅导智能体，覆盖K12到大学课程',
    roleType: 'education-tutor',
    status: 'draft' as const,
    avatar: '📚',
    theme: 'theme-4',
    createdAt: '2024-03-10',
    revenue: 0,
    users: 0,
    conversations: 0,
    rating: 0
  },
  {
    id: 'agent-004',
    name: '旅行规划师',
    description: '智能旅行路线规划和目的地推荐',
    roleType: 'travel-guide',
    status: 'published' as const,
    avatar: '✈️',
    theme: 'theme-9',
    createdAt: '2024-01-05',
    revenue: 12300,
    users: 1890,
    conversations: 12340,
    rating: 4.7
  },
  {
    id: 'agent-005',
    name: '创意写作家',
    description: '文学创作助手，支持小说、诗歌、剧本等多种文体',
    roleType: 'writing-partner',
    status: 'offline' as const,
    avatar: '✍️',
    theme: 'theme-7',
    createdAt: '2023-12-20',
    revenue: 8900,
    users: 1230,
    conversations: 8900,
    rating: 4.6
  },
  {
    id: 'agent-006',
    name: '健身教练Pro',
    description: '科学健身指导和营养膳食建议',
    roleType: 'fitness-coach',
    status: 'published' as const,
    avatar: '💪',
    theme: 'theme-3',
    createdAt: '2024-02-01',
    revenue: 9800,
    users: 1560,
    conversations: 11200,
    rating: 4.5
  }
]

export const analyticsData = {
  userGrowth: [
    { date: '01-01', users: 1200, activeUsers: 800 },
    { date: '01-08', users: 1450, activeUsers: 980 },
    { date: '01-15', users: 1780, activeUsers: 1200 },
    { date: '01-22', users: 2100, activeUsers: 1450 },
    { date: '01-29', users: 2450, activeUsers: 1680 },
    { date: '02-05', users: 2800, activeUsers: 1920 },
    { date: '02-12', users: 3200, activeUsers: 2180 },
    { date: '02-19', users: 3650, activeUsers: 2480 },
    { date: '02-26', users: 4100, activeUsers: 2790 },
    { date: '03-04', users: 4580, activeUsers: 3120 },
    { date: '03-11', users: 5020, activeUsers: 3420 },
    { date: '03-18', users: 5500, activeUsers: 3750 }
  ],
  revenueData: [
    { date: '01月', revenue: 8500, subscriptions: 5200, payPerUse: 3300 },
    { date: '02月', revenue: 12300, subscriptions: 7800, payPerUse: 4500 },
    { date: '03月', revenue: 16800, subscriptions: 10500, payPerUse: 6300 }
  ],
  conversationStats: {
    totalConversations: 45680,
    avgDuration: '8分32秒',
    satisfactionRate: 4.7,
    peakHours: ['10:00-12:00', '14:00-16:00', '20:00-22:00']
  },
  topQuestions: [
    { question: '如何提高编程效率？', count: 2340 },
    { question: '推荐一些学习资源', count: 1890 },
    { question: '帮我写一段代码', count: 1650 },
    { question: '这个错误怎么解决？', count: 1420 },
    { question: '解释一下这个概念', count: 1280 },
    { question: '给我一些建议', count: 1150 },
    { question: '帮我分析一下数据', count: 980 },
    { question: '如何优化性能？', count: 870 },
    { question: '推荐工具或框架', count: 760 },
    { question: '帮我做决策', count: 650 }
  ],
  abilityUsage: [
    { ability: '对话理解', usage: 45680, percentage: 100 },
    { ability: '网络搜索', usage: 32450, percentage: 71 },
    { ability: '代码执行', usage: 28900, percentage: 63 },
    { ability: '上下文记忆', usage: 25600, percentage: 56 },
    { ability: '文件处理', usage: 18900, percentage: 41 },
    { ability: '数据分析', usage: 15600, percentage: 34 },
    { ability: '创意写作', usage: 12300, percentage: 27 },
    { ability: '图像分析', usage: 9800, percentage: 21 }
  ],
  userDemographics: {
    regions: [
      { region: '北京', percentage: 28 },
      { region: '上海', percentage: 22 },
      { region: '广州', percentage: 18 },
      { region: '深圳', percentage: 15 },
      { region: '其他', percentage: 17 }
    ],
    ageGroups: [
      { range: '18-24岁', percentage: 25 },
      { range: '25-34岁', percentage: 42 },
      { range: '35-44岁', percentage: 23 },
      { range: '45岁以上', percentage: 10 }
    ]
  }
}

export const defaultAgentConfig: AgentConfig = {
  basicInfo: {
    name: '',
    description: '',
    roleType: '',
    targetUsers: '',
    language: 'chinese'
  },
  appearance: {
    avatarId: '',
    themeId: 'theme-1',
    bubbleStyle: {
      borderRadius: 12,
      opacity: 1,
      borderStyle: 'none'
    },
    fontFamily: 'system-ui',
    greeting: '你好！我是您的智能助手，有什么可以帮助您的吗？'
  },
  abilities: {
    enabledAbilities: {},
    systemPrompt: '',
    exampleConversations: [],
    restrictions: []
  },
  businessModel: {
    mode: 'free',
    pricing: {
      currency: 'CNY'
    },
    membershipLevels: [],
    serviceLimits: {
      responseTime: '< 3秒'
    },
    paymentMethods: [],
    platformCommission: 20
  }
}
