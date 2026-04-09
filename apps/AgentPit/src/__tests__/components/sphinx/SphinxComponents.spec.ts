import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteWizard from '@/components/sphinx/SiteWizard.vue'
import TemplateGallery from '@/components/sphinx/TemplateGallery.vue'
import AISiteBuilder from '@/components/sphinx/AISiteBuilder.vue'
import SitePreview from '@/components/sphinx/SitePreview.vue'
import PublishPanel from '@/components/sphinx/PublishPanel.vue'

describe('SphinxPage 组件测试', () => {
  describe('SiteWizard 组件', () => {
    it('应该正确渲染向导组件', () => {
      const wrapper = mount(SiteWizard)
      expect(wrapper.find('h1').text()).toContain('Sphinx 快速建站向导')
      expect(wrapper.text()).toContain('选择类型')
      wrapper.unmount()
    })

    it('应该显示5个步骤导航', () => {
      const wrapper = mount(SiteWizard)
      const stepButtons = wrapper.findAll('nav button')
      expect(stepButtons.length).toBe(5)
      wrapper.unmount()
    })

    it('默认显示第一步内容', () => {
      const wrapper = mount(SiteWizard)
      expect(wrapper.text()).toContain('选择网站类型')
      expect(wrapper.text()).toContain('个人博客')
      expect(wrapper.text()).toContain('电商网站')
      wrapper.unmount()
    })

    it('网站类型选项可点击', async () => {
      const wrapper = mount(SiteWizard)
      const typeButtons = wrapper.findAll('.rounded-xl.border-2')
      await typeButtons[0].trigger('click')
      wrapper.unmount()
    })
  })

  describe('TemplateGallery 组件', () => {
    it('应该正确渲染模板画廊组件', () => {
      const onSelectTemplate = () => {}
      const wrapper = mount(TemplateGallery, {
        props: { onSelectTemplate }
      })
      expect(wrapper.text()).toContain('选择网站模板')
      wrapper.unmount()
    })

    it('应该显示分类筛选按钮', () => {
      const onSelectTemplate = () => {}
      const wrapper = mount(TemplateGallery, {
        props: { onSelectTemplate }
      })
      expect(wrapper.text()).toContain('全部')
      expect(wrapper.text()).toContain('电商')
      expect(wrapper.text()).toContain('博客')
      wrapper.unmount()
    })

    it('应该展示所有模板卡片', () => {
      const onSelectTemplate = () => {}
      const wrapper = mount(TemplateGallery, {
        props: { onSelectTemplate }
      })
      expect(wrapper.find('.grid').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('AISiteBuilder 组件', () => {
    it('应该正确渲染 AI 建站助手组件', () => {
      const wrapper = mount(AISiteBuilder)
      expect(wrapper.text()).toContain('Sphinx AI 建站助手')
      wrapper.unmount()
    })

    it('应该显示快捷提问按钮', () => {
      const wrapper = mount(AISiteBuilder)
      expect(wrapper.text()).toContain('我想做一个电商网站')
      expect(wrapper.text()).toContain('帮我做一个个人博客')
      wrapper.unmount()
    })

    it('应该有输入框和发送按钮', () => {
      const wrapper = mount(AISiteBuilder)
      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.find('button').text()).toContain('发送')
      wrapper.unmount()
    })
  })

  describe('SitePreview 组件', () => {
    it('应该正确渲染预览组件', () => {
      const wrapper = mount(SitePreview, {
        props: { siteName: '测试网站' }
      })
      expect(wrapper.text()).toContain('设备视图')
      wrapper.unmount()
    })

    it('应该显示设备切换按钮', () => {
      const wrapper = mount(SitePreview)
      expect(wrapper.text()).toContain('桌面')
      expect(wrapper.text()).toContain('平板')
      expect(wrapper.text()).toContain('手机')
      wrapper.unmount()
    })

    it('应该有刷新按钮', () => {
      const wrapper = mount(SitePreview)
      expect(wrapper.text()).toContain('刷新')
      wrapper.unmount()
    })
  })

  describe('PublishPanel 组件', () => {
    it('应该正确渲染发布面板组件', () => {
      const wrapper = mount(PublishPanel, {
        props: { siteConfig: {} }
      })
      expect(wrapper.text()).toContain('域名配置')
      wrapper.unmount()
    })

    it('应该显示 SEO 设置区域', () => {
      const wrapper = mount(PublishPanel, {
        props: { siteConfig: {} }
      })
      expect(wrapper.text()).toContain('SEO 设置')
      expect(wrapper.text()).toContain('SEO 标题')
      expect(wrapper.text()).toContain('SEO 描述')
      wrapper.unmount()
    })

    it('应该有一键发布按钮', () => {
      const wrapper = mount(PublishPanel, {
        props: { siteConfig: {} }
      })
      expect(wrapper.text()).toContain('一键发布')
      wrapper.unmount()
    })

    it('应该显示发布历史区域', () => {
      const wrapper = mount(PublishPanel, {
        props: { siteConfig: {} }
      })
      expect(wrapper.text()).toContain('发布历史')
      wrapper.unmount()
    })
  })
})
