import { useState } from 'react'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface SitePreviewProps {
  siteName?: string
  templateId?: string
}

const SitePreview = ({ siteName, templateId }: SitePreviewProps) => {
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [zoom, setZoom] = useState(100)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const deviceWidths: Record<DeviceType, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleZoomIn = () => {
    if (zoom < 150) setZoom(zoom + 10)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10)
  }

  const generateMockSiteContent = () => {
    if (!templateId) {
      return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 2.5em; margin-bottom: 20px;">🏗️ 网站预览</h1>
            <p style="font-size: 1.2em; opacity: 0.9; margin-bottom: 30px;">
              ${siteName || '您的网站'} 正在构建中...
            </p>
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 16px; padding: 30px; margin-top: 30px;">
              <p style="margin: 0; opacity: 0.8;">
                完成建站向导后，这里将显示您的网站预览
              </p>
            </div>
          </div>
        </div>
      `
    }

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${siteName || '我的网站'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 60px 20px;
              text-align: center;
            }
            .header h1 { font-size: 2.5em; margin-bottom: 10px; }
            .header p { font-size: 1.1em; opacity: 0.9; }
            .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
            .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin: 40px 0; }
            .feature-card {
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              transition: transform 0.3s;
            }
            .feature-card:hover { transform: translateY(-5px); }
            .feature-icon { font-size: 3em; margin-bottom: 15px; }
            .feature-card h3 { color: #667eea; margin-bottom: 10px; }
            .footer {
              background: #2d3748;
              color: white;
              text-align: center;
              padding: 40px 20px;
              margin-top: 60px;
            }
            @media (max-width: 768px) {
              .header h1 { font-size: 1.8em; }
              .features { grid-template-columns: 1fr; }
            }
          </style>
        </head>
        <body>
          <header class="header">
            <h1>✨ ${siteName || '我的网站'}</h1>
            <p>使用 Sphinx AI 智能构建的专业网站</p>
          </header>

          <main class="container">
            <section class="features">
              <div class="feature-card">
                <div class="feature-icon">🚀</div>
                <h3>快速部署</h3>
                <p>一键发布到云端，全球 CDN 加速访问</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3>响应式设计</h3>
                <p>完美适配桌面、平板、手机等各种设备</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>高性能优化</h3>
                <p>代码优化、图片压缩、懒加载等全方位性能提升</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>安全可靠</h3>
                <p>SSL 加密、DDoS 防护、自动备份保障数据安全</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>数据分析</h3>
                <p>实时访客统计、用户行为分析、转化率追踪</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🎨</div>
                <h3>自由定制</h3>
                <p>丰富的主题模板、灵活的布局编辑器、自定义样式</p>
              </div>
            </section>
          </main>

          <footer class="footer">
            <p>&copy; 2026 ${siteName || '我的网站'}. Powered by Sphinx AI</p>
          </footer>
        </body>
      </html>
    `
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">设备视图:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  device === d
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {d === 'desktop' && '🖥️ 桌面'}
                {d === 'tablet' && '📱 平板'}
                {d === 'mobile' && '📲 手机'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded" disabled={zoom <= 50}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-gray-600 min-w-[50px] text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded" disabled={zoom >= 150}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm">{isRefreshing ? '刷新中...' : '刷新'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-gray-700 rounded px-4 py-1 text-xs text-gray-300 max-w-md w-full text-center truncate">
              {siteName || 'my-website.com'}{templateId ? ` (模板: ${templateId})` : ''}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 flex justify-center overflow-auto" style={{ minHeight: '500px' }}>
          <div
            className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
            style={{
              width: deviceWidths[device],
              maxWidth: '100%',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              height: device === 'mobile' ? '667px' : device === 'tablet' ? '1024px' : '700px'
            }}
          >
            {isRefreshing ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600">正在刷新预览...</p>
                </div>
              </div>
            ) : (
              <iframe
                srcDoc={generateMockSiteContent()}
                title="Website Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SitePreview
