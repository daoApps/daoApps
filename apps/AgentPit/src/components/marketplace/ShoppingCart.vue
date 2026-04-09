<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'

const router = useRouter()
const cartStore = useCartStore()

const handleClearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    cartStore.clearCart()
  }
}

const handleCheckout = () => {
  alert('结算功能演示：订单已提交！')
}
</script>

<template>
  <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-20">
    <div class="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <svg class="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">购物车是空的</h3>
    <p class="text-gray-500 dark:text-gray-400 mb-6">快去挑选心仪的商品吧！</p>
    <button
      class="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
      @click="router.push('/marketplace')"
    >
      去逛逛
    </button>
  </div>

  <div v-else class="max-w-6xl mx-auto space-y-6 pb-12">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">购物车 ({{ cartStore.items.length }})</h1>
      <button
        class="text-sm text-red-500 hover:text-red-600 font-medium"
        @click="handleClearCart"
      >
        清空购物车
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="cartStore.items.length > 0 && cartStore.items.every(item => item.selected)"
                class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
                @change="cartStore.toggleSelectAll()"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">全选</span>
            </label>
            <span class="text-sm text-gray-500 dark:text-gray-400 flex-1">商品信息</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 w-20 text-center">单价</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 w-28 text-center">数量</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 w-24 text-center">小计</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 w-16 text-center">操作</span>
          </div>

          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-for="item in cartStore.items"
              :key="item.product.id"
              class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="item.selected"
                  class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
                  @change="cartStore.toggleSelect(item.product.id)"
                />
              </label>

              <div
                class="flex items-center gap-3 flex-1 cursor-pointer"
                @click="router.push(`/marketplace/product/${item.product.id}`)"
              >
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-20 h-20 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{{ item.product.name }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.product.subCategory }}</p>
                  <p v-if="item.product.type !== 'digital' && item.product.type !== 'service'" class="text-xs text-green-600 mt-0.5">有货</p>
                </div>
              </div>

              <div class="w-20 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-sm font-semibold text-red-500">¥{{ item.product.price }}</span>
                  <span v-if="item.product.originalPrice" class="text-xs text-gray-400 line-through">¥{{ item.product.originalPrice }}</span>
                </div>
              </div>

              <div class="w-28 flex justify-center">
                <div class="inline-flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    :disabled="item.quantity <= 1"
                    class="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    :value="item.quantity"
                    class="w-12 h-8 text-center text-sm border-x border-gray-200 dark:border-gray-600 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    @input="(e) => cartStore.updateQuantity(item.product.id, parseInt((e.target as HTMLInputElement).value) || 1)"
                  />
                  <button
                    :disabled="item.quantity >= item.product.stock"
                    class="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="w-24 text-center">
                <span class="text-sm font-bold text-gray-900 dark:text-white">
                  ¥{{ (item.product.price * item.quantity).toLocaleString() }}
                </span>
              </div>

              <div class="w-16 text-center">
                <button
                  class="text-gray-400 hover:text-red-500 transition-colors"
                  title="删除"
                  @click="cartStore.removeItem(item.product.id)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">订单摘要</h3>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">已选商品</span>
              <span class="text-gray-900 dark:text-white">{{ cartStore.totalItems }} 件</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">商品总价</span>
              <span class="text-gray-900 dark:text-white">¥{{ cartStore.subtotal.toLocaleString() }}</span>
            </div>
            <div v-if="cartStore.discountAmount > 0" class="flex justify-between text-green-600">
              <span>优惠减免</span>
              <span>- ¥{{ cartStore.discountAmount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">运费</span>
              <span :class="cartStore.shippingCost === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'">
                {{ cartStore.shippingCost === 0 ? '免运费' : `¥${cartStore.shippingCost}` }}
              </span>
            </div>
            <div v-if="cartStore.subtotal > 0 && cartStore.subtotal < 299" class="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
              再买 ¥{{ (299 - cartStore.subtotal).toLocaleString() }} 即可免运费
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div class="flex justify-between items-baseline">
                <span class="font-semibold text-gray-900 dark:text-white">实付金额</span>
                <span class="text-2xl font-bold text-red-500">¥{{ cartStore.finalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <button
            :disabled="cartStore.selectedItems.length === 0"
            :class="[
              'w-full mt-6 py-3.5 rounded-xl font-semibold text-base transition-all',
              cartStore.selectedItems.length > 0
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
            @click="handleCheckout"
          >
            结算 ({{ cartStore.selectedItems.length }})
          </button>

          <div class="mt-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>满 ¥299 包邮</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>7天无理由退换（部分商品除外）</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>正品保障 假一赔十</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
