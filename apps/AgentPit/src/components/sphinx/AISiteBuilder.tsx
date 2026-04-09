import { useState, useRef, useEffect } from 'react'
import { presetQuestions, aiResponses, sampleChatHistory, type ChatMessage } from '../../data/mockSphinx'

interface AISiteBuilderProps {
  onSiteConfigGenerated?: (config: Partial<{ templateType: string; description: string }>) => void
}

const AISiteBuilder = ({ onSiteConfigGenerated }: AISiteBuilderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatHistory)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('电商') || input.includes('购物') || input.includes('商城')) {
      return aiResponses['电商']
    }
    if (input.includes('博客') || input.includes('写作') || input.includes('文章')) {
      return aiResponses['博客']
    }
    if (input.includes('企业') || input.includes('公司') || input.includes('官网')) {
      return aiResponses['企业']
    }
    if (input.includes('作品集') || input.includes('作品') || input.includes('展示')) {
      return aiResponses['作品集']
    }
    if (input.includes('着陆页') || input.includes('产品') || input.includes('活动')) {
      return aiResponses['着陆页']
    }

    return aiResponses['default']
  }

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(messageText),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)

      if (onSiteConfigGenerated) {
        onSiteConfigGenerated({
          templateType: messageText,
          description: messageText
        })
      }
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sphinx AI 建站助手</h3>
            <p className="text-xs text-gray-500">告诉我您的需求，我来帮您规划网站</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  AI
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                  我
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">快捷提问：</p>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-xs text-gray-700 rounded-full hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="描述您想创建的网站..."
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

export default AISiteBuilder
