import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Header from '@/components/layout/Header.vue';
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

describe('Header', () => {
  let pinia: ReturnType<typeof createPinia>;
  const mockedUseRoute = vi.mocked(useRoute);

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
  });

  const createWrapper = (props = {}, routePath = '/') => {
    mockedUseRoute.mockReturnValue({
      path: routePath
    });
    return mount(Header, {
      props,
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          Teleport: { template: '<div><slot /></div>' }
        }
      }
    });
  };

  describe('基础渲染', () => {
    it('应该正确渲染 Logo', () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('AgentPit');
      expect(wrapper.text()).toContain('智能体协作平台');
    });

    it('应该正确渲染导航菜单', () => {
      const wrapper = createWrapper();
      const navItems = [
        { path: '/', label: '首页' },
        { path: '/monetization', label: '自动变现' },
        { path: '/sphinx', label: '快速建站' },
        { path: '/chat', label: '智能对话' },
        { path: '/social', label: '社交连接' },
        { path: '/marketplace', label: '交易市场' }
      ];
      navItems.forEach((item) => {
        expect(wrapper.text()).toContain(item.label);
      });
    });

    it('应该正确渲染搜索框', () => {
      const wrapper = createWrapper();
      const searchInput = wrapper.find('input[type="text"]');
      expect(searchInput.exists()).toBe(true);
      expect(searchInput.attributes('placeholder')).toBe('搜索...');
    });

    it('应该正确渲染通知图标', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('[aria-label="通知"]').exists()).toBe(true);
    });

    it('应该正确渲染主题切换按钮', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('[aria-label="切换主题"]').exists()).toBe(true);
    });

    it('应该正确渲染用户头像', () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('用户');
    });
  });

  describe('Props 传递', () => {
    it('应该支持自定义 logoText', () => {
      const wrapper = createWrapper({ logoText: '自定义Logo' });
      expect(wrapper.text()).toContain('自定义Logo');
    });

    it('应该可以隐藏搜索框', () => {
      const wrapper = createWrapper({ showSearch: false });
      expect(wrapper.find('input[type="text"]').exists()).toBe(false);
    });

    it('应该可以隐藏通知图标', () => {
      const wrapper = createWrapper({ showNotifications: false });
      expect(wrapper.find('[aria-label="通知"]').exists()).toBe(false);
    });
  });

  describe('导航菜单', () => {
    it('当前路由应该有高亮样式', () => {
      const wrapper = createWrapper({}, '/monetization');
      const navLinks = wrapper.findAllComponents(RouterLinkStub);
      const activeLink = navLinks.find((link) => link.props('to') === '/monetization');
      expect(activeLink?.classes()).toContain('bg-primary-50');
    });

    it('非当前路由不应该有高亮样式', () => {
      const wrapper = createWrapper({}, '/');
      const navLinks = wrapper.findAllComponents(RouterLinkStub);
      const nonActiveLink = navLinks.find((link) => link.props('to') === '/monetization');
      expect(nonActiveLink?.classes()).not.toContain('bg-primary-50');
    });
  });

  describe('搜索功能', () => {
    it('应该正确处理搜索输入', async () => {
      const wrapper = createWrapper();
      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue('测试搜索');
      expect(searchInput.element.value).toBe('测试搜索');
    });

    it('按下 Enter 键应该触发 search 事件', async () => {
      const wrapper = createWrapper();
      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue('测试搜索');
      await searchInput.trigger('keyup.enter');
      expect(wrapper.emitted('search')).toBeTruthy();
      expect(wrapper.emitted('search')?.[0]).toEqual(['测试搜索']);
    });

    it('空搜索不应该触发 search 事件', async () => {
      const wrapper = createWrapper();
      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue('   ');
      await searchInput.trigger('keyup.enter');
      expect(wrapper.emitted('search')).toBeFalsy();
    });
  });

  describe('主题切换功能', () => {
    it('点击主题切换按钮应该调用 appStore.toggleDarkMode()', async () => {
      const appStore = useAppStore();
      const toggleDarkModeSpy = vi.spyOn(appStore, 'toggleDarkMode');
      const wrapper = createWrapper();
      const themeButton = wrapper.find('[aria-label="切换主题"]');
      await themeButton.trigger('click');
      expect(toggleDarkModeSpy).toHaveBeenCalledTimes(1);
    });

    it('浅色模式应该显示月亮图标', () => {
      const appStore = useAppStore();
      appStore.theme = 'light';
      const wrapper = createWrapper();
      expect(wrapper.html()).toContain('M20.354 15.354');
    });

    it('深色模式应该显示太阳图标', () => {
      const appStore = useAppStore();
      appStore.theme = 'dark';
      const wrapper = createWrapper();
      expect(wrapper.html()).toContain('M12 3v1');
    });
  });

  describe('用户菜单', () => {
    it('点击头像应该展开用户菜单', async () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).not.toContain('个人资料');
      const allButtons = wrapper.findAll('button');
      const userButton = allButtons.find((btn) => btn.text().includes('用户'));
      if (userButton) {
        await userButton.trigger('click');
        expect(wrapper.text()).toContain('个人资料');
        expect(wrapper.text()).toContain('账户设置');
        expect(wrapper.text()).toContain('退出登录');
      }
    });
  });

  describe('移动端菜单按钮', () => {
    it('点击汉堡菜单应该触发 toggle-sidebar 事件', async () => {
      const wrapper = createWrapper();
      const menuButton = wrapper.find('[aria-label="切换侧边栏"]');
      await menuButton.trigger('click');
      expect(wrapper.emitted('toggle-sidebar')).toBeTruthy();
    });

    it('点击汉堡菜单在移动端应该调用 appStore.toggleMobileSidebar()', async () => {
      const appStore = useAppStore();
      const toggleMobileSidebarSpy = vi.spyOn(appStore, 'toggleMobileSidebar');
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      });
      const wrapper = createWrapper();
      const menuButton = wrapper.find('[aria-label="切换侧边栏"]');
      await menuButton.trigger('click');
      expect(toggleMobileSidebarSpy).toHaveBeenCalledTimes(1);
    });
  });
});
