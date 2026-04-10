<script setup lang="ts">
import { ref, reactive } from 'vue';

interface ComponentItem {
  id: string;
  type: string;
  name: string;
  icon: string;
  category: string;
}

interface CanvasComponent extends ComponentItem {
  props: Record<string, any>;
}

const componentLibrary: ComponentItem[] = [
  { id: 'header', type: 'header', name: 'Header 导航栏', icon: '📌', category: 'layout' },
  { id: 'hero', type: 'hero', name: 'Hero 英雄区域', icon: '🦸', category: 'layout' },
  { id: 'features', type: 'features', name: 'Features 特性展示', icon: '⭐', category: 'content' },
  { id: 'about', type: 'about', name: 'About 关于我们', icon: 'ℹ️', category: 'content' },
  {
    id: 'testimonials',
    type: 'testimonials',
    name: 'Testimonials 用户评价',
    icon: '💬',
    category: 'content'
  },
  { id: 'pricing', type: 'pricing', name: 'Pricing 价格方案', icon: '💰', category: 'content' },
  { id: 'cta', type: 'cta', name: 'CTA 行动召唤', icon: '📢', category: 'content' },
  { id: 'contact', type: 'contact', name: 'Contact 联系表单', icon: '✉️', category: 'form' },
  { id: 'footer', type: 'footer', name: 'Footer 页脚', icon: '🔻', category: 'layout' }
];

const canvasComponents = ref<CanvasComponent[]>([]);
const selectedComponent = ref<CanvasComponent | null>(null);
const draggedComponent = ref<ComponentItem | null>(null);
const isDraggingOverCanvas = ref(false);

const componentProps = reactive<Record<string, any>>({
  title: '',
  subtitle: '',
  description: '',
  buttonText: '',
  buttonColor: '#3B82F6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937'
});

const categories = [
  { id: 'all', label: '全部' },
  { id: 'layout', label: '布局' },
  { id: 'content', label: '内容' },
  { id: 'form', label: '表单' }
];

const activeCategory = ref('all');

const filteredComponents = () => {
  if (activeCategory.value === 'all') {
    return componentLibrary;
  }
  return componentLibrary.filter((c) => c.category === activeCategory.value);
};

const handleDragStart = (component: ComponentItem, event: DragEvent) => {
  draggedComponent.value = component;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', JSON.stringify(component));
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
  isDraggingOverCanvas.value = true;
};

const handleDragLeave = () => {
  isDraggingOverCanvas.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDraggingOverCanvas.value = false;

  const data = event.dataTransfer?.getData('text/plain');
  if (data) {
    try {
      const component = JSON.parse(data) as ComponentItem;
      const newComponent: CanvasComponent = {
        ...component,
        id: `${component.id}-${Date.now()}`,
        props: getDefaultProps(component.type)
      };
      canvasComponents.value.push(newComponent);
    } catch (e) {
      console.error('Failed to parse dropped data:', e);
    }
  }

  draggedComponent.value = null;
};

const getDefaultProps = (type: string): Record<string, any> => {
  switch (type) {
    case 'header':
      return { title: '网站名称', links: ['首页', '关于', '服务', '联系'] };
    case 'hero':
      return {
        title: '欢迎来到我们的网站',
        subtitle: '专业的解决方案，助力您的业务增长',
        buttonText: '立即开始',
        buttonColor: '#3B82F6'
      };
    case 'features':
      return { title: '我们的优势', features: ['快速响应', '安全可靠', '专业团队'] };
    case 'about':
      return { title: '关于我们', description: '我们是一支专业的团队...' };
    case 'testimonials':
      return { title: '客户评价', testimonials: [] };
    case 'pricing':
      return { title: '价格方案', plans: [] };
    case 'cta':
      return { title: '准备好开始了吗？', subtitle: '立即联系我们', buttonText: '联系我们' };
    case 'contact':
      return { title: '联系我们', fields: ['姓名', '邮箱', '消息'] };
    case 'footer':
      return { copyright: '© 2026 您的公司. All rights reserved.' };
    default:
      return {};
  }
};

const selectComponent = (component: CanvasComponent) => {
  selectedComponent.value = component;
  Object.assign(componentProps, component.props);
};

const removeComponent = (index: number) => {
  canvasComponents.value.splice(index, 1);
  if (
    selectedComponent.value &&
    canvasComponents.value.findIndex((c) => c.id === selectedComponent.value!.id) === -1
  ) {
    selectedComponent.value = null;
  }
};

const moveComponentUp = (index: number) => {
  if (index > 0) {
    const temp = canvasComponents.value[index]!;
    canvasComponents.value[index] = canvasComponents.value[index - 1]!;
    canvasComponents.value[index - 1] = temp;
  }
};

const moveComponentDown = (index: number) => {
  if (index < canvasComponents.value.length - 1) {
    const temp = canvasComponents.value[index]!;
    canvasComponents.value[index] = canvasComponents.value[index + 1]!;
    canvasComponents.value[index + 1] = temp;
  }
};

const updateProps = () => {
  if (selectedComponent.value) {
    selectedComponent.value.props = { ...componentProps };
  }
};
</script>

<template>
  <div
    class="flex h-[calc(100vh-120px)] gap-4 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden"
  >
    <!-- 左侧组件面板 -->
    <div
      class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">组件库</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">拖拽组件到画布</p>
      </div>

      <div class="p-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-1">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="[
              'px-2 py-1 text-xs rounded transition-colors',
              activeCategory === cat.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            @click="activeCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div
          v-for="component in filteredComponents()"
          :key="component.id"
          draggable="true"
          class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-grab hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 active:cursor-grabbing"
          @dragstart="handleDragStart(component, $event)"
        >
          <div class="flex items-center space-x-2">
            <span class="text-xl">{{ component.icon }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{
              component.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间画布区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div
        class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <h3 class="font-semibold text-gray-900 dark:text-white">画布预览</h3>
        <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ canvasComponents.length }} 个组件</span>
        </div>
      </div>

      <div
        :class="[
          'flex-1 p-6 overflow-y-auto transition-colors duration-200',
          isDraggingOverCanvas ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50 dark:bg-gray-900/50'
        ]"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <div
          v-if="canvasComponents.length === 0"
          :class="[
            'h-full flex items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-200',
            isDraggingOverCanvas
              ? 'border-blue-400 bg-blue-100/50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <div class="text-center">
            <div class="text-5xl mb-4">🎨</div>
            <p class="text-lg font-medium text-gray-500 dark:text-gray-400">拖拽组件到此处</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">从左侧组件库选择并拖入</p>
          </div>
        </div>

        <div v-else class="space-y-4 max-w-4xl mx-auto">
          <div
            v-for="(component, index) in canvasComponents"
            :key="component.id"
            :class="[
              'relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all duration-200',
              selectedComponent?.id === component.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            ]"
            @click="selectComponent(component)"
          >
            <!-- 组件操作按钮 -->
            <div
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1"
            >
              <button
                :disabled="index === 0"
                class="p-1.5 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 text-xs"
                title="上移"
                @click.stop="moveComponentUp(index)"
              >
                ↑
              </button>
              <button
                :disabled="index === canvasComponents.length - 1"
                class="p-1.5 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 text-xs"
                title="下移"
                @click.stop="moveComponentDown(index)"
              >
                ↓
              </button>
              <button
                class="p-1.5 bg-red-500 text-white rounded shadow-sm hover:bg-red-600 text-xs"
                title="删除"
                @click.stop="removeComponent(index)"
              >
                ✕
              </button>
            </div>

            <!-- 组件预览 -->
            <div class="flex items-center space-x-3 mb-3 pr-24">
              <span class="text-2xl">{{ component.icon }}</span>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ component.name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ component.type }}</p>
              </div>
            </div>

            <!-- 简化的组件内容预览 -->
            <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm">
              <div
                v-if="component.props.title"
                class="font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                {{ component.props.title }}
              </div>
              <div v-if="component.props.subtitle" class="text-gray-600 dark:text-gray-400 text-xs">
                {{ component.props.subtitle }}
              </div>
              <div
                v-if="component.props.description"
                class="text-gray-600 dark:text-gray-400 text-xs mt-1"
              >
                {{ component.props.description.substring(0, 80) }}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧属性面板 -->
    <div
      class="w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">属性设置</h3>
      </div>

      <div
        v-if="!selectedComponent"
        class="flex-1 flex items-center justify-center p-6 text-center"
      >
        <div>
          <div class="text-4xl mb-3">⚙️</div>
          <p class="text-sm text-gray-500 dark:text-gray-400">选择一个组件以编辑属性</p>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-4 space-y-4">
        <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-2 mb-3">
            <span class="text-xl">{{ selectedComponent.icon }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{
              selectedComponent.name
            }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ selectedComponent.id }}</p>
        </div>

        <div v-if="componentProps.title !== undefined">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >标题</label
          >
          <input
            v-model="componentProps.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="updateProps()"
          />
        </div>

        <div v-if="componentProps.subtitle !== undefined">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >副标题</label
          >
          <input
            v-model="componentProps.subtitle"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="updateProps()"
          />
        </div>

        <div v-if="componentProps.description !== undefined">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >描述</label
          >
          <textarea
            v-model="componentProps.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="updateProps()"
          ></textarea>
        </div>

        <div v-if="componentProps.buttonText !== undefined">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >按钮文字</label
          >
          <input
            v-model="componentProps.buttonText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="updateProps()"
          />
        </div>

        <div v-if="componentProps.buttonColor !== undefined">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >按钮颜色</label
          >
          <div class="flex items-center space-x-2">
            <input
              v-model="componentProps.buttonColor"
              type="color"
              class="w-10 h-10 rounded border border-gray-300 dark:border-gray-600"
              @input="updateProps()"
            />
            <input
              v-model="componentProps.buttonColor"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              @input="updateProps()"
            />
          </div>
        </div>

        <div v-if="componentProps.copyright !== undefined">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >版权信息</label
          >
          <input
            v-model="componentProps.copyright"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="updateProps()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
