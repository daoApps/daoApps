<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useDebounce } from '@/composables/useDebounce';
import type { SearchResult, SearchFilter } from '@/types/memory';

/**
 * MemorySearch 组件 Props 接口
 * @interface Props
 */
interface Props {
  /**
   * 搜索数据源数组
   * @default []
   */
  data?: SearchResult[];
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
});

/**
 * MemorySearch 组件事件定义
 * @emits resultSelect - 搜索结果选中事件
 */
const emit = defineEmits<{
  /**
   * 搜索结果选中事件
   * @param {SearchResult} result - 选中的搜索结果对象
   */
  resultSelect: [result: SearchResult];
}>();

const searchQuery = ref('');
const debouncedSearch = useDebounce(searchQuery, 300);
const searchHistory = ref<string[]>([]);
const showFilters = ref(false);
const sortBy = ref<'relevance' | 'time' | 'size'>('relevance');
const filter = reactive<SearchFilter>({
  dateRange: undefined,
  fileType: undefined,
  tags: []
});

const availableTags = computed(() => {
  const tagSet = new Set<string>();
  props.data.forEach((item) => item.tags?.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet);
});

const filteredResults = computed(() => {
  let results = [...props.data];

  // 搜索过滤
  if (debouncedSearch.value) {
    const query = debouncedSearch.value.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
    );
  }

  // 时间范围过滤
  if (filter.dateRange) {
    const start = new Date(filter.dateRange.start).getTime();
    const end = new Date(filter.dateRange.end).getTime();
    results = results.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime >= start && itemTime <= end;
    });
  }

  // 文件类型过滤
  if (filter.fileType) {
    results = results.filter((item) => item.type === filter.fileType);
  }

  // 标签过滤
  if (filter.tags && filter.tags.length > 0) {
    results = results.filter((item) => filter.tags!.some((tag) => item.tags?.includes(tag)));
  }

  // 排序
  switch (sortBy.value) {
    case 'relevance':
      results.sort((a, b) => b.relevance - a.relevance);
      break;
    case 'time':
      results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      break;
    case 'size':
      results.sort((a, b) => (b.size || 0) - (a.size || 0));
      break;
  }

  return results;
});

const highlightText = (text: string, query: string): string => {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>'
  );
};

const addToHistory = (query: string) => {
  if (!query.trim()) return;
  const history = searchHistory.value.filter((h) => h !== query);
  history.unshift(query);
  searchHistory.value = history.slice(0, 10);
};

const selectFromHistory = (query: string) => {
  searchQuery.value = query;
};

const clearHistory = () => {
  searchHistory.value = [];
};

const toggleTag = (tag: string) => {
  const index = filter.tags?.indexOf(tag) ?? -1;
  if (index > -1) {
    filter.tags?.splice(index, 1);
  } else {
    filter.tags?.push(tag);
  }
};

const clearFilters = () => {
  filter.dateRange = undefined;
  filter.fileType = undefined;
  filter.tags = [];
};

watch(debouncedSearch, (newVal) => {
  if (newVal) {
    addToHistory(newVal);
  }
});
</script>

<template>
  <div
    class="memory-search__container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
  >
    <!-- 搜索栏 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索记忆内容..."
          class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        <button
          v-if="searchQuery"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>

      <!-- 搜索历史 -->
      <Transition name="slide">
        <div
          v-if="searchHistory.length > 0 && !debouncedSearch"
          class="mt-3 flex items-center gap-2 flex-wrap"
        >
          <span class="text-xs text-gray-500 dark:text-gray-400">最近搜索:</span>
          <button
            v-for="(item, index) in searchHistory.slice(0, 5)"
            :key="index"
            class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            @click="selectFromHistory(item)"
          >
            {{ item }}
          </button>
          <button
            class="text-xs text-red-500 hover:text-red-600 transition-colors"
            @click="clearHistory"
          >
            清除
          </button>
        </div>
      </Transition>
    </div>

    <!-- 筛选和排序工具栏 -->
    <div
      class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-3">
        <button
          class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
          @click="showFilters = !showFilters"
        >
          🔽 筛选
          <span
            v-if="filter.dateRange || filter.fileType || (filter.tags && filter.tags.length > 0)"
            class="ml-1 w-2 h-2 bg-blue-500 rounded-full"
          ></span>
        </button>

        <!-- 排序选择 -->
        <select
          v-model="sortBy"
          class="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="relevance">相关度排序</option>
          <option value="time">时间排序</option>
          <option value="size">大小排序</option>
        </select>
      </div>

      <div
        class="text-sm font-medium"
        :class="
          filteredResults.length > 0
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        "
      >
        {{ filteredResults.length }} 条结果
      </div>
    </div>

    <!-- 高级筛选面板 -->
    <Transition name="expand">
      <div
        v-if="showFilters"
        class="px-4 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 space-y-4"
      >
        <!-- 时间范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >时间范围</label
          >
          <div class="flex gap-3">
            <input
              v-model="filter.dateRange!.start"
              type="date"
              class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="self-center text-gray-400">至</span>
            <input
              v-model="filter.dateRange!.end"
              type="date"
              class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- 文件类型 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >文件类型</label
          >
          <select
            v-model="filter.fileType"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            <option value="document">文档</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
            <option value="code">代码</option>
            <option value="other">其他</option>
          </select>
        </div>

        <!-- 标签筛选 -->
        <div v-if="availableTags.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >标签</label
          >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag"
              class="px-3 py-1 text-xs rounded-full transition-colors"
              :class="
                filter.tags?.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              "
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <button
          class="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          @click="clearFilters"
        >
          清除所有筛选
        </button>
      </div>
    </Transition>

    <!-- 搜索结果列表 -->
    <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
      <!-- 有结果 -->
      <TransitionGroup v-if="filteredResults.length > 0" name="list">
        <div
          v-for="result in filteredResults"
          :key="result.id"
          class="memory-search__result-item p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
          @click="emit('resultSelect', result)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3
                class="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1"
                v-html="highlightText(result.title, debouncedSearch)"
              ></h3>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2"
                v-html="highlightText(result.content, debouncedSearch)"
              ></p>
              <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{{
                  result.type
                }}</span>
                <span>{{ new Date(result.timestamp).toLocaleDateString('zh-CN') }}</span>
                <span v-if="result.size">{{ (result.size / 1024).toFixed(1) }} KB</span>
              </div>
              <div v-if="result.tags && result.tags.length > 0" class="flex gap-1.5 mt-2 flex-wrap">
                <span
                  v-for="tag in result.tags"
                  :key="tag"
                  class="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div
                class="text-lg font-bold"
                :class="
                  result.relevance > 0.8
                    ? 'text-green-500'
                    : result.relevance > 0.5
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                "
              >
                {{ Math.round(result.relevance * 100) }}%
              </div>
              <div class="text-xs text-gray-400">相关度</div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 无结果 -->
      <div
        v-else-if="debouncedSearch"
        class="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <p class="text-5xl mb-4">🔍</p>
        <p class="text-lg font-medium">未找到匹配结果</p>
        <p class="text-sm mt-2">尝试使用不同的关键词或调整筛选条件</p>
      </div>

      <!-- 空状态（未搜索） -->
      <div v-else class="flex flex-col items-center justify-center py-16 text-gray-400">
        <p class="text-5xl mb-4">💭</p>
        <p class="text-lg font-medium">输入关键词开始搜索</p>
        <p class="text-sm mt-2">支持全文检索，可按时间、类型、标签筛选</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 400px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
