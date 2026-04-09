import { useState, useEffect } from 'react'
import { roleTemplates } from '../../data/mockCustomize'

interface BasicInfoFormProps {
  data: {
    name: string
    description: string
    roleType: string
    targetUsers: string
    language: string
  }
  onChange: (data: any) => void
  onValidationChange: (isValid: boolean) => void
}

const BasicInfoForm = ({ data, onChange, onValidationChange }: BasicInfoFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [nameChecking, setNameChecking] = useState(false)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    validateForm()
  }, [data])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.name.trim()) {
      newErrors.name = '请输入智能体名称'
    } else if (data.name.length < 2 || data.name.length > 20) {
      newErrors.name = '名称长度应在2-20个字符之间'
    }

    if (!data.description.trim()) {
      newErrors.description = '请输入智能体描述'
    } else if (data.description.length < 10 || data.description.length > 500) {
      newErrors.description = '描述长度应在10-500个字符之间'
    }

    if (!data.roleType) {
      newErrors.roleType = '请选择角色类型'
    }

    if (!data.targetUsers.trim()) {
      newErrors.targetUsers = '请描述目标用户群体'
    }

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0 && nameAvailable !== false
    onValidationChange(isValid)
  }

  const handleNameChange = (value: string) => {
    onChange({ ...data, name: value })
    setNameAvailable(null)

    if (value.trim().length >= 2) {
      setNameChecking(true)
      setTimeout(() => {
        const isAvailable = !['法律小助手', '编程大师', '学习伴侣'].includes(value.trim())
        setNameAvailable(isAvailable)
        setNameChecking(false)
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, name: '该名称已被使用' }))
        }
      }, 800)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">📝</span>
          基础信息配置
        </h3>

        <div className="space-y-6">
          {/* 智能体名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              智能体名称 *
              {data.name && (
                <span className="ml-2 text-xs text-gray-500">
                  ({data.name.length}/20)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="例如：法律小助手、编程大师..."
                maxLength={20}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {nameChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                </div>
              )}
              {nameAvailable === true && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  ✓
                </div>
              )}
              {nameAvailable === false && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  ✗
                </div>
              )}
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            {!errors.name && data.name && nameAvailable === true && (
              <p className="mt-1 text-sm text-green-600">✓ 名称可用</p>
            )}
          </div>

          {/* 智能体描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              智能体简介/描述 *
              {data.description && (
                <span className="ml-2 text-xs text-gray-500">
                  ({data.description.length}/500)
                </span>
              )}
            </label>
            <textarea
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              placeholder="详细描述您的智能体的功能、特点和适用场景..."
              rows={4}
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* 角色类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              角色类型 *
            </label>
            <select
              value={data.roleType}
              onChange={(e) => onChange({ ...data, roleType: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.roleType ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">请选择角色类型...</option>
              {roleTemplates.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.icon} {role.name} - {role.description}
                </option>
              ))}
            </select>
            {errors.roleType && (
              <p className="mt-1 text-sm text-red-600">{errors.roleType}</p>
            )}
            {data.roleType && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>推荐能力：</strong>{' '}
                  {roleTemplates.find(r => r.id === data.roleType)?.recommendedAbilities.map(abilityId => {
                    const abilityNames: Record<string, string> = {
                      'conversation-understanding': '对话理解',
                      'context-memory': '上下文记忆',
                      'web-search': '网络搜索',
                      'file-processing': '文件处理',
                      'legal-advice': '法律咨询',
                      'medical-info': '医疗信息',
                      'emotion-recognition': '情感识别',
                      'financial-analysis': '金融分析',
                      'education-tutoring': '教育辅导',
                      'coding-assistant': '编程助手',
                      'code-execution': '代码执行',
                      'api-integration': 'API集成',
                      'poetry-writing': '诗歌创作',
                      'story-writing': '故事编写',
                      'brainstorming': '头脑风暴',
                      'design-suggestions': '设计建议',
                      'image-analysis': '图像分析',
                      'data-analysis': '数据分析'
                    }
                    return abilityNames[abilityId] || abilityId
                  }).join('、')}
                </p>
              </div>
            )}
          </div>

          {/* 目标用户群体 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标用户群体 *
            </label>
            <textarea
              value={data.targetUsers}
              onChange={(e) => onChange({ ...data, targetUsers: e.target.value })}
              placeholder="描述您的智能体主要服务哪些用户群体，例如：企业法务人员、学生、开发者等..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.targetUsers ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.targetUsers && (
              <p className="mt-1 text-sm text-red-600">{errors.targetUsers}</p>
            )}
          </div>

          {/* 语言设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语言设置
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'chinese', label: '中文', icon: '🇨🇳' },
                { value: 'english', label: '英文', icon: '🇺🇸' },
                { value: 'multilingual', label: '多语言', icon: '🌍' }
              ].map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => onChange({ ...data, language: lang.value })}
                  className={`px-4 py-3 border rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    data.language === lang.value
                      ? 'bg-primary-50 border-primary-500 text-primary-700 ring-2 ring-primary-200'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-blue-900 mb-1">填写建议</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>名称应简洁易记，体现智能体特点</li>
              <li>描述要清晰说明功能和价值主张</li>
              <li>角色类型会影响后续能力推荐的准确性</li>
              <li>明确目标用户有助于优化交互体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoForm
