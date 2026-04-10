export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subCategory: string
  images: string[]
  rating: number
  reviewCount: number
  salesCount: number
  stock: number
  tags: ('new' | 'hot' | 'discount' | 'recommended')[]
  seller: Seller
  specs: { label: string; value: string }[]
  type: 'digital' | 'physical' | 'service'
  createdAt: string
}

export interface Seller {
  id: string
  name: string
  avatar: string
  storeName: string
  rating: number
  followerCount: number
  productCount: number
  description: string
  isVerified: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  children?: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  count: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  images?: string[]
  likes: number
  createdAt: string
  isVerifiedPurchase: boolean
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending_payment' | 'pending_shipment' | 'pending_receipt' | 'completed' | 'cancelled' | 'refunding'
  createdAt: string
  paymentMethod: string
  shippingAddress: ShippingAddress
  trackingNumber?: string
  logisticsInfo?: LogisticsStep[]
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface ShippingAddress {
  recipient: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
}

export interface LogisticsStep {
  time: string
  description: string
  status: 'in_transit' | 'delivered' | 'picked_up' | 'out_for_delivery'
}

export interface CartItem {
  product: Product
  quantity: number
  selected: boolean
}

export const sellers: Seller[] = [
  {
    id: 's1',
    name: '张明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    storeName: 'AI模板工坊',
    rating: 4.9,
    followerCount: 12580,
    productCount: 45,
    description: '专注AI智能体模板开发，提供高质量可复用方案',
    isVerified: true
  },
  {
    id: 's2',
    name: '李华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    storeName: '智能学院',
    rating: 4.8,
    followerCount: 8920,
    productCount: 32,
    description: '专业AI培训课程，从入门到精通全覆盖',
    isVerified: true
  },
  {
    id: 's3',
    name: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    storeName: '创意周边店',
    rating: 4.7,
    followerCount: 6750,
    productCount: 28,
    description: '精选科技周边产品，品质保证',
    isVerified: true
  },
  {
    id: 's4',
    name: '赵强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
    storeName: '定制服务专家',
    rating: 4.9,
    followerCount: 5430,
    productCount: 15,
    description: '一对一定制服务，满足个性化需求',
    isVerified: true
  },
  {
    id: 's5',
    name: '陈静',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    storeName: '数据分析工作室',
    rating: 4.8,
    followerCount: 4210,
    productCount: 22,
    description: '专业数据分析与咨询服务',
    isVerified: true
  }
]

export const categories: Category[] = [
  {
    id: 'c1',
    name: '数字产品',
    icon: '💻',
    children: [
      { id: 'c1-1', name: '智能体模板', count: 156 },
      { id: 'c1-2', name: 'API接口', count: 89 },
      { id: 'c1-3', name: '数据集', count: 67 },
      { id: 'c1-4', name: '开发工具', count: 43 }
    ]
  },
  {
    id: 'c2',
    name: '在线课程',
    icon: '📚',
    children: [
      { id: 'c2-1', name: 'AI入门', count: 78 },
      { id: 'c2-2', name: '进阶实战', count: 65 },
      { id: 'c2-3', name: '行业应用', count: 52 },
      { id: 'c2-4', name: '认证考试', count: 34 }
    ]
  },
  {
    id: 'c3',
    name: '实体周边',
    icon: '🎁',
    children: [
      { id: 'c3-1', name: '定制T恤', count: 45 },
      { id: 'c3-2', name: '科技配件', count: 38 },
      { id: 'c3-3', name: '办公文具', count: 29 },
      { id: 'c3-4', name: '限量版品', count: 18 }
    ]
  },
  {
    id: 'c4',
    name: '专业服务',
    icon: '🛠️',
    children: [
      { id: 'c4-1', name: '定制开发', count: 56 },
      { id: 'c4-2', name: '咨询顾问', count: 42 },
      { id: 'c4-3', name: '技术支持', count: 35 },
      { id: 'c4-4', name: '培训服务', count: 28 }
    ]
  },
  {
    id: 'c5',
    name: '解决方案',
    icon: '📦',
    children: [
      { id: 'c5-1', name: '企业级', count: 34 },
      { id: 'c5-2', name: '中小企业', count: 47 },
      { id: 'c5-3', name: '个人开发者', count: 62 }
    ]
  }
]

export const products: Product[] = [
  {
    id: 'p1',
    name: 'GPT-4 智能客服机器人模板',
    description: '基于GPT-4的智能客服解决方案，支持多轮对话、意图识别、知识库问答，开箱即用。包含完整的前后端代码、部署文档和运维指南。',
    price: 299,
    originalPrice: 499,
    category: '数字产品',
    subCategory: '智能体模板',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ],
    rating: 4.9,
    reviewCount: 328,
    salesCount: 1520,
    stock: 999,
    tags: ['hot', 'recommended'],
    seller: sellers[0],
    specs: [
      { label: '适用场景', value: '电商客服、在线咨询、售后支持' },
      { label: '技术栈', value: 'React + Node.js + OpenAI API' },
      { label: '响应时间', value: '< 500ms' },
      { label: '并发支持', value: '1000 QPS' },
      { label: '更新频率', value: '每月更新' },
      { label: '技术支持', value: '30天免费' }
    ],
    type: 'digital',
    createdAt: '2024-03-15'
  },
  {
    id: 'p2',
    name: 'AI绘画工作流自动化工具',
    description: '一键式AI绘画工作流，支持Stable Diffusion、Midjourney等多平台集成，批量生成、风格迁移、图像增强全流程覆盖。',
    price: 199,
    originalPrice: 349,
    category: '数字产品',
    subCategory: '开发工具',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
    ],
    rating: 4.8,
    reviewCount: 256,
    salesCount: 980,
    stock: 999,
    tags: ['hot', 'discount'],
    seller: sellers[0],
    specs: [
      { label: '支持平台', value: 'SD / MJ / DALL-E' },
      { label: '输出格式', value: 'PNG / JPG / WebP' },
      { label: '批量处理', value: '最大100张/次' },
      { label: '预设风格', value: '50+种内置风格' }
    ],
    type: 'digital',
    createdAt: '2024-02-20'
  },
  {
    id: 'p3',
    name: '大语言模型微调实战课程',
    description: '从零到一掌握LLM微调技术，涵盖LoRA、QLoRA、RLHF等主流方法，提供完整项目实践和算力资源。',
    price: 599,
    category: '在线课程',
    subCategory: '进阶实战',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800'
    ],
    rating: 4.9,
    reviewCount: 189,
    salesCount: 750,
    stock: 999,
    tags: ['new', 'recommended'],
    seller: sellers[1],
    specs: [
      { label: '课程时长', value: '48小时视频' },
      { label: '章节数量', value: '12章86节' },
      { label: '配套资源', value: '代码+数据集+笔记' },
      { label: '学习方式', value: '永久有效 + 社群答疑' },
      { label: '证书', value: '结业证书' }
    ],
    type: 'digital',
    createdAt: '2024-04-01'
  },
  {
    id: 'p4',
    name: 'AgentPit 定制款卫衣 - 经典黑',
    description: '100%纯棉面料，舒适透气，经典黑色百搭款式。正面印有AgentPit Logo，背面印有智能体图案，限量发售。',
    price: 168,
    originalPrice: 218,
    category: '实体周边',
    subCategory: '定制T恤',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
    ],
    rating: 4.7,
    reviewCount: 145,
    salesCount: 620,
    stock: 150,
    tags: ['discount'],
    seller: sellers[2],
    specs: [
      { label: '材质', value: '100%精梳棉' },
      { label: '尺码', value: 'S/M/L/XL/XXL' },
      { label: '颜色', value: '经典黑 / 纯白 / 深灰' },
      { label: '洗涤方式', value: '机洗冷水，不可漂白' }
    ],
    type: 'physical',
    createdAt: '2024-01-10'
  },
  {
    id: 'p5',
    name: '企业级RAG检索增强生成系统',
    description: '生产级RAG系统架构，支持向量数据库、文档解析、混合检索、重排序等核心功能，附带企业部署最佳实践。',
    price: 1299,
    originalPrice: 1999,
    category: '数字产品',
    subCategory: '智能体模板',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ],
    rating: 4.9,
    reviewCount: 98,
    salesCount: 320,
    stock: 999,
    tags: ['hot', 'recommended'],
    seller: sellers[0],
    specs: [
      { label: '向量数据库', value: 'Pinecone / Milvus / Weaviate' },
      { label: '文档格式', value: 'PDF / Word / Excel / Markdown' },
      { label: '检索方式', value: '关键词 + 向量混合检索' },
      { label: '部署方式', value: 'Docker / K8s' },
      { label: 'SLA保障', value: '99.9%' }
    ],
    type: 'digital',
    createdAt: '2024-03-25'
  },
  {
    id: 'p6',
    name: 'Prompt Engineering 高级技巧课',
    description: '掌握提示词工程的核心方法论，从基础语法到高级技巧，包括Chain-of-Thought、Few-shot Learning、Self-consistency等前沿技术。',
    price: 299,
    category: '在线课程',
    subCategory: 'AI入门',
    images: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'
    ],
    rating: 4.8,
    reviewCount: 312,
    salesCount: 1350,
    stock: 999,
    tags: ['hot'],
    seller: sellers[1],
    specs: [
      { label: '课程时长', value: '24小时视频' },
      { label: '案例数量', value: '100+ 实战案例' },
      { label: '练习平台', value: '在线IDE环境' },
      { label: '更新政策', value: '持续免费更新' }
    ],
    type: 'digital',
    createdAt: '2024-02-15'
  },
  {
    id: 'p7',
    name: '智能体API接入套件',
    description: '一站式API集成解决方案，支持OpenAI、Claude、Gemini等主流模型，统一接口规范，自动负载均衡和故障转移。',
    price: 499,
    originalPrice: 799,
    category: '数字产品',
    subCategory: 'API接口',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800'
    ],
    rating: 4.7,
    reviewCount: 178,
    salesCount: 560,
    stock: 999,
    tags: ['new', 'discount'],
    seller: sellers[0],
    specs: [
      { label: '支持模型', value: 'GPT-4 / Claude / Gemini / 文心一言' },
      { label: 'QPS限制', value: '最高10000 QPS' },
      { label: '协议支持', value: 'REST / WebSocket / gRPC' },
      { label: 'SDK语言', value: 'Python / JS / Go / Java' }
    ],
    type: 'digital',
    createdAt: '2024-04-05'
  },
  {
    id: 'p8',
    name: '机械键盘 - AI主题定制版',
    description: '87键紧凑布局，热插拔轴体，RGB背光，键帽采用PBT材质印有AI相关图标。Cherry MX红轴，手感顺滑。',
    price: 599,
    originalPrice: 699,
    category: '实体周边',
    subCategory: '科技配件',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
    ],
    rating: 4.8,
    reviewCount: 203,
    salesCount: 450,
    stock: 80,
    tags: ['new'],
    seller: sellers[2],
    specs: [
      { label: '轴体', value: 'Cherry MX 红轴（热插拔）' },
      { label: '键帽', value: 'PBT二色成型' },
      { label: '背光', value: 'RGB 1680万色' },
      { label: '连接方式', value: '有线 / 蓝牙5.0 / 2.4G无线' },
      { label: '续航', value: '无线模式30天' }
    ],
    type: 'physical',
    createdAt: '2024-03-20'
  },
  {
    id: 'p9',
    name: '一对一 AI 项目咨询服务',
    description: '资深AI专家提供1对1项目咨询，包括技术选型、架构设计、性能优化、成本控制等全方位指导。每次咨询1小时。',
    price: 888,
    category: '专业服务',
    subCategory: '咨询顾问',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
    ],
    rating: 4.9,
    reviewCount: 87,
    salesCount: 230,
    stock: 50,
    tags: ['recommended'],
    seller: sellers[3],
    specs: [
      { label: '咨询时长', value: '60分钟/次' },
      { label: '咨询方式', value: '视频会议 / 电话' },
      { label: '交付物', value: '咨询报告 + 行动计划' },
      { label: '响应时间', value: '预约后24小时内确认' }
    ],
    type: 'service',
    createdAt: '2024-01-05'
  },
  {
    id: 'p10',
    name: '多模态数据处理工具包',
    description: '支持文本、图像、音频、视频的多模态数据处理，包含OCR、语音识别、视频理解等20+预训练模型。',
    price: 399,
    originalPrice: 599,
    category: '数字产品',
    subCategory: '开发工具',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800'
    ],
    rating: 4.6,
    reviewCount: 134,
    salesCount: 420,
    stock: 999,
    tags: ['discount'],
    seller: sellers[0],
    specs: [
      { label: '支持模态', value: '文本 / 图像 / 音频 / 视频' },
      { label: '模型数量', value: '20+ 预训练模型' },
      { label: '处理速度', value: '实时处理 < 200ms' },
      { label: '输出格式', value: 'JSON / 结构化数据' }
    ],
    type: 'digital',
    createdAt: '2024-02-28'
  },
  {
    id: 'p11',
    name: 'AI Agent 自动化工作流引擎',
    description: '可视化拖拽式工作流编排引擎，支持50+内置节点，自定义插件扩展，定时触发、Webhook回调等功能完备。',
    price: 899,
    originalPrice: 1299,
    category: '数字产品',
    subCategory: '智能体模板',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ],
    rating: 4.8,
    reviewCount: 165,
    salesCount: 380,
    stock: 999,
    tags: ['hot', 'discount', 'recommended'],
    seller: sellers[0],
    specs: [
      { label: '节点类型', value: '50+ 内置节点' },
      { label: '执行引擎', value: 'DAG 有向无环图' },
      { label: '并发能力', value: '支持并行执行' },
      { label: '扩展性', value: '支持自定义插件' },
      { label: '监控', value: '实时日志 + 性能指标' }
    ],
    type: 'digital',
    createdAt: '2024-03-10'
  },
  {
    id: 'p12',
    name: '自然语言处理NLP实战训练营',
    description: '21天NLP实战训练营，涵盖文本分类、情感分析、命名实体识别、机器翻译等核心技术，提供GPU算力支持。',
    price: 399,
    category: '在线课程',
    subCategory: '行业应用',
    images: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    ],
    rating: 4.7,
    reviewCount: 198,
    salesCount: 650,
    stock: 999,
    tags: [],
    seller: sellers[1],
    specs: [
      { label: '训练周期', value: '21天' },
      { label: '每日任务', value: '理论 + 实践 + 作业' },
      { label: '算力支持', value: '免费GPU额度' },
      { label: '班级规模', value: '小班制 ≤ 30人' }
    ],
    type: 'digital',
    createdAt: '2024-02-05'
  },
  {
    id: 'p13',
    name: 'AgentPit 限定版马克杯套装',
    description: '陶瓷马克杯350ml容量，配同款杯垫和勺子。简约设计，适合办公室或居家使用。礼盒包装，送礼首选。',
    price: 88,
    originalPrice: 128,
    category: '实体周边',
    subCategory: '办公文具',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      'https://images.unsplash.com/photo-1572726779794-72ac1c48f4bc?w=800'
    ],
    rating: 4.6,
    reviewCount: 112,
    salesCount: 890,
    stock: 300,
    tags: ['discount'],
    seller: sellers[2],
    specs: [
      { label: '容量', value: '350ml' },
      { label: '材质', value: '高温陶瓷' },
      { label: '包装', value: '精美礼盒装' },
      { label: '耐温', value: '-20°C ~ 120°C' }
    ],
    type: 'physical',
    createdAt: '2024-01-20'
  },
  {
    id: 'p14',
    name: '定制化AI模型开发服务',
    description: '根据业务需求定制开发专属AI模型，包括需求分析、数据准备、模型训练、部署上线全流程服务。项目周期4-8周。',
    price: 28888,
    originalPrice: 35888,
    category: '专业服务',
    subCategory: '定制开发',
    images: [
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800'
    ],
    rating: 5.0,
    reviewCount: 45,
    salesCount: 28,
    stock: 10,
    tags: ['recommended'],
    seller: sellers[3],
    specs: [
      { label: '开发周期', value: '4-8周' },
      { label: '团队配置', value: '项目经理 + 算法工程师 + 后端开发' },
      { label: '售后服务', value: '3个月免费维护' },
      { label: '保密协议', value: '签署NDA' }
    ],
    type: 'service',
    createdAt: '2024-01-01'
  },
  {
    id: 'p15',
    name: '高质量中文预训练数据集',
    description: '经过清洗和标注的高质量中文语料数据集，涵盖新闻、百科、社交媒体、专业文献等多个领域，总量超过100GB。',
    price: 1999,
    originalPrice: 2999,
    category: '数字产品',
    subCategory: '数据集',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ],
    rating: 4.8,
    reviewCount: 67,
    salesCount: 180,
    stock: 999,
    tags: ['new', 'discount'],
    seller: sellers[0],
    specs: [
      { label: '数据量', value: '100GB+' },
      { label: '领域分布', value: '12个主要领域' },
      { label: '数据格式', value: 'JSONL / Parquet' },
      { label: '质量标准', value: '去重 + 清洗 + 标注' },
      { label: '使用许可', value: '商业可用' }
    ],
    type: 'digital',
    createdAt: '2024-04-02'
  },
  {
    id: 'p16',
    name: 'AI创业商业落地指南',
    description: '面向创业者和管理者的AI商业化课程，涵盖商业模式设计、产品定位、获客策略、融资要点等实战内容。',
    price: 199,
    category: '在线课程',
    subCategory: '行业应用',
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
    ],
    rating: 4.7,
    reviewCount: 156,
    salesCount: 520,
    stock: 999,
    tags: ['new'],
    seller: sellers[1],
    specs: [
      { label: '课程时长', value: '16小时视频' },
      { label: '案例数量', value: '30+ 创业案例' },
      { label: '附加内容', value: 'BP模板 + 投资人名单' }
    ],
    type: 'digital',
    createdAt: '2024-03-28'
  },
  {
    id: 'p17',
    name: '无线充电鼠标垫 - 极客风',
    description: '超大尺寸鼠标垫(900x400mm)，集成Qi无线充电功能，支持手机/耳机同时充电。防水防滑底面。',
    price: 258,
    originalPrice: 328,
    category: '实体周边',
    subCategory: '科技配件',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
    ],
    rating: 4.7,
    reviewCount: 89,
    salesCount: 340,
    stock: 120,
    tags: ['discount'],
    seller: sellers[2],
    specs: [
      { label: '尺寸', value: '900 x 400 x 4mm' },
      { label: '充电功率', value: '15W Qi快充' },
      { label: '表面材质', value: '超细纤维布面' },
      { label: '兼容设备', value: '所有Qi设备' }
    ],
    type: 'physical',
    createdAt: '2024-02-18'
  },
  {
    id: 'p18',
    name: '数据分析与BI报表搭建服务',
    description: '帮助企业搭建完整的数据分析体系，包括数据仓库设计、ETL流程、BI看板制作、数据治理等全套服务。',
    price: 15800,
    originalPrice: 19800,
    category: '专业服务',
    subCategory: '咨询顾问',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ],
    rating: 4.9,
    reviewCount: 56,
    salesCount: 42,
    stock: 20,
    tags: ['recommended'],
    seller: sellers[4],
    specs: [
      { label: '服务周期', value: '2-4周' },
      { label: '数据源', value: '支持主流数据库/API' },
      { label: 'BI工具', value: 'Tableau / Power BI / 自研' },
      { label: '交付成果', value: '完整分析报告 + 可视化看板' }
    ],
    type: 'service',
    createdAt: '2024-02-10'
  },
  {
    id: 'p19',
    name: '开源LLM部署优化指南',
    description: '详解Llama、Mistral、Qwen等开源模型的本地部署与优化，包括量化、推理加速、显存优化等实用技巧。',
    price: 149,
    originalPrice: 249,
    category: '数字产品',
    subCategory: '开发工具',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800'
    ],
    rating: 4.8,
    reviewCount: 234,
    salesCount: 1100,
    stock: 999,
    tags: ['hot', 'discount'],
    seller: sellers[0],
    specs: [
      { label: '支持模型', value: 'Llama / Mistral / Qwen / ChatGLM' },
      { label: '优化技术', value: '量化 / KV Cache / Flash Attention' },
      { label: '硬件要求', value: '最低8GB显存' },
      { label: '代码示例', value: 'Python完整实现' }
    ],
    type: 'digital',
    createdAt: '2024-03-05'
  },
  {
    id: 'p20',
    name: 'AI安全与合规审计服务',
    description: '针对AI系统的安全性评估和合规审计服务，包括数据隐私、算法公平性、输出安全、知识产权等方面的全面检查。',
    price: 38800,
    category: '专业服务',
    subCategory: '咨询顾问',
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800'
    ],
    rating: 4.9,
    reviewCount: 32,
    salesCount: 15,
    stock: 5,
    tags: [],
    seller: sellers[4],
    specs: [
      { label: '审计范围', value: '数据 / 算法 / 系统 / 流程' },
      { label: '合规标准', value: 'GDPR / 中国网安法 / 行业标准' },
      { label: '交付物', value: '审计报告 + 整改建议' },
      { label: '周期', value: '2-3周' }
    ],
    type: 'service',
    createdAt: '2024-01-15'
  },
  {
    id: 'p21',
    name: '智能对话系统快速搭建教程',
    description: '基于LangChain框架的对话系统开发教程，从基础概念到生产部署，包含RAG、Agent、Memory等高级特性讲解。',
    price: 249,
    category: '在线课程',
    subCategory: '进阶实战',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800'
    ],
    rating: 4.8,
    reviewCount: 178,
    salesCount: 720,
    stock: 999,
    tags: ['hot'],
    seller: sellers[1],
    specs: [
      { label: '课程时长', value: '20小时视频' },
      { label: '技术栈', value: 'LangChain + LlamaIndex + Vector DB' },
      { label: '项目实战', value: '5个完整项目' },
      { label: '源码获取', value: 'GitHub开源' }
    ],
    type: 'digital',
    createdAt: '2024-03-18'
  },
  {
    id: 'p22',
    name: 'AgentPit 周边盲盒系列',
    description: '随机抽取AgentPit周边商品，可能获得：T恤、马克杯、贴纸、徽章、钥匙扣等。每个盲盒价值不低于售价的1.5倍！',
    price: 66,
    category: '实体周边',
    subCategory: '限量版品',
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800'
    ],
    rating: 4.5,
    reviewCount: 267,
    salesCount: 2100,
    stock: 500,
    tags: ['hot', 'new'],
    seller: sellers[2],
    specs: [
      { label: '盒内数量', value: '3-5件商品' },
      { label: '保底价值', value: '≥ ¥99' },
      { label: '稀有概率', value: '隐藏款 5%' },
      { label: '限量', value: '每季限定' }
    ],
    type: 'physical',
    createdAt: '2024-04-07'
  },
  {
    id: 'p23',
    name: '企业私有化部署技术服务',
    description: '为企业客户提供AI平台私有化部署服务，包括环境搭建、模型调优、系统集成、运维培训等全流程支持。',
    price: 58800,
    originalPrice: 78800,
    category: '专业服务',
    subCategory: '定制开发',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800'
    ],
    rating: 5.0,
    reviewCount: 18,
    salesCount: 8,
    stock: 3,
    tags: ['recommended'],
    seller: sellers[3],
    specs: [
      { label: '部署方式', value: '私有云 / 本地服务器' },
      { label: '支持规模', value: '100-10000用户' },
      { label: 'SLA', value: '99.9% 可用性' },
      { label: '培训', value: '管理员 + 用户培训' }
    ],
    type: 'service',
    createdAt: '2024-01-08'
  },
  {
    id: 'p24',
    name: 'AI绘画提示词大全Pro版',
    description: '收录10000+高质量AI绘画提示词，按场景分类，支持中英文对照，附赠提示词优化技巧和参数调优指南。',
    price: 99,
    originalPrice: 199,
    category: '数字产品',
    subCategory: '数据集',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
    ],
    rating: 4.6,
    reviewCount: 445,
    salesCount: 2800,
    stock: 999,
    tags: ['hot', 'discount'],
    seller: sellers[0],
    specs: [
      { label: '提示词数量', value: '10000+' },
      { label: '分类数量', value: '50+ 场景分类' },
      { label: '格式', value: 'Excel / JSON / 在线查询' },
      { label: '更新', value: '每月新增500+' }
    ],
    type: 'digital',
    createdAt: '2024-02-25'
  }
]

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: '技术达人小王',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    rating: 5,
    content: '非常棒的模板！文档详细，代码质量高，按照文档很快就跑起来了。客服响应也很及时，强烈推荐给需要做智能客服的朋友。',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
    likes: 45,
    createdAt: '2024-04-01',
    isVerifiedPurchase: true
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u2',
    userName: '产品经理老李',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    rating: 5,
    content: '我们公司用了这个模板重构了整个客服系统，效率提升了300%。多轮对话效果很好，知识库对接也很方便。',
    likes: 32,
    createdAt: '2024-03-28',
    isVerifiedPurchase: true
  },
  {
    id: 'r3',
    productId: 'p1',
    userId: 'u3',
    userName: '前端小白',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    rating: 4,
    content: '整体不错，就是对于新手来说有些地方需要自己摸索。希望能增加更多新手引导的内容。',
    likes: 18,
    createdAt: '2024-03-25',
    isVerifiedPurchase: true
  },
  {
    id: 'r4',
    productId: 'p3',
    userId: 'u4',
    userName: 'AI研究员',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    rating: 5,
    content: '这是我上过最好的LLM微调课程！老师讲得很透彻，从原理到实践都有涉及。提供的算力资源也很给力，省了自己租GPU的钱。',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400'
    ],
    likes: 67,
    createdAt: '2024-04-03',
    isVerifiedPurchase: true
  },
  {
    id: 'r5',
    productId: 'p3',
    userId: 'u5',
    userName: '算法工程师',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
    rating: 5,
    content: 'LoRA和QLoRA部分讲得特别清楚，学完之后直接在公司项目里用上了。RLHF那章虽然难但很有深度。',
    likes: 54,
    createdAt: '2024-03-30',
    isVerifiedPurchase: true
  },
  {
    id: 'r6',
    productId: 'p5',
    userId: 'u6',
    userName: 'CTO张总',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
    rating: 5,
    content: '企业级的质量！架构设计很合理，我们基于这个做了二次开发，节省了至少3个月的开发时间。技术支持也很到位。',
    likes: 41,
    createdAt: '2024-04-02',
    isVerifiedPurchase: true
  },
  {
    id: 'r7',
    productId: 'p11',
    userId: 'u7',
    userName: '全栈开发者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7',
    rating: 5,
    content: '这个工作流引擎太好用了！拖拽式操作非常直观，节点类型丰富，自定义插件也容易写。已经用它搭了好几个自动化流程了。',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
    likes: 38,
    createdAt: '2024-04-04',
    isVerifiedPurchase: true
  },
  {
    id: 'r8',
    productId: 'p4',
    userId: 'u8',
    userName: '时尚达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8',
    rating: 4,
    content: '卫衣质量很好，穿着舒服，印花做工精细。就是尺码稍微偏小一点，建议买大一码。',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
    likes: 23,
    createdAt: '2024-03-20',
    isVerifiedPurchase: true
  },
  {
    id: 'r9',
    productId: 'p14',
    userId: 'u9',
    userName: '创业公司老板',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user9',
    rating: 5,
    content: '赵老师的定制开发服务太专业了！从需求调研到最终交付都非常顺畅，最终交付的系统完全超出预期。虽然价格不便宜但物超所值！',
    likes: 29,
    createdAt: '2024-03-15',
    isVerifiedPurchase: true
  },
  {
    id: 'r10',
    productId: 'p9',
    userId: 'u10',
    userName: '产品负责人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user10',
    rating: 5,
    content: '咨询非常有针对性，赵老师对我们的业务理解很深，给出的建议都很实用。一小时的时间收获满满，后续还保持了一段时间的跟进指导。',
    likes: 35,
    createdAt: '2024-03-22',
    isVerifiedPurchase: true
  }
]

export const orders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'MP202404090001',
    items: [
      { product: products[0], quantity: 1, price: products[0].price },
      { product: products[2], quantity: 1, price: products[2].price }
    ],
    totalAmount: 898,
    status: 'completed',
    createdAt: '2024-04-09 10:30:00',
    paymentMethod: '支付宝',
    shippingAddress: {
      recipient: '张三',
      phone: '138****8888',
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      detail: '中关村大街1号'
    },
    trackingNumber: 'SF1234567890',
    logisticsInfo: [
      { time: '2024-04-09 14:00', description: '已签收，签收人：本人签收', status: 'delivered' },
      { time: '2024-04-09 08:30', description: '快递员正在派送中', status: 'out_for_delivery' },
      { time: '2024-04-08 20:00', description: '到达北京海淀营业部', status: 'in_transit' },
      { time: '2024-04-08 15:00', description: '深圳发出', status: 'picked_up' }
    ]
  },
  {
    id: 'o2',
    orderNumber: 'MP202404080002',
    items: [
      { product: products[7], quantity: 1, price: products[7].price }
    ],
    totalAmount: 599,
    status: 'pending_receipt',
    createdAt: '2024-04-08 16:20:00',
    paymentMethod: '微信支付',
    shippingAddress: {
      recipient: '李四',
      phone: '139****6666',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '陆家嘴环路1000号'
    },
    trackingNumber: 'YT9876543210',
    logisticsInfo: [
      { time: '2024-04-09 09:00', description: '正在派送中', status: 'out_for_delivery' },
      { time: '2024-04-08 22:00', description: '到达上海浦东营业部', status: 'in_transit' },
      { time: '2024-04-08 18:00', description: '广州发出', status: 'picked_up' }
    ]
  },
  {
    id: 'o3',
    orderNumber: 'MP202404070003',
    items: [
      { product: products[10], quantity: 1, price: products[10].price },
      { product: products[18], quantity: 1, price: products[18].price }
    ],
    totalAmount: 1048,
    status: 'pending_shipment',
    createdAt: '2024-04-07 14:50:00',
    paymentMethod: '银行卡支付',
    shippingAddress: {
      recipient: '王五',
      phone: '137****5555',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区深南大道'
    }
  },
  {
    id: 'o4',
    orderNumber: 'MP202404060004',
    items: [
      { product: products[13], quantity: 1, price: products[13].price }
    ],
    totalAmount: 28888,
    status: 'pending_payment',
    createdAt: '2024-04-06 09:15:00',
    paymentMethod: '',
    shippingAddress: {
      recipient: '赵六',
      phone: '136****4444',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      detail: '文三路478号'
    }
  },
  {
    id: 'o5',
    orderNumber: 'MP202404050005',
    items: [
      { product: products[3], quantity: 2, price: products[3].price },
      { product: products[12], quantity: 3, price: products[12].price }
    ],
    totalAmount: 600,
    status: 'completed',
    createdAt: '2024-04-05 11:30:00',
    paymentMethod: '支付宝',
    shippingAddress: {
      recipient: '孙七',
      phone: '135****3333',
      province: '四川省',
      city: '成都市',
      district: '武侯区',
      detail: '天府大道中段1268号'
    },
    trackingNumber: 'ZT1122334455',
    logisticsInfo: [
      { time: '2024-04-07 10:00', description: '已签收', status: 'delivered' },
      { time: '2024-04-07 09:00', description: '派送中', status: 'out_for_delivery' },
      { time: '2024-04-06 20:00', description: '成都转运中心', status: 'in_transit' }
    ]
  },
  {
    id: 'o6',
    orderNumber: 'MP202404040006',
    items: [
      { product: products[5], quantity: 1, price: products[5].price }
    ],
    totalAmount: 299,
    status: 'cancelled',
    createdAt: '2024-04-04 15:40:00',
    paymentMethod: '微信支付',
    shippingAddress: {
      recipient: '周八',
      phone: '134****2222',
      province: '湖北省',
      city: '武汉市',
      district: '洪山区',
      detail: '珞喻路1037号'
    }
  },
  {
    id: 'o7',
    orderNumber: 'MP202404030007',
    items: [
      { product: products[1], quantity: 1, price: products[1].price },
      { product: products[9], quantity: 1, price: products[9].price }
    ],
    totalAmount: 598,
    status: 'refunding',
    createdAt: '2024-04-03 10:20:00',
    paymentMethod: '支付宝',
    shippingAddress: {
      recipient: '吴九',
      phone: '133****1111',
      province: '江苏省',
      city: '南京市',
      district: '鼓楼区',
      detail: '汉中路140号'
    }
  },
  {
    id: 'o8',
    orderNumber: 'MP202404020008',
    items: [
      { product: products[21], quantity: 1, price: products[21].price }
    ],
    totalAmount: 249,
    status: 'completed',
    createdAt: '2024-04-02 14:10:00',
    paymentMethod: '微信支付',
    shippingAddress: {
      recipient: '郑十',
      phone: '132****0000',
      province: '陕西省',
      city: '西安市',
      district: '雁塔区',
      detail: '长安南路88号'
    },
    trackingNumber: 'SF9988776655',
    logisticsInfo: [
      { time: '2024-04-04 11:00', description: '已签收', status: 'delivered' },
      { time: '2024-04-04 09:00', description: '派送中', status: 'out_for_delivery' },
      { time: '2024-04-03 18:00', description: '西安分拨中心', status: 'in_transit' }
    ]
  }
]

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category)
}

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter(r => r.productId === productId)
}

export const getOrdersByStatus = (status: string): Order[] => {
  if (status === 'all') return orders
  return orders.filter(o => o.status === status)
}
