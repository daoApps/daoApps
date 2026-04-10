import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/useUserStore';
import type { UserProfile } from '@/types/user';

describe('useUserStore', () => {
  const mockUserProfile: UserProfile = {
    nickname: 'TestUser',
    realName: 'Test User',
    gender: 'male',
    birthday: '1990-01-01',
    location: 'Beijing',
    email: 'test@example.com',
    phone: '13800138000',
    bio: 'This is a test user',
    interests: ['coding', 'reading'],
    avatar: '/test-avatar.png',
    socialAccounts: {
      wechat: { bound: false },
      qq: { bound: false },
      weibo: { bound: false },
      github: { bound: true, username: 'testuser' }
    }
  };

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('State', () => {
    it('should have correct initial state', () => {
      const store = useUserStore();

      expect(store.profile).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.themeSettings.mode).toBe('system');
      expect(store.themeSettings.primaryColor).toBe('#6366f1');
      expect(store.notifications).toBe(0);
    });
  });

  describe('Getters', () => {
    it('userName should return nickname or "访客"', () => {
      const store = useUserStore();

      expect(store.userName).toBe('访客');

      store.login(mockUserProfile);
      expect(store.userName).toBe('TestUser');
    });

    it('userAvatar should return avatar or default path', () => {
      const store = useUserStore();

      expect(store.userAvatar).toBe('/default-avatar.png');

      store.login(mockUserProfile);
      expect(store.userAvatar).toBe('/test-avatar.png');
    });
  });

  describe('Actions', () => {
    it('login should set profile and isAuthenticated', () => {
      const store = useUserStore();

      store.login(mockUserProfile);

      expect(store.profile).toEqual(mockUserProfile);
      expect(store.isAuthenticated).toBe(true);
    });

    it('logout should clear profile and authentication', () => {
      const store = useUserStore();

      store.login(mockUserProfile);
      expect(store.isAuthenticated).toBe(true);

      store.logout();

      expect(store.profile).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it('updateProfile should merge updates into existing profile', () => {
      const store = useUserStore();

      store.login(mockUserProfile);
      store.updateProfile({ nickname: 'UpdatedName', bio: 'Updated bio' });

      expect(store.profile?.nickname).toBe('UpdatedName');
      expect(store.profile?.bio).toBe('Updated bio');
      // 其他字段应保持不变
      expect(store.profile?.email).toBe('test@example.com');
    });

    it('updateProfile should not throw if no profile exists', () => {
      const store = useUserStore();

      expect(() => {
        store.updateProfile({ nickname: 'Test' });
      }).not.toThrow();
    });

    it('updateThemeSettings should merge theme settings', () => {
      const store = useUserStore();

      store.updateThemeSettings({ mode: 'dark', fontSize: 'large' });

      expect(store.themeSettings.mode).toBe('dark');
      expect(store.themeSettings.fontSize).toBe('large');
      // 其他设置应保持不变
      expect(store.themeSettings.primaryColor).toBe('#6366f1');
    });

    it('setNotificationCount should set notification count', () => {
      const store = useUserStore();

      store.setNotificationCount(5);
      expect(store.notifications).toBe(5);

      store.setNotificationCount(0);
      expect(store.notifications).toBe(0);
    });

    it('incrementNotification should increase notification count by 1', () => {
      const store = useUserStore();

      expect(store.notifications).toBe(0);

      store.incrementNotification();
      expect(store.notifications).toBe(1);

      store.incrementNotification();
      expect(store.notifications).toBe(2);
    });

    it('clearNotifications should reset notification count to 0', () => {
      const store = useUserStore();

      store.setNotificationCount(10);
      expect(store.notifications).toBe(10);

      store.clearNotifications();
      expect(store.notifications).toBe(0);
    });
  });
});
