import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../data/mockMarketplace'

interface ProductGridProps {
  products: Product[]
}

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= Math.floor(rating) ? 'text-yellow-400' : star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const TagBadge = ({ tag }: { tag: string }) => {
  const tagConfig: Record<string, { text: string; className: string }> = {
    new: { text: '新品', className: 'bg-red-500 text-white' },
    hot: { text: '热销', className: 'bg-orange-500 text-white' },
    discount: { text: '折扣', className: 'bg-pink-500 text-white' },
    recommended: { text: '推荐', className: 'bg-primary-500 text-white' }
  }
  const config = tagConfig[tag] || { text: tag, className: 'bg-gray-500 text-white' }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.className}`}>
      {config.text}
    </span>
  )
}

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/marketplace/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{discount}%
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-600 hover:text-red-500'} shadow-lg`}
        >
          <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className={`absolute bottom-3 right-14 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-primary-500 text-white shadow-lg hover:bg-primary-600 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{product.subCategory}</span>
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-3 line-clamp-1">已售 {product.salesCount.toLocaleString()}</p>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-red-500">¥{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {product.type === 'digital' ? '数字产品' : product.type === 'service' ? '服务' : '实体商品'}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <img src={product.seller.avatar} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-xs text-gray-500 truncate">{product.seller.storeName}</span>
        </div>
      </div>
    </div>
  )
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-lg font-medium">暂无相关商品</p>
        <p className="text-sm mt-1">试试调整筛选条件或搜索其他关键词</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
