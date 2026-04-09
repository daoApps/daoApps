<script setup lang="ts">
import { ref, computed } from 'vue'
import { meetings as mockMeetings, todoItems, weeklyActivities, getTodayTip } from '../../data/mockLifestyle'

const highestGameScore = computed(() =>
  Math.max(
    Number(localStorage.getItem('snake-high-score') || '0'),
    Number(localStorage.getItem('tetris-high-score') || '0'),
    Number(localStorage.getItem('game2048-high-score') || '0')
  )
)

const todayMeetings = computed(() => {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return mockMeetings.filter(m => m.date === dateStr)
})

const pendingTodos = computed(() => todoItems.filter(t => !t.completed))
const todayTip = ref(getTodayTip())

interface RecentActivity {
  id: string
  type: 'meeting' | 'todo' | 'tip'
  title: string
  time: string
  icon: string
}

const recentActivities = computed<RecentActivity[]>(() => {
  const activities: RecentActivity[] = []
  todayMeetings.value.slice(0, 3).forEach(m => {
    activities.push({ id: m.id, type: 'meeting', title: `📅 ${m.title}`, time: m.startTime, icon: '📅' })
  })
  pendingTodos.value.slice(0, 3).forEach(t => {
    activities.push({ id: t.id, type: 'todo', title: `✅ ${t.title}`, time: t.dueDate, icon: '✅' })
  })
  if (todayTip.value) {
    activities.push({ id: 'tip-1', type: 'tip', title: `💡 ${todayTip.value.content.substring(0, 30)}...`, time: '今日', icon: '💡' })
  }
  return activities.sort(() => Math.random() - 0.5).slice(0, 6)
})

const chartData = computed(() => ({
  labels: weeklyActivities.map(d => d.day),
  datasets: [
    { label: '会议', data: weeklyActivities.map(d => d.meetings), color: '#3b82f6' },
    { label: '旅行', data: weeklyActivities.map(d => d.travel), color: '#10b981' },
    { label: '游戏', data: weeklyActivities.map(d => d.games), color: '#f59e0b' },
    { label: '待办', data: weeklyActivities.map(d => d.todos), color: '#8b5cf6' },
  ]
}))

function getBarHeight(value: number): string {
  const maxVal = Math.max(...chartData.value.datasets.flatMap(d => d.data))
  return `${(value / maxVal) * 100}%`
}
</script>

<template>
  <div class="lifestyle-dashboard space-y-6">
    <!-- 概览卡片网格 -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 今日会议 -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-3xl">📅</span>
          <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">{{ todayMeetings.length }} 个会议</span>
        </div>
        <h3 class="text-2xl font-bold">{{ todayMeetings.length }}</h3>
        <p class="text-sm text-blue-100 mt-1">今日会议数</p>
        <p v-if="todayMeetings[0]" class="text-xs text-blue-200 mt-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
          下一个：{{ todayMeetings[0].title }}
        </p>
      </div>

      <!-- 待办事项 -->
      <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-3xl">⏰</span>
          <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">{{ pendingTodos.length }} 待处理</span>
        </div>
        <h3 class="text-2xl font-bold">{{ pendingTodos.length }}</h3>
        <p class="text-sm text-green-100 mt-1">待办事项提醒</p>
        <p v-if="pendingTodos[0]" class="text-xs text-green-200 mt-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
          {{ pendingTodos[0].title }}
        </p>
      </div>

      <!-- 游戏成就 -->
      <div class="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-3xl">🎮</span>
          <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">最高分</span>
        </div>
        <h3 class="text-2xl font-bold">{{ highestGameScore }}</h3>
        <p class="text-sm text-purple-100 mt-1">游戏成就</p>
        <p class="text-xs text-purple-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          贪吃蛇 · 俄罗斯方块 · 2048
        </p>
      </div>

      <!-- 生活小贴士 -->
      <div class="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <span class="text-3xl">{{ todayTip?.icon || '💡' }}</span>
          <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">每日一贴</span>
        </div>
        <h3 class="text-base font-bold line-clamp-2 leading-tight">{{ todayTip?.content || '' }}</h3>
        <p class="text-sm text-orange-100 mt-2">生活小贴士</p>
      </div>

      <!-- 本周统计 -->
      <div class="col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 class="font-bold text-gray-900 dark:text-white mb-4">📊 本周活动统计</h3>
        <div class="flex items-end gap-2 h-[160px]">
          <div v-for="(day, idx) in weeklyActivities" :key="day.day" class="flex-1 flex flex-col items-center gap-1">
            <div class="w-full flex gap-0.5 items-end h-[130px]">
              <div v-for="dataset in chartData.datasets" :key="dataset.label"
                :title="`${day.day} ${dataset.label}: ${dataset.data[idx]}`"
                class="flex-1 rounded-t-md transition-all duration-300 hover:opacity-80"
                :style="{ height: getBarHeight(dataset.data[idx]), backgroundColor: dataset.color, minHeight: dataset.data[idx] > 0 ? '4px' : '0' }">
              </div>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ day.day.replace('周', '') }}</span>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-3 text-xs">
          <span v-for="dataset in chartData.datasets" :key="dataset.label" class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: dataset.color }"></span>
            <span class="text-gray-500 dark:text-gray-400">{{ dataset.label }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button class="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
        <span class="text-2xl group-hover:scale-110 transition-transform">📅</span>
        <span class="font-medium text-blue-700 dark:text-blue-300 text-sm">日历管理</span>
      </button>
      <button class="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
        <span class="text-2xl group-hover:scale-110 transition-transform">✈️</span>
        <span class="font-medium text-green-700 dark:text-green-300 text-sm">旅游规划</span>
      </button>
      <button class="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
        <span class="text-2xl group-hover:scale-110 transition-transform">🎮</span>
        <span class="font-medium text-purple-700 dark:text-purple-300 text-sm">游戏中心</span>
      </button>
      <button class="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
        <span class="text-2xl group-hover:scale-110 transition-transform">⚙️</span>
        <span class="font-medium text-orange-700 dark:text-orange-300 text-sm">系统设置</span>
      </button>
    </div>

    <!-- 最近活动时间线 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 dark:text-white mb-4">🕐 最近活动</h3>
      <div class="relative pl-6">
        <div class="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-300 to-purple-300"></div>
        <div class="space-y-3">
          <TransitionGroup name="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id"
              class="relative flex items-start gap-3 group">
              <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white dark:bg-gray-800 ring-2 ring-indigo-400"></div>
              <div class="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ activity.time }}</p>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-list-enter-active, .activity-list-leave-active { transition: all 0.3s ease; }
.activity-list-enter-from { opacity: 0; transform: translateX(-15px); }
.activity-list-leave-to { opacity: 0; transform: translateX(15px); }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
