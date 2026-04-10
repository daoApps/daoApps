import { useState, useMemo } from 'react'
import type { Agent } from '../../data/mockCollaboration'
import { presetAgents, getRecommendedAgents, taskTypeRecommendations } from '../../data/mockCollaboration'

interface AgentSelectorProps {
  selectedAgents: string[]
  onSelectionChange: (agents: string[]) => void
  taskDescription?: string
}

const statusColors = {
  online: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-gray-400',
  idle: 'bg-blue-500',
  working: 'bg-purple-500',
  waiting: 'bg-orange-500',
  error: 'bg-red-500',
}

const AgentSelector = ({ selectedAgents, onSelectionChange, taskDescription }: AgentSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')

  const recommendedAgentIds = useMemo(() => {
    if (!taskDescription) return []
    return getRecommendedAgents(taskDescription)
  }, [taskDescription])

  const filteredAgents = useMemo(() => {
    let agents = presetAgents

    if (filterRole !== 'all') {
      agents = agents.filter((agent) => agent.role === filterRole)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      agents = agents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(term) ||
          agent.specialty.some((s) => s.toLowerCase().includes(term)) ||
          agent.skills.some((s) => s.toLowerCase().includes(term))
      )
    }

    return agents
  }, [searchTerm, filterRole])

  const uniqueRoles = useMemo(() => {
    return [...new Set(presetAgents.map((a) => a.role))]
  }, [])

  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onSelectionChange(selectedAgents.filter((id) => id !== agentId))
    } else {
      onSelectionChange([...selectedAgents, agentId])
    }
  }

  const selectAllRecommended = () => {
    onSelectionChange(recommendedAgentIds)
  }

  const clearSelection = () => {
    onSelectionChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">选择智能体</h3>
        <span className="text-sm text-gray-600">
          已选择 {selectedAgents.length} / {presetAgents.length}
        </span>
      </div>

      {taskDescription && recommendedAgentIds.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-primary-900 flex items-center">
              ✨ 智能推荐
            </p>
            <button
              onClick={selectAllRecommended}
              className="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
            >
              一键选择推荐
            </button>
          </div>
          <p className="text-xs text-primary-700 mb-2">
            根据任务描述，推荐以下智能体协作：
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendedAgentIds.map((agentId) => {
              const agent = presetAgents.find((a) => a.id === agentId)
              if (!agent) return null
              return (
                <span
                  key={agentId}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedAgents.includes(agentId)
                      ? 'bg-primary-100 text-primary-800 border border-primary-300'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {agent.avatar} {agent.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索智能体名称、技能..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
        >
          <option value="all">全部角色</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {selectedAgents.length > 0 && (
          <button
            onClick={clearSelection}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200"
          >
            清空
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {filteredAgents.map((agent) => {
          const isSelected = selectedAgents.includes(agent.id)
          const isRecommended = recommendedAgentIds.includes(agent.id)

          return (
            <div
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
              }`}
            >
              {isRecommended && !isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-md z-10">
                  ⭐
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isSelected ? 'bg-primary-100' : 'bg-gray-100'
                    }`}
                  >
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                      {agent.name}
                    </h4>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 ${statusColors[agent.status]} rounded-full`}></div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-600 line-clamp-2">{agent.description}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {agent.specialty.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      isSelected
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {agent.specialty.length > 3 && (
                  <span className="px-2 py-0.5 rounded text-xs text-gray-500">
                    +{agent.specialty.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">能力等级:</span>
                  <span className="text-xs font-bold text-primary-600">{agent.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">准确率:</span>
                  <span className="text-xs font-bold text-green-600">{agent.accuracy}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedAgents.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">已选择的智能体团队：</p>
          <div className="flex flex-wrap gap-2">
            {selectedAgents.map((agentId) => {
              const agent = presetAgents.find((a) => a.id === agentId)
              if (!agent) return null
              return (
                <span
                  key={agentId}
                  className="inline-flex items-center px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-800 shadow-sm border border-blue-200"
                >
                  {agent.avatar} {agent.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAgent(agentId)
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      <style>{`
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default AgentSelector
