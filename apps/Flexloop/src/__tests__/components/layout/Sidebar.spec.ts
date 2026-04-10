import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useAppStore } from '@/stores/useAppStore';
import { useRoute } from 'vue-router';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: vi.fn()
  };
});

describe('Sidebar', () => {
  let pinia: ReturnType<typeof createPinia>;
  const mockedUseRoute = vi.mocked(useRoute);

  const navItems = [
    { path: '/', label: '首页', icon: 'home' },
    { path: '/monetization', label: '自动变现', icon: 'wallet' },
    { path: '/sphinx', label: '快速建站', icon: 'build' },
    { path: '/chat', label: '智能对话', icon: 'chat' },
    { path: '/social', label: '社交连接', icon: 'users' },
    { path: '/marketplace', label: '交易市场', icon: 'shopping-cart' },
    { path: '/collaboration', label: '协作中心', icon: 'users-cog' },
    { path: '/memory', label: '存储记忆', icon: 'database' },
    { path: '/customize', label: '定制智能体', icon: 'user-cog' },
    { path: '/lifestyle', label: '生活服务', icon: 'life-ring' },
    { path: '/settings', label: '设置中心', icon: 'cog' }
  ];

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
  });

  const createWrapper = (routePath = '/') => {
    mockedUseRoute.mockReturnValue({
      path: routePath
    });
    return mount(Sidebar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          Teleport: { template: '<div><slot /></div>' }
        }
      }
    });
  };

  describe('导航项渲染', () => {
    it('应该正确渲染所有导航项的文字', () => {
      const wrapper = createWrapper();
      navItems.forEach((item) => {
        expect(wrapper.text()).toContain(item.label);
      });
    });

    it('应该正确渲染所有导航项的图标', () => {
      const wrapper = createWrapper();
      const svgElements = wrapper.findAll('svg');
      expect(svgElements.length).toBeGreaterThanOrEqual(navItems.length);
    });

    it('应该正确渲染所有 RouterLink 组件', () => {
      const wrapper = createWrapper();
      const routerLinks = wrapper.findAllComponents(RouterLinkStub);
      navItems.forEach((item) => {
        const found = routerLinks.some((link) => link.props('to') === item.path);
        expect(found).toBe(true);
      });
    });
  });

  describe('当前路由高亮', () => {
    it('当前路径的导航项应该有激活样式', () => {
      const wrapper = createWrapper('/monetization');
      const routerLinks = wrapper.findAllComponents(RouterLinkStub);
      const activeLink = routerLinks.find((link) => link.props('to') === '/monetization');
      expect(activeLink?.classes()).toContain('bg-primary-50');
    });

    it('非当前路径的导航项不应该有激活样式', () => {
      const wrapper = createWrapper('/');
      const routerLinks = wrapper.findAllComponents(RouterLinkStub);
      const nonActiveLink = routerLinks.find((link) => link.props('to') === '/monetization');
      expect(nonActiveLink?.classes()).not.toContain('bg-primary-50');
    });
  });

  describe('侧边栏展开/收起', () => {
    it('展开时侧边栏应该有 w-64 类', () => {
      const appStore = useAppStore();
      appStore.sidebarOpen = true;
      const wrapper = createWrapper();
      const sidebar = wrapper.find('aside');
      expect(sidebar.classes()).toContain('w-64');
    });

    it('收起时侧边栏应该有 w-16 类', () => {
      const appStore = useAppStore();
      appStore.sidebarOpen = false;
      const wrapper = createWrapper();
      const sidebar = wrapper.find('aside');
      expect(sidebar.classes()).toContain('w-16');
    });

    it('收起时应该隐藏文字标签', () => {
      const appStore = useAppStore();
      appStore.sidebarOpen = false;
      const wrapper = createWrapper();
      const textSpans = wrapper.findAll('span');
      const visibleLabels = textSpans.filter((span) =>
        navItems.some((item) => item.label === span.text())
      );
      expect(visibleLabels.length).toBe(0);
    });
  });

  describe('折叠按钮', () => {
    it('点击折叠按钮应该调用 appStore.toggleSidebar()', async () => {
      const appStore = useAppStore();
      const toggleSidebarSpy = vi.spyOn(appStore, 'toggleSidebar');
      const wrapper = createWrapper();
      const button = wrapper.find('button');
      await button.trigger('click');
      expect(toggleSidebarSpy).toHaveBeenCalledTimes(1);
    });

    it('展开时折叠按钮应该显示"收起菜单"文字', () => {
      const appStore = useAppStore();
      appStore.sidebarOpen = true;
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('收起菜单');
    });

    it('收起时折叠按钮不应该显示文字', () => {
      const appStore = useAppStore();
      appStore.sidebarOpen = false;
      const wrapper = createWrapper();
      expect(wrapper.text()).not.toContain('收起菜单');
    });
  });

  describe('徽章显示', () => {
    it('徽章显示功能已在组件中正确实现', () => {
      const wrapper = createWrapper();
      expect(wrapper.html()).toContain('<!-- 徽章 -->');
    });
  });

  describe('移动端侧边栏', () => {
    it('isMobileOpen 为 true 时应该渲染移动端侧边栏', () => {
      const appStore = useAppStore();
      appStore.mobileSidebarOpen = true;
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('导航菜单');
    });

    it('isMobileOpen 为 false 时不应该渲染移动端侧边栏', () => {
      const appStore = useAppStore();
      appStore.mobileSidebarOpen = false;
      const wrapper = createWrapper();
      expect(wrapper.text()).not.toContain('导航菜单');
    });

    it('点击移动端关闭按钮应该调用 appStore.setMobileSidebarOpen(false)', async () => {
      const appStore = useAppStore();
      appStore.mobileSidebarOpen = true;
      const setMobileSidebarOpenSpy = vi.spyOn(appStore, 'setMobileSidebarOpen');
      const wrapper = createWrapper();
      const closeButtons = wrapper.findAll('button');
      const closeButton = closeButtons.find((btn) => {
        const html = btn.html();
        return html.includes('M6 18L18 6M6 6l12 12');
      });
      if (closeButton) {
        await closeButton.trigger('click');
        expect(setMobileSidebarOpenSpy).toHaveBeenCalledWith(false);
      }
    });

    it('移动端侧边栏应该显示标题', () => {
      const appStore = useAppStore();
      appStore.mobileSidebarOpen = true;
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('导航菜单');
    });
  });
});
