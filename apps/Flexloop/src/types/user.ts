/**
 * 用户相关类型定义
 * 包含用户资料、设置、权限等
 */

/** 性别类型 */
export type Gender = 'male' | 'female' | 'other';

/** 用户资料接口 */
export interface UserProfile {
  /** 显示昵称 */
  nickname: string;
  /** 真实姓名 */
  realName: string;
  /** 性别 */
  gender: Gender;
  /** 出生日期 (YYYY-MM-DD) */
  birthday: string;
  /** 所在地区 */
  location: string;
  /** 邮箱地址 */
  email: string;
  /** 手机号码 */
  phone: string;
  /** 个人简介 */
  bio: string;
  /** 兴趣标签列表 */
  interests: string[];
  /** 头像 URL 或 Emoji */
  avatar: string;
  /** 社交账号绑定信息 */
  socialAccounts: SocialAccounts;
}

/** 社交账号绑定信息 */
export interface SocialAccounts {
  /** 微信 */
  wechat: { bound: boolean; username?: string };
  /** QQ */
  qq: { bound: boolean; username?: string };
  /** 微博 */
  weibo: { bound: boolean; username?: string };
  /** GitHub */
  github: { bound: boolean; username?: string };
}

/** 主题模式 */
export type ThemeMode = 'light' | 'dark' | 'system';

/** 字体大小 */
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

/** 布局密度 */
export type LayoutDensity = 'comfortable' | 'compact' | 'spacious';

/** 侧边栏模式 */
export type SidebarMode = 'always' | 'auto' | 'hidden';

/** 主题设置接口 */
export interface ThemeSettings {
  /** 主题模式 */
  mode: ThemeMode;
  /** 主色调（十六进制色值） */
  primaryColor: string;
  /** 字体大小 */
  fontSize: FontSize;
  /** 布局密度 */
  layoutDensity: LayoutDensity;
  /** 侧边栏显示模式 */
  sidebarMode: SidebarMode;
  /** 是否减少动画（无障碍选项） */
  reduceMotion: boolean;
}

/** 邮件通知频率 */
export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

/** 短信通知频率限制 */
export type SmsFrequency = 'unlimited' | 'max5' | 'max10';

/** 通知设置接口 */
export interface NotificationSettings {
  /** 浏览器推送通知 */
  browserPush: boolean;
  /** 邮件通知 */
  emailNotification: boolean;
  /** 短信通知 */
  smsNotification: boolean;
  /** 应用内通知 */
  inAppNotification: boolean;
  /** 系统级通知 */
  systemNotifications: boolean;
  /** 社交互动通知 */
  socialInteractions: boolean;
  /** 交易提醒 */
  transactionAlerts: boolean;
  /** 会议提醒 */
  meetingReminders: boolean;
  /** 营销消息 */
  marketingMessages: boolean;
  /** 免打扰开始时间 (HH:mm) */
  doNotDisturbStart: string;
  /** 免打扰结束时间 (HH:mm) */
  doNotDisturbEnd: string;
  /** 邮件通知频率 */
  emailFrequency: EmailFrequency;
  /** 短信通知频率限制 */
  smsFrequency: SmsFrequency;
}

/** 双因素认证方式 */
export type TwoFactorMethod = 'sms' | 'email';

/** 设备类型 */
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

/** 已登录设备信息 */
export interface Device {
  /** 设备唯一标识 */
  id: string;
  /** 设备名称 */
  name: string;
  /** 设备类型 */
  type: DeviceType;
  /** 操作系统 */
  os: string;
  /** 浏览器信息 */
  browser: string;
  /** 最后活跃时间 (ISO 8601) */
  lastActive: string;
  /** 是否为当前设备 */
  isCurrentDevice: boolean;
}

/** 个人资料可见性 */
export type ProfileVisibility = 'public' | 'friends' | 'private';

/** 安全设置接口 */
export interface SecuritySettings {
  /** 是否启用双因素认证 */
  twoFactorEnabled: boolean;
  /** 双因素认证方式 */
  twoFactorMethod: TwoFactorMethod;
  /** 已登录设备列表 */
  devices: Device[];
  /** 资料可见性 */
  profileVisibility: ProfileVisibility;
  /** 是否显示在线状态 */
  showOnlineStatus: boolean;
  /** 是否显示已读回执 */
  showReadReceipts: boolean;
  /** 是否显示活动状态 */
  showActivityStatus: boolean;
}

/** FAQ 分类 */
export type FAQCategory = 'getting-started' | 'features' | 'faq' | 'troubleshooting' | 'support';

/** 常见问题条目 */
export interface FAQItem {
  /** 问题唯一标识 */
  id: string;
  /** 所属分类 */
  category: FAQCategory;
  /** 问题标题 */
  title: string;
  /** 问题摘要 */
  summary: string;
  /** 详细回答内容（支持 Markdown） */
  content: string;
  /** 标签列表 */
  tags: string[];
  /** 最后更新时间 */
  updatedAt: string;
  /** 认为有帮助的人数 */
  helpful: number;
  /** 认为没帮助的人数 */
  notHelpful: number;
}

/** 帮助文章 */
export interface HelpArticle {
  /** 文章唯一标识 */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  summary: string;
  /** 文章内容（支持 Markdown） */
  content: string;
  /** 文章分类 */
  category: string;
  /** 标签列表 */
  tags: string[];
  /** 最后更新时间 */
  updatedAt: string;
  /** 预计阅读时间（分钟） */
  readTime: number;
}
