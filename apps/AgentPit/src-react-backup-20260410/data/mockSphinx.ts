export interface Template {
  id: string
  name: string
  description: string
  category: 'ecommerce' | 'blog' | 'corporate' | 'portfolio' | 'landing'
  thumbnail: string
  features: string[]
  suitableFor: string
}

export interface ChatMessage {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export interface SiteConfig {
  templateId: string | null
  siteName: string
  description: string
  domain: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export interface PublishHistory {
  id: string
  version: string
  status: 'pending' | 'publishing' | 'published' | 'failed'
  publishTime: Date
  url?: string
}

export const templates: Template[] = [
  {
    id: 'ecommerce-1',
    name: '现代电商商城',
    description: '专业的在线购物平台模板，支持商品展示、购物车、订单管理等功能',
    category: 'ecommerce',
    thumbnail: '🛍️',
    features: ['商品分类', '购物车系统', '支付集成', '订单追踪', '用户评价'],
    suitableFor: '服装、数码、美妆等零售行业'
  },
  {
    id: 'ecommerce-2',
    name: '精品店铺',
    description: '优雅的精品店设计，突出产品质感，适合高端品牌',
    category: 'ecommerce',
    thumbnail: '✨',
    features: ['品牌故事', '产品画廊', '会员系统', '限时优惠', '社交媒体整合'],
    suitableFor: '奢侈品、手工艺品、设计师品牌'
  },
  {
    id: 'blog-1',
    name: '个人博客',
    description: '简洁优雅的个人博客模板，专注于内容阅读体验',
    category: 'blog',
    thumbnail: '📝',
    features: ['文章列表', '标签分类', '评论系统', '搜索功能', 'RSS订阅'],
    suitableFor: '个人写作、技术分享、生活记录'
  },
  {
    id: 'blog-2',
    name: '新闻资讯门户',
    description: '专业的内容发布平台，支持多栏目管理和多媒体内容',
    category: 'blog',
    thumbnail: '📰',
    features: ['多级栏目', '热点推荐', '视频嵌入', '作者专栏', '广告位管理'],
    suitableFor: '媒体机构、企业内刊、行业资讯'
  },
  {
    id: 'corporate-1',
    name: '企业形象官网',
    description: '专业的企业展示网站，展现公司实力与品牌形象',
    category: 'corporate',
    thumbnail: '🏢',
    features: ['公司介绍', '团队展示', '案例展示', '新闻动态', '联系方式'],
    suitableFor: '各类企业的官方展示网站'
  },
  {
    id: 'corporate-2',
    name: 'SaaS 产品页',
    description: '现代化的 SaaS 产品展示页面，支持功能演示和定价方案',
    category: 'corporate',
    thumbnail: '💻',
    features: ['产品特性', '定价方案', '客户案例', '文档中心', '免费试用'],
    suitableFor: '软件公司、互联网服务、技术产品'
  },
  {
    id: 'portfolio-1',
    name: '创意作品集',
    description: '视觉冲击力强的作品展示平台，适合创意工作者',
    category: 'portfolio',
    thumbnail: '🎨',
    features: ['作品瀑布流', '项目详情', '技能标签', '联系表单', '社交链接'],
    suitableFor: '设计师、摄影师、艺术家'
  },
  {
    id: 'portfolio-2',
    name: '开发者简历',
    description: '专为技术人员设计的个人简历网站，展示项目和技能',
    category: 'portfolio',
    thumbnail: '💼',
    features: ['项目时间线', '技术栈展示', 'GitHub 集成', '博客文章', '下载简历'],
    suitableFor: '程序员、工程师、技术顾问'
  },
  {
    id: 'landing-1',
    name: '产品着陆页',
    description: '高转化率的营销落地页，引导用户完成目标行动',
    category: 'landing',
    thumbnail: '🚀',
    features: ['英雄区域', '特性对比', '用户评价', 'CTA按钮', 'FAQ问答'],
    suitableFor: '新产品发布、活动推广、App下载'
  },
  {
    id: 'landing-2',
    name: '活动报名页',
    description: '专门的活动宣传和报名页面，支持票务和日程展示',
    category: 'landing',
    thumbnail: '🎫',
    features: ['活动详情', '嘉宾介绍', '日程安排', '在线报名', '座位选择'],
    suitableFor: '会议、培训、演出、展览'
  }
]

export const templateCategories = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'ecommerce', label: '电商', icon: '🛒' },
  { id: 'blog', label: '博客', icon: '📰' },
  { id: 'corporate', label: '企业', icon: '🏢' },
  { id: 'portfolio', label: '作品集', icon: '🎨' },
  { id: 'landing', label: '着陆页', icon: '🚀' }
] as const

export const presetQuestions = [
  '我想做一个电商网站',
  '帮我做一个个人博客',
  '需要企业官网展示',
  '创建一个作品集网站',
  '做一个产品着陆页'
]

export const sampleChatHistory: ChatMessage[] = [
  {
    id: 1,
    type: 'ai',
    content: '您好！我是 Sphinx AI 建站助手。请告诉我您想创建什么类型的网站？我可以帮您快速搭建专业的网站。',
    timestamp: new Date()
  }
]

export const aiResponses: Record<string, string> = {
  'default': '根据您的需求，我为您推荐以下建站方案：\n\n**推荐模板**: 现代化响应式设计\n**核心功能**: 自定义页面布局、SEO优化、移动端适配\n**预计耗时**: 2-3小时\n\n您想要调整哪些方面？',
  '电商': '太棒了！电商网站是很好的选择。我建议：\n\n**推荐方案**: 现代电商商城模板\n**主要特点**:\n- 商品分类与管理\n- 购物车与结算流程\n- 支付接口集成\n- 订单管理系统\n\n请问您的商品类型是什么？这样我可以进一步优化配置。',
  '博客': '个人博客是分享知识的好方式！我的建议：\n\n**推荐方案**: 个人博客模板\n**核心优势**:\n- 清爽的阅读体验\n- 完善的分类标签系统\n- SEO 友好的结构\n- 社交媒体分享功能\n\n您希望博客主要关注哪个领域？',
  '企业': '企业官网是品牌形象的重要窗口！推荐配置：\n\n**推荐方案**: 企业形象官网模板\n**必备模块**:\n- 公司简介与愿景\n- 团队成员展示\n- 成功案例库\n- 新闻动态更新\n- 联系我们页面\n\n请告诉我贵公司的主营业务？',
  '作品集': '作品集网站能让您的才华被更多人看到！最佳方案：\n\n**推荐方案**: 创意作品集模板\n**亮点功能**:\n- 视觉冲击力强的展示效果\n- 项目详情页面\n- 技能标签云\n- 客户评价展示\n- 联系合作入口\n\n您主要从事哪类创作工作？',
  '着陆页': '高转化率的着陆页能有效提升业务！优化方案：\n\n**推荐方案**: 产品着陆页模板\n**关键要素**:\n- 引人注目的标题\n- 清晰的价值主张\n- 强有力的 CTA 按钮\n- 用户证言展示\n- FAQ 消除疑虑\n\n这个着陆页的主要目标是什么？'
}

export const defaultSiteConfig: SiteConfig = {
  templateId: null,
  siteName: '',
  description: '',
  domain: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
}
