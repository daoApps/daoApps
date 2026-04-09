<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import LifestyleDashboard from '../components/lifestyle/LifestyleDashboard.vue'
import MeetingCalendar from '../components/lifestyle/MeetingCalendar.vue'
import TravelPlanner from '../components/lifestyle/TravelPlanner.vue'
import GameCenter from '../components/lifestyle/GameCenter.vue'

const activeTab = ref('dashboard')

const tabs = [
  { id: 'dashboard', label: '总览', icon: '📊', component: LifestyleDashboard },
  { id: 'calendar', label: '日历', icon: '📅', component: MeetingCalendar },
  { id: 'travel', label: '旅行', icon: '✈️', component: TravelPlanner },
  { id: 'games', label: '游戏', icon: '🎮', component: GameCenter },
]
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 页面标题 -->
      <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <h1 class="text-2xl sm:text-3xl font-bold">生活服务</h1>
        <p class="mt-2 text-indigo-100 max-w-xl">一站式生活管理工具，包含日历、旅行规划、休闲游戏等实用功能</p>

        <!-- Tab 导航 -->
        <nav class="flex gap-1 mt-5 overflow-x-auto pb-1">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            :class="[
              'relative px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5',
              activeTab === tab.id
                ? 'bg-white/20 backdrop-blur-sm shadow-md text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            ]">
            <span>{{ tab.icon }}</span>{{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- 内容区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[500px]">
        <Transition name="page-fade" mode="out-in">
          <KeepAlive>
            <component :is="tabs.find(t => t.id === activeTab)?.component" :key="activeTab" />
          </KeepAlive>
        </Transition>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.page-fade-enter-active, .page-fade-leave-active { transition: all 0.3s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }

::-webkit-scrollbar { height: 0; width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
</style>
