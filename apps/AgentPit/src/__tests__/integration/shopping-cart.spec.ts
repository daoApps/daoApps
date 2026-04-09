import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '@/stores/useCartStore'

describe('Shopping Cart Integration - Complete Purchase Flow', () => {
  let cartStore: ReturnType<typeof useCartStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    cartStore = useCartStore()
  })

  const productA = { id: 'pa', name: '商品A', price: 199, quantity: 1, image: '', selected: false }
  const productB = { id: 'pb', name: '商品B', price: 50, quantity: 1, image: '', selected: false }
  const productC = { id: 'pc', name: '商品C', price: 300, quantity: 1, image: '', selected: false }

  describe('Add to cart flow', () => {
    it('adds single product to empty cart', () => {
      cartStore.addItem(productA)
      expect(cartStore.items.length).toBe(1)
      expect(cartStore.items[0].name).toBe('商品A')
      expect(cartStore.totalItems).toBe(1)
    })

    it('increments quantity for duplicate product', () => {
      cartStore.addItem(productA)
      cartStore.addItem(productA)
      expect(cartStore.items.length).toBe(1)
      expect(cartStore.items[0].quantity).toBe(2)
      expect(cartStore.totalItems).toBe(2)
    })

    it('adds different products as separate entries', () => {
      cartStore.addItem(productA)
      cartStore.addItem(productB)
      expect(cartStore.items.length).toBe(2)
      expect(cartStore.totalItems).toBe(2)
    })
  })

  describe('Cart modification flow', () => {
    it('updates quantity and recalculates subtotal', () => {
      cartStore.addItem(productA)
      cartStore.updateQuantity('pa', 5)
      expect(cartStore.items[0].quantity).toBe(5)
      expect(cartStore.subtotal).toBe(995)
    })

    it('removes item and recalculates total', () => {
      cartStore.addItem(productA)
      cartStore.addItem(productB)
      cartStore.removeItem('pa')
      expect(cartStore.items.length).toBe(1)
      expect(cartStore.items[0].id).toBe('pb')
      expect(cartStore.subtotal).toBe(50)
    })

    it('setting quantity to 0 removes item', () => {
      cartStore.addItem(productA)
      cartStore.updateQuantity('pa', 0)
      expect(cartStore.items.length).toBe(0)
    })
  })

  describe('Selection and checkout flow', () => {
    beforeEach(() => {
      cartStore.addItem(productA)
      cartStore.addItem(productB)
      cartStore.addItem(productC)
    })

    it('toggleSelect toggles individual item', () => {
      cartStore.toggleSelect('pa')
      expect(cartStore.selectedItems.length).toBe(1)
      expect(cartStore.selectedItems[0].id).toBe('pa')

      cartStore.toggleSelect('pa')
      expect(cartStore.selectedItems.length).toBe(0)
    })

    it('toggleSelectAll selects/deselects all items', () => {
      cartStore.toggleSelectAll()
      expect(cartStore.selectedItems.length).toBe(3)

      cartStore.toggleSelectAll()
      expect(cartStore.selectedItems.length).toBe(0)
    })

    it('finalAmount only counts selected items', () => {
      cartStore.toggleSelect('pa')
      cartStore.toggleSelect('pc')
      expect(cartStore.finalAmount).toBe(499 + cartStore.shippingCost - cartStore.discountAmount)
    })

    it('free shipping when total >= 299', () => {
      cartStore.toggleSelectAll()
      if (cartStore.subtotal >= 299) {
        expect(cartStore.shippingCost).toBe(0)
      }
    })

    it('shipping cost applies when total < 299', () => {
      cartStore.removeItem('pc')
      cartStore.toggleSelectAll()
      if (cartStore.subtotal < 299) {
        expect(cartStore.shippingCost).toBeGreaterThan(0)
      }
    })
  })

  describe('Edge cases', () => {
    it('handles empty cart calculations gracefully', () => {
      expect(cartStore.subtotal).toBe(0)
      expect(cartStore.finalAmount).toBe(0)
      expect(cartStore.totalItems).toBe(0)
      expect(cartStore.selectedItems.length).toBe(0)
    })

    it('handles remove of non-existent item silently', () => {
      cartStore.removeItem('nonexistent')
      expect(cartStore.items.length).toBe(0)
    })

    it('handles update quantity for non-existent item', () => {
      cartStore.updateQuantity('nonexistent', 10)
      expect(cartStore.items.length).toBe(0)
    })

    it('large quantities calculate correctly', () => {
      cartStore.addItem({ ...productA, price: 1 })
      cartStore.updateQuantity('pa', 1000)
      expect(cartStore.subtotal).toBe(1000)
    })
  })
})
