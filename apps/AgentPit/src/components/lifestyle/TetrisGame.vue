<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const COLS = 10
const ROWS = 20
const CELL_SIZE = 24
const CANVAS_WIDTH = COLS * CELL_SIZE
const CANVAS_HEIGHT = ROWS * CELL_SIZE
const PREVIEW_CELL = 18

type ShapeType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

interface Point { x: number; y: number }
interface Tetromino { shape: ShapeType; position: Point; rotation: number }

const SHAPES: Record<ShapeType, number[][]> = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1],[0,0,0]],
  S: [[0,1,1],[1,1,0],[0,0,0]],
  Z: [[1,1,0],[0,1,1],[0,0,0]],
  J: [[1,0,0],[1,1,1],[0,0,0]],
  L: [[0,0,1],[1,1,1],[0,0,0]],
}

const COLORS: Record<ShapeType, string> = { I: '#00f0f0', O: '#f0f000', T: '#a000f0', S: '#00f000', Z: '#f00000', J: '#0000f0', L: '#f0a000' }

const canvasRef = ref<HTMLCanvasElement | null>(null)
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const gameRunning = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const score = ref(0)
const level = ref(1)
const linesCleared = ref(0)
const highScore = ref(Number(localStorage.getItem('tetris-high-score') || '0'))
const board = ref<number[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)))
const currentPiece = ref<Tetromino | null>(null)
const nextPiece = ref<ShapeType>('T')
let dropInterval: ReturnType<typeof setInterval> | null = null
let dropSpeed = 1000

function getRandomShape(): ShapeType {
  const shapes: ShapeType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
  return shapes[Math.floor(Math.random() * shapes.length)]!
}

function rotateMatrix(matrix: number[][]): number[][] {
  const N = matrix.length
  const result: number[][] = Array.from({ length: N }, () => Array(N).fill(0))
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j]![N - 1 - i] = matrix[i]![j]
    }
  }
  return result
}

function getShapeMatrix(piece: Tetromino): number[][] {
  let matrix = SHAPES[piece.shape]
  for (let r = 0; r < piece.rotation; r++) {
    matrix = rotateMatrix(matrix)
  }
  return matrix
}

function isValidMove(piece: Tetromino, offsetX = 0, offsetY = 0, newRotation?: number): boolean {
  const matrix = newRotation !== undefined ? getShapeMatrix({ ...piece, rotation: newRotation }) : getShapeMatrix(piece)
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < (matrix[row]?.length || 0); col++) {
      if (matrix[row]![col]) {
        const newX = piece.position.x + col + offsetX
        const newY = piece.position.y + row + offsetY
        if (newX < 0 || newX >= COLS || newY >= ROWS) return false
        if (newY >= 0 && board.value[newY]![newX]) return false
      }
    }
  }
  return true
}

function spawnPiece(): void {
  const shape = nextPiece.value
  nextPiece.value = getRandomShape()
  currentPiece.value = { shape, position: { x: Math.floor(COLS / 2) - 1, y: 0 }, rotation: 0 }

  if (!isValidMove(currentPiece.value)) {
    endGame()
  }
  drawPreview()
}

function lockPiece(): void {
  if (!currentPiece.value) return
  const matrix = getShapeMatrix(currentPiece.value)
  const colorMap: Record<string, number> = { I: 1, O: 2, T: 3, S: 4, Z: 5, J: 6, L: 7 }

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < (matrix[row]?.length || 0); col++) {
      if (matrix[row]![col]) {
        const y = currentPiece.value.position.y + row
        const x = currentPiece.value.position.x + col
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          board.value[y]![x] = colorMap[currentPiece.value.shape]
        }
      }
    }
  }
  clearLines()
  spawnPiece()
}

function clearLines(): void {
  let cleared = 0
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board.value[row]!.every((cell: number) => cell !== 0)) {
      board.value.splice(row, 1)
      board.value.unshift(Array(COLS).fill(0))
      cleared++
      row++
    }
  }
  if (cleared > 0) {
    const points = [0, 100, 300, 500, 800]
    score.value += (points[cleared] || 0) * level.value
    linesCleared.value += cleared
    level.value = Math.floor(linesCleared.value / 10) + 1
    dropSpeed = Math.max(100, 1000 - (level.value - 1) * 80)
    restartDrop()

    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('tetris-high-score', String(highScore.value))
    }
  }
}

function moveLeft(): void { if (currentPiece.value && isValidMove(currentPiece.value, -1, 0)) currentPiece.value.position.x-- }
function moveRight(): void { if (currentPiece.value && isValidMove(currentPiece.value, 1, 0)) currentPiece.value.position.x++ }
function rotate(): void {
  if (!currentPiece.value) return
  const newRotation = (currentPiece.value.rotation + 1) % 4
  if (isValidMove(currentPiece.value, 0, 0, newRotation)) currentPiece.value.rotation = newRotation
}
function softDrop(): void { if (currentPiece.value && isValidMove(currentPiece.value, 0, 1)) { currentPiece.value.position.y++; score.value += 1 } else lockPiece() }
function hardDrop(): void {
  if (!currentPiece.value) return
  while (currentPiece.value && isValidMove(currentPiece.value, 0, 1)) {
    currentPiece.value.position.y++
    score.value += 2
  }
  lockPiece()
}

function drop(): void {
  if (!gameRunning.value || gamePaused.value || gameOver.value || !currentPiece.value) return
  if (isValidMove(currentPiece.value, 0, 1)) {
    currentPiece.value.position.y++
  } else {
    lockPiece()
  }
  draw()
}

function restartDrop(): void {
  if (dropInterval) clearInterval(dropInterval)
  dropInterval = setInterval(drop, dropSpeed)
}

function draw(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.strokeStyle = '#2d2d44'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT); ctx.stroke() }
  for (let i = 0; i <= ROWS; i++) { ctx.beginPath(); ctx.moveTo(0, i * CELL_SIZE); ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE); ctx.stroke() }

  const colorValues: Record<number, string> = { 0: '', 1: '#00f0f0', 2: '#f0f000', 3: '#a000f0', 4: '#00f000', 5: '#f00000', 6: '#0000f0', 7: '#f0a000' }

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board.value[row]![col]) {
        ctx.fillStyle = colorValues[board.value[row]![col] || 0]
        ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
        ctx.fillStyle = 'rgba(255,255,255,0.15)'
        ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, 3)
        ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, 3, CELL_SIZE - 2)
      }
    }
  }

  if (currentPiece.value) {
    const matrix = getShapeMatrix(currentPiece.value)
    const baseColor = COLORS[currentPiece.value.shape]

    let ghostY = currentPiece.value.position.y
    while (isValidMove(currentPiece.value, 0, ghostY - currentPiece.value.position.y + 1)) ghostY++

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < (matrix[row]?.length || 0); col++) {
        if (matrix[row]![col]) {
          const x = (currentPiece.value.position.x + col) * CELL_SIZE
          const y = (ghostY + row) * CELL_SIZE
          ctx.fillStyle = baseColor.replace(')', ', 0.2)').replace('rgb', 'rgba').replace('#', '')
          ctx.globalAlpha = 0.2
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2)
          ctx.globalAlpha = 1

          const px = (currentPiece.value.position.x + col) * CELL_SIZE
          const py = (currentPiece.value.position.y + row) * CELL_SIZE
          ctx.fillStyle = baseColor
          ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2)
          ctx.fillStyle = 'rgba(255,255,255,0.25)'
          ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, 3)
          ctx.fillRect(px + 1, py + 1, 3, CELL_SIZE - 2)
        }
      }
    }
  }
}

function drawPreview(): void {
  const canvas = previewCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, PREVIEW_CELL * 5, PREVIEW_CELL * 5)

  const matrix = SHAPES[nextPiece.value]
  const color = COLORS[nextPiece.value]
  const offsetX = (5 - (matrix[0]?.length || 0)) / 2
  const offsetY = (5 - matrix.length) / 2

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < (matrix[row]?.length || 0); col++) {
      if (matrix[row]![col]) {
        ctx.fillStyle = color
        ctx.fillRect((offsetX + col) * PREVIEW_CELL + 1, (offsetY + row) * PREVIEW_CELL + 1, PREVIEW_CELL - 2, PREVIEW_CELL - 2)
      }
    }
  }
}

function startGame(): void {
  board.value = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  score.value = 0
  level.value = 1
  linesCleared.value = 0
  dropSpeed = 1000
  gameOver.value = false
  gamePaused.value = false
  gameRunning.value = true
  nextPiece.value = getRandomShape()
  spawnPiece()
  draw()
  restartDrop()
}

function togglePause(): void {
  if (!gameRunning.value || gameOver.value) return
  gamePaused.value = !gamePaused.value
  if (gamePaused.value && dropInterval) clearInterval(dropInterval)
  else if (!gamePaused.value) restartDrop()
}

function endGame(): void {
  gameOver.value = true
  gameRunning.value = false
  if (dropInterval) clearInterval(dropInterval)
}

function handleKeydown(e: KeyboardEvent): void {
  if (!gameRunning.value || gameOver.value) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); startGame() }
    return
  }
  switch (e.key) {
    case 'ArrowLeft': e.preventDefault(); moveLeft(); draw(); break
    case 'ArrowRight': e.preventDefault(); moveRight(); draw(); break
    case 'ArrowDown': e.preventDefault(); softDrop(); break
    case 'ArrowUp': e.preventDefault(); rotate(); draw(); break
    case ' ': e.preventDefault(); hardDrop(); break
    case 'p': case 'P': e.preventDefault(); togglePause(); break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  draw()
  drawPreview()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (dropInterval) clearInterval(dropInterval)
})
</script>

<template>
  <div class="tetris-game flex flex-col items-center">
    <!-- 统计信息 -->
    <div class="flex gap-4 mb-3 text-sm w-full justify-center flex-wrap">
      <span class="text-gray-600 dark:text-gray-400">分数：<strong class="text-indigo-500">{{ score }}</strong></span>
      <span class="text-gray-600 dark:text-gray-400">等级：<strong class="text-green-500">{{ level }}</strong></span>
      <span class="text-gray-600 dark:text-gray-400">消行：<strong class="text-yellow-500">{{ linesCleared }}</strong></span>
      <span class="text-gray-600 dark:text-gray-400">最高分：<strong class="text-red-500">{{ highScore }}</strong></span>
    </div>

    <div class="flex gap-4 items-start">
      <!-- 游戏主画布 -->
      <canvas ref="canvasRef" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT"
        class="rounded-xl border-2 border-gray-700 shadow-lg"></canvas>

      <!-- 侧边栏 -->
      <div class="flex flex-col gap-4 min-w-[120px]">
        <div class="bg-gray-800 rounded-lg p-3">
          <p class="text-xs text-gray-400 text-center mb-2">下一个</p>
          <canvas ref="previewCanvasRef" :width="PREVIEW_CELL * 5" :height="PREVIEW_CELL * 5"
            class="mx-auto rounded border border-gray-700"></canvas>
        </div>
        <div class="text-xs text-gray-500 space-y-1 bg-gray-800/50 rounded p-2">
          <p>← → 移动</p>
          <p>↑ 旋转</p>
          <p>↓ 加速</p>
          <p>空格 硬降</p>
          <p>P 暂停</p>
        </div>
      </div>
    </div>

    <div v-if="!gameRunning && !gameOver" class="mt-4 text-center">
      <p class="text-gray-500 text-sm mb-3">按 Enter 或点击下方按钮开始</p>
    </div>

    <div v-if="gameOver" class="mt-4 text-center animate-pulse">
      <p class="text-red-500 font-bold text-lg">游戏结束!</p>
      <p class="text-gray-500 text-sm mt-1">得分：{{ score }} | 等级：{{ level }}</p>
    </div>

    <div class="flex gap-2 mt-4">
      <button v-if="!gameRunning || gameOver" @click="startGame"
        class="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm">
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
    <div class="sm:hidden mt-4 grid grid-cols-4 gap-2 w-[200px]">
      <button @click="rotate()" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300 text-sm">↻</button>
      <div></div><div></div><div></div>
      <button @click="moveLeft(); draw()" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">←</button>
      <button @click="softDrop(); draw()" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">↓</button>
      <button @click="moveRight(); draw()" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300">→</button>
      <div></div>
      <button @click="hardDrop()" class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg active:bg-indigo-300 text-sm">⤓</button>
      <div></div>
    </div>

    <!-- 游戏结束弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="gameOver" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
            <div class="text-6xl mb-4">🧱</div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">游戏结束!</h3>
            <p class="text-4xl font-bold text-indigo-500 my-4">{{ score }} 分</p>
            <div class="grid grid-cols-3 gap-2 text-sm my-4">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2"><p class="text-gray-500">等级</p><p class="font-bold text-green-500">{{ level }}</p></div>
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2"><p class="text-gray-500">消行</p><p class="font-bold text-yellow-500">{{ linesCleared }}</p></div>
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2"><p class="text-gray-500">最高</p><p class="font-bold text-red-500">{{ highScore }}</p></div>
            </div>
            <button @click="startGame" class="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-bold text-lg">
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