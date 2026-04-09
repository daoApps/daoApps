import { useState } from 'react'

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: '您好！我是 AgentPit 智能助手，有什么可以帮您的吗？' }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage = { id: messages.length + 1, type: 'user', content: inputValue }
    setMessages([...messages, newMessage])
    setInputValue('')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: '收到您的消息！我正在处理中...'
      }])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">智能体对话</h1>
        <p className="mt-2 text-gray-600">与 AI 智能体进行实时对话</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入您的问题..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
