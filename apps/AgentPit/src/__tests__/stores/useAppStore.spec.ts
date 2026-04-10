import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '@/stores/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('State', () => {
    it('should have correct initial state', () => {
      const store = useAppStore();

      expect(store.sidebarOpen).toBe(true);
      expect(store.theme).toBe('system');
      expect(store.isLoading).toBe(false);
      expect(store.currentPage).toBe('/');
    });
  });

  describe('Getters', () => {
    it('isSidebarOpen should return sidebarOpen state', () => {
      const store = useAppStore();

      expect(store.isSidebarOpen).toBe(true);

      store.sidebarOpen = false;
      expect(store.isSidebarOpen).toBe(false);
    });

    it('isDarkTheme should work correctly with different themes', () => {
      const store = useAppStore();

      // 测试 system 模式
      store.theme = 'system';
      // 注意：这个 getter 依赖于 window.matchMedia
      expect(typeof store.isDarkTheme).toBe('boolean');

      // 测试 dark 模式
      store.theme = 'dark';
      expect(store.isDarkTheme).toBe(true);

      // 测试 light 模式
      store.theme = 'light';
      expect(store.isDarkTheme).toBe(false);
    });
  });

  describe('Actions', () => {
    it('toggleSidebar should toggle sidebarOpen state', () => {
      const store = useAppStore();

      expect(store.sidebarOpen).toBe(true);

      store.toggleSidebar();
      expect(store.sidebarOpen).toBe(false);

      store.toggleSidebar();
      expect(store.sidebarOpen).toBe(true);
    });

    it('setSidebarOpen should set specific value', () => {
      const store = useAppStore();

      store.setSidebarOpen(false);
      expect(store.sidebarOpen).toBe(false);

      store.setSidebarOpen(true);
      expect(store.sidebarOpen).toBe(true);
    });

    it('setTheme should update theme and apply to document', () => {
      const store = useAppStore();

      store.setTheme('dark');
      expect(store.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      store.setTheme('light');
      expect(store.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('setLoading should update isLoading state', () => {
      const store = useAppStore();

      store.setLoading(true);
      expect(store.isLoading).toBe(true);

      store.setLoading(false);
      expect(store.isLoading).toBe(false);
    });

    it('setCurrentPage should update currentPage state', () => {
      const store = useAppStore();

      store.setCurrentPage('/chat');
      expect(store.currentPage).toBe('/chat');

      store.setCurrentPage('/settings');
      expect(store.currentPage).toBe('/settings');
    });
  });
});
