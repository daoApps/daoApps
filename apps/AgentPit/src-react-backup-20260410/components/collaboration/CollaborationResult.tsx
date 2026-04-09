import { useState } from 'react'
import type { CollaborationResult as CollabResult, AgentResult } from '../../data/mockCollaboration'
import { presetAgents } from '../../data/mockCollaboration'

interface CollaborationResultProps {
  result: CollabResult
  onFeedback?: (agentId: string, feedback: string, rating: number) => void
}

type ViewMode = 'combined' | 'compare' | 'detail'

const CollaborationResult = ({ result, onFeedback }: CollaborationResultProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('combined')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const selectedAgentResult = result.agentResults.find((r) => r.agentId === selectedAgentId)

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 95) return '优秀'
    if (score >= 85) return '良好'
    if (score >= 70) return '合格'
    if (score >= 60) return '待改进'
    return '需优化'
  }

  const handleExport = (format: string) => {
    let content = ''
    let filename = ''
    let mimeType = ''

    switch (format) {
      case 'markdown':
        content = `# ${result.summary}\n\n## 协作结果详情\n\n`
        result.agentResults.forEach((ar) => {
          content += `### ${ar.agentName}\n\n**评分**: ${ar.score}/100 (${getScoreLabel(ar.score)})\n\n${ar.output}\n\n---\n\n`
        })
        filename = `collaboration-result-${Date.now()}.md`
        mimeType = 'text/markdown'
        break

      case 'json':
        content = JSON.stringify(result, null, 2)
        filename = `collaboration-result-${Date.now()}.json`
        mimeType = 'application/json'
        break

      case 'txt':
        content = result.summary + '\n\n' + result.agentResults.map(ar => `${ar.agentName}:\n${ar.output}`).join('\n\n---\n\n')
        filename = `collaboration-result-${Date.now()}.txt`
        mimeType = 'text/plain'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const renderCombinedView = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 综合摘要</h3>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreColor(result.overallScore)} mb-4`}>
            <span className="text-3xl font-bold">{result.overallScore}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">综合评分</h4>
          <p className="text-sm text-gray-600">{getScoreLabel(result.overallScore)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">参与智能体</h4>
          <div className="space-y-3">
            {result.agentResults.map((ar) => {
              const agent = presetAgents.find((a) => a.id === ar.agentId)
              return (
                <div key={ar.agentId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{agent?.avatar}</span>
                    <span className="text-sm font-medium text-gray-800">{ar.agentName}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getScoreColor(ar.score)}`}>
                    {ar.score}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">质量指标</h4>
          <div className="space-y-3">
            {[
              { label: '完整性', value: Math.min(95, result.overallScore + Math.random() * 5), icon: '✅' },
              { label: '准确性', value: Math.min(98, result.overallScore - 2 + Math.random() * 8), icon: '🎯' },
              { label: '创新性', value: Math.min(90, result.overallScore - 5 + Math.random() * 15), icon: '💡' },
              { label: '实用性', value: Math.min(92, result.overallScore - 3 + Math.random() * 10), icon: '⚡' },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 flex items-center">
                    <span className="mr-1.5">{metric.icon}</span>
                    {metric.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{Math.round(metric.value)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">📝 合并输出结果</h4>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-lg">
          {result.agentResults.map((ar) => (
            <div key={ar.agentId} className="mb-6 last:mb-0">
              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                <span className="text-lg">{presetAgents.find(a => a.id === ar.agentId)?.avatar}</span>
                <span className="font-semibold text-gray-900">{ar.agentName}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(ar.score)}`}>
                  评分: {ar.score}
                </span>
              </div>
              <div className="text-sm leading-relaxed">{ar.output}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCompareView = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {result.agentResults.map((agentResult) => {
          const agent = presetAgents.find((a) => a.id === agentResult.agentId)
          return (
            <div
              key={agentResult.agentId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{agent?.avatar}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{agentResult.agentName}</h4>
                      <p className="text-xs text-gray-500">{agent?.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${getScoreColor(agentResult.score)}`}>
                      {agentResult.score}/100
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{getScoreLabel(agentResult.score)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {agentResult.output}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedAgentId(agentResult.agentId)
                    setViewMode('detail')
                  }}
                  className="w-full py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  查看详细信息 →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
          🔍 差异分析
        </h4>
        <div className="space-y-2 text-sm text-yellow-800">
          <p>• 各智能体的输出在侧边栏中并排展示，便于对比分析</p>
          <p>• 可以查看不同智能体对同一任务的不同视角和解决方案</p>
          <p>• 评分差异反映了各智能体在该领域的专业程度和输出质量</p>
        </div>
      </div>
    </div>
  )

  const renderDetailView = () => {
    if (!selectedAgentResult && result.agentResults.length > 0) {
      setSelectedAgentId(result.agentResults[0].agentId)
    }

    if (!selectedAgentResult) return null

    const agent = presetAgents.find((a) => a.id === selectedAgentResult.agentId)

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center space-x-4 mb-6">
          <select
            value={selectedAgentId || ''}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {result.agentResults.map((ar) => (
              <option key={ar.agentId} value={ar.agentId}>
                {presetAgents.find(a => a.id === ar.agentId)?.avatar} {ar.agentName} (评分: {ar.score})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl">
                  {agent?.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAgentResult.agentName}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{agent?.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{agent?.description}</p>
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreColor(selectedAgentResult.score)} mb-2`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{selectedAgentResult.score}</div>
                    <div className="text-xs opacity-75">/100</div>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">{getScoreLabel(selectedAgentResult.score)}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              📄 完整输出内容
            </h4>
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar">
              {selectedAgentResult.output}
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-3">💬 提供反馈</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">评分</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedbackRating(rating)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          feedbackRating >= rating
                            ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                            : 'border-gray-300 text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        {rating <= feedbackRating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">反馈意见</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={3}
                    placeholder="请输入您对这个结果的反馈..."
                    className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  ></textarea>
                </div>
                <button
                  onClick={() => {
                    onFeedback?.(selectedAgentResult.agentId, feedbackText, feedbackRating)
                    setFeedbackText('')
                    alert('感谢您的反馈！')
                  }}
                  disabled={!feedbackText.trim()}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✉️ 提交反馈
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">协作结果汇总</h3>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all text-sm font-medium shadow-md flex items-center space-x-2"
          >
            <span>📥</span>
            <span>导出</span>
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 animate-fadeIn">
              {['markdown', 'json', 'txt'].map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                >
                  <span>{format === 'markdown' ? '📝' : format === 'json' ? '{ }' : '📄'}</span>
                  <span>{format.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
        {[
          { mode: 'combined' as ViewMode, label: '综合视图', icon: '📊' },
          { mode: 'compare' as ViewMode, label: '对比视图', icon: '⚖️' },
          { mode: 'detail' as ViewMode, label: '详细视图', icon: '🔍' },
        ].map(({ mode, label, icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              viewMode === mode
                ? 'bg-primary-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {viewMode === 'combined' && renderCombinedView()}
      {viewMode === 'compare' && renderCompareView()}
      {viewMode === 'detail' && renderDetailView()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  )
}

export default CollaborationResult
