import { useState } from 'react'
import { type UserProfile, defaultUserProfile, presetInterests } from '../../data/mockSettings'

const UserProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [customInterest, setCustomInterest] = useState('')

  const handleSave = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const toggleInterest = (interest: string) => {
    if (profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) })
    } else {
      setProfile({ ...profile, interests: [...profile.interests, interest] })
    }
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !profile.interests.includes(customInterest.trim())) {
      setProfile({ ...profile, interests: [...profile.interests, customInterest.trim()] })
      setCustomInterest('')
    }
  }

  const socialPlatforms = [
    { key: 'wechat' as const, name: '微信', icon: '💬', color: 'bg-green-500' },
    { key: 'qq' as const, name: 'QQ', icon: '🐧', color: 'bg-blue-500' },
    { key: 'weibo' as const, name: '微博', icon: '📱', color: 'bg-red-500' },
    { key: 'github' as const, name: 'GitHub', icon: '💻', color: 'bg-gray-800' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">个人资料</h2>

        <div className="space-y-8">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-5xl font-bold text-white cursor-pointer overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="头像" className="w-full h-full object-cover" />
                ) : (
                  profile.nickname[0]
                )}
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-white text-sm font-medium">更换头像</span>
              </button>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{profile.nickname}</h3>
              <p className="text-gray-500 mt-1">@{profile.email.split('@')[0]}</p>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                上传新头像
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">昵称 *</label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入您的昵称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">真实姓名</label>
              <input
                type="text"
                value={profile.realName}
                onChange={(e) => setProfile({ ...profile, realName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入您的真实姓名（可选）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as UserProfile['gender'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="other">保密</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">生日</label>
              <input
                type="date"
                value={profile.birthday}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">所在地</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例如：北京"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入您的手机号"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入您的邮箱"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="介绍一下自己吧..."
            />
            <p className="text-sm text-gray-500 mt-1 text-right">{profile.bio.length}/200</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">兴趣标签</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    profile.interests.includes(interest)
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                placeholder="添加自定义标签..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={addCustomInterest}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">社交账号绑定</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialPlatforms.map(platform => (
                <div
                  key={platform.key}
                  className={`border-2 rounded-xl p-4 ${
                    profile.socialAccounts[platform.key].bound
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } transition-all`}
                >
                  <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-2`}>
                    {platform.icon}
                  </div>
                  <p className="text-center font-medium text-gray-900 text-sm">{platform.name}</p>
                  {profile.socialAccounts[platform.key].bound ? (
                    <>
                      <p className="text-xs text-green-600 text-center mt-1 truncate">
                        {profile.socialAccounts[platform.key].username}
                      </p>
                      <button className="w-full mt-2 py-1.5 text-xs border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                        已绑定
                      </button>
                    </>
                  ) : (
                    <button className="w-full mt-2 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                      绑定账号
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              保存更改
            </button>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in z-50">
          <span className="text-2xl">✓</span>
          <span className="font-medium">个人资料保存成功！</span>
        </div>
      )}

      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">更换头像</h3>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer">
                <p className="text-5xl mb-4">📷</p>
                <p className="font-medium text-gray-900 mb-2">点击或拖拽上传图片</p>
                <p className="text-sm text-gray-500">支持 JPG、PNG 格式，最大 5MB</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">预览效果</p>
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-2">
                      {profile.nickname[0]}
                    </div>
                    <p className="text-xs text-gray-500">大尺寸</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-2">
                      {profile.nickname[0]}
                    </div>
                    <p className="text-xs text-gray-500">中尺寸</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-2">
                      {profile.nickname[0]}
                    </div>
                    <p className="text-xs text-gray-500">小尺寸</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowAvatarModal(false)
                    handleSave()
                  }}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  确认上传
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileSettings
