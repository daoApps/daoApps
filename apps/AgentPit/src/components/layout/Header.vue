<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAppStore } from '../../stores/useAppStore';

/**
 * Header 组件 Props 接口
 * @interface Props
 */
interface Props {
  /**
   * Logo 显示的文字
   * @default 'AgentPit'
   */
  logoText?: string;
  /**
   * 是否显示搜索框
   * @default true
   */
  showSearch?: boolean;
  /**
   * 是否显示通知图标
   * @default true
   */
  showNotifications?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  logoText: 'AgentPit',
  showSearch: true,
  showNotifications: true
});

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void;
  (e: 'search', query: string): void;
}>();

const route = useRoute();
const appStore = useAppStore();
const searchQuery = ref('');
const isUserMenuOpen = ref(false);

const navItems = [
  { path: '/', label: '首页' },
  { path: '/monetization', label: '自动变现' },
  { path: '/sphinx', label: '快速建站' },
  { path: '/chat', label: '智能对话' },
  { path: '/social', label: '社交连接' },
  { path: '/marketplace', label: '交易市场' }
];

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }
};

const toggleSidebar = () => {
  emit('toggle-sidebar');
  if (window.innerWidth < 1024) {
    appStore.toggleMobileSidebar();
  }
};
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200"
  >
    <div class="h-full px-4 flex items-center justify-between">
      <!-- 左侧：Logo + 移动端菜单按钮 -->
      <div class="flex items-center gap-3">
        <!-- 汉堡菜单按钮（移动端显示） -->
        <button
          class="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="切换侧边栏"
          @click="toggleSidebar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div
            class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow"
          >
            AP
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {{ logoText }}
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">智能体协作平台</p>
          </div>
        </RouterLink>
      </div>

      <!-- 中间：导航菜单（桌面端） -->
      <nav class="hidden lg:flex items-center gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          :class="[
            route.path === item.path
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- 右侧：搜索 + 通知 + 用户 -->
      <div class="flex items-center gap-3">
        <!-- 搜索框 -->
        <div v-if="showSearch" class="hidden md:flex items-center relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索..."
            class="w-48 lg:w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            @keyup.enter="handleSearch"
          />
          <svg
            class="absolute left-3 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- 通知图标 -->
        <button
          v-if="showNotifications"
          class="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="通知"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- 主题切换按钮 -->
        <button
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="切换主题"
          @click="appStore.toggleDarkMode()"
        >
          <svg
            v-if="!appStore.isDarkTheme"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        <!-- 用户头像和下拉菜单 -->
        <div class="relative">
          <button
            class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
            >
              U
            </div>
            <span class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300"
              >用户</span
            >
            <svg
              class="hidden md:block w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- 下拉菜单（使用 Teleport） -->
          <Teleport to="body">
            <Transition name="dropdown">
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                @click.stop
              >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >个人资料</a
                >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >账户设置</a
                >
                <hr class="my-2 border-gray-200 dark:border-gray-700" />
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >退出登录</a
                >
              </div>
            </Transition>
          </Teleport>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
