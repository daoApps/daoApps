import { useState } from 'react'
import { avatarLibrary, themeColors, type Avatar, type ThemeColor } from '../../data/mockCustomize'

interface AppearanceCustomizerProps {
  data: {
    avatarId: string
    customAvatar?: string
    themeId: string
    customColors?: {
      primary: string
      secondary: string
      accent: string
    }
    bubbleStyle: {
      borderRadius: number
      opacity: number
      borderStyle: string
    }
    fontFamily: string
    greeting: string
  }
  onChange: (data: any) => void
}

const AppearanceCustomizer = ({ data, onChange }: AppearanceCustomizerProps) => {
  const [activeAvatarCategory, setActiveAvatarCategory] = useState<string>('all')
  const [showCustomUpload, setShowCustomUpload] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [useCustomColors, setUseCustomColors] = useState(false)

  const avatarCategories = [
    { id: 'all', label: '全部', icon: '📋' },
    { id: 'person', label: '人物', icon: '👤' },
    { id: 'animal', label: '动物', icon: '🐾' },
    { id: 'abstract', label: '抽象', icon: '✨' },
    { id: 'tech', label: '科技', icon: '💡' }
  ]

  const filteredAvatars = activeAvatarCategory === 'all'
    ? avatarLibrary
    : avatarLibrary.filter(avatar => avatar.category === activeAvatarCategory)

  const selectedTheme = themeColors.find(t => t.id === data.themeId)
  const currentPrimary = useCustomColors && data.customColors?.primary
    ? data.customColors.primary
    : selectedTheme?.primary || '#3B82F6'
  const currentSecondary = useCustomColors && data.customColors?.secondary
    ? data.customColors.secondary
    : selectedTheme?.secondary || '#60A5FA'

  const handleAIGenerate = () => {
    setIsGeneratingAI(true)
    setTimeout(() => {
      const randomAvatar = avatarLibrary[Math.floor(Math.random() * avatarLibrary.length)]
      onChange({ ...data, avatarId: randomAvatar.id })
      setIsGeneratingAI(false)
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange({ ...data, customAvatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：配置区域 */}
        <div className="space-y-6">
          {/* 头像设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🖼️</span>
              头像设置
            </h3>

            {/* 分类标签 */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              {avatarCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveAvatarCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeAvatarCategory === cat.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* 头像网格 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              {filteredAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => onChange({ ...data, avatarId: avatar.id })}
                  className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center text-2xl ${
                    data.avatarId === avatar.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={avatar.name}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3">
              <label className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium">
                📤 上传图片
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGeneratingAI}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI生成中...
                  </span>
                ) : (
                  '🎨 AI生成头像'
                )}
              </button>
            </div>

            {data.customAvatar && (
              <div className="mt-3 relative inline-block">
                <img
                  src={data.customAvatar}
                  alt="自定义头像"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...data, customAvatar: undefined })}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* 主题配色 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎨</span>
              主题配色
            </h3>

            <div className="mb-4">
              <label className="flex items-center space-x-2 mb-3">
                <input
                  type="checkbox"
                  checked={useCustomColors}
                  onChange={(e) => setUseCustomColors(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">使用自定义颜色</span>
              </label>
            </div>

            {!useCustomColors ? (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onChange({ ...data, themeId: theme.id })}
                      className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        data.themeId === theme.id
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-full h-12 rounded-md mb-2"
                        style={{ background: theme.preview }}
                      ></div>
                      <p className="text-xs font-medium text-gray-700 text-center">{theme.name}</p>
                      {data.themeId === theme.id && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">主色调</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={data.customColors?.primary || '#3B82F6'}
                      onChange={(e) => onChange({
                        ...data,
                        customColors: {
                          ...data.customColors,
                          primary: e.target.value
                        }
                      })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.customColors?.primary || '#3B82F6'}
                      onChange={(e) => onChange({
                        ...data,
                        customColors: {
                          ...data.customColors,
                          primary: e.target.value
                        }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">辅助色</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={data.customColors?.secondary || '#60A5FA'}
                      onChange={(e) => onChange({
                        ...data,
                        customColors: {
                          ...data.customColors,
                          secondary: e.target.value
                        }
                      })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.customColors?.secondary || '#60A5FA'}
                      onChange={(e) => onChange({
                        ...data,
                        customColors: {
                          ...data.customColors,
                          secondary: e.target.value
                        }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">强调色</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={data.customColors?.accent || '#2563EB'}
                      onChange={(e) => onChange({
                        ...data,
                        customColors: {
                          ...data.customColors,
                          accent: e.target.value
                        }
                      })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.customColors?.accent || '#2563EB'}
                      onChange={(e) => onChange({
                        ...data,
                        customColors: {
                          ...data.customColors,
                          accent: e.target.value
                        }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：预览和更多设置 */}
        <div className="space-y-6">
          {/* 实时预览窗口 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👁️</span>
              外观预览
            </h3>

            <div
              className="rounded-xl p-6 min-h-[400px] relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${currentPrimary}10, ${currentSecondary}10)`
              }}
            >
              {/* 模拟对话界面 */}
              <div className="space-y-4">
                {/* 智能体消息 */}
                <div className="flex items-start space-x-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: `${currentPrimary}20`,
                      border: `2px solid ${currentPrimary}`
                    }}
                  >
                    {data.avatarId ? avatarLibrary.find(a => a.id === data.avatarId)?.emoji || '🤖' : '🤖'}
                  </div>
                  <div
                    className="max-w-[80%] px-4 py-3 relative"
                    style={{
                      backgroundColor: currentPrimary,
                      color: 'white',
                      borderRadius: `${data.bubbleStyle.borderRadius}px`,
                      opacity: data.bubbleStyle.opacity,
                      border: data.bubbleStyle.borderStyle !== 'none' ? `2px solid ${currentPrimary}` : 'none',
                      fontFamily: data.fontFamily
                    }}
                  >
                    <p>{data.greeting || '你好！我是您的智能助手'}</p>
                  </div>
                </div>

                {/* 用户消息 */}
                <div className="flex items-start space-x-3 justify-end">
                  <div
                    className="max-w-[80%] px-4 py-3 bg-gray-100 text-gray-800"
                    style={{
                      borderRadius: `${data.bubbleStyle.borderRadius}px`,
                      fontFamily: data.fontFamily
                    }}
                  >
                    <p>你好！我想了解一下...</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl flex-shrink-0">
                    👤
                  </div>
                </div>

                {/* 智能体回复 */}
                <div className="flex items-start space-x-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: `${currentPrimary}20`,
                      border: `2px solid ${currentPrimary}`
                    }}
                  >
                    {data.avatarId ? avatarLibrary.find(a => a.id === data.avatarId)?.emoji || '🤖' : '🤖'}
                  </div>
                  <div
                    className="max-w-[80%] px-4 py-3"
                    style={{
                      backgroundColor: currentPrimary,
                      color: 'white',
                      borderRadius: `${data.bubbleStyle.borderRadius}px`,
                      opacity: data.bubbleStyle.opacity,
                      fontFamily: data.fontFamily
                    }}
                  >
                    <p>很高兴为您服务！请告诉我您需要什么帮助？</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 对话气泡样式 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">💬</span>
              对话气泡样式
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  圆角大小 ({data.bubbleStyle.borderRadius}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={data.bubbleStyle.borderRadius}
                  onChange={(e) => onChange({
                    ...data,
                    bubbleStyle: {
                      ...data.bubbleStyle,
                      borderRadius: parseInt(e.target.value)
                    }
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  透明度 ({Math.round(data.bubbleStyle.opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={data.bubbleStyle.opacity * 100}
                  onChange={(e) => onChange({
                    ...data,
                    bubbleStyle: {
                      ...data.bubbleStyle,
                      opacity: parseInt(e.target.value) / 100
                    }
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">边框样式</label>
                <select
                  value={data.bubbleStyle.borderStyle}
                  onChange={(e) => onChange({
                    ...data,
                    bubbleStyle: {
                      ...data.bubbleStyle,
                      borderStyle: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="none">无边框</option>
                  <option value="solid">实线边框</option>
                  <option value="dashed">虚线边框</option>
                  <option value="dotted">点线边框</option>
                </select>
              </div>
            </div>
          </div>

          {/* 字体和问候语 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">✏️</span>
              字体与问候语
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">字体样式</label>
                <select
                  value={data.fontFamily}
                  onChange={(e) => onChange({ ...data, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="system-ui">系统默认字体</option>
                  <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
                  <option value="'PingFang SC', sans-serif">苹方字体</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia (衬线)</option>
                  <option value="'Courier New', monospace">Courier New (等宽)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个性化问候语
                </label>
                <textarea
                  value={data.greeting}
                  onChange={(e) => onChange({ ...data, greeting: e.target.value })}
                  placeholder="输入智能体的开场白..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">{data.greeting.length}/200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppearanceCustomizer
