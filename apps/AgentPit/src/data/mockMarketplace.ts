export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory: string;
  images: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  stock: number;
  tags: ('new' | 'hot' | 'discount' | 'recommended')[];
  seller: Seller;
  specs: { label: string; value: string }[];
  type: 'digital' | 'physical' | 'service';
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  storeName: string;
  rating: number;
  followerCount: number;
  productCount: number;
  description: string;
  isVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  children?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  count: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  images?: string[];
  likes: number;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

export interface LogisticsStep {
  time: string;
  description: string;
  status: 'in_transit' | 'delivered' | 'picked_up' | 'out_for_delivery';
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | 'pending_payment'
    | 'pending_shipment'
    | 'pending_receipt'
    | 'completed'
    | 'cancelled'
    | 'refunding';
  createdAt: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  logisticsInfo?: LogisticsStep[];
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
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
  }
];

export const categories: Category[] = [
  {
    id: 'c1',
    name: '数字产品',
    icon: '💻',
    children: [
      { id: 'c1-1', name: '智能体模板', count: 156 },
      { id: 'c1-2', name: 'API接口', count: 89 },
      { id: 'c1-3', name: '数据集', count: 67 }
    ]
  },
  {
    id: 'c2',
    name: '在线课程',
    icon: '📚',
    children: [
      { id: 'c2-1', name: 'AI入门', count: 78 },
      { id: 'c2-2', name: '进阶实战', count: 65 }
    ]
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'GPT-4 智能客服机器人模板',
    description: '基于GPT-4的智能客服解决方案，支持多轮对话、意图识别、知识库问答',
    price: 299,
    originalPrice: 499,
    category: '数字产品',
    subCategory: '智能体模板',
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'],
    rating: 4.9,
    reviewCount: 328,
    salesCount: 1520,
    stock: 999,
    tags: ['hot', 'recommended'],
    seller: sellers[0]!,
    specs: [
      { label: '适用场景', value: '电商客服、在线咨询' },
      { label: '技术栈', value: 'React + Node.js + OpenAI API' }
    ],
    type: 'digital',
    createdAt: '2024-03-15'
  },
  {
    id: 'p2',
    name: 'AI绘画工作流自动化工具',
    description: '一键式AI绘画工作流，支持Stable Diffusion、Midjourney等',
    price: 199,
    originalPrice: 349,
    category: '数字产品',
    subCategory: '开发工具',
    images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'],
    rating: 4.8,
    reviewCount: 256,
    salesCount: 980,
    stock: 999,
    tags: ['hot', 'discount'],
    seller: sellers[0]!,
    specs: [{ label: '支持平台', value: 'SD / MJ / DALL-E' }],
    type: 'digital',
    createdAt: '2024-02-20'
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: '技术达人小王',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    rating: 5,
    content: '非常棒的模板！文档详细，代码质量高',
    likes: 45,
    createdAt: '2024-04-01',
    isVerifiedPurchase: true
  }
];

export const orders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'MP202404090001',
    items: [{ product: products[0]!, quantity: 1, price: products[0]!.price }],
    totalAmount: 299,
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
    }
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter((r) => r.productId === productId);
};

export const getOrdersByStatus = (status: string): Order[] => {
  if (status === 'all') return orders;
  return orders.filter((o) => o.status === status);
};
