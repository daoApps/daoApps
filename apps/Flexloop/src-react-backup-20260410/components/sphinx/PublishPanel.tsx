import { useState } from 'react'
import type { SiteConfig, PublishHistory } from '../../data/mockSphinx'

interface PublishPanelProps {
  siteConfig: Partial<SiteConfig>
  onPublish?: (config: SiteConfig) => void
}

const PublishPanel = ({ siteConfig, onPublish }: PublishPanelProps) => {
  const [domain, setDomain] = useState(siteConfig.domain || '')
  const [seoTitle, setSeoTitle] = useState(siteConfig.seoTitle || siteConfig.siteName || '')
  const [seoDescription, setSeoDescription] = useState(siteConfig.seoDescription || '')
  const [seoKeywords, setSeoKeywords] = useState(siteConfig.seoKeywords || '')
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle')
  const [publishHistory, setPublishHistory] = useState<PublishHistory[]>([
    {
      id: '1',
      version: 'v1.0.0',
      status: 'published',
      publishTime: new Date(Date.now() - 86400000 * 2),
      url: 'https://example.com'
    }
  ])

  const handlePublish = async () => {
    if (!domain.trim()) {
      alert('请输入域名')
      return
    }

    setPublishStatus('publishing')

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2

      if (isSuccess) {
        const newPublish: PublishHistory = {
          id: Date.now().toString(),
          version: `v${publishHistory.length + 1}.0.0`,
          status: 'published',
          publishTime: new Date(),
          url: `https://${domain}`
        }

        setPublishHistory([newPublish, ...publishHistory])
        setPublishStatus('success')

        if (onPublish) {
          onPublish({
            ...siteConfig,
            domain,
            seoTitle,
            seoDescription,
            seoKeywords
          } as SiteConfig)
        }

        setTimeout(() => setPublishStatus('idle'), 3000)
      } else {
        setPublishStatus('error')
        setTimeout(() => setPublishStatus('idle'), 3000)
      }
    }, 2000)
  }

  const getStatusBadge = (status: PublishHistory['status']) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '待发布' },
      publishing: { bg: 'bg-blue-100', text: 'text-blue-800', label: '发布中' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: '已发布' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: '失败' }
    }

    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🌐</span>
          域名配置
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              域名地址 *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="your-domain.com"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              输入您想要使用的域名，或使用默认的子域名
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🔍</span>
          SEO 设置
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO 标题
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="网站标题，显示在搜索引擎结果中"
              maxLength={60}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500 text-right">{seoTitle.length}/60</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO 描述
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="简要描述您的网站内容，用于搜索引擎展示"
              rows={3}
              maxLength={160}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500 text-right">{seoDescription.length}/160</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关键词
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="关键词1, 关键词2, 关键词3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              用逗号分隔多个关键词
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">发布状态</h3>
            <p className="text-sm text-gray-600">
              {publishStatus === 'idle' && '准备就绪，点击按钮发布网站'}
              {publishStatus === 'publishing' && '正在发布中，请稍候...'}
              {publishStatus === 'success' && '✅ 发布成功！网站已上线'}
              {publishStatus === 'error' && '❌ 发布失败，请检查配置后重试'}
            </p>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishStatus === 'publishing' || !domain.trim()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              publishStatus === 'success'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : publishStatus === 'error'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {publishStatus === 'idle' && '🚀 一键发布'}
            {publishStatus === 'publishing' && (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>发布中...</span>
              </span>
            )}
            {publishStatus === 'success' && '✓ 已发布'}
            {publishStatus === 'error' && '✕ 重试'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📋</span>
          发布历史
        </h3>

        {publishHistory.length > 0 ? (
          <div className="space-y-3">
            {publishHistory.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {record.version.slice(1, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.version}</p>
                    <p className="text-sm text-gray-500">
                      {record.publishTime.toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(record.status)}
                  {record.url && record.status === 'published' && (
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      访问 →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>暂无发布记录</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublishPanel
