import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AgentPit UI',
  description: 'AgentPit UI Component Library',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '主题定制', link: '/guide/theming' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Badge 徽章', link: '/components/badge' },
          ],
        },
        {
          text: '交互组件',
          items: [
            { text: 'Modal 模态框', link: '/components/modal' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Loader 加载', link: '/components/loader' },
            { text: 'Toast 提示', link: '/components/toast' },
          ],
        },
      ],
    },
  },
})
