import { useState, useMemo } from 'react'
import { memoryEntries, searchHistory, savedSearches, MemoryEntry } from '../../data/mockMemory'

type SortOption = 'relevance' | 'time' | 'frequency'
type ViewMode = 'list' | 'card'

const typeIcons = {
  conversation: '💬',
  note: '📝',
  bookmark: '🔖',
  event: '📅',
  learning: '📚',
  idea: '💡'
}

const typeLabels = {
  conversation: '对话记录',
  note: '笔记',
  bookmark: '书签',
  event: '事件',
  learning: '学习',
  idea: '想法'
}

const typeColors = {
  conversation: 'bg-blue-100 text-blue-800',
  note: 'bg-green-100 text-green-800',
  bookmark: 'bg-yellow-100 text-yellow-800',
  event: 'bg-purple-100 text-purple-800',
  learning: 'bg-indigo-100 text-indigo-800',
  idea: 'bg-pink-100 text-pink-800'
}

const MemorySearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeTab, setActiveTab] = useState<'results' | 'history' | 'saved'>('results')

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    memoryEntries.forEach(entry => entry.tags.forEach(tag => tagsSet.add(tag)))
    return Array.from(tagsSet).sort()
  }, [])

  const filteredResults = useMemo(() => {
    let results = [...memoryEntries]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      )
      results.forEach(entry => {
        const titleMatch = entry.title.toLowerCase().includes(query) ? 0.4 : 0
        const contentMatch = (entry.content.toLowerCase().match(new RegExp(query, 'g')) || []).length * 0.05
        const tagMatch = entry.tags.some(tag => tag.toLowerCase().includes(query)) ? 0.3 : 0
        entry.relevanceScore = Math.min(1, titleMatch + contentMatch + tagMatch)
      })
    }

    if (selectedTypes.length > 0) {
      results = results.filter(entry => selectedTypes.includes(entry.type))
    }

    if (selectedTags.length > 0) {
      results = results.filter(entry =>
        selectedTags.some(tag => entry.tags.includes(tag))
      )
    }

    if (dateRange.start) {
      results = results.filter(entry => entry.timestamp >= dateRange.start)
    }
    if (dateRange.end) {
      results = results.filter(entry => entry.timestamp <= dateRange.end + 'T23:59:59')
    }

    switch (sortBy) {
      case 'relevance':
        results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        break
      case 'time':
        results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case 'frequency':
        results.sort((a, b) => b.tags.length - a.tags.length)
        break
    }

    return results
  }, [searchQuery, selectedTypes, selectedTags, dateRange, sortBy])

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTypes([])
    setSelectedTags([])
    setDateRange({ start: '', end: '' })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <span>🔍</span>
          记忆检索
        </h2>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索记忆内容（支持模糊匹配）..."
              className="w-full px-4 py-2.5 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showAdvanced || selectedTypes.length > 0 || selectedTags.length > 0
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚙️ 高级搜索
          </button>
        </div>

        {showAdvanced && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4 animate-in slide-in-from-top">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">类型筛选</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(typeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleType(key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                      selectedTypes.includes(key)
                        ? `${typeColors[key as keyof typeof typeColors]} ring-2 ring-offset-1 ring-primary-500`
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <span>{typeIcons[key as keyof typeof typeIcons]}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标签筛选</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-offset-1 ring-primary-500'
                        : 'bg-white border border-gray-300 text-gray-600 hover:border-primary-300'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
            </div>

            {(selectedTypes.length > 0 || selectedTags.length > 0 || dateRange.start || dateRange.end) && (
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 font-medium">
                🗑️ 清除所有筛选条件
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['results', 'history', 'saved'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'results' ? `搜索结果 (${filteredResults.length})` :
                   tab === 'history' ? `搜索历史` : `已保存搜索`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="relevance">相关度排序</option>
              <option value="time">时间排序</option>
              <option value="frequency">频率排序</option>
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['list', 'card'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'list' ? '☰' : '▦'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 min-h-[500px]">
        {activeTab === 'results' && (
          <>
            {filteredResults.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🔎</p>
                <p className="text-xl font-medium text-gray-900 mb-2">未找到匹配结果</p>
                <p className="text-gray-500">尝试调整搜索关键词或筛选条件</p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-3">
                {filteredResults.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{typeIcons[entry.type]}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{entry.source}</span>
                            <span>·</span>
                            <span>{new Date(entry.timestamp).toLocaleDateString('zh-CN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[entry.type]}`}>
                          {typeLabels[entry.type]}
                        </span>
                        {searchQuery && (
                          <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {(entry.relevanceScore || 0).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 ml-11">{entry.summary}</p>
                    <div className="flex items-center gap-2 mt-2 ml-11">
                      {entry.tags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                      {entry.tags.length > 5 && (
                        <span className="text-xs text-gray-400">+{entry.tags.length - 5}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{typeIcons[entry.type]}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[entry.type]}`}>
                        {typeLabels[entry.type]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{entry.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{entry.source}</span>
                      {searchQuery && <span className="font-semibold text-primary-600">{(entry.relevanceScore || 0).toFixed(0)}%</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2">
            {searchHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSearchQuery(item.query)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 group-hover:text-primary-600">🕐</span>
                  <span className="font-medium text-gray-900">{item.query}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{item.resultCount} 条结果</span>
                  <span>{new Date(item.timestamp).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            ))}
            {searchHistory.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无搜索历史记录
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedSearches.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.query || '(使用高级筛选)'}</p>
                <div className="flex flex-wrap gap-2">
                  {item.filters.types.map(type => (
                    <span key={type} className={`px-2 py-0.5 rounded-full text-xs ${typeColors[type as keyof typeof typeColors]}`}>
                      {typeLabels[type as keyof typeof typeLabels]}
                    </span>
                  ))}
                  {item.filters.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {savedSearches.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无保存的搜索条件
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemorySearch
