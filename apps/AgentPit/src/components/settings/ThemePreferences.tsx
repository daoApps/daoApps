import { useState } from 'react'
import { type ThemeSettings, defaultThemeSettings } from '../../data/mockSettings'

const ThemePreferences = () => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const themeModes = [
    { value: 'light' as const, label: '浅色模式', icon: '☀️', desc: '明亮清爽的界面风格' },
    { value: 'dark' as const, label: '深色模式', icon: '🌙', desc: '护眼舒适的暗色主题' },
    { value: 'system' as const, label: '跟随系统', icon: '💻', desc: '自动适应系统设置' },
  ]

  const fontSizes = [
    { value: 'small' as const, label: '小', size: '14px', preview: '示例文字 Aa' },
    { value: 'medium' as const, label: '中', size: '16px', preview: '示例文字 Aa' },
    { value: 'large' as const, label: '大', size: '18px', preview: '示例文字 Aa' },
    { value: 'xlarge' as const, label: '特大', size: '20px', preview: '示例文字 Aa' },
  ]

  const layoutDensities = [
    { value: 'comfortable' as const, label: '舒适', desc: '适中的间距和留白' },
    { value: 'compact' as const, label: '紧凑', desc: '更紧凑的布局，显示更多内容' },
    { value: 'spacious' as const, label: '宽松', desc: '更大的间距，更轻松的视觉体验' },
  ]

  const sidebarModes = [
    { value: 'always' as const, label: '始终显示', icon: '📌' },
    { value: 'auto' as const, label: '自动隐藏', icon: '👁️' },
    { value: 'hidden' as const, label: '不显示', icon: '🚫' },
  ]

  const presetColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#64748b', '#000000',
  ]

  const handleSave = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">主题和外观</h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">主题模式</h3>
            <div className="grid grid-cols-3 gap-4">
              {themeModes.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setSettings({ ...settings, mode: mode.value })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    settings.mode === mode.value
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-4xl block mb-3">{mode.icon}</span>
                  <p className="font-semibold text-gray-900">{mode.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{mode.desc}</p>
                  {settings.mode === mode.value && (
                    <div className="mt-3 flex items-center justify-center space-x-1 text-primary-600">
                      <span>✓</span>
                      <span className="text-sm font-medium">已选择</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">自定义主题色</h3>
            <div className="flex items-center space-x-6">
              <div className="flex flex-wrap gap-3">
                {presetColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSettings({ ...settings, primaryColor: color })}
                    className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 ${
                      settings.primaryColor === color ? 'ring-4 ring-offset-2 ring-primary-300 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">自定义颜色</label>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">字体大小</h3>
            <div className="grid grid-cols-4 gap-4">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => setSettings({ ...settings, fontSize: size.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.fontSize === size.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <p style={{ fontSize: size.size }} className="font-medium text-gray-900 mb-1">{size.preview}</p>
                  <p className="text-sm text-gray-500">{size.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">布局密度</h3>
            <div className="grid grid-cols-3 gap-4">
              {layoutDensities.map(density => (
                <button
                  key={density.value}
                  onClick={() => setSettings({ ...settings, layoutDensity: density.value })}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    settings.layoutDensity === density.value
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <p className="font-semibold text-gray-900 mb-1">{density.label}</p>
                  <p className="text-sm text-gray-500">{density.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">侧边栏设置</h3>
            <div className="grid grid-cols-3 gap-4">
              {sidebarModes.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setSettings({ ...settings, sidebarMode: mode.value })}
                  className={`p-5 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    settings.sidebarMode === mode.value
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{mode.icon}</span>
                  <p className="font-semibold text-gray-900">{mode.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">♿</div>
                <div>
                  <h4 className="font-semibold text-gray-900">减少动画模式</h4>
                  <p className="text-sm text-gray-600 mt-1">减少或关闭动画效果，提升无障碍访问体验，适合对动态效果敏感的用户</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => setSettings({ ...settings, reduceMotion: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">实时预览</h3>
            <div className={`rounded-xl p-6 ${settings.mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-2 ${settings.layoutDensity === 'compact' ? 'p-4' : settings.layoutDensity === 'spacious' ? 'p-8' : 'p-6'}`}>
              <div className="space-y-4" style={{ fontSize: settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : settings.fontSize === 'xlarge' ? '20px' : '16px' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: settings.primaryColor }}>
                    U
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-24 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-9 rounded-lg flex-1" style={{ backgroundColor: settings.primaryColor }}></div>
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg px-4 w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in z-50">
          <span className="text-2xl">✓</span>
          <span className="font-medium">主题设置保存成功！</span>
        </div>
      )}
    </div>
  )
}

export default ThemePreferences
