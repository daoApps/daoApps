<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import type { GraphNode, GraphEdge } from '@/types/memory'

interface Props {
  nodes?: GraphNode[]
  edges?: GraphEdge[]
}

const props = withDefaults(defineProps<Props>(), {
  nodes: () => [],
  edges: () => []
})

const emit = defineEmits<{
  nodeClick: [node: GraphNode]
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const searchQuery = ref('')
const selectedNode = ref<GraphNode | null>(null)
const showNodeDetail = ref(false)

const transform = reactive({ x: 0, y: 0, scale: 1 })
const isDragging = ref(false)
const isPanning = ref(false)
const dragNode = ref<string | null>(null)
const lastMousePos = reactive({ x: 0, y: 0 })

const nodePositions = reactive<Map<string, { x: number; y: number }>>(new Map())
const nodeVelocities = reactive<Map<string, { vx: number; vy: number }>>(new Map())

const nodeTypeColors: Record<GraphNode['type'], string> = {
  concept: '#3b82f6',
  entity: '#10b981',
  event: '#f59e0b',
  document: '#8b5cf6',
  person: '#ef4444',
  location: '#06b6d4'
}

const edgeTypeColors: Record<GraphEdge['type'], string> = {
  related_to: '#94a3b8',
  contains: '#f97316',
  created_by: '#22c55e',
  located_at: '#0ea5e9',
  references: '#a855f7',
  belongs_to: '#ec4899'
}

const filteredNodes = computed(() => {
  if (!searchQuery.value) return props.nodes
  const query = searchQuery.value.toLowerCase()
  return props.nodes.filter(node =>
    node.label.toLowerCase().includes(query) ||
    node.description?.toLowerCase().includes(query)
  )
})

const filteredEdges = computed(() => {
  const nodeIdSet = new Set(filteredNodes.value.map(n => n.id))
  return props.edges.filter(edge => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target))
})

const initializePositions = () => {
  const width = containerRef.value?.clientWidth || 800
  const height = containerRef.value?.clientHeight || 600
  const centerX = width / 2
  const centerY = height / 2

  props.nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / props.nodes.length
    const radius = Math.min(width, height) * 0.3
    nodePositions.set(node.id, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    })
    nodeVelocities.set(node.id, { vx: 0, vy: 0 })
  })
}

const applyForces = () => {
  const width = containerRef.value?.clientWidth || 800
  const height = containerRef.value?.clientHeight || 600

  props.nodes.forEach(node => {
    if (dragNode.value === node.id) return

    const pos = nodePositions.get(node.id)
    const vel = nodeVelocities.get(node.id)
    if (!pos || !vel) return

    let fx = 0
    let fy = 0

    // 斥力（节点之间）
    props.nodes.forEach(other => {
      if (other.id === node.id) return
      const otherPos = nodePositions.get(other.id)
      if (!otherPos) return

      const dx = pos.x - otherPos.x
      const dy = pos.y - otherPos.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = 5000 / (dist * dist)

      fx += (dx / dist) * force
      fy += (dy / dist) * force
    })

    // 引力（边连接的节点）
    props.edges.forEach(edge => {
      let otherId: string | null = null
      if (edge.source === node.id) otherId = edge.target
      else if (edge.target === node.id) otherId = edge.source

      if (otherId) {
        const otherPos = nodePositions.get(otherId)
        if (!otherPos) return

        const dx = otherPos.x - pos.x
        const dy = otherPos.y - pos.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = dist * 0.01

        fx += (dx / dist) * force
        fy += (dy / dist) * force
      }
    })

    // 向心力（向中心）
    const cx = width / 2
    const cy = height / 2
    fx += (cx - pos.x) * 0.001
    fy += (cy - pos.y) * 0.001

    vel.vx = (vel.vx + fx) * 0.9
    vel.vy = (vel.vy + fy) * 0.9

    pos.x += vel.vx
    pos.y += vel.vy

    // 边界约束
    pos.x = Math.max(50, Math.min(width - 50, pos.x))
    pos.y = Math.max(50, Math.min(height - 50, pos.y))
  })
}

let animationFrame: number | null = null

const startSimulation = () => {
  const simulate = () => {
    applyForces()
    animationFrame = requestAnimationFrame(simulate)
  }
  simulate()
}

const stopSimulation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

const handleMouseDown = (e: MouseEvent, nodeId: string) => {
  e.stopPropagation()
  isDragging.value = true
  dragNode.value = nodeId
  lastMousePos.x = e.clientX
  lastMousePos.y = e.clientY
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value && dragNode.value) {
    const pos = nodePositions.get(dragNode.value)
    if (pos) {
      const dx = e.clientX - lastMousePos.x
      const dy = e.clientY - lastMousePos.y
      pos.x += dx / transform.scale
      pos.y += dy / transform.scale
      nodeVelocities.set(dragNode.value, { vx: 0, vy: 0 })
      lastMousePos.x = e.clientX
      lastMousePos.y = e.clientY
    }
  } else if (isPanning.value) {
    const dx = e.clientX - lastMousePos.x
    const dy = e.clientY - lastMousePos.y
    transform.x += dx
    transform.y += dy
    lastMousePos.x = e.clientX
    lastMousePos.y = e.clientY
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  isPanning.value = false
  dragNode.value = null
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.2, Math.min(3, transform.scale * delta))

  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    transform.x = mouseX - (mouseX - transform.x) * (newScale / transform.scale)
    transform.y = mouseY - (mouseY - transform.y) * (newScale / transform.scale)
  }

  transform.scale = newScale
}

const handleSvgMouseDown = (e: MouseEvent) => {
  if (e.target === svgRef.value) {
    isPanning.value = true
    lastMousePos.x = e.clientX
    lastMousePos.y = e.clientY
  }
}

const handleNodeClick = (node: GraphNode) => {
  selectedNode.value = node
  showNodeDetail.value = true
  emit('nodeClick', node)
}

const closeNodeDetail = () => {
  showNodeDetail.value = false
  selectedNode.value = null
}

const resetView = () => {
  transform.x = 0
  transform.y = 0
  transform.scale = 1
  initializePositions()
}

onMounted(() => {
  initializePositions()
  startSimulation()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  stopSimulation()
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})

watch([() => props.nodes, () => props.edges], () => {
  initializePositions()
})
</script>

<template>
  <div class="knowledge-graph__container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3 flex-1">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索知识节点..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          @click="resetView"
        >
          🔄 重置视图
        </button>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ filteredNodes.length }} 节点 · {{ filteredEdges.length }} 关系
      </div>
    </div>

    <!-- 图例 -->
    <div class="flex flex-wrap gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="text-xs font-medium text-gray-600 dark:text-gray-400">节点类型:</div>
      <div v-for="(color, type) in nodeTypeColors" :key="type" class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }"></span>
        <span class="text-xs text-gray-700 dark:text-gray-300">{{ { concept: '概念', entity: '实体', event: '事件', document: '文档', person: '人物', location: '位置' }[type] }}</span>
      </div>
    </div>

    <!-- SVG 图谱区域 -->
    <div
      ref="containerRef"
      class="relative w-full h-[500px] overflow-hidden cursor-grab active:cursor-grabbing"
      @wheel="handleWheel"
      @mousedown="handleSvgMouseDown"
    >
      <svg
        ref="svgRef"
        class="w-full h-full"
        :viewBox="`0 0 ${containerRef?.clientWidth || 800} ${containerRef?.clientHeight || 600}`"
      >
        <g :transform="`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`">
          <!-- 边 -->
          <g class="edges">
            <line
              v-for="edge in filteredEdges"
              :key="edge.id"
              :x1="nodePositions.get(edge.source)?.x"
              :y1="nodePositions.get(edge.source)?.y"
              :x2="nodePositions.get(edge.target)?.x"
              :y2="nodePositions.get(edge.target)?.y"
              :stroke="edgeTypeColors[edge.type]"
              stroke-width="2"
              opacity="0.6"
              class="transition-opacity duration-200"
            />
            <!-- 边标签 -->
            <text
              v-for="edge in filteredEdges"
              :key="'label-' + edge.id"
              :x="(nodePositions.get(edge.source)!.x! + nodePositions.get(edge.target)!.x!) / 2"
              :y="(nodePositions.get(edge.source)!.y! + nodePositions.get(edge.target)!.y!) / 2 - 5"
              text-anchor="middle"
              class="text-[10px] fill-gray-500 dark:fill-gray-400 pointer-events-none"
            >
              {{ edge.label }}
            </text>
          </g>

          <!-- 节点 -->
          <g class="nodes">
            <g
              v-for="node in filteredNodes"
              :key="node.id"
              class="cursor-pointer transition-all duration-200"
              :class="{ 'opacity-40': searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase()) }"
              :transform="`translate(${nodePositions.get(node.id)?.x}, ${nodePositions.get(node.id)?.y})`"
              @mousedown="(e: MouseEvent) => handleMouseDown(e, node.id)"
              @click="handleNodeClick(node)"
            >
              <!-- 节点圆圈 -->
              <circle
                r="25"
                :fill="nodeTypeColors[node.type]"
                class="hover:r-30 transition-all duration-200"
                :stroke="selectedNode?.id === node.id ? '#1e40af' : 'white'"
                :stroke-width="selectedNode?.id === node.id ? 3 : 2"
              />
              <!-- 节点图标 -->
              <text
                text-anchor="middle"
                dominant-baseline="central"
                class="fill-white text-sm font-medium pointer-events-none select-none"
              >
                {{ { concept: '💡', entity: '📦', event: '⚡', document: '📄', person: '👤', location: '📍' }[node.type] }}
              </text>
              <!-- 节点标签 -->
              <text
                y="38"
                text-anchor="middle"
                class="fill-gray-700 dark:fill-gray-300 text-xs font-medium pointer-events-none select-none"
              >
                {{ node.label }}
              </text>
            </g>
          </g>
        </g>
      </svg>

      <!-- 缩放提示 -->
      <div class="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
        缩放: {{ (transform.scale * 100).toFixed(0) }}%
      </div>
    </div>

    <!-- 节点详情弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showNodeDetail && selectedNode" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeNodeDetail">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" @click.stop>
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  :style="{ backgroundColor: nodeTypeColors[selectedNode.type] + '20' }"
                >
                  {{ { concept: '💡', entity: '📦', event: '⚡', document: '📄', person: '👤', location: '📍' }[selectedNode.type] }}
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedNode.label }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ { concept: '概念', entity: '实体', event: '事件', document: '文档', person: '人物', location: '位置' }[selectedNode.type] }}
                  </p>
                </div>
              </div>
              <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl" @click="closeNodeDetail">×</button>
            </div>

            <div v-if="selectedNode.description" class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ selectedNode.description }}</p>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">关联关系</h4>
              <div class="space-y-2">
                <div
                  v-for="edge in edges.filter(e => e.source === selectedNode?.id || e.target === selectedNode?.id)"
                  :key="edge.id"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: edgeTypeColors[edge.type] }"></span>
                  <span class="text-gray-600 dark:text-gray-400">{{ edge.label }}</span>
                  <span class="text-gray-900 dark:text-white font-medium">
                    {{ edge.source === selectedNode.id ? nodes.find(n => n.id === edge.target)?.label : nodes.find(n => n.id === edge.source)?.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
