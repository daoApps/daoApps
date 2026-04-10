<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const props = defineProps<{
  siteName?: string;
  templateId?: string;
}>();

const device = ref<DeviceType>('desktop');
const zoom = ref(100);
const isRefreshing = ref(false);
const customContent = ref<string | null>(null);

const deviceWidths: Record<DeviceType, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px'
};

const deviceHeights: Record<DeviceType, string> = {
  desktop: '700px',
  tablet: '1024px',
  mobile: '667px'
};

const currentUrl = computed(() => {
  return props.siteName
    ? `${props.siteName.toLowerCase().replace(/\s+/g, '-')}.com`
    : 'my-website.com';
});

const handleRefresh = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 1500);
};

const handleZoomIn = () => {
  if (zoom.value < 150) zoom.value += 10;
};

const handleZoomOut = () => {
  if (zoom.value > 50) zoom.value -= 10;
};

const generateMockSiteContent = (): string => {
  if (customContent.value) {
    return customContent.value;
  }

  if (!props.templateId) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 2.5em; margin-bottom: 20px;">🏗️ 网站预览</h1>
          <p style="font-size: 1.2em; opacity: 0.9; margin-bottom: 30px;">
            ${props.siteName || '您的网站'} 正在构建中...
          </p>
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 16px; padding: 30px; margin-top: 30px;">
            <p style="margin: 0; opacity: 0.8;">
              完成建站向导后，这里将显示您的网站预览
            </p>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${props.siteName || '我的网站'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
          }
          .header h1 { font-size: 2.5em; margin-bottom: 10px; }
          .header p { font-size: 1.1em; opacity: 0.9; }
          .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
          .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin: 40px 0; }
          .feature-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
          }
          .feature-card:hover { transform: translateY(-5px); }
          .feature-icon { font-size: 3em; margin-bottom: 15px; }
          .feature-card h3 { color: #667eea; margin-bottom: 10px; }
          .footer {
            background: #2d3748;
            color: white;
            text-align: center;
            padding: 40px 20px;
            margin-top: 60px;
          }
          @media (max-width: 768px) {
            .header h1 { font-size: 1.8em; }
            .features { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <header class="header">
          <h1>✨ ${props.siteName || '我的网站'}</h1>
          <p>使用 Sphinx AI 智能构建的专业网站</p>
        </header>

        <main class="container">
          <section class="features">
            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <h3>快速部署</h3>
              <p>一键发布到云端，全球 CDN 加速访问</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>响应式设计</h3>
              <p>完美适配桌面、平板、手机等各种设备</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>高性能优化</h3>
              <p>代码优化、图片压缩、懒加载等全方位性能提升</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>安全可靠</h3>
              <p>SSL 加密、DDoS 防护、自动备份保障数据安全</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>数据分析</h3>
              <p>实时访客统计、用户行为分析、转化率追踪</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>自由定制</h3>
              <p>丰富的主题模板、灵活的布局编辑器、自定义样式</p>
            </div>
          </section>
        </main>

        <footer class="footer">
          <p>&copy; 2026 ${props.siteName || '我的网站'}. Powered by Sphinx AI</p>
        </footer>
      </body>
    </html>
  `;
};

onMounted(() => {
  window.addEventListener('apply-code', ((e: CustomEvent) => {
    customContent.value = e.detail;
  }) as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('apply-code', ((e: CustomEvent) => {
    customContent.value = e.detail;
  }) as EventListener);
});
</script>

<template>
  <div class="space-y-4">
    <!-- 工具栏 -->
    <div
      class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
    >
      <!-- 设备切换 -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">设备视图:</span>
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            v-for="(label, key) in { desktop: '🖥️ 桌面', tablet: '📱 平板', mobile: '📲 手机' }"
            :key="key"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
              device === key
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            ]"
            @click="device = key as DeviceType"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- 缩放和刷新控制 -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <button
            :disabled="zoom <= 50"
            class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            @click="handleZoomOut"
          >
            <svg
              class="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[50px] text-center"
            >{{ zoom }}%</span
          >
          <button
            :disabled="zoom >= 150"
            class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            @click="handleZoomIn"
          >
            <svg
              class="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <button
          :disabled="isRefreshing"
          class="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
          @click="handleRefresh"
        >
          <svg
            :class="['w-4 h-4', isRefreshing && 'animate-spin']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="text-sm">{{ isRefreshing ? '刷新中...' : '刷新' }}</span>
        </button>
      </div>
    </div>

    <!-- iframe 预览区域 -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- 浏览器地址栏 -->
      <div class="bg-gray-800 dark:bg-gray-900 px-4 py-2 flex items-center space-x-2">
        <div class="flex space-x-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div class="flex-1 flex justify-center">
          <div
            class="bg-gray-700 dark:bg-gray-800 rounded px-4 py-1 text-xs text-gray-300 max-w-md w-full text-center truncate"
          >
            {{ currentUrl }}{{ templateId ? ` (模板: ${templateId})` : '' }}
          </div>
        </div>
      </div>

      <!-- iframe 容器 -->
      <div
        class="bg-gray-100 dark:bg-gray-900 p-6 flex justify-center overflow-auto"
        style="min-height: 500px"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300"
          :style="{
            width: deviceWidths[device],
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            height: deviceHeights[device]
          }"
        >
          <div
            v-if="isRefreshing"
            class="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
          >
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
              ></div>
              <p class="text-gray-600 dark:text-gray-400">正在刷新预览...</p>
            </div>
          </div>
          <iframe
            v-else
            :srcdoc="generateMockSiteContent()"
            title="Website Preview"
            class="w-full h-full border-0"
            sandbox="allow-same-origin"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
