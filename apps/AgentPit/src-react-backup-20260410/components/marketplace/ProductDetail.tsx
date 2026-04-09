import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Product, Review, products, getReviewsByProductId } from '../../data/mockMarketplace'
import ReviewSystem from './ReviewSystem'

interface ProductDetailProps {
  product?: Product
}

const StarRating = ({ rating, size = 'md', interactive = false, onChange }: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size]

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${sizeClass} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src={images[currentIndex]}
          alt=""
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const QuantitySelector = ({ value, onChange, max = 99 }: { value: number; onChange: (val: number) => void; max?: number }) => {
  return (
    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value) || 1
          onChange(Math.min(max, Math.max(1, val)))
        }}
        className="w-14 h-10 text-center border-x border-gray-200 focus:outline-none text-sm font-medium"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}

const RelatedProducts = ({ currentProductId }: { currentProductId: string }) => {
  const relatedProducts = products
    .filter(p => p.id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  const navigate = useNavigate()

  if (relatedProducts.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">相关推荐</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/marketplace/product/${product.id}`)}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h4>
              <span className="text-base font-bold text-red-500">¥{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const ProductDetail = ({ product: propProduct }: ProductDetailProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = propProduct || products.find(p => p.id === id)
  
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'detail' | 'reviews'>('detail')
  const [isFavorite, setIsFavorite] = useState(false)
  const reviews = product ? getReviewsByProductId(product.id) : []

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl font-medium text-gray-900 mb-4">商品不存在</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          返回市场首页
        </button>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <button onClick={() => navigate('/marketplace')} className="hover:text-primary-600">市场首页</button>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageCarousel images={product.images} />

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">{product.reviewCount} 条评价</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">已售 {product.salesCount.toLocaleString()}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    tag === 'new' ? 'bg-red-100 text-red-600' :
                    tag === 'hot' ? 'bg-orange-100 text-orange-600' :
                    tag === 'discount' ? 'bg-pink-100 text-pink-600' :
                    'bg-blue-100 text-blue-600'
                  }`}
                >
                  {tag === 'new' ? '🆕 新品' : tag === 'hot' ? '🔥 热销' : tag === 'discount' ? '💰 折扣' : '⭐ 推荐'}
                </span>
              ))}
            </div>

            <div className="flex items-baseline gap-3 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
              <span className="text-3xl font-bold text-red-500">¥{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">¥{product.originalPrice}</span>
                  {discount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-sm font-medium rounded">
                      省 ¥{product.originalPrice - product.price}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">数量</label>
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
            <p className="text-xs text-gray-500">库存 {product.stock} 件</p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3.5 px-6 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              加入购物车
            </button>
            <button className="flex-1 py-3.5 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              立即购买
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={product.seller.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{product.seller.storeName}</span>
                  {product.seller.isVerified && (
                    <span className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.seller.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <StarRating rating={product.seller.rating} size="sm" />
                  <span className="text-sm font-medium">{product.seller.rating}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{product.seller.followerCount.toLocaleString()} 关注者</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-primary-500 text-primary-500 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                进店逛逛
              </button>
              <button className="py-2 px-4 border border-pink-500 text-pink-500 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors">
                + 关注
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('detail')}
            className={`pb-4 text-sm font-medium relative transition-colors ${
              activeTab === 'detail' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            商品详情
            {activeTab === 'detail' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-medium relative transition-colors ${
              activeTab === 'reviews' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            用户评价 ({reviews.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'detail' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">规格参数</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="flex py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500 w-28 flex-shrink-0">{spec.label}</span>
                  <span className="text-sm text-gray-900 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">商品介绍</h3>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <p>{product.description}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.images.slice(1).map((img, idx) => (
                  <img key={idx} src={img} alt="" className="rounded-lg w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ReviewSystem productId={product.id} reviews={reviews} />
      )}

      <RelatedProducts currentProductId={product.id} />
    </div>
  )
}

export default ProductDetail
