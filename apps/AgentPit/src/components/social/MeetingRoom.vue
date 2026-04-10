<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { MeetingRoom as MeetingRoomType } from '../../types/social'
import { mockMeetingRooms } from '../../data/mockSocial'

const meeting = ref<MeetingRoomType>(mockMeetingRooms[0])
const showChat = ref(false)
const newMessage = ref('')
const chatMessages = ref([
  { id: 1, user: '张三', message: '大家好，会议开始了', time: '10:00' },
  { id: 2, user: '李四', message: '收到，我准备好了', time: '10:01' },
  { id: 3, user: '王五', message: '稍等一下，我调整下麦克风', time: '10:02' },
])

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (meeting.value) {
      meeting.value.duration++
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toggleMute = () => {
  if (meeting.value) {
    meeting.value.isMuted = !meeting.value.isMuted
  }
}

const toggleVideo = () => {
  if (meeting.value) {
    meeting.value.isVideoOn = !meeting.value.isVideoOn
  }
}

const toggleRecording = () => {
  if (meeting.value) {
    meeting.value.isRecording = !meeting.value.isRecording
  }
}

const toggleChat = () => {
  showChat.value = !showChat.value
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  chatMessages.value.push({
    id: chatMessages.value.length + 1,
    user: '我',
    message: newMessage.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  })
  
  newMessage.value = ''
}

const leaveMeeting = () => {
  if (confirm('确定要离开会议吗？')) {
    alert('已离开会议')
  }
}
</script>

<template>
  <div v-if="meeting" class="h-[calc(100vh-120px)] flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
    <div class="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
      <div class="flex items-center space-x-4">
        <h2 class="text-xl font-bold text-white">{{ meeting.name }}</h2>
        <span
class="px-3 py-1 text-xs font-medium rounded-full"
          :class="meeting.isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-green-500/20 text-green-400'"
        >
          {{ meeting.isRecording ? '● 录制中' : '● 进行中' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-4 text-sm text-gray-300">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <span>{{ formatDuration(meeting.duration) }}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
          </svg>
          <span>ID: {{ meeting.id }}</span>
        </div>

        <button class="p-2 hover:bg-gray-700 rounded-lg transition-colors relative" @click="toggleChat">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <span v-if="!showChat" class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center">3</span>
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 p-4 grid gap-4" :class="showChat ? 'grid-cols-2' : 'grid-cols-3'">
        <div 
          v-for="(participant, index) in meeting.participants" 
          :key="participant.userId"
          class="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden group"
          :class="{ 'col-span-1 row-span-2': index === 0 && !showChat }"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <img 
              :src="participant.userAvatar" 
              :alt="participant.userName"
              class="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
              :class="{ 'w-32 h-32': index === 0 && !showChat }"
            />
            <div v-if="!participant.isVideoOn" class="absolute inset-0 flex items-center justify-center bg-black/50">
              <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>

          <div v-if="participant.isSpeaking && participant.isVideoOn" class="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>

          <div class="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center space-x-2">
            <span>{{ participant.userName }}</span>
            <span v-if="participant.isMuted" class="text-red-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
              </svg>
            </span>
          </div>
        </div>

        <div v-if="meeting.participants.length < 4 || showChat" class="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-500 transition-colors cursor-pointer group">
          <div class="text-center text-gray-500 group-hover:text-gray-400 transition-colors">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            <p class="text-sm">邀请成员</p>
          </div>
        </div>
      </div>

      <Transition name="slide">
        <div v-if="showChat" class="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div class="px-4 py-3 border-b border-gray-700">
            <h3 class="font-semibold text-white">聊天室</h3>
            <p class="text-xs text-gray-400 mt-1">{{ meeting.participants.length }} 位成员在线</p>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <div v-for="msg in chatMessages" :key="msg.id" class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-blue-400">{{ msg.user }}</span>
                <span class="text-xs text-gray-500">{{ msg.time }}</span>
              </div>
              <p class="text-sm text-gray-300 pl-2">{{ msg.message }}</p>
            </div>
          </div>

          <div class="p-4 border-t border-gray-700">
            <div class="flex space-x-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="输入消息..."
                class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                @keyup.enter="sendMessage"
              />
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                @click="sendMessage"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div class="bg-gray-800 px-6 py-4 border-t border-gray-700">
      <div class="flex items-center justify-center space-x-4">
        <button
          class="p-4 rounded-full transition-all duration-200"
          :class="meeting.isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'"
          @click="toggleMute"
        >
          <svg v-if="!meeting.isMuted" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
          </svg>
        </button>

        <button
          class="p-4 rounded-full transition-all duration-200"
          :class="!meeting.isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'"
          @click="toggleVideo"
        >
          <svg v-if="meeting.isVideoOn" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
        </button>

        <button
          class="p-4 rounded-full transition-all duration-200 relative"
          :class="meeting.isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'"
          @click="toggleRecording"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8"/>
          </svg>
        </button>

        <button
          class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
          @click="leaveMeeting"
        >
          离开会议
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
