/**
 * Footer 组件 - 应用底部信息栏
 * 
 * @description 显示应用的品牌信息、快速链接、法律信息和社交媒体链接
 * 
 * @component
 * 
 * @example
 * <Footer />
 * 
 * @slot default - 默认插槽，未使用
 * 
 * @dependencies 
 * - 无外部状态依赖
 */

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const footerLinks = {
  about: [
    { label: '关于我们', href: '#' },
    { label: '使用文档', href: '#' },
    { label: 'API 接口', href: '#' },
    { label: '联系我们', href: '#' }
  ],
  legal: [
    { label: '隐私政策', href: '#' },
    { label: '服务条款', href: '#' },
    { label: 'Cookie 政策', href: '#' }
  ]
}

const socialLinks = [
  {
    name: 'GitHub',
    href: '#',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
  },
  {
    name: 'Twitter',
    href: '#',
    icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
  }
]
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        <!-- 左侧：品牌信息 -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AP
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AgentPit</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            智能体协作平台，为您提供全方位的AI解决方案
          </p>
        </div>

        <!-- 中间：快速链接 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">快速链接</h3>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.about" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 右侧：法律信息 + 社交媒体 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">法律信息</h3>
          <ul class="space-y-2 mb-4">
            <li v-for="link in footerLinks.legal" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>

          <!-- 社交媒体图标 -->
          <div class="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              :aria-label="social.name"
              class="p-2 rounded-lg text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path :d="social.icon" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          © {{ currentYear }} AgentPit. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
