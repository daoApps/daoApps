<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDebounce } from '../../composables/useDebounce';
import { faqData, versionInfo } from '../../data/mockSettings';

const searchQuery = ref('');
const debouncedSearch = useDebounce(() => searchQuery.value, 300);
const expandedId = ref<string | null>(null);
const activeCategory = ref<string | null>(null);

const categories = [
  { id: 'getting-started', label: '🚀 快速入门', count: 0 },
  { id: 'features', label: '🔧 功能使用', count: 0 },
  { id: 'billing', label: '💰 计费与支付', count: 0 },
  { id: 'security', label: '🔐 安全与隐私', count: 0 },
  { id: 'troubleshooting', label: '❌ 故障排除', count: 0 }
];

categories.forEach((cat) => {
  cat.count = faqData.filter((f) => f.category === cat.id).length;
});

const filteredFAQs = computed(() => {
  const q = debouncedSearch.value.toLowerCase().trim();
  let result = faqData;
  if (activeCategory.value) {
    result = result.filter((f) => f.category === activeCategory.value);
  }
  if (q) {
    result = result.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.content.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return result;
});

const groupedFAQs = computed(() => {
  const groups: Record<string, typeof faqData> = {};
  categories.forEach((cat) => {
    groups[cat.id] = [];
  });
  filteredFAQs.value.forEach((faq) => {
    if (!groups[faq.category]) groups[faq.category] = [];
    groups[faq.category].push(faq);
  });
  return groups;
});

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

function setCategory(catId: string | null) {
  activeCategory.value = catId;
  expandedId.value = null;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/- (.*)/g, '<li>$1</li>')
    .replace(/(\d+)\. (.*)/g, '$2');
}
</script>

<template>
  <div class="help-center">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">❓ 帮助中心</h3>

    <!-- 搜索框 -->
    <div class="relative mb-6">
      <svg
        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索问题、关键词..."
        class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <span
        v-if="searchQuery && !debouncedSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400"
        >搜索中...</span
      >
    </div>

    <!-- 分类筛选 -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          !activeCategory
            ? 'bg-indigo-500 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
        ]"
        @click="setCategory(null)"
      >
        全部 ({{ faqData.length }})
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          activeCategory === cat.id
            ? 'bg-indigo-500 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
        ]"
        @click="setCategory(cat.id)"
      >
        {{ cat.label }} ({{ cat.count }})
      </button>
    </div>

    <!-- FAQ 折叠面板列表 -->
    <div class="space-y-3">
      <template v-for="(faqs, categoryId) in groupedFAQs" :key="categoryId">
        <div v-if="faqs.length > 0">
          <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 mt-4 first:mt-0">
            {{ categories.find((c) => c.id === categoryId)?.label }}
          </p>

          <TransitionGroup name="faq-list">
            <div
              v-for="faq in faqs"
              :key="faq.id"
              class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              <button
                class="w-full flex items-center justify-between p-4 text-left group"
                @click="toggleExpand(faq.id)"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <span class="text-lg flex-shrink-0">{{
                    expandedId === faq.id ? '📖' : '💡'
                  }}</span>
                  <span
                    class="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate"
                    >{{ faq.title }}</span
                  >
                </div>
                <svg
                  class="w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2"
                  :class="{ 'rotate-180': expandedId === faq.id }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <Transition name="accordion">
                <div v-if="expandedId === faq.id" class="px-4 pb-4 overflow-hidden">
                  <div class="pl-10 pr-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div
                      class="prose prose-sm dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2"
                      v-html="renderMarkdown(faq.content)"
                    ></div>
                    <div
                      class="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700"
                    >
                      <span
                        v-for="tag in faq.tags"
                        :key="tag"
                        class="px-2 py-0.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </TransitionGroup>
        </div>
      </template>

      <div v-if="filteredFAQs.length === 0" class="text-center py-12 text-gray-400">
        <span class="text-4xl block mb-3">🔍</span>
        <p>未找到相关问题</p>
        <p class="text-sm mt-1">尝试使用其他关键词搜索</p>
      </div>
    </div>

    <!-- 联系客服和快捷键 -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <div
        class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl"
      >
        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">💬 联系客服</h4>
        <div class="space-y-2 text-sm">
          <a
            href="#"
            class="flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline"
          >
            <span>💬</span> 在线聊天
          </a>
          <a
            href="#"
            class="flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline"
          >
            <span>📧</span> support@example.com
          </a>
          <a
            href="#"
            class="flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline"
          >
            <span>📞</span> 400-123-4567
          </a>
        </div>
      </div>

      <div
        class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl"
      >
        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">⌨️ 常用快捷键</h4>
        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">全局搜索</span
            ><kbd
              class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono"
              >Ctrl+K</kbd
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">切换侧边栏</span
            ><kbd
              class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono"
              >Ctrl+B</kbd
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">保存内容</span
            ><kbd
              class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono"
              >Ctrl+S</kbd
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">关闭弹窗</span
            ><kbd
              class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono"
              >Esc</kbd
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">快捷键帮助</span
            ><kbd
              class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono"
              >Ctrl+/</kbd
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="mt-6 text-center text-xs text-gray-400">
      <p>{{ versionInfo.version }} · 发布于 {{ versionInfo.releaseDate }}</p>
      <p class="mt-1">© 2026 AgentPit Team. All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped>
.faq-list-enter-active,
.faq-list-leave-active {
  transition: all 0.3s ease;
}
.faq-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.faq-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}

.prose strong {
  color: inherit;
  font-weight: 600;
}
.prose li::before {
  content: '• ';
  color: #6366f1;
  font-weight: bold;
  margin-right: 4px;
}
.prose br + li::before {
  display: none;
}
</style>
