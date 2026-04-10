<script setup lang="ts">
import { ref, reactive } from 'vue';
import { defaultUserProfile, cities, type UserProfile } from '../../data/mockSettings';

const profile = reactive<UserProfile>({ ...defaultUserProfile });
const originalProfile = ref(JSON.stringify(profile));
const showSuccessToast = ref(false);
const avatarPreview = ref('');
const hasUnsavedChanges = ref(false);

function handleAvatarUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarPreview.value = ev.target?.result as string;
      profile.avatar = avatarPreview.value;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^1[3-9]\d{9}$/;

const emailValid = computed(() => !profile.email || emailPattern.test(profile.email));
const phoneValid = computed(() => !profile.phone || phonePattern.test(profile.phone));
const nicknameValid = computed(() => profile.nickname.length >= 2 && profile.nickname.length <= 30);
const bioValid = computed(() => profile.bio.length <= 200);

const isFormValid = computed(
  () => nicknameValid.value && emailValid.value && phoneValid.value && bioValid.value
);

watch(
  () => JSON.stringify(profile),
  () => {
    hasUnsavedChanges.value = JSON.stringify(profile) !== originalProfile.value;
  },
  { deep: true }
);

function saveProfile() {
  if (!isFormValid.value) return;
  originalProfile.value = JSON.stringify(profile);
  hasUnsavedChanges.value = false;
  showSuccessToast.value = true;
  setTimeout(() => {
    showSuccessToast.value = false;
  }, 3000);
}

function resetForm() {
  Object.assign(profile, { ...defaultUserProfile });
  avatarPreview.value = '';
}

import { watch, computed } from 'vue';
</script>

<template>
  <div class="user-profile-settings">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">👤 个人资料设置</h3>

    <!-- 头像上传 -->
    <div class="flex items-center gap-5 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <div class="relative group">
        <div
          class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden cursor-pointer ring-4 ring-white dark:ring-gray-800 shadow-lg"
        >
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            alt="头像"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-3xl">👤</span>
        </div>
        <label
          class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <span class="text-white text-xs font-medium">更换</span>
          <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
        </label>
      </div>
      <div>
        <p class="font-medium text-gray-900 dark:text-white">{{ profile.nickname }}</p>
        <p class="text-sm text-gray-500 mt-0.5">点击头像更换照片</p>
        <p class="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式，建议尺寸 200x200</p>
      </div>
    </div>

    <!-- 表单字段 -->
    <div class="space-y-4">
      <!-- 昵称 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          昵称 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="profile.nickname"
          type="text"
          placeholder="请输入昵称（2-30字符）"
          maxlength="30"
          :class="[
            'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-colors',
            nicknameValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-400'
          ]"
        />
        <p class="text-xs mt-1" :class="nicknameValid ? 'text-gray-500' : 'text-red-500'">
          {{ profile.nickname.length }}/30 字符
          {{ nicknameValid ? '' : '- 昵称长度需在2-30个字符之间' }}
        </p>
      </div>

      <!-- 个人简介 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >个人简介</label
        >
        <textarea
          v-model="profile.bio"
          rows="3"
          placeholder="介绍一下自己吧..."
          maxlength="200"
          :class="[
            'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none resize-none transition-colors',
            bioValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-400'
          ]"
        ></textarea>
        <p class="text-xs mt-1 text-gray-500">{{ profile.bio.length }}/200 字符</p>
      </div>

      <!-- 邮箱和手机 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >邮箱地址</label
          >
          <input
            v-model="profile.email"
            type="email"
            placeholder="example@email.com"
            :class="[
              'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none',
              emailValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-400'
            ]"
          />
          <p v-if="!emailValid && profile.email" class="text-xs mt-1 text-red-500">
            请输入有效的邮箱地址
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >手机号码</label
          >
          <input
            v-model="profile.phone"
            type="tel"
            placeholder="13800138000"
            :class="[
              'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none',
              phoneValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-400'
            ]"
          />
          <p v-if="!phoneValid && profile.phone" class="text-xs mt-1 text-red-500">
            请输入有效的手机号
          </p>
        </div>
      </div>

      <!-- 所在城市 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >所在城市</label
        >
        <select
          v-model="profile.location"
          class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="">请选择城市</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <!-- 个人网站 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >个人网站 <span class="text-gray-400">(可选)</span></label
        >
        <input
          v-model="profile.website"
          type="url"
          placeholder="https://example.com"
          class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div
      class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
      <button
        class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        @click="resetForm"
      >
        重置
      </button>
      <div class="flex items-center gap-3">
        <span v-if="hasUnsavedChanges" class="text-xs text-orange-500 font-medium animate-pulse"
          >* 有未保存的更改</span
        >
        <button
          :disabled="!isFormValid"
          class="px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
          :class="
            isFormValid
              ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          "
          @click="saveProfile"
        >
          保存修改
        </button>
      </div>
    </div>

    <!-- 成功提示 Toast -->
    <Transition name="toast">
      <div
        v-if="showSuccessToast"
        class="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="font-medium">保存成功！</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
