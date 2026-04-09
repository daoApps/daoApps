<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import UserRecommendList from '../components/social/UserRecommendList.vue'
import DatingMatch from '../components/social/DatingMatch.vue'
import SocialFeed from '../components/social/SocialFeed.vue'
import FriendsSystem from '../components/social/FriendsSystem.vue'
import MeetingRoom from '../components/social/MeetingRoom.vue'
import NotificationPanel from '../components/social/NotificationPanel.vue'

const activeTab = ref('recommend')

const tabs = [
  { id: 'recommend', label: '推荐', icon: '👥', component: UserRecommendList },
  { id: 'match', label: '匹配', icon: '💕', component: DatingMatch },
  { id: 'feed', label: '动态', icon: '📱', component: SocialFeed },
  { id: 'friends', label: '好友', icon: '👥', component: FriendsSystem },
  { id: 'meeting', label: '会议', icon: '📹', component: MeetingRoom },
  { id: 'notifications', label: '通知', icon: '🔔', component: NotificationPanel },
]
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <div class="px-4 sm:px-6 lg:px-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 py-4">
              社交连接
            </h1>
            
            <nav class="-mb-px flex space-x-1 overflow-x-auto pb-0 custom-scrollbar">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-t-lg group"
                :class="
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                "
                @click="activeTab = tab.id"
              >
                <span class="mr-1.5">{{ tab.icon }}</span>
                {{ tab.label }}
                
                <span
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                ></span>
              </button>
            </nav>
          </div>
        </div>

        <div class="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-250px)]">
          <Transition name="fade" mode="out-in">
            <KeepAlive>
              <component :is="tabs.find(t => t.id === activeTab)?.component" :key="activeTab" />
            </KeepAlive>
          </Transition>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">👥</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">在线</span>
          </div>
          <h3 class="text-2xl font-bold">128</h3>
          <p class="text-sm text-blue-100 mt-1">活跃好友</p>
        </div>

        <div class="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">💕</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">新匹配</span>
          </div>
          <h3 class="text-2xl font-bold">12</h3>
          <p class="text-sm text-pink-100 mt-1">本周匹配数</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">📹</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">进行中</span>
          </div>
          <h3 class="text-2xl font-bold">3</h3>
          <p class="text-sm text-green-100 mt-1">活跃会议</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
