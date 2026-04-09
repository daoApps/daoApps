import type { AgentInfo, Conversation, QuickCommand } from '../types/chatTypes'

export const availableAgents: AgentInfo[] = [
  {
    id: 'agent-1',
    name: 'AgentPit 助手',
    avatar: '🤖',
    description: '通用智能助手，擅长多领域问答',
  },
  {
    id: 'agent-2',
    name: '代码专家',
    avatar: '💻',
    description: '专注于编程和代码相关问题',
  },
  {
    id: 'agent-3',
    name: '创意写手',
    avatar: '✍️',
    description: '擅长文案创作和内容生成',
  },
]

export const quickCommands: QuickCommand[] = [
  { id: 'qc-1', label: '你好，介绍一下自己', prompt: '你好，请介绍一下你自己', category: 'general', icon: '👋' },
  { id: 'qc-2', label: '今天天气怎么样？', prompt: '帮我查询一下今天的天气情况', category: 'general', icon: '🌤️' },
  { id: 'qc-3', label: '写一首诗', prompt: '请为我创作一首关于春天的诗', category: 'creative', icon: '📝' },
  { id: 'qc-4', label: '生成故事大纲', prompt: '帮我构思一个科幻小说的故事大纲', category: 'creative', icon: '📖' },
  { id: 'qc-5', label: '分析数据趋势', prompt: '如何分析一组时间序列数据的趋势变化？', category: 'analysis', icon: '📊' },
  { id: 'qc-6', label: '对比两个方案', prompt: '请帮我分析并对比两种技术方案的优缺点', category: 'analysis', icon: '⚖️' },
  { id: 'qc-7', label: '解释这段代码', prompt: '请详细解释以下代码的功能和实现原理：\n```javascript\nconst arr = [1, 2, 3].map(x => x * 2)\n```', category: 'coding', icon: '🔍' },
  { id: 'qc-8', label: '优化性能问题', prompt: '我的 React 应用渲染很慢，有什么常见的性能优化方案？', category: 'coding', icon: '⚡' },
]

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: '关于 React 的讨论',
    agentId: 'agent-1',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'React 和 Vue 有什么区别？',
        timestamp: Date.now() - 86400000,
        status: 'read',
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content:
          'React 和 Vue 都是流行的前端框架，它们的主要区别包括：\n\n**设计理念**\n- React 采用函数式编程思想，强调不可变数据\n- Vue 采用渐进式框架理念，更注重开发体验\n\n**模板语法**\n- React 使用 JSX（JavaScript + XML）\n- Vue 使用基于 HTML 的模板语法\n\n**状态管理**\n- React 通常配合 Redux、Zustand 等库\n- Vue 内置 Vuex/Pinia 状态管理\n\n两者各有优势，选择取决于项目需求和团队偏好。',
        timestamp: Date.now() - 86300000,
        status: 'read',
      },
    ],
  },
  {
    id: 'conv-2',
    title: '创意写作请求',
    agentId: 'agent-3',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 86400000,
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: '帮我写一段产品介绍文案',
        timestamp: Date.now() - 172800000,
        status: 'read',
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content:
          '好的！以下是一段通用的产品介绍文案：\n\n---\n\n**[产品名称]** — 重新定义您的数字体验\n\n在快节奏的数字化时代，我们为您打造了一款革命性的产品。它不仅是一个工具，更是您提升效率、释放创造力的得力伙伴。\n\n✨ **核心亮点**\n- 🎯 智能化操作，让复杂变得简单\n- ⚡ 极速响应，效率提升300%\n- 🔒 企业级安全保障\n- 🎨 优雅的用户界面设计\n\n立即体验，开启全新的工作方式！\n\n---\n\n您可以根据具体产品特点进行调整。需要我针对特定行业或产品类型进行定制吗？',
        timestamp: Date.now() - 172700000,
        status: 'read',
      },
    ],
  },
]

export const aiResponses: Record<string, string[]> = {
  default: [
    '这是一个很好的问题！让我来详细解答一下。\n\n首先，我们需要从多个角度来思考这个问题。根据我的分析，这个问题涉及到以下几个关键方面：\n\n1. **理论基础** — 这部分是理解整个问题的关键起点\n2. **实践应用** — 理论需要结合实际场景才能真正发挥作用\n3. **未来展望** — 随着技术的发展，这个领域还有很大的发展空间\n\n希望这个回答对您有帮助！如果您有更多问题，随时可以继续提问。',
    '感谢您的提问！这是一个非常有趣的话题。\n\n经过仔细思考，我认为可以从以下几个维度来回答：\n\n- 从技术角度来看，这需要考虑系统的可扩展性和稳定性\n- 从用户体验角度，需要关注交互的流畅性和直观性\n- 从商业价值角度，需要评估投入产出比和市场接受度\n\n总的来说，这是一个值得深入探讨的方向。您还想了解哪方面的更多信息吗？',
    '我理解您的需求了。让我给您一个全面的回答。\n\n这个问题其实没有一个标准答案，因为不同的场景下可能有不同的最佳实践。不过我可以分享一些普遍适用的原则：\n\n✅ 保持简洁清晰的设计思路\n✅ 注重代码的可维护性\n✅ 充分考虑边界情况和异常处理\n✅ 编写充分的测试用例\n\n这些原则可以帮助您在各种情况下做出更好的决策。',
  ],
}

export function getMockResponse(userMessage: string): string {
  const responses = aiResponses.default
  let index = 0
  for (let i = 0; i < userMessage.length; i++) {
    index += userMessage.charCodeAt(i)
  }
  return responses[index % responses.length]
}
