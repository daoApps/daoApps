// src/services/api/home.ts
import { httpClient } from './client'
import { API_CONFIG } from '../config'

// Mock 数据导入
import * as mockHome from '../../data/mockHome'

// 类型定义
export interface Module {
  id: string
  title: string
  description: string
  icon: string
  route: string
  status: 'active' | 'inactive'
  badge?: number
}

// API 服务
export const homeApi = {
  // 获取模块列表
  async getModules(): Promise<Module[]> {
    if (API_CONFIG.useMock) {
      return Promise.resolve(mockHome.allModules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        icon: module.icon,
        route: module.routePath,
        status: 'active' as const,
        badge: typeof module.badge === 'string' ? parseInt(module.badge) : module.badge
      })))
    }
    const response = await httpClient.get<Module[]>('/home/modules')
    return response.data
  }
}