<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { presetQuestions, aiResponses, sampleChatHistory } from '@/data/mockSphinx'
import type { ChatMessage } from '@/data/mockSphinx'

const props = defineProps<{
  onSiteConfigGenerated?: (config: Partial<{ templateType: string; description: string }>) => void
}>()

const messages = ref<ChatMessage[]>([...sampleChatHistory])
const inputValue = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLDivElement | null>(null)
const showCodePanel = ref(false)
const generatedCode = ref('')
const currentCodeLanguage = ref('html')

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const renderMarkdown = (content: string): string => {
  const rawHtml = marked(content) as string
  return DOMPurify.sanitize(rawHtml)
}

const getAIResponse = (userInput: string): { text: string; code?: string } => {
  const input = userInput.toLowerCase()

  if (input.includes('电商') || input.includes('购物') || input.includes('商城')) {
    return {
      text: aiResponses['电商'] || '好的，我来帮您创建电商网站...',
      code: generateEcommerceCode()
    }
  }
  if (input.includes('博客') || input.includes('写作') || input.includes('文章')) {
    return {
      text: aiResponses['博客'] || '好的，我来帮您创建个人博客...',
      code: generateBlogCode()
    }
  }
  if (input.includes('企业') || input.includes('公司') || input.includes('官网')) {
    return {
      text: aiResponses['企业'] || '好的，我来帮您创建企业官网...',
      code: generateCorporateCode()
    }
  }
  if (input.includes('作品集') || input.includes('作品') || input.includes('展示')) {
    return {
      text: aiResponses['作品集'] || '好的，我来帮您创建作品集网站...',
      code: generatePortfolioCode()
    }
  }

  return {
    text: aiResponses['default'] || '根据您的需求，我为您推荐建站方案...'
  }
}

const generateEcommerceCode = (): string => {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>现代电商商城</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; }
    .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .product-card { border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s; }
    .product-card:hover { transform: translateY(-5px); }
    .product-img { height: 200px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; }
    .product-info { padding: 1.5rem; }
    .price { font-size: 1.5rem; font-weight: bold; color: #667eea; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <header class="header">
    <h1>🛍️ 现代电商商城</h1>
  </header>
  <main class="products">
    <div class="product-card">
      <div class="product-img">👕</div>
      <div class="product-info">
        <h3>时尚T恤</h3>
        <p>舒适透气，多色可选</p>
        <div class="price">¥99</div>
      </div>
    </div>
    <div class="product-card">
      <div class="product-img">👟</div>
      <div class="product-info">
        <h3>运动鞋</h3>
        <p>轻便防滑，适合跑步</p>
        <div class="price">¥299</div>
      </div>
    </div>
  </main>
</body>
</html>`
}

const generateBlogCode = (): string => {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个人博客</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; line-height: 1.8; background: #fafafa; }
    .header { background: #2d3748; color: white; padding: 3rem 2rem; text-align: center; }
    .container { max-width: 800px; margin: 2rem auto; padding: 0 2rem; }
    .article { background: white; padding: 2rem; margin-bottom: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .article h2 { color: #2d3748; margin-bottom: 1rem; }
    .meta { color: #718096; font-size: 0.9rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <header class="header">
    <h1>📝 我的博客</h1>
    <p>记录生活，分享思考</p>
  </header>
  <main class="container">
    <article class="article">
      <h2>第一篇博客文章</h2>
      <div class="meta">2026年4月10日 · 阅读 5 分钟</div>
      <p>这是我的第一篇博客文章内容...</p>
    </article>
  </main>
</body>
</html>`
}

const generateCorporateCode = (): string => {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>企业形象官网</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .hero { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 6rem 2rem; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .feature { text-align: center; padding: 2rem; }
    .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <section class="hero">
    <h1>🏢 企业名称</h1>
    <p style="font-size: 1.2rem; opacity: 0.9;">专业、创新、值得信赖</p>
  </section>
  <section class="section">
    <h2 style="text-align: center;">我们的优势</h2>
    <div class="features">
      <div class="feature">
        <div class="feature-icon">💡</div>
        <h3>技术创新</h3>
        <p>持续投入研发</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🤝</div>
        <h3>客户至上</h3>
        <p>贴心服务体验</p>
      </div>
    </div>
  </section>
</body>
</html>`
}

const generatePortfolioCode = (): string => {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>创意作品集</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0f0f0f; color: white; }
    .header { text-align: center; padding: 4rem 2rem; }
    .header h1 { font-size: 3rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .work-item { aspect-ratio: 16/10; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 4rem; transition: transform 0.3s; cursor: pointer; }
    .work-item:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <header class="header">
    <h1>🎨 我的作品集</h1>
    <p style="margin-top: 1rem; opacity: 0.7;">设计师 / 创意工作者</p>
  </header>
  <main class="gallery">
    <div class="work-item">🎯</div>
    <div class="work-item">🎪</div>
    <div class="work-item">🎭</div>
    <div class="work-item">🎨</div>
  </main>
</body>
</html>`
}

const handleSend = (text?: string) => {
  const messageText = text || inputValue.value.trim()
  if (!messageText) return

  const userMessage: ChatMessage = {
    id: Date.now(),
    type: 'user',
    content: messageText,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  inputValue.value = ''
  isTyping.value = true

  setTimeout(() => {
    const response = getAIResponse(messageText)
    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: response.text,
      timestamp: new Date()
    }

    messages.value.push(aiMessage)
    isTyping.value = false

    if (response.code) {
      generatedCode.value = response.code
      currentCodeLanguage.value = 'html'
    }

    if (props.onSiteConfigGenerated) {
      props.onSiteConfigGenerated({
        templateType: messageText,
        description: messageText
      })
    }
  }, 1500)
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const copyCode = () => {
  navigator.clipboard.writeText(generatedCode.value)
  alert('代码已复制到剪贴板！')
}

const applyToPreview = () => {
  window.dispatchEvent(new CustomEvent('apply-code', { detail: generatedCode.value }))
}
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- 头部 -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          AI
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Sphinx AI 建站助手</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">告诉我您的需求，我来帮您规划网站</p>
        </div>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4" style="max-height: calc(100vh - 350px); min-height: 400px;">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['flex', message.type === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'flex items-start space-x-2 max-w-[80%]',
            message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          ]"
        >
          <div
            v-if="message.type === 'ai'"
            class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          >
            AI
          </div>
          <div
            :class="[
              'px-4 py-3 rounded-2xl',
              message.type === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            ]"
          >
            <div v-if="message.type === 'ai'" class="prose prose-sm dark:prose-invert max-w-none" v-html="renderMarkdown(message.content)"></div>
            <p v-else class="text-sm whitespace-pre-line">{{ message.content }}</p>
            <p
              :class="[
                'text-xs mt-1',
                message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
              ]"
            >
              {{ message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
          <div
            v-if="message.type === 'user'"
            class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold flex-shrink-0"
          >
            我
          </div>
        </div>
      </div>

      <!-- 打字中动画 -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 代码生成面板 -->
    <div v-if="showCodePanel && generatedCode" class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-medium text-gray-900 dark:text-white flex items-center">
          <span class="mr-2">💻</span>
          生成的代码
          <span class="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">{{ currentCodeLanguage.toUpperCase() }}</span>
        </h4>
        <button @click="showCodePanel = false" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
      </div>
      <pre class="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-48"><code>{{ generatedCode }}</code></pre>
      <div class="mt-3 flex space-x-2">
        <button @click="copyCode" class="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
          📋 复制代码
        </button>
        <button @click="applyToPreview" class="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
          ✨ 应用到预览
        </button>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
      <div class="mb-3">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">快捷提问：</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="question in presetQuestions"
            :key="question"
            @click="handleSend(question)"
            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
          >
            {{ question }}
          </button>
          <button
            @click="showCodePanel = !showCodePanel"
            :class="[
              'px-3 py-1.5 text-xs rounded-full transition-all duration-200',
              showCodePanel
                ? 'bg-blue-500 text-white border border-blue-500'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            ]"
          >
            💻 {{ showCodePanel ? '隐藏代码' : '查看代码' }}
          </button>
        </div>
      </div>

      <div class="flex space-x-2">
        <textarea
          v-model="inputValue"
          @keydown="handleKeyPress"
          placeholder="描述您想创建的网站..."
          rows="2"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        ></textarea>
        <button
          @click="handleSend()"
          :disabled="!inputValue.trim() || isTyping"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed self-end"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.6;
}
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  margin-top: 0.75em;
  margin-bottom: 0.5em;
  font-weight: 600;
}
.prose :deep(p) {
  margin-bottom: 0.5em;
}
.prose :deep(ul),
.prose :deep(ol) {
  margin-left: 1.25em;
  margin-bottom: 0.5em;
}
.prose :deep(li) {
  margin-bottom: 0.25em;
}
.prose :deep(strong) {
  font-weight: 600;
  color: inherit;
}
.prose :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.125em 0.375em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>
