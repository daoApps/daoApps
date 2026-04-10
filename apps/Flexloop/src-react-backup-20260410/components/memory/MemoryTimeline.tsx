import { useState, useMemo } from 'react'
import { memoryEntries, MemoryEntry } from '../../data/mockMemory'

type TimeScale = 'day' | 'week' | 'month' | 'year'

const typeConfig = {
  conversation: { icon: '💬', color: '#3b82f6', bgColor: 'bg-blue-50', borderColor: 'border-l-blue-500' },
  note: { icon: '📝', color: '#10b981', bgColor: 'bg-green-50', borderColor: 'border-l-green-500' },
  bookmark: { icon: '🔖', color: '#f59e0b', bgColor: 'bg-yellow-50', borderColor: 'border-l-yellow-500' },
  event: { icon: '📅', color: '#8b5cf6', bgColor: 'bg-purple-50', borderColor: 'border-l-purple-500' },
  learning: { icon: '📚', color: '#06b6d4', bgColor: 'bg-cyan-50', borderColor: 'border-l-cyan-500' },
  idea: { icon: '💡', color: '#ec4899', bgColor: 'bg-pink-50', borderColor: 'border-l-pink-500' }
}

const typeLabels = {
  conversation: '对话记录',
  note: '笔记',
  bookmark: '书签',
  event: '事件',
  learning: '学习笔记',
  idea: '创意灵感'
}

const MemoryTimeline = () => {
  const [timeScale, setTimeScale] = useState<TimeScale>('day')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newMemory, setNewMemory] = useState({ type: 'note' as MemoryEntry['type'], title: '', content: '', tags: '' })

  const groupedEntries = useMemo(() => {
    let filtered = [...memoryEntries]

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType)
    }

    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const groups: { date: string; entries: MemoryEntry[] }[] = []
    let currentDate = ''

    filtered.forEach(entry => {
      let groupKey: string
      const entryDate = new Date(entry.timestamp)

      switch (timeScale) {
        case 'day':
          groupKey = entryDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
          break
        case 'week':
          const weekStart = new Date(entryDate)
          weekStart.setDate(entryDate.getDate() - entryDate.getDay())
          groupKey = `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 当周`
          break
        case 'month':
          groupKey = entryDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
          break
        case 'year':
          groupKey = entryDate.getFullYear().toString()
          break
        default:
          groupKey = entryDate.toISOString().split('T')[0]
      }

      if (groupKey !== currentDate) {
        currentDate = groupKey
        groups.push({ date: groupKey, entries: [] })
      }
      groups[groups.length - 1].entries.push(entry)
    })

    return groups
  }, [timeScale, filterType])

  const handleAddMemory = () => {
    setShowAddModal(false)
    setNewMemory({ type: 'note', title: '', content: '', tags: '' })
  }

  const handleDelete = (id: string) => {
    console.log('删除记忆:', id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span>📅</span>
            记忆时间线
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            添加记忆
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {([
              { value: 'day' as TimeScale, label: '日' },
              { value: 'week' as TimeScale, label: '周' },
              { value: 'month' as TimeScale, label: '月' },
              { value: 'year' as TimeScale, label: '年' }
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeScale(value)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  timeScale === value ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">全部类型</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-gray-600">
            共 {memoryEntries.filter(e => filterType === 'all' || e.type === filterType).length} 条记忆
          </div>
        </div>
      </div>

      <div className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
        {groupedEntries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-xl font-medium text-gray-900 mb-2">暂无记忆记录</p>
            <p className="text-gray-500">点击"添加记忆"开始记录</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 via-purple-400 to-pink-400" />

            {groupedEntries.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 mb-4 ml-14">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 rounded-full border border-primary-200">
                    <span className="text-lg">📆</span>
                    <span className="font-semibold text-gray-800">{group.date}</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 font-medium">
                      {group.entries.length} 条
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {group.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`relative ml-12 pl-8 border-l-4 ${typeConfig[entry.type].borderColor} ${
                        typeConfig[entry.type].bgColor
                      } rounded-r-lg p-4 hover:shadow-md transition-all group`}
                      style={{ marginLeft: '24px' }}
                    >
                      <div className="absolute left-[-21px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: typeConfig[entry.type].color }}
                      />

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl mt-0.5">{typeConfig[entry.type].icon}</span>
                          <div className="flex-1 min-w-0">
                            {editingId === entry.id ? (
                              <input
                                type="text"
                                defaultValue={entry.title}
                                className="w-full px-2 py-1 border border-primary-300 rounded focus:ring-2 focus:ring-primary-500 outline-none font-semibold text-gray-900"
                                autoFocus
                              />
                            ) : (
                              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                                {entry.title}
                              </h3>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{typeLabels[entry.type]}</span>
                              <span>·</span>
                              <span>{entry.source}</span>
                              <span>·</span>
                              <span>{new Date(entry.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}
                            className="p-1.5 hover:bg-white/80 rounded transition-colors"
                            title="编辑"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 hover:bg-red-100 rounded transition-colors"
                            title="删除"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-3 ml-10">{entry.summary}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2 ml-10">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-white/80 rounded-full text-gray-600 hover:bg-white cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[560px] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加新记忆</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">类型</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNewMemory(prev => ({ ...prev, type: key as MemoryEntry['type'] }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                        newMemory.type === key
                          ? `${typeConfig[key as keyof typeof typeConfig].bgColor} ring-2 ring-offset-1 ring-primary-500`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{typeConfig[key as keyof typeof typeConfig].icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">标题</label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="输入记忆标题..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">内容</label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="详细描述这个记忆..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={newMemory.tags}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="例如：AI, 学习, 工作"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                取消
              </button>
              <button onClick={handleAddMemory} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                保存记忆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoryTimeline
