import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types/marketplace'
import { products } from '@/data/mockMarketplace'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem('marketplace_cart')
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored)
        items.value = parsed
          .map(item => ({
            ...item,
            product: products.find(p => p.id === item.product.id) || item.product
          }))
          .filter(item => item.product)
      }
    } catch (e) {
      console.error('Failed to load cart:', e)
    }
  }

  const saveCartToStorage = () => {
    try {
      localStorage.setItem('marketplace_cart', JSON.stringify(items.value))
    } catch (e) {
      console.error('Failed to save cart:', e)
    }
  }

  loadCartFromStorage()

  const selectedItems = computed(() => items.value.filter(item => item.selected))

  const totalItems = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  const discountAmount = computed(() =>
    selectedItems.value.reduce((sum, item) => {
      if (item.product.originalPrice) {
        return sum + (item.product.originalPrice - item.product.price) * item.quantity
      }
      return sum
    }, 0)
  )

  const shippingCost = computed(() => {
    if (subtotal.value === 0) return 0
    return subtotal.value >= 299 ? 0 : 15
  })

  const finalAmount = computed(() =>
    subtotal.value - discountAmount.value + shippingCost.value
  )

  const addItem = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock)
    } else {
      items.value.push({
        product,
        quantity: Math.min(quantity, product.stock),
        selected: true
      })
    }
    saveCartToStorage()
  }

  const removeItem = (productId: string) => {
    items.value = items.value.filter(item => item.product.id !== productId)
    saveCartToStorage()
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return

    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      item.quantity = Math.min(quantity, item.product.stock)
      saveCartToStorage()
    }
  }

  const toggleSelect = (productId: string) => {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      item.selected = !item.selected
      saveCartToStorage()
    }
  }

  const toggleSelectAll = () => {
    const allSelected = items.value.every(item => item.selected)
    items.value.forEach(item => {
      item.selected = !allSelected
    })
    saveCartToStorage()
  }

  const clearCart = () => {
    items.value = []
    saveCartToStorage()
  }

  const itemCount = computed(() => items.value.length)

  return {
    items,
    selectedItems,
    totalItems,
    subtotal,
    discountAmount,
    shippingCost,
    finalAmount,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    clearCart
  }
}, {
  persist: true
})
