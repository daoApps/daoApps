import { useState, useMemo } from 'react'
import { sampleAgents, roleTemplates } from '../../data/mockCustomize'

interface MyAgentsListProps {
  onEditAgent: (agentId: string) => void
  onViewAnalytics: (agentId: string) => void
}

const MyAgentsList = ({ onEditAgent, onViewAnalytics }: MyAgentsListProps) => {
  const [agents] = useState(sampleAgents)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const statusConfig = {
    published: { label: '已发布', color: 'bg-green-100 text-green-700', icon: '✓' },
    draft: { label: '草稿', color: 'bg-yellow-100 text-yellow-700', icon: '📝' },
    offline: { label: '已下线', color: 'bg-gray-100 text-gray-700', icon: '○' }
  }

  const filteredAndSortedAgents = useMemo(() => {
    let result = [...agents]

    if (searchQuery.trim()) {
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      result = result.filter(agent => agent.status === filterStatus)
    }

    switch (sortBy) {
      case 'revenue':
        result.sort((a, b) => b.revenue - a.revenue)
        break
      case 'users':
        result.sort((a, b) => b.users - a.users)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'createdAt':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [agents, searchQuery, filterStatus, sortBy])

  const stats = useMemo(() => ({
    total: agents.length,
    published: agents.filter(a => a.status === 'published').length,
    totalRevenue: agents.reduce((sum, a) => sum + a.revenue, 0),
    totalUsers: agents.reduce((sum, a) => sum + a.users, 0)
  }), [agents])

  const handleDeleteAgent = (agentId: string) => {
    console.log('删除智能体:', agentId)
    setShowDeleteConfirm(null)
  }

  const handleToggleStatus = (agentId: string) => {
    console.log('切换状态:', agentId)
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">智能体总数</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">已发布</p>
              <p className="text-3xl font-bold mt-1">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              ✓
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">总收入</p>
              <p className="text-3xl font-bold mt-1">¥{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">总用户数</p>
              <p className="text-3xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索我的智能体..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="offline">已下线</option>
            </select>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt">创建时间</option>
              <option value="revenue">收益排序</option>
              <option value="users">用户数</option>
              <option value="rating">评分</option>
            </select>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="text-sm text-gray-600 mb-4">
          共找到 <span className="font-semibold text-primary-600">{filteredAndSortedAgents.length}</span> 个智能体
        </div>

        {/* 智能体卡片网格 */}
        {filteredAndSortedAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAgents.map((agent) => {
              const role = roleTemplates.find(r => r.id === agent.roleType)
              const status = statusConfig[agent.status as keyof typeof statusConfig]

              return (
                <div
                  key={agent.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group"
                >
                  {/* 卡片头部 */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-3xl shadow-md">
                          {agent.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">{agent.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5">
                            {role?.icon} {role?.name}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{agent.description}</p>

                    {/* 数据指标 */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">¥{(agent.revenue / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-gray-500">收益</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{(agent.users / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-gray-500">用户</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-500">⭐ {agent.rating || '-'}</p>
                        <p className="text-xs text-gray-500">评分</p>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditAgent(agent.id)}
                        className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="编辑"
                      >
                        ✏️ 编辑
                      </button>
                      <button
                        onClick={() => onViewAnalytics(agent.id)}
                        className="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="查看数据"
                      >
                        📊 数据
                      </button>
                      {agent.status === 'published' && (
                        <button
                          onClick={() => handleToggleStatus(agent.id)}
                          className="px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="下线"
                        >
                          ⏸️ 下线
                        </button>
                      )}
                      {(agent.status === 'draft' || agent.status === 'offline') && (
                        <button
                          onClick={() => handleToggleStatus(agent.id)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="发布"
                        >
                          🚀 发布
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setShowDeleteConfirm(agent.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="删除"
                    >
                      🗑️ 删除
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* 空状态 */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到智能体</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? '尝试使用其他关键词搜索' : '您还没有创建任何智能体'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => window.location.href = '/customize'}
                className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                创建第一个智能体 →
              </button>
            )}
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">确认删除？</h3>
              <p className="text-gray-600 mb-6">
                删除后无法恢复，所有相关数据和配置都将被永久删除。
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteAgent(showDeleteConfirm)}
                  className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default MyAgentsList
