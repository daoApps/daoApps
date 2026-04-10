import { useState } from 'react'
import { type NotificationSettings, defaultNotificationSettings } from '../../data/mockSettings'

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const notificationChannels = [
    { key: 'browserPush' as const, label: '浏览器推送', icon: '🔔', desc: '在浏览器中接收实时通知' },
    { key: 'emailNotification' as const, label: '邮件通知', icon: '📧', desc: '通过电子邮件接收重要更新' },
    { key: 'smsNotification' as const, label: '短信通知', icon: '📱', desc: '接收紧急事项短信提醒' },
    { key: 'inAppNotification' as const, label: '应用内通知', icon: '💬', desc: '在应用内部显示通知消息' },
  ]

  const notificationTypes = [
    {
      key: 'systemNotifications' as const,
      title: '系统通知',
      icon: '⚙️',
      desc: '系统更新、维护公告等重要信息',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      key: 'socialInteractions' as const,
      title: '社交互动',
      icon: '💬',
      desc: '点赞、评论、关注、好友请求等互动提醒',
      color: 'bg-pink-100 text-pink-700',
    },
    {
      key: 'transactionAlerts' as const,
      title: '交易通知',
      icon: '💰',
      desc: '收款、付款、退款等财务变动提醒',
      color: 'bg-green-100 text-green-700',
    },
    {
      key: 'meetingReminders' as const,
      title: '会议提醒',
      icon: '📅',
      desc: '会议开始前的提醒通知',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      key: 'marketingMessages' as const,
      title: '营销活动',
      icon: '🎁',
      desc: '优惠活动、新功能介绍等推广信息',
      color: 'bg-orange-100 text-orange-700',
    },
  ]

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
  )

  const handleSave = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">通知设置</h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">通知渠道</h3>
            <p className="text-sm text-gray-500 mb-6">选择您希望接收通知的方式</p>

            <div className="space-y-4">
              {notificationChannels.map(channel => (
                <div
                  key={channel.key}
                  className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {channel.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{channel.label}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{channel.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings[channel.key]}
                    onChange={(checked) => setSettings({ ...settings, [channel.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">通知类型</h3>
            <p className="text-sm text-gray-500 mb-6">精细控制各类通知的接收</p>

            <div className="space-y-3">
              {notificationTypes.map(type => (
                <div
                  key={type.key}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${type.color}`}>
                      {type.icon} {type.title}
                    </span>
                    <span className="text-sm text-gray-500 hidden md:block">{type.desc}</span>
                  </div>
                  <ToggleSwitch
                    checked={settings[type.key]}
                    onChange={(checked) => setSettings({ ...settings, [type.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">免打扰时间段</h3>
            <p className="text-sm text-gray-500 mb-6">在此时间段内将不会收到非紧急通知</p>

            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                <input
                  type="time"
                  value={settings.doNotDisturbStart}
                  onChange={(e) => setSettings({ ...settings, doNotDisturbStart: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <span className="text-2xl text-gray-400 pb-3">→</span>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                <input
                  type="time"
                  value={settings.doNotDisturbEnd}
                  onChange={(e) => setSettings({ ...settings, doNotDisturbEnd: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 pb-3.5">
                <p className="text-sm text-blue-700 font-medium">
                  {settings.doNotDisturbStart} - {settings.doNotDisturbEnd}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">频率限制</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📧 邮件接收频率
                </label>
                <select
                  value={settings.emailFrequency}
                  onChange={(e) => setSettings({ ...settings, emailFrequency: e.target.value as NotificationSettings['emailFrequency'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="realtime">实时接收</option>
                  <option value="daily">每日汇总（推荐）</option>
                  <option value="weekly">每周汇总</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📱 短信数量限制
                </label>
                <select
                  value={settings.smsFrequency}
                  onChange={(e) => setSettings({ ...settings, smsFrequency: e.target.value as NotificationSettings['smsFrequency'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="unlimited">不限制</option>
                  <option value="max5">每天最多5条</option>
                  <option value="max10">每天最多10条</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">温馨提示</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>关闭浏览器推送需要在系统设置中授权</li>
                  <li>会议提醒建议保持开启，以免错过重要日程</li>
                  <li>营销消息关闭后将不再收到优惠信息</li>
                  <li>紧急安全通知不受免打扰时间限制</li>
                </ul>
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
          <span className="font-medium">通知设置保存成功！</span>
        </div>
      )}
    </div>
  )
}

export default NotificationSettings
