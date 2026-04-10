<script setup lang="ts">
import { ref, onMounted } from 'vue';

const currentDate = ref(new Date());
const meetings = ref([
  {
    id: 1,
    title: '团队周会',
    date: new Date(),
    time: '10:00 AM',
    duration: 60,
    attendees: ['张三', '李四', '王五'],
    location: '会议室 A'
  },
  {
    id: 2,
    title: '项目评审',
    date: new Date(),
    time: '2:00 PM',
    duration: 90,
    attendees: ['赵六', '钱七'],
    location: '线上会议'
  }
]);

const getCurrentMonth = () => {
  return currentDate.value.toLocaleString('zh-CN', { month: 'long' });
};

const getCurrentYear = () => {
  return currentDate.value.getFullYear();
};

const getTodayMeetings = () => {
  const today = new Date();
  return meetings.value.filter((meeting) => {
    const meetingDate = new Date(meeting.date);
    return (
      meetingDate.getFullYear() === today.getFullYear() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getDate() === today.getDate()
    );
  });
};

onMounted(() => {
  // 初始化逻辑
});
</script>

<template>
  <div class="meeting-calendar p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ getCurrentYear() }}年 {{ getCurrentMonth() }}
      </h2>
      <div class="flex space-x-2">
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
          上个月
        </button>
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
          下个月
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div class="text-center text-sm font-medium text-gray-500">日</div>
      <div class="text-center text-sm font-medium text-gray-500">一</div>
      <div class="text-center text-sm font-medium text-gray-500">二</div>
      <div class="text-center text-sm font-medium text-gray-500">三</div>
      <div class="text-center text-sm font-medium text-gray-500">四</div>
      <div class="text-center text-sm font-medium text-gray-500">五</div>
      <div class="text-center text-sm font-medium text-gray-500">六</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <!-- 日期格子 -->
      <div
        v-for="day in 35"
        :key="day"
        class="h-12 flex items-center justify-center border border-gray-100 rounded-md"
      >
        <span class="text-sm">{{ day }}</span>
      </div>
    </div>

    <div class="mt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">
        今日会议 ({{ getTodayMeetings().length }})
      </h3>
      <div class="space-y-2">
        <div
          v-for="meeting in getTodayMeetings()"
          :key="meeting.id"
          class="p-3 bg-gray-50 rounded-md"
        >
          <div class="font-medium">{{ meeting.title }}</div>
          <div class="text-sm text-gray-600">{{ meeting.time }} • {{ meeting.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meeting-calendar {
  min-height: 400px;
}
</style>
