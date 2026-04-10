import type {
  SocialProfile,
  SocialPost,
  Friend,
  FriendRequest,
  Notification,
  MeetingRoom
} from '../types/social';

export const mockUsers: SocialProfile[] = [
  {
    id: 'user-1',
    name: '张小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    bio: '全栈开发工程师，热爱开源和技术分享',
    tags: ['技术', '开源', '摄影'],
    location: '北京',
    online: true,
    followers: 1250,
    following: 340,
    mutualFriends: 12
  },
  {
    id: 'user-2',
    name: '李雨晴',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    bio: 'UI/UX 设计师，专注于用户体验优化',
    tags: ['设计', '创意', '旅行'],
    location: '上海',
    online: true,
    followers: 890,
    following: 210,
    mutualFriends: 8
  },
  {
    id: 'user-3',
    name: '王大伟',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George',
    bio: '产品经理，10年互联网产品经验',
    tags: ['产品', '管理', '阅读'],
    location: '深圳',
    online: false,
    followers: 2340,
    following: 560,
    mutualFriends: 15
  },
  {
    id: 'user-4',
    name: '赵小芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    bio: '数据分析师，用数据驱动决策',
    tags: ['数据', '分析', '运动'],
    location: '杭州',
    online: true,
    followers: 670,
    following: 180,
    mutualFriends: 5
  },
  {
    id: 'user-5',
    name: '陈志强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    bio: 'AI 研究员，专注自然语言处理',
    tags: ['AI', '研究', '音乐'],
    location: '广州',
    online: false,
    followers: 3450,
    following: 890,
    mutualFriends: 20
  },
  {
    id: 'user-6',
    name: '刘美玲',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    bio: '独立开发者，构建有趣的应用',
    tags: ['开发', '创业', '美食'],
    location: '成都',
    online: true,
    followers: 1560,
    following: 420,
    mutualFriends: 9
  },
  {
    id: 'user-7',
    name: '周文博',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    bio: 'DevOps 工程师，云原生技术爱好者',
    tags: ['运维', '云原生', '游戏'],
    location: '南京',
    online: false,
    followers: 980,
    following: 260,
    mutualFriends: 11
  },
  {
    id: 'user-8',
    name: '吴婷婷',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rose',
    bio: '内容创作者，分享生活美学',
    tags: ['创作', '生活', '健身'],
    location: '武汉',
    online: true,
    followers: 5670,
    following: 1200,
    mutualFriends: 18
  }
];

export const mockPosts: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: '张小明',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    content:
      '今天完成了一个很有挑战性的项目，使用了 Vue3 + TypeScript + TailwindCSS 的技术栈。感觉现代前端开发越来越高效了！',
    images: [],
    likes: 45,
    comments: 12,
    shares: 5,
    timestamp: Date.now() - 3600000,
    liked: false
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: '李雨晴',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    content:
      '分享一下最近的设计作品 - 一个全新的移动端 UI 设计系统。采用了现代化的设计语言，注重用户体验和可访问性。',
    images: [],
    likes: 128,
    comments: 34,
    shares: 18,
    timestamp: Date.now() - 7200000,
    liked: true
  },
  {
    id: 'post-3',
    authorId: 'user-4',
    authorName: '赵小芳',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    content:
      '数据分析小技巧：使用 Python 的 Pandas 库处理大规模数据集时，记得使用 chunksize 参数来避免内存溢出问题。',
    images: [],
    likes: 89,
    comments: 23,
    shares: 15,
    timestamp: Date.now() - 10800000,
    liked: false
  },
  {
    id: 'post-4',
    authorId: 'user-6',
    authorName: '刘美玲',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    content:
      '作为一个独立开发者，最大的收获就是能够自由地选择技术栈和工作方式。虽然挑战很多，但每一天都充满激情！',
    images: [],
    likes: 256,
    comments: 67,
    shares: 32,
    timestamp: Date.now() - 14400000,
    liked: false
  },
  {
    id: 'post-5',
    authorId: 'user-8',
    authorName: '吴婷婷',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rose',
    content:
      '周末去了一趟成都，太喜欢这座城市了！美食、文化、慢生活的节奏让人感到放松。推荐大家有机会一定要去看看。',
    images: [],
    likes: 342,
    comments: 89,
    shares: 45,
    timestamp: Date.now() - 18000000,
    liked: true
  }
];

export const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    online: true,
    status: 'online',
    group: 'colleague'
  },
  {
    id: 'friend-2',
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
    online: false,
    status: 'offline',
    group: 'family'
  },
  {
    id: 'friend-3',
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
    online: true,
    status: 'online',
    group: 'colleague'
  },
  {
    id: 'friend-4',
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
    online: true,
    status: 'busy',
    group: 'other'
  },
  {
    id: 'friend-5',
    name: '孙七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sun',
    online: false,
    status: 'offline',
    group: 'family'
  },
  {
    id: 'friend-6',
    name: '周八',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhou',
    online: true,
    status: 'online',
    group: 'other'
  },
  {
    id: 'friend-7',
    name: '吴九',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wu',
    online: false,
    status: 'offline',
    group: 'colleague'
  },
  {
    id: 'friend-8',
    name: '郑十',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zheng',
    online: true,
    status: 'online',
    group: 'family'
  }
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'new-user-1',
    fromUserName: '新用户 A',
    fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewA',
    message: '你好，我们可以成为好友吗？',
    timestamp: Date.now() - 86400000,
    status: 'pending'
  },
  {
    id: 'req-2',
    fromUserId: 'new-user-2',
    fromUserName: '新用户 B',
    fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewB',
    message: '看到你的动态很感兴趣，想加个好友交流一下',
    timestamp: Date.now() - 172800000,
    status: 'pending'
  },
  {
    id: 'req-3',
    fromUserId: 'new-user-3',
    fromUserName: '新用户 C',
    fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewC',
    message: '我们是同一个行业的，希望能认识你',
    timestamp: Date.now() - 259200000,
    status: 'pending'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'interaction',
    title: '新的点赞',
    content: '张小明 赞了你的动态',
    timestamp: Date.now() - 300000,
    read: false,
    icon: '👍'
  },
  {
    id: 'notif-2',
    type: 'message',
    title: '新消息',
    content: '李雨晴 给你发送了一条私信',
    timestamp: Date.now() - 600000,
    read: false,
    icon: '💬'
  },
  {
    id: 'notif-3',
    type: 'system',
    title: '系统通知',
    content: '您的账户安全设置已更新',
    timestamp: Date.now() - 3600000,
    read: true,
    icon: '🔔'
  },
  {
    id: 'notif-4',
    type: 'interaction',
    title: '新的评论',
    content: '王大伟 评论了你的动态："说得太好了！"',
    timestamp: Date.now() - 7200000,
    read: false,
    icon: '💭'
  },
  {
    id: 'notif-5',
    type: 'system',
    title: '好友请求',
    content: '您有 3 个待处理的好友请求',
    timestamp: Date.now() - 86400000,
    read: true,
    icon: '👥'
  },
  {
    id: 'notif-6',
    type: 'message',
    title: '群组邀请',
    content: '赵小芳 邀请你加入"前端技术交流"群组',
    timestamp: Date.now() - 172800000,
    read: false,
    icon: '📢'
  }
];

export const mockMeetingRooms: MeetingRoom[] = [
  {
    id: 'meeting-1',
    name: '项目周会',
    hostId: 'host-1',
    hostName: '项目经理',
    participants: [
      {
        userId: 'p-1',
        userName: '张三',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P1',
        isMuted: false,
        isVideoOn: true,
        isSpeaking: true
      },
      {
        userId: 'p-2',
        userName: '李四',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P2',
        isMuted: true,
        isVideoOn: false,
        isSpeaking: false
      },
      {
        userId: 'p-3',
        userName: '王五',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=P3',
        isMuted: false,
        isVideoOn: true,
        isSpeaking: false
      }
    ],
    startTime: Date.now() - 1800000,
    duration: 1800,
    isRecording: true,
    isMuted: false,
    isVideoOn: true
  }
];
