export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  routePath: string;
  color: string;
  badge?: string | number;
}

export const coreModules: ModuleConfig[] = [
  {
    id: 'monetization',
    title: '自动变现',
    description: '全自动收益管理',
    icon: 'Wallet',
    routePath: '/monetization',
    color: '#10b981'
  },
  {
    id: 'sphinx',
    title: 'Sphinx 快速建站',
    description: 'AI 驱动建站',
    icon: 'Build',
    routePath: '/sphinx',
    color: '#3b82f6'
  },
  {
    id: 'chat',
    title: '智能体对话',
    description: '多模态 AI 交互',
    icon: 'Chat',
    routePath: '/chat',
    color: '#8b5cf6'
  },
  {
    id: 'social',
    title: '社交连接',
    description: '真实人际关系',
    icon: 'Users',
    routePath: '/social',
    color: '#ec4899'
  },
  {
    id: 'marketplace',
    title: '交易市场',
    description: '商品交易平台',
    icon: 'ShoppingCart',
    routePath: '/marketplace',
    color: '#f59e0b'
  },
  {
    id: 'collaboration',
    title: '多智能体协作',
    description: 'Agent 团队协作',
    icon: 'UsersCog',
    routePath: '/collaboration',
    color: '#06b6d4'
  },
  {
    id: 'memory',
    title: '存储记忆',
    description: '云存储知识库',
    icon: 'Database',
    routePath: '/memory',
    color: '#84cc16'
  },
  {
    id: 'customize',
    title: '定制智能体',
    description: '专属 AI 助手',
    icon: 'UserCog',
    routePath: '/customize',
    color: '#f97316'
  },
  {
    id: 'agent-core',
    title: '智能体核心',
    description: 'AI 引擎中心',
    icon: 'Cpu',
    routePath: '/collaboration#core',
    color: '#6366f1'
  }
];

export const extraModules: ModuleConfig[] = [
  {
    id: 'lifestyle',
    title: '生活服务',
    description: '会议旅游游戏',
    icon: 'LifeRing',
    routePath: '/lifestyle',
    color: '#14b8a6'
  },
  {
    id: 'settings',
    title: '设置中心',
    description: '个人偏好配置',
    icon: 'Cog',
    routePath: '/settings',
    color: '#64748b'
  }
];

export const allModules: ModuleConfig[] = [...coreModules, ...extraModules];

export default allModules;
