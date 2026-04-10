// src/services/api/sphinx.ts
import { httpClient } from './client'
import { API_CONFIG } from '../config'

// Mock 数据导入
import * as mockSphinx from '../../data/mockSphinx'

// 类型定义
export interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: string
  popularity: number
}

export interface SitePreview {
  id: string
  url: string
  status: 'draft' | 'published'
  lastUpdated: string
}

export interface SiteGenerateRequest {
  templateId: string
  content: Record<string, any>
  settings: Record<string, any>
}

// API 服务
export const sphinxApi = {
  // 获取模板列表
  async getTemplates(): Promise<Template[]> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockSphinx.templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        preview: '',
        category: template.category,
        popularity: 0
      })))
    }
    const response = await httpClient.get<Template[]>('/sphinx/templates')
    return response.data
  },

  // 预览网站
  async getSitePreview(siteId: string): Promise<SitePreview> {
    if (API_CONFIG.useMock) {
      return Promise.resolve({
        id: siteId,
        url: `http://localhost:5173/preview/${siteId}`,
        status: 'draft' as const,
        lastUpdated: new Date().toISOString()
      })
    }
    const response = await httpClient.get<SitePreview>(`/sphinx/preview/${siteId}`)
    return response.data
  },

  // 生成网站
  async generateSite(request: SiteGenerateRequest): Promise<SitePreview> {
    if (API_CONFIG.useMock) {
      return Promise.resolve({
        id: `site-${Date.now()}`,
        url: `http://localhost:5173/preview/site-${Date.now()}`,
        status: 'draft' as const,
        lastUpdated: new Date().toISOString()
      })
    }
    const response = await httpClient.post<SitePreview>('/sphinx/generate', request)
    return response.data
  },

  // 发布网站
  async publishSite(siteId: string): Promise<SitePreview> {
    if (API_CONFIG.useMock) {
      return Promise.resolve({
        id: siteId,
        url: `http://localhost:5173/site/${siteId}`,
        status: 'published' as const,
        lastUpdated: new Date().toISOString()
      })
    }
    const response = await httpClient.post<SitePreview>(`/sphinx/publish/${siteId}`)
    return response.data
  }
}