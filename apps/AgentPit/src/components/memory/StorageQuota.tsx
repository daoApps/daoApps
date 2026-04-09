import { useState } from 'react'
import { storageCategories, largeFiles, totalStorageQuota } from '../../data/mockMemory'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const StorageQuota = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'cleanup'>('overview')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<{ duplicates: number; cache: number; junk: number } | null>(null)

  const usedPercentage = ((totalStorageQuota.used / totalStorageQuota.total) * 100).toFixed(1)
  const usedGB = (totalStorageQuota.used / (1024 * 1024 * 1024)).toFixed(1)
  const totalGB = (totalStorageQuota.total / (1024 * 1024 * 1024)).toFixed(1)
  const isLowSpace = parseFloat(usedPercentage) > 80

  const handleScan = () => {
    setIsScanning(true)
    setScanResults(null)
    setTimeout(() => {
      setScanResults({
        duplicates: 156789000,
        cache: 89456000,
        junk: 45678000
      })
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <span>💽</span>
          存储空间管理
        </h2>

        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          {([
            { value: 'overview' as const, label: '存储概览' },
            { value: 'files' as const, label: '大文件' },
            { value: 'cleanup' as const, label: '清理建议' }
          ]).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === value ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="relative w-56 h-56 flex-shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="16" />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#storageGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${parseFloat(usedPercentage) * 5.03} 503`}
                  />
                  <defs>
                    <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{usedPercentage}%</span>
                  <span className="text-sm text-gray-500 mt-1">已使用</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-1">已用空间</p>
                    <p className="text-2xl font-bold text-blue-900">{usedGB} GB</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">总容量</p>
                    <p className="text-2xl font-bold text-gray-900">{totalGB} GB</p>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${isLowSpace ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{isLowSpace ? '⚠️' : '✅'}</span>
                    <span className={`font-semibold ${isLowSpace ? 'text-orange-800' : 'text-green-800'}`}>
                      {isLowSpace ? '存储空间不足' : '存储状态良好'}
                    </span>
                  </div>
                  <p className={`text-sm ${isLowSpace ? 'text-orange-700' : 'text-green-700'}`}>
                    {isLowSpace
                      ? `剩余 ${(parseFloat(totalGB) - parseFloat(usedGB)).toFixed(1)} GB 可用空间，建议清理不必要的文件或升级存储方案`
                      : '您的存储空间充足，可以继续正常使用'
                    }
                  </p>

                  {isLowSpace && (
                    <button className="mt-3 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                      🚀 升级存储空间
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">分类占用统计</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {storageCategories.map(category => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium text-gray-900 text-sm">{category.name}</span>
                          <span className="text-xs text-gray-500">({category.count} 个文件)</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{formatFileSize(category.size)}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {(() => {
                        let currentAngle = 0
                        return storageCategories.map((category, idx) => {
                          const angle = (category.percentage / 100) * 360
                          const startAngle = currentAngle
                          currentAngle += angle

                          const startRad = (startAngle - 90) * Math.PI / 180
                          const endRad = (currentAngle - 90) * Math.PI / 180

                          const x1 = 100 + 80 * Math.cos(startRad)
                          const y1 = 100 + 80 * Math.sin(startRad)
                          const x2 = 100 + 80 * Math.cos(endRad)
                          const y2 = 100 + 80 * Math.sin(endRad)

                          const largeArc = angle > 180 ? 1 : 0

                          return (
                            <path
                              key={idx}
                              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={category.color}
                              opacity={0.85}
                              className="hover:opacity-100 transition-opacity cursor-pointer"
                            />
                          )
                        })
                      })()}
                      <circle cx="100" cy="100" r="40" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-bold text-gray-900">{usedGB}GB</span>
                      <span className="text-xs text-gray-500">已用</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">文件类型分布</h3>
              <div className="grid grid-cols-5 gap-3">
                {storageCategories.map(category => (
                  <div key={category.name} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-2xl block mb-1">{category.icon}</span>
                    <p className="font-semibold text-gray-900 text-sm">{category.percentage}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Top 10 最大文件</h3>
              <span className="text-sm text-gray-500">按文件大小排序</span>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">文件名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">大小</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">修改时间</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {largeFiles.map((file, idx) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{file.type === 'video' ? '🎬' : file.type === 'archive' ? '📦' : file.type === 'audio' ? '🎵' : file.type === 'image' ? '🖼️' : '📄'}</span>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[250px]">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatFileSize(file.size)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          file.type === 'video' ? 'bg-red-100 text-red-800' :
                          file.type === 'archive' ? 'bg-orange-100 text-orange-800' :
                          file.type === 'audio' ? 'bg-purple-100 text-purple-800' :
                          file.type === 'image' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {file.type === 'video' ? '视频' : file.type === 'archive' ? '压缩包' : file.type === 'audio' ? '音频' : file.type === 'image' ? '图片' : '文档'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(file.modifiedTime).toLocaleDateString('zh-CN')}</td>
                      <td className="px-4 py-3">
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors">
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cleanup' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>🧹</span>
                智能清理助手
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                扫描并清理重复文件、过期缓存和垃圾文件，释放宝贵的存储空间
              </p>

              <button
                onClick={handleScan}
                disabled={isScanning}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isScanning
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                }`}
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    扫描中...
                  </>
                ) : (
                  <>🔍 开始扫描</>
                )}
              </button>
            </div>

            {scanResults && (
              <div className="space-y-4 animate-in slide-in-from-top">
                <h4 className="font-semibold text-gray-900">扫描结果</h4>

                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📋</span>
                      <span className="font-medium text-red-800">重复文件</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">{formatFileSize(scanResults.duplicates)}</p>
                    <p className="text-xs text-red-600 mt-1">可释放空间</p>
                  </div>

                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🗂️</span>
                      <span className="font-medium text-yellow-800">过期缓存</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">{formatFileSize(scanResults.cache)}</p>
                    <p className="text-xs text-yellow-600 mt-1">可释放空间</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🗑️</span>
                      <span className="font-medium text-gray-800">垃圾文件</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatFileSize(scanResults.junk)}</p>
                    <p className="text-xs text-gray-600 mt-1">可释放空间</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-900">预计可释放总空间</p>
                      <p className="text-sm text-green-700 mt-1">清理以上项目可释放大量存储空间</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-900">
                        {formatFileSize(scanResults.duplicates + scanResults.cache + scanResults.junk)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    ✨ 一键清理全部
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    选择性清理
                  </button>
                </div>
              </div>
            )}

            {!scanResults && !isScanning && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium text-gray-900 mb-2">尚未进行扫描</p>
                <p className="text-gray-500">点击上方"开始扫描"按钮检测可清理的文件</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StorageQuota
