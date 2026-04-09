import { defineStore } from 'pinia'
import type { UserProfile, ThemeSettings } from '@/types/user'

interface UserState {
  profile: UserProfile | null
  isAuthenticated: boolean
  themeSettings: ThemeSettings
  notifications: number
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    isAuthenticated: false,
    themeSettings: {
      mode: 'system',
      primaryColor: '#6366f1',
      fontSize: 'medium',
      layoutDensity: 'comfortable',
      sidebarMode: 'auto',
      reduceMotion: false
    },
    notifications: 0
  }),

  getters: {
    userName: (state): string => state.profile?.nickname || '访客',
    userAvatar: (state): string => state.profile?.avatar || '/default-avatar.png'
  },

  actions: {
    login(profile: UserProfile) {
      this.profile = profile
      this.isAuthenticated = true
    },

    logout() {
      this.profile = null
      this.isAuthenticated = false
      localStorage.removeItem('agentpit-user')
    },

    updateProfile(updates: Partial<UserProfile>) {
      if (this.profile) {
        Object.assign(this.profile, updates)
      }
    },

    updateThemeSettings(settings: Partial<ThemeSettings>) {
      Object.assign(this.themeSettings, settings)
    },

    setNotificationCount(count: number) {
      this.notifications = count
    },

    incrementNotification() {
      this.notifications++
    },

    clearNotifications() {
      this.notifications = 0
    }
  },

  persist: {
    key: 'agentpit-user-store',
    storage: localStorage,
    pick: ['themeSettings']
  }
})
