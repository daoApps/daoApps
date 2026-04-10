<script setup lang="ts">
import { ref, defineAsyncComponent, computed } from 'vue';

const SnakeGame = defineAsyncComponent(() => import('./SnakeGame.vue'));
const TetrisGame = defineAsyncComponent(() => import('./TetrisGame.vue'));
const Game2048 = defineAsyncComponent(() => import('./Game2048.vue'));

const activeTab = ref('snake');
const showRules = ref(false);

const games = [
  {
    id: 'snake',
    name: '贪吃蛇',
    icon: '🐍',
    desc: '经典贪吃蛇，考验你的反应速度',
    component: SnakeGame,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    icon: '🧱',
    desc: '消除方块，挑战最高分',
    component: TetrisGame,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: '2048',
    name: '2048',
    icon: '🔢',
    desc: '数字合并益智游戏',
    component: Game2048,
    color: 'from-orange-500 to-amber-600'
  }
];

const currentGame = computed(() => games.find((g) => g.id === activeTab.value));

function getHighScore(gameId: string): number {
  const keyMap: Record<string, string> = {
    snake: 'snake-high-score',
    tetris: 'tetris-high-score',
    '2048': 'game2048-high-score'
  };
  return Number(localStorage.getItem(keyMap[gameId]) || '0');
}

const totalGamesPlayed = computed(() => {
  return Number(localStorage.getItem('total-games-played') || '0');
});
</script>

<template>
  <div class="game-center">
    <!-- 游戏选择卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <TransitionGroup name="card" tag="div" class="contents">
        <div
          v-for="game in games"
          :key="game.id"
          :class="[
            'relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 p-4',
            activeTab === game.id
              ? `border-transparent bg-gradient-to-br ${game.color} text-white shadow-lg scale-[1.02]`
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 hover:shadow-md'
          ]"
          @click="activeTab = game.id"
        >
          <div class="flex items-start gap-3">
            <span class="text-4xl">{{ game.icon }}</span>
            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'font-bold text-lg',
                  activeTab === game.id ? 'text-white' : 'text-gray-900 dark:text-white'
                ]"
              >
                {{ game.name }}
              </h3>
              <p
                :class="[
                  'text-sm mt-0.5',
                  activeTab === game.id ? 'text-white/80' : 'text-gray-500'
                ]"
              >
                {{ game.desc }}
              </p>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <span
              :class="[
                'text-xs px-2 py-0.5 rounded-full',
                activeTab === game.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              ]"
            >
              最高分：{{ getHighScore(game.id) }}
            </span>
            <span v-if="activeTab === game.id" class="text-xs bg-white/30 px-2 py-0.5 rounded-full"
              >正在游玩</span
            >
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 游戏区域 -->
    <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 flex justify-center">
      <Transition name="fade" mode="out-in">
        <component :is="currentGame?.component" :key="activeTab" />
      </Transition>
    </div>

    <!-- 统计面板和规则 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <!-- 统计面板 -->
      <div
        class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5"
      >
        <h3 class="font-bold text-gray-900 dark:text-white mb-3">📊 游戏统计</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
            <p class="text-2xl font-bold text-purple-600">{{ totalGamesPlayed }}</p>
            <p class="text-xs text-gray-500">总局数</p>
          </div>
          <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
            <p class="text-2xl font-bold text-green-600">
              {{ Math.max(getHighScore('snake'), getHighScore('tetris'), getHighScore('2048')) }}
            </p>
            <p class="text-xs text-gray-500">最高分</p>
          </div>
        </div>
      </div>

      <!-- 规则说明折叠面板 -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click="showRules = !showRules"
        >
          <span class="font-medium text-gray-900 dark:text-white">📖 游戏规则说明</span>
          <svg
            class="w-5 h-5 text-gray-400 transition-transform"
            :class="{ 'rotate-180': showRules }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <Transition name="accordion">
          <div
            v-if="showRules"
            class="px-4 pb-4 space-y-3 text-sm text-gray-600 dark:text-gray-400"
          >
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">🐍 贪吃蛇</h4>
              <p>
                使用方向键或WASD控制蛇的移动方向。吃掉食物可以增长并得分，撞墙或撞到自己则游戏结束。分数越高，速度越快！
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">🧱 俄罗斯方块</h4>
              <p>
                ← → 移动，↑ 旋转，↓
                加速下落，空格键硬降落。填满一行即可消除得分，同时消除多行可获得更高分数。
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">🔢 2048</h4>
              <p>
                滑动合并相同数字的方块，目标是合成2048方块。相同数字相撞会合并为两倍数值。支持撤销操作（最多5步）。
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}
.card-move {
  transition: transform 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>
