<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FileNode, ContextMenuAction } from '@/types/memory'

/**
 * FileManager 组件 Props 接口
 * @interface Props
 */
interface Props {
  /**
   * 文件节点数组
   * @default []
   */
  files?: FileNode[]
}

const props = withDefaults(defineProps<Props>(), {
  files: () => []
})

/**
 * FileManager 组件事件定义
 */
const emit = defineEmits<{
  /**
   * 文件选中事件
   * @param {FileNode} file - 文件节点对象
   */
  fileSelect: [file: FileNode]
  /**
   * 文件上传事件
   * @param {FileList} files - 文件列表对象
   */
  fileUpload: [files: FileList]
  /**
   * 文件删除事件
   * @param {FileNode} file - 文件节点对象
   */
  fileDelete: [file: FileNode]
  /**
   * 文件重命名事件
   * @param {FileNode} file - 文件节点对象
   * @param {string} newName - 新文件名
   */
  fileRename: [file: FileNode, newName: string]
  /**
   * 文件夹创建事件
   * @param {string} parentPath - 父路径
   * @param {string} name - 文件夹名称
   */
  folderCreate: [parentPath: string, name: string]
}>()

const currentPath = ref<string[]>(['根目录'])
const selectedFile = ref<FileNode | null>(null)
const isDragging = ref(false)
const showContextMenu = ref(false)
const contextMenuPosition = reactive({ x: 0, y: 0 })
const contextMenuTarget = ref<FileNode | null>(null)
const isRenaming = ref(false)
const renameValue = ref('')
const isNewFolder = ref(false)
const newFolderName = ref('')

const currentFiles = computed(() => {
  let nodes = props.files
  for (let i = 1; i < currentPath.value.length; i++) {
    const folder = nodes.find(f => f.name === currentPath.value[i] && f.type === 'folder')
    if (folder?.children) {
      nodes = folder.children
    }
  }
  return nodes
})

const getFileIcon = (file: FileNode): string => {
  if (file.type === 'folder') return '📁'
  const ext = file.name.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📃',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🎨',
    mp4: '🎬',
    avi: '🎬',
    mov: '🎬',
    js: '💻',
    ts: '💻',
    vue: '💚',
    py: '🐍',
    json: '📋',
    md: '📖'
  }
  return iconMap[ext || ''] || '📎'
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const navigateToFolder = (folder: FileNode) => {
  if (folder.type === 'folder') {
    currentPath.value.push(folder.name)
    selectedFile.value = null
  } else {
    selectedFile.value = folder
    emit('fileSelect', folder)
  }
}

const navigateBreadcrumb = (index: number) => {
  currentPath.value = currentPath.value.slice(0, index + 1)
  selectedFile.value = null
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    emit('fileUpload', e.dataTransfer.files)
  }
}

const handleContextMenu = (e: MouseEvent, file: FileNode) => {
  e.preventDefault()
  contextMenuTarget.value = file
  contextMenuPosition.x = e.clientX
  contextMenuPosition.y = e.clientY
  showContextMenu.value = true
}

const closeContextMenu = () => {
  showContextMenu.value = false
  contextMenuTarget.value = null
}

const handleContextAction = (action: ContextMenuAction) => {
  if (!contextMenuTarget.value) return

  switch (action) {
    case 'rename':
      renameValue.value = contextMenuTarget.value.name
      isRenaming.value = true
      break
    case 'delete':
      emit('fileDelete', contextMenuTarget.value)
      break
    case 'download':
      console.log('下载文件:', contextMenuTarget.value.name)
      break
    case 'copy':
      console.log('复制文件:', contextMenuTarget.value.name)
      break
    case 'move':
      console.log('移动文件:', contextMenuTarget.value.name)
      break
    case 'properties':
      console.log('查看属性:', contextMenuTarget.value.name)
      break
  }
  closeContextMenu()
}

const confirmRename = () => {
  if (contextMenuTarget.value && renameValue.value.trim()) {
    emit('fileRename', contextMenuTarget.value, renameValue.value.trim())
  }
  isRenaming.value = false
  renameValue.value = ''
}

const createNewFolder = () => {
  newFolderName.value = ''
  isNewFolder.value = true
}

const confirmNewFolder = () => {
  if (newFolderName.value.trim()) {
    emit('folderCreate', currentPath.value.join('/'), newFolderName.value.trim())
  }
  isNewFolder.value = false
  newFolderName.value = ''
}
</script>

<template>
  <div class="file-manager__container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <!-- 工具栏 -->
    <div class="file-manager__toolbar flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          @click="createNewFolder"
        >
          📁 新建文件夹
        </button>
        <label class="px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors cursor-pointer">
          📤 上传文件
          <input
type="file" multiple class="hidden" @change="(e: Event) => {
            const target = e.target as HTMLInputElement
            if (target.files) emit('fileUpload', target.files)
          }" />
        </label>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        共 {{ currentFiles.length }} 项
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div class="file-manager__breadcrumb flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <template v-for="(item, index) in currentPath" :key="index">
        <button
          class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          @click="navigateBreadcrumb(index)"
        >
          {{ item }}
        </button>
        <span v-if="index < currentPath.length - 1" class="text-gray-400">/</span>
      </template>
    </div>

    <!-- 拖拽区域 -->
    <div
      class="file-manager__dropzone relative min-h-[400px] p-4"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click.self="selectedFile = null"
    >
      <!-- 拖拽提示 -->
      <Transition name="fade">
        <div
          v-if="isDragging"
          class="absolute inset-0 z-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400 rounded-lg m-4"
        >
          <div class="text-center">
            <p class="text-2xl mb-2">📥</p>
            <p class="text-lg font-medium text-blue-600 dark:text-blue-400">释放以上传文件</p>
          </div>
        </div>
      </Transition>

      <!-- 文件列表 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <TransitionGroup name="list">
          <!-- 新建文件夹输入框 -->
          <div v-if="isNewFolder" key="new-folder" class="file-manager__item flex flex-col items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400">
            <div class="text-4xl mb-2">📁</div>
            <input
              v-model="newFolderName"
              autofocus
              class="w-full text-xs text-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文件夹名称"
              @keyup.enter="confirmNewFolder"
              @blur="confirmNewFolder"
            />
          </div>

          <!-- 文件/文件夹项 -->
          <div
            v-for="file in currentFiles"
            :key="file.id"
            class="file-manager__item group relative flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20': selectedFile?.id === file.id }"
            @click="navigateToFolder(file)"
            @contextmenu="handleContextMenu($event, file)"
            @dblclick="navigateToFolder(file)"
          >
            <div class="text-4xl mb-2">{{ getFileIcon(file) }}</div>
            <p class="text-xs text-center text-gray-700 dark:text-gray-300 truncate w-full px-1" :title="file.name">
              {{ file.name }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ file.type === 'folder' ? '' : formatFileSize(file.size || 0) }}
            </p>
          </div>
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <div v-if="currentFiles.length === 0 && !isDragging && !isNewFolder" class="flex flex-col items-center justify-center h-64 text-gray-400">
        <p class="text-5xl mb-4">📂</p>
        <p class="text-lg font-medium">此文件夹为空</p>
        <p class="text-sm mt-2">拖拽文件到此处或点击上方按钮上传</p>
      </div>
    </div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showContextMenu"
          class="fixed z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1"
          :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
          @click.stop
        >
          <button
            v-for="action in ['rename', 'copy', 'move', 'download', 'delete', 'properties'] as ContextMenuAction[]"
            :key="action"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            @click="handleContextAction(action)"
          >
            <span>{{ { rename: '✏️', copy: '📋', move: '📦', download: '⬇️', delete: '🗑️', properties: 'ℹ️' }[action] }}</span>
            {{ { rename: '重命名', copy: '复制', move: '移动', download: '下载', delete: '删除', properties: '属性' }[action] }}
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- 重命名对话框 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isRenaming" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="isRenaming = false">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-96" @click.stop>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">重命名</h3>
            <input
              v-model="renameValue"
              autofocus
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="confirmRename"
            />
            <div class="flex justify-end gap-3 mt-6">
              <button class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" @click="isRenaming = false">
                取消
              </button>
              <button class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors" @click="confirmRename">
                确认
              </button>
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
  transform: translateX(20px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
