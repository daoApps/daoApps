import { useState } from 'react'
import type { Agent } from '../../data/mockCollaboration'

interface AgentConfigPanelProps {
  agent: Agent
  onSave: (config: Partial<Agent>) => void
  onClose: () => void
}

const availableTools = [
  { id: 'search', name: '搜索', icon: '🔍', description: '网络信息检索' },
  { id: 'code-execution', name: '代码执行', icon: '⚡', description: '运行代码片段' },
  { id: 'file-io', name: '文件读写', icon: '📁', description: '文件操作能力' },
  { id: 'analysis', name: '数据分析', icon: '📊', description: '数据处理分析' },
  { id: 'writing', name: '内容创作', icon: '✍️', description: '文本生成编辑' },
  { id: 'template', name: '模板应用', icon: '📋', description: '使用预设模板' },
  { id: 'design-preview', name: '设计预览', icon: '🎨', description: '可视化设计' },
  { id: 'translation', name: '翻译', icon: '🌐', description: '多语言翻译' },
  { id: 'dictionary', name: '词典', icon: '📖', description: '术语查询' },
  { id: 'calculation', name: '计算', icon: '🔢', description: '数学计算' },
  { id: 'debug', name: '调试', icon: '🐛', description: '错误诊断修复' },
  { id: 'planning', name: '规划', icon: '📅', description: '计划制定' },
]

const collaborationModes = [
  { value: 'leader' as const, label: '主导者', icon: '👑', description: '负责整体协调和决策' },
  { value: 'collaborator' as const, label: '协作者', icon: '🤝', description: '参与协作，提供建议' },
  { value: 'reviewer' as const, label: '审核者', icon: '✅', description: '负责质量检查和审核' },
]

const AgentConfigPanel = ({ agent, onSave, onClose }: AgentConfigPanelProps) => {
  const [config, setConfig] = useState<Partial<Agent>>({ ...agent })
  const [activeTab, setActiveTab] = useState<'basic' | 'ability' | 'behavior' | 'tools'>('basic')
  const [newSkill, setNewSkill] = useState('')
  const [savedPresets, setSavedPresets] = useState<Partial<Agent>[]>([])

  const tabs = [
    { id: 'basic' as const, label: '基本信息', icon: '📝' },
    { id: 'ability' as const, label: '能力设置', icon: '⚡' },
    { id: 'behavior' as const, label: '行为配置', icon: '🎭' },
    { id: 'tools' as const, label: '工具权限', icon: '🛠️' },
  ]

  const addSkill = () => {
    if (newSkill.trim() && !config.skills?.includes(newSkill.trim())) {
      setConfig({ ...config, skills: [...(config.skills || []), newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setConfig({
      ...config,
      skills: config.skills?.filter((s) => s !== skillToRemove),
    })
  }

  const toggleTool = (toolId: string) => {
    const currentTools = config.tools || []
    if (currentTools.includes(toolId)) {
      setConfig({ ...config, tools: currentTools.filter((t) => t !== toolId) })
    } else {
      setConfig({ ...config, tools: [...currentTools, toolId] })
    }
  }

  const saveAsPreset = () => {
    setSavedPresets([...savedPresets, config])
  }

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
              {agent.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">智能体配置</h2>
              <p className="text-sm text-gray-600">{agent.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">名称</label>
                  <input
                    type="text"
                    value={config.name || ''}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="输入智能体名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
                  <input
                    type="text"
                    value={config.avatar || ''}
                    onChange={(e) => setConfig({ ...config, avatar: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="输入emoji头像"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">角色描述</label>
                <textarea
                  value={config.description || ''}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="描述这个智能体的角色和职责..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">协作模式</label>
                <div className="grid grid-cols-3 gap-4">
                  {collaborationModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setConfig({ ...config, collaborationMode: mode.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        config.collaborationMode === mode.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{mode.icon}</div>
                      <div className="font-semibold text-sm text-gray-900">{mode.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{mode.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">能力等级</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.level || 0}
                    onChange={(e) => setConfig({ ...config, level: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>初级</span>
                    <span className="font-bold text-primary-600">{config.level || 0}</span>
                    <span>专家</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ability' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">技能标签</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="输入新技能并回车添加"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(config.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">专业领域</label>
                <div className="grid grid-cols-2 gap-2">
                  {['任务分解', '项目管理', '文案写作', '数据分析', 'UI设计', '市场调研', '编程开发', '翻译本地化'].map(
                    (field) => (
                      <label
                        key={field}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          config.specialty?.includes(field)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={config.specialty?.includes(field) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig({
                                ...config,
                                specialty: [...(config.specialty || []), field],
                              })
                            } else {
                              setConfig({
                                ...config,
                                specialty: config.specialty?.filter((s) => s !== field),
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{field}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">响应风格</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'formal' as const, label: '正式', icon: '🎩', desc: '专业严谨的表达方式' },
                    { value: 'friendly' as const, label: '友好', icon: '😊', desc: '亲切自然的交流风格' },
                    { value: 'humorous' as const, label: '幽默', icon: '😄', desc: '轻松有趣的互动模式' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setConfig({ ...config, responseStyle: style.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        config.responseStyle === style.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <div className="font-semibold text-sm text-gray-900">{style.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">输出详细度</label>
                <div className="space-y-3">
                  {[
                    { value: 'concise' as const, label: '简洁', desc: '只输出核心要点', level: 1 },
                    { value: 'normal' as const, label: '标准', desc: '平衡详细程度', level: 2 },
                    { value: 'detailed' as const, label: '详尽', desc: '提供完整解释和示例', level: 3 },
                  ].map((detail) => (
                    <label
                      key={detail.value}
                      className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        config.outputDetail === detail.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={config.outputDetail === detail.value}
                        onChange={() => setConfig({ ...config, outputDetail: detail.value })}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{detail.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{detail.desc}</div>
                        <div className="flex space-x-1 mt-2">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-8 rounded-full ${
                                i < detail.level ? 'bg-primary-500' : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  可用工具集（已选 {config.tools?.length || 0} / {availableTools.length}）
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableTools.map((tool) => {
                  const isSelected = config.tools?.includes(tool.id)
                  return (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all transform hover:scale-[1.02] ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{tool.icon}</span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={`font-semibold text-sm ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {tool.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{tool.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={saveAsPreset}
            className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
          >
            💾 保存为预设
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
            >
              ✅ 保存配置
            </button>
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

export default AgentConfigPanel
