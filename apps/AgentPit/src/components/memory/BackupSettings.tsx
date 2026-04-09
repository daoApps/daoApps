import { useState } from 'react'
import { backupRecords, syncDevices } from '../../data/mockMemory'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const BackupSettings = () => {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [backupTime, setBackupTime] = useState('02:00')
  const [backupScope, setBackupScope] = useState<'all' | 'selective'>('all')
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'backup' | 'sync' | 'history'>('backup')

  const latestBackup = backupRecords[0]
  const totalBackupSize = backupRecords.reduce((sum, b) => sum + b.size, 0)

  const handleManualBackup = () => {
    setIsBackingUp(true)
    setTimeout(() => {
      setIsBackingUp(false)
      alert('备份完成！')
    }, 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <span>💾</span>
          数据备份与同步
        </h2>

        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          {([
            { value: 'backup' as const, label: '备份设置' },
            { value: 'sync' as const, label: '设备同步' },
            { value: 'history' as const, label: '版本历史' }
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
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">当前备份状态</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">上次备份时间</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {latestBackup ? new Date(latestBackup.timestamp).toLocaleString('zh-CN') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">最新备份大小</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {latestBackup ? formatFileSize(latestBackup.size) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">状态</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    latestBackup?.status === 'success' ? 'bg-green-100 text-green-800' :
                    latestBackup?.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      latestBackup?.status === 'success' ? 'bg-green-500' :
                      latestBackup?.status === 'failed' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    {latestBackup?.status === 'success' ? '成功' :
                     latestBackup?.status === 'failed' ? '失败' : '进行中'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">总备份数据量</span>
                  <span className="font-semibold text-gray-900">{formatFileSize(totalBackupSize)}</span>
                </div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${Math.min(totalBackupSize / (10 * 1024 * 1024 * 1024) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">手动备份</h4>
                <p className="text-sm text-gray-600 mt-0.5">立即创建一份完整的数据备份</p>
              </div>
              <button
                onClick={handleManualBackup}
                disabled={isBackingUp}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isBackingUp
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                }`}
              >
                {isBackingUp ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    备份中...
                  </>
                ) : (
                  <>🔄 立即备份</>
                )}
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">自动备份计划</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">启用自动备份</p>
                      <p className="text-sm text-gray-600">系统将按计划自动创建备份</p>
                    </div>
                  </div>
                </div>

                {autoBackup && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">备份频率</label>
                        <select
                          value={backupFrequency}
                          onChange={(e) => setBackupFrequency(e.target.value as typeof backupFrequency)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value="daily">每日备份</option>
                          <option value="weekly">每周备份</option>
                          <option value="monthly">每月备份</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">备份时间</label>
                        <input
                          type="time"
                          value={backupTime}
                          onChange={(e) => setBackupTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">备份范围</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setBackupScope('all')}
                          className={`flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                            backupScope === 'all'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          📦 全部数据
                        </button>
                        <button
                          onClick={() => setBackupScope('selective')}
                          className={`flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                            backupScope === 'selective'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          ✅ 选择性备份
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">数据导入/导出</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all group"
                >
                  <div className="text-center">
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📥</span>
                    <p className="font-medium text-gray-900">导入数据</p>
                    <p className="text-sm text-gray-600 mt-1">从备份文件恢复数据</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all group"
                >
                  <div className="text-center">
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📤</span>
                    <p className="font-medium text-gray-900">导出数据</p>
                    <p className="text-sm text-gray-600 mt-1">导出为备份文件</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">云服务集成</h3>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">☁️</span>
                    <div>
                      <p className="font-medium text-gray-900">云端存储已连接</p>
                      <p className="text-sm text-gray-600">数据将自动同步至云端存储服务</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    已连接
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">已连接设备</h3>

            {syncDevices.map(device => (
              <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      device.type === 'desktop' ? 'bg-blue-100' :
                      device.type === 'mobile' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {device.type === 'desktop' ? '💻' : device.type === 'mobile' ? '📱' : '📟'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{device.name}</h4>
                      <p className="text-sm text-gray-600 mt-0.5">
                        最后同步：{new Date(device.lastSync).toLocaleString('zh-CN')}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        存储使用：{formatFileSize(device.storageUsed)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      device.status === 'synced' ? 'bg-green-100 text-green-800' :
                      device.status === 'syncing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {device.status === 'synced' ? '✓ 已同步' :
                       device.status === 'syncing' ? '⟳ 同步中...' : '⚠ 同步错误'}
                    </span>
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      管理
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-all font-medium">
              ➕ 添加新设备
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-4">备份版本历史</h3>

            {backupRecords.map(backup => (
              <div
                key={backup.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      backup.status === 'success' ? 'bg-green-100' :
                      backup.status === 'failed' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {backup.status === 'success' ? '✅' :
                       backup.status === 'failed' ? '❌' : '⏳'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{backup.version}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          backup.type === 'full' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {backup.type === 'full' ? '全量' : '增量'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{backup.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{new Date(backup.timestamp).toLocaleString('zh-CN')}</span>
                        <span>·</span>
                        <span>{formatFileSize(backup.size)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {backup.status === 'success' && (
                      <>
                        <button className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                          恢复到此版本
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                          下载
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">导入数据</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-medium text-gray-900 mb-1">点击或拖拽文件到此处</p>
              <p className="text-sm text-gray-500">支持 .zip, .tar.gz 格式的备份文件</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                取消
              </button>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                开始导入
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">导出数据</h3>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input type="radio" name="exportType" defaultChecked className="text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">完整备份</p>
                  <p className="text-sm text-gray-600">导出所有数据和设置</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input type="radio" name="exportType" className="text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">仅记忆数据</p>
                  <p className="text-sm text-gray-600">只导出记忆条目和搜索索引</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input type="radio" name="exportType" className="text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">自定义范围</p>
                  <p className="text-sm text-gray-600">选择需要导出的内容类型</p>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                取消
              </button>
              <button onClick={() => setShowExportModal(false)} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                开始导出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BackupSettings
