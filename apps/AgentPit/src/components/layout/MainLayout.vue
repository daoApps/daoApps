/**
 * MainLayout 组件 - 应用主布局容器
 * 
 * @description 整合 Header、Sidebar、Footer 和主内容区域，提供响应式布局支持
 * 
 * @component
 * 
 * @example
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 * 
 * @slot default - 主内容插槽，用于放置页面内容
 * 
 * @dependencies 
 * - Header - 顶部导航栏组件
 * - Sidebar - 侧边栏组件
 * - Footer - 底部信息栏组件
 * - useAppStore - 应用全局状态管理
 */

<script setup lang="ts">
import { computed } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Footer from './Footer.vue'
import { useAppStore } from '../../stores/useAppStore'

const appStore = useAppStore()

const sidebarWidth = computed(() => appStore.sidebarOpen ? 'w-64' : 'w-16')
const mainMarginLeft = computed(() => appStore.sidebarOpen ? 'lg:ml-64' : 'lg:ml-16')

const handleToggleSidebar = () => {
  appStore.toggleSidebar()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- 顶部导航栏 -->
    <Header @toggle-sidebar="handleToggleSidebar" />

    <!-- 主体内容区域 -->
    <div class="flex flex-1 pt-16">
      <!-- 侧边栏（桌面端固定定位） -->
      <div
        class="hidden lg:block transition-all duration-300 ease-in-out"
        :class="sidebarWidth"
      >
        <Sidebar />
      </div>

      <!-- 主内容区 -->
      <main
        class="flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out overflow-x-hidden"
        :class="mainMarginLeft"
      >
        <div class="p-4 sm:p-6 lg:p-8">
          <!-- 默认插槽：放置页面内容 -->
          <slot />
        </div>

        <!-- 底部信息栏 -->
        <Footer />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 确保主内容区平滑过渡 */
main {
  transition-property: margin-left;
}

/* 移动端优化 */
@media (max-width: 1024px) {
  main {
    margin-left: 0 !important;
  }
}
</style>
