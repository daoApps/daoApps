<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { categories } from '@/data/mockMarketplace'
import { useDebounce } from '@/composables/useDebounce'

export interface FilterState {
  search: string
  category: string
  subCategory: string
  priceRange: [number, number]
  minRating: number
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'sales' | 'rating' | 'newest' | 'discount'
  deliveryType: string[]
}

interface Props {
  totalResults: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filterChange: [filters: FilterState]
}>()

const filters = reactive<FilterState>({
  search: '',
  category: '',
  subCategory: '',
  priceRange: [0, 100000],
  minRating: 0,
  sortBy: 'default',
  deliveryType: []
})

const searchInput = ref('')
const debouncedSearch = useDebounce(searchInput, 300)
const expandedCategories = ref<Set<string>>(new Set())
const showMobileFilters = ref(false)

const sortOptions = [
  { value: 'default', label: '综合排序', icon: '📊' },
  { value: 'sales', label: '销量优先', icon: '🔥' },
  { value: 'rating', label: '好评优先', icon: '⭐' },
  { value: 'newest', label: '最新上架', icon: '🆕' },
  { value: 'price_asc', label: '价格从低到高', icon: '↑' },
  { value: 'price_desc', label: '价格从高到低', icon: '↓' },
  { value: 'discount', label: '折扣力度', icon: '💰' }
]

watch(debouncedSearch, (newVal) => {
  filters.search = newVal
})

watch(
  () => ({ ...filters }),
  () => {
    emit('filterChange', { ...filters })
  },
  { deep: true }
)

const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
  filters[key] = value
}

const handleCategorySelect = (categoryId: string, subCategoryId?: string) => {
  filters.category = categoryId
  filters.subCategory = subCategoryId || ''
  if (!subCategoryId) {
    toggleCategoryExpand(categoryId)
  }
}

const toggleCategoryExpand = (categoryId: string) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

const clearAllFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.subCategory = ''
  filters.priceRange = [0, 100000]
  filters.minRating = 0
  filters.sortBy = 'default'
  filters.deliveryType = []
  searchInput.value = ''
}

const activeFilterCount = computed(() => {
  const activeFilters = [
    filters.search,
    filters.category,
    filters.subCategory,
    filters.minRating > 0 ? String(filters.minRating) : '',
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? '1' : '',
    filters.deliveryType.length > 0 ? '1' : ''
  ].filter(Boolean)
  return activeFilters.length
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-3 items-center">
      <div class="flex-1 relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchInput"
          type="text"
          placeholder="搜索商品、服务、课程..."
          class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 dark:text-white"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <button
        @click="showMobileFilters = true"
        class="lg:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 transition-colors relative"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        筛选
        <span v-if="activeFilterCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <div class="flex gap-4">
      <aside class="hidden lg:block w-56 flex-shrink-0">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-4 space-y-4">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">全部分类</h3>
          <div class="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            <button
              @click="handleCategorySelect('')"
              :class="[
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors',
                !filters.category
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              <span>📦</span>
              <span>全部商品</span>
            </button>

            <div v-for="category in categories" :key="category.id">
              <button
                @click="
                  category.children
                    ? toggleCategoryExpand(category.id)
                    : null;
                  handleCategorySelect(category.id)
                "
                :class="[
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                  filters.category === category.id && !filters.subCategory
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">{{ category.icon }}</span>
                  <span>{{ category.name }}</span>
                </div>
                <svg
                  v-if="category.children"
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform',
                    expandedCategories.has(category.id) ? 'rotate-90' : ''
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div v-if="category.children && expandedCategories.has(category.id)" class="ml-4 mt-1 space-y-0.5">
                <button
                  v-for="sub in category.children"
                  :key="sub.id"
                  @click="handleCategorySelect(category.id, sub.id)"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                    filters.subCategory === sub.id
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <span>{{ sub.name }}</span>
                  <span class="text-xs text-gray-400">{{ sub.count }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex-1 space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-500 dark:text-gray-400">排序：</span>
              <div class="flex gap-1.5 flex-wrap">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="updateFilter('sortBy', option.value as FilterState['sortBy'])"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    filters.sortBy === option.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="ml-auto text-sm text-gray-500 dark:text-gray-400">
              共 <span class="font-semibold text-primary-600 dark:text-primary-400">{{ totalResults }}</span> 个结果
            </div>
          </div>

          <div class="flex flex-wrap gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">价格</label>
              <input
                type="number"
                placeholder="最低"
                :value="filters.priceRange[0] || ''"
                @input="(e) => updateFilter('priceRange', [parseInt((e.target as HTMLInputElement).value) || 0, filters.priceRange[1]])"
                class="w-20 px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span class="text-gray-400">-</span>
              <input
                type="number"
                placeholder="最高"
                :value="filters.priceRange[1] >= 100000 ? '' : filters.priceRange[1]"
                @input="(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt((e.target as HTMLInputElement).value) || 100000])"
                class="w-20 px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">评分</label>
              <select
                :value="filters.minRating"
                @change="(e) => updateFilter('minRating', Number((e.target as HTMLSelectElement).value))"
                class="px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option :value="0">不限</option>
                <option :value="4">4分以上</option>
                <option :value="4.5">4.5分以上</option>
                <option :value="4.8">4.8分以上</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">类型</label>
              <template v-for="type in ['digital', 'physical', 'service']" :key="type">
                <button
                  @click="
                    const types = [...filters.deliveryType];
                    const idx = types.indexOf(type);
                    if (idx > -1) {
                      types.splice(idx, 1);
                    } else {
                      types.push(type);
                    }
                    updateFilter('deliveryType', types)
                  "
                  :class="[
                    'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                    filters.deliveryType.includes(type)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ type === 'digital' ? '数字产品' : type === 'physical' ? '实体商品' : '服务' }}
                </button>
              </template>
            </div>

            <button
              v-if="activeFilterCount > 0"
              @click="clearAllFilters"
              class="ml-auto text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除筛选
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden">
      <div class="absolute inset-0 bg-black/40" @click="showMobileFilters = false" />
      <div class="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between z-10">
          <h3 class="font-semibold text-gray-900 dark:text-white">筛选条件</h3>
          <button
            @click="showMobileFilters = false"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 space-y-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">分类</h4>
            <div class="space-y-1">
              <button
                @click="handleCategorySelect('')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm',
                  !filters.category
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                全部商品
              </button>

              <div v-for="category in categories" :key="category.id">
                <button
                  @click="
                    category.children
                      ? toggleCategoryExpand(category.id)
                      : null;
                    handleCategorySelect(category.id)
                  "
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm',
                    filters.category === category.id && !filters.subCategory
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <div class="flex items-center gap-2.5">
                    <span>{{ category.icon }}</span>
                    <span>{{ category.name }}</span>
                  </div>
                  <svg
                    v-if="category.children"
                    :class="['w-4 h-4 text-gray-400 transition-transform', expandedCategories.has(category.id) ? 'rotate-90' : '']"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div v-if="category.children && expandedCategories.has(category.id)" class="ml-4 mt-1 space-y-0.5">
                  <button
                    v-for="sub in category.children"
                    :key="sub.id"
                    @click="handleCategorySelect(category.id, sub.id)"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-lg text-sm',
                      filters.subCategory === sub.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                  >
                    {{ sub.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">价格区间</h4>
            <div class="flex gap-2 items-center">
              <input
                type="number"
                placeholder="最低价"
                :value="filters.priceRange[0] || ''"
                @input="(e) => updateFilter('priceRange', [parseInt((e.target as HTMLInputElement).value) || 0, filters.priceRange[1]])"
                class="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span class="text-gray-400">-</span>
              <input
                type="number"
                placeholder="最高价"
                :value="filters.priceRange[1] >= 100000 ? '' : filters.priceRange[1]"
                @input="(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt((e.target as HTMLInputElement).value) || 100000])"
                class="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">最低评分</h4>
            <select
              :value="filters.minRating"
              @change="(e) => updateFilter('minRating', Number((e.target as HTMLSelectElement).value))"
              class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option :value="0">不限</option>
              <option :value="4">4分以上</option>
              <option :value="4.5">4.5分以上</option>
              <option :value="4.8">4.8分以上</option>
            </select>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">商品类型</h4>
            <div class="space-y-2">
              <label
                v-for="{ value, label } in [
                  { value: 'digital', label: '数字产品' },
                  { value: 'physical', label: '实体商品' },
                  { value: 'service', label: '专业服务' }
                ]"
                :key="value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="filters.deliveryType.includes(value)"
                  @change="
                    const types = [...filters.deliveryType];
                    const idx = types.indexOf(value);
                    if (idx > -1) {
                      types.splice(idx, 1);
                    } else {
                      types.push(value);
                    }
                    updateFilter('deliveryType', types)
                  "
                  class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <button
            @click="clearAllFilters"
            class="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            重置
          </button>
          <button
            @click="showMobileFilters = false"
            class="flex-1 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
          >
            确定 ({{ totalResults }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
