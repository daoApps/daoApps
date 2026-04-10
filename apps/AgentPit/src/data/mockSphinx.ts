export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'blog' | 'corporate' | 'portfolio' | 'landing';
  thumbnail: string;
  features: string[];
  suitableFor: string;
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface SiteConfig {
  templateId: string | null;
  siteName: string;
  description: string;
  domain: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface PublishHistory {
  id: string;
  version: string;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  publishTime: Date;
  url?: string;
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
    id: 'blog-1',
    name: '个人博客',
    description: '简洁优雅的个人博客模板，专注于内容阅读体验',
    category: 'blog',
    thumbnail: '📝',
    features: ['文章列表', '标签分类', '评论系统', '搜索功能', 'RSS订阅'],
    suitableFor: '个人写作、技术分享、生活记录'
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
    id: 'portfolio-1',
    name: '创意作品集',
    description: '视觉冲击力强的作品展示平台，适合创意工作者',
    category: 'portfolio',
    thumbnail: '🎨',
    features: ['作品瀑布流', '项目详情', '技能标签', '联系表单', '社交链接'],
    suitableFor: '设计师、摄影师、艺术家'
  },
  {
    id: 'landing-1',
    name: '产品着陆页',
    description: '高转化率的营销落地页，引导用户完成目标行动',
    category: 'landing',
    thumbnail: '🚀',
    features: ['英雄区域', '特性对比', '用户评价', 'CTA按钮', 'FAQ问答'],
    suitableFor: '新产品发布、活动推广、App下载'
  }
];

export const templateCategories = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'ecommerce', label: '电商', icon: '🛒' },
  { id: 'blog', label: '博客', icon: '📰' },
  { id: 'corporate', label: '企业', icon: '🏢' },
  { id: 'portfolio', label: '作品集', icon: '🎨' },
  { id: 'landing', label: '着陆页', icon: '🚀' }
] as const;

export const presetQuestions = [
  '我想做一个电商网站',
  '帮我做一个个人博客',
  '需要企业官网展示',
  '创建一个作品集网站',
  '做一个产品着陆页'
];

export const sampleChatHistory: ChatMessage[] = [
  {
    id: 1,
    type: 'ai',
    content:
      '您好！我是 Sphinx AI 建站助手。请告诉我您想创建什么类型的网站？我可以帮您快速搭建专业的网站。',
    timestamp: new Date()
  }
];

export const aiResponses: Record<string, string> = {
  default:
    '根据您的需求，我为您推荐以下建站方案：\n\n**推荐模板**: 现代化响应式设计\n**核心功能**: 自定义页面布局、SEO优化、移动端适配\n**预计耗时**: 2-3小时\n\n您想要调整哪些方面？',
  电商: '太棒了！电商网站是很好的选择。我建议：\n\n**推荐方案**: 现代电商商城模板\n**主要特点**:\n- 商品分类与管理\n- 购物车与结算流程\n- 支付接口集成\n- 订单管理系统\n\n请问您的商品类型是什么？这样我可以进一步优化配置。',
  博客: '个人博客是分享知识的好方式！我的建议：\n\n**推荐方案**: 个人博客模板\n**核心优势**:\n- 清爽的阅读体验\n- 完善的分类标签系统\n- SEO 友好的结构\n- 社交媒体分享功能\n\n您希望博客主要关注哪个领域？'
};

export const defaultSiteConfig: SiteConfig = {
  templateId: null,
  siteName: '',
  description: '',
  domain: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
};
