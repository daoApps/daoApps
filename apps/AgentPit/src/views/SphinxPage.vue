<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import SiteWizard from '@/components/sphinx/SiteWizard.vue'
import AISiteBuilder from '@/components/sphinx/AISiteBuilder.vue'
import DragEditor from '@/components/sphinx/DragEditor.vue'

type TabType = 'wizard' | 'ai' | 'editor' | 'sites'

const activeTab = ref<TabType>('wizard')

const tabs = [
  { id: 'wizard', label: '向导模式', icon: '📋', description: '跟随步骤创建网站' },
  { id: 'ai', label: 'AI 建站', icon: '🤖', description: 'AI 对话式智能建站' },
  { id: 'editor', label: '可视化编辑', icon: '🎨', description: '拖拽组件自由设计' },
  { id: 'sites', label: '我的站点', icon: '🌐', description: '管理已发布的网站' }
] as const

const mySites = ref([
  {
    id: '1',
    name: '我的个人博客',
    url: 'https://my-blog.vercel.app',
    status: 'published',
    template: 'blog-1',
    createdAt: new Date(Date.now() - 86400000 * 5),
    visits: 1234
  },
  {
    id: '2',
    name: '企业官网 Demo',
    url: 'https://company-demo.netlify.app',
    status: 'published',
    template: 'corporate-1',
    createdAt: new Date(Date.now() - 86400000 * 2),
    visits: 567
  }
])
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏛️ Sphinx 快速建站系统
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          AI 驱动的智能建站平台，快速构建专业网站
        </p>
      </div>

      <!-- Tab 导航 -->
      <div class="mb-8 flex justify-center">
        <div class="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-2 gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id as TabType"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Tab 内容区域 -->
      <div>
        <!-- 向导模式 -->
        <div v-if="activeTab === 'wizard'">
          <SiteWizard />
        </div>

        <!-- AI 建站模式 -->
        <div v-if="activeTab === 'ai'" class="space-y-6">
          <div style="height: calc(100vh - 280px); min-height: 600px;">
            <AISiteBuilder />
          </div>
        </div>

        <!-- 可视化编辑器模式 -->
        <div v-if="activeTab === 'editor'">
          <DragEditor />
        </div>

        <!-- 我的站点 -->
        <div v-if="activeTab === 'sites'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">已发布的站点</h2>
            <button
              @click="activeTab = 'wizard'"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              + 创建新站点
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="site in mySites"
              :key="site.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div class="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center relative">
                <span class="text-6xl">{{ site.template === 'blog-1' ? '📝' : site.template === 'corporate-1' ? '🏢' : '🚀' }}</span>
                <div class="absolute top-3 right-3">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      site.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    ]"
                  >
                    {{ site.status === 'published' ? '✅ 已发布' : '⏳ 构建中' }}
                  </span>
                </div>
              </div>

              <div class="p-6">
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2">{{ site.name }}</h3>
                <a
                  :href="site.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 block truncate"
                >
                  {{ site.url }}
                </a>

                <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>👁️ {{ site.visits.toLocaleString() }} 访问</span>
                    <span>📅 {{ site.createdAt.toLocaleDateString('zh-CN') }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <button class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      编辑
                    </button>
                    <button class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      管理
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="mySites.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">🏗️</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">还没有发布任何站点</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">开始使用 Sphinx AI 创建您的第一个网站</p>
            <button
              @click="activeTab = 'wizard'"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
            >
              开始创建 →
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
