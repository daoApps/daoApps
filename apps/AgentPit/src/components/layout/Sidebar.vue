/**
 * Sidebar 组件 - 应用侧边栏导航
 * 
 * @description 提供应用的导航菜单，支持展开/收起状态，包含桌面端和移动端两种显示模式
 * 
 * @component
 * 
 * @example
 * <Sidebar />
 * 
 * @slot default - 默认插槽，未使用
 * 
 * @dependencies 
 * - useAppStore - 应用全局状态管理
 * - vue-router - 路由相关功能
 */

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAppStore } from '../../stores/useAppStore'

/**
 * 导航项接口
 * @interface NavItem
 */
interface NavItem {
  /**
   * 导航路径
   */
  path: string
  /**
   * 导航标签文字
   */
  label: string
  /**
   * 图标名称
   */
  icon: string
  /**
   * 徽章数字（可选）
   */
  badge?: number
}

const navItems: NavItem[] = [
  { path: '/', label: '首页', icon: 'home', badge: undefined },
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
]

const route = useRoute()
const appStore = useAppStore()

const isExpanded = computed(() => appStore.sidebarOpen)
const isMobileOpen = computed(() => appStore.isMobileSidebarOpen)

const getIconPath = (iconName: string): string => {
  const icons: Record<string, string> = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    wallet: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    build: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    'shopping-cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    'users-cog': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    'user-cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'life-ring': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    cog: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
  return icons[iconName] || icons.home
}
</script>

<template>
  <!-- 桌面端侧边栏 -->
  <aside
    class="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-30"
    :class="isExpanded ? 'w-64' : 'w-16'"
  >
    <nav class="flex-1 overflow-y-auto py-4 px-2">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative"
            :class="[
              route.path === item.path
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
            ]"
          >
            <!-- 当前激活项指示器 -->
            <div
              v-if="route.path === item.path && !isExpanded"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full"
            ></div>

            <!-- 图标 -->
            <svg
              class="flex-shrink-0 w-5 h-5 transition-colors"
              :class="route.path === item.path ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(item.icon)" />
            </svg>

            <!-- 文字标签（展开时显示） -->
            <Transition name="fade">
              <span v-if="isExpanded" class="whitespace-nowrap">{{ item.label }}</span>
            </Transition>

            <!-- 徽章 -->
            <Transition name="fade">
              <span
                v-if="item.badge && isExpanded"
                class="ml-auto px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full"
              >
                {{ item.badge > 99 ? '99+' : item.badge }}
              </span>
            </Transition>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- 底部折叠按钮 -->
    <div class="p-2 border-t border-gray-200 dark:border-gray-700">
      <button
        class="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="appStore.toggleSidebar()"
      >
        <svg
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': !isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        <Transition name="fade">
          <span v-if="isExpanded">收起菜单</span>
        </Transition>
      </button>
    </div>
  </aside>

  <!-- 移动端侧边栏（抽屉模式） -->
  <Teleport to="body">
    <Transition name="sidebar">
      <div
        v-if="isMobileOpen"
        class="lg:hidden fixed inset-0 z-50"
      >
        <!-- 遮罩层 -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="appStore.setMobileSidebarOpen(false)"
        ></div>

        <!-- 侧边栏内容 -->
        <aside class="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">导航菜单</h2>
            <button
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="appStore.setMobileSidebarOpen(false)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav class="py-4 px-2">
            <ul class="space-y-1">
              <li v-for="item in navItems" :key="item.path">
                <RouterLink
                  :to="item.path"
                  class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="[
                    route.path === item.path
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                  @click="appStore.setMobileSidebarOpen(false)"
                >
                  <svg
                    class="w-5 h-5"
                    :class="route.path === item.path ? 'text-primary-600' : 'text-gray-500'"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(item.icon)" />
                  </svg>
                  <span>{{ item.label }}</span>
                  <span
                    v-if="item.badge"
                    class="ml-auto px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full"
                  >
                    {{ item.badge > 99 ? '99+' : item.badge }}
                  </span>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}

.sidebar-enter-from aside,
.sidebar-leave-to aside {
  transform: translateX(-100%);
}
</style>
