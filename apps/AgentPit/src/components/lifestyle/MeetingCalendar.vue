<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  meetings as mockMeetings,
  meetingTypeColors,
  type Meeting
} from '../../data/mockLifestyle';

const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);
const showDayModal = ref(false);
const showAddModal = ref(false);
const viewMode = ref<'month' | 'week'>('month');
const allMeetings = ref<Meeting[]>([...mockMeetings]);

const newMeeting = ref<Partial<Meeting>>({
  title: '',
  startTime: '09:00',
  endTime: '10:00',
  type: 'work',
  location: '',
  notes: ''
});

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const monthNames = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
];
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
});

function getMeetingsForDate(date: Date): Meeting[] {
  const dateStr = formatDate(date);
  return allMeetings.value.filter((m) => m.date === dateStr);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isSelected(date: Date): boolean {
  if (!selectedDate.value) return false;
  return date.getTime() === selectedDate.value.getTime();
}

const todayMeetings = computed(() => getMeetingsForDate(new Date()));
const todayMeetingCount = computed(() => todayMeetings.value.length);

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
}

function goToToday() {
  currentDate.value = new Date();
  selectedDate.value = new Date();
}

function openDayDetail(date: Date) {
  selectedDate.value = date;
  showDayModal.value = true;
}

function closeDayModal() {
  showDayModal.value = false;
  setTimeout(() => {
    selectedDate.value = null;
  }, 200);
}

function openAddModal(date?: Date) {
  if (date) selectedDate.value = date;
  newMeeting.value = {
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'work',
    location: '',
    notes: ''
  };
  showAddModal.value = true;
}

function closeAddModal() {
  showAddModal.value = false;
}

function addMeeting() {
  if (!newMeeting.value.title?.trim()) return;
  const meeting: Meeting = {
    id: `m-${Date.now()}`,
    title: newMeeting.value.title,
    date: selectedDate.value ? formatDate(selectedDate.value) : formatDate(new Date()),
    startTime: newMeeting.value.startTime || '09:00',
    endTime: newMeeting.value.endTime || '10:00',
    participants: [],
    location: newMeeting.value.location || '',
    type: (newMeeting.value.type as Meeting['type']) || 'work',
    notes: newMeeting.value.notes || ''
  };
  allMeetings.value.push(meeting);
  closeAddModal();
}

function deleteMeeting(id: string) {
  allMeetings.value = allMeetings.value.filter((m) => m.id !== id);
}

const typeLabels: Record<string, string> = {
  work: '工作',
  personal: '个人',
  important: '重要',
  recurring: '重复'
};
</script>

<template>
  <div class="meeting-calendar">
    <!-- 头部导航 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ currentYear }}年 {{ monthNames[currentMonth] }}
        </h2>
        <span
          v-if="todayMeetingCount > 0"
          class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full"
        >
          今日 {{ todayMeetingCount }} 个会议
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          @click="viewMode = viewMode === 'month' ? 'week' : 'month'"
        >
          {{ viewMode === 'month' ? '周视图' : '月视图' }}
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          @click="goToToday"
        >
          今天
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="prevMonth"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="nextMonth"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 会议类型图例 -->
    <div class="flex flex-wrap gap-3 mb-3 text-xs">
      <div v-for="(color, type) in meetingTypeColors" :key="type" class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: color }"></span>
        <span class="text-gray-600 dark:text-gray-400">{{ typeLabels[type] }}</span>
      </div>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-1">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-medium py-2 text-gray-500 dark:text-gray-400"
      >
        {{ day }}
      </div>
    </div>

    <!-- 日历网格 -->
    <Transition name="calendar-fade" mode="out-in">
      <div :key="`${currentYear}-${currentMonth}`" class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'min-h-[80px] p-1.5 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-150',
            day
              ? 'hover:bg-indigo-50 dark:hover:bg-gray-700/50'
              : 'bg-gray-50/50 dark:bg-gray-800/30 cursor-default',
            day && isToday(day)
              ? 'ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-gray-800'
              : '',
            day && isSelected(day) ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''
          ]"
          @click="day && openDayDetail(day)"
        >
          <template v-if="day">
            <div class="flex justify-between items-start">
              <span
                :class="[
                  'text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full',
                  isToday(day) ? 'bg-indigo-500 text-white' : 'text-gray-700 dark:text-gray-300'
                ]"
                >{{ day.getDate() }}</span
              >
            </div>
            <div class="mt-1 space-y-0.5">
              <template v-for="meeting in getMeetingsForDate(day).slice(0, 3)" :key="meeting.id">
                <div class="flex items-center gap-1 truncate">
                  <span
                    class="w-1.5 h-1.5 rounded-sm flex-shrink-0"
                    :style="{ backgroundColor: meetingTypeColors[meeting.type] }"
                  ></span>
                  <span class="text-xs text-gray-600 dark:text-gray-400 truncate">{{
                    meeting.title
                  }}</span>
                </div>
              </template>
              <span
                v-if="getMeetingsForDate(day).length > 3"
                class="text-xs text-indigo-500 dark:text-indigo-400 font-medium"
              >
                +{{ getMeetingsForDate(day).length - 3 }} 更多
              </span>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- 当日会议详情弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDayModal && selectedDate"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          @click.self="closeDayModal"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
          >
            <div class="p-5 border-b border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ selectedDate.getMonth() + 1 }}月{{ selectedDate.getDate() }}日 会议安排
                </h3>
                <button
                  class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="closeDayModal"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-5 space-y-3 overflow-y-auto max-h-[50vh]">
              <div
                v-if="getMeetingsForDate(selectedDate).length === 0"
                class="text-center py-8 text-gray-400"
              >
                暂无会议安排
              </div>
              <TransitionGroup name="list">
                <div
                  v-for="meeting in getMeetingsForDate(selectedDate)"
                  :key="meeting.id"
                  class="p-3 rounded-xl border-l-4 bg-gray-50 dark:bg-gray-700/50"
                  :style="{ borderColor: meetingTypeColors[meeting.type] }"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        {{ meeting.title }}
                      </h4>
                      <p class="text-sm text-gray-500 mt-1">
                        {{ meeting.startTime }} - {{ meeting.endTime }} · {{ meeting.location }}
                      </p>
                      <p v-if="meeting.notes" class="text-xs text-gray-400 mt-1">
                        {{ meeting.notes }}
                      </p>
                    </div>
                    <button
                      class="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      @click="deleteMeeting(meeting.id)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                class="w-full py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                @click="
                  openAddModal();
                  closeDayModal();
                "
              >
                + 添加新会议
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 添加会议弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          @click.self="closeAddModal"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div class="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">添加新会议</h3>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >会议标题 *</label
                >
                <input
                  v-model="newMeeting.title"
                  type="text"
                  placeholder="输入会议标题"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >开始时间</label
                  >
                  <input
                    v-model="newMeeting.startTime"
                    type="time"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >结束时间</label
                  >
                  <input
                    v-model="newMeeting.endTime"
                    type="time"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >地点</label
                >
                <input
                  v-model="newMeeting.location"
                  type="text"
                  placeholder="会议地点"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >会议类型</label
                >
                <select
                  v-model="newMeeting.type"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="work">工作</option>
                  <option value="personal">个人</option>
                  <option value="important">重要</option>
                  <option value="recurring">重复</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >备注</label
                >
                <textarea
                  v-model="newMeeting.notes"
                  rows="2"
                  placeholder="会议备注信息"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                ></textarea>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                class="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="closeAddModal"
              >
                取消
              </button>
              <button
                class="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                @click="addMeeting"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: opacity 0.25s ease;
}
.calendar-fade-enter-from,
.calendar-fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}
.modal-enter-from > div {
  transform: scale(0.95);
}
.modal-leave-to > div {
  transform: scale(0.95);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
