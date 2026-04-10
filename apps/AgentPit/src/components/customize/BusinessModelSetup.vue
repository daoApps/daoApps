<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AgentConfig } from '../../data/mockCustomize'

interface Props {
  modelValue: AgentConfig['businessModel']
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: AgentConfig['businessModel']]
}>()

const mode = ref(props.modelValue.mode)
const pricing = ref({ ...props.modelValue.pricing })
const membershipLevels = ref(props.modelValue.membershipLevels || [])
const serviceLimits = ref({
  availableSlots: props.modelValue.serviceLimits.availableSlots || [{ start: '00:00', end: '23:59' }],
  maxConcurrentUsers: props.modelValue.serviceLimits.maxConcurrentUsers || 50,
  dailyRequestLimit: props.modelValue.serviceLimits.dailyRequestLimit || 1000,
  apiRateLimit: props.modelValue.serviceLimits.apiRateLimit || 60
})
const platformCommission = ref(props.modelValue.platformCommission)
const trialDays = ref(props.modelValue.pricing.trialDays || 0)

const newSlotStart = ref('09:00')
const newSlotEnd = ref('18:00')

const modeOptions = [
  { value: 'free', label: '免费模式', icon: '🆓', desc: '无限制但带水印' },
  { value: 'subscription', label: '订阅制', icon: '🔄', desc: '月付/季付/年付' },
  { value: 'payPerUse', label: '按次付费', icon: '💰', desc: '单次价格设置' },
  { value: 'membership', label: '会员等级', icon: '👑', desc: '普通/VIP/SVIP 三档' }
]

const estimatedMonthlyRevenue = computed(() => {
  const baseUsers = Math.max(100, serviceLimits.value.maxConcurrentUsers * 10)
  const requestsPerUser = Math.min(serviceLimits.value.dailyRequestLimit, 50)
  const totalRequests = baseUsers * requestsPerUser * 30
  const commissionRate = (100 - platformCommission.value) / 100

  switch (mode.value) {
    case 'free':
      return 0
    case 'subscription':
      return ((pricing.value.monthlyPrice || 0) * baseUsers * commissionRate)
    case 'payPerUse':
      return ((pricing.value.perUsePrice || 0) * totalRequests * commissionRate)
    case 'membership': {
      const avgPrice = membershipLevels.value.reduce((sum, l) => sum + l.price, 0) / (membershipLevels.value.length || 1)
      return avgPrice * baseUsers * 0.6 * commissionRate
    }
    default:
      return 0
  }
})

const addTimeSlot = () => {
  if (newSlotStart.value && newSlotEnd.value) {
    serviceLimits.value.availableSlots.push({ start: newSlotStart.value, end: newSlotEnd.value })
    newSlotStart.value = '09:00'
    newSlotEnd.value = '18:00'
    emitUpdate()
  }
}

const removeTimeSlot = (index: number) => {
  serviceLimits.value.availableSlots.splice(index, 1)
  emitUpdate()
}

const addMembershipLevel = () => {
  membershipLevels.value.push({
    name: `等级 ${membershipLevels.value.length + 1}`,
    price: 0,
    features: []
  })
  emitUpdate()
}

const removeMembershipLevel = (index: number) => {
  membershipLevels.value.splice(index, 1)
  emitUpdate()
}

const updateMembershipFeature = (levelIndex: number, featureIndex: number, value: string) => {
  if (membershipLevels.value[levelIndex]) {
    membershipLevels.value[levelIndex].features[featureIndex] = value
    emitUpdate()
  }
}

const addMembershipFeature = (levelIndex: number) => {
  if (membershipLevels.value[levelIndex]) {
    membershipLevels.value[levelIndex].features.push('')
    emitUpdate()
  }
}

const removeMembershipFeature = (levelIndex: number, featureIndex: number) => {
  if (membershipLevels.value[levelIndex]) {
    membershipLevels.value[levelIndex].features.splice(featureIndex, 1)
    emitUpdate()
  }
}

const emitUpdate = () => {
  emit('update:modelValue', {
    mode: mode.value as any,
    pricing: { ...pricing.value, trialDays: trialDays.value },
    membershipLevels: mode.value === 'membership' ? [...membershipLevels.value] : undefined,
    serviceLimits: { ...serviceLimits.value },
    platformCommission: platformCommission.value,
    trialSettings: trialDays.value > 0 ? { days: trialDays.value, featureLimits: ['高级功能受限'] } : undefined
  })
}

watch([mode, pricing, serviceLimits, platformCommission, trialDays], () => {
  emitUpdate()
}, { deep: true })
</script>

<template>
  <div class="space-y-8">
    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        定价模式
      </h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="opt in modeOptions"
          :key="opt.value"
          type="button"
          class="p-4 rounded-xl border-2 transition-all text-center group"
          :class="
            mode === opt.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          "
          @click="mode = opt.value as any"
        >
          <span class="text-2xl block mb-1.5">{{ opt.icon }}</span>
          <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 block">{{ opt.label }}</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 block">{{ opt.desc }}</span>
        </button>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="mode === 'subscription'" key="sub" class="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">月付价格 (¥)</label>
              <input
v-model.number="pricing.monthlyPrice" type="number" min="0" step="1" placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">季付价格 (¥)</label>
              <input
v-model.number="pricing.quarterlyPrice" type="number" min="0" step="1" placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">年付价格 (¥)</label>
              <input
v-model.number="pricing.yearlyPrice" type="number" min="0" step="1" placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div v-else-if="mode === 'payPerUse'" key="ppu" class="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">单次调用价格 (¥)</label>
          <div class="flex items-center gap-3">
            <input
v-model.number="pricing.perUsePrice" type="number" min="0" step="0.01" placeholder="0.00"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <span class="text-sm text-gray-500">/ 次</span>
          </div>
        </div>

        <div v-else-if="mode === 'membership'" key="mem" class="mt-6 space-y-3">
          <div v-for="(level, idx) in membershipLevels" :key="idx" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex items-center justify-between mb-3">
              <input
v-model="level.name" type="text" placeholder="等级名称"
                class="font-medium text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 text-gray-800 dark:text-gray-200" @input="emitUpdate" />
              <div class="flex items-center gap-2">
                <span class="text-lg font-bold text-blue-600 dark:text-blue-400">¥{{ level.price }}</span>
                <input v-model.number="level.price" type="number" min="0" step="1" class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent text-right focus:ring-1 focus:ring-blue-500 outline-none" @input="emitUpdate" />
                <span class="text-xs text-gray-400">/月</span>
                <button v-if="membershipLevels.length > 1" type="button" class="text-red-400 hover:text-red-600 p-1" aria-label="删除等级" @click="removeMembershipLevel(idx)">×</button>
              </div>
            </div>
            <div class="space-y-1.5">
              <div v-for="(feature, fIdx) in level.features" :key="fIdx" class="flex items-center gap-2">
                <span class="text-green-500 text-xs">✓</span>
                <input
type="text" :value="feature" placeholder="功能描述..."
                  class="flex-1 text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 outline-none focus:ring-1 focus:ring-blue-500" @input="updateMembershipFeature(idx, fIdx, ($event.target as HTMLInputElement).value)" />
                <button type="button" class="text-gray-400 hover:text-red-500 text-xs" @click="removeMembershipFeature(idx, fIdx)">×</button>
              </div>
              <button type="button" class="text-xs text-blue-500 hover:text-blue-600 pl-4" @click="addMembershipFeature(idx)">+ 添加功能</button>
            </div>
          </div>
          <button type="button" class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 hover:text-blue-500 hover:border-blue-400 transition-colors" @click="addMembershipLevel">
            + 添加会员等级
          </button>
        </div>
      </Transition>
    </section>

    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        服务范围
      </h3>
      <div class="space-y-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">可用时段</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
v-for="(slot, idx) in serviceLimits.availableSlots" :key="idx"
              class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
              {{ slot.start }} - {{ slot.end }}
              <button type="button" class="hover:text-red-500 ml-0.5" aria-label="删除时段" @click="removeTimeSlot(idx)">×</button>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="newSlotStart" type="time" class="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none" />
            <span class="text-gray-400">至</span>
            <input v-model="newSlotEnd" type="time" class="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none" />
            <button type="button" class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors" @click="addTimeSlot">添加时段</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              并发用户上限：{{ serviceLimits.maxConcurrentUsers }}
            </label>
            <input
v-model.number="serviceLimits.maxConcurrentUsers" type="range" min="1" max="100" step="1"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" aria-label="并发用户数限制" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">每日请求限额</label>
            <input
v-model.number="serviceLimits.dailyRequestLimit" type="number" min="0" step="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">API 频率限制（次/分钟）</label>
            <input
v-model.number="serviceLimits.apiRateLimit" type="number" min="1" step="10"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        平台与试用
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            平台抽成比例：{{ platformCommission }}%
          </label>
          <input
v-model.number="platformCommission" type="range" min="0" max="50" step="1"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" aria-label="平台抽成比例" />
          <div class="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>0%</span>
            <span>您获得 {{ 100 - platformCommission }}%</span>
            <span>50%</span>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">试用期（天，0 表示无试用期）</label>
          <input
v-model.number="trialDays" type="number" min="0" max="90" step="1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
      </div>
    </section>

    <section class="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
      <h3 class="text-base font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
        📈 预估月收入
      </h3>
      <div class="flex items-end gap-2">
        <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">¥{{ estimatedMonthlyRevenue.toLocaleString('zh-CN', { maximumFractionDigits: 0 }) }}</span>
        <span class="text-sm text-emerald-600/70 dark:text-emerald-400/70 pb-1">/ 月</span>
      </div>
      <p class="text-xs text-emerald-600/60 dark:text-emerald-400/60 mt-1.5">
        基于当前定价和预期用量估算，实际收入可能因使用情况而异
      </p>
      <div class="grid grid-cols-3 gap-3 mt-3">
        <div class="bg-white/60 dark:bg-gray-800/40 rounded-lg p-2.5 text-center">
          <p class="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">预期用户</p>
          <p class="text-sm font-bold text-emerald-800 dark:text-emerald-300">{{ serviceLimits.maxConcurrentUsers * 10 }}</p>
        </div>
        <div class="bg-white/60 dark:bg-gray-800/40 rounded-lg p-2.5 text-center">
          <p class="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">日请求量</p>
          <p class="text-sm font-bold text-emerald-800 dark:text-emerald-300">{{ serviceLimits.dailyRequestLimit }}</p>
        </div>
        <div class="bg-white/60 dark:bg-gray-800/40 rounded-lg p-2.5 text-center">
          <p class="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">您的分成</p>
          <p class="text-sm font-bold text-emerald-800 dark:text-emerald-300">{{ 100 - platformCommission }}%</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
