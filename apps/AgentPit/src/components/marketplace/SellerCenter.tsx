import { useState } from 'react'
import { Product, Seller, products as allProducts, orders as allOrders } from '../../data/mockMarketplace'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface SellerCenterProps {
  seller?: Seller
}

const currentSeller: Seller = {
  id: 's1',
  name: '张明',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
  storeName: 'AI模板工坊',
  rating: 4.9,
  followerCount: 12580,
  productCount: 45,
  description: '专注AI智能体模板开发，提供高质量可复用方案',
  isVerified: true
}

const revenueData = [
  { month: '11月', revenue: 28000, orders: 42 },
  { month: '12月', revenue: 35000, orders: 56 },
  { month: '1月', revenue: 32000, orders: 48 },
  { month: '2月', revenue: 41000, orders: 65 },
  { month: '3月', revenue: 48000, orders: 78 },
  { month: '4月', revenue: 56000, orders: 92 }
]

const categoryData = [
  { name: '智能体模板', value: 45, color: '#0ea5e9' },
  { name: '开发工具', value: 25, color: '#10b981' },
  { name: 'API接口', value: 18, color: '#f59e0b' },
  { name: '数据集', value: 12, color: '#8b5cf6' }
]

type SellerTab = 'overview' | 'products' | 'orders' | 'publish'

const StatCard = ({ title, value, change, icon, color }: {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            <svg className={`w-3 h-3 ${change >= 0 ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {Math.abs(change)}% 较上月
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
)

const ProductManageItem = ({ 
  product, 
  onEdit, 
  onDelete,
  onToggleStatus 
}: { 
  product: Product
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void 
}) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
      <p className="text-xs text-gray-500 mt-1">{product.subCategory}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-sm font-semibold text-red-500">¥{product.price}</span>
        <span className="text-xs text-gray-400">销量 {product.salesCount}</span>
        <span className="text-xs text-gray-400">库存 {product.stock}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggleStatus(product.id)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          product.stock > 0
            ? 'bg-green-50 text-green-600 hover:bg-green-100'
            : 'bg-red-50 text-red-600 hover:bg-red-100'
        }`}
      >
        {product.stock > 0 ? '已上架' : '已下架'}
      </button>
      <button
        onClick={() => onEdit(product.id)}
        className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors"
      >
        编辑
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
      >
        删除
      </button>
    </div>
  </div>
)

const PublishForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    type: 'digital' as 'digital' | 'physical' | 'service',
    images: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">商品标题 *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="请输入商品标题（最多60字）"
          maxLength={60}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">商品描述 *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="详细描述您的商品特点、功能、使用场景等..."
          rows={5}
          maxLength={2000}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">{formData.description.length}/2000</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">价格 (¥) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            min={0}
            step={0.01}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">库存数量 *</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="数字产品可填999"
            min={0}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">商品分类 *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
        >
          <option value="">请选择分类</option>
          <option value="智能体模板">智能体模板</option>
          <option value="API接口">API接口</option>
          <option value="数据集">数据集</option>
          <option value="开发工具">开发工具</option>
          <option value="在线课程">在线课程</option>
          <option value="实体周边">实体周边</option>
          <option value="专业服务">专业服务</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">商品类型 *</label>
        <div className="flex gap-3">
          {[
            { value: 'digital', label: '数字产品', desc: '模板、课程、工具等' },
            { value: 'physical', label: '实体商品', desc: '需要物流配送' },
            { value: 'service', label: '服务', desc: '咨询、定制等' }
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.value as typeof formData.type })}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                formData.type === type.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-sm text-gray-900">{type.label}</p>
              <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">商品图片</label>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
                i <= formData.images.length + 1
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
              onClick={() => {
                if (i > formData.images.length + 1) return
                const newImages = [...formData.images]
                if (newImages.length < i) {
                  newImages.push(`https://images.unsplash.com/photo-${1550000000 + Math.floor(Math.random() * 999999999)}?w=800`)
                  setFormData({ ...formData, images: newImages })
                }
              }}
            >
              {i <= formData.images.length ? (
                <img src={formData.images[i - 1]} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs block mt-1">上传</span>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">最多上传5张图片，建议尺寸800x800，支持JPG/PNG格式</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={!formData.name || !formData.price || !formData.category}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            formData.name && formData.price && formData.category
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          发布商品
        </button>
        <button
          type="button"
          onClick={() => setFormData({
            name: '', description: '', price: '', category: '', stock: '', type: 'digital', images: []
          })}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          重置
        </button>
      </div>
    </form>
  )
}

const SellerCenter = ({ seller }: SellerCenterProps) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('overview')
  const sellerData = seller || currentSeller
  const [myProducts] = useState<Product[]>(allProducts.filter(p => p.seller.id === sellerData.id))
  const [myOrders] = useState(allOrders.filter(o => o.items.some(i => i.product.seller.id === sellerData.id)))

  const tabs: { key: SellerTab; label: string; icon: string }[] = [
    { key: 'overview', label: '数据概览', icon: '📊' },
    { key: 'products', label: '商品管理', icon: '📦' },
    { key: 'orders', label: '订单处理', icon: '📋' },
    { key: 'publish', label: '发布商品', icon: '➕' }
  ]

  const totalRevenue = myOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalSales = myProducts.reduce((sum, p) => sum + p.salesCount, 0)
  const totalVisitors = 28540

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={sellerData.avatar} alt="" className="w-14 h-14 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{sellerData.storeName}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span>卖家：{sellerData.name}</span>
              {sellerData.isVerified && (
                <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  认证商家
                </span>
              )}
              <span>{sellerData.followerCount.toLocaleString()} 粉丝</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            店铺设置
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="总销售额"
              value={`¥${totalRevenue.toLocaleString()}`}
              change={23.5}
              icon={<span className="text-2xl">💰</span>}
              color="bg-green-100"
            />
            <StatCard
              title="订单数"
              value={myOrders.length}
              change={15.2}
              icon={<span className="text-2xl">📦</span>}
              color="bg-blue-100"
            />
            <StatCard
              title="在售商品"
              value={myProducts.filter(p => p.stock > 0).length}
              icon={<span className="text-2xl">🏪</span>}
              color="bg-purple-100"
            />
            <StatCard
              title="访客数"
              value={totalVisitors.toLocaleString()}
              change={32.1}
              icon={<span className="text-2xl">👥</span>}
              color="bg-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">收益趋势</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="收益(元)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">品类分布</h3>
              <div className="space-y-4">
                {categoryData.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">月度订单量</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} name="订单数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
                全部 ({myProducts.length})
              </button>
              <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                上架中 ({myProducts.filter(p => p.stock > 0).length})
              </button>
              <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                已下架 ({myProducts.filter(p => p.stock === 0).length})
              </button>
            </div>
            <button
              onClick={() => setActiveTab('publish')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              发布新商品
            </button>
          </div>
          <div className="space-y-3">
            {myProducts.map((product) => (
              <ProductManageItem
                key={product.id}
                product={product}
                onEdit={(id) => console.log('编辑:', id)}
                onDelete={(id) => console.log('删除:', id)}
                onToggleStatus={(id) => console.log('切换状态:', id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
              待处理 ({myOrders.filter(o => o.status === 'pending_shipment').length})
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
              已发货 ({myOrders.filter(o => o.status === 'pending_receipt').length})
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
              已完成 ({myOrders.filter(o => o.status === 'completed').length})
            </button>
          </div>
          {myOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">订单号：{order.orderNumber}</span>
                  <span className="text-gray-400">{order.createdAt}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending_shipment' ? 'bg-blue-100 text-blue-600' :
                  order.status === 'pending_receipt' ? 'bg-primary-100 text-primary-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {order.status === 'pending_shipment' ? '待发货' :
                   order.status === 'pending_receipt' ? '待收货' : '已完成'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {order.items.map(item => (
                  <img key={item.product.id} src={item.product.images[0]} alt="" className="w-14 h-14 object-cover rounded-lg" />
                ))}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{order.items.map(i => i.product.name).join('、')}</p>
                </div>
                <span className="text-lg font-bold text-red-500">¥{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                {order.status === 'pending_shipment' && (
                  <>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
                      发货
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                      查看详情
                    </button>
                  </>
                )}
                {order.status !== 'pending_shipment' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                    查看详情
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'publish' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">发布新商品</h2>
          <PublishForm onSubmit={() => alert('商品发布成功！')} />
        </div>
      )}
    </div>
  )
}

export default SellerCenter
