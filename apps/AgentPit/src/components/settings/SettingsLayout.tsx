import { useState, type ReactNode } from 'react'
import UserProfileSettings from './UserProfileSettings'
import ThemePreferences from './ThemePreferences'
import NotificationSettings from './NotificationSettings'
import PrivacySecurity from './PrivacySecurity'
import HelpCenter from './HelpCenter'

type SettingsSection = 'profile' | 'theme' | 'notifications' | 'privacy' | 'help' | 'about'

interface SettingsLayoutProps {
  children?: ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  const menuItems: { key: SettingsSection; label: string; icon: string; group: string }[] = [
    { key: 'profile', label: '个人资料', icon: '👤', group: '账户' },
    { key: 'theme', label: '主题外观', icon: '🎨', group: '外观' },
    { key: 'notifications', label: '通知设置', icon: '🔔', group: '通知' },
    { key: 'privacy', label: '隐私安全', icon: '🔒', group: '隐私' },
    { key: 'help', label: '帮助中心', icon: '❓', group: '关于' },
    { key: 'about', label: '关于我们', icon: 'ℹ️', group: '关于' },
  ]

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfileSettings />
      case 'theme':
        return <ThemePreferences />
      case 'notifications':
        return <NotificationSettings />
      case 'privacy':
        return <PrivacySecurity />
      case 'help':
        return <HelpCenter />
      case 'about':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">关于我们</h2>
              
              <div className="space-y-8">
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-5xl">🤖</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">AgentPit</h3>
                  <p className="text-gray-600 mb-2">智能体应用平台</p>
                  <p className="text-sm text-gray-500">版本 v2.5.0</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">🎯 我们的使命</h4>
                    <p className="text-gray-700 leading-relaxed">
                      致力于为用户提供最优质的智能体服务体验，通过技术创新让每个人都能轻松使用AI工具，提升工作和生活效率。
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3">💡 核心价值</h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• 用户至上，体验优先</li>
                      <li>• 技术创新，持续进化</li>
                      <li>• 开放协作，共建生态</li>
                      <li>• 安全可靠，值得信赖</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-3">📊 平台数据</h4>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-3xl font-bold text-purple-600">100K+</p>
                        <p className="text-sm text-gray-600">活跃用户</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-purple-600">50+</p>
                        <p className="text-sm text-gray-600">功能模块</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-3">🏆 荣誉成就</h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>🥇 2026年度最佳AI平台</li>
                      <li>⭐ 用户满意度98.5%</li>
                      <li>🚀 日均处理请求1000万+</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <h4 className="font-semibold text-gray-900 mb-4">联系我们</h4>
                  <div className="flex justify-center space-x-8 text-gray-600">
                    <a href="#" className="hover:text-primary-600 transition-colors flex items-center space-x-2">
                      <span>📧</span>
                      <span>contact@example.com</span>
                    </a>
                    <a href="#" className="hover:text-primary-600 transition-colors flex items-center space-x-2">
                      <span>🌐</span>
                      <span>www.example.com</span>
                    </a>
                    <a href="#" className="hover:text-primary-600 transition-colors flex items-center space-x-2">
                      <span>🐦</span>
                      <span>@AgentPit</span>
                    </a>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
                  <p>© 2026 AgentPit. All rights reserved.</p>
                  <p className="mt-1">
                    <a href="#" className="hover:text-primary-600 mr-4">服务条款</a>
                    <a href="#" className="hover:text-primary-600 mr-4">隐私政策</a>
                    <a href="#" className="hover:text-primary-600">开源许可</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-2 text-gray-600">管理您的账户、偏好和系统配置</p>
        </div>

        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <nav className="bg-white rounded-xl shadow-sm sticky top-24 overflow-hidden">
              <div className="p-4 space-y-1">
                {Object.entries(groupedMenu).map(([group, items]) => (
                  <div key={group} className="mb-4 last:mb-0">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {group}
                    </p>
                    {items.map(item => (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                          activeSection === item.key
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                        {activeSection === item.key && (
                          <div className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children || renderContent()}
          </main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
        <div className="flex justify-around px-2 py-2">
          {menuItems.slice(0, 5).map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                activeSection === item.key ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default SettingsLayout
