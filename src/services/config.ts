// src/services/config.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  useMock: import.meta.env.VITE_USE_MOCK_API === 'true',
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  }
}