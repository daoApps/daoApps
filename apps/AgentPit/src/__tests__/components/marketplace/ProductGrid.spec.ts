import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductGrid from '@/components/marketplace/ProductGrid.vue'
import type { Product } from '@/types/marketplace'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn()
    })
  }
})

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'GPT-4 智能客服机器人模板',
    description: '基于GPT-4的智能客服解决方案',
    price: 299,
    originalPrice: 499,
    category: '数字产品',
    subCategory: '智能体模板',
    images: ['https://example.com/image1.jpg'],
    rating: 4.9,
    reviewCount: 328,
    salesCount: 1520,
    stock: 999,
    tags: ['hot', 'recommended'],
    seller: {
      id: 's1',
      name: '张明',
      avatar: 'https://example.com/avatar1.jpg',
      storeName: 'AI模板工坊',
      rating: 4.9,
      followerCount: 12580,
      productCount: 45,
      description: '专注AI智能体模板开发',
      isVerified: true
    },
    specs: [
      { label: '适用场景', value: '电商客服、在线咨询' },
      { label: '技术栈', value: 'React + Node.js + OpenAI API' }
    ],
    type: 'digital',
    createdAt: '2024-03-15'
  },
  {
    id: 'p2',
    name: 'AI绘画工作流自动化工具',
    description: '一键式AI绘画工作流',
    price: 199,
    originalPrice: 349,
    category: '数字产品',
    subCategory: '开发工具',
    images: ['https://example.com/image2.jpg'],
    rating: 3.5,
    reviewCount: 256,
    salesCount: 980,
    stock: 999,
    tags: ['new', 'discount'],
    seller: {
      id: 's2',
      name: '李华',
      avatar: 'https://example.com/avatar2.jpg',
      storeName: '智能学院',
      rating: 4.8,
      followerCount: 8920,
      productCount: 32,
      description: '专业AI培训课程',
      isVerified: true
    },
    specs: [
      { label: '支持平台', value: 'SD / MJ / DALL-E' }
    ],
    type: 'digital',
    createdAt: '2024-02-20'
  },
  {
    id: 'p3',
    name: '无折扣商品',
    description: '测试无折扣的商品',
    price: 99,
    category: '数字产品',
    subCategory: '其他',
    images: ['https://example.com/image3.jpg'],
    rating: 4.0,
    reviewCount: 100,
    salesCount: 500,
    stock: 100,
    tags: [],
    seller: {
      id: 's3',
      name: '王五',
      avatar: 'https://example.com/avatar3.jpg',
      storeName: '普通商店',
      rating: 4.5,
      followerCount: 5000,
      productCount: 20,
      description: '普通商品销售',
      isVerified: false
    },
    specs: [],
    type: 'physical',
    createdAt: '2024-01-10'
  }
]

describe('ProductGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (products: Product[] = mockProducts) => {
    return mount(ProductGrid, {
      props: {
        products
      }
    })
  }

  describe('空状态', () => {
    it('products 为空数组时应该显示空状态提示', () => {
      const wrapper = createWrapper([])
      expect(wrapper.text()).toContain('暂无相关商品')
      expect(wrapper.text()).toContain('试试调整筛选条件或搜索其他关键词')
    })
  })

  describe('商品渲染', () => {
    it('应该正确渲染所有商品卡片', () => {
      const wrapper = createWrapper()
      const productCards = wrapper.findAll('[class*="group relative"]')
      expect(productCards.length).toBe(mockProducts.length)
    })

    it('每个商品卡片应该正确显示图片、名称、价格、评分、销量', () => {
      const wrapper = createWrapper()
      const firstProduct = mockProducts[0]!
      const firstCard = wrapper.text()

      expect(firstCard).toContain(firstProduct.name)
      expect(firstCard).toContain(`¥${firstProduct.price}`)
      expect(firstCard).toContain(firstProduct.rating.toString())
      expect(firstCard).toContain(firstProduct.salesCount.toLocaleString())
    })

    it('应该正确显示商品子分类', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain(mockProducts[0]!.subCategory)
    })
  })

  describe('商品标签显示', () => {
    it('应该正确显示新品标签', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('新品')
    })

    it('应该正确显示热销标签', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('热销')
    })

    it('应该正确显示折扣标签', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('折扣')
    })

    it('应该正确显示推荐标签', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('推荐')
    })
  })

  describe('折扣显示', () => {
    it('有 originalPrice 的商品应该显示折扣百分比', () => {
      const wrapper = createWrapper()
      const firstProduct = mockProducts[0]!
      const discount = Math.round((1 - firstProduct.price / firstProduct.originalPrice!) * 100
      expect(wrapper.text()).toContain(`-${discount}%`)
    })

    it('没有 originalPrice 的商品不应该显示折扣', () => {
      const wrapper = createWrapper([mockProducts[2]!])
      expect(wrapper.text()).not.toContain('%')
    })
  })

  describe('收藏功能', () => {
    it('点击收藏按钮应该切换收藏状态并触发 toggleFavorite 事件', async () => {
      const wrapper = createWrapper()
      const productId = mockProducts[0]!.id

      const favoriteButtons = wrapper.findAll('button').filter(btn =>
        btn.html().includes('M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z')
      )

      await favoriteButtons[0]!.trigger('click')
      expect(wrapper.emitted('toggleFavorite')).toBeTruthy()
      expect(wrapper.emitted('toggleFavorite')?.[0]).toEqual([productId])

      await favoriteButtons[0]!.trigger('click')
      expect(wrapper.emitted('toggleFavorite')?.[1]).toEqual([productId])
    })
  })

  describe('添加购物车', () => {
    it('点击购物车按钮应该触发 addToCart 事件且参数正确', async () => {
      const wrapper = createWrapper()
      const firstProduct = mockProducts[0]!

      const cartButtons = wrapper.findAll('button').filter(btn =>
        btn.html().includes('M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z')
      )

      await cartButtons[0]!.trigger('click')
      expect(wrapper.emitted('addToCart')).toBeTruthy()
      expect(wrapper.emitted('addToCart')?.[0]?.[0]?.id).toBe(firstProduct.id)
    })
  })

  describe('商品导航', () => {
    it('点击商品卡片应该调用 router.push 导航到正确路径', async () => {
      const { useRouter } = await import('vue-router')
      const mockPush = vi.mocked(useRouter().push)

      const wrapper = createWrapper()
      const firstProduct = mockProducts[0]!
      const productCards = wrapper.findAll('[class*="group relative"]')

      await productCards[0]!.trigger('click')
      expect(mockPush).toHaveBeenCalledWith(`/marketplace/product/${firstProduct.id}`)
    })
  })

  describe('星星评分', () => {
    it('评分 4.9 应该渲染 5 颗黄色星星', () => {
      const wrapper = createWrapper([mockProducts[0]!])
      const stars = wrapper.findAll('svg').filter(svg =>
        svg.html().includes('M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461