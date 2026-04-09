<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import TemplateGallery from './TemplateGallery.vue'
import SitePreview from './SitePreview.vue'
import PublishPanel from './PublishPanel.vue'
import type { Template, SiteConfig } from '@/data/mockSphinx'

type WizardStep = 1 | 2 | 3 | 4 | 5

const steps = [
  { id: 1, title: '选择类型', icon: '🎯', description: '选择网站类型' },
  { id: 2, title: '基本信息', icon: '📝', description: '填写网站信息' },
  { id: 3, title: '选择模板', icon: '🎨', description: '选择适合的模板' },
  { id: 4, title: '配置选项', icon: '⚙️', description: '配置网站细节' },
  { id: 5, title: '预览发布', icon: '🚀', description: '预览并发布网站' }
] as const

const currentStep = ref<WizardStep>(1)
const selectedTemplate = ref<Template | null>(null)
const siteConfig = reactive<Partial<SiteConfig>>({
  siteName: '',
  description: '',
  domain: '',
  templateId: null,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

const siteType = ref<string>('')
const colorScheme = ref<string>('blue')
const layoutMode = ref<string>('standard')
const enableModules = reactive({
  seo: true,
  responsive: true,
  analytics: false,
  ssl: true
})

const canProceedToStep2 = computed(() => siteType.value !== '')
const canProceedToStep3 = computed(() => siteConfig.siteName?.trim() && siteConfig.description?.trim())
const canProceedToStep4 = computed(() => selectedTemplate.value !== null)
const canProceedToStep5 = computed(() => canProceedToStep4.value)

const handleNext = () => {
  if (currentStep.value < 5) {
    currentStep.value = (currentStep.value + 1) as WizardStep
  }
}

const handlePrev = () => {
  if (currentStep.value > 1) {
    currentStep.value = (currentStep.value - 1) as WizardStep
  }
}

const handleSelectTemplate = (template: Template) => {
  selectedTemplate.value = template
  siteConfig.templateId = template.id
}

const handleSiteTypeSelect = (type: string) => {
  siteType.value = type
}

const handleComplete = () => {
  window.alert('🎉 恭喜！网站创建完成！')
}

defineExpose({
  siteConfig,
  selectedTemplate
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏛️ Sphinx 快速建站向导
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          跟随向导步骤，快速创建专业的网站
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧步骤导航 -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <nav class="space-y-2">
              <button
                v-for="step in steps"
                :key="step.id"
                @click="
                  step.id === 1 ||
                  (step.id === 2 && canProceedToStep2) ||
                  (step.id === 3 && canProceedToStep3) ||
                  (step.id === 4 && canProceedToStep4) ||
                  step.id === 5
                    ? (currentStep = step.id as WizardStep)
                    : null
                "
                :disabled="
                  (step.id === 2 && !canProceedToStep2) ||
                  (step.id === 3 && !canProceedToStep3) ||
                  (step.id === 4 && !canProceedToStep4) ||
                  (step.id === 5 && !canProceedToStep5)
                "
                :class="[
                  'w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200',
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : step.id < currentStep || (step.id === 2 && canProceedToStep2) || (step.id === 3 && canProceedToStep3) || (step.id === 4 && canProceedToStep4)
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                ]"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg',
                    currentStep === step.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                  ]"
                >
                  {{ step.id < currentStep ? '✓' : step.icon }}
                </div>
                <div class="text-left">
                  <p class="font-semibold text-sm">{{ step.title }}</p>
                  <p
                    :class="[
                      'text-xs',
                      currentStep === step.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    ]"
                  >
                    {{ step.description }}
                  </p>
                </div>
              </button>
            </nav>

            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>进度</span>
                <span>{{ currentStep }}/5</span>
              </div>
              <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                  :style="{ width: `${(currentStep / 5) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="flex-1 min-w-0">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
            <!-- Step 1: 选择网站类型 -->
            <div v-if="currentStep === 1" class="animate-fadeIn space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">选择网站类型</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  v-for="type in [
                    { id: 'blog', icon: '📝', name: '个人博客', desc: '分享文章、记录生活、技术博客' },
                    { id: 'ecommerce', icon: '🛍️', name: '电商网站', desc: '在线商城、商品展示、购物车功能' },
                    { id: 'corporate', icon: '🏢', name: '企业官网', desc: '公司介绍、产品展示、联系方式' },
                    { id: 'portfolio', icon: '🎨', name: '作品集', desc: '展示设计作品、项目案例、个人简历' }
                  ]"
                  :key="type.id"
                  @click="handleSiteTypeSelect(type.id)"
                  :class="[
                    'p-6 rounded-xl border-2 transition-all duration-300 text-left',
                    siteType === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md'
                  ]"
                >
                  <div class="text-4xl mb-3">{{ type.icon }}</div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ type.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ type.desc }}</p>
                  <div v-if="siteType === type.id" class="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    已选择
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 2: 基本信息 -->
            <div v-if="currentStep === 2" class="animate-fadeIn space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">基本信息配置</h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">网站名称 *</label>
                    <input
                      v-model="siteConfig.siteName"
                      type="text"
                      placeholder="例如：我的个人博客"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">网站描述 *</label>
                    <textarea
                      v-model="siteConfig.description"
                      placeholder="简要描述您的网站内容和用途..."
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">域名（可选）</label>
                    <div class="flex">
                      <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">https://</span>
                      <input
                        v-model="siteConfig.domain"
                        type="text"
                        placeholder="your-domain.com"
                        class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div v-if="siteType" class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">已选类型</p>
                    <p class="text-sm text-blue-700 dark:text-blue-400">{{ siteType === 'blog' ? '📝 个人博客' : siteType === 'ecommerce' ? '🛍️ 电商网站' : siteType === 'corporate' ? '🏢 企业官网' : '🎨 作品集' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: 选择模板 -->
            <div v-if="currentStep === 3" class="animate-fadeIn">
              <TemplateGallery
                :on-select-template="handleSelectTemplate"
                :selected-template-id="selectedTemplate?.id"
              />
            </div>

            <!-- Step 4: 配置选项 -->
            <div v-if="currentStep === 4" class="animate-fadeIn space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">配置选项</h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">颜色方案</label>
                    <div class="grid grid-cols-4 gap-3">
                      <button
                        v-for="scheme in [
                          { id: 'blue', name: '蓝色', colors: ['#3B82F6', '#60A5FA'] },
                          { id: 'green', name: '绿色', colors: ['#10B981', '#34D399'] },
                          { id: 'purple', name: '紫色', colors: ['#8B5CF6', '#A78BFA'] },
                          { id: 'orange', name: '橙色', colors: ['#F97316', '#FB923C'] }
                        ]"
                        :key="scheme.id"
                        @click="colorScheme = scheme.id"
                        :class="[
                          'p-3 rounded-lg border-2 transition-all duration-200 text-center',
                          colorScheme === scheme.id
                            ? 'border-blue-500 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        ]"
                      >
                        <div class="flex justify-center space-x-1 mb-2">
                          <div
                            v-for="(color, idx) in scheme.colors"
                            :key="idx"
                            class="w-6 h-6 rounded-full"
                            :style="{ backgroundColor: color }"
                          ></div>
                        </div>
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ scheme.name }}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">布局方式</label>
                    <div class="grid grid-cols-3 gap-3">
                      <button
                        v-for="layout in [
                          { id: 'standard', name: '标准布局' },
                          { id: 'sidebar', name: '侧边栏' },
                          { id: 'fullwidth', name: '全宽' }
                        ]"
                        :key="layout.id"
                        @click="layoutMode = layout.id"
                        :class="[
                          'px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium',
                          layoutMode === layout.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                        ]"
                      >
                        {{ layout.name }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">功能模块</label>
                    <div class="space-y-3">
                      <label
                        v-for="(_enabled, key) in enableModules"
                        :key="key"
                        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ key === 'seo' ? 'SEO 优化' : key === 'responsive' ? '响应式设计' : key === 'analytics' ? '分析统计' : 'SSL 证书' }}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{
                              key === 'seo'
                                ? '自动优化搜索引擎排名'
                                : key === 'responsive'
                                  ? '自动适配各种设备屏幕'
                                  : key === 'analytics'
                                    ? '追踪访问数据和用户行为'
                                    : '启用 HTTPS 安全连接'
                            }}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          v-model="enableModules[key]"
                          class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: 预览发布 -->
            <div v-if="currentStep === 5" class="animate-fadeIn space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="mr-2">👁️</span>
                    网站预览
                  </h3>
                  <div style="height: 500px;">
                    <SitePreview
                      :site-name="siteConfig.siteName"
                      :template-id="selectedTemplate?.id"
                    />
                  </div>
                </div>

                <div>
                  <PublishPanel :site-config="siteConfig" />
                </div>
              </div>
            </div>

            <!-- 底部导航按钮 -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                @click="handlePrev"
                :disabled="currentStep === 1"
                :class="[
                  'px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
                  currentStep === 1
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                ]"
              >
                ← 上一步
              </button>

              <div class="flex items-center space-x-2">
                <div
                  v-for="(_, index) in steps"
                  :key="index"
                  :class="[
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    index + 1 === currentStep
                      ? 'bg-blue-600 scale-125'
                      : index + 1 < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                  ]"
                ></div>
              </div>

              <button
                v-if="currentStep < 5"
                @click="handleNext"
                :disabled="
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3) ||
                  (currentStep === 3 && !canProceedToStep4)
                "
                class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步 →
              </button>
              <button
                v-else
                @click="handleComplete()"
                class="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ✨ 完成建站
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
