<script setup lang="ts">
import { ref, computed } from 'vue'
import { templates, templateCategories } from '@/data/mockSphinx'
import type { Template } from '@/data/mockSphinx'

const props = defineProps<{
  onSelectTemplate: (template: Template) => void
  selectedTemplateId?: string
}>()

const selectedCategory = ref<string>('all')
const previewTemplate = ref<Template | null>(null)

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return templates
  }
  return templates.filter((t) => t.category === selectedCategory.value)
})

const handleSelectWithPreview = (template: Template) => {
  props.onSelectTemplate(template)
  previewTemplate.value = null
}

const getCategoryInfo = (categoryId: string) => {
  return templateCategories.find((c) => c.id === categoryId)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">选择网站模板</h3>

      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="category in templateCategories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-1">{{ category.icon }}</span>
          {{ category.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        @click="previewTemplate = template"
        :class="[
          'group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2',
          selectedTemplateId === template.id
            ? 'border-blue-500 ring-2 ring-blue-200'
            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
        ]"
      >
        <div class="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
          {{ template.thumbnail }}
        </div>

        <div class="p-4">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ template.name }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ template.description }}</p>

          <div class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="feature in template.features.slice(0, 3)"
              :key="feature"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
            >
              {{ feature }}
            </span>
            <span
              v-if="template.features.length > 3"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
            >
              +{{ template.features.length - 3 }}
            </span>
          </div>
        </div>

        <div
          v-if="selectedTemplateId === template.id"
          class="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          ✓
        </div>
      </div>
    </div>

    <!-- 模板预览弹窗 -->
    <Teleport to="body">
      <div
        v-if="previewTemplate"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="previewTemplate = null"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          @click.stop
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ previewTemplate.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ getCategoryInfo(previewTemplate.category)?.icon }} {{ getCategoryInfo(previewTemplate.category)?.label }}
                </p>
              </div>
              <button
                @click="previewTemplate = null"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                ✕
              </button>
            </div>

            <div class="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center text-8xl mb-6">
              {{ previewTemplate.thumbnail }}
            </div>

            <p class="text-gray-700 dark:text-gray-300 mb-4">{{ previewTemplate.description }}</p>

            <div class="mb-4">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">主要功能</h4>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="feature in previewTemplate.features"
                  :key="feature"
                  class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>

            <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-semibold text-blue-900 dark:text-blue-300 mb-1">适用场景</h4>
              <p class="text-sm text-blue-700 dark:text-blue-400">{{ previewTemplate.suitableFor }}</p>
            </div>

            <div class="flex space-x-3">
              <button
                @click="handleSelectWithPreview(previewTemplate)"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
              >
                选择此模板
              </button>
              <button
                @click="previewTemplate = null"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
