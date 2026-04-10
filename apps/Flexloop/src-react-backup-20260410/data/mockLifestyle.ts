export interface Meeting {
  id: string
  title: string
  startTime: Date
  endTime: Date
  participants: Participant[]
  location: string
  type: 'video' | 'offline' | 'phone'
  reminder: number
  repeatRule: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom'
  description: string
  attachments?: string[]
}

export interface Participant {
  id: string
  name: string
  avatar: string
  email?: string
}

export interface TravelDestination {
  id: string
  name: string
  city: string
  country: string
  image: string
  rating: number
  estimatedTime: string
  ticketPrice: number
  description: string
  category: 'nature' | 'culture' | 'entertainment' | 'food' | 'shopping'
}

export interface TravelItinerary {
  id: string
  title: string
  destination: string
  startDate: Date
  endDate: Date
  days: ItineraryDay[]
  totalBudget: number
  status: 'planning' | 'confirmed' | 'completed'
}

export interface ItineraryDay {
  date: Date
  activities: Activity[]
}

export interface Activity {
  id: string
  name: string
  timeSlot: 'morning' | 'afternoon' | 'evening'
  location: string
  cost: number
  duration: string
  transport: TransportType
}

export interface TransportType {
  type: 'plane' | 'train' | 'car' | 'bus' | 'walk'
  cost: number
  duration: string
}

export interface Hotel {
  id: string
  name: string
  image: string
  stars: number
  pricePerNight: number
  location: string
  amenities: string[]
  rating: number
  reviews: number
}

export interface Game {
  id: string
  title: string
  category: 'casual' | 'puzzle' | 'competitive' | 'social' | 'adventure'
  coverImage: string
  playerCount: { min: number; max: number }
  rating: number
  onlinePlayers: number
  description: string
  screenshots: string[]
  tags: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  total: number
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface LeaderboardEntry {
  rank: number
  playerName: string
  score: number
  level: number
  isFriend: boolean
  isCurrentUser: boolean
}

export const participants: Participant[] = [
  { id: '1', name: '张三', avatar: '👨', email: 'zhangsan@example.com' },
  { id: '2', name: '李四', avatar: '👩', email: 'lisi@example.com' },
  { id: '3', name: '王五', avatar: '🧑', email: 'wangwu@example.com' },
  { id: '4', name: '赵六', avatar: '👨‍💼', email: 'zhaoliu@example.com' },
  { id: '5', name: '钱七', avatar: '👩‍💼', email: 'qianqi@example.com' },
  { id: '6', name: '孙八', avatar: '🧑‍💻', email: 'sunba@example.com' },
]

const generateMeetings = (): Meeting[] => {
  const now = new Date()
  const meetings: Meeting[] = []

  for (let i = -3; i <= 14; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)

    if (Math.random() > 0.4) {
      const meetingCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < meetingCount; j++) {
        const startHour = 9 + Math.floor(Math.random() * 8)
        const duration = [1, 1.5, 2, 2.5, 3][Math.floor(Math.random() * 5)]

        meetings.push({
          id: `meeting-${i}-${j}`,
          title: ['产品需求评审会', '技术方案讨论', '周例会', '客户需求沟通', '项目进度汇报'][Math.floor(Math.random() * 5)],
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, Math.floor(Math.random() * 60)),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour + Math.floor(duration), (duration % 1) * 60),
          participants: participants.slice(0, 2 + Math.floor(Math.random() * 4)),
          location: ['会议室A', '会议室B', '线上会议', '咖啡厅', '客户办公室'][Math.floor(Math.random() * 5)],
          type: ['video', 'offline', 'phone'][Math.floor(Math.random() * 3)] as Meeting['type'],
          reminder: [15, 30, 60, 1440][Math.floor(Math.random() * 4)],
          repeatRule: ['once', 'daily', 'weekly', 'monthly', 'custom'][Math.floor(Math.random() * 5)] as Meeting['repeatRule'],
          description: '讨论项目进展和下一步计划',
        })
      }
    }
  }

  return meetings.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

export const meetings: Meeting[] = generateMeetings()

export const destinations: TravelDestination[] = [
  {
    id: 'dest-1',
    name: '故宫博物院',
    city: '北京',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
    rating: 4.9,
    estimatedTime: '4-6小时',
    ticketPrice: 60,
    description: '明清两代皇家宫殿，世界文化遗产',
    category: 'culture',
  },
  {
    id: 'dest-2',
    name: '西湖风景区',
    city: '杭州',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    rating: 4.8,
    estimatedTime: '3-5小时',
    ticketPrice: 0,
    description: '人间天堂，十大风景名胜之一',
    category: 'nature',
  },
  {
    id: 'dest-3',
    name: '外滩',
    city: '上海',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749c5bfdf3?w=400',
    rating: 4.7,
    estimatedTime: '2-3小时',
    ticketPrice: 0,
    description: '上海标志性景点，万国建筑博览群',
    category: 'culture',
  },
  {
    id: 'dest-4',
    name: '迪士尼乐园',
    city: '上海',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1563040743-2de7c6b7e4f4?w=400',
    rating: 4.6,
    estimatedTime: '全天',
    ticketPrice: 475,
    description: '亚洲最大的迪士尼主题乐园',
    category: 'entertainment',
  },
  {
    id: 'dest-5',
    name: '张家界国家森林公园',
    city: '张家界',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
    rating: 4.9,
    estimatedTime: '1-2天',
    ticketPrice: 225,
    description: '阿凡达取景地，奇峰异石',
    category: 'nature',
  },
  {
    id: 'dest-6',
    name: '宽窄巷子',
    city: '成都',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=400',
    rating: 4.5,
    estimatedTime: '2-3小时',
    ticketPrice: 0,
    description: '成都历史文化街区，美食天堂',
    category: 'food',
  },
]

export const hotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: '北京王府井希尔顿酒店',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    stars: 5,
    pricePerNight: 1288,
    location: '北京市东城区王府井大街',
    amenities: ['免费WiFi', '游泳池', '健身房', '餐厅', '停车场'],
    rating: 4.8,
    reviews: 2341,
  },
  {
    id: 'hotel-2',
    name: '杭州西湖国宾馆',
    image: 'https://images.unsplash.com/photo-1582719507464-920d4a86256f?w=400',
    stars: 5,
    pricePerNight: 1688,
    location: '杭州市西湖区杨公堤',
    amenities: ['湖景房', '免费WiFi', '餐厅', 'SPA', '花园'],
    rating: 4.9,
    reviews: 1856,
  },
  {
    id: 'hotel-3',
    name: '上海外滩华尔道夫酒店',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    stars: 5,
    pricePerNight: 2188,
    location: '上海市黄浦区中山东一路',
    amenities: ['江景房', '免费WiFi', '酒吧', '健身房', '礼宾服务'],
    rating: 4.9,
    reviews: 3421,
  },
  {
    id: 'hotel-4',
    name: '成都春熙路亚朵酒店',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    stars: 4,
    pricePerNight: 488,
    location: '成都市锦江区春熙路',
    amenities: ['免费WiFi', '洗衣房', '阅读区', '餐厅'],
    rating: 4.6,
    reviews: 1234,
  },
]

export const sampleItineraries: TravelItinerary[] = [
  {
    id: 'trip-1',
    title: '北京文化之旅',
    destination: '北京',
    startDate: new Date(2026, 4, 20),
    endDate: new Date(2026, 4, 23),
    days: [
      {
        date: new Date(2026, 4, 20),
        activities: [
          { id: 'act-1', name: '抵达北京', timeSlot: 'afternoon', location: '首都机场', cost: 500, duration: '2小时', transport: { type: 'plane', cost: 1200, duration: '2小时' } },
          { id: 'act-2', name: '入住酒店', timeSlot: 'evening', location: '王府井希尔顿', cost: 1288, duration: '30分钟', transport: { type: 'car', cost: 100, duration: '45分钟' } },
        ],
      },
      {
        date: new Date(2026, 4, 21),
        activities: [
          { id: 'act-3', name: '游览故宫', timeSlot: 'morning', location: '故宫博物院', cost: 60, duration: '4小时', transport: { type: 'subway' as any, cost: 10, duration: '40分钟' } },
          { id: 'act-4', name: '景山公园', timeSlot: 'afternoon', location: '景山公园', cost: 10, duration: '2小时', transport: { type: 'walk', cost: 0, duration: '20分钟' } },
          { id: 'act-5', name: '王府井步行街', timeSlot: 'evening', location: '王府井', cost: 200, duration: '3小时', transport: { type: 'walk', cost: 0, duration: '15分钟' } },
        ],
      },
    ],
    totalBudget: 8500,
    status: 'planning',
  },
]

export const games: Game[] = [
  {
    id: 'game-1',
    title: '数字猜谜',
    category: 'puzzle',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300',
    playerCount: { min: 1, max: 1 },
    rating: 4.5,
    onlinePlayers: 1234,
    description: '经典的猜数字游戏，考验你的逻辑思维',
    screenshots: [],
    tags: ['益智', '单人', '休闲'],
  },
  {
    id: 'game-2',
    title: '记忆翻牌大师',
    category: 'puzzle',
    coverImage: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=300',
    playerCount: { min: 1, max: 4 },
    rating: 4.7,
    onlinePlayers: 2345,
    description: '翻牌配对游戏，训练你的记忆力',
    screenshots: [],
    tags: ['记忆', '多人', '竞技'],
  },
  {
    id: 'game-3',
    title: '知识问答挑战',
    category: 'competitive',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300',
    playerCount: { min: 1, max: 10 },
    rating: 4.6,
    onlinePlayers: 3456,
    description: '涵盖多个领域的知识问答，挑战你的知识储备',
    screenshots: [],
    tags: ['问答', '知识', '竞技'],
  },
  {
    id: 'game-4',
    title: '消消乐传奇',
    category: 'casual',
    coverImage: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=300',
    playerCount: { min: 1, max: 1 },
    rating: 4.4,
    onlinePlayers: 5678,
    description: '经典的三消游戏，轻松有趣',
    screenshots: [],
    tags: ['消除', '休闲', '单人'],
  },
  {
    id: 'game-5',
    title: '冒险岛探险',
    category: 'adventure',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300',
    playerCount: { min: 1, max: 4 },
    rating: 4.8,
    onlinePlayers: 4567,
    description: '探索神秘岛屿，完成各种冒险任务',
    screenshots: [],
    tags: ['冒险', '探索', 'RPG'],
  },
  {
    id: 'game-6',
    title: '社交棋牌室',
    category: 'social',
    coverImage: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=300',
    playerCount: { min: 2, max: 6 },
    rating: 4.5,
    onlinePlayers: 6789,
    description: '与好友一起玩各种棋类和纸牌游戏',
    screenshots: [],
    tags: ['社交', '棋牌', '多人'],
  },
]

export const achievements: Achievement[] = [
  { id: 'ach-1', title: '初次见面', description: '完成第一次登录', icon: '🎉', progress: 1, total: 1, unlockedAt: new Date(), rarity: 'common' },
  { id: 'ach-2', title: '游戏达人', description: '累计游玩100局游戏', icon: '🎮', progress: 67, total: 100, rarity: 'rare' },
  { id: 'ach-3', title: '完美记忆', description: '在记忆游戏中连续答对20次', icon: '🧠', progress: 15, total: 20, rarity: 'epic' },
  { id: 'ach-4', title: '知识渊博', description: '在问答中获得满分', icon: '📚', progress: 0, total: 1, rarity: 'legendary' },
  { id: 'ach-5', title: '旅行家', description: '规划并完成5次旅行', icon: '✈️', progress: 2, total: 5, rarity: 'epic' },
  { id: 'ach-6', title: '会议达人', description: '参加50次会议', icon: '📅', progress: 32, total: 50, rarity: 'rare' },
  { id: 'ach-7', title: '社交达人', description: '添加100个好友', icon: '👥', progress: 45, total: 100, rarity: 'rare' },
  { id: 'ach-8', title: '全能选手', description: '在所有游戏类型中都获得高分', icon: '⭐', progress: 3, total: 5, rarity: 'legendary' },
]

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, playerName: '游戏大神', score: 98500, level: 45, isFriend: false, isCurrentUser: false },
  { rank: 2, playerName: '快乐玩家', score: 87200, level: 42, isFriend: true, isCurrentUser: false },
  { rank: 3, playerName: '休闲达人', score: 76300, level: 38, isFriend: true, isCurrentUser: false },
  { rank: 4, playerName: '我（当前用户）', score: 65400, level: 35, isFriend: false, isCurrentUser: true },
  { rank: 5, playerName: '新手小白', score: 54300, level: 30, isFriend: true, isCurrentUser: false },
  { rank: 6, playerName: '策略高手', score: 43200, level: 28, isFriend: false, isCurrentUser: false },
  { rank: 7, playerName: '速度之星', score: 32100, level: 25, isFriend: false, isCurrentUser: false },
  { rank: 8, playerName: '智力担当', score: 21000, level: 22, isFriend: true, isCurrentUser: false },
  { rank: 9, playerName: '幸运儿', score: 15000, level: 18, isFriend: false, isCurrentUser: false },
  { rank: 10, playerName: '萌新玩家', score: 8000, level: 12, isFriend: false, isCurrentUser: false },
]
