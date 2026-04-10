// src/services/api/sphinx.ts
import { httpClient, withMock } from './client';
import { API_CONFIG } from '../config';

// Mock 数据导入
import * as mockSphinx from '../../data/mockSphinx';

// 类型定义
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  popularity: number;
}

export interface SitePreview {
  id: string;
  url: string;
  status: 'draft' | 'published';
  lastUpdated: string;
}

export interface SiteGenerateRequest {
  templateId: string;
  content: Record<string, any>;
  settings: Record<string, any>;
}

// API 服务
export const sphinxApi = {
  // 获取模板列表
  getTemplates: withMock(
    () => mockSphinx.getTemplates(),
    () => httpClient.get<Template[]>('/sphinx/templates').then(res => res.data)
  ),

  // 预览网站
  getSitePreview: withMock(
    (siteId: string) => mockSphinx.getSitePreview(siteId),
    (siteId: string) =>
      httpClient.get<SitePreview>(`/sphinx/preview/${siteId}`).then(res => res.data)
  ),

  // 生成网站
  generateSite: withMock(
    (request: SiteGenerateRequest) => mockSphinx.generateSite(request),
    (request: SiteGenerateRequest) =>
      httpClient.post<SitePreview>('/sphinx/generate', request).then(res => res.data)
  ),

  // 发布网站
  publishSite: withMock(
    (siteId: string) => mockSphinx.publishSite(siteId),
    (siteId: string) =>
      httpClient.post<SitePreview>(`/sphinx/publish/${siteId}`).then(res => res.data)
  )
};
