export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'code' | 'archive' | 'other'
  size: number
  modifiedTime: string
  parentId: string | null
  path: string
}

export interface KnowledgeNode {
  id: string
  label: string
  type: 'concept' | 'entity' | 'event' | 'person' | 'location' | 'skill'
  importance: number
  connections: number
  description: string
  createdAt: string
}

export interface KnowledgeEdge {
  source: string
  target: string
  strength: number
  relationship: string
}

export interface MemoryEntry {
  id: string
  type: 'conversation' | 'note' | 'bookmark' | 'event' | 'learning' | 'idea'
  title: string
  content: string
  summary: string
  tags: string[]
  source: string
  timestamp: string
  relevanceScore?: number
}

export interface SearchHistory {
  id: string
  query: string
  timestamp: string
  resultCount: number
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: {
    types: string[]
    dateRange: { start: string; end: string }
    tags: string[]
    sources: string[]
  }
  createdAt: string
}

export interface BackupRecord {
  id: string
  version: string
  size: number
  timestamp: string
  status: 'success' | 'failed' | 'in_progress'
  type: 'full' | 'incremental'
  description: string
}

export interface SyncDevice {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  lastSync: string
  status: 'synced' | 'syncing' | 'error'
  storageUsed: number
}

export interface StorageCategory {
  name: string
  size: number
  percentage: number
  color: string
  icon: string
  count: number
}

export interface LargeFile {
  id: string
  name: string
  size: number
  type: string
  modifiedTime: string
  path: string
}

export const fileSystemData: FileItem[] = [
  { id: 'root', name: '我的云盘', type: 'folder', size: 0, modifiedTime: '2024-04-09 10:00:00', parentId: null, path: '/' },
  { id: 'docs', name: '文档', type: 'folder', size: 0, modifiedTime: '2024-04-08 14:30:00', parentId: 'root', path: '/文档' },
  { id: 'images', name: '图片', type: 'folder', size: 0, modifiedTime: '2024-04-07 16:20:00', parentId: 'root', path: '/图片' },
  { id: 'videos', name: '视频', type: 'folder', size: 0, modifiedTime: '2024-04-06 11:15:00', parentId: 'root', path: '/视频' },
  { id: 'code', name: '代码项目', type: 'folder', size: 0, modifiedTime: '2024-04-05 09:45:00', parentId: 'root', path: '/代码项目' },
  { id: 'music', name: '音乐', type: 'folder', size: 0, modifiedTime: '2024-04-04 13:50:00', parentId: 'root', path: '/音乐' },
  { id: 'work', name: '工作资料', type: 'folder', size: 0, modifiedTime: '2024-04-03 17:25:00', parentId: 'docs', path: '/文档/工作资料' },
  { id: 'personal', name: '个人笔记', type: 'folder', size: 0, modifiedTime: '2024-04-02 10:10:00', parentId: 'docs', path: '/文档/个人笔记' },
  { id: 'projects', name: '项目文档', type: 'folder', size: 0, modifiedTime: '2024-04-01 15:30:00', parentId: 'docs', path: '/文档/项目文档' },

  { id: 'f1', name: '年度报告_2024.docx', type: 'file', fileType: 'document', size: 2457600, modifiedTime: '2024-04-09 08:30:00', parentId: 'work', path: '/文档/工作资料/年度报告_2024.docx' },
  { id: 'f2', name: '会议纪要_0408.pdf', type: 'file', fileType: 'document', size: 1536000, modifiedTime: '2024-04-08 14:20:00', parentId: 'work', path: '/文档/工作资料/会议纪要_0408.pdf' },
  { id: 'f3', name: '产品需求文档.md', type: 'file', fileType: 'document', size: 892000, modifiedTime: '2024-04-07 16:15:00', parentId: 'projects', path: '/文档/项目文档/产品需求文档.md' },
  { id: 'f4', name: '技术方案设计.pptx', type: 'file', fileType: 'document', size: 5678000, modifiedTime: '2024-04-06 11:05:00', parentId: 'projects', path: '/文档/项目文档/技术方案设计.pptx' },
  { id: 'f5', name: '学习笔记_React高级.pdf', type: 'file', fileType: 'document', size: 3245000, modifiedTime: '2024-04-05 09:35:00', parentId: 'personal', path: '/文档/个人笔记/学习笔记_React高级.pdf' },
  { id: 'f6', name: '读书心得_AI未来.txt', type: 'file', fileType: 'document', size: 45600, modifiedTime: '2024-04-04 13:40:00', parentId: 'personal', path: '/文档/个人笔记/读书心得_AI未来.txt' },
  { id: 'f7', name: '旅行计划_五一假期.xlsx', type: 'file', fileType: 'document', size: 128000, modifiedTime: '2024-04-03 17:15:00', parentId: 'personal', path: '/文档/个人笔记/旅行计划_五一假期.xlsx' },

  { id: 'f8', name: '风景照片_西湖.jpg', type: 'file', fileType: 'image', size: 4567890, modifiedTime: '2024-04-07 16:00:00', parentId: 'images', path: '/图片/风景照片_西湖.jpg' },
  { id: 'f9', name: '团队合影.png', type: 'file', fileType: 'image', size: 2345670, modifiedTime: '2024-04-06 10:50:00', parentId: 'images', path: '/图片/团队合影.png' },
  { id: 'f10', name: '产品设计稿_v2.svg', type: 'file', fileType: 'image', size: 890123, modifiedTime: '2024-04-05 14:20:00', parentId: 'images', path: '/图片/产品设计稿_v2.svg' },
  { id: 'f11', name: '截图_20240404.webp', type: 'file', fileType: 'image', size: 1567000, modifiedTime: '2024-04-04 09:30:00', parentId: 'images', path: '/图片/截图_20240404.webp' },
  { id: 'f12', name: '头像照片.jpg', type: 'file', fileType: 'image', size: 567890, modifiedTime: '2024-04-03 11:15:00', parentId: 'images', path: '/图片/头像照片.jpg' },

  { id: 'f13', name: '产品演示视频.mp4', type: 'file', fileType: 'video', size: 156789000, modifiedTime: '2024-04-08 15:30:00', parentId: 'videos', path: '/视频/产品演示视频.mp4' },
  { id: 'f14', name: '培训录像_React基础.mp4', type: 'file', fileType: 'video', size: 234567000, modifiedTime: '2024-04-06 13:20:00', parentId: 'videos', path: '/视频/培训录像_React基础.mp4' },
  { id: 'f15', name: '会议录制_周会.mov', type: 'file', fileType: 'video', size: 89012300, modifiedTime: '2024-04-04 16:45:00', parentId: 'videos', path: '/视频/会议录制_周会.mov' },

  { id: 'f16', name: '项目源码_main.zip', type: 'file', fileType: 'archive', size: 34567800, modifiedTime: '2024-04-09 09:15:00', parentId: 'code', path: '/代码项目/项目源码_main.zip' },
  { id: 'f17', name: 'App.tsx', type: 'file', fileType: 'code', size: 12345, modifiedTime: '2024-04-08 18:20:00', parentId: 'code', path: '/代码项目/App.tsx' },
  { id: 'f18', name: 'utils.js', type: 'file', fileType: 'code', size: 8765, modifiedTime: '2024-04-07 12:30:00', parentId: 'code', path: '/代码项目/utils.js' },
  { id: 'f19', name: 'package.json', type: 'file', fileType: 'code', size: 2345, modifiedTime: '2024-04-06 10:15:00', parentId: 'code', path: '/代码项目/package.json' },

  { id: 'f20', name: '轻音乐合集.mp3', type: 'file', fileType: 'audio', size: 6789000, modifiedTime: '2024-04-05 15:40:00', parentId: 'music', path: '/音乐/轻音乐合集.mp3' },
  { id: 'f21', name: '播客访谈.flac', type: 'file', fileType: 'audio', size: 45678900, modifiedTime: '2024-04-03 09:20:00', parentId: 'music', path: '/音乐/播客访谈.flac' },
]

export const knowledgeNodes: KnowledgeNode[] = [
  { id: 'n1', label: '人工智能', type: 'concept', importance: 100, connections: 8, description: '计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统', createdAt: '2024-01-15' },
  { id: 'n2', label: '机器学习', type: 'concept', importance: 95, connections: 7, description: '人工智能的子集，使系统能够从数据中学习和改进而无需明确编程', createdAt: '2024-01-20' },
  { id: 'n3', label: '深度学习', type: 'concept', importance: 90, connections: 6, description: '机器学习的子集，使用多层神经网络处理复杂模式', createdAt: '2024-02-01' },
  { id: 'n4', label: '自然语言处理', type: 'skill', importance: 88, connections: 5, description: 'AI与人类语言交互的能力，包括理解和生成文本', createdAt: '2024-02-10' },
  { id: 'n5', label: '计算机视觉', type: 'skill', importance: 85, connections: 5, description: '使计算机能够解释和理解视觉世界的技术', createdAt: '2024-02-15' },
  { id: 'n6', label: '神经网络', type: 'concept', importance: 82, connections: 6, description: '受人脑启发的计算系统，由相互连接的节点层组成', createdAt: '2024-02-20' },
  { id: 'n7', label: 'Transformer', type: 'concept', importance: 92, connections: 5, description: '一种革命性的深度学习架构，特别适用于序列数据处理', createdAt: '2024-03-01' },
  { id: 'n8', label: 'GPT模型', type: 'entity', importance: 98, connections: 7, description: '基于Transformer架构的大型语言模型系列', createdAt: '2024-03-05' },
  { id: 'n9', label: 'Python', type: 'skill', importance: 80, connections: 4, description: 'AI开发中最流行的编程语言之一', createdAt: '2024-03-10' },
  { id: 'n10', label: 'TensorFlow', type: 'entity', importance: 75, connections: 4, description: 'Google开发的端到端开源机器学习平台', createdAt: '2024-03-15' },
  { id: 'n11', label: 'PyTorch', type: 'entity', importance: 78, connections: 4, description: 'Facebook开发的深度学习框架，以动态计算图著称', createdAt: '2024-03-18' },
  { id: 'n12', label: '数据科学', type: 'concept', importance: 83, connections: 5, description: '从结构化和非结构化数据中提取知识和洞察的跨学科领域', createdAt: '2024-03-22' },
  { id: 'n13', label: '强化学习', type: 'concept', importance: 79, connections: 4, description: '通过与环境交互来学习最优行为策略的机器学习方法', createdAt: '2024-03-25' },
  { id: 'n14', label: 'OpenAI', type: 'organization', importance: 96, connections: 6, description: '专注于友好AI研究的领先人工智能研究组织', createdAt: '2024-04-01' },
  { id: 'n15', label: 'ChatGPT', type: 'entity', importance: 99, connections: 8, description: 'OpenAI开发的对话式AI助手，基于GPT架构', createdAt: '2024-04-03' },
  { id: 'n16', label: '智能体系统', type: 'concept', importance: 87, connections: 5, description: '能够自主感知环境并采取行动以实现目标的系统', createdAt: '2024-04-05' },
  { id: 'n17', label: '多模态AI', type: 'concept', importance: 84, connections: 4, description: '能够同时处理和理解多种类型数据的AI系统', createdAt: '2024-04-06' },
  { id: 'n18', label: 'API集成', type: 'skill', importance: 72, connections: 3, description: '将不同软件应用程序通过接口连接起来的技术实践', createdAt: '2024-04-07' },
  { id: 'n19', label: '云计算', type: 'concept', importance: 76, connections: 4, description: '通过互联网提供计算服务的交付和使用模式', createdAt: '2024-04-08' },
  { id: 'n20', label: 'DAO', type: 'entity', importance: 91, connections: 6, description: '去中心化自治组织，通过智能合约运行的区块链组织形式', createdAt: '2024-04-09' },
]

export const knowledgeEdges: KnowledgeEdge[] = [
  { source: 'n1', target: 'n2', strength: 0.9, relationship: '包含' },
  { source: 'n1', target: 'n4', strength: 0.85, relationship: '应用领域' },
  { source: 'n1', target: 'n5', strength: 0.82, relationship: '应用领域' },
  { source: 'n2', target: 'n3', strength: 0.88, relationship: '子集' },
  { source: 'n2', target: 'n6', strength: 0.86, relationship: '核心技术' },
  { source: 'n2', target: 'n13', strength: 0.75, relationship: '方法' },
  { source: 'n3', target: 'n6', strength: 0.92, relationship: '基于' },
  { source: 'n3', target: 'n7', strength: 0.95, relationship: '使用架构' },
  { source: 'n4', target: 'n7', strength: 0.9, relationship: '核心技术' },
  { source: 'n4', target: 'n8', strength: 0.93, relationship: '实现' },
  { source: 'n5', target: 'n3', strength: 0.8, relationship: '应用' },
  { source: 'n6', target: 'n7', strength: 0.87, relationship: '演进为' },
  { source: 'n7', target: 'n8', strength: 0.98, relationship: '基础架构' },
  { source: 'n7', target: 'n15', strength: 0.97, relationship: '驱动' },
  { source: 'n8', target: 'n15', strength: 0.99, relationship: '具体实现' },
  { source: 'n9', target: 'n2', strength: 0.78, relationship: '主要工具' },
  { source: 'n9', target: 'n10', strength: 0.72, relationship: '搭配使用' },
  { source: 'n9', target: 'n11', strength: 0.74, relationship: '搭配使用' },
  { source: 'n10', target: 'n3', strength: 0.83, relationship: '支持' },
  { source: 'n11', target: 'n3', strength: 0.85, relationship: '支持' },
  { source: 'n12', target: 'n2', strength: 0.81, relationship: '依赖' },
  { source: 'n12', target: 'n9', strength: 0.77, relationship: '主要工具' },
  { source: 'n14', target: 'n8', strength: 0.96, relationship: '开发' },
  { source: 'n14', target: 'n15', strength: 0.98, relationship: '发布' },
  { source: 'n15', target: 'n4', strength: 0.94, relationship: '展示能力' },
  { source: 'n15', target: 'n17', strength: 0.89, relationship: '演进方向' },
  { source: 'n16', target: 'n1', strength: 0.84, relationship: '应用' },
  { source: 'n16', target: 'n13', strength: 0.79, relationship: '使用方法' },
  { source: 'n17', target: 'n4', strength: 0.86, relationship: '整合' },
  { source: 'n17', target: 'n5', strength: 0.83, relationship: '整合' },
  { source: 'n18', target: 'n8', strength: 0.71, relationship: '访问方式' },
  { source: 'n19', target: 'n1', strength: 0.68, relationship: '基础设施' },
  { source: 'n19', target: 'n10', strength: 0.65, relationship: '部署平台' },
  { source: 'n20', target: 'n16', strength: 0.82, relationship: '应用场景' },
  { source: 'n20', target: 'n1', strength: 0.73, relationship: '结合' },
]

export const memoryEntries: MemoryEntry[] = [
  { id: 'm1', type: 'conversation', title: '关于GPT-4架构讨论', content: '与团队深入讨论了GPT-4的Transformer架构改进，包括多头注意力机制的优化、位置编码的新方法等。大家一致认为混合专家模型是未来的重要发展方向。', summary: '探讨GPT-4架构改进和技术趋势', tags: ['AI', 'GPT-4', '架构'], source: '团队会议', timestamp: '2024-04-09T10:30:00', relevanceScore: 0.95 },
  { id: 'm2', type: 'note', title: 'React性能优化技巧总结', content: '整理了React应用性能优化的关键点：1) 使用React.memo避免不必要的重渲染；2) 合理使用useMemo和useCallback；3) 虚拟列表处理大数据量；4) 代码分割和懒加载。这些技巧在实际项目中效果显著。', summary: 'React性能优化的核心方法和最佳实践', tags: ['React', '前端', '性能优化'], source: '个人笔记', timestamp: '2024-04-09T09:15:00', relevanceScore: 0.88 },
  { id: 'm3', type: 'bookmark', title: '深度学习论文推荐：Attention Is All You Need', content: '这篇2017年的论文提出了Transformer架构，彻底改变了NLP领域。论文详细介绍了自注意力机制的工作原理，以及如何用它替代RNN和CNN进行序列建模。', summary: 'Transformer架构的开创性论文', tags: ['论文', 'Transformer', '深度学习'], source: '学术资源', timestamp: '2024-04-09T08:45:00', relevanceScore: 0.92 },
  { id: 'm4', type: 'event', title: '完成智能体系统原型开发', content: '成功完成了基于LLM的智能体系统第一版原型。该系统能够理解自然语言指令、分解任务、调用工具并自主决策。核心模块包括：意图识别器、任务规划器、工具调度器和结果验证器。', summary: '智能体系统原型的里程碑式进展', tags: ['智能体', '开发', '里程碑'], source: '项目记录', timestamp: '2024-04-08T17:20:00', relevanceScore: 0.97 },
  { id: 'm5', type: 'learning', title: 'TypeScript泛型深入学习', content: '今天系统学习了TypeScript的高级泛型用法：条件类型、映射类型、模板字面量类型、递归类型等。通过实际案例理解了如何在类型系统中实现复杂的逻辑判断和类型推导。', summary: 'TypeScript高级类型系统的全面掌握', tags: ['TypeScript', '编程', '类型系统'], source: '学习记录', timestamp: '2024-04-08T14:30:00', relevanceScore: 0.85 },
  { id: 'm6', type: 'idea', title: '多模态记忆系统的创新思路', content: '突发灵感：可以构建一个融合文本、图像、音频的多模态记忆系统。利用CLIP模型统一不同模态的表示空间，实现跨模态检索。关键创新点是引入时间衰减机制来管理记忆的重要性权重。', summary: '跨模态记忆管理的创新构想', tags: ['创新', '多模态', 'CLIP'], source: '灵感记录', timestamp: '2024-04-08T11:10:00', relevanceScore: 0.90 },
  { id: 'm7', type: 'conversation', title: '与客户讨论定制化AI解决方案', content: '与某企业客户进行了深入沟通，了解他们在客服自动化方面的痛点。他们希望AI系统能够：1) 理解复杂的多轮对话上下文；2) 具备领域知识库查询能力；3) 支持情感分析以调整回复策略。', summary: '企业级AI客服系统的需求调研', tags: ['客户', 'AI客服', '定制化'], source: '商务洽谈', timestamp: '2024-04-08T09:45:00', relevanceScore: 0.87 },
  { id: 'm8', type: 'note', title: 'Docker容器编排最佳实践', content: '总结了在生产环境中使用Docker Compose和Kubernetes的经验：服务发现配置、健康检查设置、滚动更新策略、资源限制配置、日志收集方案。特别强调了配置外部化的最佳方式。', summary: '生产环境Docker部署的关键经验', tags: ['DevOps', 'Docker', 'Kubernetes'], source: '技术文档', timestamp: '2024-04-07T16:15:00', relevanceScore: 0.82 },
  { id: 'm9', type: 'bookmark', title: '推荐阅读：《构建现代Web应用》', content: '这本书全面介绍了现代Web开发的完整技术栈，从前端的React/Vue到后端的Node.js/Go，再到数据库设计和微服务架构。作者分享了大量实战经验和踩坑记录。', summary: '全栈Web开发的实用指南书籍', tags: ['书籍', '全栈', 'Web开发'], source: '阅读推荐', timestamp: '2024-04-07T13:20:00', relevanceScore: 0.79 },
  { id: 'm10', type: 'event', title: '参加AI开发者大会', content: '参加了在北京举办的全球AI开发者大会，聆听了多位行业大咖的演讲。印象最深刻的是关于大模型安全对齐的主题演讲，以及Agent生态系统的圆桌讨论。收获了很多前沿见解和人脉资源。', summary: 'AI行业盛会的重要收获和见闻', tags: ['会议', 'AI', '行业动态'], source: '活动记录', timestamp: '2024-04-07T10:00:00', relevanceScore: 0.91 },
  { id: 'm11', type: 'learning', title: '图数据库Neo4j入门教程', content: '学习了图数据库的基本概念和Neo4j的使用方法：节点和关系的建模、Cypher查询语言的语法、索引优化策略、以及在实际知识图谱项目中的应用场景。完成了几个实战练习。', summary: '图数据库的基础理论和实际操作', tags: ['数据库', 'Neo4j', '知识图谱'], source: '在线课程', timestamp: '2024-04-06T15:45:00', relevanceScore: 0.83 },
  { id: 'm12', type: 'idea', title: '智能代码审查助手的构思', content: '想到可以开发一个AI驱动的代码审查工具，它不仅能检测语法错误和潜在bug，还能：1) 基于项目历史提供风格建议；2) 评估代码的可维护性指数；3) 推荐重构方案；4) 自动生成代码变更说明。', summary: 'AI辅助代码质量提升的创新方案', tags: ['创新', '代码审查', 'AI工具'], source: '创意库', timestamp: '2024-04-06T12:30:00', relevanceScore: 0.89 },
  { id: 'm13', type: 'conversation', title: '技术选型讨论：Next.js vs Nuxt.js', content: '与新团队成员讨论了SSR框架的选择问题。Next.js在生态系统和社区活跃度上占优，Nuxt.js在Vue开发者体验上更好。最终决定根据团队技术栈选择，Vue项目用Nuxt，React项目用Next。', summary: '前端框架选型的权衡分析', tags: ['技术选型', '框架', 'SSR'], source: '团队讨论', timestamp: '2024-04-06T09:15:00', relevanceScore: 0.84 },
  { id: 'm14', type: 'note', title: '用户隐私保护合规要点', content: '整理了GDPR、个人信息保护法等法规的核心要求：数据最小化原则、用户同意机制、数据删除权、跨境传输规则、安全措施要求。为产品的隐私设计提供了明确的指导方针。', summary: '数据隐私保护的法律法规要点', tags: ['合规', '隐私', 'GDPR'], source: '法律研究', timestamp: '2024-04-05T17:30:00', relevanceScore: 0.80 },
  { id: 'm15', type: 'bookmark', title: 'GitHub热门项目：LangChain', content: 'LangChain是一个用于开发LLM应用的框架，提供了链式调用、代理、记忆管理等模块。它的插件生态系统很丰富，支持多种LLM提供商和工具集成，是构建AI应用的有力工具。', summary: 'LLM应用开发框架的详细介绍', tags: ['开源项目', 'LangChain', 'LLM'], source: 'GitHub', timestamp: '2024-04-05T14:20:00', relevanceScore: 0.93 },
  { id: 'm16', type: 'event', title: '产品上线前的最终测试', content: '完成了v2.0版本的全部测试流程：单元测试覆盖率92%，集成测试全部通过，性能测试达标（P99响应<200ms），安全扫描无高危漏洞。准备明天正式发布到生产环境。', summary: '产品版本发布的质量保障过程', tags: ['测试', '发布', '质量保证'], source: '项目管理', timestamp: '2024-04-05T11:00:00', relevanceScore: 0.86 },
  { id: 'm17', type: 'learning', title: 'Rust所有权系统深度解析', content: '深入学习了Rust独特的内存管理模型：所有权规则、借用检查器、生命周期标注。通过编写示例代码理解了编译期内存安全保证的实现原理，以及它在并发编程中的优势。', summary: 'Rust内存安全模型的原理与实践', tags: ['Rust', '系统编程', '内存管理'], source: '技术学习', timestamp: '2024-04-04T16:00:00', relevanceScore: 0.81 },
  { id: 'm18', type: 'idea', title: '去中心化身份认证方案', content: '思考了基于区块链的去中心化身份(DID)认证系统：用户拥有自己的身份数据，通过零知识证明验证属性而不泄露隐私。可以应用于社交网络、金融服务等多个场景，解决当前中心化ID系统的单点故障问题。', summary: '基于区块链的身份管理创新方案', tags: ['区块链', 'DID', '隐私保护'], source: '研究想法', timestamp: '2024-04-04T13:15:00', relevanceScore: 0.88 },
  { id: 'm19', type: 'conversation', title: '导师关于职业发展的建议', content: '与资深工程师导师进行了深入交流。他建议：1) 深耕一个领域成为专家；2) 保持对新技术的敏感度但不要追逐热点；3) 注重软技能的培养；4) 参与开源项目建立影响力；5) 定期输出技术内容建立个人品牌。', summary: '来自资深工程师的职业发展指导', tags: ['职业', '成长', '建议'], source: ' mentor交流', timestamp: '2024-04-04T10:30:00', relevanceScore: 0.94 },
  { id: 'm20', type: 'note', title: '微服务架构设计模式', content: '系统梳理了微服务架构中的常用设计模式：API网关模式、服务发现模式、断路器模式、事件溯源模式、CQRS模式、Saga分布式事务模式。每种模式都附带了适用场景和注意事项。', summary: '微服务架构的核心设计模式和最佳实践', tags: ['架构', '微服务', '设计模式'], source: '学习笔记', timestamp: '2024-04-03T15:20:00', relevanceScore: 0.86 },
  { id: 'm21', type: 'bookmark', title: 'AWS架构师认证学习资源', content: '收集了AWS Solutions Architect认证的备考资源：官方文档、白皮书、练习题库、视频课程。重点标记了S3、EC2、Lambda、DynamoDB、VPC等核心服务的考点和高频面试题。', summary: 'AWS专业认证的系统性备考指南', tags: ['AWS', '云计算', '认证'], source: '学习资源', timestamp: '2024-04-03T12:45:00', relevanceScore: 0.78 },
  { id: 'm22', type: 'event', title: '团队建设活动圆满结束', content: '组织了为期两天的团队建设活动，包括户外拓展、技术分享会、晚宴交流。通过这次活动增强了团队凝聚力，新成员快速融入，也发现了几位成员的隐藏才艺。整体反馈非常积极。', summary: '促进团队协作的文化建设活动', tags: ['团队', '文化建设', '活动'], source: 'HR记录', timestamp: '2024-04-03T09:00:00', relevanceScore: 0.75 },
  { id: 'm23', type: 'learning', title: 'GraphQL API设计规范', content: '学习了GraphQL的最佳实践：Schema优先的设计理念、合理的类型定义、分页和过滤的实现、错误处理的标准化、N+1查询问题的解决方案（DataLoader）。动手搭建了一个示例API。', summary: 'GraphQL接口设计的完整方法论', tags: ['GraphQL', 'API', '后端'], source: '技术培训', timestamp: '2024-04-02T14:30:00', relevanceScore: 0.84 },
  { id: 'm24', type: 'idea', title: '智能日程管理助手的设想', content: '构思了一个AI驱动的日程管理工具：能自动解析邮件和聊天中的时间信息创建日历事件；基于历史习惯预测用户的空闲时段；考虑交通时间和任务优先级优化日程安排；在临近截止时主动提醒。', summary: '提升个人效率的智能化日程工具', tags: ['效率工具', 'AI', '时间管理'], source: '产品构思', timestamp: '2024-04-02T11:15:00', relevanceScore: 0.87 },
  { id: 'm25', type: 'conversation', title: '与投资人路演反馈', content: '向天使投资人展示了我们的商业计划和产品demo。他们对我们AI技术的差异化优势表示认可，但对市场进入策略和获客成本有疑问。需要进一步细化财务模型和竞争分析。', summary: '融资路演中的关键反馈和待改进项', tags: ['融资', '创业', '投资'], source: '商务会议', timestamp: '2024-04-02T08:50:00', relevanceScore: 0.90 },
  { id: 'm26', type: 'note', title: 'CSS Grid布局完全指南', content: '详细记录了CSS Grid的所有属性和用法：grid-template-columns/rows、grid-area、grid-gap、fr单位、minmax()函数、auto-fit/auto-fill。配合大量可视化示例，涵盖了常见的布局模式和响应式设计技巧。', summary: 'CSS Grid二维布局系统的完整参考', tags: ['CSS', '前端', '布局'], source: '技术手册', timestamp: '2024-04-01T16:40:00', relevanceScore: 0.77 },
  { id: 'm27', type: 'bookmark', title: 'Hacker News热帖：The Rise of AI Agents', content: '一篇关于AI Agent发展趋势的热门文章，分析了从单一模型到多Agent协作系统的演进路径。文章引用了AutoGPT、BabyAGI等早期探索者的经验教训，展望了Agent经济的未来可能性。', summary: 'AI Agent领域的现状分析和未来展望', tags: ['AI Agent', '趋势分析', '行业'], source: 'Hacker News', timestamp: '2024-04-01T13:25:00', relevanceScore: 0.91 },
  { id: 'm28', type: 'event', title: '获得行业技术创新奖', content: '我们团队的"智能知识管理系统"项目获得了年度技术创新奖！评委特别肯定了我们在知识图谱构建和多模态检索方面的突破。这是对整个团队半年努力的认可，激励我们继续创新。', summary: '团队技术创新成果获得业界认可', tags: ['奖项', '荣誉', '成就'], source: '公司新闻', timestamp: '2024-04-01T10:00:00', relevanceScore: 0.96 },
  { id: 'm29', type: 'learning', title: 'Redis缓存策略深度实践', content: '学习了Redis在企业级应用中的高级用法：缓存穿透/击穿/雪崩的防护方案、布隆过滤器预热、一致性哈希分片、哨兵模式高可用配置、集群扩缩容策略。通过压测验证了各方案的吞吐量表现。', summary: 'Redis高性能缓存的进阶应用技巧', tags: ['Redis', '缓存', '性能'], source: '实战经验', timestamp: '2024-03-31T15:10:00', relevanceScore: 0.82 },
  { id: 'm30', type: 'idea', title: '个性化学习路径推荐引擎', content: '提出一个自适应学习平台的概念：利用知识图谱映射技能依赖关系，基于用户的学习历史和能力评估，动态推荐最优学习路径。结合间隔重复算法优化记忆保持率，用游戏化元素提高参与度。', summary: 'AI驱动的个性化教育技术方案', tags: ['教育科技', 'AI', '个性化'], source: '教育创新', timestamp: '2024-03-31T11:40:00', relevanceScore: 0.89 },
  { id: 'm31', type: 'conversation', title: '跨部门协作流程优化会议', content: '与产品和运营部门一起审视了现有的协作流程，识别出几个瓶颈：需求评审周期长、测试环境不稳定、发布协调不顺畅。制定了改进计划：引入敏捷看板、建立CI/CD流水线、设立每周同步例会。', summary: '提升研发效率的流程改进举措', tags: ['协作', '敏捷', '流程优化'], source: '工作会议', timestamp: '2024-03-31T09:20:00', relevanceScore: 0.83 },
  { id: 'm32', type: 'note', title: '正则表达式速查手册', content: '整理了一份正则表达式的完整参考：字符类、量词、锚点、分组和捕获、正向/负向预查、常用模式（邮箱、手机号、URL、IP地址）。每个表达式都附带详细的拆解说明和测试用例。', summary: '正则表达式的语法和常见模式集合', tags: ['正则', '字符串', '工具'], source: '参考资料', timestamp: '2024-03-30T14:55:00', relevanceScore: 0.76 },
  { id: 'm33', type: 'bookmark', title: 'MDN Web Docs - JavaScript Guide', content: 'Mozilla Developer Network上的JavaScript权威指南，覆盖ES6+的所有新特性：箭头函数、解构赋值、Promise/async-await、模块化、Proxy/Reflect、迭代器和生成器。是日常查阅的首选资源。', summary: 'JavaScript语言的权威在线文档', tags: ['JavaScript', '文档', 'MDN'], source: '技术文档', timestamp: '2024-03-30T11:30:00', relevanceScore: 0.85 },
  { id: 'm34', type: 'event', title: '完成Q1季度OKR复盘', content: '回顾了第一季度的OKR达成情况：目标完成率78%，其中技术债务清理超额完成，新产品线进度略有滞后。分析了未达成目标的原因，调整了Q2的重点方向，增加了AI能力建设的权重。', summary: '季度目标管理的结果评估和规划调整', tags: ['OKR', '绩效', '规划'], source: '管理层会议', timestamp: '2024-03-30T08:45:00', relevanceScore: 0.88 },
  { id: 'm35', type: 'learning', title: 'WebAssembly入门与实战', content: '初步了解了WebAssembly的原理和应用场景：它是一种可以在浏览器中高效运行的二进制指令格式。尝试用Rust编写了一个简单的图像处理模块，编译成.wasm后在JS中调用，性能比纯JS实现提升了5倍。', summary: 'WebAssembly高性能计算的初探体验', tags: ['Wasm', '性能', 'Rust'], source: '实验项目', timestamp: '2024-03-29T16:20:00', relevanceScore: 0.80 },
  { id: 'm36', type: 'idea', title: '虚拟数字人交互平台', content: '设想了一个集成了语音合成、面部动画驱动、实时渲染的数字人平台。可用于：虚拟主播、在线教育讲师、客户服务代表、娱乐偶像等场景。关键技术挑战在于实时性和表情的自然度。', summary: '元宇宙时代的虚拟形象交互方案', tags: ['数字人', '元宇宙', '实时渲染'], source: '前沿探索', timestamp: '2024-03-29T13:05:00', relevanceScore: 0.86 },
  { id: 'm37', type: 'conversation', title: '用户反馈分析讨论', content: '与产品团队一起分析了最近收集的用户反馈：正面评价集中在界面简洁和响应速度快，负面反馈主要是缺少离线功能和导出选项。决定在下个版本优先支持数据导出，离线功能列入Q3路线图。', summary: '用户体验反馈的数据驱动决策', tags: ['用户反馈', '产品', 'UX'], source: '产品会议', timestamp: '2024-03-29T09:50:00', relevanceScore: 0.84 },
  { id: 'm38', type: 'note', title: 'Git工作流规范文档', content: '制定了团队的Git分支管理规范：main分支保护、feature分支命名约定、commit message格式（Conventional Commits）、Pull Request模板、Code Review清单。旨在提高代码质量和协作效率。', summary: '版本控制协作的标准化流程', tags: ['Git', '协作', '规范'], source: '团队标准', timestamp: '2024-03-28T15:35:00', relevanceScore: 0.79 },
  { id: 'm39', type: 'bookmark', title: 'Stack Overflow年度调查报告', content: 'Stack Overflow 2024开发者调查揭示了有趣的趋势：Rust连续多年最受喜爱语言、TypeScript超越JavaScript成为最常用的前端语言、AI工具的使用率达到70%以上、远程工作的比例持续增长。', summary: '全球开发者生态的现状和趋势洞察', tags: ['调查', '开发者', '趋势'], source: '行业报告', timestamp: '2024-03-28T12:10:00', relevanceScore: 0.82 },
  { id: 'm40', type: 'event', title: '新成员入职培训圆满完成', content: '为3位新入职工程师完成了为期一周的入职培训，内容包括公司文化介绍、技术栈概览、开发环境搭建、代码规范讲解、第一个Bug Fix任务。新人反馈培训体系清晰，已顺利融入各自小组。', summary: '新员工培养体系的执行情况', tags: ['招聘', '培训', '团队成长'], source: '人事管理', timestamp: '2024-03-28T09:00:00', relevanceScore: 0.77 },
  { id: 'm41', type: 'learning', title: 'Kubernetes服务网格Istio实践', content: '学习了服务网格Istio的核心概念：Sidecar代理模式、流量管理（路由规则、熔断、重试）、安全（mTLS、RBAC）、可观测性（分布式追踪、指标采集）。在测试集群上部署了Bookinfo示例应用。', summary: '微服务通信治理的Service Mesh方案', tags: ['Kubernetes', 'Istio', '服务网格'], source: '技术深造', timestamp: '2024-03-27T14:45:00', relevanceScore: 0.81 },
  { id: 'm42', type: 'idea', title: '绿色计算与碳中和追踪系统', content: '受到ESG理念启发，想到可以为企业开发碳排放追踪平台：自动采集IT设备的能耗数据、计算碳足迹、设定减排目标、生成符合标准的ESG报告。结合IoT传感器实现实时监控。', summary: '企业可持续发展的数字化管理工具', tags: ['ESG', '环保', '碳中和'], source: '社会责任', timestamp: '2024-03-27T11:20:00', relevanceScore: 0.85 },
  { id: 'm43', type: 'conversation', title: '技术债务清理专项讨论', content: '与Tech Lead讨论了技术债务的现状：遗留代码占比约25%、部分模块测试覆盖不足、依赖库存在安全漏洞。制定了分阶段清理计划：Q2聚焦核心模块重构，Q3补齐测试短板，Q4升级依赖版本。', summary: '代码质量和长期维护性的改进计划', tags: ['技术债务', '重构', '质量'], source: '技术规划', timestamp: '2024-03-27T08:40:00', relevanceScore: 0.87 },
  { id: 'm44', type: 'note', title: 'HTTP/2与HTTP/3协议对比', content: '对比分析了HTTP协议演进的关键差异：HTTP/2引入多路复用、头部压缩、服务器推送解决了HTTP/1.1的性能瓶颈；HTTP/3基于QUIC协议进一步解决了队头阻塞问题，在弱网环境下表现更优。', summary: '新一代Web协议的技术特性和适用场景', tags: ['HTTP', '网络', '协议'], source: '网络知识', timestamp: '2024-03-26T16:00:00', relevanceScore: 0.78 },
  { id: 'm45', type: 'bookmark', title: 'awesome-llm-apps GitHub仓库', content: '这个精心策划的列表收录了数百个基于LLM的应用项目，涵盖：写作助手、代码生成、数据分析、创意艺术、教育辅导等领域。每个项目都有简短描述和链接，是寻找灵感和竞品分析的绝佳资源。', summary: 'LLM应用生态的全景式资源汇总', tags: ['LLM', '开源', '资源合集'], source: 'GitHub精选', timestamp: '2024-03-26T13:30:00', relevanceScore: 0.90 },
  { id: 'm46', type: 'event', title: '系统迁移至云原生架构', content: '历时三个月，成功将单体应用迁移至云原生架构：容器化12个微服务、配置K8s集群、接入CI/CD流水线、实施可观测性方案。迁移期间保持了零停机，系统可用性从99.5%提升至99.99%。', summary: '架构现代化的重大技术转型成果', tags: ['云原生', '迁移', 'Kubernetes'], source: '技术里程碑', timestamp: '2024-03-26T09:15:00', relevanceScore: 0.95 },
  { id: 'm47', type: 'learning', title: '函数式编程思想在JavaScript中的应用', content: '学习了FP的核心概念并在JS中实践：纯函数、不可变性、高阶函数、柯里化、函子、单子。通过Ramda库体验了声明式编程的魅力，代码更加简洁且易于推理和测试。', summary: '函数式编程范式在前端开发中的实践', tags: ['函数式编程', 'JavaScript', '范式'], source: '编程哲学', timestamp: '2024-03-25T15:25:00', relevanceScore: 0.83 },
  { id: 'm48', type: 'idea', title: '基于区块链的版权保护平台', content: '针对创作者经济设计了去中心化版权登记和交易平台：作品上链确权、智能合约自动分成、侵权检测和取证、二手交易版税追踪。目标是让创作者真正掌控自己的数字资产。', summary: '赋能创作者的区块链版权解决方案', tags: ['区块链', '版权', 'Web3'], source: '创业想法', timestamp: '2024-03-25T11:50:00', relevanceScore: 0.88 },
  { id: 'm49', type: 'conversation', title: '与设计师协作优化UI组件库', content: '和UI/UX设计师一起评审了组件库的设计规范：统一了颜色系统（基于Design Tokens）、完善了响应式断点定义、增加了无障碍访问支持、建立了组件使用文档。新的设计系统将在下个迭代中落地。', summary: '设计系统的一致性和可维护性提升', tags: ['设计', '组件库', 'UX'], source: '设计评审', timestamp: '2024-03-25T09:00:00', relevanceScore: 0.81 },
  { id: 'm50', type: 'note', title: 'Linux命令行必备技巧', content: '整理了日常高频使用的Linux命令：文件操作（find、grep、awk、sed）、进程管理（ps、top、htop）、网络工具（curl、wget、netstat）、系统监控（df、du、iostat）。每个命令都附带了实用示例和参数说明。', summary: 'Linux运维和开发的高效命令行工具集', tags: ['Linux', '命令行', '运维'], source: '运维手册', timestamp: '2024-03-24T14:40:00', relevanceScore: 0.80 },
  { id: 'm51', type: 'bookmark', title: 'InfoQ架构师月刊推荐', content: 'InfoQ的架构师电子月刊每期都精选高质量的技术文章：领域驱动设计实践、事件驱动架构案例、混沌工程经验分享、技术领导力培养等。订阅以来收获颇丰，是保持技术视野的重要渠道。', summary: '软件架构领域的优质内容订阅源', tags: ['架构', 'InfoQ', '持续学习'], source: '订阅资源', timestamp: '2024-03-24T11:15:00', relevanceScore: 0.84 },
  { id: 'm52', type: 'event', title: '年度技术大会演讲申请通过', content: '提交的《构建可扩展的AI Agent平台》演讲提案被大会采纳！将在下个月的技术大会上做45分钟的主题分享。正在准备幻灯片和Demo，希望能给听众带来有价值的内容和启发。', summary: '技术分享和影响力的扩展机会', tags: ['演讲', '技术大会', '分享'], source: '个人发展', timestamp: '2024-03-24T08:30:00', relevanceScore: 0.93 },
]

export const searchHistory: SearchHistory[] = [
  { id: 'sh1', query: 'React 性能优化', timestamp: '2024-04-09T10:25:00', resultCount: 23 },
  { id: 'sh2', query: 'GPT-4 架构', timestamp: '2024-04-08T14:15:00', resultCount: 18 },
  { id: 'sh3', query: 'TypeScript 泛型', timestamp: '2024-04-07T09:30:00', resultCount: 15 },
  { id: 'sh4', query: 'Docker 部署', timestamp: '2024-04-06T16:45:00', resultCount: 31 },
  { id: 'sh5', query: '知识图谱 构建', timestamp: '2024-04-05T11:20:00', resultCount: 12 },
]

export const savedSearches: SavedSearch[] = [
  {
    id: 'ss1',
    name: 'AI相关技术',
    query: '人工智能 OR 机器学习 OR 深度学习',
    filters: {
      types: ['note', 'learning'],
      dateRange: { start: '2024-01-01', end: '2024-12-31' },
      tags: ['AI', '机器学习', '深度学习'],
      sources: []
    },
    createdAt: '2024-03-15T10:00:00'
  },
  {
    id: 'ss2',
    name: '近期会议记录',
    query: '',
    filters: {
      types: ['conversation', 'event'],
      dateRange: { start: '2024-04-01', end: '2024-04-09' },
      tags: [],
      sources: ['团队会议', '工作会议']
    },
    createdAt: '2024-04-01T09:00:00'
  },
]

export const backupRecords: BackupRecord[] = [
  { id: 'b1', version: 'v2.4.1', size: 1567890000, timestamp: '2024-04-09T02:00:00', status: 'success', type: 'incremental', description: '每日增量备份' },
  { id: 'b2', version: 'v2.4.0', size: 2345678000, timestamp: '2024-04-08T02:00:00', status: 'success', type: 'incremental', description: '每日增量备份' },
  { id: 'b3', version: 'v2.4.0', size: 3456789000, timestamp: '2024-04-05T02:00:00', status: 'success', type: 'full', description: '每周全量备份' },
  { id: 'b4', version: 'v2.3.9', size: 2134567000, timestamp: '2024-04-04T02:00:00', status: 'success', type: 'incremental', description: '每日增量备份' },
  { id: 'b5', version: 'v2.3.8', size: 3345678000, timestamp: '2024-04-01T02:00:00', status: 'success', type: 'full', description: '每周全量备份' },
  { id: 'b6', version: 'v2.3.7', size: 1987654000, timestamp: '2024-03-29T02:00:00', status: 'failed', type: 'incremental', description: '备份失败-网络中断' },
  { id: 'b7', version: 'v2.3.7', size: 3223456000, timestamp: '2024-03-25T02:00:00', status: 'success', type: 'full', description: '每周全量备份' },
]

export const syncDevices: SyncDevice[] = [
  { id: 'd1', name: 'MacBook Pro 工作机', type: 'desktop', lastSync: '2024-04-09T10:15:00', status: 'synced', storageUsed: 4567890000 },
  { id: 'd2', name: 'iPhone 15 Pro', type: 'mobile', lastSync: '2024-04-09T09:45:00', status: 'syncing', storageUsed: 1234567000 },
  { id: 'd3', name: 'iPad Air', type: 'tablet', lastSync: '2024-04-08T18:30:00', status: 'error', storageUsed: 2345678000 },
  { id: 'd4', name: 'Windows 台式机', type: 'desktop', lastSync: '2024-04-08T14:20:00', status: 'synced', storageUsed: 5678901000 },
]

export const storageCategories: StorageCategory[] = [
  { name: '文档', size: 15678900, percentage: 28, color: '#3b82f6', icon: '📄', count: 145 },
  { name: '图片', size: 23456780, percentage: 35, color: '#10b981', icon: '🖼️', count: 320 },
  { name: '视频', size: 34567890, percentage: 25, color: '#f59e0b', icon: '🎬', count: 48 },
  { name: '音频', size: 5678900, percentage: 7, color: '#ef4444', icon: '🎵', count: 89 },
  { name: '其他', size: 2345000, percentage: 5, color: '#8b5cf6', icon: '📦', count: 167 },
]

export const largeFiles: LargeFile[] = [
  { id: 'lf1', name: '培训录像_React基础.mp4', size: 234567000, type: 'video', modifiedTime: '2024-04-06T13:20:00', path: '/视频/' },
  { id: 'lf2', name: '产品演示视频.mp4', size: 156789000, type: 'video', modifiedTime: '2024-04-08T15:30:00', path: '/视频/' },
  { id: 'lf3', name: '会议录制_周会.mov', size: 89012300, type: 'video', modifiedTime: '2024-04-04T16:45:00', path: '/视频/' },
  { id: 'lf4', name: '项目源码_main.zip', size: 34567800, type: 'archive', modifiedTime: '2024-04-09T09:15:00', path: '/代码项目/' },
  { id: 'lf5', name: '播客访谈.flac', size: 45678900, type: 'audio', modifiedTime: '2024-04-03T09:20:00', path: '/音乐/' },
  { id: 'lf6', name: '风景照片_西湖.jpg', size: 4567890, type: 'image', modifiedTime: '2024-04-07T16:00:00', path: '/图片/' },
  { id: 'lf7', name: '技术方案设计.pptx', size: 5678000, type: 'document', modifiedTime: '2024-04-06T11:05:00', path: '/文档/项目文档/' },
  { id: 'lf8', name: '学习笔记_React高级.pdf', size: 3245000, type: 'document', modifiedTime: '2024-04-05T09:35:00', path: '/文档/个人笔记/' },
  { id: 'lf9', name: '团队合影.png', size: 2345670, type: 'image', modifiedTime: '2024-04-06T10:50:00', path: '/图片/' },
  { id: 'lf10', name: '年度报告_2024.docx', size: 2457600, type: 'document', modifiedTime: '2024-04-09T08:30:00', path: '/文档/工作资料/' },
]

export const totalStorageQuota = {
  total: 107374182400,
  used: 72945000000,
  unit: 'GB'
}
