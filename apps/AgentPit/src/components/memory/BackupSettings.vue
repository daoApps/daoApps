<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { BackupConfig, BackupRecord } from '@/types/memory'

interface Props {
  config?: BackupConfig
  history?: BackupRecord[]
  estimatedSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    autoBackup: true,
    frequency: 'daily',
    backupType: 'incremental',
    retentionCount: 5,
    location: 'local'
  }),
  history: () => [],
  estimatedSize: () => 0
})

const emit = defineEmits<{
  configChange: [config: BackupConfig]
  manualBackup: []
  restore: [recordId: string]
}>()

const localConfig = reactive<BackupConfig>({ ...props.config })
const isBackingUp = ref(false)
const backupProgress = ref(0)
const showRestoreDialog = ref(false)
const selectedRestoreRecord = ref<BackupRecord | null>(null)

const isModified = computed(() => {
  return (
    localConfig.autoBackup !== props.config.autoBackup ||
    localConfig.frequency !== props.config.frequency ||
    localConfig.backupType !== props.config.backupType ||
    localConfig.retentionCount !== props.config.retentionCount ||
    localConfig.location !== props.config.location
  )
})

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' GB'
}

const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatus = (status: BackupRecord['status']): { color: string; label: string; icon: string } => {
  const statusMap: Record<BackupRecord['status'], { color: string; label: string; icon: string }> = {
    success: { color: '#10b981', label: '成功', icon: '✓' },
    failed: { color: '#ef4444', label: '失败', icon: '✗' },
    in_progress: { color: '#3b82f6', label: '进行中', icon: '⟳' }
  }
  return statusMap[status]
}

const handleManualBackup = async () => {
  isBackingUp.value = true
  backupProgress.value = 0

  // 模拟备份进度
  const interval = setInterval(() => {
    backupProgress.value += Math.random() * 15
    if (backupProgress.value >= 100) {
      backupProgress.value = 100
      clearInterval(interval)

      setTimeout(() => {
        isBackingUp.value = false
        backupProgress.value = 0
        emit('manualBackup')
      }, 500)
    }
  }, 200)
}

const handleRestoreClick = (record: BackupRecord) => {
  selectedRestoreRecord.value = record
  showRestoreDialog.value = true
}

const confirmRestore = () => {
  if (selectedRestoreRecord.value) {
    emit('restore', selectedRestoreRecord.value.id)
  }
  showRestoreDialog.value = false
  selectedRestoreRecord.value = null
}

const saveConfig = () => {
  emit('configChange', { ...localConfig })
}
</script>

<template>
  <div class="backup-settings__container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <!-- 标题 -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            💾 备份设置
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">配置自动备份策略和管理备份记录</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500 dark:text-gray-400">预计存储空间</div>
          <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatFileSize(estimatedSize) }}</div>
        </div>
      </div>
    </div>

    <!-- 备份策略配置 -->
    <div class="p-6 space-y-6">
      <!-- 自动备份开关 -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">自动备份</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">开启后将按照设定的频率自动创建备份</p>
        </div>
        <button
          @click="localConfig.autoBackup = !localConfig.autoBackup"
          class="relative w-14 h-7 rounded-full transition-colors duration-200"
          :class="localConfig.autoBackup ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
        >
          <span
            class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
            :class="localConfig.autoBackup ? 'translate-x-7' : ''"
          ></span>
        </button>
      </div>

      <!-- 备份频率 -->
      <div v-if="localConfig.autoBackup" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">备份频率</label>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="option in [
              { value: 'hourly', label: '每小时', desc: '适合高频更新数据' },
              { value: 'daily', label: '每天', desc: '推荐日常使用' },
              { value: 'weekly', label: '每周', desc: '节省存储空间' }
            ]"
            :key="option.value"
            @click="localConfig.frequency = option.value as BackupConfig['frequency']"
            class="p-3 rounded-lg border-2 transition-all text-left"
            :class="
              localConfig.frequency === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            "
          >
            <div class="font-medium text-sm" :class="localConfig.frequency === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'">
              {{ option.label }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ option.desc }}</div>
          </button>
        </div>
      </div>

      <!-- 备份类型 -->
      <div v-if="localConfig.autoBackup" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">备份类型</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="localConfig.backupType = 'incremental'"
            class="p-4 rounded-lg border-2 transition-all text-left"
            :class="
              localConfig.backupType === 'incremental'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            "
          >
            <div class="font-medium" :class="localConfig.backupType === 'incremental' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'">
              📦 增量备份
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">仅备份变更部分，速度快，空间占用小</div>
          </button>

          <button
            @click="localConfig.backupType = 'full'"
            class="p-4 rounded-lg border-2 transition-all text-left"
            :class="
              localConfig.backupType === 'full'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            "
          >
            <div class="font-medium" :class="localConfig.backupType === 'full' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'">
              🔄 完整备份
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">完整复制所有数据，恢复更可靠</div>
          </button>
        </div>
      </div>

      <!-- 保留数量和位置 -->
      <div v-if="localConfig.autoBackup" class="grid grid-cols-2 gap-6">
        <!-- 保留数量 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            保留备份数量: <span class="font-bold text-blue-600 dark:text-blue-400">{{ localConfig.retentionCount }}</span> 个
          </label>
          <input
            v-model.number="localConfig.retentionCount"
            type="range"
            min="1"
            max="10"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <!-- 备份位置 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">备份位置</label>
          <select
            v-model="localConfig.location"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="local">🖥️ 本地存储</option>
            <option value="cloud">☁️ 云端存储（即将推出）</option>
          </select>
        </div>
      </div>

      <!-- 保存配置按钮 -->
      <div v-if="isModified" class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="saveConfig"
          class="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
        >
          💾 保存配置
        </button>
      </div>
    </div>

    <!-- 手动备份区域 -->
    <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-t border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">手动备份</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">立即创建一次完整的备份快照</p>
        </div>
        <button
          @click="handleManualBackup"
          :disabled="isBackingUp"
          class="px-6 py-2.5 font-medium rounded-lg transition-all shadow-md"
          :class="
            isBackingUp
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg'
          "
        >
          {{ isBackingUp ? `备份中 ${Math.round(backupProgress)}%` : '⚡ 立即备份' }}
        </button>
      </div>

      <!-- 进度条 -->
      <Transition name="expand">
        <div v-if="isBackingUp" class="mt-4">
          <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out relative"
              :style="{ width: backupProgress + '%' }"
            >
              <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 备份历史列表 -->
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 备份历史</h3>

      <div v-if="history.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-4xl mb-3">📭</p>
        <p class="text-sm">暂无备份记录</p>
      </div>

      <div v-else class="space-y-3">
        <TransitionGroup name="list" tag="div" class="space-y-3">
          <div
            v-for="record in history"
            :key="record.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <!-- 状态图标 -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                :style="{ backgroundColor: getStatus(record.status).color + '20' }"
              >
                {{ getStatus(record.status).icon }}
              </div>

              <!-- 信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :style="{ backgroundColor: getStatus(record.status).color + '20', color: getStatus(record.status).color }"
                  >
                    {{ getStatus(record.status).label }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ record.type === 'full' ? '完整' : '增量' }}备份
                  </span>
                </div>
                <div class="text-sm text-gray-900 dark:text-white font-medium mt-1 truncate">
                  {{ formatTimestamp(record.timestamp) }}
                </div>
              </div>

              <!-- 大小 -->
              <div class="text-right flex-shrink-0">
                <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatFileSize(record.size) }}</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity ml-4 flex-shrink-0">
              <button
                v-if="record.status === 'success'"
                @click="handleRestoreClick(record)"
                class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                🔄 恢复
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- 恢复确认对话框 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showRestoreDialog && selectedRestoreRecord" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="showRestoreDialog = false">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" @click.stop>
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-4xl">
                ⚠️
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">确认恢复备份？</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                此操作将使用以下备份数据覆盖当前数据：
              </p>
              <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left space-y-1">
                <div class="text-sm"><strong>时间:</strong> {{ formatTimestamp(selectedRestoreRecord.timestamp) }}</div>
                <div class="text-sm"><strong>大小:</strong> {{ formatFileSize(selectedRestoreRecord.size) }}</div>
                <div class="text-sm"><strong>类型:</strong> {{ selectedRestoreRecord.type === 'full' ? '完整' : '增量' }}备份</div>
              </div>
              <p class="mt-4 text-xs text-red-500 font-medium">⚠️ 恢复操作不可撤销，请确保已做好当前数据的备份！</p>
            </div>

            <div class="flex gap-3">
              <button
                @click="showRestoreDialog = false"
                class="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                @click="confirmRestore"
                class="flex-1 px-4 py-2.5 bg-red-500 text-white hover:bg-red-600 rounded-lg font-medium transition-colors"
              >
                确认恢复
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
