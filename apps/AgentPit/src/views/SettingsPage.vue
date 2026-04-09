<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import UserProfileSettings from '../components/settings/UserProfileSettings.vue'
import ThemePreferences from '../components/settings/ThemePreferences.vue'
import NotificationSettings from '../components/settings/NotificationSettings.vue'
import PrivacySecurity from '../components/settings/PrivacySecurity.vue'
import HelpCenter from '../components/settings/HelpCenter.vue'

const activeSection = ref('profile')

const settingsMenu = [
  { id: 'profile', label: '个人资料', icon: '👤', desc: '管理您的个人信息' },
  { id: 'theme', label: '主题设置', icon: '🎨', desc: '自定义界面外观和体验' },
  { id: 'notification', label: '通知设置', icon: '🔔', desc: '配置通知偏好和渠道' },
  { id: 'privacy', label: '隐私安全', icon: '🔒', desc: '密码、认证和安全选项' },
  { id: 'help', label: '帮助中心', icon: '❓', desc: '常见问题和使用指南' },
  { id: 'about', label: '关于', icon: 'ℹ️', desc: '版本信息和团队介绍' },
]

const versionInfo = {
  version: 'v3.0.0-vue3-rewrite',
  releaseDate: '2026-04-10',
  team: 'AgentPit 开发团队',
  license: 'MIT License',
}
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto">
      <!-- 面包屑 -->
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>首页</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-gray-900 dark:text-white font-medium">设置中心</span>
      </div>

      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          设置中心
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">个性化您的使用体验</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧导航菜单 -->
        <aside class="lg:w-64 flex-shrink-0">
          <nav class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm lg:sticky lg:top-4">
            <ul class="py-2">
              <li v-for="item in settingsMenu" :key="item.id">
                <button
:class="[
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200',
                    activeSection === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium border-l-3 border-indigo-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  ]"
                  @click="activeSection = item.id">
                  <span class="text-xl">{{ item.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm">{{ item.label }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ item.desc }}</p>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- 右侧内容区域 -->
        <main class="flex-1 min-w-0">
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 min-h-[500px]">
            <!-- 个人资料 -->
            <UserProfileSettings v-if="activeSection === 'profile'" />

            <!-- 主题设置 -->
            <ThemePreferences v-if="activeSection === 'theme'" />

            <!-- 通知设置 -->
            <NotificationSettings v-if="activeSection === 'notification'" />

            <!-- 隐私安全 -->
            <PrivacySecurity v-if="activeSection === 'privacy'" />

            <!-- 帮助中心 -->
            <HelpCenter v-if="activeSection === 'help'" />

            <!-- 关于 -->
            <div v-if="activeSection === 'about'" class="space-y-8">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">ℹ️ 关于 AgentPit</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                  <p class="text-sm text-gray-500 mb-1">当前版本</p>
                  <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ versionInfo.version }}</p>
                </div>
                <div class="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <p class="text-sm text-gray-500 mb-1">发布日期</p>
                  <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ versionInfo.releaseDate }}</p>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 space-y-4">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-1">开发团队</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ versionInfo.team }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-1">开源协议</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ versionInfo.license }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-2">更新日志（v3.0.0）</p>
                  <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span> 全面重构为 Vue3 + TypeScript + Composition API</li>
                    <li class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span> 新增生活服务模块（日历、旅游、游戏中心）</li>
                    <li class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span> 全新设置中心界面设计</li>
                    <li class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span> 优化性能和用户体验</li>
                    <li class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span> 修复已知问题并提升稳定性</li>
                  </ul>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="#" class="text-sm text-indigo-500 hover:text-indigo-600 transition-colors">查看完整更新日志 →</a>
                <a href="#" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">GitHub 仓库 ↗</a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.border-l-3 { border-left-width: 3px; }
</style>
