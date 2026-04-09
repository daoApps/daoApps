<script setup lang="ts">
import { ref, computed } from 'vue'
import { themeColors, fontOptions, abilities as allAbilities, avatarLibrary, type AgentConfig } from '../../data/mockCustomize'

interface Props {
  config: AgentConfig
}

const props = defineProps<Props>()

const deviceSize = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const isFullscreen = ref(false)
const previewKey = ref(0)

const currentTheme = computed(() => themeColors.find(t => t.id === props.config.appearance.themeId))
const primaryColor = computed(() => props.config.appearance.customColors?.primary || currentTheme.value?.primary || '#3B82F6')
const secondaryColor = computed(() => props.config.appearance.customColors?.secondary || currentTheme.value?.secondary || '#60A5FA')
const bgColor = computed(() => {
  if (props.config.appearance.darkMode) return '#111827'
  return currentTheme.value?.background || '#EFF6FF'
})
const textColor = computed(() => props.config.appearance.darkMode ? '#e5e7eb' : (currentTheme.value?.text || '#1E40AF'))
const titleFontFamily = computed(() => fontOptions.find(f => f.id === props.config.appearance.titleFont)?.family || 'system-ui')
const bodyFontFamily = computed(() => fontOptions.find(f => f.id === props.config.appearance.bodyFont)?.family || 'system-ui')

const enabledAbilitiesList = computed(() =>
  Object.entries(props.config.abilities.enabledAbilities)
    .filter(([, cfg]) => cfg.enabled)
    .map(([id, cfg]) => ({
      ability: allAbilities.find(a => a.id === id),
      config: cfg
    }))
)

const modeLabels: Record<string, string> = {
  free: '免费',
  subscription: '订阅制',
  payPerUse: '按次付费',
  membership: '会员制'
}

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px'
}

const refreshPreview = () => {
  previewKey.value++
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const sharePreview = () => {
  const url = `${window.location.origin}/customize/preview/${Date.now()}`
  navigator.clipboard.writeText(url).then(() => {
    alert('预览链接已复制到剪贴板！')
  })
}
</script>

<template>
  <div class="flex flex-col h-full" :class="{ 'fixed inset-0 z-50 bg-gray-900': isFullscreen }">
    <div v-if="!isFullscreen" class="flex items-center justify-between mb-3 px-1">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">实时预览</h3>
      <div class="flex items-center gap-1.5">
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            v-for="size in (['desktop', 'tablet', 'mobile'] as const)"
            :key="size"
            type="button"
            @click="deviceSize = size"
            class="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all capitalize"
            :class="deviceSize === size ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          >{{ size }}</button>
        </div>
        <button type="button" @click="refreshPreview" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="刷新预览" aria-label="刷新预览">
          <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button type="button" @click="toggleFullscreen" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="全屏预览" aria-label="全屏预览">
          <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
        </button>
        <button type="button" @click="sharePreview" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="分享链接" aria-label="分享链接">
          <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>
      </div>
    </div>

    <div v-if="isFullscreen" class="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
      <span class="text-sm font-medium text-white">智能体预览</span>
      <button type="button" @click="toggleFullscreen" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">退出全屏</button>
    </div>

    <div class="flex-1 flex items-start justify-center overflow-auto p-2" :class="{ 'p-6': isFullscreen }">
      <div
        :key="previewKey"
        class="transition-all duration-300 ease-out overflow-hidden"
        :style="{
          width: isFullscreen ? '100%' : deviceWidths[deviceSize],
          maxWidth: isFullscreen ? '1200px' : '100%',
          height: isFullscreen ? 'calc(100vh - 60px)' : 'auto',
          minHeight: isFullscreen ? '' : '480px',
          maxHeight: isFullscreen ? '' : '680px',
          backgroundColor: bgColor,
          borderRadius: `${config.appearance.borderRadius}px`,
          fontFamily: bodyFontFamily,
          fontSize: `${config.appearance.fontSize}px`,
          color: textColor,
          boxShadow: config.appearance.shadowIntensity !== 'none' ? `0 ${config.appearance.shadowIntensity === 'heavy' ? '25' : config.appearance.shadowIntensity === 'medium' ? '12' : '4'}px rgba(0,0,0,${config.appearance.darkMode ? '0.4' : '0.1'})` : 'none',
          border: `1px solid ${config.appearance.darkMode ? '#374151' : '#e5e7eb'}`
        }"
        class="relative"
      >
        <div class="h-full overflow-y-auto custom-preview-scrollbar">
          <div class="p-5 sm:p-6 space-y-5">
            <header class="flex items-center gap-4 pb-4 border-b" :style="{ borderColor: config.appearance.darkMode ? '#374151' : primaryColor + '20' }">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md"
                :style="{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  borderRadius: `${config.appearance.borderRadius}px`
                }"
              >
                {{ config.basicInfo.avatarId ? (() => { const avatar = avatarLibrary.find((a: any) => a.id === config.basicInfo.avatarId); return avatar?.emoji || '🤖' })() : config.basicInfo.customAvatar ? '🖼️' : '🤖' }}
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-bold truncate" :style="{ fontFamily: titleFontFamily, color: textColor, fontSize: `${config.appearance.fontSize * 1.25}px` }">
                  {{ config.basicInfo.name || '未命名智能体' }}
                </h2>
                <p class="text-xs mt-0.5 opacity-70 line-clamp-2">{{ config.basicInfo.description || '暂无描述信息...' }}</p>
              </div>
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0"
                :style="{
                  backgroundColor: primaryColor + '15',
                  color: primaryColor,
                  borderRadius: `${Math.max(999, config.appearance.borderRadius)}px`
                }"
              >{{ modeLabels[config.businessModel.mode] || '免费' }}</span>
            </header>

            <section v-if="config.basicInfo.tags && config.basicInfo.tags.length">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in config.basicInfo.tags"
                  :key="tag"
                  class="px-2 py-0.5 rounded-md text-[11px] font-medium opacity-80"
                  :style="{
                    backgroundColor: primaryColor + '18',
                    color: primaryColor,
                    borderRadius: `${config.appearance.borderRadius * 0.7}px`
                  }"
                >{{ tag }}</span>
              </div>
            </section>

            <section>
              <h3 class="font-semibold mb-2.5" :style="{ fontFamily: titleFontFamily, color: textColor, fontSize: `${config.appearance.fontSize * 1.05}px` }">能力配置</h3>
              <div v-if="enabledAbilitiesList.length" class="space-y-2">
                <div
                  v-for="item in enabledAbilitiesList.slice(0, 6)"
                  :key="item.ability?.id"
                  class="flex items-center gap-2.5 p-2.5 rounded-lg"
                  :style="{
                    backgroundColor: config.appearance.darkMode ? '#1f2937' : '#ffffff40',
                    borderRadius: `${config.appearance.borderRadius * 0.8}px`
                  }"
                >
                  <span class="text-base">{{ item.ability?.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">{{ item.ability?.name }}</p>
                    <div class="mt-1 w-full h-1 rounded-full overflow-hidden" :style="{ backgroundColor: config.appearance.darkMode ? '#374151' : '#00000010' }">
                      <div class="h-full rounded-full transition-all" :style="{ width: `${item.config.proficiency}%`, backgroundColor: primaryColor }"></div>
                    </div>
                  </div>
                  <span class="text-[10px] opacity-60">{{ item.config.proficiency }}%</span>
                </div>
                <p v-if="enabledAbilitiesList.length > 6" class="text-[11px] opacity-50 text-center pt-1">
                  还有 {{ enabledAbilitiesList.length - 6 }} 个能力...
                </p>
              </div>
              <div v-else class="text-center py-6 opacity-50">
                <span class="text-2xl block mb-1">⚙️</span>
                <p class="text-sm">暂未配置能力</p>
              </div>
            </section>

            <section>
              <h3 class="font-semibold mb-2.5" :style="{ fontFamily: titleFontFamily, color: textColor, fontSize: `${config.appearance.fontSize * 1.05}px` }">商业模式</h3>
              <div class="grid grid-cols-2 gap-2.5">
                <div class="p-3 rounded-lg text-center" :style="{ backgroundColor: config.appearance.darkMode ? '#1f2937' : '#ffffff50', borderRadius: `${config.appearance.borderRadius * 0.8}px` }">
                  <p class="text-[10px] opacity-60 mb-0.5">定价模式</p>
                  <p class="font-bold text-sm" :style="{ color: primaryColor }">{{ modeLabels[config.businessModel.mode] || '免费' }}</p>
                </div>
                <div class="p-3 rounded-lg text-center" :style="{ backgroundColor: config.appearance.darkMode ? '#1f2937' : '#ffffff50', borderRadius: `${config.appearance.borderRadius * 0.8}px` }">
                  <p class="text-[10px] opacity-60 mb-0.5">日请求限额</p>
                  <p class="font-bold text-sm" :style="{ color: primaryColor }">{{ config.businessModel.serviceLimits.dailyRequestLimit.toLocaleString() }}</p>
                </div>
                <div class="p-3 rounded-lg text-center" :style="{ backgroundColor: config.appearance.darkMode ? '#1f2937' : '#ffffff50', borderRadius: `${config.appearance.borderRadius * 0.8}px` }">
                  <p class="text-[10px] opacity-60 mb-0.5">并发用户</p>
                  <p class="font-bold text-sm" :style="{ color: primaryColor }">{{ config.businessModel.serviceLimits.maxConcurrentUsers }}</p>
                </div>
                <div class="p-3 rounded-lg text-center" :style="{ backgroundColor: config.appearance.darkMode ? '#1f2937' : '#ffffff50', borderRadius: `${config.appearance.borderRadius * 0.8}px` }">
                  <p class="text-[10px] opacity-60 mb-0.5">平台抽成</p>
                  <p class="font-bold text-sm" :style="{ color: primaryColor }">{{ config.businessModel.platformCommission }}%</p>
                </div>
              </div>
            </section>

            <footer class="pt-3 border-t text-center" :style="{ borderColor: config.appearance.darkMode ? '#374151' : primaryColor + '15' }">
              <p class="text-[10px] opacity-40">由 AgentPit 智能体平台驱动 · 预览模式</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.custom-preview-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-preview-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-preview-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156,163,175,0.3); border-radius: 2px; }
.custom-preview-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156,163,175,0.5); }
</style>
