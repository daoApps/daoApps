<script setup lang="ts">
import { ref, reactive } from 'vue';

const userProfile = reactive({
  nickname: '用户',
  avatar: '',
  bio: '',
  email: 'user@example.com',
  phone: '',
  location: '',
  website: ''
});

const avatarPreview = ref('');

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const saveProfile = () => {
  // 保存个人资料的逻辑
  console.log('保存个人资料:', userProfile);
};
</script>

<template>
  <div class="user-profile-settings p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">个人资料设置</h2>

    <div class="max-w-2xl mx-auto">
      <!-- 头像上传 -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <div
            class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300"
          >
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              class="w-full h-full object-cover"
              alt="头像预览"
            />
            <span v-else class="text-gray-400 text-3xl">👤</span>
          </div>
          <label
            class="absolute bottom-0 right-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <input type="file" class="hidden" @change="handleAvatarUpload" accept="image/*" />
            📷
          </label>
        </div>
        <p class="text-sm text-gray-500">点击上传头像</p>
      </div>

      <!-- 个人资料表单 -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
          <input
            v-model="userProfile.nickname"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入昵称"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
          <textarea
            v-model="userProfile.bio"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="介绍一下自己吧"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            v-model="userProfile.email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入邮箱"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">电话</label>
          <input
            v-model="userProfile.phone"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入电话"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">所在地</label>
          <input
            v-model="userProfile.location"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入所在地"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">个人网站</label>
          <input
            v-model="userProfile.website"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入个人网站"
          />
        </div>

        <div class="pt-4">
          <button
            @click="saveProfile"
            class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            保存修改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-profile-settings {
  min-height: 600px;
}
</style>
