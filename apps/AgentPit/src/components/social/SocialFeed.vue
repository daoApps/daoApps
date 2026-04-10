<script setup lang="ts">
import { ref } from 'vue'
import type { SocialPost } from '../../types/social'
import { mockPosts } from '../../data/mockSocial'

const posts = ref(mockPosts.slice(0, 5))
const isLoading = ref(false)
const showNewPostModal = ref(false)
const newPostContent = ref('')

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

const handleLike = (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.liked = !post.liked
    post.likes += post.liked ? 1 : -1
  }
}

const handleComment = (postId: string) => {
  console.log('Comment on post:', postId)
}

const handleShare = (postId: string) => {
  console.log('Share post:', postId)
}

const handleScroll = (event: Event) => {
  const element = event.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = element

  if (scrollHeight - scrollTop - clientHeight < 200 && !isLoading.value) {
    loadMorePosts()
  }
}

const loadMorePosts = async () => {
  isLoading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newPost: SocialPost = {
    id: `post-${Date.now()}`,
    authorId: `user-${Math.floor(Math.random() * 8 + 1)}`,
    authorName: '用户' + Math.floor(Math.random() * 100),
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    content: '这是一条新加载的动态内容，展示了无限滚动的功能。社交信息流支持自动加载更多内容。',
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 30),
    shares: Math.floor(Math.random() * 20),
    timestamp: Date.now() - Math.floor(Math.random() * 86400000),
    liked: false,
  }
  
  posts.value.push(newPost)
  isLoading.value = false
}

const publishPost = () => {
  if (!newPostContent.value.trim()) return

  const post: SocialPost = {
    id: `post-new-${Date.now()}`,
    authorId: 'current-user',
    authorName: '我',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
    content: newPostContent.value,
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: Date.now(),
    liked: false,
  }

  posts.value.unshift(post)
  newPostContent.value = ''
  showNewPostModal.value = false
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">动态信息流</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">查看好友的最新动态</p>
      </div>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
        @click="showNewPostModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span>发布动态</span>
      </button>
    </div>

    <div
      ref="containerRef"
      class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar"
      @scroll="handleScroll"
    >
      <TransitionGroup name="post">
        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div class="p-5">
            <div class="flex items-start space-x-3">
              <img
                :src="post.authorAvatar"
                :alt="post.authorName"
                class="w-12 h-12 rounded-full object-cover bg-gray-100"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer transition-colors">
                    {{ post.authorName }}
                  </h3>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTimeAgo(post.timestamp) }}</p>
              </div>
              
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>

            <p class="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ post.content }}</p>

            <div
v-if="post.images && post.images.length > 0" class="mt-4 grid gap-2" :class="{
              'grid-cols-1': post.images.length === 1,
              'grid-cols-2': post.images.length === 2,
              'grid-cols-3': post.images.length >= 3,
            }">
              <div
                v-for="(_, index) in post.images.slice(0, 3)"
                :key="index"
                class="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-4xl">📷</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
              <button
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                @click="handleLike(post.id)"
              >
                <svg
                  class="w-5 h-5 transition-colors"
                  :class="post.liked ? 'text-red-500 fill-current' : 'text-gray-500 group-hover:text-red-500'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span :class="post.liked ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-400'">{{ post.likes }}</span>
              </button>

              <button
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                @click="handleComment(post.id)"
              >
                <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span class="text-gray-600 dark:text-gray-400">{{ post.comments }}</span>
              </button>

              <button
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                @click="handleShare(post.id)"
              >
                <svg class="w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                <span class="text-gray-600 dark:text-gray-400">{{ post.shares }}</span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="flex items-center space-x-3 text-blue-600">
          <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium">加载更多动态...</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showNewPostModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showNewPostModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6" @click.stop>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">发布新动态</h3>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                @click="showNewPostModal = false"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="flex items-start space-x-3 mb-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
                alt="我"
                class="w-10 h-10 rounded-full object-cover"
              />
              <textarea
                v-model="newPostContent"
                placeholder="分享你的想法..."
                class="flex-1 resize-none border-0 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base leading-relaxed"
                rows="5"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex space-x-2">
                <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-blue-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </button>
                <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-green-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>

              <button
                :disabled="!newPostContent.trim()"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="publishPost"
              >
                发布
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

.post-enter-active {
  transition: all 0.4s ease-out;
}

.post-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
