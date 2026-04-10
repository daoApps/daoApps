<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Friend, FriendRequest } from '../../types/social';
import { mockFriends, mockFriendRequests } from '../../data/mockSocial';

const friends = ref<Friend[]>([...mockFriends]);
const friendRequests = ref<FriendRequest[]>([...mockFriendRequests]);
const searchQuery = ref('');
const activeTab = ref<'friends' | 'requests' | 'groups'>('friends');
const selectedGroup = ref<string>('all');
const showAddFriendModal = ref(false);

const groupLabels: Record<string, string> = {
  all: '全部好友',
  family: '家人',
  colleague: '同事',
  other: '其他'
};

const filteredFriends = computed(() => {
  let result = friends.value;

  if (searchQuery.value) {
    result = result.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedGroup.value !== 'all') {
    result = result.filter((friend) => friend.group === selectedGroup.value);
  }

  return result;
});

const onlineCount = computed(() => friends.value.filter((f) => f.online).length);
const pendingRequestsCount = computed(
  () => friendRequests.value.filter((r) => r.status === 'pending').length
);

const handleAcceptRequest = (requestId: string) => {
  const request = friendRequests.value.find((r) => r.id === requestId);
  if (request) {
    request.status = 'accepted';

    const newFriend: Friend = {
      id: request.fromUserId,
      name: request.fromUserName,
      avatar: request.fromUserAvatar,
      online: false,
      status: 'offline',
      group: 'other'
    };
    friends.value.push(newFriend);
  }
};

const handleRejectRequest = (requestId: string) => {
  const request = friendRequests.value.find((r) => r.id === requestId);
  if (request) {
    request.status = 'rejected';
  }
};

const removeFriend = (friendId: string) => {
  if (confirm('确定要删除这位好友吗？')) {
    friends.value = friends.value.filter((f) => f.id !== friendId);
  }
};

const changeGroup = (friendId: string, newGroup: Friend['group']) => {
  const friend = friends.value.find((f) => f.id === friendId);
  if (friend) {
    friend.group = newGroup;
  }
};

const getStatusColor = (status: Friend['status']) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'busy':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const getStatusText = (status: Friend['status']) => {
  switch (status) {
    case 'online':
      return '在线';
    case 'busy':
      return '忙碌';
    case 'offline':
      return '离线';
    default:
      return '未知';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">好友管理</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ onlineCount }} 位好友在线 · 共 {{ friends.length }} 位好友
        </p>
      </div>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        @click="showAddFriendModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <span>添加好友</span>
      </button>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="border-b border-gray-200 dark:border-gray-700 flex">
        <button
          v-for="(tab, key) in {
            friends: '好友列表',
            requests: `好友请求${pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ''}`,
            groups: '分组管理'
          }"
          :key="key"
          class="flex-1 px-6 py-3 text-sm font-medium transition-colors relative"
          :class="
            activeTab === key
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
          "
          @click="activeTab = key as 'friends' | 'requests' | 'groups'"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeTab === 'friends'" class="p-6 space-y-4">
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索好友..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-white"
          />
        </div>

        <div class="flex gap-2 flex-wrap">
          <button
            v-for="(label, group) in groupLabels"
            :key="group"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            :class="
              selectedGroup === group
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            "
            @click="selectedGroup = group"
          >
            {{ label }}
          </button>
        </div>

        <div class="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          <TransitionGroup name="list">
            <div
              v-for="friend in filteredFriends"
              :key="friend.id"
              class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <img
                    :src="friend.avatar"
                    :alt="friend.name"
                    class="w-12 h-12 rounded-full object-cover bg-gray-100"
                  />
                  <span
                    class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800"
                    :class="getStatusColor(friend.status)"
                  ></span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ friend.name }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getStatusText(friend.status) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <select
                  :value="friend.group"
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="
                    changeGroup(
                      friend.id,
                      ($event.target as HTMLSelectElement).value as Friend['group']
                    )
                  "
                >
                  <option value="family">家人</option>
                  <option value="colleague">同事</option>
                  <option value="other">其他</option>
                </select>

                <button
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="删除好友"
                  @click="removeFriend(friend.id)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </TransitionGroup>

          <div v-if="filteredFriends.length === 0" class="text-center py-12">
            <svg
              class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p class="text-gray-500 dark:text-gray-400">没有找到匹配的好友</p>
          </div>
        </div>
      </div>

      <div
          v-if="activeTab === 'requests'"
          class="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar"
        >
          <div v-if="pendingRequestsCount === 0" class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">暂无待处理的好友请求</p>
        </div>

        <TransitionGroup v-else name="list">
          <div
            v-for="request in friendRequests.filter((r) => r.status === 'pending')"
            :key="request.id"
            class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3"
          >
            <div class="flex items-center gap-4">
              <img
                :src="request.fromUserAvatar"
                :alt="request.fromUserName"
                class="w-12 h-12 rounded-full"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ request.fromUserName }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">请求添加你为好友</p>
              </div>
            </div>
            <div class="flex gap-2 justify-end">
              <button
                class="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                @click="handleAcceptRequest(request.id)"
              >
                同意
              </button>
              <button
                class="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                @click="handleRejectRequest(request.id)"
              >
                拒绝
              </button>
            </div>
          </div>
        </TransitionGroup>
        </div>

      <div v-if="activeTab === 'groups'" class="p-6">
        <p class="text-center text-gray-500 dark:text-gray-400 py-12">分组管理功能开发中...</p>
      </div>
    </div>

    <div
      v-if="showAddFriendModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="showAddFriendModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">添加好友</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户ID
            </label>
            <input
              type="text"
              placeholder="输入用户ID搜索"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-white"
            />
          </div>
          <div class="flex gap-2 justify-end">
            <button
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              @click="showAddFriendModal = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              发送请求
            </button>
          </div>
        </div>
      </div>
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

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
