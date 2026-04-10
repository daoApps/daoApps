<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const SIZE = 4;
const WINNING_VALUE = 2048;

interface GameState {
  grid: number[][];
  score: number;
}

const grid = ref<number[][]>(
  Array.from({ length: SIZE }, () => Array.from({ length: SIZE }).fill(0)) as number[][]
);
const score = ref(0);
const highScore = ref(Number(localStorage.getItem('game2048-high-score') || '0'));
const gameOver = ref(false);
const gameWon = ref(false);
const showWinAnimation = ref(false);
const history: GameState[] = [];
const MAX_HISTORY = 5;

function getEmptyCells(): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid.value[r]![c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

function addRandomTile(): void {
  const empty = getEmptyCells();
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]!;
  grid.value[r]![c] = Math.random() < 0.9 ? 2 : 4;
}

function saveState(): void {
  history.push({
    grid: grid.value.map((row) => [...row]),
    score: score.value
  });
  if (history.length > MAX_HISTORY) history.shift();
}

function undo(): void {
  if (history.length === 0) return;
  const prev = history.pop()!;
  grid.value = prev.grid;
  score.value = prev.score;
  gameOver.value = false;
}

function slide(row: (number | undefined)[]): { newRow: number[]; merged: boolean; gain: number } {
  let arr = row.filter((x) => x !== 0 && x !== undefined);
  const merged: boolean[] = Array(arr.length).fill(false);
  let gain = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1] && !merged[i]) {
      arr[i] = (arr[i] || 0) * 2;
      gain += arr[i]!;
      arr.splice(i + 1, 1);
      merged[i] = true;
      if (arr[i]! === WINNING_VALUE && !gameWon.value) gameWon.value = true;
    }
  }
  while (arr.length < SIZE) arr.push(0);

  return { newRow: arr as number[], merged: merged.some((m) => m), gain };
}

function move(direction: 'up' | 'down' | 'left' | 'right'): boolean {
  if (gameOver.value) return false;
  saveState();

  const oldGrid = JSON.stringify(grid.value);
  let totalGain = 0;

  if (direction === 'left') {
    for (let r = 0; r < SIZE; r++) {
      const result = slide(grid.value[r]!);
      grid.value[r] = result.newRow;
      totalGain += result.gain;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < SIZE; r++) {
      const result = slide([...grid.value[r]!].reverse());
      grid.value[r] = result.newRow.reverse();
      totalGain += result.gain;
    }
  } else if (direction === 'up') {
    for (let c = 0; c < SIZE; c++) {
      const col = grid.value.map((row) => row![c]);
      const result = slide(col);
      for (let r = 0; r < SIZE; r++) grid.value[r]![c] = result.newRow[r]!;
      totalGain += result.gain;
    }
  } else if (direction === 'down') {
    for (let c = 0; c < SIZE; c++) {
      const col = grid.value.map((row) => row![c]).reverse();
      const result = slide(col);
      const reversed = result.newRow.reverse();
      for (let r = 0; r < SIZE; r++) grid.value[r]![c] = reversed[r]!;
      totalGain += result.gain;
    }
  }

  score.value += totalGain;
  if (score.value > highScore.value) {
    highScore.value = score.value;
    localStorage.setItem('game2048-high-score', String(highScore.value));
  }

  if (JSON.stringify(grid.value) !== oldGrid) {
    addRandomTile();
    checkGameOver();
    return true;
  } else {
    history.pop();
    return false;
  }
}

function checkGameOver(): void {
  if (getEmptyCells().length > 0) return;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 1; c++) {
      if (grid.value[r]![c] === grid.value[r]![c + 1]) return;
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 1; r++) {
      if (grid.value[r]![c] === grid.value[r + 1]![c]) return;
    }
  }
  gameOver.value = true;
}

function newGame(): void {
  grid.value = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  score.value = 0;
  gameOver.value = false;
  gameWon.value = false;
  showWinAnimation.value = false;
  history.length = 0;
  addRandomTile();
  addRandomTile();
}

function continueAfterWin(): void {
  showWinAnimation.value = false;
  gameWon.value = false;
}

const tileColors: Record<number, string> = {
  0: '#cdc1b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e'
};
const tileTextColors: Record<number, string> = {
  0: 'transparent',
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2'
};

watch(gameWon, (val: boolean) => {
  if (val) showWinAnimation.value = true;
});

function handleKeydown(e: KeyboardEvent): void {
  const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    W: 'up',
    s: 'down',
    S: 'down',
    a: 'left',
    A: 'left',
    d: 'right',
    D: 'right'
  };
  const dir = keyMap[e.key];
  if (dir) {
    e.preventDefault();
    move(dir);
  }
}

let touchStartX = 0;
let touchStartY = 0;
function handleTouchStart(e: TouchEvent): void {
  touchStartX = e.touches[0]!.clientX;
  touchStartY = e.touches[0]!.clientY;
}
function handleTouchEnd(e: TouchEvent): void {
  const dx = e.changedTouches[0]!.clientX - touchStartX;
  const dy = e.changedTouches[0]!.clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 30) return;
  if (absDx > absDy) move(dx > 0 ? 'right' : 'left');
  else move(dy > 0 ? 'down' : 'up');
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  const container = document.getElementById('game2048-container');
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  newGame();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="game-2048 flex flex-col items-center">
    <!-- 分数面板 -->
    <div class="flex gap-3 mb-3 w-full justify-center">
      <div class="bg-gray-700 rounded-lg px-5 py-2 text-center min-w-[100px]">
        <p class="text-xs text-gray-400">分数</p>
        <p class="text-xl font-bold text-white">{{ score }}</p>
      </div>
      <div class="bg-gray-700 rounded-lg px-5 py-2 text-center min-w-[100px]">
        <p class="text-xs text-gray-400">最高分</p>
        <p class="text-xl font-bold text-yellow-400">{{ highScore }}</p>
      </div>
    </div>

    <!-- 游戏网格 -->
    <div
      id="game2048-container"
      class="relative bg-gray-700 p-2 rounded-xl shadow-lg select-none"
      style="width: min(340px, calc(100vw - 40px)); aspect-ratio: 1"
    >
      <TransitionGroup
        name="tile"
        tag="div"
        class="grid gap-1.5 w-full h-full"
        :style="{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }"
      >
        <div
          v-for="(cell, idx) in grid.flat()"
          :key="`${idx}-${cell}`"
          :class="[
            'flex items-center justify-center font-bold rounded-md transition-all duration-150',
            cell >= 1024
              ? 'text-2xl'
              : cell >= 128
                ? 'text-xl'
                : cell >= 16
                  ? 'text-lg'
                  : 'text-base'
          ]"
          :style="{
            backgroundColor: tileColors[cell || 0] || '#3c3a32',
            color: tileTextColors[cell || 0] || '#f9f6f2',
            boxShadow:
              cell >= 2048
                ? '0 0 20px rgba(237, 194, 46, 0.6), inset 0 0 10px rgba(255,255,255,0.2)'
                : ''
          }"
        >
          {{ cell || '' }}
        </div>
      </TransitionGroup>

      <!-- 胜利动画 -->
      <Transition name="win-fade">
        <div
          v-if="showWinAnimation && !gameOver"
          class="absolute inset-0 bg-yellow-400/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
        >
          <div class="text-center p-6">
            <div class="text-7xl mb-4 animate-bounce">🎉</div>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">达成 2048!</h3>
            <p class="text-gray-800 mb-6">恭喜你完成了挑战！</p>
            <div class="flex gap-3 justify-center">
              <button
                class="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium transition-colors"
                @click="continueAfterWin"
              >
                继续游戏
              </button>
              <button
                class="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-600 font-bold transition-colors"
                @click="
                  newGame();
                  showWinAnimation = false;
                "
              >
                新游戏
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 游戏结束遮罩 -->
      <Transition name="win-fade">
        <div
          v-if="gameOver"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
        >
          <div class="text-center p-6">
            <div class="text-6xl mb-3">😔</div>
            <h3 class="text-2xl font-bold text-white mb-2">游戏结束!</h3>
            <p class="text-gray-300 mb-1">
              最终得分：<span class="font-bold text-yellow-400">{{ score }}</span>
            </p>
            <button
              class="mt-4 px-8 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-bold transition-colors"
              @click="newGame"
            >
              再来一局
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-2 mt-4">
      <button
        class="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm"
        @click="newGame"
      >
        🔄 新游戏
      </button>
      <button
        :disabled="history.length === 0"
        class="px-5 py-2 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :class="
          history.length > 0
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-gray-300 text-gray-500'
        "
        @click="undo"
      >
        ↩️ 撤销 ({{ history.length }})
      </button>
    </div>

    <!-- 移动端触控 -->
    <div class="sm:hidden mt-4 grid grid-cols-3 gap-2 w-[180px]">
      <div></div>
      <button
        class="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300 text-xl"
        @click="move('up')"
      >
        ↑
      </button>
      <div></div>
      <button
        class="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300 text-xl"
        @click="move('left')"
      >
        ←
      </button>
      <button
        class="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300 text-xl"
        @click="move('down')"
      >
        ↓
      </button>
      <button
        class="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300 text-xl"
        @click="move('right')"
      >
        →
      </button>
    </div>

    <p class="text-xs text-gray-400 mt-3 text-center">使用 ↑↓←→ 或 WASD 合并数字 | 目标：2048</p>
  </div>
</template>

<style scoped>
.tile-enter-active {
  transition: all 0.15s ease-out;
}
.tile-enter-from {
  transform: scale(0);
  opacity: 0;
}
.tile-move {
  transition: transform 0.15s ease;
}

.win-fade-enter-active,
.win-fade-leave-active {
  transition: opacity 0.4s ease;
}
.win-fade-enter-from,
.win-fade-to {
  opacity: 0;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce {
  animation: bounce 0.6s ease infinite;
}
</style>
