export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: Participant[];
  location: string;
  type: 'work' | 'personal' | 'important' | 'recurring';
  notes: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export interface TravelDestination {
  id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  rating: number;
  description: string;
  tags: string[];
  category: 'nature' | 'culture' | 'entertainment' | 'food' | 'shopping';
  estimatedCost: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  notes: string;
  cost?: number;
}

export interface TravelPlan {
  id: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  totalCost: number;
  isFavorite: boolean;
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
}

export interface LifeTip {
  id: string;
  content: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'learning' | 'life';
  icon: string;
}

export interface GameRecord {
  gameType: 'snake' | 'tetris' | '2048';
  score: number;
  date: string;
  duration: number;
}

export interface WeeklyActivity {
  day: string;
  meetings: number;
  travel: number;
  games: number;
  todos: number;
}

export const participants: Participant[] = [
  { id: '1', name: '张三', avatar: '👨', email: 'zhangsan@example.com' },
  { id: '2', name: '李四', avatar: '👩', email: 'lisi@example.com' },
  { id: '3', name: '王五', avatar: '🧑', email: 'wangwu@example.com' },
  { id: '4', name: '赵六', avatar: '👨‍💼', email: 'zhaoliu@example.com' },
  { id: '5', name: '孙七', avatar: '👩‍💻', email: 'sunqi@example.com' }
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

function generateDate(day: number): string {
  return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const meetings: Meeting[] = [
  {
    id: 'm1',
    title: '产品需求评审会议',
    date: generateDate(Math.max(1, now.getDate() - 2)),
    startTime: '09:00',
    endTime: '10:30',
    participants: [participants[0]!, participants[1]!, participants[3]!],
    location: '会议室A',
    type: 'work',
    notes: '讨论Q2产品路线图'
  },
  {
    id: 'm2',
    title: '技术方案讨论',
    date: generateDate(Math.max(1, now.getDate() - 1)),
    startTime: '14:00',
    endTime: '15:30',
    participants: [participants[2]!, participants[4]!],
    location: '线上会议',
    type: 'work',
    notes: '架构设计评审'
  },
  {
    id: 'm3',
    title: '团队周会',
    date: generateDate(now.getDate()),
    startTime: '10:00',
    endTime: '11:00',
    participants: [
      participants[0]!,
      participants[1]!,
      participants[2]!,
      participants[3]!,
      participants[4]!
    ],
    location: '会议室B',
    type: 'recurring',
    notes: '每周例行周会'
  },
  {
    id: 'm4',
    title: '客户演示准备',
    date: generateDate(now.getDate()),
    startTime: '15:00',
    endTime: '16:30',
    participants: [participants[0]!, participants[3]!],
    location: '演示厅',
    type: 'important',
    notes: '重要客户来访，需要充分准备'
  },
  {
    id: 'm5',
    title: '一对一沟通',
    date: generateDate(now.getDate() + 1),
    startTime: '11:00',
    endTime: '11:30',
    participants: [participants[1]!],
    location: '咖啡厅',
    type: 'personal',
    notes: '职业发展规划交流'
  },
  {
    id: 'm6',
    title: '项目进度汇报',
    date: generateDate(now.getDate() + 2),
    startTime: '09:30',
    endTime: '10:30',
    participants: [participants[0]!, participants[2]!, participants[4]!],
    location: '会议室A',
    type: 'work',
    notes: 'Sprint回顾与规划'
  },
  {
    id: 'm7',
    title: '设计评审',
    date: generateDate(now.getDate() + 3),
    startTime: '14:00',
    endTime: '15:00',
    participants: [participants[1]!, participants[4]!],
    location: '设计室',
    type: 'work',
    notes: '新版UI设计稿评审'
  },
  {
    id: 'm8',
    title: '季度OKR对齐',
    date: generateDate(now.getDate() + 4),
    startTime: '10:00',
    endTime: '12:00',
    participants: [participants[0]!, participants[1]!, participants[2]!, participants[3]!],
    location: '大会议室',
    type: 'important',
    notes: 'Q2目标对齐会议'
  },
  {
    id: 'm9',
    title: '代码审查会议',
    date: generateDate(now.getDate() + 5),
    startTime: '16:00',
    endTime: '17:00',
    participants: [participants[2]!, participants[4]!],
    location: '线上会议',
    type: 'work',
    notes: '核心模块代码审查'
  },
  {
    id: 'm10',
    title: '健身预约',
    date: generateDate(now.getDate() + 6),
    startTime: '18:30',
    endTime: '20:00',
    participants: [],
    location: '健身房',
    type: 'personal',
    notes: '每周固定健身时间'
  },
  {
    id: 'm11',
    title: '新员工培训',
    date: generateDate(now.getDate() + 7),
    startTime: '09:00',
    endTime: '12:00',
    participants: [participants[0]!, participants[1]!, participants[3]!],
    location: '培训室',
    type: 'recurring',
    notes: '新入职员工入职培训'
  },
  {
    id: 'm12',
    title: '午餐聚会',
    date: generateDate(now.getDate() + 8),
    startTime: '12:00',
    endTime: '13:30',
    participants: [participants[0]!, participants[1]!, participants[2]!, participants[4]!],
    location: '餐厅',
    type: 'personal',
    notes: '团队建设活动'
  },
  {
    id: 'm13',
    title: '安全审计会议',
    date: generateDate(now.getDate() + 9),
    startTime: '15:00',
    endTime: '16:30',
    participants: [participants[3]!, participants[4]!],
    location: '安全室',
    type: 'important',
    notes: '季度安全合规审查'
  },
  {
    id: 'm14',
    title: '用户调研反馈',
    date: generateDate(now.getDate() + 10),
    startTime: '10:00',
    endTime: '11:30',
    participants: [participants[1]!, participants[2]!],
    location: '会议室C',
    type: 'work',
    notes: '分析用户反馈数据'
  },
  {
    id: 'm15',
    title: '年度总结筹备',
    date: generateDate(now.getDate() + 12),
    startTime: '14:00',
    endTime: '17:00',
    participants: [
      participants[0]!,
      participants[1]!,
      participants[2]!,
      participants[3]!,
      participants[4]!
    ],
    location: '大会议室',
    type: 'important',
    notes: '年度工作总结材料准备'
  },
  {
    id: 'm16',
    title: '技术分享会',
    date: generateDate(now.getDate() + 14),
    startTime: '16:00',
    endTime: '17:30',
    participants: [participants[2]!, participants[4]!],
    location: '技术部',
    type: 'work',
    notes: 'Vue3最佳实践分享'
  },
  {
    id: 'm17',
    title: '预算审批',
    date: generateDate(now.getDate() + 15),
    startTime: '09:00',
    endTime: '10:00',
    participants: [participants[0]!, participants[3]!],
    location: '财务室',
    type: 'work',
    notes: 'Q2预算申请审批'
  },
  {
    id: 'm18',
    title: '家庭视频通话',
    date: generateDate(now.getDate() + 16),
    startTime: '19:00',
    endTime: '20:00',
    participants: [],
    location: '家中',
    type: 'personal',
    notes: '与家人定期联系'
  }
];

export const destinations: TravelDestination[] = [
  {
    id: 'dest-1',
    name: '故宫博物院',
    city: '北京',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
    rating: 4.9,
    description: '明清两代皇家宫殿，世界文化遗产',
    tags: ['历史', '文化', '世界遗产'],
    category: 'culture',
    estimatedCost: 200
  },
  {
    id: 'dest-2',
    name: '西湖风景区',
    city: '杭州',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    rating: 4.8,
    description: '人间天堂，十大风景名胜之一',
    tags: ['自然', '湖泊', '免费'],
    category: 'nature',
    estimatedCost: 100
  },
  {
    id: 'dest-3',
    name: '外滩',
    city: '上海',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b608527?w=400',
    rating: 4.7,
    description: '东方明珠，国际大都市地标',
    tags: ['城市', '夜景', '购物'],
    category: 'entertainment',
    estimatedCost: 300
  },
  {
    id: 'dest-4',
    name: '成都宽窄巷子',
    city: '成都',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400',
    rating: 4.6,
    description: '体验老成都的慢生活，品尝地道美食',
    tags: ['美食', '文化', '休闲'],
    category: 'food',
    estimatedCost: 250
  },
  {
    id: 'dest-5',
    name: '张家界国家森林公园',
    city: '张家界',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1513415564515-767d39dfb583?w=400',
    rating: 4.9,
    description: '阿凡达取景地，奇峰异石仙境',
    tags: ['自然', '登山', '摄影'],
    category: 'nature',
    estimatedCost: 500
  },
  {
    id: 'dest-6',
    name: '西安兵马俑',
    city: '西安',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1529921879218-f99546d03a32?w=400',
    rating: 4.8,
    description: '世界第八大奇迹，秦代军事文化瑰宝',
    tags: ['历史', '文化', '世界遗产'],
    category: 'culture',
    estimatedCost: 280
  },
  {
    id: 'dest-7',
    name: '三亚亚龙湾',
    city: '三亚',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    rating: 4.7,
    description: '天下第一湾，热带海滨度假胜地',
    tags: ['海滩', '度假', '潜水'],
    category: 'nature',
    estimatedCost: 800
  },
  {
    id: 'dest-8',
    name: '重庆洪崖洞',
    city: '重庆',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400',
    rating: 4.5,
    description: '现实版千与千寻，山城夜景绝美',
    tags: ['夜景', '美食', '网红'],
    category: 'entertainment',
    estimatedCost: 200
  },
  {
    id: 'dest-9',
    name: '丽江古城',
    city: '丽江',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1528795953040-56a828a59bbc?w=400',
    rating: 4.6,
    description: '纳西族古城，浪漫邂逅之地',
    tags: ['古镇', '浪漫', '文艺'],
    category: 'culture',
    estimatedCost: 350
  },
  {
    id: 'dest-10',
    name: '广州长隆欢乐世界',
    city: '广州',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    rating: 4.4,
    description: '大型主题乐园，适合全家游玩',
    tags: ['乐园', '亲子', '刺激'],
    category: 'entertainment',
    estimatedCost: 450
  }
];

export const sampleItineraries: TravelPlan[] = [
  {
    id: 'plan-1',
    destinationId: 'dest-1',
    destinationName: '北京三日游',
    startDate: generateDate(now.getDate() + 20),
    endDate: generateDate(now.getDate() + 22),
    days: [
      {
        day: 1,
        date: generateDate(now.getDate() + 20),
        activities: [
          {
            id: 'a1',
            time: '08:00',
            title: '抵达北京',
            location: '北京南站',
            notes: '乘坐高铁G102',
            cost: 553
          },
          {
            id: 'a2',
            time: '10:00',
            title: '办理入住',
            location: '王府井酒店',
            notes: '放下行李稍作休息',
            cost: 600
          },
          {
            id: 'a3',
            time: '13:00',
            title: '午餐',
            location: '全聚德烤鸭店',
            notes: '品尝正宗北京烤鸭',
            cost: 200
          },
          {
            id: 'a4',
            time: '15:00',
            title: '游览天安门广场',
            location: '天安门',
            notes: '参观人民英雄纪念碑',
            cost: 0
          },
          {
            id: 'a5',
            time: '18:00',
            title: '晚餐',
            location: '簋街',
            notes: '品尝北京小吃',
            cost: 100
          }
        ]
      },
      {
        day: 2,
        date: generateDate(now.getDate() + 21),
        activities: [
          {
            id: 'a6',
            time: '08:30',
            title: '游览故宫博物院',
            location: '故宫',
            notes: '提前网上购票，建议请导游',
            cost: 60
          },
          {
            id: 'a7',
            time: '12:00',
            title: '午餐',
            location: '故宫角楼咖啡',
            notes: '网红打卡点',
            cost: 80
          },
          {
            id: 'a8',
            time: '14:00',
            title: '景山公园',
            location: '景山公园',
            notes: '俯瞰故宫全景',
            cost: 10
          },
          {
            id: 'a9',
            time: '16:00',
            title: '南锣鼓巷',
            location: '南锣鼓巷',
            notes: '逛胡同、买纪念品',
            cost: 150
          },
          {
            id: 'a10',
            time: '19:00',
            title: '观看京剧表演',
            location: '长安大戏院',
            notes: '提前预订座位',
            cost: 280
          }
        ]
      },
      {
        day: 3,
        date: generateDate(now.getDate() + 22),
        activities: [
          {
            id: 'a11',
            time: '08:00',
            title: '长城一日游',
            location: '八达岭长城',
            notes: '建议早出发避开人流',
            cost: 120
          },
          {
            id: 'a12',
            time: '13:00',
            title: '午餐',
            location: '长城脚下农家乐',
            notes: '品尝虹鳟鱼',
            cost: 120
          },
          {
            id: 'a13',
            time: '15:30',
            title: '返回市区',
            location: '鸟巢/水立方',
            notes: '外观拍照留念',
            cost: 0
          },
          {
            id: 'a14',
            time: '18:00',
            title: '返程',
            location: '北京南站',
            notes: '乘坐高铁返回',
            cost: 553
          }
        ]
      }
    ],
    totalCost: 2838,
    isFavorite: true
  }
];

export const todoItems: TodoItem[] = [
  {
    id: 't1',
    title: '完成Q2产品文档',
    completed: false,
    priority: 'high',
    dueDate: generateDate(now.getDate() + 1),
    category: '工作'
  },
  {
    id: 't2',
    title: '回复客户邮件',
    completed: true,
    priority: 'high',
    dueDate: generateDate(now.getDate()),
    category: '工作'
  },
  {
    id: 't3',
    title: '健身锻炼',
    completed: false,
    priority: 'medium',
    dueDate: generateDate(now.getDate()),
    category: '健康'
  },
  {
    id: 't4',
    title: '阅读《深入理解Vue3》',
    completed: false,
    priority: 'low',
    dueDate: generateDate(now.getDate() + 3),
    category: '学习'
  },
  {
    id: 't5',
    title: '缴纳水电费',
    completed: false,
    priority: 'medium',
    dueDate: generateDate(now.getDate() + 2),
    category: '生活'
  },
  {
    id: 't6',
    title: '整理旅行照片',
    completed: false,
    priority: 'low',
    dueDate: generateDate(now.getDate() + 5),
    category: '生活'
  },
  {
    id: 't7',
    title: '准备周会PPT',
    completed: false,
    priority: 'high',
    dueDate: generateDate(now.getDate() + 1),
    category: '工作'
  },
  {
    id: 't8',
    title: '购买生日礼物',
    completed: false,
    priority: 'medium',
    dueDate: generateDate(now.getDate() + 4),
    category: '生活'
  },
  {
    id: 't9',
    title: '学习TypeScript高级类型',
    completed: false,
    priority: 'medium',
    dueDate: generateDate(now.getDate() + 7),
    category: '学习'
  },
  {
    id: 't10',
    title: '预约牙医检查',
    completed: false,
    priority: 'low',
    dueDate: generateDate(now.getDate() + 10),
    category: '健康'
  }
];

export const lifeTips: LifeTip[] = [
  {
    id: 'tip-1',
    content: '每天保持7-8小时睡眠，有助于提高工作效率和免疫力',
    category: 'health',
    icon: '😴'
  },
  {
    id: 'tip-2',
    content: '使用番茄工作法：25分钟专注工作+5分钟休息',
    category: 'productivity',
    icon: '⏰'
  },
  {
    id: 'tip-3',
    content: '每天花10分钟冥想，可以有效减轻压力和焦虑',
    category: 'mindfulness',
    icon: '🧘'
  },
  {
    id: 'tip-4',
    content: '主动与朋友保持联系，社交是幸福感的重要来源',
    category: 'social',
    icon: '💬'
  },
  {
    id: 'tip-5',
    content: '每天学习一个新知识或技能，保持大脑活跃',
    category: 'learning',
    icon: '📚'
  },
  {
    id: 'tip-6',
    content: '多喝水！建议每天至少饮用8杯水（约2升）',
    category: 'health',
    icon: '💧'
  },
  {
    id: 'tip-7',
    content: '将大任务分解为小步骤，更容易开始和完成',
    category: 'productivity',
    icon: '✅'
  },
  {
    id: 'tip-8',
    content: '练习感恩日记，每天记录3件值得感恩的事',
    category: 'mindfulness',
    icon: '🙏'
  },
  {
    id: 'tip-9',
    content: '定期断舍离，清理不需要的物品和数字文件',
    category: 'productivity',
    icon: '🗑️'
  },
  { id: 'tip-10', content: '尝试新的运动方式，如瑜伽、游泳或骑行', category: 'health', icon: '🏃' },
  {
    id: 'tip-11',
    content: '设定SMART目标：具体、可衡量、可实现、相关、有时限',
    category: 'productivity',
    icon: '🎯'
  },
  {
    id: 'tip-12',
    content: '减少社交媒体使用时间，专注于真实的人际交往',
    category: 'social',
    icon: '📱'
  },
  {
    id: 'tip-13',
    content: '阅读纸质书籍比电子屏幕更有助于深度思考',
    category: 'learning',
    icon: '📖'
  },
  { id: 'tip-14', content: '保持良好的坐姿，每小时起身活动5分钟', category: 'health', icon: '🪑' },
  {
    id: 'tip-15',
    content: '学会说"不"，保护自己的时间和精力边界',
    category: 'mindfulness',
    icon: '🛑'
  },
  { id: 'tip-16', content: '尝试做一道新菜，烹饪是很好的放松方式', category: 'life', icon: '🍳' },
  {
    id: 'tip-17',
    content: '建立晨间仪式感，让一天有个美好的开始',
    category: 'mindfulness',
    icon: '🌅'
  },
  { id: 'tip-18', content: '定期备份重要数据，避免意外丢失', category: 'productivity', icon: '💾' },
  { id: 'tip-19', content: '培养一项兴趣爱好，让生活更加丰富多彩', category: 'life', icon: '🎨' },
  {
    id: 'tip-20',
    content: '户外散步可以提升创造力和解决问题的能力',
    category: 'health',
    icon: '🌳'
  },
  {
    id: 'tip-21',
    content: '使用艾森豪威尔矩阵区分任务的紧急和重要性',
    category: 'productivity',
    icon: '📊'
  },
  {
    id: 'tip-22',
    content: '给植物浇水并观察它的成长，这是一种治愈的体验',
    category: 'mindfulness',
    icon: '🌱'
  },
  {
    id: 'tip-23',
    content: '参加社区活动或志愿者服务，增加社会归属感',
    category: 'social',
    icon: '🤝'
  },
  { id: 'tip-24', content: '学习一门外语，即使每天只学15分钟', category: 'learning', icon: '🌍' },
  {
    id: 'tip-25',
    content: '保持规律的作息时间，周末也不要过度熬夜',
    category: 'health',
    icon: '🕐'
  },
  {
    id: 'tip-26',
    content: '用思维导图整理复杂信息，更直观地理解问题',
    category: 'learning',
    icon: '🧠'
  },
  {
    id: 'tip-27',
    content: '定期整理邮箱和聊天记录，删除无用信息',
    category: 'productivity',
    icon: '📧'
  },
  {
    id: 'tip-28',
    content: '尝试正念呼吸练习：吸气4秒-屏息4秒-呼气4秒',
    category: 'mindfulness',
    icon: '🌬️'
  },
  { id: 'tip-29', content: '与不同领域的人交流，拓展视野和人脉', category: 'social', icon: '👥' },
  {
    id: 'tip-30',
    content: '记录生活中的小确幸，它们是幸福的基石',
    category: 'mindfulness',
    icon: '✨'
  }
];

export const weeklyActivities: WeeklyActivity[] = [
  { day: '周一', meetings: 3, travel: 0, games: 1, todos: 5 },
  { day: '周二', meetings: 2, travel: 0, games: 0, todos: 3 },
  { day: '周三', meetings: 4, travel: 0, games: 2, todos: 4 },
  { day: '周四', meetings: 2, travel: 1, games: 0, todos: 6 },
  { day: '周五', meetings: 3, travel: 0, games: 1, todos: 4 },
  { day: '周六', meetings: 0, travel: 1, games: 3, todos: 2 },
  { day: '周日', meetings: 1, travel: 0, games: 2, todos: 3 }
];

export const meetingTypeColors: Record<string, string> = {
  work: '#3b82f6',
  personal: '#10b981',
  important: '#ef4444',
  recurring: '#8b5cf6'
};

export function getTodayTip(): LifeTip {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return lifeTips[dayOfYear % lifeTips.length]!;
}
