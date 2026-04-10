<script setup lang="ts">
import { ref, computed } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import MyAgentsList from '../components/customize/MyAgentsList.vue'
import AgentCreatorWizard from '../components/customize/AgentCreatorWizard.vue'
import AgentAnalytics from '../components/customize/AgentAnalytics.vue'
import { sampleAgents, type AgentConfig } from '../data/mockCustomize'

const activeTab = ref('agents')
const showCreator = ref(false)
const editingAgent = ref<AgentConfig | null>(null)

const tabs = [
  { id: 'agents', label: '我的智能体', icon: '🤖', component: MyAgentsList },
  { id: 'create', label: '创建智能体', icon: '⚙️', component: AgentCreatorWizard },
  { id: 'analytics', label: '数据分析', icon: '📊', component: AgentAnalytics }
]

const stats = computed(() => {
  const total = sampleAgents.length
  const published = sampleAgents.filter(a => a.status === 'published').length
  const draft = sampleAgents.filter(a => a.status === 'draft').length
  const totalCalls = sampleAgents.reduce((sum, a) => sum + a.stats.totalCalls, 0)
  return { total, published, draft, totalCalls }
})

const handleCreate = () => {
  showCreator.value = true
  activeTab.value = 'create'
  editingAgent.value = null
}

const handleEdit = (agent: any) => {
  editingAgent.value = agent.config
  showCreator.value = true
  activeTab.value = 'create'
}

const handleComplete = (config: AgentConfig) => {
  alert(`智能体 "${config.basicInfo.name}" 创建成功！\n\n（模拟功能：实际项目中会调用 API 保存数据）`)
  showCreator.value = false
  activeTab.value = 'agents'
}

const handleCancel = () => {
  showCreator.value = false
  if (sampleAgents.length > 0) {
    activeTab.value = 'agents'
  }
}
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 px-4 sm:px-6 lg:px-8 pt-5 pb-0">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                定制化智能体
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">创建、管理和分析您的 AI 智能体</p>
            </div>
            <button
              v-if="activeTab !== 'create'"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5 shrink-0"
              @click="handleCreate"
            >
              <span class="text-base">+</span> 新建智能体
            </button>
          </div>

          <nav class="-mb-px flex space-x-1 overflow-x-auto pb-0 custom-scrollbar" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              role="tab"
              :aria-selected="activeTab === tab.id"
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
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                role="presentation"
              ></span>
            </button>
          </nav>
        </div>

        <div class="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-250px)]">
          <Transition name="fade-slide" mode="out-in">
            <KeepAlive :include="['MyAgentsList', 'AgentAnalytics']">
              <component
                :is="tabs.find(t => t.id === activeTab)?.component"
                :key="activeTab"
                :edit-agent="editingAgent"
                @create="handleCreate"
                @edit="handleEdit"
                @complete="handleComplete"
                @cancel="handleCancel"
              />
            </KeepAlive>
          </Transition>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">🤖</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">总计</span>
          </div>
          <h3 class="text-2xl font-bold">{{ stats.total }}</h3>
          <p class="text-sm text-blue-100 mt-0.5">智能体总数</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">✅</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">在线</span>
          </div>
          <h3 class="text-2xl font-bold">{{ stats.published }}</h3>
          <p class="text-sm text-green-100 mt-0.5">已发布</p>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">📝</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">编辑</span>
          </div>
          <h3 class="text-2xl font-bold">{{ stats.draft }}</h3>
          <p class="text-sm text-amber-100 mt-0.5">草稿中</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">📊</span>
            <span class="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">调用量</span>
          </div>
          <h3 class="text-2xl font-bold">{{ stats.totalCalls.toLocaleString() }}</h3>
          <p class="text-sm text-purple-100 mt-0.5">总调用量</p>
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
