import { useState } from 'react'
import { templates, templateCategories, type Template } from '../../data/mockSphinx'

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void
  selectedTemplateId?: string
}

const TemplateGallery = ({ onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">选择网站模板</h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {templateCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setPreviewTemplate(template)}
            className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
              selectedTemplateId === template.id
                ? 'border-primary-500 ring-2 ring-primary-200'
                : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
              {template.thumbnail}
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {template.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    +{template.features.length - 3}
                  </span>
                )}
              </div>
            </div>

            {selectedTemplateId === template.id && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center center justify-center text-white shadow-lg">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{templateCategories.find(c => c.id === previewTemplate.category)?.icon} {templateCategories.find(c => c.id === previewTemplate.category)?.label}</p>
                </div>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  ✕
                </button>
              </div>

              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-8xl mb-6">
                {previewTemplate.thumbnail}
              </div>

              <p className="text-gray-700 mb-4">{previewTemplate.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">主要功能</h4>
                <div className="grid grid-cols-2 gap-2">
                  {previewTemplate.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-1">适用场景</h4>
                <p className="text-sm text-primary-700">{previewTemplate.suitableFor}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate)
                    setPreviewTemplate(null)
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md"
                >
                  选择此模板
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateGallery
