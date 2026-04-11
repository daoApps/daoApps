# DeepResearch 集成文档

## 概述

DeepResearch 是一个深度研究智能体，能够基于用户查询进行自动化的文献检索、分析和综合研究。通过深度研究集成，Flexloop 应用可以为用户提供：

- 自动化文献搜索与筛选
- 智能内容提取与分析
- 结构化研究报告生成
- 多轮对话式研究交互

本集成采用 Python 后端 API + TypeScript 前端客户端的架构，实现了深度研究能力的无缝接入。

## 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                    Flexloop 前端应用                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Vue 组件                                                ││
│  │  useDeepResearch Composable                              ││
│  │  DeepResearchClient TypeScript 客户端                    ││
│  └─────────────────────────────────────────────────────────┘│
│                              │  HTTP REST API                │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                 DeepResearch Python API 服务              ││
│  │  - FastAPI 应用                                           ││
│  │  - 文献检索逻辑                                           ││
│  │  - 智能体推理                                             ││
│  │  - 结果生成                                               ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**组件说明：**

- **Python API 服务**：运行深度研究算法，处理研究请求，依赖 LLM 和搜索服务
- **TypeScript 客户端**：封装 HTTP 请求，提供流式响应处理
- **Vue Composable**：提供响应式状态，方便在组件中使用

## 服务端部署

### 前置要求

- Python 3.9+
- Poetry 或 pip 依赖管理
- 有效的 LLM API Key（OpenAI 或 Anthropic）
- 搜索 API Key（如 Serper）

### 安装依赖

```bash
cd deep-research
pip install -r requirements.txt
# 或使用 poetry
poetry install
```

### 环境变量配置

创建 `.env` 文件：

```env
# LLM 配置
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# 搜索配置
SERPER_API_KEY=your-serper-api-key

# 服务配置
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173
```

### 启动服务

开发模式：

```bash
python main.py
# 或使用 uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

生产模式：

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 使用 Docker 启动

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建并运行：

```bash
docker build -t deepresearch-api .
docker run -p 8000:8000 --env-file .env deepresearch-api
```

## 环境变量说明

### 服务端环境变量

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `OPENAI_API_KEY` | 是* | OpenAI API Key | `sk-...` |
| `ANTHROPIC_API_KEY` | 是* | Anthropic API Key | `sk-ant-...` |
| `SERPER_API_KEY` | 是 | Serper 搜索 API Key | `...` |
| `HOST` | 否 | 服务监听地址 | `0.0.0.0` |
| `PORT` | 否 | 服务端口 | `8000` |
| `CORS_ORIGINS` | 否 | CORS 允许的源 | `http://localhost:5173` |

\*至少配置一个 LLM API Key

### 客户端环境变量

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `VITE_DEEP_RESEARCH_API_URL` | 是 | DeepResearch API 地址 | `http://localhost:8000` |

## API 接口文档

### 1. 健康检查

```
GET /health
```

**响应：**
```json
{
  "status": "ok",
  "service": "deepresearch-api"
}
```

### 2. 开始深度研究

```
POST /research
```

**请求体：**
```json
{
  "query": "人工智能对就业的影响",
  "max_depth": 3,
  "breadth": 3
}
```

**参数说明：**
- `query`: 研究问题（必需）
- `max_depth`: 最大研究深度，默认 3
- `breadth`: 每轮探索广度，默认 3

**响应（流式 SSE）：**

事件类型：

1. `search_start` - 开始搜索
```json
{
  "type": "search_start",
  "message": "开始搜索: 人工智能对就业的影响"
}
```

2. `search_result` - 搜索结果
```json
{
  "type": "search_result",
  "data": {
    "title": "文章标题",
    "url": "https://...",
    "snippet": "内容摘要..."
  }
}
```

3. `analysis_progress` - 分析进度
```json
{
  "type": "analysis_progress",
  "message": "正在分析...",
  "progress": 0.5
}
```

4. `research_complete` - 研究完成
```json
{
  "type": "research_complete",
  "data": {
    "report": "# 研究报告\\n\\n## 概述...",
    "sources": [
      {
        "title": "标题",
        "url": "https://..."
      }
    ],
    "metadata": {
      "query": "人工智能对就业的影响",
      "duration_seconds": 45.2,
      "sources_count": 12
    }
  }
}
```

5. `error` - 错误
```json
{
  "type": "error",
  "message": "错误信息"
}
```

### 3. 获取研究状态

```
GET /research/{job_id}
```

**响应：**
```json
{
  "job_id": "uuid",
  "status": "running" | "completed" | "failed",
  "progress": 0.75,
  "result": null | { ... },
  "error": null | string
}
```

### 4. 取消研究

```
DELETE /research/{job_id}
```

**响应：**
```json
{
  "success": true,
  "message": "研究已取消"
}
```

## 前端集成使用

### 安装

确保客户端代码位于 `frontend/src/lib/deepresearch/` 目录：

```
- DeepResearchClient.ts     - HTTP 客户端
- useDeepResearch.ts       - Vue composable
- types.ts                 - TypeScript 类型定义
```

### 配置环境变量

在 `.env.local` 中添加：

```env
VITE_DEEP_RESEARCH_API_URL=http://localhost:8000
```

### 在组件中使用

```vue
<script setup lang="ts">
import { useDeepResearch } from '~/lib/deepresearch/useDeepResearch'

const {
  isRunning,
  progress,
  report,
  sources,
  error,
  startResearch,
  cancelResearch,
  resetResearch
} = useDeepResearch()

const handleResearch = async () => {
  await startResearch('人工智能对就业的影响', {
    maxDepth: 3,
    breadth: 3,
    onProgress: (event) => {
      console.log(event)
    },
    onComplete: (result) => {
      console.log('研究完成', result.report)
    },
    onError: (error) => {
      console.error('研究失败', error)
    }
  })
}
</script>

<template>
  <div>
    <button @click="handleResearch" :disabled="isRunning">
      开始研究
    </button>
    <button @click="cancelResearch" v-if="isRunning">
      取消
    </button>
    <div v-if="progress > 0 && progress < 1">
      进度: {{ Math.round(progress * 100) }}%
    </div>
    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div v-if="report" class="prose">
      <div v-html="marked(report)"></div>
    </div>
    <div v-if="sources.length > 0">
      <h3>参考来源</h3>
      <ul>
        <li v-for="(source, idx) in sources" :key="idx">
          <a :href="source.url" target="_blank">{{ source.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
```

### API 参考

#### `useDeepResearch()` 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `isRunning` | `Ref<boolean>` | 是否正在研究 |
| `progress` | `Ref<number>` | 进度 0-1 |
| `report` | `Ref<string>` | 生成的报告（Markdown） |
| `sources` | `Ref<Source[]>` | 参考来源列表 |
| `error` | `Ref<string | null>` | 错误信息 |
| `events` | `Ref<ResearchEvent[]>` | 所有事件列表 |
| `startResearch(query, options?)` | `Promise<void>` | 开始研究 |
| `cancelResearch()` | `void` | 取消研究 |
| `resetResearch()` | `void` | 重置状态 |

#### `DeepResearchClient` 方法

```typescript
const client = new DeepResearchClient(apiUrl)

// 流式研究
client.research(query, options, callbacks): Promise<void>

// 轮询方式
const job = await client.startResearch(query, options)
const status = await client.getStatus(job.jobId)

// 取消
await client.cancelResearch(jobId)

// 健康检查
const health = await client.healthCheck()
```

## 使用示例

### 完整的研究组件示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDeepResearch } from '~/lib/deepresearch/useDeepResearch'

const query = ref('')
const {
  isRunning,
  progress,
  report,
  sources,
  error,
  startResearch,
  cancelResearch,
  resetResearch
} = useDeepResearch()

const handleSubmit = async () => {
  if (!query.value.trim()) return

  resetResearch()

  try {
    await startResearch(query.value, {
      maxDepth: 3,
      breadth: 3,
      onComplete: (result) => {
        console.log('研究完成', result.report)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

const handleReset = () => {
  query.value = ''
  resetResearch()
}
</script>

<template>
  <div class="deep-research-component">
    <div class="query-input">
      <input
        v-model="query"
        placeholder="输入您想要研究的问题..."
        @keyup.enter="handleSubmit"
        :disabled="isRunning"
      />
      <button @click="handleSubmit" :disabled="isRunning || !query">
        {{ isRunning ? '研究中...' : '开始研究' }}
      </button>
    </div>

    <div v-if="isRunning" class="controls">
      <button @click="cancelResearch" class="cancel-btn">
        取消研究
      </button>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress * 100}%` }"></div>
      </div>
      <p class="progress-text">{{ Math.round(progress * 100) }}%</p>
    </div>

    <div v-if="error" class="error">
      ❌ {{ error }}
    </div>

    <div v-if="report" class="result">
      <div class="report-content">
        <h2>研究报告</h2>
        <div v-html="report" class="markdown-body"></div>
      </div>

      <div v-if="sources.length > 0" class="sources">
        <h3>参考来源</h3>
        <ul>
          <li v-for="(source, idx) in sources" :key="idx">
            <a :href="source.url" target="_blank" rel="noopener noreferrer">
              {{ source.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deep-research-component {
  max-width: 900px;
  margin: 0 auto;
}

.query-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.query-input input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.controls {
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  transition: width 0.3s ease;
}

.error {
  padding: 1rem;
  background: #fee2e2;
  border-radius: 4px;
  color: #dc2626;
  margin: 1rem 0;
}

.result {
  margin-top: 2rem;
}

.report-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sources {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.sources ul {
  list-style: none;
  padding: 0;
}

.sources li {
  padding: 0.5rem 0;
}

.sources a {
  color: #2563eb;
  text-decoration: underline;
}
</style>
```

## 故障排查

### 服务端问题

**Q: 启动时报 `No API key configured` 错误**

A: 检查 `.env` 文件，确保至少配置了 `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY`。

---

**Q: 搜索返回空结果**

A: 检查 `SERPER_API_KEY` 是否正确配置，API 额度是否充足。

---

**Q: CORS 错误**

A: 确保服务端 `CORS_ORIGINS` 环境变量包含前端地址，例如 `http://localhost:5173`。

---

**Q: 研究过程中 OOM（内存不足）**

A: 降低 `max_depth` 和 `breadth` 参数，或者增加服务端可用内存。

---

### 客户端问题

**Q: 网络错误 `Failed to fetch`**

A:
1. 检查 API 地址 `VITE_DEEP_RESEARCH_API_URL` 是否正确
2. 确认服务端已启动
3. 检查端口是否可访问
4. 检查防火墙设置

---

**Q: 流式响应不工作**

A: 确保浏览器支持 ReadableStream，并且服务端正确设置了 `Transfer-Encoding: chunked` 头。

---

**Q: 响应中断**

A: 检查：
1. 前端代理超时设置，确保大于最大研究时间（通常 5-10 分钟）
2. 服务端是否崩溃
3. 查看服务端日志

---

### 常见错误码

| 错误码 | 说明 | 解决方法 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查 query 是否为空 |
| 404 | 端点不存在 | 检查 API 路径是否正确 |
| 500 | 服务端错误 | 查看服务端日志 |
| 503 | 服务不可用 | 检查 LLM API 配额 |

---

### 调试

启用调试日志：

服务端：
```bash
LOG_LEVEL=debug python main.py
```

客户端浏览器控制台：
```typescript
// 启用调试
localStorage.setItem('DEBUG_DEEPRESEARCH', 'true')
```
