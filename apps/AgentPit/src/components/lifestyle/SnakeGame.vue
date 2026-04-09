<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const GRID_SIZE = 20
const CELL_SIZE = 18
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE

interface Point { x: number; y: number }

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gameRunning = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const score = ref(0)
const highScore = ref(Number(localStorage.getItem('snake-high-score') || '0'))
const snake = ref<Point[]>([{ x: 10, y: 10 }])
const food = ref<Point>({ x: 15, y: 15 })
const direction = ref<{ x: number; y: number }>({ x: 1, y: 0 })
const nextDirection = ref<{ x: number; y: number }>({ x: 1, y: 0 })
const speed = ref(150)
let gameLoop: ReturnType<typeof setInterval> | null = null

function getInitialSpeed(): number {
  return Math.max(60, 150 - Math.floor(score.value / 5) * 10)
}

function generateFood(): void {
  let newFood: Point
  do {
    newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
  } while (snake.value.some(s => s.x === newFood.x && s.y === newFood.y))
  food.value = newFood
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  ctx.strokeStyle = '#2d2d44'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i * CELL_SIZE); ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE); ctx.stroke()
  }

  snake.value.forEach((segment, index) => {
    const isHead = index === 0
    const gradient = ctx.createRadialGradient(
      segment.x * CELL_SIZE + CELL_SIZE / 2,
      segment.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      segment.x * CELL_SIZE + CELL_SIZE / 2,
      segment.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    )
    if (isHead) {
      gradient.addColorStop(0, '#4ade80')
      gradient.addColorStop(1, '#22c55e')
    } else {
      const alpha = 1 - (index / snake.value.length) * 0.6
      gradient.addColorStop(0, `rgba(74, 222, 128, ${alpha})`)
      gradient.addColorStop(1, `rgba(34, 197, 94, ${alpha})`)
    }
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, isHead ? 4 : 3)
    ctx.fill()

    if (isHead) {
      ctx.fillStyle = '#fff'
      const eyeOffset = direction.value.x !== 0 ? 4 : 0
      ctx.beginPath()
      ctx.arc(segment.x * CELL_SIZE + CELL_SIZE / 2 - 3 + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE / 2 - 2, 2, 0, Math.PI * 2)
      ctx.arc(segment.x * CELL_SIZE + CELL_SIZE / 2 + 3 + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE / 2 - 2, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  const foodGradient = ctx.createRadialGradient(
    food.value.x * CELL_SIZE + CELL_SIZE / 2,
    food.value.y * CELL_SIZE + CELL_SIZE / 2,
    0,
    food.value.x * CELL_SIZE + CELL_SIZE / 2,
    food.value.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2
  )
  foodGradient.addColorStop(0, '#ef4444')
  foodGradient.addColorStop(1, '#dc2626')
  ctx.fillStyle = foodGradient
  ctx.beginPath()
  ctx.arc(food.value.x * CELL_SIZE + CELL_SIZE / 2, food.value.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(food.value.x * CELL_SIZE + CELL_SIZE / 2 - 2, food.value.y * CELL_SIZE + CELL_SIZE / 2 - 2, 1.5, 0, Math.PI * 2)
  ctx.fill()
}

function moveSnake() {
  direction.value = { ...nextDirection.value }
  const head = { x: snake.value[0]!.x + direction.value.x, y: snake.value[0]!.y + direction.value.y }

  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    endGame()
    return
  }

  if (snake.value.some(s => s.x === head.x && s.y === head.y)) {
    endGame()
    return
  }

  snake.value.unshift(head)

  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('snake-high-score', String(highScore.value))
    }
    speed.value = getInitialSpeed()
    generateFood()
    restartGameLoop()
  } else {
    snake.value.pop()
  }
}

function gameStep() {
  if (!gamePaused.value && !gameOver.value) {
    moveSnake()
    draw()
  }
}

function restartGameLoop() {
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(gameStep, speed.value)
}

function startGame() {
  snake.value = [{ x: 10, y: 10 }]
  direction.value = { x: 1, y: 0 }
  nextDirection.value = { x: 1, y: 0 }
  score.value = 0
  speed.value = 150
  gameOver.value = false
  gamePaused.value = false
  gameRunning.value = true
  generateFood()
  draw()
  restartGameLoop()
}

function togglePause() {
  if (!gameRunning.value || gameOver.value) return
  gamePaused.value = !gamePaused.value
}

function endGame() {
  gameOver.value = true
  gameRunning.value = false
  if (gameLoop) clearInterval(gameLoop)
}

function handleKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, { x: number; y: number }> = {
    ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
    s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
    a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
    d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
  }
  const newDir = keyMap[e.key]
  if (newDir) {
    e.preventDefault()
    if ((newDir.x !== -direction.value.x || newDir.y !== -direction.value.y) ||
        (direction.value.x === 0 && direction.value.y === 0)) {
      nextDirection.value = newDir
    }
  }
  if (e.key === ' ') {
    e.preventDefault()
    if (!gameRunning.value) startGame()
    else togglePause()
  }
}

let touchStartX = 0
let touchStartY = 0
function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]!.clientX
  touchStartY = e.touches[0]!.clientY
}
function handleTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchStartX
  const dy = e.changedTouches[0]!.clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < 30) return
  let newDir: { x: number; y: number } | undefined
  if (absDx > absDy) newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }
  else newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }
  if (newDir && (newDir.x !== -direction.value.x || newDir.y !== -direction.value.y)) {
    nextDirection.value = newDir
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  const canvas = canvasRef.value
  if (canvas) {
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
  draw()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (gameLoop) clearInterval(gameLoop)
})
</script>

<template>
  <div class="snake-game flex flex-col items-center">
    <div class="flex items-center justify-between w-full max-w-[360px] mb-3">
      <div class="flex gap-4 text-sm">
        <span class="text-gray-600 dark:text-gray-400">分数：<strong class="text-green-500">{{ score }}</strong></span>
        <span class="text-gray-600 dark:text-gray-400">最高分：<strong class="text-yellow-500">{{ highScore }}</strong></span>
      </div>
    </div>

    <canvas ref="canvasRef" :width="CANVAS_SIZE" :height="CANVAS_SIZE"
      class="rounded-xl border-2 border-gray-700 shadow-lg" tabindex="0"></canvas>

    <div v-if="!gameRunning && !gameOver" class="mt-4 text-center">
      <p class="text-gray-500 text-sm mb-3">按 空格键 或点击下方按钮开始</p>
    </div>

    <div v-if="gameOver" class="mt-4 text-center animate-pulse">
      <p class="text-red-500 font-bold text-lg">游戏结束!</p>
      <p class="text-gray-500 text-sm mt-1">得分：{{ score }} | 最高：{{ highScore }}</p>
    </div>

    <div class="flex gap-2 mt-4">
      <button v-if="!gameRunning || gameOver" @click="startGame"
        class="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
        {{ gameOver ? '重新开始' : '开始游戏' }}
      </button>
      <button v-if="gameRunning && !gameOver" @click="togglePause"
        class="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm">
        {{ gamePaused ? '继续' : '暂停' }}
      </button>
      <button @click="startGame"
        class="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm">
        重置
      </button>
    </div>

    <!-- 移动端触控 -->
    <div class="grid grid-cols-3 gap-2 mt-4 sm:hidden w-[180px]">
      <div></div>
      <button @click="nextDirection = { x: 0, y: -1 }" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">↑</button>
      <div></div>
      <button @click="nextDirection = { x: -1, y: 0 }" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">←</button>
      <button @click="nextDirection = { x: 0, y: 1 }" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">↓</button>
      <button @click="nextDirection = { x: 1, y: 0 }" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">→</button>
    </div>

    <p class="text-xs text-gray-400 mt-3 text-center">使用 ↑↓←→ 或 WASD 控制方向 | 空格键 暂停/开始</p>

    <!-- 游戏结束弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="gameOver" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
            <div class="text-6xl mb-4">🐍</div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">游戏结束!</h3>
            <p class="text-4xl font-bold text-green-500 my-4">{{ score }} 分</p>
            <p v-if="score >= highScore && score > 0" class="text-yellow-500 font-medium mb-4">🎉 新纪录!</p>
            <p class="text-gray-500 text-sm mb-6">最高分：{{ highScore }}</p>
            <button @click="startGame" class="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold text-lg">
              再来一局
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.3s ease; }
.modal-enter-from > div { transform: scale(0.9); }
.modal-leave-to > div { transform: scale(0.9); }
</style>
