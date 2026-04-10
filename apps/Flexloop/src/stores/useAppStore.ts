import { defineStore } from 'pinia';

interface AppState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
  currentPage: string;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarOpen: true,
    mobileSidebarOpen: false,
    theme: (localStorage.getItem('theme') as AppState['theme']) || 'system',
    isLoading: false,
    currentPage: '/'
  }),

  getters: {
    isDarkTheme: (state): boolean => {
      if (state.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return state.theme === 'dark';
    },

    isSidebarOpen: (state): boolean => state.sidebarOpen,
    isMobileSidebarOpen: (state): boolean => state.mobileSidebarOpen
  },

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },

    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open;
    },

    setMobileSidebarOpen(open: boolean) {
      this.mobileSidebarOpen = open;
    },

    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
    },

    toggleDarkMode() {
      this.theme = this.isDarkTheme ? 'light' : 'dark';
      this.applyTheme();
    },

    setTheme(theme: 'light' | 'dark' | 'system') {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      this.applyTheme();
    },

    applyTheme() {
      const theme = this.theme;
      if (
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setCurrentPage(page: string) {
      this.currentPage = page;
    }
  },

  persist: {
    key: 'agentpit-app-store',
    storage: localStorage,
    pick: ['sidebarOpen', 'theme']
  }
});
