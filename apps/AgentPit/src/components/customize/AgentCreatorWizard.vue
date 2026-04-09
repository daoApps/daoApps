<script setup lang="ts">
import { ref, reactive, computed, provide, watch } from 'vue'
import BasicInfoForm from './BasicInfoForm.vue'
import AppearanceCustomizer from './AppearanceCustomizer.vue'
import AbilityConfigurator from './AbilityConfigurator.vue'
import BusinessModelSetup from './BusinessModelSetup.vue'
import AgentPreview from './AgentPreview.vue'
import { abilities, agentTemplates, defaultAgentConfig, type AgentConfig } from '../../data/mockCustomize'

interface Props {
  editAgent?: AgentConfig | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  complete: [config: AgentConfig]
  cancel: []
}>()

const currentStep = ref(1)
const totalSteps = 5
const isSubmitting = ref(false)

const steps = [
  { id: 1, title: '选择模板', icon: '📋', description: '从预设模板开始' },
  { id: 2, title: '基本信息', icon: '📝', description: '名称、描述和头像' },
  { id: 3, title: '外观定制', icon: '🎨', description: '颜色、字体和布局' },
  { id: 4, title: '能力配置', icon: '⚙️', description: '技能和参数设置' },
  { id: 5, title: '商业模式', icon: '💰', description: '定价和服务范围' }
]

const agentConfig = reactive<AgentConfig>(
  props.editAgent ? JSON.parse(JSON.stringify(props.editAgent)) : JSON.parse(JSON.stringify(defaultAgentConfig))
)
const selectedTemplateId = ref<string>('')

provide('agentConfig', agentConfig)

const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))
const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1: return selectedTemplateId.value !== ''
    case 2: return agentConfig.basicInfo.name.length >= 2 && agentConfig.basicInfo.category !== ''
    default: return true
  }
})
const isLastStep = computed(() => currentStep.value === totalSteps)
const isFirstStep = computed(() => currentStep.value === 1)

const completedSteps = computed(() => {
  const completed: number[] = []
  if (selectedTemplateId.value) completed.push(1)
  if (agentConfig.basicInfo.name.length >= 2) completed.push(2)
  if (currentStep.value > 3) completed.push(3)
  if (currentStep.value > 4) completed.push(4)
  return completed
})

const applyTemplate = (templateId: string) => {
  selectedTemplateId.value = templateId
  const template = agentTemplates.find(t => t.id === templateId)
  if (template) {
    agentConfig.basicInfo.category = template.category
    template.recommendedAbilities.forEach(abilityId => {
      if (!agentConfig.abilities.enabledAbilities[abilityId]) {
        const ability = abilities.find((a: any) => a.id === abilityId)
        agentConfig.abilities.enabledAbilities[abilityId] = {
          enabled: true,
          proficiency: 75,
          params: ability ? { ...ability.defaultParams } : {}
        }
      }
    })
  }
}

const goNext = () => {
  if (canGoNext.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const goPrev = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  emit('complete', { ...agentConfig })
  isSubmitting.value = false
}

const handleCancel = () => {
  emit('cancel')
}

watch(currentStep, (_newVal) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(selectedTemplateId, (val) => {
  if (val && currentStep.value === 1) {
    applyTemplate(val)
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">创建智能体</h2>
        <span class="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {{ progressPercent }}% 完成
        </span>
      </div>

      <div class="relative">
        <div class="absolute top-[18px] left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>

        <div class="relative flex justify-between">
          <button
            v-for="step in steps"
            :key="step.id"
            type="button"
            @click="currentStep >= step.id && (currentStep = step.id)"
            class="flex flex-col items-center group focus:outline-none"
            :disabled="currentStep + 1 < step.id"
            :aria-label="`步骤 ${step.id}: ${step.title}`"
            :aria-current="currentStep === step.id ? 'step' : undefined"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 relative z-10"
              :class="{
                'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50 scale-110': currentStep === step.id,
                'bg-green-500 border-green-500 text-white': completedSteps.includes(step.id) && currentStep !== step.id,
                'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-400': !completedSteps.includes(step.id) && currentStep !== step.id,
                'cursor-pointer hover:border-blue-300': currentStep >= step.id,
                'cursor-not-allowed opacity-50': currentStep + 1 < step.id
              }"
            >
              <span v-if="completedSteps.includes(step.id) && currentStep !== step.id">✓</span>
              <span v-else>{{ step.icon }}</span>
            </div>
            <span
              class="mt-1.5 text-[11px] font-medium whitespace-nowrap transition-colors hidden sm:block"
              :class="{
                'text-blue-600 dark:text-blue-400': currentStep === step.id,
                'text-green-600 dark:text-green-400': completedSteps.includes(step.id) && currentStep !== step.id,
                'text-gray-400 dark:text-gray-500': !completedSteps.includes(step.id) && currentStep !== step.id
              }"
            >{{ step.title }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <TransitionGroup name="step" tag="div" class="relative min-h-[420px]">
          <div v-if="currentStep === 1" key="step-1" class="w-full">
            <div class="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400">选择一个基础模板，我们将为您预填充推荐配置，您可以在后续步骤中自由调整。</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                v-for="template in agentTemplates"
                :key="template.id"
                type="button"
                @click="applyTemplate(template.id)"
                class="p-5 rounded-xl border-2 text-left transition-all hover:shadow-md group"
                :class="
                  selectedTemplateId === template.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                "
              >
                <div class="flex items-start gap-3">
                  <span class="text-3xl">{{ template.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ template.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ template.description }}</p>
                    <div class="flex flex-wrap gap-1 mt-2">
                      <span
                        v-for="(abilityId, idx) in template.recommendedAbilities.slice(0, 3)"
                        :key="idx"
                        class="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded"
                      >{{ abilityId.split('-')[0] }}</span>
                    </div>
                  </div>
                  <div
                    v-if="selectedTemplateId === template.id"
                    class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div v-if="currentStep === 2" key="step-2" class="w-full">
            <BasicInfoForm v-model="agentConfig.basicInfo" />
          </div>

          <div v-if="currentStep === 3" key="step-3" class="w-full">
            <AppearanceCustomizer v-model="agentConfig.appearance" />
          </div>

          <div v-if="currentStep === 4" key="step-4" class="w-full">
            <AbilityConfigurator v-model="agentConfig.abilities" />
          </div>

          <div v-if="currentStep === 5" key="step-5" class="w-full">
            <BusinessModelSetup v-model="agentConfig.businessModel" />
          </div>
        </TransitionGroup>
      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-4 space-y-4">
          <AgentPreview :config="agentConfig" />

          <div class="flex gap-3 pt-2">
            <button
              v-if="!isFirstStep"
              type="button"
              @click="goPrev"
              class="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              上一步
            </button>
            <button
              v-if="!isLastStep"
              type="button"
              @click="goNext"
              :disabled="!canGoNext"
              class="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              下一步
            </button>
            <button
              v-else
              type="button"
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-70 text-white rounded-xl text-sm font-medium transition-all shadow-md"
            >
              <span v-if="isSubmitting" class="inline-flex items-center gap-1.5">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                创建中...
              </span>
              <span v-else>完成创建 ✓</span>
            </button>
          </div>

          <button
            type="button"
            @click="handleCancel"
            class="w-full py-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            取消并返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
