import type { AgentInfo, Conversation, QuickCommand, Message } from '../types/chat';

export const availableAgents: AgentInfo[] = [
  {
    id: 'agent-1',
    name: 'Flexloop 助手',
    avatar: '🤖',
    description: '通用智能助手，擅长多领域问答'
  },
  {
    id: 'agent-2',
    name: '代码专家',
    avatar: '💻',
    description: '专注于编程和代码相关问题'
  },
  {
    id: 'agent-3',
    name: '创意写手',
    avatar: '✍️',
    description: '擅长文案创作和内容生成'
  }
];

export const quickCommands: QuickCommand[] = [
  {
    id: 'qc-1',
    label: '你好，介绍一下自己',
    prompt: '你好，请介绍一下你自己',
    category: 'general',
    icon: '👋'
  },
  {
    id: 'qc-2',
    label: '今天天气怎么样？',
    prompt: '帮我查询一下今天的天气情况',
    category: 'general',
    icon: '🌤️'
  },
  {
    id: 'qc-3',
    label: '写一首诗',
    prompt: '请为我创作一首关于春天的诗',
    category: 'creative',
    icon: '📝'
  },
  {
    id: 'qc-4',
    label: '生成故事大纲',
    prompt: '帮我构思一个科幻小说的故事大纲',
    category: 'creative',
    icon: '📖'
  },
  {
    id: 'qc-5',
    label: '分析数据趋势',
    prompt: '如何分析一组时间序列数据的趋势变化？',
    category: 'analysis',
    icon: '📊'
  },
  {
    id: 'qc-6',
    label: '对比两个方案',
    prompt: '请帮我分析并对比两种技术方案的优缺点',
    category: 'analysis',
    icon: '⚖️'
  },
  {
    id: 'qc-7',
    label: '解释这段代码',
    prompt:
      '请详细解释以下代码的功能和实现原理：\n```javascript\nconst arr = [1, 2, 3].map(x => x * 2)\n```',
    category: 'coding',
    icon: '🔍'
  },
  {
    id: 'qc-8',
    label: '优化性能问题',
    prompt: '我的 React 应用渲染很慢，有什么常见的性能优化方案？',
    category: 'coding',
    icon: '⚡'
  }
];

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
        status: 'read'
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content:
          'React 和 Vue 都是流行的前端框架，它们的主要区别包括：\n\n**设计理念**\n- React 采用函数式编程思想，强调不可变数据\n- Vue 采用渐进式框架理念，更注重开发体验\n\n两者各有优势，选择取决于项目需求和团队偏好。',
        timestamp: Date.now() - 86300000,
        status: 'read'
      }
    ]
  }
];

/** 增强的 AI 响应库 */
export const aiResponses: Record<string, string[]> = {
  default: [
    '这是一个很好的问题！让我来详细解答一下。\n\n首先，我们需要从多个角度来思考这个问题。根据我的分析，这个问题涉及到以下几个关键方面：\n\n1. **理论基础** — 这部分是理解整个问题的关键起点\n2. **实践应用** — 理论需要结合实际场景才能真正发挥作用\n3. **未来展望** — 随着技术的发展，这个领域还有很大的发展空间\n\n希望这个回答对您有帮助！如果您有更多问题，随时可以继续提问。',
    '感谢您的提问！这是一个非常有趣的话题。\n\n经过仔细思考，我认为可以从以下几个维度来回答：\n\n- 从技术角度来看，这需要考虑系统的可扩展性和稳定性\n- 从用户体验角度，需要关注交互的流畅性和直观性\n- 从商业价值角度，需要评估投入产出比和市场接受度\n\n总的来说，这是一个值得深入探讨的方向。您还想了解哪方面的更多信息吗？',
    '我理解您的需求。让我为您提供一个全面的解答。\n\n基于我的知识库和经验，这个问题的核心要点包括：\n\n### 主要观点\n\n**第一点**：这是最基础也是最重要的部分，需要特别注意细节处理。\n\n**第二点**：在实际应用中，我们通常会采用模块化的方式来实现，这样可以提高代码的可维护性和复用性。\n\n**第三点**：考虑到性能因素，建议使用异步处理或缓存机制来优化响应速度。\n\n如果您需要更具体的示例代码或详细的步骤说明，请随时告诉我！',
    '非常好的问题！这正是很多人关心的核心议题。\n\n让我从实践角度给您一些具体的建议：\n\n## 实施方案\n\n1. **前期准备** — 充分调研和需求分析是成功的关键\n2. **分步实施** — 将大任务拆解为小的可执行单元\n3. **持续迭代** — 根据反馈不断优化改进\n4. **质量保障** — 建立完善的测试和审查机制\n\n通过以上方法，您可以有效地解决这个问题。如果在实施过程中遇到任何困难，我很乐意提供进一步的帮助。'
  ],
  coding: [
    '这段代码的实现原理如下：\n\n```javascript\n// 核心逻辑解析\nconst arr = [1, 2, 3].map(x => x * 2)\n// 结果: [2, 4, 6]\n```\n\n**关键点说明**：\n- `map()` 方法创建一个新数组，其结果是该数组中的每个元素调用一次提供的函数后的返回值\n- 箭头函数 `x => x * 2` 对每个元素进行乘以2的操作\n- 原始数组不会被修改（不可变性）\n\n这种函数式编程的方式在 React/Vue 等现代框架中非常常见。',
    '关于代码优化，这里有几个关键策略：\n\n### 性能优化清单\n\n✅ **组件级优化**\n- 使用 `React.memo` / `computed` 避免不必要的重渲染\n- 合理拆分组件，遵循单一职责原则\n\n✅ **渲染优化**\n- 虚拟列表处理长数据\n- 懒加载非首屏内容\n- 使用 Web Workers 处理复杂计算\n\n✅ **网络优化**\n- 接口请求合并/去重\n- 数据预加载和缓存策略\n\n需要针对具体场景的优化方案吗？我可以提供更详细的代码示例。'
  ],
  creative: [
    '这是一首为您创作的春日诗篇：\n\n> 🌸 春风拂面柳丝长，\n> 花开满园吐芬芳。\n> 燕子归来筑新巢，\n> 万物复苏迎朝阳。\n\n希望这首诗能带给您美好的感受！如果您想要不同风格（古典/现代/幽默）的作品，或者有特定的主题要求，请告诉我。',
    '以下是一个科幻小说的故事大纲：\n\n## 《星际迷航：量子裂痕》\n\n**背景设定**：2157年，人类已经掌握了星际跳跃技术\n\n**主要角色**：\n- 主角：林远星舰船长艾拉·陈\n- 配角：AI助手"诺瓦"、外星盟友泽塔\n\n**故事主线**：\n1. 发现异常信号 → 2. 进入未知星域 → 3. 遭遇神秘文明 → 4. 揭开宇宙秘密\n\n**主题探讨**：科技与人性、文明冲突与融合、未知的勇气\n\n需要我展开某个章节的详细情节吗？'
  ],
  analysis: [
    `数据分析的关键步骤和方法论：\\n\\n## 时间序列分析流程\\n\\n### 1️⃣ 数据预处理\\\`\\\`\\\`python\\n# 缺失值处理\\ndf.fillna(method='ffill')\\n# 异常值检测\\nfrom scipy import stats\\nz_scores = stats.zscore(df['value'])\\\`\\\`\\\`\\n\\n### 2️⃣ 趋势识别方法\\n- **移动平均法**：平滑短期波动\\n- **指数平滑**：赋予近期数据更高权重\\n- **分解模型**：趋势+季节性+残差\\n\\n### 3️⃣ 可视化建议\\n使用交互式图表展示趋势线、置信区间和异常标记点。\\n\\n需要更深入的技术细节或特定工具的使用指导吗？`,
    '两种方案的全面对比分析：\n\n| 维度 | 方案A | 方案B |\n|------|-------|-------|\n| **开发成本** | ⭐⭐⭐ 中等 | ⭐ 较低 |\n| **性能表现** | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐ 良好 |\n| **可维护性** | ⭐⭐⭐⭐ 高 | ⭐⭐ 中等 |\n| **扩展性** | ⭐⭐⭐⭐ 强 | ⭐⭐⭐ 一般 |\n| **学习曲线** | ⭐⭐ 陡峭 | ⭐⭐⭐⭐ 平缓 |\n\n**推荐结论**：如果项目长期维护且追求高性能，选A；快速原型或团队新手较多，选B。\n\n需要针对您的具体场景做更细致的评估吗？'
  ]
};

/**
 * 检测消息类型并返回对应的响应类别
 */
function detectMessageType(message: string): string {
  const lowerMsg = message.toLowerCase();

  // 编程相关关键词
  if (/code|代码|编程|function|api|debug|bug|error|react|vue|javascript|python/g.test(lowerMsg)) {
    return 'coding';
  }

  // 创意写作相关
  if (/写|诗|创作|故事|文章|文案|创意|generate|write|poem|story/g.test(lowerMsg)) {
    return 'creative';
  }

  // 分析相关
  if (/分析|对比|比较|趋势|data|分析|compare|analysis|统计|报告/g.test(lowerMsg)) {
    return 'analysis';
  }

  return 'default';
}

/**
 * 基于上下文相关性选择响应
 */
export function getMockResponse(userMessage: string, context?: Message[]): string {
  // 检测消息类型
  const msgType = detectMessageType(userMessage);
  const responses = aiResponses[msgType] || aiResponses.default;
  if (!responses || responses.length === 0) {
    return '抱歉，我暂时无法回答这个问题。';
  }

  // 如果有上下文，结合上下文计算索引
  let index = 0;

  if (context && context.length > 0) {
    // 结合用户消息和最近一条上下文的哈希值
    const lastContextMsg = context[context.length - 1];
    for (let i = 0; i < userMessage.length; i++) {
      index += userMessage.charCodeAt(i);
    }
    if (lastContextMsg) {
      for (let i = 0; i < Math.min(lastContextMsg.content.length, 50); i++) {
        index += lastContextMsg.content.charCodeAt(i);
      }
    }
  } else {
    // 仅基于当前消息
    for (let i = 0; i < userMessage.length; i++) {
      index += userMessage.charCodeAt(i);
    }
  }

  const finalIndex = index % responses.length;
  return responses[finalIndex] ?? '抱歉，我暂时无法回答这个问题。';
}
