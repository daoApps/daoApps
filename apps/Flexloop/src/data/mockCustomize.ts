export interface Avatar {
  id: string;
  emoji: string;
  category: 'person' | 'animal' | 'abstract' | 'tech' | 'nature' | 'food';
  name: string;
}

export interface ThemeColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  preview: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  category: 'conversation' | 'creative' | 'analysis' | 'tool' | 'multimodal';
  icon: string;
  isPremium: boolean;
  dependencies?: string[];
  defaultParams: Record<string, unknown>;
}

export interface AgentTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  recommendedAbilities: string[];
}

export interface AgentConfig {
  basicInfo: {
    name: string;
    description: string;
    avatarId: string;
    customAvatar?: string;
    tags: string[];
    category: string;
  };
  appearance: {
    themeId: string;
    customColors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
    titleFont: string;
    bodyFont: string;
    fontSize: number;
    layoutStyle: 'card' | 'list' | 'timeline' | 'dashboard';
    borderRadius: number;
    shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
    darkMode: boolean;
  };
  abilities: {
    enabledAbilities: {
      [key: string]: { enabled: boolean; proficiency: number; params: Record<string, unknown> };
    };
    presetTemplate?: string;
  };
  businessModel: {
    mode: 'free' | 'subscription' | 'payPerUse' | 'membership';
    pricing: {
      monthlyPrice?: number;
      quarterlyPrice?: number;
      yearlyPrice?: number;
      perUsePrice?: number;
      trialDays?: number;
    };
    membershipLevels?: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
    serviceLimits: {
      availableSlots: Array<{ start: string; end: string }>;
      maxConcurrentUsers: number;
      dailyRequestLimit: number;
      apiRateLimit: number;
    };
    platformCommission: number;
    trialSettings?: {
      days: number;
      featureLimits: string[];
    };
  };
}

export interface AgentItem {
  id: string;
  name: string;
  description: string;
  avatar: string;
  status: 'published' | 'draft' | 'disabled' | 'reviewing';
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  config: AgentConfig;
  stats: {
    totalCalls: number;
    activeUsers: number;
    revenue: number;
    rating: number;
  };
}

export interface AnalyticsData {
  overview: {
    todayCalls: number;
    weekCalls: number;
    monthCalls: number;
    callsGrowth: number;
    activeUsers: number;
    avgResponseTime: number;
    satisfactionScore: number;
  };
  callTrend: Array<{ date: string; value: number }>;
  userSource: Array<{ name: string; value: number }>;
  topQuestions: Array<{ question: string; count: number }>;
  revenueTrend: Array<{ date: string; value: number }>;
  feedbacks: Array<{
    id: string;
    content: string;
    rating: number;
    time: string;
    replied: boolean;
  }>;
  performance: {
    successRate: number;
    errorRate: number;
    avgTokenConsumption: number;
    peakConcurrency: number;
  };
}

export const avatarLibrary: Avatar[] = [
  { id: 'p1', emoji: '👨‍💼', category: 'person', name: '商务男士' },
  { id: 'p2', emoji: '👩‍💼', category: 'person', name: '商务女士' },
  { id: 'p3', emoji: '🧑‍🎓', category: 'person', name: '学者' },
  { id: 'p4', emoji: '👨‍⚕️', category: 'person', name: '医生' },
  { id: 'p5', emoji: '👩‍🏫', category: 'person', name: '教师' },
  { id: 'p6', emoji: '🧑‍💻', category: 'person', name: '程序员' },
  { id: 'p7', emoji: '👨‍🍳', category: 'person', name: '厨师' },
  { id: 'p8', emoji: '👩‍🎤', category: 'person', name: '歌手' },
  { id: 'a1', emoji: '🤖', category: 'tech', name: '机器人' },
  { id: 'a2', emoji: '🦊', category: 'animal', name: '狐狸' },
  { id: 'a3', emoji: '🐱', category: 'animal', name: '猫咪' },
  { id: 'a4', emoji: '🐶', category: 'animal', name: '狗狗' },
  { id: 'a5', emoji: '🦉', category: 'animal', name: '猫头鹰' },
  { id: 'a6', emoji: '🐲', category: 'animal', name: '龙' },
  { id: 'ab1', emoji: '✨', category: 'abstract', name: '星星' },
  { id: 'ab2', emoji: '💫', category: 'abstract', name: '彗星' },
  { id: 'ab3', emoji: '🌈', category: 'abstract', name: '彩虹' },
  { id: 'ab4', emoji: '💎', category: 'abstract', name: '钻石' },
  { id: 'ab5', emoji: '🔮', category: 'abstract', name: '水晶球' },
  { id: 't1', emoji: '🚀', category: 'tech', name: '火箭' },
  { id: 't2', emoji: '💻', category: 'tech', name: '电脑' },
  { id: 't3', emoji: '📱', category: 'tech', name: '手机' },
  { id: 't4', emoji: '🧠', category: 'tech', name: '大脑' },
  { id: 't5', emoji: '⚡', category: 'tech', name: '闪电' },
  { id: 't6', emoji: '🔬', category: 'tech', name: '显微镜' },
  { id: 'n1', emoji: '🌸', category: 'nature', name: '樱花' },
  { id: 'n2', emoji: '🌻', category: 'nature', name: '向日葵' },
  { id: 'n3', emoji: '🌙', category: 'nature', name: '月亮' },
  { id: 'n4', emoji: '☀️', category: 'nature', name: '太阳' },
  { id: 'f1', emoji: '🍕', category: 'food', name: '披萨' },
  { id: 'f2', emoji: '☕', category: 'food', name: '咖啡' },
  { id: 'f3', emoji: '🎂', category: 'food', name: '蛋糕' },
  { id: 'f4', emoji: '🍎', category: 'food', name: '苹果' }
];

export const themeColors: ThemeColor[] = [
  {
    id: 'theme-blue',
    name: '经典蓝',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#2563EB',
    background: '#EFF6FF',
    text: '#1E40AF',
    preview: 'linear-gradient(135deg, #3B82F6, #60A5FA)'
  },
  {
    id: 'theme-purple',
    name: '优雅紫',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#7C3AED',
    background: '#F5F3FF',
    text: '#5B21B6',
    preview: 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
  },
  {
    id: 'theme-orange',
    name: '活力橙',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#EA580C',
    background: '#FFF7ED',
    text: '#9A3412',
    preview: 'linear-gradient(135deg, #F97316, #FB923C)'
  },
  {
    id: 'theme-green',
    name: '自然绿',
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#059669',
    background: '#ECFDF5',
    text: '#065F46',
    preview: 'linear-gradient(135deg, #10B981, #34D399)'
  },
  {
    id: 'theme-pink',
    name: '浪漫粉',
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#DB2777',
    background: '#FDF2F8',
    text: '#9D174D',
    preview: 'linear-gradient(135deg, #EC4899, #F472B6)'
  },
  {
    id: 'theme-red',
    name: '热情红',
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#DC2626',
    background: '#FEF2F2',
    text: '#991B1B',
    preview: 'linear-gradient(135deg, #EF4444, #F87171)'
  },
  {
    id: 'theme-teal',
    name: '青碧色',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    accent: '#0D9488',
    background: '#F0FDFA',
    text: '#115E59',
    preview: 'linear-gradient(135deg, #14B8A6, #2DD4BF)'
  },
  {
    id: 'theme-indigo',
    name: '靛蓝色',
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#4F46E5',
    background: '#EEF2FF',
    text: '#3730A3',
    preview: 'linear-gradient(135deg, #6366F1, #818CF8)'
  },
  {
    id: 'theme-amber',
    name: '琥珀色',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    accent: '#D97706',
    background: '#FFFBEB',
    text: '#92400E',
    preview: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
  },
  {
    id: 'theme-cyan',
    name: '天青色',
    primary: '#06B6D4',
    secondary: '#22D3EE',
    accent: '#0891B2',
    background: '#ECFEFF',
    text: '#155E75',
    preview: 'linear-gradient(135deg, #06B6D4, #22D3EE)'
  },
  {
    id: 'theme-lime',
    name: '青柠色',
    primary: '#84CC16',
    secondary: '#A3E635',
    accent: '#65A30D',
    background: '#F7FEE7',
    text: '#4D7C0F',
    preview: 'linear-gradient(135deg, #84CC16, #A3E635)'
  },
  {
    id: 'theme-slate',
    name: '石墨灰',
    primary: '#475569',
    secondary: '#64748B',
    accent: '#334155',
    background: '#F8FAFC',
    text: '#1E293B',
    preview: 'linear-gradient(135deg, #475569, #64748B)'
  }
];

export const fontOptions = [
  { id: 'system-ui', label: '系统默认', family: 'system-ui, -apple-system, sans-serif' },
  { id: 'inter', label: 'Inter', family: "'Inter', sans-serif" },
  { id: 'roboto', label: 'Roboto', family: "'Roboto', sans-serif" },
  { id: 'noto-sans', label: 'Noto Sans SC', family: "'Noto Sans SC', sans-serif" },
  { id: 'playfair', label: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'source-han', label: 'Source Han Serif', family: "'Source Han Serif SC', serif" }
];

export const abilities: Ability[] = [
  {
    id: 'conversation-understanding',
    name: '对话理解',
    description: '深度理解用户意图，支持多轮对话和上下文关联',
    category: 'conversation',
    icon: '💬',
    isPremium: false,
    defaultParams: { temperature: 0.7, maxTokens: 2048, contextWindow: 8192 }
  },
  {
    id: 'context-memory',
    name: '上下文记忆',
    description: '记住对话历史和用户偏好，提供个性化服务',
    category: 'conversation',
    icon: '🧠',
    isPremium: false,
    dependencies: ['conversation-understanding'],
    defaultParams: { memoryDepth: 'long', maxHistory: 100 }
  },
  {
    id: 'emotion-recognition',
    name: '情感识别',
    description: '识别用户情绪状态，调整回复语气和风格',
    category: 'conversation',
    icon: '😊',
    isPremium: true,
    dependencies: ['conversation-understanding'],
    defaultParams: { sensitivity: 0.8, empathyLevel: 'high' }
  },
  {
    id: 'text-generation',
    name: '文本创作',
    description: '生成高质量文章、文案、故事等文本内容',
    category: 'creative',
    icon: '✍️',
    isPremium: false,
    defaultParams: { creativity: 0.8, style: 'balanced', outputFormat: 'markdown' }
  },
  {
    id: 'code-generation',
    name: '代码生成',
    description: '根据需求生成高质量代码，支持多种编程语言',
    category: 'creative',
    icon: '💻',
    isPremium: false,
    defaultParams: { language: 'auto', styleGuide: 'standard', comments: true }
  },
  {
    id: 'image-description',
    name: '图像描述',
    description: '分析图像内容并生成详细文字描述',
    category: 'multimodal',
    icon: '🖼️',
    isPremium: true,
    defaultParams: { detailLevel: 'detailed', includeObjects: true }
  },
  {
    id: 'data-analysis',
    name: '数据分析',
    description: '处理和分析结构化数据，生成洞察报告',
    category: 'analysis',
    icon: '📊',
    isPremium: false,
    defaultParams: { dataVolume: 'medium', accuracyPriority: true, visualization: 'auto' }
  },
  {
    id: 'logical-reasoning',
    name: '逻辑推理',
    description: '进行复杂逻辑推理和问题求解',
    category: 'analysis',
    icon: '🧮',
    isPremium: false,
    defaultParams: { reasoningDepth: 'deep', stepByStep: true }
  },
  {
    id: 'web-search',
    name: '网络搜索',
    description: '实时搜索互联网信息，获取最新资讯和数据',
    category: 'tool',
    icon: '🔍',
    isPremium: false,
    defaultParams: { searchEngine: 'auto', resultCount: 10, safeSearch: true }
  },
  {
    id: 'code-execution',
    name: '代码执行',
    description: '安全执行代码片段，支持 Python、JavaScript 等语言',
    category: 'tool',
    icon: '⚙️',
    isPremium: true,
    defaultParams: { timeout: 30, memoryLimit: '512MB', languages: ['python', 'javascript'] }
  },
  {
    id: 'api-integration',
    name: 'API 集成',
    description: '调用外部 API 服务扩展能力边界',
    category: 'tool',
    icon: '🔗',
    isPremium: true,
    defaultParams: { rateLimit: 100, cacheTTL: 300 }
  },
  {
    id: 'file-processing',
    name: '文件处理',
    description: '解析和处理各种格式文件（PDF、Excel、Word 等）',
    category: 'tool',
    icon: '📄',
    isPremium: false,
    defaultParams: { maxSize: '10MB', formats: ['pdf', 'xlsx', 'docx', 'txt'] }
  },
  {
    id: 'translation',
    name: '多语言翻译',
    description: '支持 100+ 语言互译，保持语义准确性',
    category: 'tool',
    icon: '🌐',
    isPremium: false,
    defaultParams: { targetLanguage: 'auto', formality: 'neutral' }
  },
  {
    id: 'summarization',
    name: '内容摘要',
    description: '快速提取长文档核心要点',
    category: 'analysis',
    icon: '📝',
    isPremium: false,
    dependencies: ['conversation-understanding'],
    defaultParams: { lengthRatio: 0.3, keyPoints: 5, format: 'bullet' }
  },
  {
    id: 'voice-input',
    name: '语音输入',
    description: '将语音实时转换为文字输入',
    category: 'multimodal',
    icon: '🎤',
    isPremium: true,
    defaultParams: { language: 'zh-CN', realTime: true }
  },
  {
    id: 'knowledge-base',
    name: '知识库问答',
    description: '基于自定义知识库进行专业领域问答',
    category: 'analysis',
    icon: '📚',
    isPremium: true,
    defaultParams: { retrievalMethod: 'hybrid', topK: 5 }
  },
  {
    id: 'creative-writing',
    name: '创意写作',
    description: '诗歌、小说、剧本等创意文学创作',
    category: 'creative',
    icon: '🎭',
    isPremium: true,
    dependencies: ['text-generation'],
    defaultParams: { genre: 'mixed', tone: 'expressive', length: 'flexible' }
  }
];

export const agentTemplates: AgentTemplate[] = [
  {
    id: 'template-general',
    name: '通用助手',
    icon: '🤖',
    description: '全能型 AI 助手，适合日常问答和信息检索',
    category: 'assistant',
    recommendedAbilities: ['conversation-understanding', 'context-memory', 'web-search']
  },
  {
    id: 'template-coding',
    name: '技术专家',
    icon: '💻',
    description: '编程开发和技术架构顾问',
    category: 'assistant',
    recommendedAbilities: ['code-generation', 'code-execution', 'web-search', 'logical-reasoning']
  },
  {
    id: 'template-writer',
    name: '内容创作者',
    icon: '✍️',
    description: '文案撰写、内容策划、创意写作专家',
    category: 'creative',
    recommendedAbilities: ['text-generation', 'creative-writing', 'translation', 'summarization']
  },
  {
    id: 'template-analyst',
    name: '数据分析师',
    icon: '📊',
    description: '数据处理、分析和可视化报告生成',
    category: 'analysis',
    recommendedAbilities: ['data-analysis', 'logical-reasoning', 'file-processing', 'web-search']
  },
  {
    id: 'template-customer-service',
    name: '智能客服',
    icon: '🎧',
    description: '7x24 小时自动客户服务和支持',
    category: 'service',
    recommendedAbilities: [
      'conversation-understanding',
      'emotion-recognition',
      'context-memory',
      'knowledge-base'
    ]
  },
  {
    id: 'template-educator',
    name: '教育导师',
    icon: '📚',
    description: '个性化教学和学习辅导助手',
    category: 'education',
    recommendedAbilities: [
      'conversation-understanding',
      'knowledge-base',
      'translation',
      'file-processing'
    ]
  },
  {
    id: 'template-entertainment',
    name: '娱乐伙伴',
    icon: '🎮',
    description: '聊天陪伴、游戏互动、趣味问答',
    category: 'entertainment',
    recommendedAbilities: [
      'conversation-understanding',
      'emotion-recognition',
      'creative-writing',
      'text-generation'
    ]
  },
  {
    id: 'template-multimodal',
    name: '多模态助手',
    icon: '🌟',
    description: '支持文本、图像、语音等多种交互方式',
    category: 'other',
    recommendedAbilities: [
      'conversation-understanding',
      'image-description',
      'voice-input',
      'text-generation'
    ]
  }
];

export const sampleAgents: AgentItem[] = [
  {
    id: 'agent-001',
    name: '法律小助手',
    description: '专业的法律咨询智能体，提供基础法律知识解答和法律文书起草建议',
    avatar: '⚖️',
    status: 'published',
    tags: ['法律', '咨询', '专业'],
    category: 'assistant',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    config: {
      basicInfo: {
        name: '法律小助手',
        description: '专业的法律咨询智能体',
        avatarId: 'p3',
        tags: ['法律', '咨询'],
        category: 'assistant'
      },
      appearance: {
        themeId: 'theme-blue',
        titleFont: 'system-ui',
        bodyFont: 'system-ui',
        fontSize: 16,
        layoutStyle: 'card',
        borderRadius: 12,
        shadowIntensity: 'medium',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'conversation-understanding': {
            enabled: true,
            proficiency: 90,
            params: { temperature: 0.5, maxTokens: 2048, contextWindow: 8192 }
          },
          'knowledge-base': {
            enabled: true,
            proficiency: 85,
            params: { retrievalMethod: 'hybrid', topK: 5 }
          },
          'text-generation': {
            enabled: true,
            proficiency: 80,
            params: { creativity: 0.4, style: 'formal', outputFormat: 'markdown' }
          }
        }
      },
      businessModel: {
        mode: 'subscription',
        pricing: { monthlyPrice: 99, yearlyPrice: 999 },
        serviceLimits: {
          availableSlots: [{ start: '00:00', end: '23:59' }],
          maxConcurrentUsers: 50,
          dailyRequestLimit: 1000,
          apiRateLimit: 60
        },
        platformCommission: 20
      }
    },
    stats: { totalCalls: 15680, activeUsers: 2340, revenue: 15800, rating: 4.8 }
  },
  {
    id: 'agent-002',
    name: '编程大师',
    description: '全栈编程开发助手，支持多种编程语言，提供代码审查、调试和架构建议',
    avatar: '💻',
    status: 'published',
    tags: ['编程', '开发', '技术'],
    category: 'assistant',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-04-01T09:15:00Z',
    config: {
      basicInfo: {
        name: '编程大师',
        description: '全栈编程开发助手',
        avatarId: 'p6',
        tags: ['编程', '开发', '技术'],
        category: 'assistant'
      },
      appearance: {
        themeId: 'theme-green',
        titleFont: 'roboto',
        bodyFont: 'roboto',
        fontSize: 14,
        layoutStyle: 'dashboard',
        borderRadius: 8,
        shadowIntensity: 'light',
        darkMode: true
      },
      abilities: {
        enabledAbilities: {
          'code-generation': {
            enabled: true,
            proficiency: 95,
            params: { language: 'auto', styleGuide: 'standard', comments: true }
          },
          'code-execution': {
            enabled: true,
            proficiency: 90,
            params: {
              timeout: 30,
              memoryLimit: '512MB',
              languages: ['python', 'javascript', 'typescript']
            }
          },
          'web-search': {
            enabled: true,
            proficiency: 85,
            params: { searchEngine: 'auto', resultCount: 10, safeSearch: true }
          },
          'logical-reasoning': {
            enabled: true,
            proficiency: 88,
            params: { reasoningDepth: 'deep', stepByStep: true }
          }
        }
      },
      businessModel: {
        mode: 'payPerUse',
        pricing: { perUsePrice: 0.5 },
        serviceLimits: {
          availableSlots: [{ start: '00:00', end: '23:59' }],
          maxConcurrentUsers: 100,
          dailyRequestLimit: 5000,
          apiRateLimit: 120
        },
        platformCommission: 15
      }
    },
    stats: { totalCalls: 28900, activeUsers: 4560, revenue: 28500, rating: 4.9 }
  },
  {
    id: 'agent-003',
    name: '创意写作精灵',
    description: 'AI 驱动的创意写作伙伴，帮助您创作诗歌、小说、营销文案等各类内容',
    avatar: '✨',
    status: 'published',
    tags: ['写作', '创意', '内容'],
    category: 'creative',
    createdAt: '2024-03-05T14:00:00Z',
    updatedAt: '2024-04-05T11:20:00Z',
    config: {
      basicInfo: {
        name: '创意写作精灵',
        description: 'AI 驱动的创意写作伙伴',
        avatarId: 'ab1',
        tags: ['写作', '创意', '内容'],
        category: 'creative'
      },
      appearance: {
        themeId: 'theme-purple',
        titleFont: 'playfair',
        bodyFont: 'noto-sans',
        fontSize: 17,
        layoutStyle: 'timeline',
        borderRadius: 16,
        shadowIntensity: 'heavy',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'text-generation': {
            enabled: true,
            proficiency: 95,
            params: { creativity: 0.95, style: 'artistic', outputFormat: 'markdown' }
          },
          'creative-writing': {
            enabled: true,
            proficiency: 92,
            params: { genre: 'mixed', tone: 'expressive', length: 'flexible' }
          },
          translation: {
            enabled: true,
            proficiency: 80,
            params: { targetLanguage: 'auto', formality: 'literary' }
          }
        }
      },
      businessModel: {
        mode: 'membership',
        pricing: { monthlyPrice: 49, quarterlyPrice: 129, yearlyPrice: 499 },
        membershipLevels: [
          { name: '普通版', price: 49, features: ['基础写作', '每日 50 次', '标准速度'] },
          {
            name: 'VIP 版',
            price: 149,
            features: ['高级写作', '每日 200 次', '优先响应', '专属模板']
          },
          {
            name: 'SVIP 版',
            price: 299,
            features: ['无限写作', '无限制', '最快响应', 'API 接入', '定制训练']
          }
        ],
        serviceLimits: {
          availableSlots: [{ start: '00:00', end: '23:59' }],
          maxConcurrentUsers: 200,
          dailyRequestLimit: 10000,
          apiRateLimit: 200
        },
        platformCommission: 25
      }
    },
    stats: { totalCalls: 12300, activeUsers: 1890, revenue: 22400, rating: 4.7 }
  },
  {
    id: 'agent-004',
    name: '数据分析专家',
    description: '智能数据分析助手，支持数据清洗、统计分析、可视化和报告生成',
    avatar: '📊',
    status: 'draft',
    tags: ['数据', '分析', '报表'],
    category: 'analysis',
    createdAt: '2024-03-18T09:00:00Z',
    updatedAt: '2024-04-02T16:45:00Z',
    config: {
      basicInfo: {
        name: '数据分析专家',
        description: '智能数据分析助手',
        avatarId: 't4',
        tags: ['数据', '分析', '报表'],
        category: 'analysis'
      },
      appearance: {
        themeId: 'theme-teal',
        titleFont: 'inter',
        bodyFont: 'inter',
        fontSize: 15,
        layoutStyle: 'dashboard',
        borderRadius: 10,
        shadowIntensity: 'medium',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'data-analysis': {
            enabled: true,
            proficiency: 88,
            params: { dataVolume: 'large', accuracyPriority: true, visualization: 'auto' }
          },
          'file-processing': {
            enabled: true,
            proficiency: 85,
            params: { maxSize: '50MB', formats: ['pdf', 'xlsx', 'csv', 'json'] }
          },
          'logical-reasoning': {
            enabled: true,
            proficiency: 82,
            params: { reasoningDepth: 'medium', stepByStep: true }
          }
        }
      },
      businessModel: {
        mode: 'free',
        pricing: {},
        serviceLimits: {
          availableSlots: [{ start: '09:00', end: '18:00' }],
          maxConcurrentUsers: 20,
          dailyRequestLimit: 100,
          apiRateLimit: 20
        },
        platformCommission: 0
      }
    },
    stats: { totalCalls: 450, activeUsers: 120, revenue: 0, rating: 0 }
  },
  {
    id: 'agent-005',
    name: '智能客服小蜜',
    description: '7x24 小时在线客服机器人，支持多轮对话、工单创建和知识库查询',
    avatar: '🎧',
    status: 'reviewing',
    tags: ['客服', '服务', '自动化'],
    category: 'service',
    createdAt: '2024-04-01T11:00:00Z',
    updatedAt: '2024-04-08T13:00:00Z',
    config: {
      basicInfo: {
        name: '智能客服小蜜',
        description: '7x24 小时在线客服机器人',
        avatarId: 'p2',
        tags: ['客服', '服务', '自动化'],
        category: 'service'
      },
      appearance: {
        themeId: 'theme-orange',
        titleFont: 'noto-sans',
        bodyFont: 'noto-sans',
        fontSize: 16,
        layoutStyle: 'card',
        borderRadius: 12,
        shadowIntensity: 'light',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'conversation-understanding': {
            enabled: true,
            proficiency: 92,
            params: { temperature: 0.3, maxTokens: 1024, contextWindow: 16384 }
          },
          'emotion-recognition': {
            enabled: true,
            proficiency: 88,
            params: { sensitivity: 0.9, empathyLevel: 'high' }
          },
          'context-memory': {
            enabled: true,
            proficiency: 85,
            params: { memoryDepth: 'session', maxHistory: 50 }
          },
          'knowledge-base': {
            enabled: true,
            proficiency: 90,
            params: { retrievalMethod: 'vector', topK: 3 }
          }
        }
      },
      businessModel: {
        mode: 'subscription',
        pricing: { monthlyPrice: 299, yearlyPrice: 2990, trialDays: 14 },
        serviceLimits: {
          availableSlots: [{ start: '00:00', end: '23:59' }],
          maxConcurrentUsers: 500,
          dailyRequestLimit: 10000,
          apiRateLimit: 300
        },
        platformCommission: 18
      }
    },
    stats: { totalCalls: 0, activeUsers: 0, revenue: 0, rating: 0 }
  },
  {
    id: 'agent-006',
    name: '英语学习伴侣',
    description: '个性化英语学习助手，支持口语练习、语法纠错、词汇拓展和阅读理解',
    avatar: '🌐',
    status: 'published',
    tags: ['教育', '英语', '学习'],
    category: 'education',
    createdAt: '2024-02-10T07:00:00Z',
    updatedAt: '2024-03-28T10:30:00Z',
    config: {
      basicInfo: {
        name: '英语学习伴侣',
        description: '个性化英语学习助手',
        avatarId: 't3',
        tags: ['教育', '英语', '学习'],
        category: 'education'
      },
      appearance: {
        themeId: 'theme-indigo',
        titleFont: 'source-han',
        bodyFont: 'noto-sans',
        fontSize: 16,
        layoutStyle: 'card',
        borderRadius: 14,
        shadowIntensity: 'medium',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'conversation-understanding': {
            enabled: true,
            proficiency: 90,
            params: { temperature: 0.6, maxTokens: 1536, contextWindow: 4096 }
          },
          translation: {
            enabled: true,
            proficiency: 95,
            params: { targetLanguage: 'en', formality: 'neutral' }
          },
          'voice-input': {
            enabled: true,
            proficiency: 85,
            params: { language: 'en-US', realTime: true }
          },
          'text-generation': {
            enabled: true,
            proficiency: 82,
            params: { creativity: 0.5, style: 'educational', outputFormat: 'plain' }
          }
        }
      },
      businessModel: {
        mode: 'freemium' as any,
        pricing: { monthlyPrice: 39, trialDays: 7 },
        serviceLimits: {
          availableSlots: [{ start: '06:00', end: '23:00' }],
          maxConcurrentUsers: 100,
          dailyRequestLimit: 500,
          apiRateLimit: 60
        },
        platformCommission: 22
      }
    },
    stats: { totalCalls: 8920, activeUsers: 3200, revenue: 12600, rating: 4.6 }
  },
  {
    id: 'agent-007',
    name: '健康顾问',
    description: '基于权威医学知识的健康咨询助手，提供健康建议和生活指导（非医疗诊断）',
    avatar: '🏥',
    status: 'disabled',
    tags: ['健康', '医疗', '咨询'],
    category: 'assistant',
    createdAt: '2024-01-28T12:00:00Z',
    updatedAt: '2024-03-15T08:00:00Z',
    config: {
      basicInfo: {
        name: '健康顾问',
        description: '基于权威医学知识的健康咨询助手',
        avatarId: 'p4',
        tags: ['健康', '医疗', '咨询'],
        category: 'assistant'
      },
      appearance: {
        themeId: 'theme-green',
        titleFont: 'noto-sans',
        bodyFont: 'noto-sans',
        fontSize: 15,
        layoutStyle: 'list',
        borderRadius: 12,
        shadowIntensity: 'light',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'conversation-understanding': {
            enabled: true,
            proficiency: 88,
            params: { temperature: 0.4, maxTokens: 1536, contextWindow: 8192 }
          },
          'knowledge-base': {
            enabled: true,
            proficiency: 92,
            params: { retrievalMethod: 'vector', topK: 5 }
          },
          'context-memory': {
            enabled: true,
            proficiency: 75,
            params: { memoryDepth: 'long', maxHistory: 200 }
          }
        }
      },
      businessModel: {
        mode: 'free',
        pricing: {},
        serviceLimits: {
          availableSlots: [{ start: '08:00', end: '22:00' }],
          maxConcurrentUsers: 30,
          dailyRequestLimit: 200,
          apiRateLimit: 30
        },
        platformCommission: 0
      }
    },
    stats: { totalCalls: 5670, activeUsers: 890, revenue: 0, rating: 4.5 }
  },
  {
    id: 'agent-008',
    name: '旅行规划师',
    description: '智能旅行规划助手，提供行程定制、景点推荐、预算估算和攻略生成',
    avatar: '✈️',
    status: 'draft',
    tags: ['旅行', '规划', '推荐'],
    category: 'entertainment',
    createdAt: '2024-04-05T15:00:00Z',
    updatedAt: '2024-04-09T17:30:00Z',
    config: {
      basicInfo: {
        name: '旅行规划师',
        description: '智能旅行规划助手',
        avatarId: 't1',
        tags: ['旅行', '规划', '推荐'],
        category: 'entertainment'
      },
      appearance: {
        themeId: 'theme-cyan',
        titleFont: 'inter',
        bodyFont: 'noto-sans',
        fontSize: 16,
        layoutStyle: 'card',
        borderRadius: 16,
        shadowIntensity: 'heavy',
        darkMode: false
      },
      abilities: {
        enabledAbilities: {
          'conversation-understanding': {
            enabled: true,
            proficiency: 85,
            params: { temperature: 0.7, maxTokens: 2048, contextWindow: 8192 }
          },
          'web-search': {
            enabled: true,
            proficiency: 90,
            params: { searchEngine: 'auto', resultCount: 15, safeSearch: false }
          },
          'text-generation': {
            enabled: true,
            proficiency: 88,
            params: { creativity: 0.8, style: 'engaging', outputFormat: 'markdown' }
          }
        }
      },
      businessModel: {
        mode: 'payPerUse',
        pricing: { perUsePrice: 2 },
        serviceLimits: {
          availableSlots: [{ start: '00:00', end: '23:59' }],
          maxConcurrentUsers: 50,
          dailyRequestLimit: 500,
          apiRateLimit: 30
        },
        platformCommission: 20
      }
    },
    stats: { totalCalls: 120, activeUsers: 35, revenue: 240, rating: 0 }
  }
];

export const analyticsData: AnalyticsData = {
  overview: {
    todayCalls: 1247,
    weekCalls: 8654,
    monthCalls: 36720,
    callsGrowth: 12.5,
    activeUsers: 12834,
    avgResponseTime: 850,
    satisfactionScore: 4.7
  },
  callTrend: [
    { date: '04-04', value: 1120 },
    { date: '04-05', value: 1340 },
    { date: '04-06', value: 980 },
    { date: '04-07', value: 1450 },
    { date: '04-08', value: 1280 },
    { date: '04-09', value: 1520 },
    { date: '04-10', value: 1247 }
  ],
  userSource: [
    { name: '直接访问', value: 35 },
    { name: '搜索引擎', value: 28 },
    { name: '分享链接', value: 22 },
    { name: '平台推荐', value: 15 }
  ],
  topQuestions: [
    { question: '如何配置 API 密钥？', count: 892 },
    { question: '支持哪些编程语言？', count: 756 },
    { question: '如何提高回答准确度？', count: 634 },
    { question: '定价方案有哪些？', count: 521 },
    { question: '是否支持多语言？', count: 489 },
    { question: '如何导出对话记录？', count: 412 },
    { question: '数据安全如何保障？', count: 378 },
    { question: '可以定制训练吗？', count: 345 },
    { question: '支持离线使用吗？', count: 289 },
    { question: '如何联系技术支持？', count: 234 }
  ],
  revenueTrend: [
    { date: '04-04', value: 3200 },
    { date: '04-05', value: 3800 },
    { date: '04-06', value: 2900 },
    { date: '04-07', value: 4200 },
    { date: '04-08', value: 3600 },
    { date: '04-09', value: 4500 },
    { date: '04-10', value: 4100 }
  ],
  feedbacks: [
    {
      id: 'fb-1',
      content: '非常好用，回答准确且快速！',
      rating: 5,
      time: '2024-04-10 14:30',
      replied: true
    },
    {
      id: 'fb-2',
      content: '功能强大，但希望能增加更多模板',
      rating: 4,
      time: '2024-04-10 11:20',
      replied: true
    },
    {
      id: 'fb-3',
      content: '界面美观，操作简单直观',
      rating: 5,
      time: '2024-04-09 18:45',
      replied: false
    },
    {
      id: 'fb-4',
      content: '定价合理，性价比很高',
      rating: 4,
      time: '2024-04-09 15:10',
      replied: true
    },
    {
      id: 'fb-5',
      content: '偶尔会有延迟，但整体体验不错',
      rating: 3,
      time: '2024-04-08 09:30',
      replied: false
    },
    {
      id: 'fb-6',
      content: '客服响应及时，解决问题效率高',
      rating: 5,
      time: '2024-04-07 16:20',
      replied: true
    }
  ],
  performance: {
    successRate: 99.2,
    errorRate: 0.8,
    avgTokenConsumption: 456,
    peakConcurrency: 156
  }
};

export const abilityPresets = [
  {
    id: 'preset-general',
    name: '通用型',
    description: '适合大多数场景的基础能力组合',
    icon: '🎯',
    abilities: ['conversation-understanding', 'context-memory', 'web-search', 'translation']
  },
  {
    id: 'preset-professional',
    name: '专业型',
    description: '面向专业领域的深度能力组合',
    icon: '🎓',
    abilities: [
      'conversation-understanding',
      'knowledge-base',
      'data-analysis',
      'logical-reasoning',
      'file-processing'
    ]
  },
  {
    id: 'preset-creative',
    name: '创意型',
    description: '专注于内容创作的创意能力组合',
    icon: '🎨',
    abilities: ['text-generation', 'creative-writing', 'translation', 'summarization']
  },
  {
    id: 'preset-efficient',
    name: '效率型',
    description: '提升工作效率的工具型能力组合',
    icon: '⚡',
    abilities: [
      'web-search',
      'code-execution',
      'api-integration',
      'file-processing',
      'summarization'
    ]
  }
];

export const categories = [
  { value: 'assistant', label: '助手' },
  { value: 'creative', label: '创作' },
  { value: 'analysis', label: '分析' },
  { value: 'service', label: '客服' },
  { value: 'entertainment', label: '娱乐' },
  { value: 'education', label: '教育' },
  { value: 'other', label: '其他' }
];

export const defaultAgentConfig: AgentConfig = {
  basicInfo: {
    name: '',
    description: '',
    avatarId: '',
    tags: [],
    category: 'assistant'
  },
  appearance: {
    themeId: 'theme-blue',
    titleFont: 'system-ui',
    bodyFont: 'system-ui',
    fontSize: 16,
    layoutStyle: 'card',
    borderRadius: 12,
    shadowIntensity: 'medium',
    darkMode: false
  },
  abilities: {
    enabledAbilities: {}
  },
  businessModel: {
    mode: 'free',
    pricing: {},
    serviceLimits: {
      availableSlots: [{ start: '00:00', end: '23:59' }],
      maxConcurrentUsers: 50,
      dailyRequestLimit: 1000,
      apiRateLimit: 60
    },
    platformCommission: 20
  }
};
