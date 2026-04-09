import { useState } from 'react'
import FileManager from '../components/memory/FileManager'
import KnowledgeGraph from '../components/memory/KnowledgeGraph'
import MemorySearch from '../components/memory/MemorySearch'
import MemoryTimeline from '../components/memory/MemoryTimeline'
import BackupSettings from '../components/memory/BackupSettings'
import StorageQuota from '../components/memory/StorageQuota'

type TabType = 'files' | 'knowledge' | 'search' | 'timeline' | 'backup' | 'storage'

const tabs: { id: TabType; label: string; icon: string; description: string }[] = [
  { id: 'files', label: '文件管理', icon: '☁️', description: '云存储文件管理' },
  { id: 'knowledge', label: '知识图谱', icon: '🕸️', description: '知识关系可视化' },
  { id: 'search', label: '记忆检索', icon: '🔍', description: '搜索和筛选记忆' },
  { id: 'timeline', label: '时间线', icon: '📅', description: '按时间浏览记忆' },
  { id: 'backup', label: '备份同步', icon: '💾', description: '数据备份设置' },
  { id: 'storage', label: '存储空间', icon: '💽', description: '存储空间管理' },
]

const MemoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('files')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">存储记忆</h1>
        <p className="mt-2 text-gray-600">管理智能体的持久化记忆数据、文件存储和知识图谱</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-100 text-sm font-medium">总存储量</span>
            <span className="text-2xl">💾</span>
          </div>
          <p className="text-3xl font-bold">67.9 GB</p>
          <p className="text-sm text-blue-200 mt-1">已使用 / 100 GB</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-100 text-sm font-medium">记忆条目</span>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl font-bold">15,847</p>
          <p className="text-sm text-purple-200 mt-1">+234 今日新增</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-100 text-sm font-medium">知识节点</span>
            <span className="text-2xl">🧠</span>
          </div>
          <p className="text-3xl font-bold">20</p>
          <p className="text-sm text-emerald-200 mt-1">35 条关联关系</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-100 text-sm font-medium">备份状态</span>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold">正常</p>
          <p className="text-sm text-orange-200 mt-1">上次：今天 02:00</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[600px]">
          {activeTab === 'files' && <FileManager />}
          {activeTab === 'knowledge' && <KnowledgeGraph />}
          {activeTab === 'search' && <MemorySearch />}
          {activeTab === 'timeline' && <MemoryTimeline />}
          {activeTab === 'backup' && <BackupSettings />}
          {activeTab === 'storage' && <StorageQuota />}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-primary-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          使用提示
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-primary-500 mt-0.5">•</span>
            <span><strong>文件管理：</strong>支持拖拽上传、批量操作、文件夹导航和文件分享功能</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            <span><strong>知识图谱：</strong>可视化展示知识节点间的关联关系，支持缩放、搜索和类型筛选</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span><strong>记忆检索：</strong>强大的全文搜索引擎，支持模糊匹配、高级筛选和结果排序</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span><strong>时间线视图：</strong>按日/周/月/年维度展示记忆条目，便于回顾和整理</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span><strong>数据备份：</strong>自动备份计划配置，多设备同步，版本历史回滚</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            <span><strong>存储优化：</strong>智能扫描重复文件和缓存垃圾，一键释放存储空间</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryPage
