<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TimelineEvent } from '@/types/memory';

interface Props {
  events?: TimelineEvent[];
}

const props = withDefaults(defineProps<Props>(), {
  events: () => []
});

const emit = defineEmits<{
  eventClick: [event: TimelineEvent];
}>();

const timeFilter = ref<'today' | 'week' | 'month' | 'custom'>('month');
const customDateRange = ref<{ start: string; end: string }>({ start: '', end: '' });
const zoomLevel = ref<'year' | 'month' | 'day' | 'hour'>('day');
const expandedEvents = ref<Set<string>>(new Set());

const eventTypeConfig: Record<
  TimelineEvent['type'],
  { icon: string; color: string; label: string }
> = {
  creation: { icon: '✨', color: '#10b981', label: '创建' },
  modification: { icon: '✏️', color: '#3b82f6', label: '修改' },
  deletion: { icon: '🗑️', color: '#ef4444', label: '删除' },
  access: { icon: '👁️', color: '#8b5cf6', label: '访问' },
  backup: { icon: '💾', color: '#f59e0b', label: '备份' }
};

const filteredEvents = computed(() => {
  let events = [...props.events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeFilter.value) {
    case 'today':
      events = events.filter((e) => new Date(e.timestamp) >= today);
      break;
    case 'week': {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      events = events.filter((e) => new Date(e.timestamp) >= weekAgo);
      break;
    }
    case 'month': {
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      events = events.filter((e) => new Date(e.timestamp) >= monthAgo);
      break;
    }
    case 'custom':
      if (customDateRange.value.start && customDateRange.value.end) {
        events = events.filter((e) => {
          const eventTime = new Date(e.timestamp).getTime();
          return (
            eventTime >= new Date(customDateRange.value.start).getTime() &&
            eventTime <= new Date(customDateRange.value.end).getTime()
          );
        });
      }
      break;
  }

  return events;
});

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  switch (zoomLevel.value) {
    case 'year':
      return date.toLocaleDateString('zh-CN', { year: 'numeric' });
    case 'month':
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    case 'day':
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    case 'hour':
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return date.toLocaleDateString('zh-CN');
  }
};

const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  return formatTimestamp(timestamp);
};

const toggleExpand = (eventId: string) => {
  if (expandedEvents.value.has(eventId)) {
    expandedEvents.value.delete(eventId);
  } else {
    expandedEvents.value.add(eventId);
  }
};

const scrollToEvent = (eventId: string) => {
  const element = document.getElementById(`event-${eventId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
</script>

<template>
  <div
    class="memory-timeline__container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
  >
    <!-- 工具栏 -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap items-center gap-4">
        <!-- 时间范围筛选 -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">时间范围:</span>
          <div class="flex gap-1">
            <button
              v-for="option in [
                { value: 'today', label: '今天' },
                { value: 'week', label: '本周' },
                { value: 'month', label: '本月' },
                { value: 'custom', label: '自定义' }
              ]"
              :key="option.value"
              class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              :class="
                timeFilter === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              "
              @click="timeFilter = option.value as 'today' | 'week' | 'month' | 'custom'"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- 自定义日期范围 -->
        <Transition v-if="timeFilter === 'custom'" name="slide">
          <div class="flex items-center gap-2">
            <input
              v-model="customDateRange.start"
              type="date"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-400">至</span>
            <input
              v-model="customDateRange.end"
              type="date"
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Transition>

        <!-- 缩放级别 -->
        <div class="flex items-center gap-2 ml-auto">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">缩放:</span>
          <select
            v-model="zoomLevel"
            class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="year">年</option>
            <option value="month">月</option>
            <option value="day">日</option>
            <option value="hour">小时</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div
      class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400">
        共
        <span class="font-semibold text-gray-900 dark:text-white">{{ filteredEvents.length }}</span>
        条记录
      </div>
      <div class="flex gap-4 text-xs">
        <div v-for="(config, type) in eventTypeConfig" :key="type" class="flex items-center gap-1">
          <span>{{ config.icon }}</span>
          <span class="text-gray-500">{{ config.label }}:</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ filteredEvents.filter((e) => e.type === type).length }}
          </span>
        </div>
      </div>
    </div>

    <!-- 时间线内容 -->
    <div ref="timelineRef" class="relative max-h-[600px] overflow-y-auto p-6">
      <!-- 空状态 -->
      <div
        v-if="filteredEvents.length === 0"
        class="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <p class="text-5xl mb-4">📅</p>
        <p class="text-lg font-medium">暂无时间线记录</p>
        <p class="text-sm mt-2">选择其他时间范围查看更多记录</p>
      </div>

      <!-- 时间轴 -->
      <div v-else class="relative">
        <!-- 中轴线 -->
        <div
          class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400"
        ></div>

        <!-- 时间节点 -->
        <TransitionGroup name="timeline" tag="div" class="space-y-6">
          <div
            v-for="(event, _index) in filteredEvents"
            :id="`event-${event.id}`"
            :key="event.id"
            class="memory-timeline__event relative pl-20 group"
          >
            <!-- 时间点标记 -->
            <div
              class="absolute left-5 top-6 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all duration-200 group-hover:scale-110"
              :style="{
                backgroundColor: eventTypeConfig[event.type].color + '20',
                border: `3px solid ${eventTypeConfig[event.type].color}`
              }"
              :class="{ 'w-9 h-9 ring-4 ring-offset-2': event.isImportant }"
            >
              <span class="text-sm">{{ eventTypeConfig[event.type].icon }}</span>
              <!-- 重要事件标记 -->
              <div
                v-if="event.isImportant"
                class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
              ></div>
            </div>

            <!-- 时间戳 -->
            <div class="absolute left-0 top-6 text-right w-16">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ formatTimestamp(event.timestamp) }}
              </div>
              <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                {{ formatRelativeTime(event.timestamp) }}
              </div>
            </div>

            <!-- 事件卡片 -->
            <div
              class="bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
              @click="toggleExpand(event.id)"
            >
              <!-- 卡片头部 -->
              <div class="p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1"
                    >
                      {{ event.title }}
                      <span
                        v-if="event.isImportant"
                        class="ml-2 px-2 py-0.5 text-[10px] font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
                      >
                        重要
                      </span>
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {{ event.description }}
                    </p>
                  </div>

                  <!-- 缩略图 -->
                  <div
                    v-if="event.thumbnail"
                    class="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="event.thumbnail"
                      :alt="event.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <!-- 标签和操作 -->
                <div
                  class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 text-xs font-medium rounded-full"
                      :style="{
                        backgroundColor: eventTypeConfig[event.type].color + '20',
                        color: eventTypeConfig[event.type].color
                      }"
                    >
                      {{ eventTypeConfig[event.type].label }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ expandedEvents.has(event.id) ? '收起 ▲' : '展开 ▼' }}</span>
                  </div>
                </div>
              </div>

              <!-- 展开的详细信息 -->
              <Transition name="expand">
                <div
                  v-if="expandedEvents.has(event.id)"
                  class="px-4 pb-4 pt-0 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-600"
                >
                  <div class="pt-4 space-y-3">
                    <div v-if="event.metadata">
                      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        详细信息
                      </h4>
                      <div class="grid grid-cols-2 gap-2 text-xs">
                        <div v-for="(value, key) in event.metadata" :key="key" class="flex gap-2">
                          <span class="text-gray-500 dark:text-gray-400">{{ key }}:</span>
                          <span class="text-gray-900 dark:text-white font-medium">{{
                            String(value)
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <button
                        class="flex-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        @click.stop="emit('eventClick', event)"
                      >
                        查看详情
                      </button>
                      <button
                        class="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        @click.stop="scrollToEvent(event.id)"
                      >
                        定位
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </TransitionGroup>
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

.timeline-enter-active,
.timeline-leave-active {
  transition: all 0.4s ease;
}
.timeline-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.timeline-leave-to {
  opacity: 0;
  transform: translateX(30px);
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
  max-height: 300px;
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
