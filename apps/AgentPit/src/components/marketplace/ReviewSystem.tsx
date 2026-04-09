import { useState } from 'react'
import { Review } from '../../data/mockMarketplace'

interface ReviewSystemProps {
  productId: string
  reviews: Review[]
}

const StarRating = ({ rating, size = 'md', interactive = false, onChange }: { 
  rating: number; 
  size?: 'sm' | 'md';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

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

const RatingDistribution = ({ reviews }: { reviews: Review[] }) => {
  const totalReviews = reviews.length
  if (totalReviews === 0) return null

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.floor(r.rating) === star).length,
    percentage: (reviews.filter(r => Math.floor(r.rating) === star).length / totalReviews) * 100
  }))

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  const goodRate = reviews.filter(r => r.rating >= 4).length / totalReviews * 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
          <StarRating rating={avgRating} />
          <p className="text-sm text-gray-500 mt-2">{totalReviews} 条评价</p>
        </div>

        <div className="flex-1 space-y-2.5">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12 flex-shrink-0">{star} 星</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
              <span className="text-sm text-gray-400 w-12 text-right">{percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>

        <div className="text-center px-6 border-l border-gray-200">
          <p className="text-sm text-gray-500 mb-1">好评率</p>
          <p className="text-3xl font-bold text-green-600">{goodRate.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  )
}

const ReviewItem = ({ review }: { review: Review }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(review.likes)

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1)
    } else {
      setLikeCount(prev => prev + 1)
    }
    setLiked(!liked)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <img src={review.userAvatar} alt="" className="w-10 h-10 rounded-full bg-gray-100" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 text-sm">{review.userName}</span>
              {review.isVerifiedPurchase && (
                <span className="px-1.5 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded">
                  已购买
                </span>
              )}
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{review.createdAt}</span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.content}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          有用 ({likeCount})
        </button>
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          回复
        </button>
      </div>
    </div>
  )
}

const WriteReviewForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit()
    setContent('')
    setImages([])
    setRating(5)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">发表评价</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
          <StarRating rating={rating} interactive onChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享您的使用体验，帮助其他买家做出选择..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
          />
          <div className="text-right text-xs text-gray-400 mt-1">{content.length}/500</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">添加图片（可选）</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const placeholderImg = `https://images.unsplash.com/photo-${1550000000 + Math.floor(Math.random() * 999999999)}?w=400`
                if (images.length < 5) {
                  setImages([...images, placeholderImg])
                }
              }}
              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs mt-1">上传</span>
            </button>
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">最多上传5张图片，支持JPG、PNG格式</p>
        </div>

        <button
          type="submit"
          disabled={!content.trim()}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            content.trim()
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          提交评价
        </button>
      </form>
    </div>
  )
}

const ReviewSystem = ({ productId, reviews }: ReviewSystemProps) => {
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [showForm, setShowForm] = useState(false)

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <RatingDistribution reviews={reviews} />

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors font-medium"
        >
          写评价，分享您的体验
        </button>
      )}

      {showForm && <WriteReviewForm onSubmit={() => setShowForm(false)} />}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">全部评价 ({reviews.length})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="newest">最新优先</option>
          <option value="highest">好评优先</option>
          <option value="lowest">差评优先</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>暂无评价，快来发表第一条吧！</p>
        </div>
      )}
    </div>
  )
}

export default ReviewSystem
