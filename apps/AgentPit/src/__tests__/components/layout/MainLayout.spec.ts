import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useAppStore } from '@/stores/useAppStore'

vi.mock('@/components/layout/Header.vue', () => ({
  default: {
    name: 'Header',
    template: '<div data-testid="header"></div>',
    emits: ['toggle-sidebar']
  }
}))

vi.mock('@/components/layout/Sidebar.vue', () => ({
  default: {
    name: 'Sidebar',
    template: '<div data-testid="sidebar"></div>'
  }
}))

vi.mock('@/components/layout/Footer.vue', () => ({
  default: {
    name: 'Footer',
    template: '<div data-testid="footer"></div>'
  }
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('MainLayout', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(MainLayout, {
      props,
      slots: {
        default: '<div data-testid="slot-content">测试内容</div>'
      },
      global: {
        stubs: {
          Teleport: { template: '<div><slot /></div>' }
        }
      }
    })
  }

  describe('基础渲染', () => {
    it('应该正确渲染 Header 组件', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="header"]').exists()).toBe(true)
    })

    it('应该正确渲染 Sidebar 组件', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="sidebar"]').exists()).toBe(true)
    })

    it('应该正确渲染 Footer 组件', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="footer"]').exists()).toBe(true)
    })

    it('应该正确渲染插槽内容', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('测试内容')
    })
  })

  describe('侧边栏宽度变化', () => {
    it('sidebarOpen 为 true 时，侧边栏宽度应该为 w-64，主内容区 margin 为 lg:ml-64', () => {
      const appStore = useAppStore()
      appStore.sidebarOpen = true
      const wrapper = createWrapper()
      const allDivs = wrapper.findAll('div')
      const sidebar = allDivs.find(div => div.classes().includes('hidden'))
      const main = wrapper.find('main')
      expect(sidebar?.classes()).toContain('w-64')
      expect(main.classes()).toContain('lg:ml-64')
    })

    it('sidebarOpen 为 false 时，侧边栏宽度应该为 w-16，主内容区 margin 为 lg:ml-16', () => {
      const appStore = useAppStore()
      appStore.sidebarOpen = false
      const wrapper = createWrapper()
      const allDivs = wrapper.findAll('div')
      const sidebar = allDivs.find(div => div.classes().includes('hidden'))
      const main = wrapper.find('main')
      expect(sidebar?.classes()).toContain('w-16')
      expect(main.classes()).toContain('lg:ml-16')
    })
  })

  describe('handleToggleSidebar', () => {
    it('handleToggleSidebar 被调用时，应该调用 appStore.toggleSidebar()', async () => {
      const appStore = useAppStore()
      const toggleSidebarSpy = vi.spyOn(appStore, 'toggleSidebar')
      const wrapper = createWrapper()
      const header = wrapper.findComponent({ name: 'Header' })
      await header.vm.$emit('toggle-sidebar')
      expect(toggleSidebarSpy).toHaveBeenCalledTimes(1)
    })
  })
})
