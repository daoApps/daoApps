import { useState } from 'react'
import MeetingCalendar from './MeetingCalendar'
import TravelPlanner from './TravelPlanner'
import GameCenter from './GameCenter'

type ActiveModule = 'dashboard' | 'calendar' | 'travel' | 'games' | 'social' | 'other'

const LifestyleDashboard = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard')

  const todayMeetings = 3
  const upcomingTrip = '北京文化之旅 (4月20日)'
  const gameProgress = 67
  const pendingTasks = 5

  const quickAccessItems = [
    { key: 'calendar' as ActiveModule, icon: '📅', label: '会议日历', color: 'from-blue-500 to-cyan-500', desc: '管理您的会议安排' },
    { key: 'travel' as ActiveModule, icon: '✈️', label: '旅游规划', color: 'from-green-500 to-emerald-500', desc: '规划完美旅程' },
    { key: 'games' as ActiveModule, icon: '🎮', label: '游戏中心', color: 'from-purple-500 to-pink-500', desc: '休闲娱乐时光' },
    { key: 'social' as ActiveModule, icon: '👥', label: '约友聚会', color: 'from-orange-500 to-red-500', desc: '组织社交活动' },
    { key: 'other' as ActiveModule, icon: '🔧', label: '更多服务', color: 'from-gray-500 to-gray-600', desc: '探索更多功能' },
  ]

  const activityFeed = [
    {
      id: 1,
      type: 'meeting',
      title: '产品需求评审会',
      time: '10分钟前',
      message: '会议已开始，请准时参加',
      icon: '📅',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      type: 'game',
      title: '成就解锁',
      time: '1小时前',
      message: '恭喜您获得"游戏达人"成就进度 +5%',
      icon: '🏆',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 3,
      type: 'travel',
      title: '行程提醒',
      time: '2小时前',
      message: '您的北京之旅将在7天后开始',
      icon: '✈️',
      color: 'bg-green-100 text-green-700',
    },
    {
      id: 4,
      type: 'system',
      title: '系统通知',
      time: '3小时前',
      message: '新功能上线：智能日程推荐',
      icon: '🔔',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 5,
      type: 'social',
      title: '好友动态',
      time: '5小时前',
      message: '张三邀请您参加周末聚会',
      icon: '👥',
      color: 'bg-orange-100 text-orange-700',
    },
  ]

  const timelineEvents = [
    {
      time: '09:00',
      type: 'meeting',
      title: '团队晨会',
      location: '会议室A',
      duration: '30分钟',
    },
    {
      time: '10:00',
      type: 'task',
      title: '完成项目报告',
      location: '',
      duration: '2小时',
    },
    {
      time: '14:00',
      type: 'meeting',
      title: '客户需求沟通',
      location: '线上会议',
      duration: '1.5小时',
    },
    {
      time: '16:00',
      type: 'personal',
      title: '健身锻炼',
      location: '健身房',
      duration: '1小时',
    },
    {
      time: '19:00',
      type: 'social',
      title: '朋友聚餐',
      location: '某某餐厅',
      duration: '2小时',
    },
  ]

  if (activeModule === 'calendar') return <MeetingCalendar />
  if (activeModule === 'travel') return <TravelPlanner />
  if (activeModule === 'games') return <GameCenter />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">生活服务</h1>
        <p className="mt-2 text-gray-600">一站式生活服务平台，让您的每一天都井然有序</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📅</div>
            <span className="text-sm opacity-90">今日</span>
          </div>
          <p className="text-3xl font-bold">{todayMeetings}</p>
          <p className="text-sm opacity-90 mt-1">场会议</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">✈️</div>
            <span className="text-sm opacity-90">即将到来</span>
          </div>
          <p className="text-lg font-bold truncate">{upcomingTrip.split(' ')[0]}</p>
          <p className="text-sm opacity-90 mt-1 truncate">{upcomingTrip.split(' ').slice(1).join(' ')}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🎮</div>
            <span className="text-sm opacity-90">游戏成就</span>
          </div>
          <p className="text-3xl font-bold">{gameProgress}%</p>
          <div className="w-full bg-white/30 rounded-full h-2 mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${gameProgress}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📋</div>
            <span className="text-sm opacity-90">待办事项</span>
          </div>
          <p className="text-3xl font-bold">{pendingTasks}</p>
          <p className="text-sm opacity-90 mt-1">项任务</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickAccessItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveModule(item.key)}
            className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1 group`}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="font-bold text-lg mb-1">{item.label}</h3>
            <p className="text-xs opacity-80">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">📰 动态信息流</h3>
            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">查看全部 →</button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {activityFeed.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span>{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">⏰ 个人日程时间线</h3>
            <span className="text-sm text-gray-500">今天</span>
          </div>
          <div className="relative max-h-[400px] overflow-y-auto">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex items-start space-x-4 pl-8">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                    event.type === 'meeting' ? 'border-blue-500 bg-blue-500' :
                    event.type === 'task' ? 'border-green-500 bg-green-500' :
                    event.type === 'social' ? 'border-orange-500 bg-orange-500' :
                    'border-purple-500 bg-purple-500'
                  }`} />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-0.5">📍 {event.location}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-sm font-semibold text-gray-700">{event.time}</p>
                        <p className="text-xs text-gray-400">{event.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeModule !== 'dashboard' && !['calendar', 'travel', 'games'].includes(activeModule) && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-6xl mb-4">🚧</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">功能开发中</h3>
          <p className="text-gray-500 mb-4">该功能正在紧张开发中，敬请期待！</p>
          <button
            onClick={() => setActiveModule('dashboard')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      )}
    </div>
  )
}

export default LifestyleDashboard
