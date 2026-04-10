<script setup lang="ts">
import { ref } from 'vue'
import type { SocialProfile } from '../../types/social'

const props = defineProps<{
  user: SocialProfile
}>()

const emit = defineEmits<{
  follow: [userId: string]
  message: [userId: string]
}>()

const showDetail = ref(false)
const isFollowing = ref(false)

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
  emit('follow', props.user.id)
}

const handleMessage = () => {
  emit('message', props.user.id)
}

const openDetail = () => {
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
}
</script>

<template>
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group" @click="openDetail">
      <div class="relative">
        <div class="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div class="absolute -bottom-10 left-4">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
          />
          <span
            class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
            :class="user.online ? 'bg-green-500' : 'bg-gray-400'"
          ></span>
        </div>
      </div>

      <div class="pt-12 pb-4 px-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {{ user.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {{ user.location }}
        </p>

        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{{ user.bio }}</p>

        <div class="flex flex-wrap gap-1 mt-3">
          <span
            v-for="tag in user.tags"
            :key="tag"
            class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
          >
            {{ tag }}
          </span>
        </div>

        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span><strong class="text-gray-900 dark:text-white">{{ formatNumber(user.followers) }}</strong> 粉丝</span>
            <span><strong class="text-gray-900 dark:text-white">{{ user.mutualFriends }}</strong> 共同好友</span>
          </div>
        </div>

        <div class="flex gap-2 mt-3" @click.stop>
          <button
            class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
            :class="
              isFollowing
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            "
            @click="handleFollow"
          >
            {{ isFollowing ? '已关注' : '关注' }}
          </button>
          <button
            class="flex-1 py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            @click="handleMessage"
          >
            私信
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetail" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="closeDetail">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div
            class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <button
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors z-10"
              @click="closeDetail"
            >
              ✕
            </button>

            <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <div class="absolute -bottom-12 left-6">
                <img
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
                />
              </div>
            </div>

            <div class="pt-16 pb-6 px-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h2>
              <p class="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ user.location }}
                <span
                  class="ml-2 inline-block w-2 h-2 rounded-full"
                  :class="user.online ? 'bg-green-500' : 'bg-gray-400'"
                ></span>
                {{ user.online ? '在线' : '离线' }}
              </p>

              <p class="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{{ user.bio }}</p>

              <div class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="tag in user.tags"
                  :key="tag"
                  class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
                >
                  #{{ tag }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-4 mt-6 py-4 border-y border-gray-200 dark:border-gray-700">
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(user.followers) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">粉丝</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(user.following) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">关注</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-900 dark:text-white">{{ user.mutualFriends }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">共同好友</div>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  class="flex-1 py-3 px-6 rounded-xl text-base font-semibold transition-all duration-200"
                  :class="
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  "
                  @click="handleFollow(); closeDetail()"
                >
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
                <button
                  class="flex-1 py-3 px-6 rounded-xl text-base font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  @click="handleMessage(); closeDetail()"
                >
                  发送消息
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
