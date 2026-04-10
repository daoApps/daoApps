<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  isOpen: boolean
  availableBalance: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: [amount: number, method: string]
}>()

type WithdrawMethod = 'bank' | 'alipay' | 'wechat'

const MIN_WITHDRAW = 100
const FEE_RATE = 0.005

const amount = ref('')
const selectedMethod = ref<WithdrawMethod>('bank')
const showConfirm = ref(false)
const isProcessing = ref(false)

const withdrawMethods = [
  { value: 'bank' as WithdrawMethod, label: '银行卡', icon: '🏦' },
  { value: 'alipay' as WithdrawMethod, label: '支付宝', icon: '💳' },
  { value: 'wechat' as WithdrawMethod, label: '微信支付', icon: '💬' }
]

const withdrawAmount = computed(() => parseFloat(amount.value) || 0)
const fee = computed(() => withdrawAmount.value * FEE_RATE)
const actualAmount = computed(() => withdrawAmount.value - fee.value)

const isValidAmount = computed(
  () =>
    withdrawAmount.value >= MIN_WITHDRAW &&
    withdrawAmount.value <= props.availableBalance
)

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      amount.value = ''
      selectedMethod.value = 'bank'
      showConfirm.value = false
      isProcessing.value = false
    }
  }
)

const handleSubmit = () => {
  if (isValidAmount.value && !showConfirm.value) {
    showConfirm.value = true
  } else if (showConfirm.value && !isProcessing.value) {
    isProcessing.value = true
    setTimeout(() => {
      emit('success', withdrawAmount.value, selectedMethod.value)
      isProcessing.value = false
      emit('close')
    }, 2000)
  }
}

const setMaxAmount = () => {
  amount.value = props.availableBalance.toString()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">提现</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              @click="emit('close')"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <div v-if="showConfirm" class="space-y-4">
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
              <p class="text-sm text-gray-600 mb-2">确认提现金额</p>
              <p class="text-3xl font-bold text-teal-600">
                ¥{{ withdrawAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
              </p>
            </div>

            <div class="space-y-3 bg-gray-50 rounded-xl p-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">提现方式</span>
                <span class="font-medium text-gray-900">
                  {{ withdrawMethods.find((m) => m.value === selectedMethod)?.label }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">手续费</span>
                <span class="font-medium text-orange-600">¥{{ fee.toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3 flex justify-between">
                <span class="font-semibold text-gray-900">实际到账</span>
                <span class="font-bold text-green-600 text-lg">¥{{ actualAmount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800">
                ⚠️ 提现申请提交后，预计1-3个工作日内到账。请确保您的账户信息正确。
              </p>
            </div>

            <div class="flex gap-3">
              <button
                :disabled="isProcessing"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                @click="showConfirm = false"
              >
                返回修改
              </button>
              <button
                :disabled="isProcessing"
                class="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                @click="handleSubmit"
              >
                <svg v-if="isProcessing" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ isProcessing ? '处理中...' : '确认提现' }}
              </button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-blue-50 rounded-xl p-4 mb-4">
              <p class="text-sm text-blue-700">
                可用余额：¥{{ availableBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
              </p>
              <p class="text-xs text-blue-600 mt-1">
                最低提现额度：¥{{ MIN_WITHDRAW }}，手续费率：{{ (FEE_RATE * 100).toFixed(1) }}%
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">提现金额</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">¥</span>
                <input
                  v-model.number="amount"
                  type="number"
                  placeholder="请输入提现金额"
                  :min="MIN_WITHDRAW"
                  :max="availableBalance"
                  step="0.01"
                  class="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-semibold"
                />
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                  @click="setMaxAmount"
                >
                  全部
                </button>
              </div>
              <div v-if="amount" class="mt-2 space-y-1">
                <p v-if="withdrawAmount < MIN_WITHDRAW" class="text-xs text-red-600">
                  最低提现金额为 ¥{{ MIN_WITHDRAW }}
                </p>
                <p v-if="withdrawAmount > availableBalance" class="text-xs text-red-600">
                  超过可用余额
                </p>
                <div v-if="isValidAmount" class="bg-green-50 rounded-lg p-2">
                  <p class="text-xs text-green-700">
                    手续费：¥{{ fee.toFixed(2) }} | 实际到账：¥{{ actualAmount.toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">提现方式</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="method in withdrawMethods"
                  :key="method.value"
                  :class="[
                    'p-4 rounded-xl border-2 transition-all duration-200',
                    selectedMethod === method.value
                      ? 'border-teal-500 bg-teal-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                  @click="selectedMethod = method.value"
                >
                  <div class="text-2xl mb-2">{{ method.icon }}</div>
                  <p
                    :class="[
                      'text-sm font-medium',
                      selectedMethod === method.value ? 'text-teal-700' : 'text-gray-700'
                    ]"
                  >
                    {{ method.label }}
                  </p>
                </button>
              </div>
            </div>

            <button
              :disabled="!isValidAmount"
              class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              @click="handleSubmit"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
