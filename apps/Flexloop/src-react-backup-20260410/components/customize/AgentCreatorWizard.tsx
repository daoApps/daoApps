import { useState, useEffect } from 'react'
import BasicInfoForm from './BasicInfoForm'
import AppearanceCustomizer from './AppearanceCustomizer'
import AbilityConfigurator from './AbilityConfigurator'
import BusinessModelSetup from './BusinessModelSetup'
import AgentPreview from './AgentPreview'
import { defaultAgentConfig, type AgentConfig } from '../../data/mockCustomize'

type WizardStep = 1 | 2 | 3 | 4 | 5

const steps = [
  { id: 1, title: '基础信息', icon: '📝', description: '配置名称、角色和目标用户' },
  { id: 2, title: '形象定制', icon: '🎨', description: '设置外观、主题和对话样式' },
  { id: 3, title: '能力配置', icon: '⚡', description: '选择和配置智能体能力' },
  { id: 4, title: '商业模式', icon: '💰', description: '设置盈利模式和定价策略' },
  { id: 5, title: '预览发布', icon: '🚀', description: '预览并发布您的智能体' }
] as const

const AgentCreatorWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(defaultAgentConfig)
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({
    1: false,
    2: true,
    3: true,
    4: true,
    5: true
  })
  const [savedDrafts, setSavedDrafts] = useState<string[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer)
    }
  }, [autoSaveTimer])

  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
    const timer = setTimeout(() => {
      saveDraft()
    }, 5000)
    setAutoSaveTimer(timer)
  }, [agentConfig])

  const updateBasicInfo = (basicInfo: any) => {
    setAgentConfig(prev => ({ ...prev, basicInfo }))
  }

  const updateAppearance = (appearance: any) => {
    setAgentConfig(prev => ({ ...prev, appearance }))
  }

  const updateAbilities = (abilities: any) => {
    setAgentConfig(prev => ({ ...prev, abilities }))
  }

  const updateBusinessModel = (businessModel: any) => {
    setAgentConfig(prev => ({ ...prev, businessModel }))
  }

  const handleValidationChange = (step: number, isValid: boolean) => {
    setStepValidation(prev => ({ ...prev, [step]: isValid }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleJumpToStep = (step: number) => {
    setCurrentStep(step as WizardStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveDraft = () => {
    const draftKey = `draft_${Date.now()}`
    setSavedDrafts(prev => [...prev.slice(-4), draftKey])
    localStorage.setItem('agent_draft', JSON.stringify(agentConfig))
  }

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('agent_draft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setAgentConfig(parsed)
      } catch (e) {
        console.error('Failed to parse draft')
      }
    }
  }

  const handlePublish = () => {
    setShowSuccessModal(true)
  }

  const canProceedToNext = () => {
    if (currentStep === 1) return stepValidation[1]
    return true
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            data={agentConfig.basicInfo}
            onChange={updateBasicInfo}
            onValidationChange={(isValid) => handleValidationChange(1, isValid)}
          />
        )

      case 2:
        return (
          <AppearanceCustomizer
            data={agentConfig.appearance}
            onChange={updateAppearance}
          />
        )

      case 3:
        return (
          <AbilityConfigurator
            data={agentConfig.abilities}
            roleType={agentConfig.basicInfo.roleType}
            onChange={updateAbilities}
          />
        )

      case 4:
        return (
          <BusinessModelSetup
            data={agentConfig.businessModel}
            onChange={updateBusinessModel}
          />
        )

      case 5:
        return (
          <AgentPreview
            data={agentConfig}
            onEditStep={handleJumpToStep}
            onPublish={handlePublish}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🤖 智能体创建向导
          </h1>
          <p className="text-lg text-gray-600">
            跟随引导步骤，轻松打造专属AI智能体
          </p>
        </div>

        {/* 草稿保存提示 */}
        {savedDrafts.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>💾</span>
              <span className="text-sm text-blue-800">已自动保存草稿</span>
              <span className="text-xs text-blue-600">({savedDrafts.length}个版本)</span>
            </div>
            <button
              onClick={loadDraft}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              恢复草稿
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：步骤导航 */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <nav className="space-y-2">
                {steps.map((step) => {
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  const isAccessible = step.id <= currentStep || stepValidation[step.id - 1]

                  return (
                    <button
                      key={step.id}
                      onClick={() => isAccessible && handleJumpToStep(step.id)}
                      disabled={!isAccessible}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                          : isCompleted
                          ? 'text-green-700 bg-green-50 hover:bg-green-100 cursor-pointer'
                          : isAccessible
                          ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                        isCurrent ? 'bg-white/20' :
                        isCompleted ? 'bg-green-500 text-white' :
                        'bg-gray-100'
                      }`}>
                        {isCompleted ? '✓' : step.icon}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{step.title}</p>
                        <p className={`text-xs ${isCurrent ? 'text-white/80' : 'text-gray-500'} truncate`}>
                          {step.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </nav>

              {/* 进度条 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-2 flex justify-between text-xs text-gray-500">
                  <span>完成进度</span>
                  <span>{currentStep}/5 步</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  ></div>
                </div>

                {/* 完成度检查 */}
                <div className="mt-4 space-y-2">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between text-xs">
                      <span className={step.id <= currentStep ? 'text-green-600 font-medium' : 'text-gray-400'}>
                        {step.id < currentStep ? '✓' : step.id === currentStep ? '●' : '○'} {step.title}
                      </span>
                      {step.id === currentStep && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
                          进行中
                        </span>
                      )}
                      {step.id < currentStep && (
                        <span className="text-green-600">已完成</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <button
                  onClick={saveDraft}
                  className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  💾 手动保存草稿
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定要重置所有配置吗？')) {
                      setAgentConfig(defaultAgentConfig)
                      setCurrentStep(1)
                    }
                  }}
                  className="w-full px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  🔄 重置所有配置
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：内容区域 */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              {/* 步骤标题 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">{steps[currentStep - 1].icon}</span>
                  步骤 {currentStep}: {steps[currentStep - 1].title}
                </h2>
                <p className="mt-2 text-gray-600">{steps[currentStep - 1].description}</p>
              </div>

              {/* 步骤内容 */}
              <div className="animate-fadeIn">
                {renderStepContent()}
              </div>

              {/* 导航按钮 */}
              {currentStep < 5 && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    ← 上一步
                  </button>

                  <div className="flex items-center space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index + 1 === currentStep
                            ? 'bg-primary-600 scale-125'
                            : index + 1 < currentStep
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一步 →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 发布成功模态框 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">发布成功！</h2>
            <p className="text-gray-600 mb-6">
              您的智能体 "<strong>{agentConfig.basicInfo.name}</strong>" 已成功发布，
              现在可以在市场上被其他用户发现和使用。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">智能体ID</span>
                <span className="font-mono font-medium">AGENT-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">状态</span>
                <span className="text-green-600 font-medium">✓ 已上线</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">访问链接</span>
                <a href="#" className="text-primary-600 hover:underline font-medium">查看 →</a>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                继续编辑
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  window.location.href = '/customize/my-agents'
                }}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
              >
                查看我的智能体
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default AgentCreatorWizard
