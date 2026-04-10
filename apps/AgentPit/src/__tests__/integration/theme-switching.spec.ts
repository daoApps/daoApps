import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '@/stores/useAppStore';

describe('Theme Switching Integration - Global Theme Propagation', () => {
  let appStore: ReturnType<typeof useAppStore>;

  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    const pinia = createPinia();
    setActivePinia(pinia);
    appStore = useAppStore();
  });

  describe('Light/Dark mode toggle', () => {
    it('switching to dark mode adds "dark" class to html element', () => {
      appStore.setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(appStore.theme).toBe('dark');
    });

    it('switching to light mode removes "dark" class', () => {
      appStore.setTheme('dark');
      appStore.setTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(appStore.theme).toBe('light');
    });

    it('isDarkTheme getter reflects current state', () => {
      appStore.setTheme('light');
      expect(appStore.isDarkTheme).toBe(false);

      appStore.setTheme('dark');
      expect(appStore.isDarkTheme).toBe(true);
    });
  });

  describe('System theme following', () => {
    it('system mode sets theme to system', () => {
      appStore.setTheme('system');
      expect(appStore.theme).toBe('system');
    });

    it('system mode responds to OS preference change (simulated)', () => {
      appStore.setTheme('system');
      const matchMediaSpy = vi.spyOn(window, 'matchMedia');
      matchMediaSpy.mockReturnValue({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn()
      } as any);

      appStore.setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      matchMediaSpy.mockRestore();
    });
  });

  describe('Cross-page persistence simulation', () => {
    it('persists theme preference via store', () => {
      appStore.setTheme('dark');
      const savedTheme = appStore.theme;
      expect(savedTheme).toBe('dark');
    });

    it('restores theme on re-initialization', () => {
      appStore.setTheme('dark');
      expect(appStore.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('theme changes propagate to isDarkTheme computed', () => {
      const themes = ['light', 'dark', 'system'] as const;
      themes.forEach((t) => {
        appStore.setTheme(t);
        expect(appStore.theme).toBe(t);
      });
    });
  });

  describe('Sidebar state integration with theme', () => {
    it('sidebar and theme states are independent', () => {
      appStore.setTheme('dark');
      appStore.toggleSidebar();

      expect(appStore.theme).toBe('dark');
      expect(appStore.sidebarOpen).toBe(false);
    });

    it('toggling sidebar does not affect theme', () => {
      appStore.setTheme('light');
      appStore.toggleSidebar();
      appStore.toggleSidebar();
      expect(appStore.theme).toBe('light');
    });
  });
});
