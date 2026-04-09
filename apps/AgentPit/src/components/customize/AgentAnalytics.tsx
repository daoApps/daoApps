import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { analyticsData, sampleAgents } from '../../data/mockCustomize'

interface AgentAnalyticsProps {
  agentId?: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const AgentAnalytics = ({ agentId }: AgentAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'conversations'>('overview')

  const agent = sampleAgents.find(a => a.id === agentId)
  const data = analyticsData

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">📊</span>
            智能体数据分析
          </h1>
          <p className="mt-2 text-gray-600">
            {agent ? `${agent.name} - ` : ''}全面的数据洞察与性能分析
          </p>
        </div>

        {/* 时间范围选择 */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { value: 'week', label: '近7天' },
            { value: 'month', label: '近30天' },
            { value: 'quarter', label: '近90天' }
          ].map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range.value
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">总用户数</h3>
            <span className="text-green-500 text-xs font-medium">↑ 12.5%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.userGrowth[data.userGrowth.length - 1].users.toLocaleString()}</p>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth.slice(-7)}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="url(#colorUsers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">活跃用户</h3>
            <span className="text-green-500 text-xs font-medium">↑ 8.3%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.userGrowth[data.userGrowth.length - 1].activeUsers.toLocaleString()}</p>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth.slice(-7)}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="activeUsers" stroke="#10B981" fill="url(#colorActive)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">总收入</h3>
            <span className="text-green-500 text-xs font-medium">↑ 23.1%</span>
          </div>
          <p className="text-3xl font-bold text-green-600">¥{data.revenueData[data.revenueData.length - 1].revenue.toLocaleString()}</p>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">满意度</h3>
            <span className="text-yellow-500 text-xs font-medium">⭐ {data.conversationStats.satisfactionRate}</span>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{data.conversationStats.satisfactionRate}/5</p>
          <div className="mt-4 flex items-end space-x-1 h-12">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`flex-1 rounded-t ${
                  star <= Math.floor(data.conversationStats.satisfactionRate)
                    ? 'bg-yellow-400'
                    : star === Math.ceil(data.conversationStats.satisfactionRate) && data.conversationStats.satisfactionRate % 1 !== 0
                    ? 'bg-yellow-400'
                    : 'bg-gray-200'
                }`}
                style={{
                  height: `${(star / 5) * 100}%`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户增长图表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📈</span>
            用户增长趋势
          </h3>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" name="总用户数" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="activeUsers" name="活跃用户" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 收入趋势图表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            收入趋势分析
          </h3>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar dataKey="subscriptions" name="订阅收入" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="payPerUse" name="按次付费收入" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 对话统计和能力使用 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 对话统计 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💬</span>
            对话统计
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">总对话数</p>
              <p className="text-2xl font-bold text-blue-900">{data.conversationStats.totalConversations.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">平均对话时长</p>
              <p className="text-2xl font-bold text-green-900">{data.conversationStats.avgDuration}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">高峰时段</p>
              <div className="space-y-1 mt-2">
                {data.conversationStats.peakHours.map((hour, index) => (
                  <p key={index} className="text-sm text-purple-800 font-medium">• {hour}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 能力使用频率 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            能力使用频率 TOP 8
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.abilityUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="ability" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} 次`, '使用次数']}
                />
                <Bar dataKey="usage" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                  {data.abilityUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 热门问题和用户画像 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门问题 TOP 10 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔥</span>
            热门问题 TOP 10
          </h3>
          <div className="space-y-3">
            {data.topQuestions.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  index < 3
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.question}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${(item.count / data.topQuestions[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{item.count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 用户画像 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            用户画像分析
          </h3>

          <div className="space-y-6">
            {/* 地域分布 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">地域分布</h4>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.userDemographics.regions}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="percentage"
                      label={({ region, percentage }) => `${region} ${percentage}%`}
                    >
                      {data.userDemographics.regions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, '占比']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 年龄分布 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">年龄分布</h4>
              <div className="space-y-2">
                {data.userDemographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-20">{group.range}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${group.percentage}%`,
                          backgroundColor: COLORS[index]
                        }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                        {group.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="flex justify-end space-x-3">
        <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          📥 导出报告 (PDF)
        </button>
        <button className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium">
          📊 导出数据 (CSV)
        </button>
      </div>
    </div>
  )
}

export default AgentAnalytics
