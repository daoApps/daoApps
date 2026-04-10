<script setup lang="ts">
import { ref, reactive, watch, onMounted, provide } from 'vue'
import { useAppStore } from '../../stores/useAppStore'
import { defaultThemeSettings, presetColors } from '../../data/mockSettings'

const appStore = useAppStore()
const settings = reactive({ ...defaultThemeSettings })
const customColor = ref('')
const showCustomPicker = ref(false)
const showSuccessToast = ref(false)

const themeModes = [
  { value: 'light' as const, label: '亮色模式', icon: '☀️', desc: '明亮清爽的界面风格' },
  { value: 'dark' as const, label: '暗色模式', icon: '🌙', desc: '护眼暗色主题，适合夜间使用' },
  { value: 'system' as const, label: '跟随系统', icon: '💻', desc: '自动匹配操作系统主题偏好' },
]

const fontSizes = [
  { value: 'small' as const, label: '小', size: '14px' },
  { value: 'medium' as const, label: '中', size: '16px' },
  { value: 'large' as const, label: '大', size: '18px' },
  { value: 'xlarge' as const, label: '特大', size: '20px' },
]

const densityOptions = [
  { value: 'comfortable' as const, label: '舒适', spacing: '16px' },
  { value: 'compact' as const, label: '紧凑', spacing: '8px' },
  { value: 'minimal' as const, label: '极简', spacing: '4px' },
]

function applyTheme() {
  appStore.setTheme(settings.mode)
  document.documentElement.style.setProperty('--primary-color', settings.primaryColor)

  const fontMap: Record<string, string> = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' }
  document.documentElement.style.setProperty('--base-font-size', fontMap[settings.fontSize] || '16px')

  if (settings.highContrast) {
    document.documentElement.classList.add('high-contrast')
  } else {
    document.documentElement.classList.remove('high-contrast')
  }

  localStorage.setItem('theme-preferences', JSON.stringify(settings))
}

function saveTheme() {
  applyTheme()
  showSuccessToast.value = true
  setTimeout(() => { showSuccessToast.value = false }, 2500)
}

function resetToDefault() {
  Object.assign(settings, defaultThemeSettings)
  customColor.value = ''
  applyTheme()
}

watch(() => settings.mode, () => applyTheme())
watch(() => settings.primaryColor, () => applyTheme())
watch(() => settings.fontSize, () => applyTheme())

onMounted(() => {
  const saved = localStorage.getItem('theme-preferences')
  if (saved) {
    try { Object.assign(settings, JSON.parse(saved)) } catch {}
  }
  provide('themeSettings', settings)
})

provide('updateTheme', saveTheme)
</script>

<template>
  <div class="theme-preferences">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">🎨 主题偏好设置</h3>

    <div class="space-y-8">
      <!-- 主题模式选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">主题模式</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
v-for="mode in themeModes" :key="mode.value" :class="[
              'relative p-4 rounded-xl border-2 transition-all duration-200 text-left',
              settings.mode === mode.value
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
            @click="settings.mode = mode.value">
            <span class="text-2xl">{{ mode.icon }}</span>
            <p :class="['font-medium mt-2', settings.mode === mode.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white']">{{ mode.label }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ mode.desc }}</p>
            <div
v-if="settings.mode === mode.value"
              class="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          </button>
        </div>
      </div>

      <!-- 实时预览 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">实时预览</label>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white" :style="{ fontSize: fontSizes.find(f => f.value === settings.fontSize)?.size || '16px' }">示例用户名</p>
              <p class="text-xs text-gray-500" :style="{ fontSize: `calc(${fontSizes.find(f => f.value === settings.fontSize)?.size || '16px'} - 3px)` }">user@example.com</p>
            </div>
          </div>
          <button class="px-4 py-2 rounded-lg text-white text-sm font-medium" :style="{ backgroundColor: settings.primaryColor }">
            示例按钮
          </button>
          <div class="flex gap-2">
            <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">标签一</span>
            <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">标签二</span>
          </div>
        </div>
      </div>

      <!-- 强调色选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">强调色</label>
        <div class="flex flex-wrap gap-3">
          <button
v-for="color in presetColors" :key="color.value" :class="[
              'w-10 h-10 rounded-xl transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-800',
              settings.primaryColor === color.value ? 'ring-indigo-400 scale-110' : 'ring-transparent hover:scale-105'
            ]"
            :style="{ backgroundColor: color.value }"
            :title="color.name"
            @click="settings.primaryColor = color.value; showCustomPicker = false">
          </button>
          <button
:class="[
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-800',
              showCustomPicker ? 'ring-indigo-400' : 'ring-transparent'
            ]"
            style="background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);"
            @click="showCustomPicker = !showCustomPicker; customColor && (settings.primaryColor = customColor)">
            🎨
          </button>
        </div>
        <input
v-if="showCustomPicker" v-model="customColor" type="color"
          class="mt-2 w-12 h-8 rounded cursor-pointer" @input="(e: Event) => settings.primaryColor = (e.target as HTMLInputElement).value" />
      </div>

      <!-- 字体大小 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">字体大小</label>
        <div class="grid grid-cols-4 gap-2">
          <button
v-for="size in fontSizes" :key="size.value" :class="[
              'py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all',
              settings.fontSize === size.value
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            ]"
            @click="settings.fontSize = size.value">
            {{ size.label }}
          </button>
        </div>
      </div>

      <!-- 布局密度 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">布局密度</label>
        <div class="grid grid-cols-3 gap-2">
          <button
v-for="opt in densityOptions" :key="opt.value" :class="[
              'py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all',
              settings.layoutDensity === opt.value
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            ]"
            @click="settings.layoutDensity = opt.value">
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 开关选项 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">动画效果</p>
            <p class="text-xs text-gray-500 mt-0.5">启用或禁用全局过渡动画</p>
          </div>
          <button
:class="['relative w-12 h-7 rounded-full transition-colors', settings.reduceMotion ? 'bg-gray-300' : 'bg-indigo-500']"
            @click="settings.reduceMotion = !settings.reduceMotion">
            <span :class="['absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', settings.reduceMotion ? 'left-0.5' : 'left-[22px]']"></span>
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">高对比度模式</p>
            <p class="text-xs text-gray-500 mt-0.5">提升视觉对比度，辅助无障碍访问</p>
          </div>
          <button
:class="['relative w-12 h-7 rounded-full transition-colors', settings.highContrast ? 'bg-yellow-500' : 'bg-gray-300']"
            @click="settings.highContrast = !settings.highContrast">
            <span :class="['absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', settings.highContrast ? 'left-[22px]' : 'left-0.5']"></span>
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button class="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors" @click="resetToDefault">
          重置默认
        </button>
        <button class="px-6 py-2.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium shadow-md" @click="saveTheme">
          保存主题设置
        </button>
      </div>
    </div>

    <!-- 成功提示 -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span class="font-medium">主题已保存并应用！</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(100%); opacity: 0; }
</style>
