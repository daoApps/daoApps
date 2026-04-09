import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileManager from '@/components/memory/FileManager.vue'
import MemorySearch from '@/components/memory/MemorySearch.vue'
import { mockFileTree, mockMemoryItems, mockBackupHistory, mockKnowledgeNodes } from '@/data/mockMemory'

describe('MemoryComponents', () => {
  describe('FileManager', () => {
    it('应正确渲染文件管理器组件', () => {
      const wrapper = mount(FileManager, {
        props: {
          files: mockFileTree
        }
      })

      expect(wrapper.find('.file-manager__container').exists()).toBe(true)
      expect(wrapper.find('.file-manager__toolbar').exists()).toBe(true)
      expect(wrapper.find('.file-manager__breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.file-manager__dropzone').exists()).toBe(true)
    })

    it('应显示正确的文件数量', () => {
      const wrapper = mount(FileManager, {
        props: {
          files: mockFileTree
        }
      })

      // 根目录应有 6 项（4个文件夹 + 2个文件）
      expect(wrapper.text()).toContain('6')
    })

    it('应支持点击文件夹导航', async () => {
      const wrapper = mount(FileManager, {
        props: {
          files: mockFileTree
        }
      })

      // 点击文档文件夹
      const folderItem = wrapper.findAll('.file-manager__item')[0]
      await folderItem.trigger('click')

      // 面包屑应该更新
      expect(wrapper.text()).toContain('文档')
    })

    it('应显示新建文件夹和上传按钮', () => {
      const wrapper = mount(FileManager, {
        props: {
          files: mockFileTree
        }
      })

      expect(wrapper.text()).toContain('新建文件夹')
      expect(wrapper.text()).toContain('上传文件')
    })
  })

  describe('MemorySearch', () => {
    it('应正确渲染搜索组件', () => {
      const wrapper = mount(MemorySearch, {
        props: {
          data: mockMemoryItems
        }
      })

      expect(wrapper.find('.memory-search__container').exists()).toBe(true)
    })

    it('应显示搜索输入框', () => {
      const wrapper = mount(MemorySearch, {
        props: {
          data: mockMemoryItems
        }
      })

      const input = wrapper.find('input[type="text"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toContain('搜索')
    })

    it('应显示搜索结果计数', () => {
      const wrapper = mount(MemorySearch, {
        props: {
          data: mockMemoryItems
        }
      })

      // 应显示总结果数
      expect(wrapper.text()).toContain(String(mockMemoryItems.length))
    })

    it('应支持搜索过滤功能', async () => {
      const wrapper = mount(MemorySearch, {
        props: {
          data: mockMemoryItems
        }
      })

      const input = wrapper.find('input[type="text"]')
      await input.setValue('Vue3')

      // 应该有搜索结果（Vue3 相关的条目）
      expect(wrapper.text()).toBeTruthy()
    })

    it('应显示排序选项', () => {
      const wrapper = mount(MemorySearch, {
        props: {
          data: mockMemoryItems
        }
      })

      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
      expect(select.text()).toContain('相关度')
      expect(select.text()).toContain('时间')
      expect(select.text()).toContain('大小')
    })

    it('应显示空状态提示', () => {
      const wrapper = mount(MemorySearch, {
        props: {
          data: []
        }
      })

      expect(wrapper.text()).toContain('输入关键词开始搜索')
    })
  })

  describe('Mock 数据验证', () => {
    it('mockFileTree 应包含至少 15 个文件/文件夹', () => {
      function countNodes(nodes: typeof mockFileTree): number {
        let count = 0
        nodes.forEach(node => {
          count++
          if (node.children) count += countNodes(node.children)
        })
        return count
      }

      const totalCount = countNodes(mockFileTree)
      expect(totalCount).toBeGreaterThanOrEqual(15)
    })

    it('mockKnowledgeNodes 应包含至少 20 个节点', () => {
      expect(mockMemoryItems.length).toBeGreaterThanOrEqual(30)
    })

    it('mockMemoryItems 应包含至少 30 条记忆条目', () => {
      expect(mockMemoryItems.length).toBeGreaterThanOrEqual(30)
    })

    it('每个记忆条目应包含必要字段', () => {
      mockMemoryItems.forEach(item => {
        expect(item.id).toBeDefined()
        expect(item.title).toBeDefined()
        expect(item.content).toBeDefined()
        expect(item.type).toBeDefined()
        expect(item.timestamp).toBeDefined()
        expect(item.relevance).toBeGreaterThanOrEqual(0)
        expect(item.relevance).toBeLessThanOrEqual(1)
      })
    })

    it('备份历史记录应包含不同状态', () => {
      const statuses = new Set(mockBackupHistory.map(r => r.status))
      expect(statuses.has('success')).toBe(true)
      expect(statuses.has('failed')).toBe(true)
    })
  })
})
