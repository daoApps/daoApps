import { useState, useEffect } from 'react'
import type { Task, Agent } from '../../data/mockCollaboration'
import { presetAgents, sampleTasks } from '../../data/mockCollaboration'

interface TaskDistributorProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskAssign: (taskId: string, agentId: string) => void
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-700 border-gray-300',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  paused: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
  error: 'bg-red-100 text-red-700 border-red-300',
}

const priorityColors = {
  low: 'text-gray-600 bg-gray-50',
  medium: 'text-blue-600 bg-blue-50',
  high: 'text-orange-600 bg-orange-50',
  urgent: 'text-red-600 bg-red-50',
}

const TaskDistributor = ({ tasks, onTaskUpdate, onTaskAssign }: TaskDistributorProps) => {
  const [viewMode, setViewMode] = useState<'tree' | 'timeline' | 'queue'>('tree')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [targetAgentId, setTargetAgentId] = useState<string | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const selectedTask = tasks.find((t) => t.id === selectedTaskId)

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, agentId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setTargetAgentId(agentId)
  }

  const handleDrop = (e: React.DragEvent, agentId: string) => {
    e.preventDefault()
    if (draggedTaskId) {
      onTaskAssign(draggedTaskId, agentId)
      setDraggedTaskId(null)
      setTargetAgentId(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setTargetAgentId(null)
  }

  const renderTaskTree = (task: Task, depth: number = 0): JSX.Element => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isExpanded = expandedTasks.has(task.id)

    return (
      <div key={task.id} className={`${depth > 0 ? 'ml-6' : ''}`}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragEnd={handleDragEnd}
          onClick={() => setSelectedTaskId(task.id)}
          className={`group flex items-center p-3 mb-2 rounded-lg border-2 cursor-pointer transition-all ${
            selectedTaskId === task.id
              ? 'border-primary-500 bg-primary-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
        >
          {hasSubtasks && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(task.id)
              }}
              className="mr-2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}

          {!hasSubtasks && <div className="w-7"></div>}

          <div className={`w-2 h-2 rounded-full mr-3 ${
            task.status === 'completed' ? 'bg-green-500' :
            task.status === 'in_progress' ? 'bg-blue-500 animate-pulse' :
            task.status === 'paused' ? 'bg-yellow-500' :
            task.status === 'error' ? 'bg-red-500' :
            'bg-gray-400'
          }`}></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-gray-900 truncate">{task.title}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[task.status]}`}>
                {task.status === 'pending' ? '待处理' :
                 task.status === 'in_progress' ? '进行中' :
                 task.status === 'completed' ? '已完成' :
                 task.status === 'paused' ? '已暂停' :
                 task.status === 'cancelled' ? '已取消' : '错误'}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority === 'urgent' ? '🔥 紧急' :
                 task.priority === 'high' ? '高' :
                 task.priority === 'medium' ? '中' : '低'}
              </span>
            </div>

            {task.status === 'in_progress' && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">进度</span>
                  <span className="text-xs font-semibold text-primary-600">{task.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {task.assignedAgentId && (
            <div className="ml-3 flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
              <span className="text-sm">{presetAgents.find((a) => a.id === task.assignedAgentId)?.avatar}</span>
              <span className="text-xs text-gray-700">
                {presetAgents.find((a) => a.id === task.assignedAgentId)?.name?.slice(0, 4)}
              </span>
            </div>
          )}

          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            {task.status === 'in_progress' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskUpdate(task.id, { status: 'paused' })
                }}
                className="p-1.5 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                title="暂停"
              >
                ⏸️
              </button>
            )}
            {task.status === 'paused' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskUpdate(task.id, { status: 'in_progress' })
                }}
                className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="恢复"
              >
                ▶️
              </button>
            )}
            {(task.status === 'pending' || task.status === 'paused') && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskUpdate(task.id, { status: 'cancelled' })
                }}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="取消"
              >
                🚫
              </button>
            )}
          </div>
        </div>

        {hasSubtasks && isExpanded && (
          <div className="space-y-1 animate-fadeIn">
            {task.subtasks!.map((subtask) => renderTaskTree(subtask, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderTimeline = () => {
    const allTasks = tasks.flatMap((t) => [t, ...(t.subtasks || [])])
    const maxTime = Math.max(...allTasks.filter(t => t.estimatedTime).map(t => t.estimatedTime || 0), 3600000)

    return (
      <div className="space-y-3">
        <div className="flex justify-end mb-2 text-xs text-gray-500 space-x-8 mr-48">
          <span>0h</span>
          <span>{Math.round(maxTime / 3600000)}h</span>
        </div>
        {allTasks.map((task) => (
          <div key={task.id} className="flex items-center group">
            <div className="w-44 pr-4 text-right">
              <p className="text-sm font-medium text-gray-900 truncate" title={task.title}>
                {task.title.length > 12 ? task.title.slice(0, 12) + '...' : task.title}
              </p>
              {task.assignedAgentId && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {presetAgents.find(a => a.id === task.assignedAgentId)?.avatar}{' '}
                  {presetAgents.find(a => a.id === task.assignedAgentId)?.name?.split(' ')[0]}
                </p>
              )}
            </div>
            <div className="flex-1 relative h-10 bg-gray-100 rounded">
              {(task.startTime || task.estimatedTime) && (
                <div
                  className={`absolute top-0 h-full rounded flex items-center px-3 text-xs font-medium text-white transition-all ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-gradient-to-r from-primary-400 to-primary-600' :
                    task.status === 'paused' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}
                  style={{
                    left: `${task.startTime ? ((Date.now() - task.startTime) / maxTime) * 100 : 0}%`,
                    width: `${(task.estimatedTime || maxTime * 0.3) / maxTime * 100}%`,
                  }}
                >
                  {task.status === 'in_progress' && `${task.progress}%`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderQueueView = () => {
    const agentsWithQueues = presetAgents.map(agent => ({
      ...agent,
      queue: tasks.flatMap(t => [t, ...(t.subtasks || [])]).filter(t => t.assignedAgentId === agent.id)
    }))

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agentsWithQueues.map(agent => (
          <div
            key={agent.id}
            onDragOver={(e) => handleDragOver(e, agent.id)}
            onDrop={(e) => handleDrop(e, agent.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              targetAgentId === agent.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-200">
              <span className="text-xl">{agent.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{agent.name}</p>
                <p className="text-xs text-gray-500">队列: {agent.queue.length} 个任务</p>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${
                agent.status === 'online' ? 'bg-green-500' :
                agent.status === 'busy' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`}></div>
            </div>

            <div className="space-y-2 min-h-[200px]">
              {agent.queue.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  拖拽任务到此处分配
                </div>
              ) : (
                agent.queue.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-2.5 rounded-lg border cursor-move transition-all ${
                      task.status === 'completed' ? 'bg-green-50 border-green-200' :
                      task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-800 truncate">{task.title}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {task.status === 'in_progress' ? `${task.progress}%` : task.status}
                      </span>
                      {task.status === 'in_progress' && (
                        <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 transition-all"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">任务分配与进度</h3>
        <div className="flex space-x-2">
          {[
            { mode: 'tree' as const, label: '树状视图', icon: '🌳' },
            { mode: 'timeline' as const, label: '时间线', icon: '📅' },
            { mode: 'queue' as const, label: '队列视图', icon: '📋' },
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {viewMode === 'tree' && (
            <div className="space-y-2">
              {tasks.map((task) => renderTaskTree(task))}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="animate-fadeIn p-4">
              {renderTimeline()}
            </div>
          )}

          {viewMode === 'queue' && (
            <div className="animate-fadeIn">
              {renderQueueView()}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">任务详情</h4>
          {selectedTask ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">任务名称</label>
                <p className="font-semibold text-gray-900">{selectedTask.title}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">描述</label>
                <p className="text-sm text-gray-700">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">状态</label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${statusColors[selectedTask.status]}`}>
                    {selectedTask.status}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">优先级</label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priorityColors[selectedTask.priority]}`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              {selectedTask.status === 'in_progress' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">完成进度</label>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary-600">
                          {selectedTask.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${selectedTask.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">分配给智能体</label>
                <select
                  value={selectedTask.assignedAgentId || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      onTaskAssign(selectedTask.id, e.target.value)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="">未分配</option>
                  {presetAgents
                    .filter((a) => a.status === 'online' || a.status === 'idle')
                    .map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.avatar} {agent.name}
                      </option>
                    ))}
                </select>
              </div>

              {selectedTask.dependencies && selectedTask.dependencies.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">依赖任务</label>
                  <div className="space-y-1">
                    {selectedTask.dependencies.map((depId) => {
                      const depTask = tasks.flatMap(t => [t, ...(t.subtasks || [])]).find(t => t.id === depId)
                      return depTask ? (
                        <div key={depId} className="flex items-center text-xs text-gray-600">
                          <span className="mr-1">→</span>
                          {depTask.title}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {selectedTask.status === 'pending' && (
                  <button
                    onClick={() => onTaskUpdate(selectedTask.id, { status: 'in_progress', startTime: Date.now() })}
                    className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    ▶️ 开始执行
                  </button>
                )}
                {selectedTask.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => onTaskUpdate(selectedTask.id, { status: 'paused' })}
                      className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      ⏸️ 暂停任务
                    </button>
                    <button
                      onClick={() => onTaskUpdate(selectedTask.id, { progress: 100, status: 'completed', endTime: Date.now() })}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      ✅ 标记完成
                    </button>
                  </>
                )}
                {selectedTask.status === 'paused' && (
                  <button
                    onClick={() => onTaskUpdate(selectedTask.id, { status: 'in_progress' })}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    ▶️ 恢复执行
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-sm">选择一个任务查看详情</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default TaskDistributor
