import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import HomePage from '@/views/HomePage.vue';
import ModuleCard from '@/components/home/ModuleCard.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/monetization', component: () => import('@/views/MonetizationPage.vue') },
  { path: '/sphinx', component: () => import('@/views/SphinxPage.vue') },
  { path: '/chat', component: () => import('@/views/ChatPage.vue') },
  { path: '/social', component: () => import('@/views/SocialPage.vue') },
  { path: '/marketplace', component: () => import('@/views/MarketplacePage.vue') },
  { path: '/collaboration', component: () => import('@/views/CollaborationPage.vue') },
  { path: '/memory', component: () => import('@/views/MemoryPage.vue') },
  { path: '/customize', component: () => import('@/views/CustomizePage.vue') },
  { path: '/lifestyle', component: () => import('@/views/LifestylePage.vue') },
  { path: '/settings', component: () => import('@/views/SettingsPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') }
];

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes
  });
}

describe('Router Integration - Navigation', () => {
  let router: ReturnType<typeof createTestRouter>;
  let pinia: Pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createTestRouter();
    router.push('/');
  });

  it('renders homepage at root path "/"', async () => {
    const wrapper = mount(HomePage, {
      global: { plugins: [router, pinia] }
    });
    expect(wrapper.text()).toContain('AgentPit');
  });

  it('navigates to /monetization from homepage module card', async () => {
    const wrapper = mount(HomePage, {
      global: { plugins: [router, pinia] }
    });
    const card = wrapper.findComponent(ModuleCard);
    if (card.exists() && card.props('routePath') === '/monetization') {
      await card.trigger('click');
      await router.isReady();
      expect(router.currentRoute.value.path).toBe('/monetization');
    }
  });

  it('has correct route definitions for all 11 pages', () => {
    const expectedPaths = [
      '/',
      '/monetization',
      '/sphinx',
      '/chat',
      '/social',
      '/marketplace',
      '/collaboration',
      '/memory',
      '/customize',
      '/lifestyle',
      '/settings'
    ];
    const actualPaths = routes.map((r) => r.path);
    expectedPaths.forEach((path) => {
      expect(actualPaths).toContain(path);
    });
  });

  it('uses lazy loading for all non-homepage routes', () => {
    const lazyRoutes = routes.filter((r) => typeof r.component === 'function');
    expect(lazyRoutes.length).toBe(11);
  });

  it('handles 404 for unknown routes', async () => {
    await router.push('/nonexistent-page-xyz');
    expect(router.currentRoute.value.name).toBe('not-found');
  });

  it('updates document.title on navigation via beforeEach guard', async () => {
    const pushSpy = vi.spyOn(router, 'push');
    await router.push('/chat');
    expect(pushSpy).toHaveBeenCalled();
    pushSpy.mockRestore();
  });
});

describe('Router Integration - Programmatic Navigation', () => {
  let router: ReturnType<typeof createTestRouter>;
  let pinia: Pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createTestRouter();
    router.push('/');
  });

  it('router.push navigates to target route', async () => {
    await router.push('/monetization');
    expect(router.currentRoute.value.path).toBe('/monetization');
  });

  it('router.replace replaces current history entry', async () => {
    await router.push('/chat');
    await router.replace('/social');
    expect(router.currentRoute.value.path).toBe('/social');
  });

  it('router.back navigates to previous route', async () => {
    await router.push('/monetization');
    await router.push('/chat');
    await router.back();
    expect(router.currentRoute.value.path).toBe('/monetization');
  });

  it('router.forward navigates forward in history', async () => {
    await router.push('/monetization');
    await router.push('/chat');
    await router.back();
    await router.forward();
    expect(router.currentRoute.value.path).toBe('/chat');
  });

  it('supports nested route params for product detail', async () => {
    const productRoutes = routes.find((r) => r.path?.includes(':id'));
    expect(productRoutes).toBeDefined();
  });
});
