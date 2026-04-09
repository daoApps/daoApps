<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { themeColors, fontOptions, type AgentConfig } from '../../data/mockCustomize'

interface Props {
  modelValue: AgentConfig['appearance']
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: AgentConfig['appearance']]
}>()

const themeId = ref(props.modelValue.themeId)
const customPrimary = ref('#3B82F6')
const useCustomColor = ref(false)
const titleFont = ref(props.modelValue.titleFont)
const bodyFont = ref(props.modelValue.bodyFont)
const fontSize = ref(props.modelValue.fontSize)
const layoutStyle = ref(props.modelValue.layoutStyle)
const borderRadius = ref(props.modelValue.borderRadius)
const shadowIntensity = ref(props.modelValue.shadowIntensity)
const darkMode = ref(props.modelValue.darkMode)

const currentTheme = computed(() => themeColors.find(t => t.id === themeId.value))
const activePrimary = computed(() => useCustomColor.value ? customPrimary.value : currentTheme.value?.primary || '#3B82F6')
const activeSecondary = computed(() => currentTheme.value?.secondary || '#60A5FA')
const activeAccent = computed(() => currentTheme.value?.accent || '#2563EB')
const activeBackground = computed(() => currentTheme.value?.background || '#EFF6FF')

const complementaryColor = computed(() => {
  const hex = activePrimary.value.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgb(${255 - r}, ${255 - g}, ${255 - b})`
})

const analogousColors = computed(() => {
  const hex = activePrimary.value.replace('#', '')
  let r = parseInt(hex.substr(0, 2), 16)
  let g = parseInt(hex.substr(2, 2), 16)
  let b = parseInt(hex.substr(4, 2), 16)
  const shift = 30
  const toHex = (c: number) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')
  return [
    `#${toHex(r + shift)}${toHex(g - shift)}${toHex(b)}`,
    `#${toHex(r - shift)}${toHex(g + shift)}${toHex(b + shift)}`
  ]
})

const layoutOptions = [
  { value: 'card', label: '卡片式', icon: '🎴' },
  { value: 'list', label: '列表式', icon: '📋' },
  { value: 'timeline', label: '时间线式', icon: '📅' },
  { value: 'dashboard', label: '仪表盘式', icon: '📊' }
]

const shadowOptions = [
  { value: 'none' as const, label: '无' },
  { value: 'light' as const, label: '轻' },
  { value: 'medium' as const, label: '中' },
  { value: 'heavy' as const, label: '重' }
]

const emitUpdate = () => {
  emit('update:modelValue', {
    themeId: themeId.value,
    customColors: useCustomColor.value ? {
      primary: customPrimary.value,
      secondary: activeSecondary.value,
      accent: activeAccent.value
    } : undefined,
    titleFont: titleFont.value,
    bodyFont: bodyFont.value,
    fontSize: fontSize.value,
    layoutStyle: layoutStyle.value,
    borderRadius: borderRadius.value,
    shadowIntensity: shadowIntensity.value,
    darkMode: darkMode.value
  })
}

watch([themeId, customPrimary, useCustomColor, titleFont, bodyFont, fontSize, layoutStyle, borderRadius, shadowIntensity, darkMode], () => {
  emitUpdate()
}, { deep: true })

const resetToDefault = () => {
  themeId.value = 'theme-blue'
  customPrimary.value = '#3B82F6'
  useCustomColor.value = false
  titleFont.value = 'system-ui'
  bodyFont.value = 'system-ui'
  fontSize.value = 16
  layoutStyle.value = 'card'
  borderRadius.value = 12
  shadowIntensity.value = 'medium'
  darkMode.value = false
}
</script>

<template>
  <div class="space-y-8">
    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        颜色主题
      </h3>
      <div class="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
        <button
          v-for="theme in themeColors"
          :key="theme.id"
          type="button"
          @click="themeId = theme.id; useCustomColor = false"
          class="relative group p-1 rounded-xl transition-all hover:scale-105"
          :class="themeId === theme.id && !useCustomColor ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''"
          :aria-label="`选择${theme.name}主题`"
        >
          <div class="w-full aspect-square rounded-lg" :style="{ background: theme.preview }"></div>
          <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{{ theme.name }}</span>
        </button>
      </div>

      <div class="flex items-center gap-3 mt-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="useCustomColor" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">使用自定义颜色</span>
        </label>
        <input
          v-if="useCustomColor"
          type="color"
          v-model="customPrimary"
          class="w-10 h-10 rounded cursor-pointer border-0"
          aria-label="自定义主色调"
        />
      </div>

      <div v-if="currentTheme || useCustomColor" class="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">实时预览</p>
        <div class="flex items-center gap-4">
          <div
            class="w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-white font-medium shadow-lg transition-all"
            :style="{
              background: `linear-gradient(135deg, ${activePrimary}, ${activeSecondary})`,
              borderRadius: `${borderRadius}px`,
              boxShadow: shadowIntensity !== 'none' ? `0 ${shadowIntensity === 'heavy' ? '20' : shadowIntensity === 'medium' ? '10' : '4'}px ${activePrimary}40` : 'none'
            }"
          >
            <span class="text-2xl">AI</span>
            <span class="text-[10px] opacity-80 mt-0.5" :style="{ fontFamily: bodyFont, fontSize: `${fontSize * 0.6}px` }">智能体</span>
          </div>
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">主色</span>
              <div class="w-8 h-4 rounded" :style="{ backgroundColor: activePrimary }"></div>
              <span class="text-[10px] font-mono text-gray-400">{{ activePrimary }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">辅助</span>
              <div class="w-8 h-4 rounded" :style="{ backgroundColor: activeSecondary }"></div>
              <span class="text-[10px] font-mono text-gray-400">{{ activeSecondary }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">互补</span>
              <div class="w-8 h-4 rounded" :style="{ backgroundColor: complementaryColor }"></div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">类似</span>
              <div v-for="(color, i) in analogousColors" :key="i" class="w-6 h-4 rounded" :style="{ backgroundColor: color }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        字体设置
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">标题字体</label>
          <select
            v-model="titleFont"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            aria-label="标题字体选择"
          >
            <option v-for="font in fontOptions" :key="font.id" :value="font.id" :style="{ fontFamily: font.family }">{{ font.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">正文字体</label>
          <select
            v-model="bodyFont"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            aria-label="正文字体选择"
          >
            <option v-for="font in fontOptions" :key="font.id" :value="font.id" :style="{ fontFamily: font.family }">{{ font.label }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
          字号大小：{{ fontSize }}px
        </label>
        <input
          type="range"
          v-model.number="fontSize"
          min="12"
          max="24"
          step="1"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          aria-label="字号调节"
        />
        <div class="flex justify-between text-[10px] text-gray-400 mt-0.5">
          <span>12px</span>
          <span>24px</span>
        </div>
        <div
          class="mt-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          :style="{
            fontFamily: fontOptions.find(f => f.id === bodyFont)?.family,
            fontSize: `${fontSize}px`,
            backgroundColor: darkMode ? '#1f2937' : activeBackground,
            color: darkMode ? '#e5e7eb' : currentTheme?.text || '#1E40AF',
            borderRadius: `${borderRadius}px`
          }"
        >
          <p :style="{ fontFamily: fontOptions.find(f => f.id === titleFont)?.family, fontWeight: 600 }">字体效果预览</p>
          <p class="mt-1 opacity-80">这是一段示例文本，用于展示当前字体和字号的显示效果。</p>
        </div>
      </div>
    </section>

    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        布局风格
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          v-for="opt in layoutOptions"
          :key="opt.value"
          type="button"
          @click="layoutStyle = opt.value as any"
          class="p-3 rounded-xl border-2 transition-all text-center"
          :class="
            layoutStyle === opt.value
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          "
        >
          <span class="text-2xl block mb-1">{{ opt.icon }}</span>
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ opt.label }}</span>
        </button>
      </div>
    </section>

    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
        样式细节
      </h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
            圆角大小：{{ borderRadius }}px
          </label>
          <input
            type="range"
            v-model.number="borderRadius"
            min="0"
            max="20"
            step="1"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            aria-label="圆角调节"
          />
          <div class="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>0px (直角)</span>
            <span>20px (圆润)</span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">阴影强度</label>
          <div class="flex gap-2">
            <button
              v-for="opt in shadowOptions"
              :key="opt.value"
              type="button"
              @click="shadowIntensity = opt.value"
              class="flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
              :class="
                shadowIntensity === opt.value
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              "
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between pt-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">深色模式</span>
          <button
            type="button"
            @click="darkMode = !darkMode"
            class="relative w-12 h-6 rounded-full transition-colors"
            :class="darkMode ? 'bg-indigo-500' : 'bg-gray-300'"
            role="switch"
            :aria-checked="darkMode"
            aria-label="切换深色模式"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              :class="darkMode ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
        </div>
      </div>
    </section>

    <button
      type="button"
      @click="resetToDefault"
      class="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      重置为默认设置
    </button>
  </div>
</template>
