<script setup lang="ts">
import type { Notification } from '@/composables/useRealtimeData'

interface Props {
  notifications: Notification[]
}

defineProps<Props>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const notificationConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '✕'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ'
  }
}
</script>

<template>
  <div v-if="notifications.length > 0" class="space-y-2">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'flex items-start justify-between p-4 rounded-lg border shadow-sm',
          notificationConfig[notification.type].bg,
          notificationConfig[notification.type].border
        ]"
      >
        <div class="flex items-start gap-3 flex-1">
          <span :class="['text-lg font-bold', notificationConfig[notification.type].text]">
            {{ notificationConfig[notification.type].icon }}
          </span>
          <div class="flex-1">
            <h4 :class="['font-semibold text-sm', notificationConfig[notification.type].text]">
              {{ notification.title }}
            </h4>
            <p :class="['text-sm mt-1', notificationConfig[notification.type].text]">
              {{ notification.message }}
            </p>
          </div>
        </div>

        <button
          @click="emit('remove', notification.id)"
          class="ml-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
