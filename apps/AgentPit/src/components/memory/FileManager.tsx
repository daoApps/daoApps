import { useState, useRef, useCallback } from 'react'
import { fileSystemData, FileItem } from '../../data/mockMemory'

type ViewMode = 'list' | 'grid' | 'large'

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') return '📁'

  const iconMap = {
    document: '📄',
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    code: '💻',
    archive: '📦',
    other: '📎'
  }

  return iconMap[file.fileType || 'other'] || '📎'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const FileManager = () => {
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getCurrentFiles = (): FileItem[] => {
    const currentFolder = fileSystemData.find(f => f.path === currentPath && f.type === 'folder')
    if (!currentFolder) {
      return fileSystemData.filter(f => f.parentId === null && f.type !== 'folder')
    }
    return fileSystemData.filter(f => f.parentId === currentFolder.id)
  }

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath)
    setSelectedItems(new Set())
    setContextMenu(null)
  }

  const goToParent = () => {
    if (currentPath === '/') return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    navigateToFolder(parts.length > 0 ? '/' + parts.join('/') : '/')
  }

  const toggleSelection = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = new Set(selectedItems)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = () => {
    const currentFiles = getCurrentFiles()
    if (selectedItems.size === currentFiles.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(currentFiles.map(f => f.id)))
    }
  }

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, fileId })
  }

  const closeContextMenu = () => setContextMenu(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const getBreadcrumbs = () => {
    if (currentPath === '/') return [{ name: '我的云盘', path: '/' }]
    const parts = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ name: '我的云盘', path: '/' }]
    let currentPathBuild = ''
    for (const part of parts) {
      currentPathBuild += '/' + part
      breadcrumbs.push({ name: part, path: currentPathBuild })
    }
    return breadcrumbs
  }

  const totalSize = fileSystemData.filter(f => f.type === 'file').reduce((sum, f) => sum + f.size, 0)
  const usedPercentage = Math.min((totalSize / (100 * 1024 * 1024 * 1024)) * 100, 100)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" onClick={closeContextMenu}>
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span>☁️</span>
            云存储文件管理
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['list', 'grid', 'large'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'list' ? '☰' : mode === 'grid' ? '▦' : '⊞'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-lg px-4 py-2">
            <button onClick={goToParent} disabled={currentPath === '/'} className="text-gray-500 hover:text-gray-700 disabled:opacity-30">
              ←
            </button>
            <div className="flex items-center gap-1 text-sm flex-1 overflow-x-auto">
              {getBreadcrumbs().map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-gray-400">/</span>}
                  <button
                    onClick={() => navigateToFolder(crumb.path)}
                    className={`hover:text-primary-600 transition-colors ${
                      idx === getBreadcrumbs().length - 1 ? 'font-medium text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <span>📁</span> 新建文件夹
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>⬆️</span> 上传文件
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" />
            {selectedItems.size > 0 && (
              <>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <span>⬇️</span> 下载 ({selectedItems.size})
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <span>📋</span> 复制
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <span>🔗</span> 分享
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                  <span>🗑️</span> 删除
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              已用: <span className="font-semibold text-gray-900">{formatFileSize(totalSize)}</span> / 100 GB
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                style={{ width: `${usedPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative min-h-[400px] ${isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}`}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-blue-50/90">
            <div className="text-center">
              <p className="text-2xl mb-2">📥</p>
              <p className="text-lg font-medium text-blue-600">拖拽文件到此处上传</p>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div>
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase tracking-wider">
              <div className="col-span-1">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.size === getCurrentFiles().length && getCurrentFiles().length > 0} />
              </div>
              <div className="col-span-5">名称</div>
              <div className="col-span-2">大小</div>
              <div className="col-span-2">修改时间</div>
              <div className="col-span-2">类型</div>
            </div>
            {getCurrentFiles().map((file) => (
              <div
                key={file.id}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
                onClick={(e) => toggleSelection(file.id, e)}
                onDoubleClick={() => file.type === 'folder' && navigateToFolder(file.path)}
                className={`grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedItems.has(file.id) ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="col-span-1 flex items-center">
                  <input type="checkbox" checked={selectedItems.has(file.id)} readOnly />
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <span className="text-xl">{getFileIcon(file)}</span>
                  <span className="font-medium text-gray-900 truncate">{file.name}</span>
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-600">{formatFileSize(file.size)}</div>
                <div className="col-span-2 flex items-center text-sm text-gray-600">{file.modifiedTime.split(' ')[0]}</div>
                <div className="col-span-2 flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    file.type === 'folder' ? 'bg-yellow-100 text-yellow-800' :
                    file.fileType === 'document' ? 'bg-blue-100 text-blue-800' :
                    file.fileType === 'image' ? 'bg-green-100 text-green-800' :
                    file.fileType === 'video' ? 'bg-red-100 text-red-800' :
                    file.fileType === 'audio' ? 'bg-purple-100 text-purple-800' :
                    file.fileType === 'code' ? 'bg-indigo-100 text-indigo-800' :
                    file.fileType === 'archive' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {file.type === 'folder' ? '文件夹' :
                     file.fileType === 'document' ? '文档' :
                     file.fileType === 'image' ? '图片' :
                     file.fileType === 'video' ? '视频' :
                     file.fileType === 'audio' ? '音频' :
                     file.fileType === 'code' ? '代码' :
                     file.fileType === 'archive' ? '压缩包' : '其他'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {(viewMode === 'grid' || viewMode === 'large') && (
          <div className={`grid gap-4 p-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
            {getCurrentFiles().map((file) => (
              <div
                key={file.id}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
                onClick={(e) => toggleSelection(file.id, e)}
                onDoubleClick={() => file.type === 'folder' && navigateToFolder(file.path)}
                className={`relative group rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  selectedItems.has(file.id)
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                } ${viewMode === 'large' ? 'aspect-square flex flex-col items-center justify-center' : ''}`}
              >
                <div className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <input type="checkbox" checked={selectedItems.has(file.id)} readOnly />
                </div>
                <div className={`${viewMode === 'large' ? 'text-6xl mb-3' : 'text-4xl mb-2'} text-center`}>
                  {getFileIcon(file)}
                </div>
                <div className={`text-center ${viewMode === 'large' ? '' : 'truncate'}`}>
                  <p className={`font-medium text-gray-900 ${viewMode === 'large' ? 'text-base' : 'text-sm'} break-words`}>
                    {file.name}
                  </p>
                  {viewMode === 'large' && (
                    <>
                      <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{file.modifiedTime.split(' ')[0]}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {contextMenu && (
          <div
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              ✏️ 重命名
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              📋 属性
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              📂 移动到
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              📄 复制到
            </button>
            <hr className="my-1" />
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              🗑️ 删除
            </button>
          </div>
        )}
      </div>

      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewFolderModal(false)}>
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新建文件夹</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="请输入文件夹名称"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowNewFolderModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                取消
              </button>
              <button
                onClick={() => {
                  setShowNewFolderModal(false)
                  setNewFolderName('')
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分享文件</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">分享链接：</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`https://cloud.example.com/share/${Array.from(selectedItems)[0]}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                  复制
                </button>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" defaultChecked /> 设置密码保护
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" /> 允许下载
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" defaultChecked /> 7天后过期
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowShareModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                取消
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                生成链接
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileManager
