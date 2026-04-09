import { useState } from 'react'
import { faqData, helpArticles, updateLogs } from '../../data/mockSettings'

type ActiveTab = 'faq' | 'articles' | 'contact' | 'updates' | null
type FAQCategory = FAQItem['category'] | 'all'
type ArticleView = 'list' | 'detail'

interface FAQItem {
  id: string
  category: string
  title: string
  summary: string
  content: string
  tags: string[]
  updatedAt: string
  helpful: number
  notHelpful: number
}

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('faq')
  const [articleView, setArticleView] = useState<ArticleView>('list')
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const categories = [
    { key: 'all' as FAQCategory, label: '全部', icon: '📚' },
    { key: 'getting-started' as FAQCategory, label: '入门指南', icon: '🚀' },
    { key: 'features' as FAQCategory, label: '功能说明', icon: '📖' },
    { key: 'faq' as FAQCategory, label: '常见问题', icon: '❓' },
    { key: 'troubleshooting' as FAQCategory, label: '故障排除', icon: '🔧' },
    { key: 'support' as FAQCategory, label: '联系客服', icon: '💬' },
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = !searchQuery ||
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleVote = (_faqId: string, helpful: boolean) => {
    setFeedbackMessage(helpful ? '感谢您的反馈！' : '我们会努力改进！')
    setTimeout(() => setFeedbackMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">帮助中心</h2>

        <div className="space-y-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索帮助文档、常见问题..."
              className="w-full px-6 py-4 pl-14 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400">🔍</span>
          </div>

          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {[
              { key: 'faq' as ActiveTab, label: '常见问题', icon: '❓' },
              { key: 'articles' as ActiveTab, label: '帮助文章', icon: '📄' },
              { key: 'contact' as ActiveTab, label: '联系客服', icon: '💬' },
              { key: 'updates' as ActiveTab, label: '更新日志', icon: '📋' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.key ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'faq' && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">FAQ 分类</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === cat.key
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredFAQs.length > 0 ? filteredFAQs.map(faq => (
                  <div
                    key={faq.id}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      expandedFAQ === faq.id ? 'border-primary-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-5 text-left flex items-start justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{faq.title}</h4>
                        <p className="text-sm text-gray-600">{faq.summary}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {faq.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs text-gray-400">更新于 {faq.updatedAt}</span>
                        </div>
                      </div>
                      <span className={`transform transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="p-5 bg-gray-50 border-t border-gray-200">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                          {faq.content}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-3">这篇文章对您有帮助吗？</p>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleVote(faq.id, true)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <span>👍</span>
                              <span>有帮助 ({faq.helpful})</span>
                            </button>
                            <button
                              onClick={() => handleVote(faq.id, false)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <span>👎</span>
                              <span>没帮助 ({faq.notHelpful})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <p className="text-5xl mb-4">🔍</p>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">未找到相关内容</h4>
                    <p className="text-gray-500 mb-4">尝试使用其他关键词搜索，或浏览其他分类</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      清除筛选
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div>
              {articleView === 'list' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">帮助文章列表</h3>
                  {helpArticles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => { setSelectedArticle(article.id); setArticleView('detail') }}
                      className="w-full p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary-300 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                          {article.title}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-4">{article.readTime}分钟阅读</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">更新于 {article.updatedAt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => { setArticleView('list'); setSelectedArticle(null) }}
                    className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ← 返回文章列表
                  </button>
                  {(() => {
                    const article = helpArticles.find(a => a.id === selectedArticle)
                    if (!article) return null
                    return (
                      <article className="prose prose-lg max-w-none">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                          <span>更新时间：{article.updatedAt}</span>
                          <span>阅读时长：{article.readTime}分钟</span>
                        </div>
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">{article.content}</div>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-4">相关文章推荐</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {helpArticles.filter(a => a.id !== article.id).slice(0, 2).map(related => (
                              <button
                                key={related.id}
                                onClick={() => setSelectedArticle(related.id)}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                              >
                                <h4 className="font-medium text-gray-900 mb-1">{related.title}</h4>
                                <p className="text-sm text-gray-500 truncate">{related.summary}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </article>
                    )
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              {!showContactForm ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all group"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                      💬
                    </div>
                    <h4 className="font-bold text-gray-900 text-center mb-2">在线客服</h4>
                    <p className="text-sm text-gray-600 text-center">实时聊天，平均响应 &lt; 5分钟</p>
                    <p className="text-xs text-blue-600 text-center mt-3 font-medium">工作时间：9:00 - 22:00</p>
                  </button>

                  <a
                    href="mailto:support@example.com"
                    className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:shadow-lg transition-all group block"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                      📧
                    </div>
                    <h4 className="font-bold text-gray-900 text-center mb-2">邮件支持</h4>
                    <p className="text-sm text-gray-600 text-center">24小时内回复</p>
                    <p className="text-xs text-green-600 text-center mt-3 font-medium">support@example.com</p>
                  </a>

                  <button
                    onClick={() => setShowContactForm(true)}
                    className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:shadow-lg transition-all group"
                  >
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                      📝
                    </div>
                    <h4 className="font-bold text-gray-900 text-center mb-2">反馈表单</h4>
                    <p className="text-sm text-gray-600 text-center">提交详细问题描述</p>
                    <p className="text-xs text-purple-600 text-center mt-3 font-medium">1-3个工作日回复</p>
                  </button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ← 返回联系方式
                  </button>
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">联系我们</h3>
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                          <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="您的姓名" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
                          <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">问题类型</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>技术问题</option>
                          <option>账户问题</option>
                          <option>功能建议</option>
                          <option>其他问题</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">详细描述 *</label>
                        <textarea rows={6} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="请详细描述您遇到的问题或建议..." />
                      </div>
                      <button
                        type="submit"
                        onClick={() => alert('反馈已提交，我们将尽快与您联系！')}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      >
                        提交反馈
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 获取更快帮助的技巧</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>先在上方搜索框中查找相关文档，90%的问题都能快速解决</li>
                  <li>提供详细的错误信息和截图可以帮助我们更快定位问题</li>
                  <li>描述问题时请包含您的操作系统和浏览器版本信息</li>
                  <li>紧急问题建议直接使用在线客服获取即时支持</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">版本更新历史</h3>
              {updateLogs.map((log, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-white">{log.version}</span>
                      <span className="text-white/80">{log.date}</span>
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                      最新版本
                    </span>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {log.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start space-x-3">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-2">🔔 订阅更新通知</h4>
                <p className="text-sm text-blue-800 mb-4">第一时间获取新功能发布和重要更新通知</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  订阅更新
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {feedbackMessage && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in z-50">
          <span className="text-2xl">✓</span>
          <span className="font-medium">{feedbackMessage}</span>
        </div>
      )}
    </div>
  )
}

export default HelpCenter
