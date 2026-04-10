<script setup lang="ts">
import { ref } from 'vue'
import type { SiteConfig, PublishHistory } from '@/data/mockSphinx'

const props = defineProps<{
  siteConfig: Partial<SiteConfig>
}>()

const emit = defineEmits<{
  (e: 'publish', config: SiteConfig): void
}>()

const domain = ref(props.siteConfig.domain || '')
const seoTitle = ref(props.siteConfig.seoTitle || props.siteConfig.siteName || '')
const seoDescription = ref(props.siteConfig.seoDescription || '')
const seoKeywords = ref(props.siteConfig.seoKeywords || '')

type PublishStatus = 'idle' | 'building' | 'deploying' | 'success' | 'error'
const publishStatus = ref<PublishStatus>('idle')
const deployPlatform = ref<'local' | 'vercel' | 'netlify' | 'custom'>('vercel')
const enableSSL = ref(true)
const deployUrl = ref('')
const buildProgress = ref(0)

const publishHistory = ref<PublishHistory[]>([
  {
    id: '1',
    version: 'v1.0.0',
    status: 'published',
    publishTime: new Date(Date.now() - 86400000 * 2),
    url: 'https://example.vercel.app'
  }
])

const platforms: { id: 'local' | 'vercel' | 'netlify' | 'custom'; name: string; icon: string; desc: string }[] = [
  { id: 'local', name: '本地预览', icon: '💻', desc: '在本地预览网站' },
  { id: 'vercel', name: 'Vercel', icon: '▲', desc: '一键部署到 Vercel' },
  { id: 'netlify', name: 'Netlify', icon: '🌐', desc: '部署到 Netlify 平台' },
  { id: 'custom', name: '自定义服务器', icon: '🖥️', desc: '部署到自定义服务器' }
]

const handlePublish = async () => {
  if (!domain.value.trim()) {
    alert('请输入域名')
    return
  }

  publishStatus.value = 'building'
  buildProgress.value = 0

  // 模拟构建过程
  const buildInterval = setInterval(() => {
    buildProgress.value += Math.random() * 15
    if (buildProgress.value >= 100) {
      buildProgress.value = 100
      clearInterval(buildInterval)
    }
  }, 300)

  // 模拟构建完成后的部署过程
  setTimeout(() => {
    clearInterval(buildInterval)
    buildProgress.value = 100
    publishStatus.value = 'deploying'

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2

      if (isSuccess) {
        const baseUrl = deployPlatform.value === 'vercel'
          ? 'https://'
          : deployPlatform.value === 'netlify'
            ? 'https://'
            : 'https://'

        const domainName = deployPlatform.value === 'vercel'
          ? `${domain.value.replace(/\./g, '-')}.vercel.app`
          : deployPlatform.value === 'netlify'
            ? `${domain.value.replace(/\./g, '-')}.netlify.app`
            : domain.value

        deployUrl.value = `${baseUrl}${domainName}`

        const newPublish: PublishHistory = {
          id: Date.now().toString(),
          version: `v${publishHistory.value.length + 1}.0.0`,
          status: 'published',
          publishTime: new Date(),
          url: deployUrl.value
        }

        publishHistory.value = [newPublish, ...publishHistory.value]
        publishStatus.value = 'success'

        emit('publish', {
          ...props.siteConfig,
          domain: domain.value,
          seoTitle: seoTitle.value,
          seoDescription: seoDescription.value,
          seoKeywords: seoKeywords.value
        } as SiteConfig)

        setTimeout(() => {
          publishStatus.value = 'idle'
        }, 5000)
      } else {
        publishStatus.value = 'error'
        setTimeout(() => {
          publishStatus.value = 'idle'
        }, 3000)
      }
    }, 1500)
  }, 3000)
}

const getStatusConfig = (status: PublishHistory['status']) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', label: '待发布' },
    publishing: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: '发布中' },
    published: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: '已发布' },
    failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: '失败' }
  }

  return statusConfig[status]
}
</script>

<template>
  <div class="space-y-6">
    <!-- 发布平台选择 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <span class="mr-2">🚀</span>
        发布平台
      </h3>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="platform in platforms"
          :key="platform.id"
          :class="[
            'p-4 rounded-lg border-2 transition-all duration-200 text-left',
            deployPlatform === platform.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
          @click="deployPlatform = platform.id"
        >
          <div class="flex items-center space-x-3">
            <span class="text-2xl">{{ platform.icon }}</span>
            <div>
              <p class="font-medium text-gray-900 dark:text-white text-sm">{{ platform.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ platform.desc }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- 域名配置 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <span class="mr-2">🌐</span>
        域名配置
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">域名地址 *</label>
          <div class="flex">
            <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">https://</span>
            <input
              v-model="domain"
              type="text"
              placeholder="your-domain.com"
              class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            输入您想要使用的域名，或使用默认的子域名
          </p>
        </div>

        <!-- SSL 开关 -->
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">启用 SSL 证书</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">自动配置 HTTPS 安全连接</p>
          </div>
          <button
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              enableSSL ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
            @click="enableSSL = !enableSSL"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                enableSSL ? 'translate-x-6' : 'translate-x-1'
              ]"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- SEO 设置 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <span class="mr-2">🔍</span>
        SEO 设置
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO 标题</label>
          <input
            v-model="seoTitle"
            type="text"
            placeholder="网站标题，显示在搜索引擎结果中"
            maxlength="60"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{{ seoTitle.length }}/60</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO 描述</label>
          <textarea
            v-model="seoDescription"
            placeholder="简要描述您的网站内容，用于搜索引擎展示"
            rows="3"
            maxlength="160"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{{ seoDescription.length }}/160</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">关键词</label>
          <input
            v-model="seoKeywords"
            type="text"
            placeholder="关键词1, 关键词2, 关键词3"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">用逗号分隔多个关键词</p>
        </div>
      </div>
    </div>

    <!-- 发布状态和按钮 -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <!-- 构建进度条 -->
      <div v-if="publishStatus === 'building'" class="mb-4">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>正在构建...</span>
          <span>{{ Math.round(buildProgress) }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            :style="{ width: `${buildProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- 部署状态 -->
      <div v-if="publishStatus === 'deploying'" class="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <div class="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>正在部署到 {{ platforms.find(p => p.id === deployPlatform)?.name }}...</span>
        </div>
      </div>

      <!-- 部署成功 URL -->
      <div v-if="publishStatus === 'success' && deployUrl" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center space-x-2 text-green-700 dark:text-green-300 mb-2">
          <span class="text-xl">✅</span>
          <span class="font-semibold">部署成功！</span>
        </div>
        <a
          :href="deployUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
        >
          {{ deployUrl }}
        </a>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">发布状态</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ publishStatus === 'idle' && '准备就绪，点击按钮发布网站' }}
            {{ publishStatus === 'building' && '⚙️ 正在构建项目...' }}
            {{ publishStatus === 'deploying' && '🚀 正在部署到云端...' }}
            {{ publishStatus === 'success' && '✅ 发布成功！网站已上线' }}
            {{ publishStatus === 'error' && '❌ 发布失败，请检查配置后重试' }}
          </p>
        </div>

        <button
          :disabled="publishStatus === 'building' || publishStatus === 'deploying' || !domain.trim()"
          :class="[
            'px-8 py-3 rounded-lg font-semibold transition-all duration-200',
            publishStatus === 'success'
              ? 'bg-green-500 text-white hover:bg-green-600'
              : publishStatus === 'error'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg',
            (publishStatus === 'building' || publishStatus === 'deploying') && 'opacity-50 cursor-not-allowed'
          ]"
          @click="handlePublish"
        >
          <span v-if="publishStatus === 'idle'">🚀 一键发布</span>
          <span v-if="publishStatus === 'building'" class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>构建中...</span>
          </span>
          <span v-if="publishStatus === 'deploying'" class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>部署中...</span>
          </span>
          <span v-if="publishStatus === 'success'">✓ 已发布</span>
          <span v-if="publishStatus === 'error'">✕ 重试</span>
        </button>
      </div>
    </div>

    <!-- 发布历史 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <span class="mr-2">📋</span>
        发布历史
      </h3>

      <div v-if="publishHistory.length > 0" class="space-y-3">
        <div
          v-for="record in publishHistory"
          :key="record.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">{{ record.version.slice(1, 2) }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ record.version }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ record.publishTime.toLocaleString('zh-CN') }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusConfig(record.status).bg, getStatusConfig(record.status).text]">
              {{ getStatusConfig(record.status).label }}
            </span>
            <a
              v-if="record.url && record.status === 'published'"
              :href="record.url"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
            >
              访问 →
            </a>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>暂无发布记录</p>
      </div>
    </div>
  </div>
</template>
