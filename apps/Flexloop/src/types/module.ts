/**
 * 模块卡片相关类型定义
 * 用于首页功能模块展示
 */

/** 渐变方向 */
export type GradientDirection =
  | 'from-emerald-400 to-teal-600'
  | 'from-amber-400 to-orange-600'
  | 'from-blue-400 to-indigo-600'
  | 'from-pink-400 to-rose-600'
  | 'from-cyan-400 to-blue-600'
  | 'from-violet-400 to-purple-600'
  | 'from-fuchsia-400 to-pink-600'
  | 'from-sky-400 to-cyan-600'
  | 'from-slate-400 to-gray-600'
  | 'from-red-400 to-pink-600'
  | 'from-green-400 to-emerald-600'
  | 'from-lime-400 to-green-600'
  | 'from-purple-400 to-violet-600';

/** 功能模块数据接口 */
export interface ModuleData {
  /** 模块标题 */
  title: string;
  /** 副标题/描述 */
  subtitle: string;
  /** Emoji 图标 */
  icon: string;
  /** 路由路径 */
  route: string;
  /** 渐变起始色 (Tailwind CSS class) */
  gradientFrom: string;
  /** 渐变结束色 (Tailwind CSS class) */
  gradientTo: string;
}

/** 模块卡片组件 Props */
export interface ModuleCardProps extends ModuleData {
  /** 动画延迟时间（毫秒） */
  delay?: number;
}

/** 核心模块列表类型 */
export type CoreModule = Extract<
  ModuleData,
  {
    route:
      | '/monetization'
      | '/sphinx'
      | '/chat'
      | '/social'
      | '/marketplace'
      | '/collaboration'
      | '/memory'
      | '/customize';
  }
>;

/** 扩展模块列表类型 */
export type ExtraModule = Extract<ModuleData, { route: '/lifestyle' }>;

/** 所有模块的联合类型 */
export type AllModule = CoreModule | ExtraModule;

/** 模块分类 */
export const ModuleCategory = {
  /** 核心功能 */
  CORE: 'core',
  /** 扩展功能 */
  EXTRA: 'extra'
} as const;

export type ModuleCategory = (typeof ModuleCategory)[keyof typeof ModuleCategory];

/** 模块配置映射表 */
export const MODULE_CONFIG_MAP: Record<string, ModuleData> = {
  monetization: {
    title: '自动变现',
    subtitle: '全自动收益',
    icon: '💰',
    route: '/monetization',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-teal-600'
  },
  sphinx: {
    title: 'Sphinx 构建',
    subtitle: '快速建站',
    icon: '🏛️',
    route: '/sphinx',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-600'
  },
  chat: {
    title: '智能体与人交互',
    subtitle: '',
    icon: '💬',
    route: '/chat',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-600'
  },
  social: {
    title: '人与人的真实连接',
    subtitle: '',
    icon: '🤝',
    route: '/social',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-rose-600'
  },
  marketplace: {
    title: '交易',
    subtitle: '',
    icon: '🛒',
    route: '/marketplace',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-600'
  },
  collaboration: {
    title: '智能体核心',
    subtitle: '',
    icon: '🧠',
    route: '/collaboration',
    gradientFrom: 'from-violet-400',
    gradientTo: 'to-purple-600'
  },
  memory: {
    title: '存储记忆',
    subtitle: '',
    icon: '☁️',
    route: '/memory',
    gradientFrom: 'from-sky-400',
    gradientTo: 'to-cyan-600'
  },
  customize: {
    title: '定制可以自动变现的智能体',
    subtitle: '',
    icon: '⚙️',
    route: '/customize',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-gray-600'
  }
};
