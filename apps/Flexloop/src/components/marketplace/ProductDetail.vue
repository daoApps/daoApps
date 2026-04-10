<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Product, ProductTag } from '@/types/marketplace';
import { products, getReviewsByProductId } from '@/data/mockMarketplace';
import ReviewSystem from './ReviewSystem.vue';

interface Props {
  product?: Product;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addToCart: [product: Product, quantity: number];
}>();

const router = useRouter();
const route = useRoute();
const product = computed(() => props.product || products.find((p) => p.id === route.params.id));

const quantity = ref(1);
const activeTab = ref<'detail' | 'reviews'>('detail');
const isFavorite = ref(false);
const reviews = computed(() => (product.value ? getReviewsByProductId(product.value.id) : []));

const discount = computed(() => {
  if (!product.value?.originalPrice) return 0;
  return Math.round((1 - product.value.price / product.value.originalPrice) * 100);
});

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return products
    .filter((p) => p.id !== product.value!.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
});

const tagConfig: Record<ProductTag, { text: string; className: string }> = {
  new: {
    text: '🆕 新品',
    className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  },
  hot: {
    text: '🔥 热销',
    className: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  },
  discount: {
    text: '💰 折扣',
    className: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
  },
  recommended: {
    text: '⭐ 推荐',
    className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  }
};

const currentIndex = ref(0);

const setCurrentIndex = (index: number) => {
  currentIndex.value = index;
};

const prevImage = () => {
  if (!product.value) return;
  currentIndex.value =
    currentIndex.value === 0 ? product.value.images.length - 1 : currentIndex.value - 1;
};

const nextImage = () => {
  if (!product.value) return;
  currentIndex.value =
    currentIndex.value === product.value.images.length - 1 ? 0 : currentIndex.value + 1;
};

const updateQuantity = (val: number) => {
  if (product.value) {
    quantity.value = Math.min(Math.max(1, val), product.value.stock);
  }
};

const handleAddToCart = () => {
  if (product.value) {
    emit('addToCart', product.value, quantity.value);
  }
};

const handleBuyNow = () => {
  handleAddToCart();
  router.push('/marketplace?tab=cart');
};
</script>

<template>
  <div v-if="!product" class="flex flex-col items-center justify-center py-20">
    <p class="text-xl font-medium text-gray-900 dark:text-white mb-4">商品不存在</p>
    <button
      class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      @click="router.push('/marketplace')"
    >
      返回市场首页
    </button>
  </div>

  <div v-else class="max-w-7xl mx-auto space-y-8 pb-12">
    <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <button
        class="hover:text-primary-600 dark:hover:text-primary-400"
        @click="router.push('/marketplace')"
      >
        市场首页
      </button>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="text-gray-900 dark:text-white truncate max-w-xs">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-3">
        <div
          class="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 group"
        >
          <img :src="product.images[currentIndex]" alt="" class="w-full h-full object-cover" />

          <template v-if="product.images.length > 1">
            <button
              class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              @click="prevImage"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              @click="nextImage"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              <button
                v-for="(_, idx) in product.images"
                :key="idx"
                :class="[
                  'h-2 rounded-full transition-all',
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                ]"
                @click="setCurrentIndex(idx)"
              />
            </div>
          </template>
        </div>

        <div v-if="product.images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.images"
            :key="idx"
            :class="[
              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
              idx === currentIndex
                ? 'border-primary-500'
                : 'border-transparent hover:border-gray-300'
            ]"
            @click="setCurrentIndex(idx)"
          >
            <img :src="img" alt="" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <div class="flex items-start justify-between gap-4 mb-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {{ product.name }}
            </h1>
            <button
              :class="[
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isFavorite
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500'
              ]"
              @click="isFavorite = !isFavorite"
            >
              <svg
                class="w-5 h-5"
                :fill="isFavorite ? 'currentColor' : 'none'"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center gap-0.5">
              <template v-for="star in 5" :key="star">
                <svg
                  class="w-5 h-5"
                  :class="
                    star <= Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : star <= product.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                  "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07-3.292c-.784.57-1.838-.197-1.539-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00-.951-.69l1.07-3.292z"
                  />
                </svg>
              </template>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ product.rating }}</span>
            <span class="text-sm text-gray-400">|</span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ product.reviewCount }} 条评价</span
            >
            <span class="text-sm text-gray-400">|</span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >已售 {{ product.salesCount.toLocaleString() }}</span
            >
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in product.tags"
              :key="tag"
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-full',
                (tagConfig[tag]?.className || 'bg-gray-100 text-gray-600')
              ]"
            >
              {{ tagConfig[tag]?.text || tag }}
            </span>
          </div>

          <div
            class="flex items-baseline gap-3 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl"
          >
            <span class="text-3xl font-bold text-red-500">¥{{ product.price }}</span>
            <template v-if="product.originalPrice">
              <span class="text-lg text-gray-400 line-through">¥{{ product.originalPrice }}</span>
              <span
                v-if="discount > 0"
                class="px-2 py-0.5 bg-red-500 text-white text-sm font-medium rounded"
              >
                省 ¥{{ product.originalPrice - product.price }}
              </span>
            </template>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-900 dark:text-white">数量</label>
          <div
            class="inline-flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            <button
              :disabled="quantity <= 1"
              class="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              @click="updateQuantity(quantity - 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              :value="quantity"
              class="w-14 h-10 text-center border-x border-gray-200 dark:border-gray-600 focus:outline-none text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              @input="(e) => updateQuantity(parseInt((e.target as HTMLInputElement).value) || 1)"
            />
            <button
              :disabled="product && quantity >= product.stock"
              class="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              @click="updateQuantity(quantity + 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">库存 {{ product.stock }} 件</p>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            class="flex-1 py-3.5 px-6 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
            @click="handleAddToCart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L6.2 7H9M7 13l-1.6 8H20v1M16 6a3 3 0 01-3 3H5a3 3 0 00-6z"
              />
            </svg>
            加入购物车
          </button>
          <button
            class="flex-1 py-3.5 px-6 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center"
            @click="handleBuyNow"
          >
            立即购买
          </button>
        </div>

        <!-- Seller Info -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-4">
            <img :src="product.seller.avatar" alt="" class="w-12 h-12 rounded-full" />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ product.seller.storeName }}</h4>
                <span
                  v-if="product.seller.isVerified"
                  class="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">✓ 认证</span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ product.seller.description }}</p>
            </div>
            <button
              class="px-4 py-1.5 text-sm border border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              关注店铺
            </button>
          </div>
          <div class="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="text-center">
            <div class="text-base font-bold text-gray-900 dark:text-white">
              {{ product.seller.rating }}
            </div>
            <div class="flex items-center justify-center">
              <template v-for="star in 5" :key="star">
                <svg
                  class="w-3 h-3"
                  :class="
                    star <= Math.floor(product.seller.rating)
                      ? 'text-yellow-400'
                      : star <= product.seller.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                  "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07-3.292c-.784.57-1.838-.197-1.539-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00-.951-.69l1.07-3.292z"
                  />
                </svg>
              </template>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">评分</p>
          </div>
          <div class="text-center">
            <div class="text-base font-bold text-gray-900 dark:text-white">
              {{ product.seller.followerCount.toLocaleString }}
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">关注者</p>
          </div>
          <div class="text-center">
            <div class="text-base font-bold text-gray-900 dark:text-white">
              {{ product.seller.productCount }}
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">在售商品</p>
          </div>
        </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700 flex">
        <button
          class="px-6 py-3 text-sm font-medium transition-colors"
          :class="
            activeTab === 'detail'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
          "
          @click="activeTab = 'detail'"
        >
          商品详情
        </button>
        <button
          class="px-6 py-3 text-sm font-medium transition-colors"
          :class="
            activeTab === 'reviews'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
          "
          @click="activeTab = 'reviews'"
        >
          用户评价({{ reviews.length }})
        </button>
      </div>

      <div v-if="activeTab === 'detail'" class="p-6">
        <p>{{ product.description }}</p>
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 mt-6">
          <div
            v-for="(value, key in product.specs"
            :key="key"
            class="flex py-1"
          >
            <span class="text-sm text-gray-500 dark:text-gray-400 w-1/3">{{ key }}：</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ value }}</span>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-3 gap-4">
          <img
            v-for="img in product.images.slice(1)"
            :key="img"
            :src="img"
            alt=""
            class="w-full rounded-lg"
          />
        </div>
      </div>

      <div v-if="activeTab === 'reviews'" class="p-0">
        <ReviewSystem v-else :product-id="product.id" :reviews="reviews" />
        <div v-if="reviews.length === 0" class="py-12 text-center">
          <p class="text-gray-500 dark:text-gray-400">暂无评价</p>
        </div>
      </div>
    </div>

    <div v-if="relatedProducts.length > 0">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">猜你喜欢</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="p in relatedProducts"
          :key="p.id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group cursor-pointer"
          @click="router.push(`/marketplace/product/${p.id}"
        >
          <div class="aspect-square bg-gray-100 dark:bg-gray-700">
            <img :src="p.images[0]" alt="" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h4 class="font-semibold text-gray-900 dark:text-white line-clamp-1">{{ p.name }}</h4>
            <p class="mt-1 text-red-500 font-bold">¥{{ p.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
