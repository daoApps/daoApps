<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import FileManager from '@/components/memory/FileManager.vue'
import KnowledgeGraph from '@/components/memory/KnowledgeGraph.vue'
import MemorySearch from '@/components/memory/MemorySearch.vue'
import MemoryTimeline from '@/components/memory/MemoryTimeline.vue'
import BackupSettings from '@/components/memory/BackupSettings.vue'
import StorageQuota from '@/components/memory/StorageQuota.vue'
import { mockFileTree, mockKnowledgeNodes, mockKnowledgeEdges, mockMemoryItems, mockBackupHistory, mockStorageStats } from '@/data/mockMemory'

type TabType = 'files' | 'graph' | 'search' | 'timeline' | 'backup' | 'quota'

const activeTab = ref<TabType>('files')
const isLoading = ref(true)

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'files', label: '文件管理', icon: '📁' },
  { id: 'graph', label: '知识图谱', icon: '🕸️' },
  { id: 'search', label: '记忆搜索', icon: '🔍' },
  { id: 'timeline', label: '时间线', icon: '📅' },
  { id: 'backup', label: '备份设置', icon: '💾' },
  { id: 'quota', label: '存储配额', icon: '💿' }
]

const stats = computed(() => ({
  totalFiles: countFiles(mockFileTree),
  knowledgeNodes: mockKnowledgeNodes.length,
  searchCount: 128,
  storageUsage: ((mockStorageStats.usedSpace / mockStorageStats.totalSpace) * 100).toFixed(1)
}))

function countFiles(nodes: typeof mockFileTree): number {
  let count = 0
  nodes.forEach(node => {
    if (node.type === 'file') count++
    if (node.children) count += countFiles(node.children)
  })
  return count
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <MainLayout>
    <div class="memory-page__wrapper min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <!-- 入场动画容器 -->
      <Transition name="page-fade" mode="out-in">
        <div v-if="!isLoading" key="content" class="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <!-- 页面标题栏 -->
          <div class="memory-page__header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🧠 存储记忆系统
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
                智能记忆存储和管理系统，助您高效管理知识资产
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg">
                ⚡ 快速操作
              </button>
            </div>
          </div>

          <!-- 统计概览卡片 -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="memory-page__stat-card group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative z-10">
                <div class="text-3xl mb-2">📁</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalFiles }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">总文件数</div>
              </div>
            </div>

            <div class="memory-page__stat-card group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative z-10">
                <div class="text-3xl mb-2">🕸️</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.knowledgeNodes }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">知识节点</div>
              </div>
            </div>

            <div class="memory-page__stat-card group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div class="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative z-10">
                <div class="text-3xl mb-2">🔍</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.searchCount }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">搜索次数</div>
              </div>
            </div>

            <div class="memory-page__stat-card group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div class="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative z-10">
                <div class="text-3xl mb-2">💿</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.storageUsage }}%</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">存储使用率</div>
              </div>
            </div>
          </div>

          <!-- Tab 导航 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Tab 标签栏 -->
            <div class="memory-page__tabs flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex-1 min-w-[120px] px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                :class="
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                "
              >
                <span>{{ tab.icon }}</span>
                <span class="hidden sm:inline">{{ tab.label }}</span>
              </button>
            </div>

            <!-- Tab 内容区域（KeepAlive 缓存） -->
            <div class="memory-page__content p-4 md:p-6">
              <KeepAlive :max="6">
                <Transition name="tab-fade" mode="out-in">
                  <!-- 文件管理器 -->
                  <FileManager
                    v-if="activeTab === 'files'"
                    key="files"
                    :files="mockFileTree"
                  />

                  <!-- 知识图谱 -->
                  <KnowledgeGraph
                    v-else-if="activeTab === 'graph'"
                    key="graph"
                    :nodes="mockKnowledgeNodes"
                    :edges="mockKnowledgeEdges"
                  />

                  <!-- 记忆搜索 -->
                  <MemorySearch
                    v-else-if="activeTab === 'search'"
                    key="search"
                    :data="mockMemoryItems"
                  />

                  <!-- 时间线 -->
                  <MemoryTimeline
                    v-else-if="activeTab === 'timeline'"
                    key="timeline"
                    :events="mockMemoryItems.map(item => ({
                      id: item.id,
                      title: item.title,
                      description: item.content.slice(0, 100),
                      timestamp: item.timestamp,
                      type: 'modification' as const,
                      isImportant: Math.random() > 0.7
                    }))"
                  />

                  <!-- 备份设置 -->
                  <BackupSettings
                    v-else-if="activeTab === 'backup'"
                    key="backup"
                    :history="mockBackupHistory"
                    :estimated-size="mockStorageStats.usedSpace * 0.15"
                  />

                  <!-- 存储配额 -->
                  <StorageQuota
                    v-else-if="activeTab === 'quota'"
                    key="quota"
                    :stats="mockStorageStats"
                  />
                </Transition>
              </KeepAlive>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-else key="loading" class="flex items-center justify-center min-h-[600px]">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 mx-auto border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-gray-600 dark:text-gray-400 font-medium">加载中...</p>
          </div>
        </div>
      </Transition>
    </div>
  </MainLayout>
</template>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.25s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .memory-page__stat-card {
    padding: 1rem;
  }

  .memory-page__stat-card .text-2xl {
    font-size: 1.5rem;
  }
}
</style>
