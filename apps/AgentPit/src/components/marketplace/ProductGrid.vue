<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product, ProductTag } from '@/types/marketplace'

/**
 * ProductGrid 组件 Props 接口
 * @interface Props
 */
interface Props {
  /**
   * 商品数组
   */
  products: Product[]
}

const props = defineProps<Props>()

/**
 * ProductGrid 组件事件定义
 * @emits addToCart - 添加到购物车事件
 * @emits toggleFavorite - 切换收藏状态事件
 */
const emit = defineEmits<{
  /**
   * 添加到购物车事件
   * @param {Product} product - 商品对象
   */
  addToCart: [product: Product]
  /**
   * 切换收藏状态事件
   * @param {string} productId - 商品 ID
   */
  toggleFavorite: [productId: string]
}>()

const router = useRouter()
const favorites = ref<Set<string>>(new Set())

const tagConfig: Record<ProductTag, { text: string; className: string }> = {
  new: { text: '新品', className: 'bg-red-500 text-white' },
  hot: { text: '热销', className: 'bg-orange-500 text-white' },
  discount: { text: '折扣', className: 'bg-pink-500 text-white' },
  recommended: { text: '推荐', className: 'bg-primary-500 text-white' }
}

const getDiscount = (product: Product): number => {
  if (!product.originalPrice) return 0
  return Math.round((1 - product.price / product.originalPrice) * 100)
}

const toggleFavorite = (productId: string, event: Event) => {
  event.stopPropagation()
  if (favorites.value.has(productId)) {
    favorites.value.delete(productId)
  } else {
    favorites.value.add(productId)
  }
  emit('toggleFavorite', productId)
}

const handleAddToCart = (product: Product, event: Event) => {
  event.stopPropagation()
  emit('addToCart', product)
}

const navigateToProduct = (productId: string) => {
  router.push(`/marketplace/product/${productId}`)
}
</script>

<template>
  <div v-if="products.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500">
    <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <p class="text-lg font-medium">暂无相关商品</p>
    <p class="text-sm mt-1">试试调整筛选条件或搜索其他关键词</p>
  </div>

  <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
    <div
      v-for="product in products"
      :key="product.id"
      class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      @click="navigateToProduct(product.id)"
    >
      <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          :src="product.images[0]"
          :alt="product.name"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div class="absolute top-3 left-3 flex gap-1.5">
          <span
            v-for="tag in product.tags"
            :key="tag"
            :class="['px-2 py-0.5 text-xs font-medium rounded', tagConfig[tag]?.className || 'bg-gray-500 text-white']"
          >
            {{ tagConfig[tag]?.text || tag }}
          </span>
        </div>

        <span
          v-if="getDiscount(product) > 0"
          class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold"
        >
          -{{ getDiscount(product) }}%
        </span>

        <button
          :class="[
            'absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
            favorites.has(product.id)
              ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          ]"
          @click="(e) => toggleFavorite(product.id, e)"
        >
          <svg
            class="w-5 h-5"
            :fill="favorites.has(product.id) ? 'currentColor' : 'none'"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button
          class="absolute bottom-3 right-14 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-primary-500 text-white shadow-lg hover:bg-primary-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          @click="(e) => handleAddToCart(product, e)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </button>
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between mb-2">
          <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ product.subCategory }}</span>
          <div class="flex items-center gap-1">
            <div class="flex items-center gap-0.5">
              <template v-for="star in 5" :key="star">
                <svg
                  class="w-3.5 h-3.5"
                  :class="star <= Math.floor(product.rating) ? 'text-yellow-400' : star <= product.rating ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </template>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400 ml-1">{{ product.rating }}</span>
          </div>
        </div>

        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[48px] group-hover:text-primary-600 transition-colors">
          {{ product.name }}
        </h3>

        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">已售 {{ product.salesCount.toLocaleString() }}</p>

        <div class="flex items-baseline justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-bold text-red-500">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">¥{{ product.originalPrice }}</span>
          </div>
          <span class="text-xs text-gray-400">
            {{ product.type === 'digital' ? '数字产品' : product.type === 'service' ? '服务' : '实体商品' }}
          </span>
        </div>

        <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <img :src="product.seller.avatar" alt="" class="w-5 h-5 rounded-full" />
          <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ product.seller.storeName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
