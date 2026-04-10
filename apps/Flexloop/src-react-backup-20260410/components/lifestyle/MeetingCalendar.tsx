import { useState, useMemo } from 'react'
import { type Meeting, type Participant, meetings, participants } from '../../data/mockLifestyle'

type ViewMode = 'month' | 'week' | 'day'

const MeetingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [meetingList, setMeetingList] = useState<Meeting[]>(meetings)
  const [searchQuery, setSearchQuery] = useState('')

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'offline' as Meeting['type'],
    reminder: 15,
    repeatRule: 'once' as Meeting['repeatRule'],
    description: '',
    selectedParticipants: [] as Participant[],
  })

  const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六']
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getMeetingsForDate = (date: Date): Meeting[] => {
    return meetingList.filter(meeting => {
      const meetingDate = new Date(meeting.startTime)
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getWeekDates = (date: Date): Date[] => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      return d
    })
  }

  const getTodayMeetings = (): Meeting[] => {
    const today = new Date()
    return meetingList.filter(meeting => {
      const meetingDate = new Date(meeting.startTime)
      return (
        meetingDate.getDate() === today.getDate() &&
        meetingDate.getMonth() === today.getMonth() &&
        meetingDate.getFullYear() === today.getFullYear() && meetingDate >= today
      )
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  }

  const getUpcomingMeetings = (): Meeting[] => {
    const now = new Date()
    return meetingList
      .filter(m => m.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5)
  }

  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return participants
    return participants.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.startTime || !newMeeting.endTime) return

    const meeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: newMeeting.title,
      startTime: new Date(newMeeting.startTime),
      endTime: new Date(newMeeting.endTime),
      participants: newMeeting.selectedParticipants,
      location: newMeeting.location,
      type: newMeeting.type,
      reminder: newMeeting.reminder,
      repeatRule: newMeeting.repeatRule,
      description: newMeeting.description,
    }

    setMeetingList([...meetingList, meeting])
    setShowCreateModal(false)
    setNewMeeting({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      type: 'offline',
      reminder: 15,
      repeatRule: 'once',
      description: '',
      selectedParticipants: [],
    })
  }

  const getMeetingColor = (type: Meeting['type']) => {
    switch (type) {
      case 'video': return 'bg-blue-500'
      case 'offline': return 'bg-green-500'
      case 'phone': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const next = new Date(prev)
      next.setMonth(next.getMonth() + direction)
      return next
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {showSidebar && (
        <div className="w-80 bg-white rounded-lg shadow p-4 flex flex-col space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">会议列表</h3>
            <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">即将开始</h4>
            {getUpcomingMeetings().slice(0, 3).map(meeting => (
              <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => setSelectedDate(new Date(meeting.startTime))}>
                <div className={`w-2 h-2 rounded-full ${getMeetingColor(meeting.type)} mb-2`} />
                <p className="font-medium text-sm text-gray-900 truncate">{meeting.title}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">今日会议</h4>
            {getTodayMeetings().length > 0 ? getTodayMeetings().map(meeting => (
              <div key={meeting.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:border-blue-300 transition-colors">
                <div className={`w-2 h-2 rounded-full ${getMeetingColor(meeting.type)} mb-2`} />
                <p className="font-medium text-sm text-gray-900 truncate">{meeting.title}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</p>
                <p className="text-xs text-gray-500 mt-1">{meeting.location}</p>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">今天没有会议</p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">即将到来</h4>
            {getUpcomingMeetings().slice(3).map(meeting => (
              <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => setSelectedDate(new Date(meeting.startTime))}>
                <p className="font-medium text-sm text-gray-900 truncate">{meeting.title}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(meeting.startTime).toLocaleDateString('zh-CN')}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-auto w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            + 创建新会议
          </button>
        </div>
      )}

      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed left-4 top-32 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          ☰
        </button>
      )}

      <div className="flex-1 bg-white rounded-lg shadow p-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">←</button>
              <button onClick={goToToday} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">今天</button>
              <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">→</button>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode === 'month' ? '月' : mode === 'week' ? '周' : '日'}
              </button>
            ))}
          </div>

          {!showSidebar && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              + 新建会议
            </button>
          )}
        </div>

        {viewMode === 'month' && (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-7 gap-px bg-gray-200 min-h-[500px]">
              {daysOfWeek.map(day => (
                <div key={day} className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((date, index) => {
                if (!date) return <div key={`empty-${index}`} className="bg-gray-50 min-h-[100px]" />

                const dayMeetings = getMeetingsForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate?.toDateString() === date.toDateString()

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`bg-white min-h-[100px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? 'bg-blue-50' : ''
                    } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayMeetings.slice(0, 3).map(meeting => (
                        <div
                          key={meeting.id}
                          className={`${getMeetingColor(meeting.type)} text-white text-xs px-2 py-1 rounded truncate`}
                        >
                          {formatTime(meeting.startTime)} {meeting.title}
                        </div>
                      ))}
                      {dayMeetings.length > 3 && (
                        <div className="text-xs text-gray-500 pl-2">+{dayMeetings.length - 3} 更多</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-8 gap-px bg-gray-200 min-h-[500px]">
              <div className="bg-gray-50" />
              {getWeekDates(currentDate).map((date, index) => (
                <div key={index} className="bg-gray-50 p-3 text-center">
                  <div className="text-xs text-gray-500">{daysOfWeek[date.getDay()]}</div>
                  <div className={`text-lg font-semibold mt-1 ${date.toDateString() === new Date().toDateString() ? 'text-primary-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}

              {Array.from({ length: 24 }, (_, hour) => (
                <>
                  <div key={`time-${hour}`} className="bg-white p-2 text-xs text-gray-500 text-right pr-4">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {getWeekDates(currentDate).map((date, dayIndex) => {
                    const hourMeetings = getMeetingsForDate(date).filter(m => {
                      const mHour = m.startTime.getHours()
                      return mHour === hour || mHour === hour - 1
                    })

                    return (
                      <div key={`${hour}-${dayIndex}`} className="bg-white min-h-[60px] p-1 relative">
                        {hourMeetings.slice(0, 2).map(meeting => (
                          <div
                            key={meeting.id}
                            className={`${getMeetingColor(meeting.type)} text-white text-xs px-2 py-1 rounded mb-1 truncate cursor-pointer hover:opacity-90`}
                          >
                            {meeting.title}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'day' && (
          <div className="flex-1 overflow-auto">
            <div className="mb-4 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedDate?.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || currentDate.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-px bg-gray-200">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="bg-white flex min-h-[60px]">
                  <div className="w-20 p-2 text-xs text-gray-500 text-right pr-4 flex-shrink-0">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 p-1 relative border-l border-gray-200">
                    {(selectedDate ? getMeetingsForDate(selectedDate) : getMeetingsForDate(currentDate))
                      .filter(m => m.startTime.getHours() === hour)
                      .map(meeting => (
                        <div
                          key={meeting.id}
                          className={`${getMeetingColor(meeting.type)} text-white p-3 rounded-lg mb-1 cursor-pointer hover:opacity-90`}
                        >
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm opacity-90">{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</p>
                          <p className="text-sm opacity-75">{meeting.location}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">创建新会议</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会议主题 *</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="输入会议主题"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">开始时间 *</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">结束时间 *</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">参与者</label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索用户..."
                    className="w-full px-2 py-1 mb-2 border-b border-gray-200 focus:outline-none"
                  />
                  {filteredParticipants.map(participant => (
                    <label key={participant.id} className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.selectedParticipants.some(p => p.id === participant.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewMeeting({
                              ...newMeeting,
                              selectedParticipants: [...newMeeting.selectedParticipants, participant],
                            })
                          } else {
                            setNewMeeting({
                              ...newMeeting,
                              selectedParticipants: newMeeting.selectedParticipants.filter(p => p.id !== participant.id),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <span>{participant.avatar} {participant.name}</span>
                      {participant.email && <span className="text-xs text-gray-500">({participant.email})</span>}
                    </label>
                  ))}
                </div>
                {newMeeting.selectedParticipants.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newMeeting.selectedParticipants.map(p => (
                      <span key={p.id} className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {p.avatar} {p.name}
                        <button
                          onClick={() => setNewMeeting({
                            ...newMeeting,
                            selectedParticipants: newMeeting.selectedParticipants.filter(sp => sp.id !== p.id),
                          })}
                          className="ml-1 hover:text-primary-900"
                        >✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地点</label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  placeholder="输入会议地点或线上链接"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会议类型</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'video', label: '视频会议', icon: '📹' },
                    { value: 'offline', label: '线下会议', icon: '🏢' },
                    { value: 'phone', label: '电话会议', icon: '📞' },
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setNewMeeting({ ...newMeeting, type: type.value as Meeting['type'] })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newMeeting.type === type.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <p className="text-sm font-medium mt-1">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">提醒设置</label>
                  <select
                    value={newMeeting.reminder}
                    onChange={(e) => setNewMeeting({ ...newMeeting, reminder: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={15}>提前15分钟</option>
                    <option value={30}>提前30分钟</option>
                    <option value={60}>提前1小时</option>
                    <option value={1440}>提前1天</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">重复规则</label>
                  <select
                    value={newMeeting.repeatRule}
                    onChange={(e) => setNewMeeting({ ...newMeeting, repeatRule: e.target.value as Meeting['repeatRule'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="once">一次性</option>
                    <option value="daily">每天</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会议描述</label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  placeholder="输入会议详细描述..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateMeeting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                创建会议
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingCalendar
