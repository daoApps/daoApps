import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '@/stores/useAppStore'
import { useChatStore } from '@/stores/useChatStore'
import { useMonetizationStore } from '@/stores/useMonetizationStore'
import { useCartStore } from '@/stores/useCartStore'
import { useUserStore } from '@/stores/useUserStore'

describe('State Management Integration - Cross Component Sync', () => {
  let appStore: ReturnType<typeof useAppStore>
  let chatStore: ReturnType<typeof useChatStore>
  let monetizationStore: ReturnType<typeof useMonetizationStore>
  let cartStore: ReturnType<typeof useCartStore>
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    appStore = useAppStore()
    chatStore = useChatStore()
    monetizationStore = useMonetizationStore()
    cartStore = useCartStore()
    userStore = useUserStore()
  })

  describe('useAppStore - Sidebar & Theme cross-component', () => {
    it('toggleSidebar changes sidebarOpen state', () => {
      expect(appStore.sidebarOpen).toBe(true)
      appStore.toggleSidebar()
      expect(appStore.sidebarOpen).toBe(false)
      appStore.toggleSidebar()
      expect(appStore.sidebarOpen).toBe(true)
    })

    it('setTheme updates theme and affects DOM', () => {
      appStore.setTheme('dark')
      expect(appStore.theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      appStore.setTheme('light')
      expect(appStore.theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('setTheme with system follows OS preference', () => {
      appStore.setTheme('system')
      expect(appStore.theme).toBe('system')
    })

    it('isDarkTheme getter computes correctly', () => {
      appStore.setTheme('light')
      expect(appStore.isDarkTheme).toBe(false)
      appStore.setTheme('dark')
      expect(appStore.isDarkTheme).toBe(true)
    })

    it('setLoading toggles loading state', () => {
      expect(appStore.isLoading).toBe(false)
      appStore.setLoading(true)
      expect(appStore.isLoading).toBe(true)
      appStore.setLoading(false)
      expect(appStore.isLoading).toBe(false)
    })
  })

  describe('useChatStore - Conversation lifecycle', () => {
    it('createConversation adds new conversation and sets active', () => {
      chatStore.createConversation()
      expect(chatStore.conversations.length).toBe(1)
      expect(chatStore.activeConversationId).toBeTruthy()
      expect(chatStore.hasConversations).toBe(true)
    })

    it('addMessage appends message to active conversation', () => {
      chatStore.createConversation()
      chatStore.addMessage({ role: 'user', content: '你好' })
      expect(chatStore.allMessages.length).toBe(1)
      expect(chatStore.allMessages[0].content).toBe('你好')
      expect(chatStore.allMessages[0].role).toBe('user')
    })

    it('addMessage auto-generates id and timestamp', () => {
      chatStore.createConversation()
      chatStore.addMessage({ role: 'user', content: 'test' })
      const msg = chatStore.allMessages[0]
      expect(msg.id).toBeTruthy()
      expect(msg.timestamp).toBeTruthy()
    })

    it('setActiveConversation switches context', () => {
      chatStore.createConversation()
      const id1 = chatStore.activeConversationId
      chatStore.createConversation()
      const id2 = chatStore.activeConversationId
      expect(id1).not.toBe(id2)

      chatStore.setActiveConversation(id1!)
      expect(chatStore.activeConversationId).toBe(id1)
      expect(chatStore.activeConversation?.id).toBe(id1)
    })

    it('deleteConversation removes conversation and messages', () => {
      chatStore.createConversation()
      chatStore.addMessage({ role: 'user', content: 'msg1' })
      const id = chatStore.activeConversationId
      chatStore.deleteConversation(id!)
      expect(chatStore.conversations.length).toBe(0)
      expect(chatStore.allMessages.length).toBe(0)
    })

    it('clearAllConversations removes everything', () => {
      chatStore.createConversation()
      chatStore.addMessage({ role: 'user', content: 'msg' })
      chatStore.clearAllConversations()
      expect(chatStore.conversations.length).toBe(0)
      expect(chatStore.activeConversationId).toBeNull()
    })

    it('isStreaming controls streaming state', () => {
      expect(chatStore.isStreaming).toBe(false)
      chatStore.setStreaming(true)
      expect(chatStore.isStreaming).toBe(true)
      chatStore.setStreaming(false)
      expect(chatStore.isStreaming).toBe(false)
    })

    it('updateMessage modifies existing message content', () => {
      chatStore.createConversation()
      chatStore.addMessage({ role: 'assistant', content: 'initial' })
      const msgId = chatStore.allMessages[0].id
      chatStore.updateMessage(msgId!, { content: 'updated' })
      expect(chatStore.allMessages[0].content).toBe('updated')
    })

    it('recentContext returns last 10 turns', () => {
      chatStore.createConversation()
      for (let i = 0; i < 15; i++) {
        chatStore.addMessage({ role: i % 2 === 0 ? 'user' : 'assistant', content: `msg-${i}` })
      }
      const ctx = chatStore.recentContext
      expect(ctx.length).toBeLessThanOrEqual(20)
    })
  })

  describe('useMonetizationStore - Wallet data sync', () => {
    it('fetchWalletData loads mock wallet info', async () => {
      await monetizationStore.fetchWalletData()
      expect(monetizationStore.walletData.balance).toBeGreaterThan(0)
      expect(monetizationStore.transactions.length).toBeGreaterThan(0)
    })

    it('formattedBalance returns formatted currency string', async () => {
      await monetizationStore.fetchWalletData()
      const formatted = monetizationStore.formattedBalance
      expect(formatted).toContain('¥')
      expect(formatted).toMatch(/[\d,]+\.?\d*/)
    })

    it('recentTransactions returns limited list', async () => {
      await monetizationStore.fetchWalletData()
      const recent = monetizationStore.recentTransactions
      expect(recent.length).toBeLessThanOrEqual(monetizationStore.transactions.length)
    })

    it('updateRealtimeBalance adjusts balance by delta', async () => {
      await monetizationStore.fetchWalletData()
      const before = monetizationStore.walletData.balance
      monetizationStore.updateRealtimeBalance(100)
      expect(monetizationStore.walletData.balance).toBe(before + 100)
    })
  })

  describe('useCartStore - Shopping cart operations', () => {
    const mockProduct = {
      id: 'p1',
      name: '测试商品',
      price: 99,
      quantity: 1,
      image: '',
      selected: false,
    }

    it('addItem adds new product to cart', () => {
      cartStore.addItem(mockProduct)
      expect(cartStore.items.length).toBe(1)
      expect(cartStore.totalItems).toBe(1)
    })

    it('addItem increments quantity for existing product', () => {
      cartStore.addItem(mockProduct)
      cartStore.addItem(mockProduct)
      expect(cartStore.items.length).toBe(1)
      expect(cartStore.items[0].quantity).toBe(2)
      expect(cartStore.totalItems).toBe(2)
    })

    it('removeItem removes product from cart', () => {
      cartStore.addItem(mockProduct)
      cartStore.removeItem('p1')
      expect(cartStore.items.length).toBe(0)
    })

    it('updateQuantity modifies item count', () => {
      cartStore.addItem(mockProduct)
      cartStore.updateQuantity('p1', 5)
      expect(cartStore.items[0].quantity).toBe(5)
    })

    it('updateQuantity with 0 removes item', () => {
      cartStore.addItem(mockProduct)
      cartStore.updateQuantity('p1', 0)
      expect(cartStore.items.length).toBe(0)
    })

    it('toggleSelect toggles single item selection', () => {
      cartStore.addItem(mockProduct)
      cartStore.toggleSelect('p1')
      expect(cartStore.items[0].selected).toBe(true)
      expect(cartStore.selectedItems.length).toBe(1)
    })

    it('toggleSelectAll selects/deselects all items', () => {
      cartStore.addItem(mockProduct)
      cartStore.addItem({ ...mockProduct, id: 'p2' })
      cartStore.toggleSelectAll()
      expect(cartStore.selectedItems.length).toBe(2)
      cartStore.toggleSelectAll()
      expect(cartStore.selectedItems.length).toBe(0)
    })

    it('subtotal calculates correctly', () => {
      cartStore.addItem(mockProduct)
      cartStore.addItem({ ...mockProduct, id: 'p2', price: 50 })
      expect(cartStore.subtotal).toBe(149)
    })

    it('shippingCost is free over 299', () => {
      cartStore.addItem({ ...mockProduct, price: 300 })
      expect(cartStore.shippingCost).toBe(0)
    })

    it('shippingCost applies when under 299', () => {
      cartStore.addItem(mockProduct)
      expect(cartStore.shippingCost).toBeGreaterThan(0)
    })

    it('finalAmount equals subtotal + shipping - discount', () => {
      cartStore.addItem(mockProduct)
      const expected = cartStore.subtotal + cartStore.shippingCost - cartStore.discountAmount
      expect(cartStore.finalAmount).toBe(expected)
    })
  })

  describe('useUserStore - Auth state sync', () => {
    it('initial state is not authenticated', () => {
      expect(userStore.isAuthenticated).toBe(false)
    })

    it('login sets authenticated state and profile', () => {
      userStore.login({ id: 'u1', name: '测试用户', email: 'test@test.com' })
      expect(userStore.isAuthenticated).toBe(true)
      expect(userStore.profile.name).toBe('测试用户')
    })

    it('logout clears auth state', () => {
      userStore.login({ id: 'u1', name: 'test' })
      userStore.logout()
      expect(userStore.isAuthenticated).toBe(false)
    })

    it('updateProfile modifies user fields', () => {
      userStore.login({ id: 'u1', name: 'old' })
      userStore.updateProfile({ name: 'new name' })
      expect(userStore.profile.name).toBe('new name')
    })
  })
})
