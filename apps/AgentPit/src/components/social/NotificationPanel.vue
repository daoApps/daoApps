<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import type { Notification } from '../../types/social'
import { mockNotifications } from '../../data/mockSocial'

const notifications = ref<Notification[]>([...mockNotifications])
const filterType = ref<'all' | 'system' | 'interaction' | 'message'>('all')

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredNotifications = computed(() => {
  if (filterType.value === 'all') return notifications.value
  return notifications.value.filter(n => n.type === filterType.value)
})

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

const markAsRead = (notifId: string) => {
  const notif = notifications.value.find(n => n.id === notifId)
  if (notif && !notif.read) {
    notif.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
}

const clearAll = () => {
  if (confirm('确定要清空所有通知吗？')) {
    notifications.value = []
  }
}

const deleteNotification = (notifId: string) => {
  notifications.value = notifications.value.filter(n => n.id !== notifId)
}

const handleNotificationClick = (notification: Notification) => {
  markAsRead(notification.id)
  
  if (notification.actionUrl) {
    console.log('Navigate to:', notification.actionUrl)
  }
}

const getTypeIcon = (type: Notification['type']) => {
  switch (type) {
    case 'system': return '🔔'
    case 'interaction': return '💬'
    case 'message': return '📩'
    default: return '📌'
  }
}

const getTypeColor = (type: Notification['type']) => {
  switch (type) {
    case 'system': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    case 'interaction': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
    case 'message': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

provide('unreadCount', unreadCount)
provide('markAllAsRead', markAllAsRead)

defineExpose({
  unreadCount,
  markAllAsRead,
})
</script>

<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <span>通知中心</span>
          <span
            v-if="unreadCount > 0"
            class="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded-full animate-pulse"
          >
            {{ unreadCount }}
          </span>
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">查看所有通知和消息</p>
      </div>

      <div class="flex items-center space-x-3">
        <button
          v-if="unreadCount > 0"
          class="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          @click="markAllAsRead"
        >
          全部已读
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          @click="clearAll"
        >
          清空
        </button>
      </div>
    </div>

    <div class="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <button
        v-for="(label, type) in { all: '全部', system: '系统', interaction: '互动', message: '消息' }"
        :key="type"
        class="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          filterType === type
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        "
        @click="filterType = type as 'all' | 'system' | 'interaction' | 'message'"
      >
        {{ label }}
        <span
          v-if="type !== 'all'"
          class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
          :class="
            filterType === type
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          "
        >
          {{ notifications.filter(n => n.type === type).length }}
        </span>
      </button>
    </div>

    <div class="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      <TransitionGroup name="notification">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer group hover:shadow-md"
          :class="[
            notification.read
              ? 'border-gray-200 dark:border-gray-700 opacity-75'
              : 'border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-500',
          ]"
          @click="handleNotificationClick(notification)"
        >
          <div class="p-5 flex items-start space-x-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              :class="getTypeColor(notification.type)"
            >
              {{ notification.icon || getTypeIcon(notification.type) }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <h4
                  class="font-semibold text-gray-900 dark:text-white"
                  :class="{ 'font-bold': !notification.read }"
                >
                  {{ notification.title }}
                </h4>
                <button
                  class="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all text-gray-400 hover:text-red-500"
                  @click.stop="deleteNotification(notification.id)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{{ notification.content }}</p>

              <div class="flex items-center space-x-3 mt-3">
                <span class="text-xs text-gray-400">{{ formatTimeAgo(notification.timestamp) }}</span>
                
                <span
                  v-if="!notification.read"
                  class="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full"
                >
                  未读
                </span>

                <span
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="getTypeColor(notification.type)"
                >
                  {{ notification.type === 'system' ? '系统' : notification.type === 'interaction' ? '互动' : '消息' }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="!notification.read"
            class="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse"
          ></div>
        </div>
      </TransitionGroup>

      <div v-if="filteredNotifications.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">暂无通知</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">您目前没有任何通知消息</p>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        共 {{ notifications.length }} 条通知 · {{ unreadCount }} 条未读
      </p>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.notification-enter-active {
  transition: all 0.4s ease-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
