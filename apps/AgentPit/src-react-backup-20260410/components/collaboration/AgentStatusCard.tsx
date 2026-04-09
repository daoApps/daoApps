import { useState, useEffect } from 'react'
import type { Agent, Task } from '../../data/mockCollaboration'

interface AgentStatusCardProps {
  agent: Agent
  currentTask?: Task
  onPause?: () => void
  onStop?: () => void
  onReassign?: () => void
  isSelected?: boolean
  onSelect?: () => void
}

const statusConfig = {
  online: { color: 'bg-green-500', text: '在线', textColor: 'text-green-700' },
  busy: { color: 'bg-yellow-500', text: '忙碌', textColor: 'text-yellow-700' },
  offline: { color: 'bg-gray-400', text: '离线', textColor: 'text-gray-600' },
  idle: { color: 'bg-blue-500', text: '空闲', textColor: 'text-blue-700' },
  working: { color: 'bg-purple-500', text: '工作中', textColor: 'text-purple-700' },
  waiting: { color: 'bg-orange-500', text: '等待中', textColor: 'text-orange-700' },
  error: { color: 'bg-red-500', text: '错误', textColor: 'text-red-700' },
}

const AgentStatusCard = ({
  agent,
  currentTask,
  onPause,
  onStop,
  onReassign,
  isSelected,
  onSelect,
}: AgentStatusCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(currentTask?.progress || 0)

  useEffect(() => {
    if (agent.status === 'working') {
      setIsAnimating(true)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= (currentTask?.progress || 100)) return prev
          return prev + Math.random() * 2
        })
      }, 500)
      return () => clearInterval(interval)
    } else {
      setIsAnimating(false)
    }
  }, [agent.status, currentTask?.progress])

  const status = statusConfig[agent.status]

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  isAnimating ? 'animate-pulse bg-gradient-to-br from-primary-100 to-purple-100' : 'bg-gray-100'
                }`}
              >
                {agent.avatar}
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${status.color} rounded-full border-2 border-white ${
                  isAnimating ? 'animate-ping' : ''
                }`}
              ></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{agent.name}</h3>
              <p className={`text-xs ${status.textColor} font-medium`}>{status.text}</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
            Lv.{agent.level}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">当前任务</p>
          <p className="text-sm font-medium text-gray-800 truncate">{currentTask?.title || '暂无任务'}</p>
        </div>

        {currentTask && agent.status === 'working' && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">进度</span>
              <span className="text-xs font-semibold text-primary-600">
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{agent.completedTasks}</p>
            <p className="text-xs text-gray-500">完成任务</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{agent.avgTime}s</p>
            <p className="text-xs text-gray-500">平均耗时</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{agent.accuracy}%</p>
            <p className="text-xs text-gray-500">准确率</p>
          </div>
        </div>

        {(agent.status === 'working' || agent.status === 'waiting') && (
          <div className="flex space-x-2 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPause?.()
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              ⏸️ 暂停
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStop?.()
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              ⏹️ 停止
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReassign?.()
              }}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              🔄 重分配
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default AgentStatusCard
