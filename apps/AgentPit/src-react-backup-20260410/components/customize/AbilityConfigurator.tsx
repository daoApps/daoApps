import { useState, useEffect } from 'react'
import { abilities, roleTemplates, type Ability } from '../../data/mockCustomize'

interface AbilityConfiguratorProps {
  data: {
    enabledAbilities: { [key: string]: Ability & { level: string; enabled: boolean } }
    systemPrompt: string
    exampleConversations: string[]
    restrictions: string[]
  }
  roleType: string
  onChange: (data: any) => void
}

const AbilityConfigurator = ({ data, roleType, onChange }: AbilityConfiguratorProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'professional' | 'tool' | 'creative'>('general')
  const [showSkillStore, setShowSkillStore] = useState(false)
  const [newRestriction, setNewRestriction] = useState('')
  const [newExample, setNewExample] = useState('')

  const tabs = [
    { id: 'general', label: '通用能力', icon: '🎯', count: abilities.filter(a => a.category === 'general').length },
    { id: 'professional', label: '专业能力', icon: '💼', count: abilities.filter(a => a.category === 'professional').length },
    { id: 'tool', label: '工具调用', icon: '🔧', count: abilities.filter(a => a.category === 'tool').length },
    { id: 'creative', label: '创意能力', icon: '✨', count: abilities.filter(a => a.category === 'creative').length }
  ]

  const levelLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家'
  }

  const levelColors = {
    beginner: 'bg-gray-200 text-gray-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
    expert: 'bg-yellow-100 text-yellow-700'
  }

  const filteredAbilities = abilities.filter(ability => ability.category === activeTab)

  const recommendedAbilities = roleTemplates.find(r => r.id === roleType)?.recommendedAbilities || []

  const handleToggleAbility = (abilityId: string) => {
    const currentAbility = data.enabledAbilities[abilityId]
    if (currentAbility?.enabled) {
      const newEnabled = { ...data.enabledAbilities }
      delete newEnabled[abilityId]
      onChange({ ...data, enabledAbilities: newEnabled })
    } else {
      const ability = abilities.find(a => a.id === abilityId)
      if (ability) {
        onChange({
          ...data,
          enabledAbilities: {
            ...data.enabledAbilities,
            [abilityId]: {
              ...ability,
              enabled: true,
              level: ability.level
            }
          }
        })
      }
    }
  }

  const handleChangeLevel = (abilityId: string, level: string) => {
    onChange({
      ...data,
      enabledAbilities: {
        ...data.enabledAbilities,
        [abilityId]: {
          ...data.enabledAbilities[abilityId],
          level
        }
      }
    })
  }

  const handleAddRecommendation = () => {
    const newEnabled = { ...data.enabledAbilities }
    recommendedAbilities.forEach(abilityId => {
      const ability = abilities.find(a => a.id === abilityId)
      if (ability && !newEnabled[abilityId]) {
        newEnabled[abilityId] = {
          ...ability,
          enabled: true,
          level: ability.level
        }
      }
    })
    onChange({ ...data, enabledAbilities: newEnabled })
  }

  const handleAddRestriction = () => {
    if (newRestriction.trim()) {
      onChange({
        ...data,
        restrictions: [...data.restrictions, newRestriction.trim()]
      })
      setNewRestriction('')
    }
  }

  const handleRemoveRestriction = (index: number) => {
    onChange({
      ...data,
      restrictions: data.restrictions.filter((_, i) => i !== index)
    })
  }

  const handleAddExample = () => {
    if (newExample.trim()) {
      onChange({
        ...data,
        exampleConversations: [...data.exampleConversations, newExample.trim()]
      })
      setNewExample('')
    }
  }

  const handleRemoveExample = (index: number) => {
    onChange({
      ...data,
      exampleConversations: data.exampleConversations.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      {/* 能力分类标签页 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">⚡</span>
            能力配置
          </h3>
          <button
            type="button"
            onClick={handleAddRecommendation}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            ✨ 应用推荐配置
          </button>
        </div>

        {/* 标签导航 */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {tabs.map((tab) => (
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
              <span className="ml-1.5 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* 能力列表 */}
        <div className="space-y-3">
          {filteredAbilities.map((ability) => {
            const isEnabled = data.enabledAbilities[ability.id]?.enabled
            const currentLevel = data.enabledAbilities[ability.id]?.level || ability.level

            const checkDependencies = () => {
              if (!ability.dependencies || ability.dependencies.length === 0) return null
              const missingDeps = ability.dependencies.filter(dep => !data.enabledAbilities[dep]?.enabled)
              if (missingDeps.length > 0) {
                return (
                  <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    ⚠️ 需要先启用：{missingDeps.map(dep => abilities.find(a => a.id === dep)?.name).join('、')}
                  </div>
                )
              }
              return null
            }

            return (
              <div
                key={ability.id}
                className={`p-4 border rounded-lg transition-all ${
                  isEnabled
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* 开关 */}
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleAbility(ability.id)}
                        disabled={ability.dependencies && ability.dependencies.some(dep => !data.enabledAbilities[dep]?.enabled)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        isEnabled ? 'bg-primary-600' : 'bg-gray-300'
                      } ${ability.dependencies && ability.dependencies.some(dep => !data.enabledAbilities[dep]?.enabled) ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>

                    {/* 能力信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{ability.name}</h4>
                        {ability.isPremium && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            💰 ¥{ability.price}/月
                          </span>
                        )}
                        {recommendedAbilities.includes(ability.id) && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            推荐
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{ability.description}</p>
                      {checkDependencies()}
                    </div>
                  </div>

                  {/* 等级选择 */}
                  {isEnabled && (
                    <div className="ml-4">
                      <select
                        value={currentLevel}
                        onChange={(e) => handleChangeLevel(ability.id, e.target.value)}
                        className={`px-3 py-1.5 border rounded-lg text-sm font-medium ${levelColors[currentLevel as keyof typeof levelColors]}`}
                      >
                        {Object.entries(levelLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 技能商店入口 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowSkillStore(!showSkillStore)}
            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all flex items-center justify-center space-x-2"
          >
            <span>🛒</span>
            <span>技能商店 - 解锁更多高级能力</span>
            <span>({abilities.filter(a => a.isPremium).length}个付费技能)</span>
          </button>

          {showSkillStore && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {abilities.filter(a => a.isPremium).map((ability) => (
                <div
                  key={ability.id}
                  className="p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{ability.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{ability.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-yellow-600">¥{ability.price}/月</span>
                    <button
                      type="button"
                      onClick={() => handleToggleAbility(ability.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        data.enabledAbilities[ability.id]?.enabled
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}
                    >
                      {data.enabledAbilities[ability.id]?.enabled ? '已购买' : '立即解锁'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 自定义指令编辑器 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📋</span>
          自定义指令配置
        </h3>

        <div className="space-y-4">
          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt (系统提示词)
            </label>
            <textarea
              value={data.systemPrompt}
              onChange={(e) => onChange({ ...data, systemPrompt: e.target.value })}
              placeholder="定义智能体的行为准则、性格特点和响应风格...&#10;&#10;示例：&#10;你是一个专业的法律咨询助手，需要：&#10;1. 使用专业但易懂的语言&#10;2. 始终提醒用户咨询专业律师&#10;3. 保持客观中立的立场"
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm resize-none"
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">支持 Markdown 格式，将作为智能体的核心行为指导</p>
          </div>

          {/* 示例对话 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              示例对话配置
            </label>
            <div className="space-y-2 mb-3">
              {data.exampleConversations.map((example, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm text-gray-700">{example}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExample(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExample()}
                placeholder="添加示例对话..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddExample}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
              >
                添加
              </button>
            </div>
          </div>

          {/* 禁止事项 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              禁止事项设定
            </label>
            <div className="space-y-2 mb-3">
              {data.restrictions.map((restriction, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                  <span className="text-red-500">🚫</span>
                  <span className="flex-1 text-sm text-gray-700">{restriction}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRestriction(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRestriction()}
                placeholder="添加禁止事项，例如：不提供医疗诊断..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddRestriction}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 已启用能力统计 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(data.enabledAbilities).length}</p>
            <p className="text-xs text-gray-600">已启用能力</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Object.values(data.enabledAbilities).filter(a => !a.isPremium).length}
            </p>
            <p className="text-xs text-gray-600">免费能力</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {Object.values(data.enabledAbilities).filter(a => a.isPremium).length}
            </p>
            <p className="text-xs text-gray-600">付费能力</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              ¥{Object.values(data.enabledAbilities).filter(a => a.isPremium).reduce((sum, a) => sum + (a.price || 0), 0)}/月
            </p>
            <p className="text-xs text-gray-600">能力费用</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AbilityConfigurator
