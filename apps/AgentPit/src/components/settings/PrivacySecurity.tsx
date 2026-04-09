import { useState } from 'react'
import { type SecuritySettings, defaultSecuritySettings } from '../../data/mockSettings'

const PrivacySecurity = () => {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecuritySettings)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSave = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的新密码不一致！')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      alert('密码长度至少为8位！')
      return
    }
    setShowPasswordModal(false)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    handleSave()
  }

  const handleLogoutDevice = (deviceId: string) => {
    if (confirm('确定要登出此设备吗？')) {
      setSettings({
        ...settings,
        devices: settings.devices.filter(d => d.id !== deviceId),
      })
      handleSave()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">隐私和安全</h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 密码修改</h3>
            <p className="text-sm text-gray-500 mb-4">定期更换密码可以提高账户安全性</p>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              修改密码
            </button>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ 两步验证</h3>
            <p className="text-sm text-gray-500 mb-6">
              启用两步验证后，登录时需要额外的验证步骤，大幅提升账户安全性
            </p>

            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 ${settings.twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center text-3xl`}>
                  {settings.twoFactorEnabled ? '✓' : '○'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    两步验证 {settings.twoFactorEnabled ? '已启用' : '未启用'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {settings.twoFactorEnabled ? '您的账户已受到额外保护' : '建议开启以增强安全性'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => {
                    if (!e.target.checked || confirm('确定要关闭两步验证吗？')) {
                      setSettings({ ...settings, twoFactorEnabled: e.target.checked })
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {settings.twoFactorEnabled && (
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">验证方式</label>
                <div className="flex space-x-4">
                  {[
                    { value: 'sms' as const, label: '短信验证', icon: '📱' },
                    { value: 'email' as const, label: '邮箱验证', icon: '📧' },
                  ].map(method => (
                    <button
                      key={method.value}
                      onClick={() => setSettings({ ...settings, twoFactorMethod: method.value })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        settings.twoFactorMethod === method.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl block mb-2">{method.icon}</span>
                      <p className="font-medium text-gray-900">{method.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 登录设备管理</h3>
            <p className="text-sm text-gray-500 mb-6">查看和管理已登录的设备，可以远程登出可疑设备</p>

            <div className="space-y-3">
              {settings.devices.map(device => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-5 rounded-xl border ${
                    device.isCurrentDevice
                      ? 'border-primary-200 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } transition-all`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${
                      device.type === 'desktop' ? 'bg-blue-100' :
                      device.type === 'mobile' ? 'bg-green-100' :
                      'bg-purple-100'
                    } rounded-xl flex items-center justify-center text-2xl`}>
                      {device.type === 'desktop' ? '💻' : device.type === 'mobile' ? '📱' : '📟'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{device.name}</p>
                        {device.isCurrentDevice && (
                          <span className="px-2 py-0.5 bg-primary-200 text-primary-700 rounded text-xs font-medium">
                            当前设备
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {device.os} · {device.browser} · 最后活跃：{new Date(device.lastActive).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  {!device.isCurrentDevice && (
                    <button
                      onClick={() => handleLogoutDevice(device.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      远程登出
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 隐私设置</h3>
            <p className="text-sm text-gray-500 mb-6">控制您的个人信息可见性和活动状态显示</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">个人资料可见性</p>
                  <p className="text-sm text-gray-500 mt-1">控制谁可以查看您的个人资料</p>
                </div>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as SecuritySettings['profileVisibility'] })}
                  className="ml-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="public">公开（所有人可见）</option>
                  <option value="friends">仅好友可见</option>
                  <option value="private">私密（仅自己可见）</option>
                </select>
              </div>

              {[
                { key: 'showOnlineStatus' as const, label: '在线状态显示', desc: '允许他人看到您是否在线', icon: '🟢' },
                { key: 'showReadReceipts' as const, label: '读取回执', desc: '发送者可以看到您是否已读消息', icon: '✓' },
                { key: 'showActivityStatus' as const, label: '活动状态显示', desc: '允许他人看到您正在听/看什么内容', icon: '🎵' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 数据管理</h3>
            <p className="text-sm text-gray-500 mb-6">管理您的个人数据和账户信息</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-left group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  📥
                </div>
                <p className="font-semibold text-gray-900">导出个人数据</p>
                <p className="text-sm text-gray-500 mt-1">下载您的所有数据副本</p>
              </button>

              <button className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all text-left group">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🗑️
                </div>
                <p className="font-semibold text-gray-900">清除浏览历史</p>
                <p className="text-sm text-gray-500 mt-1">删除本地缓存的浏览记录</p>
              </button>

              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  ⚠️
                </div>
                <p className="font-semibold text-red-700">注销账户</p>
                <p className="text-sm text-red-500 mt-1">永久删除您的账户和数据</p>
              </button>
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

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">修改密码</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前密码 *</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="输入当前密码"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码 *</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="输入新密码（至少8位）"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码 *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="再次输入新密码"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>密码要求：</strong><br/>
                  • 至少8个字符<br/>
                  • 包含大小写字母<br/>
                  • 包含数字和特殊字符
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteAccountModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">确定要注销账户？</h3>
              <p className="text-gray-600">此操作不可逆，您的所有数据将被永久删除</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-800 mb-2">注销前请注意：</h4>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>所有个人资料、设置和偏好将被清除</li>
                <li>聊天记录、文件等数据将无法恢复</li>
                <li>已购买的服务和订阅将自动取消</li>
                <li>存在7天的冷静期，期间可撤销注销请求</li>
              </ul>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder='请输入 "DELETE" 确认注销'
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  取消，保留账户
                </button>
                <button
                  onClick={() => {
                    setShowDeleteAccountModal(false)
                    alert('账户注销请求已提交，将在7天后生效。')
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  确认注销
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in z-50">
          <span className="text-2xl">✓</span>
          <span className="font-medium">安全设置保存成功！</span>
        </div>
      )}
    </div>
  )
}

export default PrivacySecurity
