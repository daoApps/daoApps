import { useState, useEffect, useCallback } from 'react'
import AgentStatusCard from './AgentStatusCard'
import AgentSelector from './AgentSelector'
import AgentConfigPanel from './AgentConfigPanel'
import TaskDistributor from './TaskDistributor'
import CommunicationPanel from './CommunicationPanel'
import CollaborationResult from './CollaborationResult'
import type { Agent, Task, Message, CollaborationSession, CollaborationResult as CollabResult } from '../../data/mockCollaboration'
import {
  presetAgents,
  sampleTasks,
  mockMessages,
  mockSessions,
} from '../../data/mockCollaboration'

type WorkspaceTab = 'workspace' | 'agents' | 'tasks' | 'communication' | 'results'

const AgentWorkspace = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('workspace')
  const [taskInput, setTaskInput] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [configuringAgent, setConfiguringAgent] = useState<Agent | null>(null)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [sessions, setSessions] = useState<CollaborationSession[]>(mockSessions)
  const [currentResult, setCurrentResult] = useState<CollabResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState<Record<string, Agent['status']>>(() => {
    const statuses: Record<string, Agent['status']> = {}
    presetAgents.forEach((agent) => {
      statuses[agent.id] = agent.status
    })
    return statuses
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status === 'in_progress') {
            const newProgress = Math.min(task.progress + Math.random() * 3, 100)
            if (newProgress >= 100) {
              return { ...task, progress: 100, status: 'completed' as const, endTime: Date.now() }
            }
            return { ...task, progress: newProgress }
          }
          if (task.subtasks) {
            const updatedSubtasks = task.subtasks.map((subtask) => {
              if (subtask.status === 'in_progress') {
                const newProgress = Math.min(subtask.progress + Math.random() * 4, 100)
                if (newProgress >= 100) {
                  return { ...subtask, progress: 100, status: 'completed' as const, endTime: Date.now() }
                }
                return { ...subtask, progress: newProgress }
              }
              return subtask
            })

            const allCompleted = updatedSubtasks.every((s) => s.status === 'completed')
            if (allCompleted && task.status === 'in_progress') {
              return { ...task, subtasks: updatedSubtasks, status: 'completed' as const, endTime: Date.now(), progress: 100 }
            }

            return { ...task, subtasks: updatedSubtasks }
          }
          return task
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleTaskSubmit = async () => {
    if (!taskInput.trim()) return

    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskInput.slice(0, 50),
      description: taskInput,
      status: 'pending',
      priority: 'medium',
      progress: 0,
      startTime: Date.now(),
      estimatedTime: 3600000,
    }

    setTasks((prev) => [...prev, newTask])
    setSelectedAgents([])

    if (selectedAgents.length > 0) {
      selectedAgents.forEach((agentId, index) => {
        setTimeout(() => {
          setAgentStatuses((prev) => ({ ...prev, [agentId]: 'working' }))
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}-${index}`,
              fromAgentId: agentId,
              fromAgentName: presetAgents.find((a) => a.id === agentId)?.name || '',
              type: 'notification',
              content: `开始处理任务: ${newTask.title}`,
              timestamp: Date.now(),
              sessionId: 'current',
            },
          ])
        }, index * 500)
      })
    }

    setTaskInput('')
    setIsProcessing(false)
    setActiveTab('tasks')
  }

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates }
        }
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map((st) =>
            st.id === taskId ? { ...st, ...updates } : st
          )
          return { ...task, subtasks: updatedSubtasks }
        }
        return task
      })
    )
  }, [])

  const handleTaskAssign = useCallback((taskId: string, agentId: string) => {
    handleTaskUpdate(taskId, { assignedAgentId: agentId })
    setAgentStatuses((prev) => ({ ...prev, [agentId]: 'working' }))
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-assign-${Date.now()}`,
        fromAgentId: 'system',
        fromAgentName: '系统',
        toAgentId: agentId,
        toAgentName: presetAgents.find((a) => a.id === agentId)?.name,
        type: 'notification',
        content: `任务已分配给 ${presetAgents.find((a) => a.id === agentId)?.name}`,
        timestamp: Date.now(),
        sessionId: 'current',
      },
    ])
  }, [handleTaskUpdate])

  const handleIntervene = useCallback((messageId: string) => {
    alert(`👨‍💼 人工介入：您正在处理消息 ${messageId}\n\n请在下方输入您的协调指令...`)
  }, [])

  const handleFeedback = useCallback((agentId: string, feedback: string, rating: number) => {
    console.log(`Feedback for ${agentId}:`, feedback, rating)
  }, [])

  const tabs: { id: WorkspaceTab; label: string; icon: string; count?: number }[] = [
    { id: 'workspace', label: '工作台', icon: '🎯' },
    { id: 'agents', label: '智能体', icon: '🤖', count: selectedAgents.length },
    { id: 'tasks', label: '任务管理', icon: '📋', count: tasks.filter(t => t.status !== 'completed').length },
    { id: 'communication', label: '通信协调', icon: '💬', count: messages.length },
    { id: 'results', label: '结果汇总', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🤝 多智能体协作工作台
          </h1>
          <p className="text-lg text-gray-600">
            协调多个专业智能体协同工作，实现高效智能的任务处理
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <textarea
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="描述您需要完成的任务，系统将自动推荐合适的智能体团队..."
                  rows={2}
                  className="w-full px-5 py-4 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400 resize-none text-base"
                ></textarea>
                {isProcessing && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className={`px-4 py-4 rounded-xl border-2 transition-all ${
                  showAdvancedOptions
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
                title="高级选项"
              >
                ⚙️
              </button>

              <button
                onClick={handleTaskSubmit}
                disabled={!taskInput.trim() || isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin">⚡</span>
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>提交任务</span>
                  </>
                )}
              </button>
            </div>

            {showAdvancedOptions && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 animate-fadeIn space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="low">低优先级</option>
                      <option value="medium" selected>中优先级</option>
                      <option value="high">高优先级</option>
                      <option value="urgent">紧急</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">截止时间</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>自动选择</option>
                      <option>Markdown</option>
                      <option>JSON</option>
                      <option>纯文本</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-gray-700">自动分解子任务</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-gray-700">启用智能体推荐</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-gray-700">实时进度通知</span>
                  </label>
                </div>
              </div>
            )}

            {selectedAgents.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-900">已选择智能体:</span>
                    <div className="flex space-x-2">
                      {selectedAgents.map((agentId) => {
                        const agent = presetAgents.find((a) => a.id === agentId)
                        return agent ? (
                          <span
                            key={agentId}
                            className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm border border-blue-200"
                          >
                            {agent.avatar} {agent.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    编辑 →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 bg-white">
            <nav className="flex space-x-1 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 min-h-[600px]">
            {activeTab === 'workspace' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white shadow-lg">
                      <h2 className="text-2xl font-bold mb-3">✨ 欢迎使用多智能体协作系统</h2>
                      <p className="opacity-90 mb-6 leading-relaxed">
                        在这里，您可以协调多个专业智能体共同完成复杂任务。
                        每个智能体都有独特的专长和技能，通过合理的任务分配和协作，
                        可以显著提升工作效率和输出质量。
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                          <div className="text-3xl font-bold">{presetAgents.length}</div>
                          <div className="text-sm opacity-90">可用智能体</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                          <div className="text-3xl font-bold">{presetAgents.filter(a => a.status === 'online' || a.status === 'idle').length}</div>
                          <div className="text-sm opacity-90">在线状态</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 实时监控面板</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: '总任务数', value: tasks.length, color: 'from-blue-500 to-blue-600', icon: '📋' },
                          { label: '进行中', value: tasks.filter(t => t.status === 'in_progress').length, color: 'from-yellow-500 to-orange-500', icon: '⚡' },
                          { label: '已完成', value: tasks.filter(t => t.status === 'completed').length, color: 'from-green-500 to-emerald-600', icon: '✅' },
                          { label: '待处理', value: tasks.filter(t => t.status === 'pending').length, color: 'from-gray-500 to-gray-600', icon: '⏳' },
                        ].map((stat) => (
                          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 text-white`}>
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm opacity-90">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 最近活动</h3>
                      <div className="space-y-3">
                        {messages.slice(-5).reverse().map((msg) => (
                          <div key={msg.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-lg mt-0.5">
                              {msg.type === 'request' ? '📤' :
                               msg.type === 'response' ? '📥' :
                               msg.type === 'warning' ? '⚠️' :
                               msg.type === 'conflict' ? '⚡' : '🔔'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">
                                <span className="font-semibold">{msg.fromAgentName}</span>
                                {msg.toAgentName && (
                                  <span className="text-gray-500"> → {msg.toAgentName}</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-600 truncate mt-0.5">{msg.content}</p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {new Date(msg.timestamp).toLocaleTimeString('zh-CN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 智能体状态</h3>
                      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {presetAgents.slice(0, 5).map((agent) => {
                          const currentTask = tasks
                            .flatMap((t) => [t, ...(t.subtasks || [])])
                            .find((t) => t.assignedAgentId === agent.id && t.status === 'in_progress')
                          return (
                            <AgentStatusCard
                              key={agent.id}
                              agent={{ ...agent, status: agentStatuses[agent.id] || agent.status }}
                              currentTask={currentTask}
                            />
                          )
                        })}
                      </div>
                      <button
                        onClick={() => setActiveTab('agents')}
                        className="mt-4 w-full py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        查看全部 →
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
                      <h3 className="font-bold text-lg mb-2">💡 快速提示</h3>
                      <ul className="space-y-2 text-sm opacity-95">
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>在顶部输入框描述任务，AI会自动推荐合适的智能体组合</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>点击智能体卡片可以查看详细信息和进行配置</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>支持拖拽方式将任务分配给不同的智能体</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>所有通信记录都会被记录，方便追踪和审计</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="animate-fadeIn">
                <AgentSelector
                  selectedAgents={selectedAgents}
                  onSelectionChange={setSelectedAgents}
                  taskDescription={taskInput}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {presetAgents.map((agent) => (
                    <div key={agent.id} className="relative group">
                      <AgentStatusCard
                        agent={{ ...agent, status: agentStatuses[agent.id] || agent.status }}
                        isSelected={selectedAgents.includes(agent.id)}
                        onSelect={() => {
                          if (selectedAgents.includes(agent.id)) {
                            setSelectedAgents(selectedAgents.filter((id) => id !== agent.id))
                          } else {
                            setSelectedAgents([...selectedAgents, agent.id])
                          }
                        }}
                      />
                      <button
                        onClick={() => setConfiguringAgent(agent)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center transition-all hover:bg-gray-100 z-10"
                        title="配置智能体"
                      >
                        ⚙️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="animate-fadeIn">
                <TaskDistributor
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAssign={handleTaskAssign}
                />
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="animate-fadeIn">
                <CommunicationPanel messages={messages} onIntervene={handleIntervene} />
              </div>
            )}

            {activeTab === 'results' && (
              <div className="animate-fadeIn">
                {currentResult ? (
                  <CollaborationResult result={currentResult} onFeedback={handleFeedback} />
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                    <p className="text-6xl mb-4">📊</p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无结果数据</h3>
                    <p className="text-gray-600 mb-6">完成任务后，结果将在此处展示</p>
                    <button
                      onClick={() => {
                        setCurrentResult(mockSessions[2].result!)
                      }}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      查看示例结果
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {configuringAgent && (
          <AgentConfigPanel
            agent={configuringAgent}
            onSave={(config) => {
              console.log('Saved config:', config)
              setConfiguringAgent(null)
            }}
            onClose={() => setConfiguringAgent(null)}
          />
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          .animate-bounce {
            animation: bounce 1.4s infinite ease-in-out both;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
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
    </div>
  )
}

export default AgentWorkspace
