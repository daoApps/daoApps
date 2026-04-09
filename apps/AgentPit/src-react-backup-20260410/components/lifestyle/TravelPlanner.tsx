import { useState, useMemo } from 'react'
import {
  type TravelDestination,
  type TravelItinerary,
  type Activity,
  destinations,
  hotels,
  sampleItineraries,
} from '../../data/mockLifestyle'

type TimeSlot = 'morning' | 'afternoon' | 'evening'
type TransportType = 'plane' | 'train' | 'car' | 'bus' | 'walk'

const TravelPlanner = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'destinations' | 'hotels' | 'myTrips'>('planner')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDestination, setSelectedDestination] = useState<TravelDestination | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [itinerary, setItinerary] = useState<TravelItinerary[]>(sampleItineraries)
  const [currentItinerary, setCurrentItinerary] = useState<Partial<TravelItinerary> | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)

  const filteredDestinations = useMemo(() => {
    if (!searchQuery) return destinations
    return destinations.filter(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const calculateBudget = (trip: Partial<TravelItinerary>) => {
    let total = 0
    trip.days?.forEach(day => {
      day.activities?.forEach(activity => {
        total += activity.cost + activity.transport.cost
      })
    })

    if (startDate && endDate) {
      const days = calculateDays()
      total += days * (selectedDestination?.ticketPrice || 0)
    }

    return total
  }

  const addActivityToDay = (dayIndex: number, activity: Activity) => {
    if (!currentItinerary) return

    const updatedDays = [...(currentItinerary.days || [])]
    if (!updatedDays[dayIndex]) {
      updatedDays[dayIndex] = {
        date: new Date(new Date(startDate).getTime() + dayIndex * 24 * 60 * 60 * 1000),
        activities: [],
      }
    }
    updatedDays[dayIndex].activities.push(activity)

    setCurrentItinerary({ ...currentItinerary, days: updatedDays })
  }

  const removeActivityFromDay = (dayIndex: number, activityId: string) => {
    if (!currentItinerary || !currentItinerary.days) return

    const updatedDays = [...currentItinerary.days]
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      activities: updatedDays[dayIndex].activities.filter(a => a.id !== activityId),
    }
    setCurrentItinerary({ ...currentItinerary, days: updatedDays })
  }

  const saveItinerary = () => {
    if (!currentItinerary?.title || !startDate || !endDate) return

    const newItinerary: TravelItinerary = {
      id: `trip-${Date.now()}`,
      title: currentItinerary.title,
      destination: selectedDestination?.name || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days: currentItinerary.days || [],
      totalBudget: calculateBudget(currentItinerary),
      status: 'planning',
    }

    setItinerary([...itinerary, newItinerary])
    setCurrentItinerary(null)
    setSelectedDestination(null)
    setStartDate('')
    setEndDate('')
  }

  const startNewTrip = () => {
    setCurrentItinerary({
      title: '',
      days: Array.from({ length: calculateDays() }, (_, i) => ({
        date: new Date(new Date(startDate || Date.now()).getTime() + i * 24 * 60 * 60 * 1000),
        activities: [],
      })),
    })
  }

  const getCategoryColor = (category: TravelDestination['category']) => {
    switch (category) {
      case 'nature': return 'bg-green-100 text-green-700'
      case 'culture': return 'bg-blue-100 text-blue-700'
      case 'entertainment': return 'bg-purple-100 text-purple-700'
      case 'food': return 'bg-orange-100 text-orange-700'
      case 'shopping': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case 'plane': return '✈️'
      case 'train': return '🚄'
      case 'car': return '🚗'
      case 'bus': return '🚌'
      case 'walk': return '🚶'
      default: return '📍'
    }
  }

  const getTimeSlotLabel = (slot: TimeSlot) => {
    switch (slot) {
      case 'morning': return '上午 (8:00-12:00)'
      case 'afternoon': return '下午 (13:00-17:00)'
      case 'evening': return '晚上 (18:00-22:00)'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">旅游规划</h1>
          <p className="mt-2 text-gray-600">规划您的完美旅程，让每一次出行都精彩难忘</p>
        </div>

        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'planner', label: '行程规划', icon: '📋' },
            { key: 'destinations', label: '景点推荐', icon: '🏞️' },
            { key: 'hotels', label: '住宿推荐', icon: '🏨' },
            { key: 'myTrips', label: '我的行程', icon: '📁' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                activeTab === tab.key ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!currentItinerary ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">创建新行程</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">行程名称 *</label>
                    <input
                      type="text"
                      placeholder="例如：北京文化之旅"
                      onChange={(e) => setCurrentItinerary({ ...currentItinerary!, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">出发日期 *</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">返回日期 *</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择目的地</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索城市或景点..."
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>

                    {searchQuery && (
                      <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                        {filteredDestinations.map(dest => (
                          <button
                            key={dest.id}
                            onClick={() => {
                              setSelectedDestination(dest)
                              setSearchQuery(dest.name)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                              selectedDestination?.id === dest.id ? 'bg-primary-50' : ''
                            }`}
                          >
                            <div>
                              <p className="font-medium text-gray-900">{dest.name}</p>
                              <p className="text-sm text-gray-500">{dest.city}, {dest.country}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-500">⭐ {dest.rating}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(dest.category)}`}>
                                {dest.category === 'nature' ? '自然' : dest.category === 'culture' ? '文化' : dest.category === 'entertainment' ? '娱乐' : dest.category === 'food' ? '美食' : '购物'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedDestination && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img src={selectedDestination.image} alt={selectedDestination.name} className="w-32 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{selectedDestination.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedDestination.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="text-yellow-600">⭐ {selectedDestination.rating}</span>
                            <span className="text-gray-600">⏱️ {selectedDestination.estimatedTime}</span>
                            <span className="text-green-600">💰 ¥{selectedDestination.ticketPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={startNewTrip}
                    disabled={!(currentItinerary as any)?.title || !startDate || !endDate}
                    className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    开始规划行程 ({calculateDays()} 天)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentItinerary.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(startDate).toLocaleDateString('zh-CN')} - {new Date(endDate).toLocaleDateString('zh-CN')} · {calculateDays()}天
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      📤 导出行程
                    </button>
                    <button
                      onClick={saveItinerary}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      💾 保存行程
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-{calculateDays() > 3 ? 3 : calculateDays()} gap-4">
                  {Array.from({ length: calculateDays() }, (_, dayIndex) => (
                    <div key={dayIndex} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
                        <h4 className="font-semibold text-white">
                          第{dayIndex + 1}天
                        </h4>
                        <p className="text-sm text-white/80">
                          {new Date(new Date(startDate).getTime() + dayIndex * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                        </p>
                      </div>

                      <div className="p-4 space-y-3">
                        {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map(slot => (
                          <div key={slot} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {getTimeSlotLabel(slot)}
                            </p>
                            {(currentItinerary.days?.[dayIndex]?.activities || [])
                              .filter(a => a.timeSlot === slot)
                              .map(activity => (
                                <div key={activity.id} className="flex items-start space-x-2 bg-gray-50 rounded p-2 mb-2 group">
                                  <span className="text-lg">{getTransportIcon(activity.transport.type)}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{activity.name}</p>
                                    <p className="text-xs text-gray-500">{activity.location} · {activity.duration}</p>
                                    <p className="text-xs text-green-600">¥{activity.cost}</p>
                                  </div>
                                  <button
                                    onClick={() => removeActivityFromDay(dayIndex, activity.id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            <button
                              onClick={() => {
                                const newActivity: Activity = {
                                  id: `act-${Date.now()}`,
                                  name: selectedDestination?.name || '新活动',
                                  timeSlot: slot,
                                  location: selectedDestination?.city || '',
                                  cost: selectedDestination?.ticketPrice || 0,
                                  duration: selectedDestination?.estimatedTime || '2小时',
                                  transport: { type: 'car', cost: 50, duration: '30分钟' },
                                }
                                addActivityToDay(dayIndex, newActivity)
                              }}
                              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                            >
                              + 添加活动
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">预算概算</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">交通费用</span>
                  <span className="font-semibold text-gray-900">¥{Math.round(Math.random() * 2000 + 500)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">住宿费用</span>
                  <span className="font-semibold text-gray-900">¥{calculateDays() * Math.round(Math.random() * 800 + 300)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">门票费用</span>
                  <span className="font-semibold text-gray-900">¥{(selectedDestination?.ticketPrice || 0) * calculateDays()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">餐饮费用</span>
                  <span className="font-semibold text-gray-900">¥{calculateDays() * Math.round(Math.random() * 150 + 80)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">总计预算</span>
                    <span className="text-2xl font-bold text-primary-600">¥{calculateBudget(currentItinerary || {}).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">交通方式</h3>
              <div className="grid grid-cols-5 gap-2">
                {([
                  { type: 'plane' as TransportType, icon: '✈️', label: '飞机' },
                  { type: 'train' as TransportType, icon: '🚄', label: '高铁' },
                  { type: 'car' as TransportType, icon: '🚗', label: '自驾' },
                  { type: 'bus' as TransportType, icon: '🚌', label: '公交' },
                  { type: 'walk' as TransportType, icon: '🚶', label: '步行' },
                ]).map(transport => (
                  <button
                    key={transport.type}
                    className="flex flex-col items-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
                  >
                    <span className="text-2xl">{transport.icon}</span>
                    <span className="text-xs mt-1 text-gray-600">{transport.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-2">🗺️ 地图集成</h3>
              <p className="text-sm text-gray-600 mb-3">查看景点位置和路线规划</p>
              <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-4xl mb-2">🗺️</p>
                  <p className="text-sm">地图接口预留中</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索目的地、城市或景点类型..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(destination => (
              <div key={destination.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(destination.category)}`}>
                      {destination.category === 'nature' ? '自然景观' : destination.category === 'culture' ? '文化遗产' : destination.category === 'entertainment' ? '娱乐体验' : destination.category === 'food' ? '美食探索' : '购物天堂'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">📍 {destination.city}, {destination.country}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{destination.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-yellow-600">⭐ {destination.rating}</span>
                      <span className="text-gray-500">⏱️ {destination.estimatedTime}</span>
                    </div>
                    <span className={`font-semibold ${destination.ticketPrice === 0 ? 'text-green-600' : 'text-primary-600'}`}>
                      {destination.ticketPrice === 0 ? '免费' : `¥${destination.ticketPrice}`}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDestination(destination)
                      setSearchQuery(destination.name)
                      setActiveTab('planner')
                    }}
                    className="w-full mt-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    添加到行程
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-56">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {'⭐'.repeat(hotel.stars)} {hotel.stars}星级酒店
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-sm text-gray-500 mb-3">📍 {hotel.location}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-gray-900">{hotel.rating}</span>
                    <span className="text-sm text-gray-500">({hotel.reviews.toLocaleString()}条评价)</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">¥{hotel.pricePerNight}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">每晚</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  查看详情并预订
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'myTrips' && (
        <div className="space-y-4">
          {itinerary.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-6xl mb-4">📁</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无保存的行程</h3>
              <p className="text-gray-500 mb-4">开始规划您的第一个旅行吧！</p>
              <button
                onClick={() => setActiveTab('planner')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                创建新行程
              </button>
            </div>
          ) : (
            itinerary.map(trip => (
              <div key={trip.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{trip.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                        trip.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {trip.status === 'planning' ? '规划中' : trip.status === 'confirmed' ? '已确认' : '已完成'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">📍 目的地：{trip.destination}</p>
                    <p className="text-gray-600 mb-3">
                      📅 {trip.startDate.toLocaleDateString('zh-CN')} - {trip.endDate.toLocaleDateString('zh-CN')}
                      {' · '}共{Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1}天
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-primary-600 font-semibold">💰 预算：¥{trip.totalBudget.toLocaleString()}</span>
                      <span className="text-gray-500">📋 {trip.days.length}天行程</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      编辑
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      查看
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">导出行程</h3>
            <div className="space-y-3">
              {[
                { format: 'PDF', icon: '📄', desc: '导出为PDF文档' },
                { format: '图片', icon: '🖼️', desc: '导出为图片格式' },
                { format: '分享链接', icon: '🔗', desc: '生成可分享的链接' },
              ].map(option => (
                <button
                  key={option.format}
                  onClick={() => setShowExportModal(false)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{option.format}</p>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="mt-4 w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TravelPlanner
