import type {
  FileNode,
  GraphNode,
  GraphEdge,
  SearchResult,
  BackupRecord,
  StorageStats
} from '@/types/memory';

export const mockFileTree: FileNode[] = [
  {
    id: 'folder-1',
    name: '文档',
    type: 'folder',
    modifiedAt: '2026-04-09T10:00:00Z',
    children: [
      {
        id: 'file-1',
        name: '项目计划书.pdf',
        type: 'file',
        size: 2457600,
        modifiedAt: '2026-04-08T14:30:00Z'
      },
      {
        id: 'file-2',
        name: '会议纪要.docx',
        type: 'file',
        size: 153600,
        modifiedAt: '2026-04-07T09:15:00Z'
      },
      {
        id: 'file-3',
        name: '技术文档.md',
        type: 'file',
        size: 89200,
        modifiedAt: '2026-04-06T16:45:00Z'
      },
      {
        id: 'subfolder-1',
        name: '合同文件',
        type: 'folder',
        modifiedAt: '2026-04-05T11:20:00Z',
        children: [
          {
            id: 'file-4',
            name: '服务协议.pdf',
            type: 'file',
            size: 512000,
            modifiedAt: '2026-04-05T11:20:00Z'
          },
          {
            id: 'file-5',
            name: '保密协议.docx',
            type: 'file',
            size: 98000,
            modifiedAt: '2026-04-05T11:25:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'folder-2',
    name: '图片',
    type: 'folder',
    modifiedAt: '2026-04-09T08:30:00Z',
    children: [
      {
        id: 'file-6',
        name: '产品截图.png',
        type: 'file',
        size: 2048000,
        modifiedAt: '2026-04-08T10:00:00Z'
      },
      {
        id: 'file-7',
        name: '团队照片.jpg',
        type: 'file',
        size: 3584000,
        modifiedAt: '2026-04-07T15:20:00Z'
      },
      {
        id: 'file-8',
        name: '设计稿.svg',
        type: 'file',
        size: 450000,
        modifiedAt: '2026-04-06T13:40:00Z'
      }
    ]
  },
  {
    id: 'folder-3',
    name: '代码',
    type: 'folder',
    modifiedAt: '2026-04-09T12:00:00Z',
    children: [
      {
        id: 'file-9',
        name: 'main.ts',
        type: 'file',
        size: 25000,
        modifiedAt: '2026-04-09T12:00:00Z'
      },
      {
        id: 'file-10',
        name: 'utils.js',
        type: 'file',
        size: 18000,
        modifiedAt: '2026-04-08T17:30:00Z'
      },
      {
        id: 'file-11',
        name: 'App.vue',
        type: 'file',
        size: 32000,
        modifiedAt: '2026-04-09T11:50:00Z'
      },
      {
        id: 'subfolder-2',
        name: '组件',
        type: 'folder',
        modifiedAt: '2026-04-09T11:00:00Z',
        children: [
          {
            id: 'file-12',
            name: 'Button.vue',
            type: 'file',
            size: 5600,
            modifiedAt: '2026-04-09T10:30:00Z'
          },
          {
            id: 'file-13',
            name: 'Modal.vue',
            type: 'file',
            size: 12000,
            modifiedAt: '2026-04-09T10:35:00Z'
          },
          {
            id: 'file-14',
            name: 'Table.vue',
            type: 'file',
            size: 18500,
            modifiedAt: '2026-04-09T10:40:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'folder-4',
    name: '视频',
    type: 'folder',
    modifiedAt: '2026-04-08T16:00:00Z',
    children: [
      {
        id: 'file-15',
        name: '产品演示.mp4',
        type: 'file',
        size: 104857600,
        modifiedAt: '2026-04-08T16:00:00Z'
      },
      {
        id: 'file-16',
        name: '培训录像.avi',
        type: 'file',
        size: 209715200,
        modifiedAt: '2026-04-07T14:00:00Z'
      }
    ]
  },
  {
    id: 'file-17',
    name: 'README.txt',
    type: 'file',
    size: 4200,
    modifiedAt: '2026-04-01T09:00:00Z'
  },
  {
    id: 'file-18',
    name: '配置文件.json',
    type: 'file',
    size: 1500,
    modifiedAt: '2026-03-28T18:00:00Z'
  }
];

export const mockKnowledgeNodes: GraphNode[] = [
  {
    id: 'n1',
    label: '人工智能',
    type: 'concept',
    description: '计算机科学的一个分支，致力于创建能够模拟人类智能的系统'
  },
  {
    id: 'n2',
    label: '机器学习',
    type: 'concept',
    description: '人工智能的子领域，使计算机能够从数据中学习'
  },
  { id: 'n3', label: '深度学习', type: 'concept', description: '基于人工神经网络的机器学习方法' },
  {
    id: 'n4',
    label: '自然语言处理',
    type: 'concept',
    description: '让计算机理解、解释和生成人类语言的技术'
  },
  {
    id: 'n5',
    label: '计算机视觉',
    type: 'concept',
    description: '让计算机从图像或视频中获取信息的技术'
  },
  { id: 'n6', label: 'TensorFlow', type: 'entity', description: 'Google 开发的开源机器学习框架' },
  {
    id: 'n7',
    label: 'PyTorch',
    type: 'entity',
    description: 'Facebook AI Research 开发的深度学习框架'
  },
  { id: 'n8', label: 'GPT-4', type: 'entity', description: 'OpenAI 开发的大型语言模型' },
  { id: 'n9', label: 'BERT', type: 'entity', description: 'Google 开发的预训练语言模型' },
  {
    id: 'n10',
    label: 'ImageNet',
    type: 'document',
    description: '大规模图像数据集，用于计算机视觉研究'
  },
  { id: 'n11', label: 'AlphaGo', type: 'event', description: 'DeepMind 开发的围棋人工智能程序' },
  {
    id: 'n12',
    label: 'Geoffrey Hinton',
    type: 'person',
    description: '深度学习之父，图灵奖获得者'
  },
  {
    id: 'n13',
    label: 'Yann LeCun',
    type: 'person',
    description: '卷积神经网络之父，Meta 首席 AI 科学家'
  },
  {
    id: 'n14',
    label: '多伦多大学',
    type: 'location',
    description: '加拿大著名高等学府，AI 研究重镇'
  },
  {
    id: 'n15',
    label: 'Transformer',
    type: 'concept',
    description: '革命性的神经网络架构，用于处理序列数据'
  },
  { id: 'n16', label: 'CNN', type: 'concept', description: '卷积神经网络，主要用于图像识别任务' },
  { id: 'n17', label: 'RNN', type: 'concept', description: '循环神经网络，用于处理序列数据' },
  {
    id: 'n18',
    label: '强化学习',
    type: 'concept',
    description: '通过与环境交互来学习最优策略的方法'
  },
  { id: 'n19', label: 'OpenAI', type: 'entity', description: '人工智能研究公司，开发了 GPT 系列' },
  { id: 'n20', label: 'DeepMind', type: 'entity', description: 'Google 旗下的人工智能公司' },
  { id: 'n21', label: '自动驾驶', type: 'event', description: '利用 AI 技术实现车辆自主驾驶' },
  {
    id: 'n22',
    label: '医疗诊断',
    type: 'event',
    description: 'AI 在医疗领域的应用，辅助医生诊断疾病'
  },
  {
    id: 'n23',
    label: '斯坦福大学',
    type: 'location',
    description: '美国顶尖学府，AI 研究领先机构'
  },
  { id: 'n24', label: 'Andrew Ng', type: 'person', description: '吴恩达，机器学习领域的知名教育家' }
];

export const mockKnowledgeEdges: GraphEdge[] = [
  { id: 'e1', source: 'n1', target: 'n2', label: '包含', type: 'contains' },
  { id: 'e2', source: 'n2', target: 'n3', label: '子集', type: 'related_to' },
  { id: 'e3', source: 'n2', target: 'n4', label: '应用', type: 'related_to' },
  { id: 'e4', source: 'n2', target: 'n5', label: '应用', type: 'related_to' },
  { id: 'e5', source: 'n3', target: 'n6', label: '实现工具', type: 'references' },
  { id: 'e6', source: 'n3', target: 'n7', label: '实现工具', type: 'references' },
  { id: 'e7', source: 'n4', target: 'n8', label: '代表模型', type: 'contains' },
  { id: 'e8', source: 'n4', target: 'n9', label: '代表模型', type: 'contains' },
  { id: 'e9', source: 'n5', target: 'n10', label: '使用数据集', type: 'references' },
  { id: 'e10', source: 'n3', target: 'n11', label: '应用案例', type: 'related_to' },
  { id: 'e11', source: 'n3', target: 'n12', label: '创始人', type: 'created_by' },
  { id: 'e12', source: 'n12', target: 'n14', label: '任职于', type: 'located_at' },
  { id: 'e13', source: 'n4', target: 'n15', label: '核心技术', type: 'related_to' },
  { id: 'e14', source: 'n5', target: 'n16', label: '核心技术', type: 'related_to' },
  { id: 'e15', source: 'n4', target: 'n17', label: '传统方法', type: 'related_to' },
  { id: 'e16', source: 'n2', target: 'n18', label: '分支', type: 'related_to' },
  { id: 'e17', source: 'n18', target: 'n11', label: '应用案例', type: 'related_to' },
  { id: 'e18', source: 'n8', target: 'n19', label: '开发公司', type: 'created_by' },
  { id: 'e19', source: 'n11', target: 'n20', label: '开发公司', type: 'created_by' },
  { id: 'e20', source: 'n1', target: 'n21', label: '应用场景', type: 'related_to' },
  { id: 'e21', source: 'n1', target: 'n22', label: '应用场景', type: 'related_to' },
  { id: 'e22', source: 'n16', target: 'n23', label: '研究机构', type: 'located_at' },
  { id: 'e23', source: 'n24', target: 'n23', label: '任职于', type: 'located_at' },
  { id: 'e24', source: 'n24', target: 'n2', label: '贡献者', type: 'created_by' },
  { id: 'e25', source: 'n3', target: 'n13', label: '创始人', type: 'created_by' },
  { id: 'e26', source: 'n15', target: 'n8', label: '基础架构', type: 'belongs_to' },
  { id: 'e27', source: 'n15', target: 'n9', label: '基础架构', type: 'belongs_to' },
  { id: 'e28', source: 'n6', target: 'n19', label: '所属组织', type: 'belongs_to' },
  { id: 'e29', source: 'n7', target: 'n20', label: '所属组织', type: 'belongs_to' },
  { id: 'e30', source: 'n18', target: 'n21', label: '应用场景', type: 'related_to' },
  { id: 'e31', source: 'n16', target: 'n5', label: '用于', type: 'related_to' },
  { id: 'e32', source: 'n17', target: 'n4', label: '用于', type: 'related_to' },
  { id: 'e33', source: 'n12', target: 'n3', label: '研究领域', type: 'related_to' },
  { id: 'e34', source: 'n13', target: 'n16', label: '发明者', type: 'created_by' },
  { id: 'e35', source: 'n22', target: 'n4', label: '使用技术', type: 'references' }
];

export const mockMemoryItems: SearchResult[] = [
  {
    id: 'mem-1',
    title: 'Vue3 组合式 API 学习笔记',
    content:
      'Vue3 的 Composition API 提供了更灵活的代码组织方式。通过 setup 函数，我们可以将相关逻辑组合在一起，提高代码的可维护性和复用性。ref 和 reactive 是两个核心响应式 API。',
    type: 'document',
    timestamp: '2026-04-10T09:30:00Z',
    relevance: 0.95,
    tags: ['Vue', '前端', '学习'],
    size: 25600
  },
  {
    id: 'mem-2',
    title: 'TypeScript 类型系统深入理解',
    content:
      'TypeScript 的类型系统非常强大，支持泛型、条件类型、映射类型等高级特性。合理使用类型可以大大提升代码质量和开发效率。',
    type: 'document',
    timestamp: '2026-04-09T15:20:00Z',
    relevance: 0.88,
    tags: ['TypeScript', '编程', '类型系统'],
    size: 38400
  },
  {
    id: 'mem-3',
    title: '项目架构设计文档',
    content:
      '本项目采用前后端分离架构，前端使用 Vue3 + TypeScript + Vite 构建，后端采用 Node.js + Express。数据库使用 PostgreSQL，缓存层使用 Redis。',
    type: 'document',
    timestamp: '2026-04-09T10:00:00Z',
    relevance: 0.92,
    tags: ['架构', '设计', '文档'],
    size: 51200
  },
  {
    id: 'mem-4',
    title: '用户界面原型截图',
    content:
      '这是新版本的用户界面原型设计，包含首页、列表页、详情页等主要页面。设计风格采用现代简约风格，主色调为蓝色系。',
    type: 'image',
    timestamp: '2026-04-08T14:30:00Z',
    relevance: 0.75,
    tags: ['UI', '设计', '原型'],
    size: 2048000
  },
  {
    id: 'mem-5',
    title: 'API 接口文档 v2.0',
    content:
      '更新了用户认证、数据查询、文件上传等核心接口。新增了分页、排序、筛选等功能参数。所有接口均支持 JWT 认证。',
    type: 'code',
    timestamp: '2026-04-08T11:00:00Z',
    relevance: 0.85,
    tags: ['API', '文档', '接口'],
    size: 44800
  },
  {
    id: 'mem-6',
    title: '团队周会记录 - 第12周',
    content:
      '本周完成了用户模块的开发，下周计划开始订单模块。讨论了性能优化方案，决定引入虚拟滚动和懒加载技术。',
    type: 'document',
    timestamp: '2026-04-07T16:00:00Z',
    relevance: 0.7,
    tags: ['会议', '团队', '进度'],
    size: 12800
  },
  {
    id: 'mem-7',
    title: '产品演示视频',
    content:
      '完整的产品功能演示视频，展示了核心业务流程和用户体验亮点。时长约 15 分钟，包含配音字幕。',
    type: 'video',
    timestamp: '2026-04-07T10:30:00Z',
    relevance: 0.65,
    tags: ['演示', '视频', '产品'],
    size: 104857600
  },
  {
    id: 'mem-8',
    title: '单元测试最佳实践',
    content:
      '编写高质量的单元测试需要遵循 AAA 模式（Arrange-Act-Assert）。使用 Vitest 作为测试框架，配合 Testing Library 进行组件测试。',
    type: 'code',
    timestamp: '2026-04-06T14:20:00Z',
    relevance: 0.82,
    tags: ['测试', '代码质量', 'Vitest'],
    size: 19200
  },
  {
    id: 'mem-9',
    title: '数据库优化方案',
    content:
      '针对当前系统的慢查询问题，提出了索引优化、查询重构、读写分离等解决方案。预计可提升 50% 以上的查询性能。',
    type: 'document',
    timestamp: '2026-04-06T09:00:00Z',
    relevance: 0.78,
    tags: ['数据库', '性能', '优化'],
    size: 33600
  },
  {
    id: 'mem-10',
    title: '客户反馈汇总 Q1',
    content:
      '收集并整理了第一季度客户反馈，主要关注点包括：系统稳定性、操作便捷性、移动端适配等。已制定改进计划。',
    type: 'document',
    timestamp: '2026-04-05T15:45:00Z',
    relevance: 0.73,
    tags: ['反馈', '客户', 'Q1'],
    size: 28000
  },
  {
    id: 'mem-11',
    title: '安全审计报告',
    content:
      '完成了一次全面的安全审计，发现并修复了 3 个高危漏洞、5 个中危漏洞。建议定期进行安全扫描和依赖更新。',
    type: 'document',
    timestamp: '2026-04-04T11:30:00Z',
    relevance: 0.9,
    tags: ['安全', '审计', '漏洞'],
    size: 42000
  },
  {
    id: 'mem-12',
    title: '新员工培训材料',
    content:
      '为新入职员工准备的培训资料，包含公司文化、技术栈介绍、开发规范、协作流程等内容。预计培训周期为两周。',
    type: 'document',
    timestamp: '2026-04-03T09:00:00Z',
    relevance: 0.68,
    tags: ['培训', '新人', '流程'],
    size: 57600
  },
  {
    id: 'mem-13',
    title: '部署自动化脚本',
    content:
      '实现了 CI/CD 流水线自动化部署，使用 GitHub Actions 触发构建和部署。包含环境配置、健康检查、回滚机制等功能。',
    type: 'code',
    timestamp: '2026-04-02T16:20:00Z',
    relevance: 0.8,
    tags: ['DevOps', 'CI/CD', '自动化'],
    size: 8500
  },
  {
    id: 'mem-14',
    title: '竞品分析报告',
    content:
      '对市场上主要竞品进行了详细分析，从功能、性能、用户体验等多个维度进行了对比。发现了我们的差异化优势点。',
    type: 'document',
    timestamp: '2026-04-01T13:00:00Z',
    relevance: 0.77,
    tags: ['市场', '竞品', '分析'],
    size: 64000
  },
  {
    id: 'mem-15',
    title: '国际化方案设计',
    content:
      '制定了产品的国际化（i18n）实施方案，支持中文、英文、日文等多语言。采用 vue-i18n 库实现动态切换。',
    type: 'code',
    timestamp: '2026-03-31T10:30:00Z',
    relevance: 0.72,
    tags: ['i18n', '国际化', '多语言'],
    size: 15600
  },
  {
    id: 'mem-16',
    title: '性能监控仪表盘',
    content:
      '搭建了实时性能监控系统，可以查看接口响应时间、错误率、CPU/内存使用率等关键指标。支持告警通知功能。',
    type: 'image',
    timestamp: '2026-03-30T14:00:00Z',
    relevance: 0.69,
    tags: ['监控', '性能', '运维'],
    size: 896000
  },
  {
    id: 'mem-17',
    title: '代码审查指南',
    content:
      '制定团队代码审查标准和流程，重点关注代码质量、安全性、可维护性等方面。每次 PR 至少需要 2 人审核通过。',
    type: 'code',
    timestamp: '2026-03-29T09:45:00Z',
    relevance: 0.83,
    tags: ['Code Review', '规范', '流程'],
    size: 22000
  },
  {
    id: 'mem-18',
    title: '移动端适配方案',
    content:
      '针对不同设备尺寸进行了适配优化，采用响应式布局和弹性盒模型。测试覆盖了主流手机和平板设备。',
    type: 'document',
    timestamp: '2026-03-28T11:15:00Z',
    relevance: 0.71,
    tags: ['移动端', '响应式', '适配'],
    size: 18400
  },
  {
    id: 'mem-19',
    title: '日志分析工具',
    content:
      '开发了日志分析和可视化工具，支持按时间、级别、关键词过滤。可以帮助快速定位问题和分析系统运行状态。',
    type: 'code',
    timestamp: '2026-03-27T15:30:00Z',
    relevance: 0.76,
    tags: ['日志', '工具', '分析'],
    size: 31000
  },
  {
    id: 'mem-20',
    title: '年度总结 PPT',
    content:
      '2025 年度工作总结汇报，包含项目成果、技术突破、团队成长等内容。明年规划重点在 AI 能力建设和平台化发展。',
    type: 'document',
    timestamp: '2026-03-26T10:00:00Z',
    relevance: 0.67,
    tags: ['总结', '年度', '规划'],
    size: 76800
  },
  {
    id: 'mem-21',
    title: '微服务架构迁移计划',
    content:
      '计划将单体应用逐步拆分为微服务架构，采用 Docker 容器化部署，Kubernetes 编排管理。预计分三个阶段完成。',
    type: 'document',
    timestamp: '2026-03-25T14:20:00Z',
    relevance: 0.86,
    tags: ['微服务', '架构', '迁移'],
    size: 48000
  },
  {
    id: 'mem-22',
    title: '用户行为数据分析',
    content:
      '通过埋点数据分析了用户的使用习惯和偏好。发现大部分用户集中在上午 9-11 点和下午 2-4 点活跃度最高。',
    type: 'image',
    timestamp: '2026-03-24T09:00:00Z',
    relevance: 0.74,
    tags: ['数据', '分析', '用户行为'],
    size: 1560000
  },
  {
    id: 'mem-23',
    title: '错误追踪系统设计',
    content:
      '设计了统一的错误追踪和处理机制，支持错误上报、分类统计、自动告警等功能。集成 Sentry 服务实现实时监控。',
    type: 'code',
    timestamp: '2026-03-23T16:45:00Z',
    relevance: 0.81,
    tags: ['错误处理', 'Sentry', '监控'],
    size: 24000
  },
  {
    id: 'mem-24',
    title: '权限管理系统升级',
    content:
      '升级了 RBAC 权限模型，支持角色继承、细粒度权限控制、动态权限分配等功能。提升了系统的安全性和灵活性。',
    type: 'code',
    timestamp: '2026-03-22T11:30:00Z',
    relevance: 0.84,
    tags: ['权限', 'RBAC', '安全'],
    size: 36000
  },
  {
    id: 'mem-25',
    title: '设计规范手册',
    content:
      '整理了一套完整的 UI 设计规范，包含颜色体系、字体规范、间距标准、组件库使用说明等。确保产品设计的一致性。',
    type: 'image',
    timestamp: '2026-03-21T13:20:00Z',
    relevance: 0.79,
    tags: ['设计', '规范', 'UI'],
    size: 2304000
  },
  {
    id: 'mem-26',
    title: '缓存策略优化',
    content:
      '优化了 Redis 缓存策略，引入多级缓存机制，设置合理的过期时间和淘汰策略。接口响应速度提升约 40%。',
    type: 'document',
    timestamp: '2026-03-20T09:15:00Z',
    relevance: 0.87,
    tags: ['Redis', '缓存', '性能'],
    size: 19800
  },
  {
    id: 'mem-27',
    title: 'WebSocket 实时通信',
    content:
      '实现了基于 WebSocket 的实时消息推送功能，支持在线状态、即时消息、系统通知等场景。心跳检测保证连接稳定性。',
    type: 'code',
    timestamp: '2026-03-19T15:00:00Z',
    relevance: 0.78,
    tags: ['WebSocket', '实时', '通信'],
    size: 27200
  },
  {
    id: 'mem-28',
    title: 'SEO 优化实施报告',
    content:
      '完成了网站的 SEO 优化工作，包括语义化标签、meta 信息完善、sitemap 生成、结构化数据等。搜索引擎收录量显著提升。',
    type: 'document',
    timestamp: '2026-03-18T10:45:00Z',
    relevance: 0.73,
    tags: ['SEO', '搜索引擎', '优化'],
    size: 34000
  },
  {
    id: 'mem-29',
    title: 'A/B 测试框架',
    content:
      '搭建了 A/B 测试平台，支持实验创建、流量分配、数据采集、效果分析全流程。帮助产品决策更加数据驱动。',
    type: 'code',
    timestamp: '2026-03-17T14:30:00Z',
    relevance: 0.75,
    tags: ['A/B Test', '实验', '数据'],
    size: 29800
  },
  {
    id: 'mem-30',
    title: '技术债务清理计划',
    content:
      '梳理了项目中存在的技术债务，制定了优先级排序和清理计划。重点解决过时代码、重复逻辑、缺少测试等问题。',
    type: 'document',
    timestamp: '2026-03-16T09:00:00Z',
    relevance: 0.82,
    tags: ['技术债务', '重构', '优化'],
    size: 21000
  },
  {
    id: 'mem-31',
    title: '第三方服务集成文档',
    content:
      '整理了与支付、短信、邮件、存储等第三方服务的集成方式和注意事项。包含 API 调用示例和错误处理方案。',
    type: 'document',
    timestamp: '2026-03-15T11:00:00Z',
    relevance: 0.69,
    tags: ['集成', 'API', '第三方'],
    size: 52000
  },
  {
    id: 'mem-32',
    title: '容器化部署实践',
    content:
      '总结了 Docker 容器化部署的经验教训，包含镜像优化、多阶段构建、资源限制、日志管理等最佳实践。',
    type: 'code',
    timestamp: '2026-03-14T16:20:00Z',
    relevance: 0.77,
    tags: ['Docker', '容器化', '部署'],
    size: 16800
  }
];

export const mockBackupHistory: BackupRecord[] = [
  {
    id: 'backup-1',
    timestamp: '2026-04-10T02:00:00Z',
    size: 1073741824,
    status: 'success',
    type: 'incremental'
  },
  {
    id: 'backup-2',
    timestamp: '2026-04-09T02:00:00Z',
    size: 989855744,
    status: 'success',
    type: 'incremental'
  },
  {
    id: 'backup-3',
    timestamp: '2026-04-08T02:00:00Z',
    size: 2147483648,
    status: 'success',
    type: 'full'
  },
  {
    id: 'backup-4',
    timestamp: '2026-04-07T02:00:00Z',
    size: 943718400,
    status: 'success',
    type: 'incremental'
  },
  {
    id: 'backup-5',
    timestamp: '2026-04-06T02:00:00Z',
    size: 897581056,
    status: 'failed',
    type: 'incremental'
  },
  {
    id: 'backup-6',
    timestamp: '2026-04-05T02:00:00Z',
    size: 851999744,
    status: 'success',
    type: 'incremental'
  },
  {
    id: 'backup-7',
    timestamp: '2026-04-01T02:00:00Z',
    size: 2013265920,
    status: 'success',
    type: 'full'
  },
  {
    id: 'backup-8',
    timestamp: '2026-03-25T02:00:00Z',
    size: 1782579200,
    status: 'success',
    type: 'full'
  }
];

export const mockStorageStats: StorageStats = {
  totalSpace: 10737418240,
  usedSpace: 6442450944,
  categories: {
    documents: 2147483648,
    images: 1610612736,
    videos: 2147483648,
    code: 536870912,
    other: 134217728
  },
  largeFiles: [
    { name: '培训录像.avi', size: 209715200, modifiedAt: '2026-04-07T14:00:00Z' },
    { name: '产品演示.mp4', size: 104857600, modifiedAt: '2026-04-08T16:00:00Z' },
    { name: '设计规范手册.pdf', size: 2304000, modifiedAt: '2026-03-21T13:20:00Z' },
    { name: '用户行为分析.xlsx', size: 1560000, modifiedAt: '2026-03-24T09:00:00Z' },
    { name: '团队照片.jpg', size: 3584000, modifiedAt: '2026-04-07T15:20:00Z' },
    { name: '产品截图.png', size: 2048000, modifiedAt: '2026-04-08T10:00:00Z' },
    { name: '项目计划书.pdf', size: 2457600, modifiedAt: '2026-04-08T14:30:00Z' },
    { name: '竞品分析报告.pptx', size: 64000, modifiedAt: '2026-04-01T13:00:00Z' },
    { name: '年度总结.pptx', size: 76800, modifiedAt: '2026-03-26T10:00:00Z' },
    { name: '集成文档.pdf', size: 52000, modifiedAt: '2026-03-15T11:00:00Z' }
  ]
};
