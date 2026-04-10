<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDebounce } from '../../composables/useDebounce'
import { destinations, sampleItineraries, type TravelDestination, type TravelPlan, type Activity } from '../../data/mockLifestyle'

const searchQuery = ref('')
const debouncedSearch = useDebounce(() => searchQuery.value, 300)
const favoriteIds = ref<string[]>([])
const currentPlan = ref<TravelPlan | null>(sampleItineraries[0] || null)
const showActivityModal = ref(false)
const showDestinationDetail = ref(false)
const selectedDestination = ref<TravelDestination | null>(null)

const newActivity = ref<Partial<Activity>>({
  time: '09:00',
  title: '',
  location: '',
  notes: '',
  cost: 0,
})

const filteredDestinations = computed(() => {
  const q = debouncedSearch.value.toLowerCase().trim()
  if (!q) return destinations
  return destinations.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.city.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q))
  )
})

function toggleFavorite(id: string) {
  const idx = favoriteIds.value.indexOf(id)
  if (idx >= 0) favoriteIds.value.splice(idx, 1)
  else favoriteIds.value.push(id)
}

function isFavorite(id: string): boolean {
  return favoriteIds.value.includes(id)
}

function openDestinationDetail(dest: TravelDestination) {
  selectedDestination.value = dest
  showDestinationDetail.value = true
}

function openAddActivity() {
  newActivity.value = { time: '09:00', title: '', location: '', notes: '', cost: 0 }
  showActivityModal.value = true
}

function addActivity() {
  if (!newActivity.value.title?.trim()) return
  const activity: Activity = {
    id: `a-${Date.now()}`,
    time: newActivity.value.time || '09:00',
    title: newActivity.value.title,
    location: newActivity.value.location || '',
    notes: newActivity.value.notes || '',
    cost: newActivity.value.cost || 0,
  }
  if (currentPlan.value && currentPlan.value.days.length > 0) {
    currentPlan.value.days[currentPlan.value.days.length - 1].activities.push(activity)
    updateTotalCost()
  }
  showActivityModal.value = false
}

function deleteActivity(dayIdx: number, activityId: string) {
  if (currentPlan.value) {
    currentPlan.value.days[dayIdx].activities = currentPlan.value.days[dayIdx].activities.filter(a => a.id !== activityId)
    updateTotalCost()
  }
}

function updateTotalCost() {
  if (!currentPlan.value) return
  let total = 0
  currentPlan.value.days.forEach(day => {
    day.activities.forEach(a => { total += a.cost || 0 })
  })
  currentPlan.value.totalCost = total
}

const totalDays = computed(() => currentPlan.value?.days.length || 0)
const totalActivities = computed(() => currentPlan.value?.days.reduce((sum, d) => sum + d.activities.length, 0) || 0)

function exportItinerary() {
  alert('行程导出功能（模拟）：已生成PDF文件')
}
</script>

<template>
  <div class="travel-planner space-y-6">
    <!-- 搜索和统计 -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
v-model="searchQuery" type="text" placeholder="搜索目的地、城市或标签..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
      </div>
      <div class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg font-medium text-indigo-600 dark:text-indigo-400">{{ totalDays }} 天</span>
        <span class="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg font-medium text-green-600 dark:text-green-400">{{ totalActivities }} 个活动</span>
        <span class="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-lg font-medium text-orange-600 dark:text-orange-400">¥{{ currentPlan?.totalCost || 0 }}</span>
      </div>
    </div>

    <!-- 目的地卡片 -->
    <div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">热门目的地</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
v-for="dest in filteredDestinations.slice(0, 8)" :key="dest.id"
          class="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800"
          @click="openDestinationDetail(dest)">
          <div class="aspect-[4/3] overflow-hidden">
            <img :src="dest.image" :alt="dest.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <button
class="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
              @click.stop="toggleFavorite(dest.id)">
              <svg class="w-5 h-5" :class="isFavorite(dest.id) ? 'text-red-500 fill-red-500' : 'text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <h4 class="font-bold text-white">{{ dest.name }}</h4>
              <p class="text-xs text-gray-200">{{ dest.city }} · ⭐ {{ dest.rating }}</p>
            </div>
          </div>
          <div class="p-3">
            <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{{ dest.description }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="tag in dest.tags.slice(0, 3)" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 行程规划时间线 -->
    <div v-if="currentPlan">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">📋 {{ currentPlan.destinationName }}</h3>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors" @click="exportItinerary">
            📤 导出行程
          </button>
          <button class="px-3 py-1.5 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors" @click="openAddActivity">
            + 添加活动
          </button>
        </div>
      </div>

      <div class="relative pl-8">
        <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400"></div>

        <div v-for="(day, dayIdx) in currentPlan.days" :key="day.day" class="mb-8 relative">
          <div class="absolute -left-5 top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-gray-800"></div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <h4 class="font-bold text-gray-900 dark:text-white">Day {{ day.day }} · {{ day.date }}</h4>
              <span class="text-xs text-gray-500">{{ day.activities.length }} 个活动</span>
            </div>
            <div class="space-y-2">
              <TransitionGroup name="activity-list">
                <div
v-for="activity in day.activities" :key="activity.id"
                  class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span class="mt-0.5 px-2 py-0.5 text-xs font-mono font-medium rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex-shrink-0">{{ activity.time }}</span>
                  <div class="flex-1 min-w-0">
                    <h5 class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</h5>
                    <p class="text-xs text-gray-500 mt-0.5">📍 {{ activity.location }}{{ activity.notes ? ` · ${activity.notes}` : '' }}</p>
                  </div>
                  <span v-if="activity.cost" class="text-xs text-green-600 dark:text-green-400 flex-shrink-0">¥{{ activity.cost }}</span>
                  <button class="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all" @click="deleteActivity(dayIdx, activity.id)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 目的地详情弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDestinationDetail && selectedDestination" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showDestinationDetail = false">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <img :src="selectedDestination.image" :alt="selectedDestination.name" class="w-full h-48 object-cover" />
            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedDestination.name }}</h3>
                <span class="text-yellow-500">⭐ {{ selectedDestination.rating }}</span>
              </div>
              <p class="text-sm text-gray-500 mb-3">📍 {{ selectedDestination.city }}，{{ selectedDestination.country }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ selectedDestination.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in selectedDestination.tags" :key="tag" class="px-2.5 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">{{ tag }}</span>
              </div>
              <p class="text-lg font-bold text-indigo-600 dark:text-indigo-400">预计费用：约 ¥{{ selectedDestination.estimatedCost }}/天</p>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
:class="[
                'flex-1 py-2.5 rounded-xl font-medium transition-colors',
                isFavorite(selectedDestination.id) ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]" @click="toggleFavorite(selectedDestination.id)">
                {{ isFavorite(selectedDestination.id) ? '❤️ 已收藏' : '🤍 收藏' }}
              </button>
              <button class="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium" @click="showDestinationDetail = false">
                开始规划
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 添加活动弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showActivityModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showActivityModal = false">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div class="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">添加活动</h3>
            </div>
            <div class="p-5 space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">时间</label>
                  <input v-model="newActivity.time" type="time" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">费用(元)</label>
                  <input v-model.number="newActivity.cost" type="number" min="0" placeholder="0" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动名称 *</label>
                <input v-model="newActivity.title" type="text" placeholder="输入活动名称" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">地点</label>
                <input v-model="newActivity.location" type="text" placeholder="活动地点" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">备注</label>
                <textarea v-model="newActivity.notes" rows="2" placeholder="备注信息" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none resize-none"></textarea>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button class="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="showActivityModal = false">取消</button>
              <button class="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium" @click="addActivity">添加</button>
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

.activity-list-enter-active, .activity-list-leave-active { transition: all 0.3s ease; }
.activity-list-enter-from { opacity: 0; transform: translateY(-10px); }
.activity-list-leave-to { opacity: 0; transform: translateX(20px); }
</style>
