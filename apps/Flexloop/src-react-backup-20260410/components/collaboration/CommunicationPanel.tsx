import { useState, useEffect, useRef } from 'react'
import type { Message } from '../../data/mockCollaboration'
import { mockMessages, presetAgents } from '../../data/mockCollaboration'

interface CommunicationPanelProps {
  messages: Message[]
  onIntervene?: (messageId: string) => void
}

const messageTypes = {
  request: { icon: '📤', color: 'bg-blue-100 text-blue-700 border-blue-300', label: '请求' },
  response: { icon: '📥', color: 'bg-green-100 text-green-700 border-green-300', label: '响应' },
  notification: { icon: '🔔', color: 'bg-purple-100 text-purple-700 border-purple-300', label: '通知' },
  warning: { icon: '⚠️', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: '警告' },
  conflict: { icon: '⚡', color: 'bg-red-100 text-red-700 border-red-300', label: '冲突' },
}

const CommunicationPanel = ({ messages, onIntervene }: CommunicationPanelProps) => {
  const [filterType, setFilterType] = useState<string>('all')
  const [autoScroll, setAutoScroll] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredMessages = filterType === 'all'
    ? messages
    : messages.filter((m) => m.type === filterType)

  const conflictMessages = messages.filter((m) => m.type === 'conflict')

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [filteredMessages, autoScroll])

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      setAutoScroll(scrollHeight - scrollTop - clientHeight < 50)
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">智能体通信协调</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">共 {messages.length} 条消息</span>
          {conflictMessages.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full animate-pulse">
              ⚠️ {conflictMessages.length} 个冲突待处理
            </span>
          )}
        </div>
      </div>

      {conflictMessages.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚡</span>
              <h4 className="font-semibold text-red-900">检测到智能体意见冲突</h4>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            {conflictMessages.slice(0, 2).map((msg) => (
              <div key={msg.id} className="p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-900">
                    {msg.fromAgentName} → {msg.toAgentName || '全体'}
                  </span>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-700">{msg.content}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onIntervene?.(conflictMessages[0].id)}
            className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
          >
            👨‍💼 人工介入解决
          </button>
        </div>
      )}

      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            filterType === 'all'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {Object.entries(messageTypes).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filterType === type
                ? `${config.color} shadow-md`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-96 overflow-y-auto custom-scrollbar"
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm">暂无消息</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => {
              const typeConfig = messageTypes[message.type]
              const fromAgent = presetAgents.find((a) => a.id === message.fromAgentId)
              const toAgent = message.toAgentId ? presetAgents.find((a) => a.id === message.toAgentId) : null

              return (
                <div
                  key={message.id}
                  className={`group relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    typeConfig.color
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{typeConfig.icon}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-base">{fromAgent?.avatar}</span>
                          <span className="font-semibold text-sm">{message.fromAgentName}</span>
                        </div>
                        {toAgent && (
                          <>
                            <span className="text-gray-400">→</span>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-base">{toAgent.avatar}</span>
                              <span className="font-semibold text-sm">{message.toAgentName}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
                      {message.type === 'conflict' && (
                        <button
                          onClick={() => onIntervene?.(message.id)}
                          className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-600 text-white text-xs rounded transition-opacity"
                        >
                          介入
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed pl-8">{message.content}</p>

                  {message.type === 'request' && (
                    <div className="mt-2 pl-8 flex items-center space-x-2 text-xs opacity-75">
                      <span>⏳ 等待响应中...</span>
                      <div className="flex space-x-0.5">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.type === 'conflict' && (
                    <div className="mt-3 pl-8 pt-3 border-t border-current border-opacity-20">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="animate-pulse">🔴</span>
                        <span className="font-medium">需要协调解决</span>
                        <button
                          onClick={() => onIntervene?.(message.id)}
                          className="ml-auto px-3 py-1 bg-white bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors font-medium"
                        >
                          我来处理 →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef}></div>
          </div>
        )}
      </div>

      {!autoScroll && (
        <button
          onClick={() => {
            setAutoScroll(true)
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="fixed bottom-24 right-8 px-4 py-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all text-sm font-medium z-10"
        >
          ↓ 最新消息
        </button>
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
      `}</style>
    </div>
  )
}

export default CommunicationPanel
