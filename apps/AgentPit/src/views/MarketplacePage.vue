<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'
import ProductGrid from '../components/marketplace/ProductGrid.vue'
import SearchFilter from '../components/marketplace/SearchFilter.vue'
import ShoppingCart from '../components/marketplace/ShoppingCart.vue'
import OrderManagement from '../components/marketplace/OrderManagement.vue'
import SellerCenter from '../components/marketplace/SellerCenter.vue'
import ProductDetail from '../components/marketplace/ProductDetail.vue'
import { useCartStore } from '@/stores/useCartStore'
import type { Product } from '@/types/marketplace'
import { products as allProducts } from '@/data/mockMarketplace'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

type TabType = 'home' | 'cart' | 'orders' | 'seller'

const activeTab = ref<TabType>((route.query.tab as TabType) || 'home')
const selectedProductId = ref<string | null>(null)
const filteredProducts = ref<Product[]>(allProducts)

watch(() => route.query.tab, (newTab) => {
  if (newTab && ['home', 'cart', 'orders', 'seller'].includes(newTab as TabType)) {
    activeTab.value = newTab as TabType
    selectedProductId.value = null
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    selectedProductId.value = newId as string
  }
}, { immediate: true })

const tabs: { key: TabType; label: string; icon: string }[] = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'cart', label: '购物车', icon: '🛒' },
  { key: 'orders', label: '订单', icon: '📋' },
  { key: 'seller', label: '卖家中心', icon: '🏪' }
]

const handleFilterChange = (filters: { search: string; category: string; subCategory: string; priceRange: [number, number]; minRating: number; sortBy: string; deliveryType: string[] }) => {
  let result = [...allProducts]

  if (filters.search) {
    const keyword = filters.search.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
    )
  }

  if (filters.category) {
    result = result.filter(p => p.category === filters.category)
  }

  if (filters.subCategory) {
    result = result.filter(p => p.subCategory === filters.subCategory)
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )
  }

  if (filters.minRating > 0) {
    result = result.filter(p => p.rating >= filters.minRating)
  }

  if (filters.deliveryType.length > 0) {
    result = result.filter(p => filters.deliveryType.includes(p.type))
  }

  switch (filters.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'sales':
      result.sort((a, b) => b.salesCount - a.salesCount)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'discount':
      result.sort((a, b) => {
        const discountA = a.originalPrice ? (1 - a.price / a.originalPrice) : 0
        const discountB = b.originalPrice ? (1 - b.price / b.originalPrice) : 0
        return discountB - discountA
      })
      break
  }

  filteredProducts.value = result
}

const handleAddToCart = (product: Product) => {
  cartStore.addItem(product)
}

const handleAddToCartWithQuantity = (product: Product, quantity: number) => {
  cartStore.addItem(product, quantity)
}

const switchTab = (tab: TabType) => {
  activeTab.value = tab
  selectedProductId.value = null
  router.push({ path: '/marketplace', query: { tab } })
}

const goBackToHome = () => {
  selectedProductId.value = null
}
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto">
      <div v-if="!selectedProductId" class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">交易市场</h1>

          <div class="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="switchTab(tab.key)"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5',
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <span>{{ tab.icon }}</span>
              {{ tab.label }}
              <span
                v-if="tab.key === 'cart' && cartStore.itemCount > 0"
                class="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full"
              >
                {{ cartStore.itemCount }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'home'" class="space-y-6">
          <SearchFilter :total-results="filteredProducts.length" @filter-change="handleFilterChange" />
          <ProductGrid
            :products="filteredProducts"
            @add-to-cart="handleAddToCart"
            @toggle-favorite="(id) => console.log('Toggle favorite:', id)"
          />
        </div>

        <div v-else-if="activeTab === 'cart'">
          <ShoppingCart />
        </div>

        <div v-else-if="activeTab === 'orders'">
          <OrderManagement />
        </div>

        <div v-else-if="activeTab === 'seller'">
          <SellerCenter />
        </div>
      </div>

      <div v-else>
        <button
          @click="goBackToHome"
          class="mb-4 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回商品列表
        </button>

        <ProductDetail
          :product="allProducts.find(p => p.id === selectedProductId)"
          @add-to-cart="handleAddToCartWithQuantity"
        />
      </div>
    </div>
  </MainLayout>
</template>
