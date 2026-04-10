export interface UserProfile {
  nickname: string;
  realName: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  interests: string[];
  avatar: string;
  website: string;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  layoutDensity: 'comfortable' | 'compact' | 'minimal';
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface NotificationChannelSettings {
  systemAnnouncement: { browserPush: boolean; inApp: boolean };
  agentMessage: { browserPush: boolean; inApp: boolean; email: boolean };
  socialInteraction: { browserPush: boolean; inApp: boolean; email: boolean };
  transactionAlert: { browserPush: boolean; inApp: boolean; email: boolean; sms: boolean };
  securityAlert: { browserPush: boolean; inApp: boolean; email: boolean; sms: boolean };
}

export interface NotificationConfig {
  channels: NotificationChannelSettings;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  aggregationMode: 'instant' | 'hourly' | 'daily';
  sound: string;
  vibration: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'totp' | 'sms';
  devices: Device[];
  backupCodes: string[];
}

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

export interface FAQItem {
  id: string;
  category: 'getting-started' | 'features' | 'billing' | 'security' | 'troubleshooting';
  title: string;
  content: string;
  tags: string[];
}

export const defaultUserProfile: UserProfile = {
  nickname: '智能体用户',
  realName: '',
  gender: 'other',
  birthday: '1990-01-01',
  location: '北京',
  email: 'user@example.com',
  phone: '138****8888',
  bio: '热爱技术，享受生活',
  interests: ['科技', '旅行', '阅读', '音乐'],
  avatar: '',
  website: ''
};

export const defaultThemeSettings: ThemeSettings = {
  mode: 'system',
  primaryColor: '#6366f1',
  fontSize: 'medium',
  layoutDensity: 'comfortable',
  reduceMotion: false,
  highContrast: false
};

export const defaultNotificationConfig: NotificationConfig = {
  channels: {
    systemAnnouncement: { browserPush: true, inApp: true },
    agentMessage: { browserPush: true, inApp: true, email: false },
    socialInteraction: { browserPush: true, inApp: true, email: false },
    transactionAlert: { browserPush: true, inApp: true, email: true, sms: false },
    securityAlert: { browserPush: true, inApp: true, email: true, sms: true }
  },
  doNotDisturbStart: '22:00',
  doNotDisturbEnd: '08:00',
  aggregationMode: 'instant',
  sound: 'default',
  vibration: true
};

export const presetColors = [
  { name: '靛蓝', value: '#6366f1' },
  { name: '翠绿', value: '#10b981' },
  { name: '琥珀', value: '#f59e0b' },
  { name: '玫瑰', value: '#ef4444' },
  { name: '天蓝', value: '#0ea5e9' },
  { name: '紫罗兰', value: '#8b5cf6' },
  { name: '珊瑚', value: '#f97316' },
  { name: '青色', value: '#06b6d4' }
];

export const soundOptions = [
  { id: 'default', name: '默认提示音', icon: '🔔' },
  { id: 'gentle', name: '轻柔铃声', icon: '🎵' },
  { id: 'chime', name: '清脆钟声', icon: '🔕' },
  { id: 'pop', name: '气泡音效', icon: '💬' },
  { id: 'digital', name: '数字信号', icon: '📟' },
  { id: 'none', name: '静音', icon: '🔇' }
];

export const cities = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '重庆',
  '西安',
  '武汉',
  '南京',
  '天津',
  '苏州',
  '长沙',
  '郑州',
  '东莞',
  '青岛',
  '沈阳',
  '宁波',
  '昆明',
  '合肥',
  '福州',
  '厦门',
  '哈尔滨',
  '济南'
];

export const devices: Device[] = [
  {
    id: 'device-1',
    name: '我的电脑 - Windows',
    type: 'desktop',
    os: 'Windows 11',
    browser: 'Chrome 120',
    ip: '192.168.1.100',
    lastActive: new Date().toISOString(),
    isCurrentDevice: true
  },
  {
    id: 'device-2',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    os: 'iOS 17.2',
    browser: 'Safari',
    ip: '192.168.1.101',
    lastActive: new Date(Date.now() - 3600000 * 2).toISOString(),
    isCurrentDevice: false
  },
  {
    id: 'device-3',
    name: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS Sonoma',
    browser: 'Chrome 120',
    ip: '10.0.0.50',
    lastActive: new Date(Date.now() - 3600000 * 24).toISOString(),
    isCurrentDevice: false
  }
];

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  for (let i = 0; i < 10; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    codes.push(code);
  }
  return codes;
}

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'getting-started',
    title: '如何开始使用平台？',
    content:
      '欢迎使用我们的平台！开始使用非常简单：\n\n1. **注册账号**：点击页面右上角的"注册"按钮，填写基本信息完成注册\n2. **完善资料**：登录后建议先在"设置 > 个人资料"中完善个人信息\n3. **探索功能**：浏览首页的功能卡片，了解平台提供的各项服务\n4. **创建内容**：尝试发布您的第一个项目或智能体\n\n我们为新用户准备了详细的新手引导，您可以在帮助中心找到更多教程。',
    tags: ['入门', '新手指南']
  },
  {
    id: 'faq-2',
    category: 'getting-started',
    title: '如何创建第一个智能体？',
    content:
      '创建智能体非常简单：\n\n1. 进入"协作"模块\n2. 点击"创建新智能体"\n3. 选择智能体类型（助手/分析/创作等）\n4. 配置基础参数和能力\n5. 测试并发布\n\n每个智能体都有独立的配置和记忆系统。',
    tags: ['智能体', '创建']
  },
  {
    id: 'faq-3',
    category: 'getting-started',
    title: '平台的定价方案是什么？',
    content:
      '我们提供灵活的定价方案：\n\n- **免费版**：基础功能，适合个人体验\n- **专业版** (¥99/月)：解锁高级功能、更多API调用\n- **企业版** (定制)：专属支持、私有部署\n\n所有方案都提供14天免费试用期。',
    tags: ['价格', '付费']
  },
  {
    id: 'faq-4',
    category: 'getting-started',
    title: '如何联系客服？',
    content:
      '我们有多种联系方式：\n\n- **在线客服**：点击右下角聊天图标\n- **邮件支持**：support@example.com\n- **工作时间**：周一至周五 9:00-18:00\n- **响应时间**：一般问题2小时内回复',
    tags: ['客服', '联系']
  },
  {
    id: 'faq-5',
    category: 'getting-started',
    title: '支持哪些浏览器？',
    content:
      '我们支持以下浏览器的最新两个版本：\n\n- Chrome / Edge (推荐)\n- Firefox\n- Safari\n- Opera\n\n为确保最佳体验，请保持浏览器更新到最新版本。',
    tags: ['浏览器', '兼容性']
  },
  {
    id: 'faq-6',
    category: 'getting-started',
    title: '如何重置密码？',
    content:
      '如果您忘记了密码：\n\n1. 在登录页面点击"忘记密码"\n2. 输入注册时使用的邮箱\n3. 查收密码重置邮件\n4. 按照邮件指引设置新密码\n\n如果收不到邮件，请检查垃圾邮件文件夹或联系客服。',
    tags: ['密码', '安全']
  },
  {
    id: 'faq-7',
    category: 'getting-started',
    title: '数据存储在哪里？',
    content:
      '我们采用多云架构确保数据安全：\n\n- **主数据中心**：位于中国境内\n- **备份节点**：异地容灾备份\n- **加密标准**：AES-256传输和存储加密\n- **合规认证**：通过ISO 27001认证\n\n您的数据完全由您控制，可随时导出或删除。',
    tags: ['数据', '隐私']
  },
  {
    id: 'faq-8',
    category: 'features',
    title: '会议日历如何设置提醒？',
    content:
      '会议日历支持多种提醒方式：\n\n1. 创建或编辑会议时，在"提醒"选项中选择时间\n2. 支持提前15分钟/30分钟/1小时/1天等预设\n3. 也支持自定义提醒时间\n4. 提醒会通过应用内通知和浏览器推送发送\n\n您可以在通知设置中统一管理提醒偏好。',
    tags: ['会议', '日历', '提醒']
  },
  {
    id: 'faq-9',
    category: 'features',
    title: '旅游规划器如何使用？',
    content:
      '旅游规划器的使用步骤：\n\n1. **搜索目的地**：输入城市或景点名称搜索\n2. **添加收藏**：将感兴趣的目的地加入收藏列表\n3. **创建行程**：选择目的地后创建新的旅行计划\n4. **安排活动**：按日期添加每日活动安排\n5. **导出行程**：完成后可导出为PDF分享\n\n系统会根据您的偏好推荐热门景点和活动。',
    tags: ['旅行', '规划']
  },
  {
    id: 'faq-10',
    category: 'features',
    title: '游戏中心有哪些游戏？',
    content:
      '游戏中心目前提供以下经典小游戏：\n\n🐍 **贪吃蛇** - 经典的贪吃蛇游戏，考验反应能力\n🧱 **俄罗斯方块** - 消除方块，挑战高分\n🔢 **2048** - 数字合并益智游戏\n\n所有游戏都支持键盘和触屏操作，游戏进度自动保存。未来还会持续增加更多有趣的游戏！',
    tags: ['游戏', '娱乐']
  },
  {
    id: 'faq-11',
    category: 'features',
    title: '主题切换后样式不生效怎么办？',
    content:
      '如果主题切换后样式未正确应用：\n\n1. 尝试刷新页面（Ctrl+F5 强制刷新）\n2. 清除浏览器缓存后重新访问\n3. 检查是否开启了"跟随系统"模式\n4. 确认浏览器允许JavaScript执行\n\n如仍有问题，请反馈给我们的技术团队。',
    tags: ['主题', '样式', '故障排除']
  },
  {
    id: 'faq-12',
    category: 'features',
    title: '如何导出我的数据？',
    content:
      '您可以在"设置 > 隐私与安全"中找到数据导出功能：\n\n1. 导航到隐私安全设置页面\n2. 点击"导出个人数据"按钮\n3. 系统会打包您的所有数据为ZIP文件\n4. 下载并解压即可查看\n\n导出的数据包括：个人资料、会议记录、设置配置等。',
    tags: ['数据导出', '隐私']
  },
  {
    id: 'faq-13',
    category: 'billing',
    title: '如何升级到专业版？',
    content:
      '升级步骤如下：\n\n1. 登录账户后进入"设置"页面\n2. 找到"订阅管理"部分\n3. 选择"专业版"套餐\n4. 完成支付（支持支付宝/微信/银行卡）\n5. 升级立即生效\n\n专业版用户享受：无限API调用、优先技术支持、高级数据分析等功能。',
    tags: ['升级', '支付']
  },
  {
    id: 'faq-14',
    category: 'billing',
    title: '可以申请退款吗？',
    content:
      '我们的退款政策：\n\n- **14天内无理由退款**：首次购买可在14天内申请全额退款\n- **按比例退款**：超过14天后按剩余天数比例计算\n- **特殊情况**：因服务故障导致的损失可协商处理\n\n请联系客服发起退款申请，我们会在3个工作日内处理完毕。',
    tags: ['退款', '政策']
  },
  {
    id: 'faq-15',
    category: 'billing',
    title: '发票如何开具？',
    content:
      '开具电子发票的步骤：\n\n1. 进入"设置 > 订单管理"\n2. 选择需要开票的订单\n3. 填写发票抬头和税号\n4. 选择发票类型（普通/专用）\n5. 提交申请，发票将发送至邮箱\n\n电子发票通常在1个工作日内开出。',
    tags: ['发票', '财务']
  },
  {
    id: 'faq-16',
    category: 'security',
    title: '如何开启双因素认证(2FA)？',
    content:
      '开启双因素认证增强账户安全：\n\n1. 进入"设置 > 隐私与安全"\n2. 找到"双因素认证"部分\n3. 开启开关并选择验证方式（TOTP/短信）\n4. 如果选择TOTP，扫描二维码绑定验证器应用\n5. 输入验证码完成激活\n\n开启后每次登录都需要二次验证，大大提高安全性。',
    tags: ['2FA', '安全', '认证']
  },
  {
    id: 'faq-17',
    category: 'security',
    title: '发现异常登录怎么办？',
    content:
      '如果发现可疑登录行为：\n\n1. 立即修改密码\n2. 在设备管理中将未知设备强制下线\n3. 检查并开启双因素认证\n4. 查看登录日志确认是否有其他异常\n5. 必要时联系客服冻结账户\n\n我们会在检测到异常时主动向您发送安全警报。',
    tags: ['安全', '异常']
  },
  {
    id: 'faq-18',
    category: 'security',
    title: '如何删除账户？',
    content:
      '账户注销是永久性操作，请谨慎操作：\n\n1. 进入"设置 > 隐私与安全"\n2. 滚动到底部找到"注销账户"\n3. 点击后会弹出二次确认对话框\n4. 确认后账户将在30天后永久删除\n\n**注意**：删除期间可以撤销操作恢复账户。删除后所有数据将被永久清除且无法恢复。',
    tags: ['注销', '账户']
  },
  {
    id: 'faq-19',
    category: 'troubleshooting',
    title: '页面加载很慢怎么解决？',
    content:
      '页面加载慢的可能原因和解决方案：\n\n1. **检查网络连接**：确保网络稳定，尝试切换网络\n2. **清除缓存**：清除浏览器缓存和Cookie\n3. **禁用插件**：暂时禁用可能影响的浏览器扩展\n4. **更换浏览器**：尝试使用Chrome或Edge浏览器\n5. **检查服务状态**：查看公告了解是否有维护\n\n如问题持续存在，请向我们的技术团队报告具体症状。',
    tags: ['性能', '加载慢']
  },
  {
    id: 'faq-20',
    category: 'troubleshooting',
    title: '上传文件失败怎么办？',
    content:
      '文件上传失败的常见原因：\n\n- 文件大小超过限制（单文件最大100MB）\n- 文件格式不支持\n- 网络不稳定导致中断\n- 浏览器存储空间不足\n\n**解决方法**：压缩文件大小、转换格式、检查网络、清理浏览器缓存。',
    tags: ['上传', '文件']
  },
  {
    id: 'faq-21',
    category: 'troubleshooting',
    title: '消息推送收不到？',
    content:
      '如果无法收到推送通知：\n\n1. 检查浏览器是否允许网站发送通知\n2. 确认通知设置中相关类型已开启\n3. 检查免打扰时间段设置\n4. 确认系统级通知权限已授予\n5. 刷新页面后重新授权通知权限',
    tags: ['通知', '推送']
  },
  {
    id: 'faq-22',
    category: 'troubleshooting',
    title: '移动端显示异常如何处理？',
    content:
      '移动端显示问题的排查方法：\n\n1. 更新浏览器到最新版本\n2. 清除浏览器数据和缓存\n3. 尝试横屏/竖屏切换\n4. 检查系统字体设置是否正常\n5. 使用无痕模式测试是否为插件导致\n\n我们持续优化移动端体验，欢迎反馈具体问题。',
    tags: ['移动端', '适配']
  },
  {
    id: 'faq-23',
    category: 'troubleshooting',
    title: '如何报告Bug？',
    content:
      '报告Bug的渠道：\n\n1. 页面右下角"反馈建议"入口\n2. 发送邮件至 bug@example.com\n3. 在GitHub Issues提交（开源项目）\n\n**报告时请包含**：\n- 复现步骤\n- 期望结果 vs 实际结果\n- 浏览器和操作系统信息\n- 截图或录屏（如有）\n\n我们会认真对待每一条反馈！',
    tags: ['Bug', '反馈']
  },
  {
    id: 'faq-24',
    category: 'troubleshooting',
    title: '快捷键有哪些？',
    content:
      '常用快捷键一览表：\n\n| 快捷键 | 功能 |\n|--------|------|\n| Ctrl+K | 全局搜索 |\n| Ctrl+B | 切换侧边栏 |\n| Ctrl+/ | 显示快捷键帮助 |\n| Ctrl+N | 新建项目 |\n| Ctrl+S | 保存当前内容 |\n| Esc | 关闭弹窗/退出全屏 |\n| ? | 打开帮助面板 |',
    tags: ['快捷键', '效率']
  },
  {
    id: 'faq-25',
    category: 'features',
    title: '如何自定义仪表盘布局？',
    content:
      '仪表盘支持个性化布局：\n\n1. 进入总览页面\n2. 点击卡片右上角的设置图标\n3. 可以调整卡片位置（拖拽排序）\n4. 可以隐藏不需要的卡片\n5. 可以调整卡片大小\n\n布局偏好会自动保存并在各设备间同步。',
    tags: ['仪表盘', '自定义']
  },
  {
    id: 'faq-26',
    category: 'getting-started',
    title: 'API接口如何调用？',
    content:
      'API调用基本流程：\n\n1. 在设置中生成API密钥\n2. 参考API文档了解接口规范\n3. 使用密钥进行身份认证\n4. 调用所需接口获取数据\n\n我们提供完整的SDK和示例代码，支持Python、JavaScript、Java等主流语言。\n\n**注意**：请妥善保管API密钥，不要泄露给他人。',
    tags: ['API', '开发']
  },
  {
    id: 'faq-27',
    category: 'billing',
    title: '团队/企业版如何购买？',
    content:
      '企业版购买流程：\n\n1. 联系销售团队（enterprise@example.com）\n2. 说明团队规模和需求\n3. 获取定制化报价方案\n4. 签订合同并完成付款\n5. 专人协助部署和培训\n\n企业版包含：私有部署、SLA保障、专属客服、定制开发等增值服务。',
    tags: ['企业', '团队']
  },
  {
    id: 'faq-28',
    category: 'security',
    title: '备用码是什么？',
    content:
      '备用码（Recovery Codes）是在启用双因素认证时生成的一次性恢复码：\n\n- 共生成10个备用码\n- 每个码只能使用一次\n- 请妥善保存在安全的地方\n- 当无法使用常规2FA方式时可用备用码登录\n\n**重要**：使用完备用码后可以在设置中重新生成。',
    tags: ['备用码', '2FA']
  },
  {
    id: 'faq-29',
    category: 'features',
    title: '如何邀请团队成员？',
    content:
      '邀请团队成员步骤：\n\n1. 进入团队管理页面\n2. 点击"邀请成员"按钮\n3. 输入成员邮箱地址\n4. 选择角色权限（管理员/编辑者/查看者）\n5. 发送邀请链接\n\n被邀请者接受后将加入团队，您可以随时管理成员权限。',
    tags: ['团队', '协作']
  },
  {
    id: 'faq-30',
    category: 'troubleshooting',
    title: '同步失败怎么处理？',
    content:
      '数据同步失败的常见原因及解决方法：\n\n1. **网络问题**：检查网络连接，稍后重试\n2. **存储空间不足**：清理本地缓存\n3. **冲突检测**：手动选择保留哪个版本\n4. **服务端错误**：等待服务恢复或联系客服\n\n大部分同步问题可以通过重新登录解决。',
    tags: ['同步', '数据']
  }
];

export const versionInfo = {
  version: 'v3.0.0-vue3-rewrite',
  releaseDate: '2026-04-10',
  updateLog: [
    '全面重构为Vue3 + TypeScript + Composition API',
    '新增生活服务模块（日历、旅游、游戏）',
    '全新设置中心界面',
    '优化性能和用户体验',
    '修复已知问题'
  ]
};
