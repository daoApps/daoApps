export interface Agent {
  id: string
  name: string
  avatar: string
  role: string
  specialty: string[]
  status: 'online' | 'busy' | 'offline' | 'idle' | 'working' | 'waiting' | 'error'
  description: string
  skills: string[]
  level: number
  responseStyle: 'formal' | 'friendly' | 'humorous'
  outputDetail: 'concise' | 'normal' | 'detailed'
  tools: string[]
  collaborationMode: 'leader' | 'collaborator' | 'reviewer'
  completedTasks: number
  avgTime: number
  accuracy: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'error'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  assignedAgentId?: string
  subtasks?: Task[]
  dependencies?: string[]
  startTime?: number
  endTime?: number
  estimatedTime?: number
  result?: string
  qualityScore?: number
}

export interface CollaborationSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  agents: string[]
  tasks: Task[]
  status: 'active' | 'completed' | 'paused'
  result?: CollaborationResult
}

export interface CollaborationResult {
  id: string
  sessionId: string
  summary: string
  agentResults: AgentResult[]
  overallScore: number
  exportFormats: string[]
}

export interface AgentResult {
  agentId: string
  agentName: string
  output: string
  score: number
  feedback?: string
  timestamp: number
}

export interface Message {
  id: string
  fromAgentId: string
  fromAgentName: string
  toAgentId?: string
  toAgentName?: string
  type: 'request' | 'response' | 'notification' | 'warning' | 'conflict'
  content: string
  timestamp: number
  sessionId: string
}

export const presetAgents: Agent[] = [
  {
    id: 'agent-planner',
    name: '任务规划师',
    avatar: '🎯',
    role: '任务规划师',
    specialty: ['任务分解', '项目管理', '流程优化', '时间规划'],
    status: 'online',
    description: '擅长将复杂任务分解为可执行的子任务，制定高效的项目计划和时间线',
    skills: ['任务分析', '优先级排序', '资源分配', '风险评估', '里程碑规划'],
    level: 95,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['search', 'analysis', 'planning'],
    collaborationMode: 'leader',
    completedTasks: 156,
    avgTime: 45,
    accuracy: 98,
  },
  {
    id: 'agent-writer',
    name: '内容创作专家',
    avatar: '✍️',
    role: '内容创作专家',
    specialty: ['文案写作', '创意内容', '文章撰写', '营销文案'],
    status: 'online',
    description: '专业的文案创作能力，能够生成高质量的文章、文案和各种创意内容',
    skills: ['文案撰写', '创意构思', 'SEO优化', '品牌调性', '多风格写作'],
    level: 92,
    responseStyle: 'friendly',
    outputDetail: 'detailed',
    tools: ['search', 'writing', 'template'],
    collaborationMode: 'collaborator',
    completedTasks: 234,
    avgTime: 30,
    accuracy: 96,
  },
  {
    id: 'agent-coder',
    name: '编程工程师',
    avatar: '💻',
    role: '编程工程师',
    specialty: ['代码开发', '程序调试', '技术方案', '架构设计'],
    status: 'online',
    description: '全栈开发工程师，精通多种编程语言和技术栈，提供专业的代码解决方案',
    skills: ['前端开发', '后端开发', '数据库设计', 'API开发', '代码审查', '性能优化'],
    level: 97,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['code-execution', 'debug', 'file-io', 'search'],
    collaborationMode: 'collaborator',
    completedTasks: 312,
    avgTime: 60,
    accuracy: 99,
  },
  {
    id: 'agent-analyst',
    name: '数据分析师',
    avatar: '📊',
    role: '数据分析师',
    specialty: ['数据处理', '报表生成', '数据洞察', '统计分析'],
    status: 'online',
    description: '专业的数据分析能力，能够从复杂数据中提取有价值的洞察和趋势',
    skills: ['数据清洗', '统计分析', '可视化', '预测建模', '报告生成'],
    level: 94,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['analysis', 'visualization', 'file-io', 'search'],
    collaborationMode: 'collaborator',
    completedTasks: 189,
    avgTime: 50,
    accuracy: 97,
  },
  {
    id: 'agent-designer',
    name: '设计顾问',
    avatar: '🎨',
    role: '设计顾问',
    specialty: ['UI/UX设计', '视觉方案', '用户体验', '交互设计'],
    status: 'idle',
    description: '资深设计师，提供专业的UI/UX建议和视觉设计方案',
    skills: ['UI设计', 'UX研究', '原型制作', '配色方案', '交互设计', '品牌视觉'],
    level: 91,
    responseStyle: 'friendly',
    outputDetail: 'normal',
    tools: ['design-preview', 'template', 'search'],
    collaborationMode: 'collaborator',
    completedTasks: 145,
    avgTime: 40,
    accuracy: 95,
  },
  {
    id: 'agent-researcher',
    name: '研究员',
    avatar: '🔍',
    role: '研究员',
    specialty: ['信息搜集', '市场调研', '竞品分析', '行业研究'],
    status: 'online',
    description: '专业的研究人员，擅长深度信息搜集和市场调研分析',
    skills: ['信息检索', '竞品分析', '市场调研', '行业报告', '趋势分析'],
    level: 93,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['search', 'analysis', 'file-io'],
    collaborationMode: 'collaborator',
    completedTasks: 201,
    avgTime: 55,
    accuracy: 96,
  },
  {
    id: 'agent-consultant',
    name: '商业顾问',
    avatar: '💼',
    role: '商业顾问',
    specialty: ['商业模式', '营销策略', '财务分析', '战略规划'],
    status: 'busy',
    description: '经验丰富的商业顾问，提供全面的商业策略和财务分析服务',
    skills: ['商业模式设计', '市场策略', '财务分析', '竞争战略', '投资评估'],
    level: 90,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['analysis', 'search', 'calculation'],
    collaborationMode: 'leader',
    completedTasks: 167,
    avgTime: 70,
    accuracy: 94,
  },
  {
    id: 'agent-translator',
    name: '翻译官',
    avatar: '🌐',
    role: '翻译官',
    specialty: ['多语言翻译', '本地化', '跨文化沟通', '语言适配'],
    status: 'online',
    description: '精通多国语言的翻译专家，提供准确流畅的翻译和本地化服务',
    skills: ['多语种翻译', '本地化', '文化适配', '术语管理', '质量校对'],
    level: 96,
    responseStyle: 'friendly',
    outputDetail: 'normal',
    tools: ['translation', 'search', 'dictionary'],
    collaborationMode: 'collaborator',
    completedTasks: 278,
    avgTime: 25,
    accuracy: 99,
  },
]

export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: '产品发布会完整策划方案',
    description: '为新产品发布制定完整的活动策划方案，包括时间安排、预算、宣传策略等',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    assignedAgentId: 'agent-planner',
    subtasks: [
      { id: 'task-1-1', title: '市场背景调研', description: '收集目标市场和竞争对手信息', status: 'completed', priority: 'high', progress: 100, assignedAgentId: 'agent-researcher' },
      { id: 'task-1-2', title: '活动主题与创意', description: '确定发布会主题和核心创意概念', status: 'completed', priority: 'high', progress: 100, assignedAgentId: 'agent-writer' },
      { id: 'task-1-3', title: '预算编制', description: '制定详细的活动预算表', status: 'in_progress', priority: 'medium', progress: 45, assignedAgentId: 'agent-analyst' },
      { id: 'task-1-4', title: '宣传文案撰写', description: '撰写各渠道的宣传文案', status: 'pending', priority: 'medium', progress: 0, assignedAgentId: 'agent-writer' },
      { id: 'task-1-5', title: '视觉效果设计', description: '设计主视觉和相关物料', status: 'pending', priority: 'medium', progress: 0, assignedAgentId: 'agent-designer' },
    ],
    dependencies: [],
    startTime: Date.now() - 3600000,
    estimatedTime: 7200000,
  },
  {
    id: 'task-2',
    title: '电商平台前端重构',
    description: '对现有电商平台前端进行技术升级和用户体验优化',
    status: 'pending',
    priority: 'urgent',
    progress: 0,
    subtasks: [
      { id: 'task-2-1', title: '技术选型分析', description: '评估并选择合适的前端技术栈', status: 'pending', priority: 'high', progress: 0, assignedAgentId: 'agent-coder' },
      { id: 'task-2-2', title: 'UI/UX改进方案', description: '基于用户反馈提出界面改进建议', status: 'pending', priority: 'high', progress: 0, assignedAgentId: 'agent-designer' },
      { id: 'task-2-3', title: '核心模块开发', description: '重构购物车、结算等核心功能', status: 'pending', priority: 'high', progress: 0, assignedAgentId: 'agent-coder' },
      { id: 'task-2-4', title: '性能测试与优化', description: '进行性能基准测试并优化瓶颈', status: 'pending', priority: 'medium', progress: 0, assignedAgentId: 'agent-coder' },
    ],
    dependencies: [],
  },
  {
    id: 'task-3',
    title: 'Q4季度销售数据分析报告',
    description: '分析第四季度销售数据，生成可视化报告并提供业务洞察',
    status: 'completed',
    priority: 'high',
    progress: 100,
    assignedAgentId: 'agent-analyst',
    startTime: Date.now() - 86400000,
    endTime: Date.now() - 3600000,
    result: '已完成Q4季度销售数据分析，整体销售额同比增长23%，主要增长来自线上渠道...',
    qualityScore: 94,
  },
  {
    id: 'task-4',
    title: '多语言官网本地化项目',
    description: '将公司官网内容翻译并本地化为英语、日语、韩语版本',
    status: 'in_progress',
    priority: 'medium',
    progress: 40,
    subtasks: [
      { id: 'task-4-1', title: '英文版翻译', description: '完成英文版本的翻译工作', status: 'completed', priority: 'high', progress: 100, assignedAgentId: 'agent-translator' },
      { id: 'task-4-2', title: '日文版翻译', description: '完成日文版本的翻译工作', status: 'in_progress', priority: 'high', progress: 60, assignedAgentId: 'agent-translator' },
      { id: 'task-4-3', title: '韩文版翻译', description: '完成韩文版本的翻译工作', status: 'pending', priority: 'high', progress: 0, assignedAgentId: 'agent-translator' },
      { id: 'task-4-4', title: '本地化审核', description: '审核各语言版本的本地化质量', status: 'pending', priority: 'medium', progress: 0 },
    ],
    startTime: Date.now() - 172800000,
    estimatedTime: 259200000,
  },
  {
    id: 'task-5',
    title: '新商业模式可行性研究',
    description: '研究并评估SaaS订阅模式的可行性和潜在收益',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    assignedAgentId: 'agent-consultant',
    subtasks: [
      { id: 'task-5-1', title: '市场机会分析', description: '分析SaaS市场的规模和增长潜力', status: 'pending', priority: 'high', progress: 0, assignedAgentId: 'agent-researcher' },
      { id: 'task-5-2', title: '财务模型构建', description: '建立收入预测和成本结构模型', status: 'pending', priority: 'high', progress: 0, assignedAgentId: 'agent-analyst' },
      { id: 'task-5-3', title: '竞争格局分析', description: '分析主要竞争对手的定价策略', status: 'pending', priority: 'medium', progress: 0, assignedAgentId: 'agent-consultant' },
    ],
  },
]

export const mockSessions: CollaborationSession[] = [
  {
    id: 'session-1',
    title: '新产品发布策划',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    agents: ['agent-planner', 'agent-writer', 'agent-researcher', 'agent-designer', 'agent-analyst'],
    tasks: [sampleTasks[0]],
    status: 'active',
  },
  {
    id: 'session-2',
    title: '电商平台重构项目',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 86400000,
    agents: ['agent-coder', 'agent-designer', 'agent-analyst'],
    tasks: [sampleTasks[1]],
    status: 'active',
  },
  {
    id: 'session-3',
    title: 'Q4数据分析',
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 172800000,
    agents: ['agent-analyst'],
    tasks: [sampleTasks[2]],
    status: 'completed',
    result: {
      id: 'result-1',
      sessionId: 'session-3',
      summary: 'Q4季度销售额达到历史新高，同比增长23%，主要驱动因素包括双十一促销活动和海外市场拓展。',
      agentResults: [
        {
          agentId: 'agent-analyst',
          agentName: '数据分析师',
          output: '## Q4季度销售数据分析报告\n\n### 核心指标\n- 总销售额：¥12.5M（同比+23%）\n- 订单量：89,234单（同比+18%）\n- 客单价：¥140（同比+4%）\n\n### 渠道分析\n- 线上渠道占比68%（+12pp）\n- 线下渠道占比32%（-12pp）\n\n### 建议\n1. 加大线上渠道投入\n2. 优化移动端体验\n3. 拓展海外市场',
          score: 94,
          timestamp: Date.now() - 172800000,
        },
      ],
      overallScore: 94,
      exportFormats: ['markdown', 'pdf', 'json'],
    },
  },
]

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    fromAgentId: 'agent-planner',
    fromAgentName: '任务规划师',
    toAgentId: 'agent-researcher',
    toAgentName: '研究员',
    type: 'request',
    content: '请协助收集目标市场的最新数据和竞争对手信息，重点关注近6个月的市场动态。',
    timestamp: Date.now() - 3600000,
    sessionId: 'session-1',
  },
  {
    id: 'msg-2',
    fromAgentId: 'agent-researcher',
    fromAgentName: '研究员',
    toAgentId: 'agent-planner',
    toAgentName: '任务规划师',
    type: 'response',
    content: '已完成市场调研，发现3个主要竞争对手近期都有新品发布计划，建议我们提前2周启动预热。',
    timestamp: Date.now() - 3500000,
    sessionId: 'session-1',
  },
  {
    id: 'msg-3',
    fromAgentId: 'agent-planner',
    fromAgentName: '任务规划师',
    toAgentId: 'agent-writer',
    toAgentName: '内容创作专家',
    type: 'request',
    content: '基于市场调研结果，请开始构思发布会的主题创意和核心信息点。',
    timestamp: Date.now() - 3400000,
    sessionId: 'session-1',
  },
  {
    id: 'msg-4',
    fromAgentId: 'agent-writer',
    fromAgentName: '内容创作专家',
    type: 'notification',
    content: '已收到需求，正在头脑风暴创意方向，预计10分钟内提供3个候选方案。',
    timestamp: Date.now() - 3300000,
    sessionId: 'session-1',
  },
  {
    id: 'msg-5',
    fromAgentId: 'agent-analyst',
    fromAgentName: '数据分析师',
    type: 'warning',
    content: '注意：当前预算方案超出预期15%，建议重新审视部分非必要支出项。',
    timestamp: Date.now() - 1800000,
    sessionId: 'session-1',
  },
  {
    id: 'msg-6',
    fromAgentId: 'agent-writer',
    fromAgentName: '内容创作专家',
    toAgentId: 'agent-designer',
    toAgentName: '设计顾问',
    type: 'conflict',
    content: '关于主视觉色调，我倾向使用活力橙作为主色，但需要确认是否与品牌调性一致？',
    timestamp: Date.now() - 1200000,
    sessionId: 'session-1',
  },
  {
    id: 'msg-7',
    fromAgentId: 'agent-designer',
    fromAgentName: '设计顾问',
    toAgentId: 'agent-writer',
    toAgentName: '内容创作专家',
    type: 'response',
    content: '建议使用深蓝配金色渐变，更符合高端定位，同时保持科技感。我们可以准备两套方案供决策。',
    timestamp: Date.now() - 1100000,
    sessionId: 'session-1',
  },
]

export const taskTypeRecommendations: Record<string, string[]> = {
  '策划': ['agent-planner', 'agent-researcher', 'agent-writer'],
  '写作': ['agent-writer', 'agent-translator'],
  '编程': ['agent-coder', 'agent-analyst'],
  '数据': ['agent-analyst', 'agent-researcher'],
  '设计': ['agent-designer', 'agent-writer'],
  '商业': ['agent-consultant', 'agent-analyst', 'agent-researcher'],
  '翻译': ['agent-translator', 'agent-writer'],
  '研究': ['agent-researcher', 'agent-analyst'],
}

export function getRecommendedAgents(taskDescription: string): string[] {
  const recommendations: string[] = []
  for (const [keyword, agents] of Object.entries(taskTypeRecommendations)) {
    if (taskDescription.includes(keyword)) {
      recommendations.push(...agents)
    }
  }
  return [...new Set(recommendations)]
}
