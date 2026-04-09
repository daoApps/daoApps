import { useState } from 'react'
import TemplateGallery from './TemplateGallery'
import AISiteBuilder from './AISiteBuilder'
import SitePreview from './SitePreview'
import PublishPanel from './PublishPanel'
import type { Template, SiteConfig } from '../../data/mockSphinx'

type WizardStep = 1 | 2 | 3 | 4

const steps = [
  { id: 1, title: '选择模板', icon: '🎨', description: '选择适合的网站模板' },
  { id: 2, title: '配置信息', icon: '⚙️', description: '填写网站基本信息' },
  { id: 3, title: 'AI 定制', icon: '🤖', description: 'AI 辅助优化网站' },
  { id: 4, title: '预览发布', icon: '🚀', description: '预览并发布网站' }
] as const

const SiteWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [siteConfig, setSiteConfig] = useState<Partial<SiteConfig>>({
    siteName: '',
    description: ''
  })

  const canProceedToStep2 = selectedTemplate !== null
  const canProceedToStep3 = siteConfig.siteName?.trim() && siteConfig.description?.trim()

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as WizardStep)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep)
    }
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setSiteConfig(prev => ({ ...prev, templateId: template.id }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fadeIn">
            <TemplateGallery
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplate?.id}
            />
          </div>
        )

      case 2:
        return (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">基本信息配置</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站名称 *
                  </label>
                  <input
                    type="text"
                    value={siteConfig.siteName || ''}
                    onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                    placeholder="例如：我的个人博客"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站描述 *
                  </label>
                  <textarea
                    value={siteConfig.description || ''}
                    onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                    placeholder="简要描述您的网站内容和用途..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                {selectedTemplate && (
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
                    <p className="text-sm font-medium text-primary-900 mb-1">已选模板</p>
                    <p className="text-sm text-primary-700">
                      {selectedTemplate.thumbnail} {selectedTemplate.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">高级选项</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">启用 SEO 优化</p>
                    <p className="text-sm text-gray-600">自动优化搜索引擎排名</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">响应式设计</p>
                    <p className="text-sm text-gray-600">自动适配各种设备屏幕</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">启用分析统计</p>
                    <p className="text-sm text-gray-600">追踪访问数据和用户行为</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="animate-fadeIn" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
            <AISiteBuilder onSiteConfigGenerated={(config) => {
              setSiteConfig(prev => ({ ...prev, ...config }))
            }} />
          </div>
        )

      case 4:
        return (
          <div className="animate-fadeIn space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👁️</span>
                  网站预览
                </h3>
                <div style={{ height: '500px' }}>
                  <SitePreview
                    siteName={siteConfig.siteName}
                    templateId={selectedTemplate?.id}
                  />
                </div>
              </div>

              <div>
                <PublishPanel siteConfig={siteConfig} />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏛️ Sphinx 快速建站向导
          </h1>
          <p className="text-gray-600">
            跟随向导步骤，快速创建专业的网站
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <nav className="space-y-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (step.id === 1 || (step.id === 2 && canProceedToStep2) || (step.id === 3 && canProceedToStep3) || step.id === 4) {
                        setCurrentStep(step.id as WizardStep)
                      }
                    }}
                    disabled={
                      (step.id === 2 && !canProceedToStep2) ||
                      (step.id === 3 && !canProceedToStep3) ||
                      (step.id === 4 && !canProceedToStep3)
                    }
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      currentStep === step.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                        : step.id < currentStep || (step.id === 2 && canProceedToStep2) || (step.id === 3 && canProceedToStep3)
                        ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      currentStep === step.id ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {step.id < currentStep ? '✓' : step.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{step.title}</p>
                      <p className={`text-xs ${currentStep === step.id ? 'text-white/80' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-2 flex justify-between text-xs text-gray-500">
                  <span>进度</span>
                  <span>{currentStep}/4</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              {renderStepContent()}

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

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !canProceedToStep2) ||
                      (currentStep === 2 && !canProceedToStep3)
                    }
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一步 →
                  </button>
                ) : (
                  <button
                    onClick={() => alert('🎉 恭喜！网站创建完成！')}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    ✨ 完成建站
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default SiteWizard
