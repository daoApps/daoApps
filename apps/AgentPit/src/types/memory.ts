export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modifiedAt?: string
  children?: FileNode[]
}

export type ContextMenuAction = 'rename' | 'copy' | 'move' | 'download' | 'delete' | 'properties'

export interface GraphNode {
  id: string
  label: string
  type: 'concept' | 'entity' | 'event' | 'document' | 'person' | 'location'
  x?: number
  y?: number
  description?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  type: 'related_to' | 'contains' | 'created_by' | 'located_at' | 'references' | 'belongs_to'
}

export interface SearchResult {
  id: string
  title: string
  content: string
  type: string
  timestamp: string
  relevance: number
  tags: string[]
  size?: number
}

export interface SearchFilter {
  dateRange?: { start: string; end: string }
  fileType?: string
  tags?: string[]
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'creation' | 'modification' | 'deletion' | 'access' | 'backup'
  thumbnail?: string
  isImportant?: boolean
  metadata?: Record<string, unknown>
}

export interface BackupConfig {
  autoBackup: boolean
  frequency: 'hourly' | 'daily' | 'weekly'
  backupType: 'incremental' | 'full'
  retentionCount: number
  location: 'local' | 'cloud'
}

export interface BackupRecord {
  id: string
  timestamp: string
  size: number
  status: 'success' | 'failed' | 'in_progress'
  type: 'incremental' | 'full'
}

export interface StorageStats {
  totalSpace: number
  usedSpace: number
  categories: {
    documents: number
    images: number
    videos: number
    code: number
    other: number
  }
  largeFiles: {
    name: string
    size: number
    modifiedAt: string
  }[]
}
