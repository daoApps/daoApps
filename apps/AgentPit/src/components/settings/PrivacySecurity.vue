<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { devices, generateBackupCodes } from '../../data/mockSettings'

const activeSection = ref('password')

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  showCurrent: false,
  showNew: false,
  showConfirm: false,
})

const twoFactorEnabled = ref(false)
const totpStep = ref(0) // 0: 未开始, 1: 显示二维码, 2: 输入验证码, 3: 完成
const totpCode = ref('')
const backupCodes = ref<string[]>([])
const backupCodeGenerated = ref(false)

function getPasswordStrength(password: string): { level: string; color: string; percent: number } {
  if (!password) return { level: '', color: '#e5e7eb', percent: 0 }
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++

  if (strength <= 2) return { level: '弱', color: '#ef4444', percent: 25 }
  if (strength <= 4) return { level: '中', color: '#f59e0b', percent: 60 }
  return { level: '强', color: '#10b981', percent: 100 }
}

const passwordStrength = computed(() => getPasswordStrength(passwordForm.newPassword))

const passwordsMatch = computed(() => !passwordForm.confirmPassword || passwordForm.newPassword === passwordForm.confirmPassword)

function changePassword() {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) return
  alert('密码修改成功（模拟）')
  Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
}

function toggle2FA() {
  if (twoFactorEnabled.value) {
    twoFactorEnabled.value = false
    totpStep.value = 0
    totpCode.value = ''
  } else {
    twoFactorEnabled.value = true
    totpStep.value = 1
  }
}

function verifyTOTP() {
  if (totpCode.value.length === 6) {
    totpStep.value = 3
    backupCodes.value = generateBackupCodes()
    backupCodeGenerated.value = true
  }
}

function regenerateBackupCodes() {
  backupCodes.value = generateBackupCodes()
}

const deviceList = ref(devices.map(d => ({ ...d })))
function forceLogout(deviceId: string) {
  const idx = deviceList.value.findIndex(d => d.id === deviceId)
  if (idx >= 0 && !deviceList.value[idx].isCurrentDevice) {
    deviceList.value.splice(idx, 1)
  }
}

const showDeleteConfirm = ref(false)
function exportData() {
  alert('数据导出功能（模拟）：您的个人数据已打包为 ZIP 文件并开始下载')
}

function deleteAccount() {
  showDeleteConfirm.value = false
  alert('账户注销请求已提交（模拟）：账户将在30天后永久删除')
}
</script>

<template>
  <div class="privacy-security">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">🔒 隐私与安全</h3>

    <!-- 导航标签 -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      <button
v-for="tab in [
        { id: 'password', label: '修改密码' },
        { id: 'twofa', label: '双因素认证' },
        { id: 'devices', label: '会话管理' },
        { id: 'data', label: '数据与账户' },
      ]" :key="tab.id" :class="[
          'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-[1px]',
          activeSection === tab.id
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
        ]"
        @click="activeSection = tab.id">{{ tab.label }}</button>
    </div>

    <!-- 修改密码 -->
    <div v-if="activeSection === 'password'" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">当前密码</label>
        <div class="relative">
          <input
v-model="passwordForm.currentPassword" :type="passwordForm.showCurrent ? 'text' : 'password'"
            placeholder="输入当前密码"
            class="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="passwordForm.showCurrent = !passwordForm.showCurrent">
            <svg v-if="!passwordForm.showCurrent" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 010-2.222L3 9V6l3-3h3L12 3l3 3h3l3 3v3c0 .09-.003.179-.01.267A10.95 10.95 0 0113.875 18.825z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新密码</label>
        <div class="relative">
          <input
v-model="passwordForm.newPassword" :type="passwordForm.showNew ? 'text' : 'password'"
            placeholder="输入新密码（至少8位）"
            class="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="passwordForm.showNew = !passwordForm.showNew">
            <svg v-if="!passwordForm.showNew" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 010-2.222L3 9V6l3-3h3L12 3l3 3h3l3 3v3c0 .09-.003.179-.01.267A10.95 10.95 0 0113.875 18.825z"/></svg>
          </button>
        </div>
        <!-- 密码强度指示器 -->
        <div v-if="passwordForm.newPassword" class="mt-2">
          <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300" :style="{ width: passwordStrength.percent + '%', backgroundColor: passwordStrength.color }"></div>
          </div>
          <p class="text-xs mt-1" :style="{ color: passwordStrength.color }">密码强度：{{ passwordStrength.level }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">确认新密码</label>
        <div class="relative">
          <input
v-model="passwordForm.confirmPassword" :type="passwordForm.showConfirm ? 'text' : 'password'"
            placeholder="再次输入新密码"
            :class="['w-full px-3 py-2.5 pr-10 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none',
              passwordsMatch ? 'border-gray-300 dark:border-gray-600' : 'border-red-400']" />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="passwordForm.showConfirm = !passwordForm.showConfirm">
            <svg v-if="!passwordForm.showConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7z"/></svg>
          </button>
        </div>
        <p v-if="!passwordsMatch && passwordForm.confirmPassword" class="text-xs mt-1 text-red-500">两次输入的密码不一致</p>
      </div>

      <button
:disabled="!passwordForm.currentPassword || !passwordForm.newPassword || !passwordsMatch" class="px-6 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        @click="changePassword">
        修改密码
      </button>
    </div>

    <!-- 双因素认证 -->
    <div v-if="activeSection === 'twofa'" class="space-y-6">
      <!-- 开关 -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div>
          <p class="font-medium text-gray-900 dark:text-white">双因素认证 (2FA)</p>
          <p class="text-xs text-gray-500 mt-0.5">启用后登录需要额外的验证步骤，大幅提升安全性</p>
        </div>
        <button
:class="['relative w-12 h-7 rounded-full transition-colors', twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300']"
          @click="toggle2FA">
          <span :class="['absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', twoFactorEnabled ? 'left-[22px]' : 'left-0.5']"></span>
        </button>
      </div>

      <!-- TOTP 设置流程 -->
      <div v-if="twoFactorEnabled && totpStep > 0" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
        <!-- 步骤1: 二维码 -->
        <div v-if="totpStep === 1">
          <p class="font-medium text-gray-900 dark:text-white mb-3">使用验证器应用扫描二维码</p>
          <div class="flex justify-center my-4">
            <div class="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div class="text-center">
                <svg class="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 4h.01M19 12v1.5M3 12v1.5m0-9h2m6-4h.01M7 21h2m0 0h2m-6 0H5m4-8h4m-4 4h4"/></svg>
                <p class="text-xs text-gray-500 mt-2">TOTP 二维码<br/>（模拟占位）</p>
              </div>
            </div>
          </div>
          <p class="text-xs text-center text-gray-500">推荐使用 Google Authenticator、Authy 或 Microsoft Authenticator</p>
          <button class="w-full mt-4 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium" @click="totpStep = 2">
            我已完成扫描 →
          </button>
        </div>

        <!-- 步骤2: 输入验证码 -->
        <div v-if="totpStep === 2">
          <p class="font-medium text-gray-900 dark:text-white mb-3">输入6位验证码</p>
          <input
v-model="totpCode" type="text" maxlength="6" placeholder="000000"
            class="w-full text-center text-2xl tracking-[1em] px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none font-mono" />
          <button
:disabled="totpCode.length !== 6" class="w-full mt-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
            @click="verifyTOTP">
            验证并激活
          </button>
        </div>

        <!-- 步骤3: 完成 + 备用码 -->
        <div v-if="totpStep === 3">
          <div class="text-center mb-4">
            <span class="text-4xl">✅</span>
            <p class="font-bold text-green-600 mt-2">双因素认证已启用！</p>
          </div>

          <!-- 备用码 -->
          <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-center justify-between mb-2">
              <p class="font-medium text-yellow-800 dark:text-yellow-200 text-sm">⚠️ 备用恢复码</p>
              <button class="text-xs text-yellow-600 hover:text-yellow-800 underline" @click="regenerateBackupCodes">重新生成</button>
            </div>
            <p class="text-xs text-yellow-600 dark:text-yellow-400 mb-3">请妥善保存以下备用码，每个码只能使用一次。当无法使用常规2FA方式时可用于登录。</p>
            <div class="grid grid-cols-2 gap-2">
              <code
v-for="(code, idx) in backupCodes" :key="idx"
                class="px-2 py-1.5 bg-white dark:bg-gray-800 rounded text-xs font-mono text-center text-yellow-800 dark:text-yellow-200 select-all">
                {{ code }}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 会话管理 -->
    <div v-if="activeSection === 'devices'" class="space-y-4">
      <div
v-for="device in deviceList" :key="device.id"
        class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div
class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          :class="device.type === 'mobile' ? 'bg-blue-100 dark:bg-blue-900/30' : device.type === 'tablet' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-green-100 dark:bg-green-900/30'">
          {{ device.type === 'mobile' ? '📱' : device.type === 'tablet' ? '📋' : '💻' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-medium text-gray-900 dark:text-white truncate">{{ device.name }}</p>
            <span v-if="device.isCurrentDevice" class="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">当前设备</span>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">{{ device.os }} · {{ device.browser }} · {{ device.ip }}</p>
          <p class="text-xs text-gray-400">最后活跃：{{ new Date(device.lastActive).toLocaleString('zh-CN') }}</p>
        </div>
        <button
v-if="!device.isCurrentDevice" class="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
          @click="forceLogout(device.id)">
          强制下线
        </button>
      </div>
    </div>

    <!-- 数据与账户 -->
    <div v-if="activeSection === 'data'" class="space-y-6">
      <button
class="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
        @click="exportData">
        <span class="text-2xl">📦</span>
        <div class="text-left flex-1">
          <p class="font-medium text-blue-700 dark:text-blue-300">导出个人数据</p>
          <p class="text-xs text-blue-500 dark:text-blue-400">下载您在平台上的所有数据（ZIP格式）</p>
        </div>
        <svg class="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      </button>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
          <h4 class="font-bold text-red-700 dark:text-red-400 mb-2">⚠️ 危险操作区域</h4>
          <p class="text-sm text-red-600 dark:text-red-400 mb-4">注销账户是永久性操作，删除后数据无法恢复！</p>
          <button
class="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md"
            @click="showDeleteConfirm = true">
            注销我的账户
          </button>
        </div>
      </div>
    </div>

    <!-- 账户注销确认弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showDeleteConfirm = false">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div class="text-center">
              <div class="text-5xl mb-3">🚨</div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">确认注销账户？</h3>
              <p class="text-sm text-gray-500 mb-6">此操作不可逆！您的所有数据将在30天后被永久删除。</p>
              <div class="flex gap-3">
                <button class="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="showDeleteConfirm = false">
                  取消
                </button>
                <button class="flex-1 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold" @click="deleteAccount">
                  确认注销
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.2s ease; }
.modal-enter-from > div { transform: scale(0.95); }
.modal-leave-to > div { transform: scale(0.95); }

.h-1\.5 { height: 0.375rem; }
.w-4\.5 { width: 1.125rem; }
.h-4\.5 { height: 1.125rem; }
.left-\[18px\] { left: 72%; }
.left-\[22px\] { left: 88%; }
</style>
