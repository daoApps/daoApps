<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Review } from '@/types/marketplace'

interface Props {
  productId: string
  reviews: Review[]
}

const props = defineProps<Props>()

const sortBy = ref<'newest' | 'highest' | 'lowest'>('newest')
const showForm = ref(false)
const formRating = ref(5)
const formContent = ref('')
const formImages = ref<string[]>([])
const likedReviews = ref<Set<string>>(new Set())
const likeCounts = ref<Record<string, number>>({})

const sortedReviews = computed(() => {
  const reviewsCopy = [...props.reviews]
  switch (sortBy.value) {
    case 'newest':
      return reviewsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'highest':
      return reviewsCopy.sort((a, b) => b.rating - a.rating)
    case 'lowest':
      return reviewsCopy.sort((a, b) => a.rating - b.rating)
    default:
      return reviewsCopy
  }
})

const avgRating = computed(() => {
  if (props.reviews.length === 0) return 0
  return props.reviews.reduce((sum, r) => sum + r.rating, 0) / props.reviews.length
})

const goodRate = computed(() => {
  if (props.reviews.length === 0) return 0
  return (props.reviews.filter(r => r.rating >= 4).length / props.reviews.length) * 100
})

const distribution = computed(() => {
  return [5, 4, 3, 2, 1].map(star => ({
    star,
    count: props.reviews.filter(r => Math.floor(r.rating) === star).length,
    percentage: props.reviews.length > 0
      ? (props.reviews.filter(r => Math.floor(r.rating) === star).length / props.reviews.length) * 100
      : 0
  }))
})

const handleLike = (reviewId: string) => {
  if (likedReviews.value.has(reviewId)) {
    likedReviews.value.delete(reviewId)
    likeCounts.value[reviewId] = (likeCounts.value[reviewId] || 0) - 1
  } else {
    likedReviews.value.add(reviewId)
    likeCounts.value[reviewId] = (likeCounts.value[reviewId] || 0) + 1
  }
}

const handleSubmitReview = () => {
  if (!formContent.value.trim()) return
  showForm.value = false
  formContent.value = ''
  formImages.value = []
  formRating.value = 5
}

const handleAddImage = () => {
  if (formImages.value.length < 5) {
    const placeholderImg = `https://images.unsplash.com/photo-${1550000000 + Math.floor(Math.random() * 999999999)}?w=400`
    formImages.value.push(placeholderImg)
  }
}

const handleRemoveImage = (index: number) => {
  formImages.value = formImages.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="reviews.length > 0" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-start gap-8">
        <div class="text-center">
          <div class="text-5xl font-bold text-gray-900 dark:text-white">{{ avgRating.toFixed(1) }}</div>
          <div class="flex items-center gap-0.5 justify-center mt-2">
            <template v-for="star in 5" :key="star">
              <svg
                class="w-5 h-5"
                :class="star <= Math.floor(avgRating) ? 'text-yellow-400' : star <= avgRating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </template>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ reviews.length }} 条评价</p>
        </div>

        <div class="flex-1 space-y-2.5">
          <div v-for="{ star, count, percentage } in distribution" :key="star" class="flex items-center gap-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-12 flex-shrink-0">{{ star }} 星</span>
            <div class="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-400'
                ]"
                :style="{ width: `${percentage}%` }"
              />
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400 w-10 text-right">{{ count }}</span>
            <span class="text-sm text-gray-400 w-12 text-right">{{ percentage.toFixed(0) }}%</span>
          </div>
        </div>

        <div class="text-center px-6 border-l border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">好评率</p>
          <p class="text-3xl font-bold text-green-600">{{ goodRate.toFixed(0) }}%</p>
        </div>
      </div>
    </div>

    <button
      v-if="!showForm"
      class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-colors font-medium"
      @click="showForm = true"
    >
      写评价，分享您的体验
    </button>

    <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">发表评价</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">评分</label>
        <div class="flex items-center gap-0.5">
          <template v-for="star in 5" :key="star">
            <button
              type="button"
              :class="[
                'w-5 h-5 cursor-pointer hover:scale-110 transition-transform',
                star <= formRating ? 'text-yellow-400' : 'text-gray-300'
              ]"
              @click="formRating = star"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </template>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">评价内容</label>
        <textarea
          v-model="formContent"
          placeholder="分享您的使用体验，帮助其他买家做出选择..."
          rows="4"
          maxlength="500"
          class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <div class="text-right text-xs text-gray-400 mt-1">{{ formContent.length }}/500</div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">添加图片（可选）</label>
        <div class="flex gap-2">
          <button
            type="button"
            class="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-colors"
            @click="handleAddImage"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-xs mt-1">上传</span>
          </button>

          <div
            v-for="(img, idx) in formImages"
            :key="idx"
            class="relative w-20 h-20 rounded-xl overflow-hidden group"
          >
            <img :src="img" alt="" class="w-full h-full object-cover" />
            <button
              type="button"
              class="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              @click="handleRemoveImage(idx)"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-2">最多上传5张图片，支持JPG、PNG格式</p>
      </div>

      <button
        type="button"
        :disabled="!formContent.trim()"
        :class="[
          'px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
          formContent.trim()
            ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
        ]"
        @click="handleSubmitReview"
      >
        提交评价
      </button>
    </div>

    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-gray-900 dark:text-white">全部评价 ({{ reviews.length }})</h3>
      <select
        v-model="sortBy"
        class="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="newest">最新优先</option>
        <option value="highest">好评优先</option>
        <option value="lowest">差评优先</option>
      </select>
    </div>

    <div class="space-y-4">
      <div
        v-for="review in sortedReviews"
        :key="review.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-3">
            <img :src="review.userAvatar" alt="" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700" />
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 dark:text-white text-sm">{{ review.userName }}</span>
                <span
                  v-if="review.isVerifiedPurchase"
                  class="px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded"
                >
                  已购买
                </span>
              </div>
              <div class="flex items-center gap-0.5 mt-1">
                <template v-for="star in 5" :key="star">
                  <svg
                    class="w-4 h-4"
                    :class="star <= Math.floor(review.rating) ? 'text-yellow-400' : star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </template>
              </div>
            </div>
          </div>
          <span class="text-xs text-gray-400">{{ review.createdAt }}</span>
        </div>

        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{{ review.content }}</p>

        <div v-if="review.images && review.images.length > 0" class="flex gap-2 mb-4 overflow-x-auto pb-1">
          <img
            v-for="(img, idx) in review.images"
            :key="idx"
            :src="img"
            alt=""
            class="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          />
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            :class="[
              'flex items-center gap-1.5 text-sm transition-colors',
              likedReviews.has(review.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            ]"
            @click="handleLike(review.id)"
          >
            <svg
              class="w-4 h-4"
              :fill="likedReviews.has(review.id) ? 'currentColor' : 'none'"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            有用 ({{ likeCounts[review.id] || review.likes }})
          </button>
          <button class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            回复
          </button>
        </div>
      </div>
    </div>

    <div v-if="sortedReviews.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
      <p>暂无评价，快来发表第一条吧！</p>
    </div>
  </div>
</template>
