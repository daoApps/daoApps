import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

export default pinia

// 导出所有 stores
export { useAppStore } from './useAppStore'
export { useChatStore } from './useChatStore'
export { useMonetizationStore } from './useMonetizationStore'
export { useUserStore } from './useUserStore'
