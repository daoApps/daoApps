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
    id: 'agent-researcher',
    name: '数据研究员',
    avatar: '🔬',
    role: '数据研究员',
    specialty: ['数据分析', '市场调研', '信息收集', '报告生成'],
    status: 'online',
    description: '专业的研究分析师，擅长数据挖掘、市场调研和情报分析，提供详实的研究报告',
    skills: ['数据收集', '统计分析', '趋势预测', '竞品分析', '报告撰写'],
    level: 94,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['search', 'analysis', 'visualization'],
    collaborationMode: 'collaborator',
    completedTasks: 189,
    avgTime: 50,
    accuracy: 97,
  },
  {
    id: 'agent-designer',
    name: 'UI/UX 设计师',
    avatar: '🎨',
    role: 'UI/UX 设计师',
    specialty: ['界面设计', '用户体验', '原型制作', '视觉设计'],
    status: 'idle',
    description: '创意设计师，专注于用户界面和体验设计，打造美观且易用的产品界面',
    skills: ['UI设计', 'UX研究', '交互设计', '原型设计', '设计系统'],
    level: 93,
    responseStyle: 'friendly',
    outputDetail: 'normal',
    tools: ['design', 'prototype', 'asset-generation'],
    collaborationMode: 'collaborator',
    completedTasks: 167,
    avgTime: 40,
    accuracy: 95,
  },
  {
    id: 'agent-analyst',
    name: '业务分析师',
    avatar: '📊',
    role: '业务分析师',
    specialty: ['需求分析', '流程优化', '商业智能', 'KPI 分析'],
    status: 'online',
    description: '资深业务分析师，擅长需求梳理、流程优化和数据驱动的决策支持',
    skills: ['需求分析', '流程建模', '数据可视化', 'KPI设计', 'ROI分析'],
    level: 91,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['analysis', 'reporting', 'dashboard'],
    collaborationMode: 'reviewer',
    completedTasks: 145,
    avgTime: 35,
    accuracy: 96,
  },
  {
    id: 'agent-translator',
    name: '翻译专家',
    avatar: '🌐',
    role: '翻译专家',
    specialty: ['多语言翻译', '本地化', '文化适配', '术语管理'],
    status: 'offline',
    description: '精通多种语言的翻译专家，提供高质量的翻译和本地化服务',
    skills: ['中英翻译', '日韩翻译', '本地化', '术语管理', '文化适配'],
    level: 90,
    responseStyle: 'friendly',
    outputDetail: 'concise',
    tools: ['translation', 'terminology', 'quality-check'],
    collaborationMode: 'collaborator',
    completedTasks: 278,
    avgTime: 25,
    accuracy: 98,
  },
  {
    id: 'agent-consultant',
    name: '战略顾问',
    avatar: '💼',
    role: '战略顾问',
    specialty: ['战略规划', '商业模式', '风险评估', '决策支持'],
    status: 'busy',
    description: '经验丰富的战略顾问，提供专业的商业战略咨询和决策建议',
    skills: ['战略规划', '商业模式设计', '风险评估', '市场进入策略', '竞争分析'],
    level: 96,
    responseStyle: 'formal',
    outputDetail: 'detailed',
    tools: ['analysis', 'planning', 'presentation'],
    collaborationMode: 'leader',
    completedTasks: 89,
    avgTime: 90,
    accuracy: 94,
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
      { id: 'task-1-3', title: '预算编制', description: '制定详细的活动预算表', status: 'in_progress', priority: 'medium', progress: 45, assignedAgentId: 'agent-analyst' }
    ],
    startTime: Date.now() - 3600000,
    estimatedTime: 7200000,
  },
]

export const mockSessions: CollaborationSession[] = [
  {
    id: 'session-1',
    title: '新产品发布策划',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    agents: ['agent-planner', 'agent-writer', 'agent-researcher', 'agent-designer', 'agent-analyst'],
    tasks: [sampleTasks[0]!],
    status: 'active',
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
