import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/monetization',
    name: 'Monetization',
    component: () => import('../views/MonetizationPage.vue')
  },
  {
    path: '/sphinx',
    name: 'Sphinx',
    component: () => import('../views/SphinxPage.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatPage.vue')
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/SocialPage.vue')
  },
  {
    path: '/marketplace',
    name: 'Marketplace',
    component: () => import('../views/MarketplacePage.vue')
  },
  {
    path: '/marketplace/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/MarketplacePage.vue')
  },
  {
    path: '/collaboration',
    name: 'Collaboration',
    component: () => import('../views/CollaborationPage.vue')
  },
  {
    path: '/memory',
    name: 'Memory',
    component: () => import('../views/MemoryPage.vue')
  },
  {
    path: '/customize',
    name: 'Customize',
    component: () => import('../views/CustomizePage.vue')
  },
  {
    path: '/lifestyle',
    name: 'Lifestyle',
    component: () => import('../views/LifestylePage.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
