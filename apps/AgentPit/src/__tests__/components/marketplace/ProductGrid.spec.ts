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
    price: 9