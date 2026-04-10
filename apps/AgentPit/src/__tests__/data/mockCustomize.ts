export const avatarLibrary = Array.from({ length: 32 }, (_, i) => ({
  id: `avatar-${i}`,
  emoji: '😀',
  category: ['person', 'animal', 'abstract', 'tech', 'nature', 'food'][i % 6],
  name: `Avatar ${i + 1}`
}));

export const themeColors = Array.from({ length: 12 }, (_, i) => ({
  id: `theme-${i}`,
  name: `Theme ${i + 1}`,
  primary: `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`,
  secondary: '#1a1a1a',
  accent: '#ff6b6b',
  background: '#ffffff'
}));

export const abilities = [
  {
    id: 'conversation-understanding',
    name: 'Conversation Understanding',
    description: 'Understand conversations',
    category: 'conversation',
    defaultParams: {},
    dependencies: []
  },
  {
    id: 'context-memory',
    name: 'Context Memory',
    description: 'Remember context',
    category: 'conversation',
    defaultParams: {},
    dependencies: ['conversation-understanding']
  },
  {
    id: 'emotion-recognition',
    name: 'Emotion Recognition',
    description: 'Recognize emotions',
    category: 'conversation',
    defaultParams: {},
    dependencies: ['conversation-understanding']
  },
  {
    id: 'summarization',
    name: 'Summarization',
    description: 'Summarize text',
    category: 'analysis',
    defaultParams: {},
    dependencies: ['conversation-understanding']
  },
  {
    id: 'text-generation',
    name: 'Text Generation',
    description: 'Generate text',
    category: 'creative',
    defaultParams: {},
    dependencies: []
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Write creatively',
    category: 'creative',
    defaultParams: {},
    dependencies: ['text-generation']
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `ability-${i}`,
    name: `Ability ${i}`,
    description: `Description ${i}`,
    category: ['conversation', 'creative', 'analysis', 'tool', 'multimodal'][i % 5],
    defaultParams: {},
    dependencies: []
  }))
];

export const agentTemplates = Array.from({ length: 8 }, (_, i) => ({
  id: `template-${i}`,
  name: `Template ${i + 1}`,
  icon: '🤖',
  recommendedAbilities: ['conversation-understanding']
}));

export const sampleAgents = [
  {
    id: 'agent-1',
    name: 'Agent 1',
    status: 'published',
    config: {},
    stats: {}
  },
  { id: 'agent-2', name: 'Agent 2', status: 'draft', config: {}, stats: {} },
  {
    id: 'agent-3',
    name: 'Agent 3',
    status: 'published',
    config: {},
    stats: {}
  },
  { id: 'agent-4', name: 'Agent 4', status: 'draft', config: {}, stats: {} },
  {
    id: 'agent-5',
    name: 'Agent 5',
    status: 'published',
    config: {},
    stats: {}
  },
  { id: 'agent-6', name: 'Agent 6', status: 'disabled', config: {}, stats: {} },
  {
    id: 'agent-7',
    name: 'Agent 7',
    status: 'reviewing',
    config: {},
    stats: {}
  }
];

export const defaultAgentConfig = {
  basicInfo: { tags: [] },
  appearance: { fontSize: 14 },
  abilities: [],
  businessModel: {}
};

export const categories = [
  { value: 'assistant', label: 'Assistant' },
  { value: 'creative', label: 'Creative' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'tool', label: 'Tool' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'lifestyle', label: 'Lifestyle' }
];

export const abilityPresets = [
  { abilities: ['conversation-understanding', 'context-memory'] },
  { abilities: ['text-generation', 'creative-writing'] },
  { abilities: ['conversation-understanding', 'emotion-recognition'] },
  { abilities: ['summarization', 'context-memory'] }
];

export const analyticsData = {
  overview: { todayCalls: 150 },
  callTrend: Array.from({ length: 7 }, (_, i) => ({
    date: `2026-04-0${i + 1}`,
    count: Math.random() * 200
  })),
  userSource: [],
  topQuestions: [],
  feedbacks: [{ id: '1', rating: 5 }],
  performance: { successRate: 95 }
};
