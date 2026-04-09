<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserProfileCard from './UserProfileCard.vue'
import { mockUsers } from '../../data/mockSocial'
import type { SocialProfile } from '../../types/social'

const users = ref<SocialProfile[]>([...mockUsers])
const displayedUsers = ref<SocialProfile[]>([])
const isLoading = ref(false)

const VISIBLE_COUNT = 6
const LOAD_MORE_COUNT = 3

onMounted(() => {
  loadInitialUsers()
})

const loadInitialUsers = () => {
  displayedUsers.value = users.value.slice(0, VISIBLE_COUNT)
}

const handleLike = (userId: string) => {
  console.log('Liked user:', userId)
}

const handleMessage = (userId: string) => {
  console.log('Message user:', userId)
}

const handleScroll = (event: Event) => {
  const element = event.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = element

  if (scrollHeight - scrollTop - clientHeight < 100 && !isLoading.value) {
    loadMore()
  }
}

const loadMore = async () => {
  if (displayedUsers.value.length >= users.value.length) return

  isLoading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const currentLength = displayedUsers.value.length
  const newUsers = users.value.slice(currentLength, currentLength + LOAD_MORE_COUNT)
  displayedUsers.value.push(...newUsers)
  
  isLoading.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">推荐用户</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">发现可能感兴趣的人</p>
      </div>
    </div>

    <div
      ref="containerRef"
      @scroll="handleScroll"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar"
    >
      <TransitionGroup name="list">
        <UserProfileCard
          v-for="user in displayedUsers"
          :key="user.id"
          :user="user"
          @follow="handleLike"
          @message="handleMessage"
        />
      </TransitionGroup>

      <div v-if="isLoading" class="col-span-full flex justify-center py-8">
        <div class="flex items-center space-x-2 text-blue-600">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>加载更多...</span>
        </div>
      </div>

      <div v-if="displayedUsers.length === 0 && !isLoading" class="col-span-full text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">暂无推荐用户</p>
      </div>
    </div>

    <div v-if="displayedUsers.length >= users.length && users.length > 0" class="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
      已显示全部 {{ users.length }} 位用户
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
