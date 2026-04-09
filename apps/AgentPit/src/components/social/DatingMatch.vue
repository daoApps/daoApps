<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SocialProfile } from '../../types/social'
import { mockUsers } from '../../data/mockSocial'

const users = ref<SocialProfile[]>([...mockUsers])
const currentIndex = ref(0)
const isAnimating = ref(false)
const showMatchAnimation = ref(false)
const matchedUser = ref<SocialProfile | null>(null)

const currentUser = computed(() => users.value[currentIndex.value] || null)


let startX = 0
let currentX = 0
let isDragging = false

const handleTouchStart = (e: TouchEvent) => {
  if (isAnimating.value || !currentUser.value) return
  startX = e.touches[0].clientX
  currentX = startX
  isDragging = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging) return
  currentX = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isDragging || !currentUser.value) return
  
  const diff = currentX - startX
  const threshold = 100

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      like()
    } else {
      dislike()
    }
  }

  isDragging = false
  startX = 0
  currentX = 0
}

const like = () => {
  if (!currentUser.value || isAnimating.value) return
  
  isAnimating.value = true
  
  setTimeout(() => {
    const randomMatch = Math.random() > 0.7
    
    if (randomMatch) {
      matchedUser.value = currentUser.value
      showMatchAnimation.value = true
      
      setTimeout(() => {
        showMatchAnimation.value = false
        matchedUser.value = null
        nextCard()
      }, 2500)
    } else {
      nextCard()
    }
  }, 300)
}

const dislike = () => {
  if (!currentUser.value || isAnimating.value) return
  
  isAnimating.value = true
  
  setTimeout(() => {
    nextCard()
  }, 300)
}

const nextCard = () => {
  currentIndex.value++
  isAnimating.value = false
  
  if (currentIndex.value >= users.value.length) {
    resetCards()
  }
}

const resetCards = () => {
  currentIndex.value = 0
  const shuffled = [...users.value].sort(() => Math.random() - 0.5)
  users.value = shuffled
}

onMounted(() => {
  const shuffled = [...mockUsers].sort(() => Math.random() - 0.5)
  users.value = shuffled
})
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">发现新朋友</h2>
      <p class="text-gray-600 dark:text-gray-400 mt-1">左滑跳过，右滑喜欢</p>
    </div>

    <div class="relative flex justify-center items-center" style="height: 500px;">
      <TransitionGroup name="card">
        <div
          v-for="(user, index) in [users[currentIndex], users[currentIndex + 1]].filter(Boolean)"
          :key="user!.id"
          class="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
          :style="{
            zIndex: index === 0 ? 10 : 5,
            transform: index === 1 ? 'scale(0.95) translateY(10px)' : 'scale(1)',
            opacity: index === 1 ? 0.8 : 1,
          }"
          @touchstart="index === 0 ? handleTouchStart($event as TouchEvent) : undefined"
          @touchmove="index === 0 ? handleTouchMove($event as TouchEvent) : undefined"
          @touchend="index === 0 ? handleTouchEnd() : undefined"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-[480px] relative">
            <div class="h-3/4 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
              <img
                :src="user!.avatar"
                :alt="user!.name"
                class="w-32 h-32 rounded-full border-4 border-white absolute bottom-4 left-6 object-cover bg-white"
              />
              
              <div 
                v-if="index === 0 && isAnimating" 
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span 
                  class="text-8xl font-black opacity-30 select-none"
                  :class="{ 'text-green-500': true }"
                >
                  ✓ 喜欢
                </span>
              </div>
            </div>

            <div class="p-6 pt-16">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user!.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ user!.location }} · {{ user!.online ? '在线' : '离线' }}</p>
              <p class="text-gray-700 dark:text-gray-300 mt-3 line-clamp-2">{{ user!.bio }}</p>
              <div class="flex gap-2 mt-3">
                <span
                  v-for="tag in user!.tags.slice(0, 3)"
                  :key="tag"
                  class="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="!currentUser" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center space-y-4 p-8">
          <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">没有更多用户了</h3>
          <button
            @click="resetCards"
            class="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            重新开始
          </button>
        </div>
      </div>

      <Transition name="match">
        <div v-if="showMatchAnimation && matchedUser" class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div class="text-center space-y-6 animate-bounce">
            <div class="relative">
              <img
                :src="matchedUser.avatar"
                alt=""
                class="w-32 h-32 rounded-full border-4 border-pink-500 mx-auto shadow-2xl"
              />
              <div class="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <span class="text-4xl">💘</span>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 px-8 py-4 rounded-2xl shadow-2xl">
              <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                匹配成功！
              </h2>
              <p class="text-lg text-gray-700 dark:text-gray-300 mt-2">
                你和 <strong>{{ matchedUser.name }}</strong> 互相喜欢了对方
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="currentUser" class="flex justify-center gap-6 max-w-sm mx-auto">
      <button
        @click="dislike"
        class="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
        :disabled="isAnimating"
      >
        <svg class="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <button
        @click="like"
        class="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:bg-green-50 dark:hover:bg-green-900/20 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
        :disabled="isAnimating"
      >
        <svg class="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
    </div>

    <div class="text-center text-sm text-gray-500 dark:text-gray-400">
      剩余 {{ users.length - currentIndex }} 位用户
    </div>
  </div>
</template>

<style scoped>
.card-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-leave-active {
  transition: all 0.3s ease-in;
  position: absolute;
}

.card-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
}

.card-leave-to {
  opacity: 0;
  transform: translateX(150%) rotate(20deg);
}

.match-enter-active {
  animation: matchIn 0.5s ease-out;
}

.match-leave-active {
  animation: matchOut 0.5s ease-in forwards;
}

@keyframes matchIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes matchOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
</style>
