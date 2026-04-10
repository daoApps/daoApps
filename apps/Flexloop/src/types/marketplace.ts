/**
 * 交易市场类型定义
 * 用于商品、订单、购物车等功能
 */

/** 商品类型 */
export type ProductType = 'digital' | 'physical' | 'service';

/** 商品标签 */
export type ProductTag = 'new' | 'hot' | 'discount' | 'recommended';

/** 商品接口 */
export interface Product {
  /** 商品唯一标识 */
  id: string;
  /** 商品名称 */
  name: string;
  /** 商品详细描述 */
  description: string;
  /** 当前售价 */
  price: number;
  /** 原价（用于显示折扣） */
  originalPrice?: number;
  /** 一级分类名称 */
  category: string;
  /** 二级分类名称 */
  subCategory: string;
  /** 商品图片 URL 列表 */
  images: string[];
  /** 用户评分 (0-5) */
  rating: number;
  /** 评价数量 */
  reviewCount: number;
  /** 销量 */
  salesCount: number;
  /** 库存数量 */
  stock: number;
  /** 商品标签 */
  tags: ProductTag[];
  /** 卖家信息 */
  seller: Seller;
  /** 规格参数列表 */
  specs: ProductSpec[];
  /** 商品类型 */
  type: ProductType;
  /** 上架时间 */
  createdAt: string;
}

/** 商品规格参数 */
export interface ProductSpec {
  /** 参数名 */
  label: string;
  /** 参数值 */
  value: string;
}

/** 卖家信息 */
export interface Seller {
  /** 卖家唯一标识 */
  id: string;
  /** 卖家真实姓名 */
  name: string;
  /** 头像 URL */
  avatar: string;
  /** 店铺名称 */
  storeName: string;
  /** 店铺评分 (0-5) */
  rating: number;
  /** 粉丝数量 */
  followerCount: number;
  /** 在售商品数量 */
  productCount: number;
  /** 店铺简介 */
  description: string;
  /** 是否已认证 */
  isVerified: boolean;
}

/** 商品分类 */
export interface Category {
  /** 分类唯一标识 */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类图标（Emoji） */
  icon: string;
  /** 子分类列表 */
  children?: SubCategory[];
}

/** 子分类 */
export interface SubCategory {
  /** 子分类唯一标识 */
  id: string;
  /** 子分类名称 */
  name: string;
  /** 该分类下商品数量 */
  count: number;
}

/** 评价接口 */
export interface Review {
  /** 评价唯一标识 */
  id: string;
  /** 关联的商品 ID */
  productId: string;
  /** 评价用户 ID */
  userId: string;
  /** 评价用户名 */
  userName: string;
  /** 评价用户头像 */
  userAvatar: string;
  /** 评分 (1-5) */
  rating: number;
  /** 评价内容 */
  content: string;
  /** 评价配图 */
  images?: string[];
  /** 点赞数 */
  likes: number;
  /** 评价时间 */
  createdAt: string;
  /** 是否为已验证购买用户 */
  isVerifiedPurchase: boolean;
}

/** 订单状态 */
export type OrderStatus =
  | 'pending_payment'
  | 'pending_shipment'
  | 'pending_receipt'
  | 'completed'
  | 'cancelled'
  | 'refunding';

/** 订单接口 */
export interface Order {
  /** 订单唯一标识 */
  id: string;
  /** 订单编号（如 MP202404090001） */
  orderNumber: string;
  /** 订单商品列表 */
  items: OrderItem[];
  /** 订单总金额 */
  totalAmount: number;
  /** 订单状态 */
  status: OrderStatus;
  /** 下单时间 */
  createdAt: string;
  /** 支付方式 */
  paymentMethod: string;
  /** 收货地址 */
  shippingAddress: ShippingAddress;
  /** 物流单号 */
  trackingNumber?: string;
  /** 物流轨迹 */
  logisticsInfo?: LogisticsStep[];
}

/** 订单项（商品+数量+单价） */
export interface OrderItem {
  /** 商品信息 */
  product: Product;
  /** 购买数量 */
  quantity: number;
  /** 下单时单价 */
  price: number;
}

/** 收货地址 */
export interface ShippingAddress {
  /** 收货人姓名 */
  recipient: string;
  /** 联系电话 */
  phone: string;
  /** 省份 */
  province: string;
  /** 城市 */
  city: string;
  /** 区/县 */
  district: string;
  /** 详细地址 */
  detail: string;
}

/** 物流轨迹节点 */
export interface LogisticsStep {
  /** 时间 */
  time: string;
  /** 物流描述 */
  description: string;
  /** 当前状态 */
  status: LogisticsStatus;
}

/** 物流状态 */
export type LogisticsStatus = 'in_transit' | 'delivered' | 'picked_up' | 'out_for_delivery';

/** 购物车项 */
export interface CartItem {
  /** 商品信息 */
  product: Product;
  /** 数量 */
  quantity: number;
  /** 是否选中 */
  selected: boolean;
}

/** 搜索筛选条件 */
export interface MarketplaceFilter {
  /** 关键词搜索 */
  keyword?: string;
  /** 一级分类 */
  category?: string;
  /** 二级分类 */
  subCategory?: string;
  /** 价格区间 */
  priceRange?: [number, number];
  /** 商品类型 */
  type?: ProductType;
  /** 排序方式 */
  sortBy?: 'price_asc' | 'price_desc' | 'sales' | 'rating' | 'newest';
  /** 标签筛选 */
  tags?: ProductTag[];
}

/** 购物车统计信息 */
export interface CartSummary {
  /** 已选商品总数 */
  totalItems: number;
  /** 已选商品总金额 */
  totalAmount: number;
  /** 折扣金额 */
  discountAmount: number;
  /** 实付金额 */
  finalAmount: number;
}
