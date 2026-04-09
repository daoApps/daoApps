import { useState } from 'react'
import { avatarLibrary, themeColors, roleTemplates, type AgentConfig } from '../../data/mockCustomize'

interface AgentPreviewProps {
  data: AgentConfig
  onEditStep: (step: number) => void
  onPublish: () => void
}

const AgentPreview = ({ data, onEditStep, onPublish }: AgentPreviewProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'conversation' | 'abilities' | 'business'>('overview')
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'agent'; content: string }>>([
    { type: 'agent', content: data.appearance.greeting || '你好！我是您的智能助手，有什么可以帮助您的吗？' }
  ])
  const [userInput, setUserInput] = useState('')

  const selectedAvatar = avatarLibrary.find(a => a.id === data.appearance.avatarId)
  const selectedTheme = themeColors.find(t => t.id === data.appearance.themeId)
  const selectedRole = roleTemplates.find(r => r.id === data.basicInfo.roleType)

  const validationChecks = [
    {
      label: '基础信息完整',
      valid: !!data.basicInfo.name && !!data.basicInfo.description && !!data.basicInfo.roleType,
      step: 1
    },
    {
      label: '头像已设置',
      valid: !!data.appearance.avatarId || !!data.appearance.customAvatar,
      step: 2
    },
    {
      label: '主题已选择',
      valid: !!data.appearance.themeId || !!data.appearance.customColors?.primary,
      step: 2
    },
    {
      label: '至少启用1个能力',
      valid: Object.keys(data.abilities.enabledAbilities).length > 0,
      step: 3
    },
    {
      label: '商业模式已配置',
      valid: true, // 免费模式也是有效配置
      step: 4
    }
  ]

  const allValid = validationChecks.every(check => check.valid)

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const newMessages = [...chatMessages, { type: 'user', content: userInput }]
    setChatMessages(newMessages)
    setUserInput('')

    setTimeout(() => {
      const responses = [
        '这是一个很好的问题！让我为您详细解答...',
        '根据我的理解，您想要了解的是...',
        '我建议您可以尝试以下方案...',
        '这个问题涉及多个方面，我来逐一分析...'
      ]
      setChatMessages(prev => [
        ...prev,
        { type: 'agent', content: responses[Math.floor(Math.random() * responses.length)] }
      ])
    }, 1000)
  }

  const modeLabels = {
    free: '免费模式',
    subscription: '付费订阅',
    payPerUse: '按次付费',
    freemium: '增值服务',
    adRevenue: '广告分成'
  }

  return (
    <div className="space-y-6">
      {/* 预览标签页 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { id: 'overview', label: '总览', icon: '📋' },
            { id: 'conversation', label: '对话演示', icon: '💬' },
            { id: 'abilities', label: '能力清单', icon: '⚡' },
            { id: 'business', label: '商业模式', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 总览 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 基本信息卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  基础信息
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{
                        backgroundColor: `${selectedTheme?.primary}20`,
                        border: `3px solid ${selectedTheme?.primary}`
                      }}
                    >
                      {selectedAvatar?.emoji || '🤖'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{data.basicInfo.name || '未命名智能体'}</h3>
                      <p className="text-sm text-gray-600">{selectedRole?.icon} {selectedRole?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                    {data.basicInfo.description || '暂无描述'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">目标用户：</span>
                      <span className="font-medium">{data.basicInfo.targetUsers || '未设置'}</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">语言：</span>
                      <span className="font-medium">
                        {{ chinese: '中文', english: '英文', multilingual: '多语言' }[data.basicInfo.language]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🎨</span>
                  外观配置
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="text-sm text-gray-600">主题配色</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ background: selectedTheme?.preview }}
                      ></div>
                      <span className="text-sm font-medium">{selectedTheme?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="text-sm text-gray-600">气泡圆角</span>
                    <span className="text-sm font-medium">{data.appearance.bubbleStyle.borderRadius}px</span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="text-sm text-gray-600">透明度</span>
                    <span className="text-sm font-medium">{Math.round(data.appearance.bubbleStyle.opacity * 100)}%</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <span className="text-sm text-gray-600 block mb-1">问候语</span>
                    <p className="text-sm font-medium">{data.appearance.greeting || '默认问候语'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 统计摘要 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{Object.keys(data.abilities.enabledAbilities).length}</p>
                <p className="text-sm opacity-90">启用能力</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{data.abilities.exampleConversations.length}</p>
                <p className="text-sm opacity-90">示例对话</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{data.abilities.restrictions.length}</p>
                <p className="text-sm opacity-90">禁止事项</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{modeLabels[data.businessModel.mode]}</p>
                <p className="text-sm opacity-90">盈利模式</p>
              </div>
            </div>
          </div>
        )}

        {/* 对话演示 */}
        {activeTab === 'conversation' && (
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-xl overflow-hidden border-2"
              style={{ borderColor: selectedTheme?.primary }}
            >
              {/* 对话头部 */}
              <div
                className="px-6 py-4 flex items-center space-x-3"
                style={{ backgroundColor: selectedTheme?.primary }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {selectedAvatar?.emoji || '🤖'}
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-lg">{data.basicInfo.name || '智能助手'}</h3>
                  <p className="text-sm opacity-90">在线 · 准备就绪</p>
                </div>
              </div>

              {/* 对话内容 */}
              <div className="p-6 bg-gray-50 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'agent' && (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                        {selectedAvatar?.emoji || '🤖'}
                      </div>
                    )}
                    <div
                      className="max-w-[70%] px-4 py-3 rounded-2xl"
                      style={
                        msg.type === 'agent'
                          ? {
                              backgroundColor: selectedTheme?.primary,
                              color: 'white',
                              borderRadius: `${data.appearance.bubbleStyle.borderRadius}px ${data.appearance.bubbleStyle.borderRadius}px ${data.appearance.borderStyle.borderRadius}px ${data.appearance.bubbleStyle.borderRadius}px`
                            }
                          : {
                              backgroundColor: '#E5E7EB',
                              color: '#1F2937',
                              borderRadius: `${data.appearance.bubbleStyle.borderRadius}px ${data.appearance.borderStyle.borderRadius}px ${data.appearance.borderStyle.borderRadius}px ${data.appearance.borderStyle.borderRadius}px`
                            }
                      }
                    >
                      <p>{msg.content}</p>
                    </div>
                    {msg.type === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center ml-3 flex-shrink-0 text-white">
                        👤
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 输入框 */}
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="输入消息测试对话效果..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="px-6 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: selectedTheme?.primary }}
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 能力清单 */}
        {activeTab === 'abilities' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(data.abilities.enabledAbilities).map((ability) => (
                <div
                  key={ability.id}
                  className="p-4 border border-green-200 bg-green-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{ability.name}</h4>
                    {ability.isPremium && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        ¥{ability.price}/月
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ability.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {ability.level === 'beginner' ? '初级' :
                       ability.level === 'intermediate' ? '中级' :
                       ability.level === 'advanced' ? '高级' : '专家'}
                    </span>
                    <span className="text-gray-500">
                      {{ general: '通用', professional: '专业', tool: '工具', creative: '创意' }[ability.category]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {data.abilities.systemPrompt && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">System Prompt</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                  {data.abilities.systemPrompt}
                </pre>
              </div>
            )}

            {(data.abilities.restrictions.length > 0 || data.abilities.exampleConversations.length > 0) && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {data.abilities.exampleConversations.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">示例对话</h4>
                    <ul className="space-y-1">
                      {data.abilities.exampleConversations.map((example, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.abilities.restrictions.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-2">禁止事项</h4>
                    <ul className="space-y-1">
                      {data.abilities.restrictions.map((restriction, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2 text-red-500">🚫</span>
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 商业模式 */}
        {activeTab === 'business' && (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">商业模式概览</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">盈利模式</p>
                  <p className="text-xl font-bold text-gray-900">{modeLabels[data.businessModel.mode]}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">货币类型</p>
                  <p className="text-xl font-bold text-gray-900">{data.businessModel.pricing.currency}</p>
                </div>
                {data.businessModel.pricing.monthlyPrice && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">月度价格</p>
                    <p className="text-xl font-bold text-green-600">¥{data.businessModel.pricing.monthlyPrice}</p>
                  </div>
                )}
                {data.businessModel.pricing.trialDays && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">试用期</p>
                    <p className="text-xl font-bold text-blue-600">{data.businessModel.pricing.trialDays}天</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">支付方式</h4>
                <div className="flex flex-wrap gap-2">
                  {data.businessModel.paymentMethods.map(method => (
                    <span key={method} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {{ alipay: '支付宝', wechat: '微信支付', creditcard: '信用卡', crypto: '加密货币' }[method]}
                    </span>
                  ))}
                  {data.businessModel.paymentMethods.length === 0 && (
                    <span className="text-sm text-gray-500">未配置</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">收益分配</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">您的收益</span>
                    <span className="font-bold text-green-600">{100 - data.businessModel.platformCommission}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${100 - data.businessModel.platformCommission}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">平台抽成</span>
                    <span className="font-bold text-red-600">{data.businessModel.platformCommission}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 发布前检查 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">✅</span>
          发布前检查清单
        </h3>

        <div className="space-y-3">
          {validationChecks.map((check, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                check.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={check.valid ? 'text-green-500' : 'text-red-500'}>
                  {check.valid ? '✓' : '✗'}
                </span>
                <span className={`font-medium ${check.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {check.label}
                </span>
              </div>
              {!check.valid && (
                <button
                  type="button"
                  onClick={() => onEditStep(check.step)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                >
                  去修改 →
                </button>
              )}
            </div>
          ))}
        </div>

        {!allValid && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ 请完成所有必填项后再发布。点击"去修改"可快速跳转到对应步骤。
            </p>
          </div>
        )}

        {allValid && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              🎉 所有必填项已完成，可以发布您的智能体了！
            </p>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onEditStep(4)}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          ← 返回上一步
        </button>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="px-6 py-2.5 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            编辑配置
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmDialog(true)}
            disabled={!allValid}
            className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 发布智能体
          </button>
        </div>
      </div>

      {/* 确认发布对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">确认发布智能体</h3>
              <p className="text-gray-600">
                您即将发布 "<strong>{data.basicInfo.name}</strong>"，发布后将对所有用户可见。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">智能体名称</span>
                <span className="font-medium">{data.basicInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">角色类型</span>
                <span className="font-medium">{selectedRole?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">启用能力数</span>
                <span className="font-medium">{Object.keys(data.abilities.enabledAbilities).length} 个</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">盈利模式</span>
                <span className="font-medium">{modeLabels[data.businessModel.mode]}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmDialog(false)
                  onPublish()
                }}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                确认发布
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default AgentPreview
