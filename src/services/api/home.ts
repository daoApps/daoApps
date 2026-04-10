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
      return Promise.resolve(mockHome.getHomeModules())
    }
    const response = await httpClient.get<Module[]>('/home/modules')
    return response.data
  }
}