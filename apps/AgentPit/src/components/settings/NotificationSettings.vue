<script setup lang="ts">
import { ref, reactive } from 'vue'
import { defaultNotificationConfig, soundOptions } from '../../data/mockSettings'

const config = reactive({ ...defaultNotificationConfig })
const showSuccessToast = ref(false)

function saveNotification() {
  localStorage.setItem('notification-config', JSON.stringify(config))
  showSuccessToast.value = true
  setTimeout(() => { showSuccessToast.value = false }, 2500)
}

function resetToDefault() {
  Object.assign(config, defaultNotificationConfig)
}

const channelLabels: Record<string, string> = {
  systemAnnouncement: '系统公告',
  agentMessage: '智能体消息',
  socialInteraction: '社交互动',
  transactionAlert: '交易提醒',
  securityAlert: '安全警报',
}

const aggregationModes = [
  { value: 'instant' as const, label: '即时推送', desc: '收到通知立即发送' },
  { value: 'hourly' as const, label: '每小时摘要', desc: '每小时汇总一次' },
  { value: 'daily' as const, label: '每天摘要', desc: '每天固定时间汇总' },
]
</script>

<template>
  <div class="notification-settings">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">🔔 通知设置</h3>

    <div class="space-y-8">
      <!-- 通知渠道开关矩阵 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">通知渠道</label>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50">
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 rounded-tl-lg">通知类型</th>
                <th class="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">浏览器推送</th>
                <th class="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">应用内</th>
                <th class="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">邮件</th>
                <th class="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400 rounded-tr-lg">短信</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(_channels, key) in config.channels" :key="key"
                class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ channelLabels[key] || key }}</td>

                <!-- 浏览器推送 -->
                <td class="py-3 px-2 text-center">
                  <button @click="config.channels[key].browserPush = !config.channels[key].browserPush"
                    :class="['relative w-10 h-5.5 rounded-full transition-colors inline-flex', config.channels[key].browserPush ? 'bg-indigo-500' : 'bg-gray-300']">
                    <span :class="['absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform', config.channels[key].browserPush ? 'left-[18px]' : 'left-0.5']"></span>
                  </button>
                </td>

                <!-- 应用内 -->
                <td class="py-3 px-2 text-center">
                  <button @click="config.channels[key].inApp = !config.channels[key].inApp"
                    :class="['relative w-10 h-5.5 rounded-full transition-colors inline-flex', config.channels[key].inApp ? 'bg-indigo-500' : 'bg-gray-300']">
                    <span :class="['absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform', config.channels[key].inApp ? 'left-[18px]' : 'left-0.5']"></span>
                  </button>
                </td>

                <!-- 邮件 -->
                <td class="py-3 px-2 text-center">
                  <button v-if="'email' in config.channels[key]" @click="(config.channels[key] as any).email = !(config.channels[key] as any).email"
                    :class="['relative w-10 h-5.5 rounded-full transition-colors inline-flex', (config.channels[key] as any).email ? 'bg-indigo-500' : 'bg-gray-300']">
                    <span :class="['absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform', (config.channels[key] as any).email ? 'left-[18px]' : 'left-0.5']"></span>
                  </button>
                  <span v-else class="text-gray-300 dark:text-gray-600">—</span>
                </td>

                <!-- 短信 -->
                <td class="py-3 px-2 text-center">
                  <button v-if="'sms' in config.channels[key]" @click="(config.channels[key] as any).sms = !(config.channels[key] as any).sms"
                    :class="['relative w-10 h-5.5 rounded-full transition-colors inline-flex', (config.channels[key] as any).sms ? 'bg-indigo-500' : 'bg-gray-300']">
                    <span :class="['absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform', (config.channels[key] as any).sms ? 'left-[18px]' : 'left-0.5']"></span>
                  </button>
                  <span v-else class="text-gray-300 dark:text-gray-600">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 免打扰时间段 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">免打扰时间段</label>
        <p class="text-xs text-gray-500 mb-3">在此期间将不会收到非紧急通知</p>
        <div class="flex items-center gap-3">
          <input v-model="config.doNotDisturbStart" type="time"
            class="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
          <span class="text-gray-500">至</span>
          <input v-model="config.doNotDisturbEnd" type="time"
            class="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
          <span class="text-sm text-gray-500 whitespace-nowrap">{{ config.doNotDisturbStart }} - {{ config.doNotDisturbEnd }}</span>
        </div>
      </div>

      <!-- 聚合模式 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">通知聚合模式</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button v-for="mode in aggregationModes" :key="mode.value" @click="config.aggregationMode = mode.value"
            :class="[
              'p-4 rounded-xl border-2 text-left transition-all',
              config.aggregationMode === mode.value
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
            ]">
            <p :class="['font-medium', config.aggregationMode === mode.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white']">{{ mode.label }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ mode.desc }}</p>
          </button>
        </div>
      </div>

      <!-- 声音选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">提示音</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="sound in soundOptions" :key="sound.id" @click="config.sound = sound.id"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm transition-all',
              config.sound === sound.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
            ]">
            <span>{{ sound.icon }}</span>
            <span>{{ sound.name }}</span>
            <svg v-if="config.sound === sound.id" class="w-4 h-4 text-indigo-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </button>
        </div>
      </div>

      <!-- 震动开关 -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div>
          <p class="font-medium text-gray-900 dark:text-white">震动反馈</p>
          <p class="text-xs text-gray-500 mt-0.5">移动端震动提示（当前设备占位）</p>
        </div>
        <button @click="config.vibration = !config.vibration"
          :class="['relative w-12 h-7 rounded-full transition-colors', config.vibration ? 'bg-indigo-500' : 'bg-gray-300']">
          <span :class="['absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', config.vibration ? 'left-[22px]' : 'left-0.5']"></span>
        </button>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="resetToDefault" class="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">
          重置默认
        </button>
        <button @click="saveNotification" class="px-6 py-2.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium shadow-md">
          保存设置
        </button>
      </div>
    </div>

    <!-- 成功提示 -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span class="font-medium">通知设置已保存！</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(100%); opacity: 0; }
</style>
