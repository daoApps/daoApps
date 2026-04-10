---
name: "flexloop-sso"
description: "为 Flexloop 子应用生成 OAuth2 SSO 单点登录功能模块，包含后端 OAuth 端点、前端回调页和防循环机制。当用户需要集成 Flexloop 平台授权登录、实现单点登录或添加第三方 OAuth 认证时调用此技能。"
---

# Flexloop SSO 单点登录功能生成器

## 概述

此技能用于在 Flexloop 项目中快速集成 **Flexloop 平台 OAuth2 单点登录（SSO）** 功能，提供完整的认证流程实现。

## OAuth2 凭证配置

```typescript
/**
 * ⚠️ 安全提示：请勿在此处硬编码真实凭证！
 * 所有敏感值应通过环境变量注入，或使用占位符格式。
 *
 * 参考实现（A2APersonalAgent 项目标准）：
 * - 使用 process.env 读取运行时配置
 * - Fallback 值使用 [UPPER_CASE_NAME] 占位符格式
 * - 真实值存储在 .env.local 文件中（已 gitignore）
 */

// 类型定义（仅用于文档说明，实际使用时从环境变量读取）
interface FlexloopOAuthConfig {
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  callbackUrl: string
  providerName: string
  loginButtonText: string
  scope: string[]
}

// ✅ 安全的配置读取方式（推荐）
function getOAuthConfig(): FlexloopOAuthConfig {
  return {
    authorizationUrl: process.env.FLEXLOOP_OAUTH_AUTH_URL || 'https://pagent.flexloop.tech/oauth2/authorize',
    tokenUrl: process.env.FLEXLOOP_OAUTH_TOKEN_URL || 'https://pagent.flexloop.tech/oauth2/token',
    callbackUrl: process.env.FLEXLOOP_OAUTH_CALLBACK_URL || 'https://pagent.flexloop.tech/api/auth/flexloop/callback',
    // 🔒 关键：从环境变量读取，fallback 为占位符
    clientId: process.env.FLEXLOOP_OAUTH_CLIENT_ID || '[CLIENT_ID]',
    clientSecret: process.env.FLEXLOOP_OAUTH_CLIENT_SECRET || '[CLIENT_SECRET]',
    providerName: 'flexloop',
    loginButtonText: 'flexloop 授权登陆',
    scope: ['openid', 'profile', 'email'],
  }
}
```

## 功能特性

### ✅ 核心功能
- 🔐 **OAuth2 授权码流程**: 完整的 Authorization Code Flow 实现
- 🔄 **自动回调处理**: 前端回调页面 + 后端令牌交换
- 🛡️ **防循环重定向**: CSRF 保护 + State 参数验证 + 重定向计数器
- 👤 **用户信息同步**: 自动获取并同步用户资料（头像、昵称、邮箱）
- 📱 **多平台适配**: Web / 移动端 / 桌面应用统一认证入口

### 🎯 技术栈要求
- **框架**: Next.js 15 (App Router) 或 Vue 3 (当前项目)
- **认证库**: NextAuth.js v5 (Next.js) / vue-auth (Vue)
- **类型安全**: TypeScript Strict Mode
- **UI 组件**: shadcn/ui (Next.js) / 自定义组件 (Vue)

---

## 实现步骤

### 阶段 1: 配置文件准备

#### 1.1 环境变量配置

**文件**: `.env.local` (或 `.env.production`)

```bash
# ============================================
# Flexloop OAuth2 SSO 配置
# ============================================
#
# ⚠️ 安全警告：此文件包含敏感配置信息
# 请勿将包含真实值的此文件提交到版本控制系统！
#
# 使用方式：
#   1. 复制模板：cp skills/.env.skills.template .env.local
#   2. 编辑 .env.local，填入真实的凭证
#   3. 确保 .env.local 已在 .gitignore 中
#

# OAuth2 提供商信息（必填）
# 从 Flexloop 平台获取：https://pagent.flexloop.tech/console
FLEXLOOP_OAUTH_CLIENT_ID=[CLIENT_ID]
FLEXLOOP_OAUTH_CLIENT_SECRET=[CLIENT_SECRET]

# OAuth2 端点地址（通常不需要修改）
FLEXLOOP_OAUTH_AUTH_URL=https://pagent.flexloop.tech/oauth2/authorize
FLEXLOOP_OAUTH_TOKEN_URL=https://pagent.flexloop.tech/oauth2/token
FLEXLOOP_OAUTH_CALLBACK_URL=https://pagent.flexloop.tech/api/auth/flexloop/callback

# 应用回调地址（你的应用接收 OAuth 回调的 URL）
NEXT_PUBLIC_APP_CALLBACK_URL=http://localhost:3000/api/auth/callback/flexloop
# 生产环境: https://your-app.com/api/auth/callback/flexloop

# 登录成功后的重定向地址
NEXT_PUBLIC_LOGIN_SUCCESS_REDIRECT=/dashboard

# 安全配置
# ⚠️ State Secret 必须是强随机字符串（至少 32 字符）
# 生成命令: openssl rand -base64 32 | tr -d '\n'
FLEXLOOP_OAUTH_STATE_SECRET=[STATE_SECRET]

# 最大允许的重定向次数（防循环）
FLEXLOOP_MAX_REDIRECT_COUNT=5
```

#### 1.2 类型定义文件

**文件**: `src/types/oauth.ts`

```typescript
/**
 * Flexloop OAuth2 类型定义
 */

export interface FlexloopOAuthConfig {
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  callbackUrl: string
  scope: string[]
}

export interface FlexloopUser {
  id: string
  email: string
  name: string
  avatar?: string
  provider: 'flexloop'
}

export interface OAuthState {
  state: string
  codeVerifier: string
  redirectUri: string
  timestamp: number
  redirectCount: number
}

export interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: 'Bearer'
  scope: string
}

export interface CallbackParams {
  code: string
  state: string
  error?: string
  error_description?: string
}
```

---

### 阶段 2: 后端 OAuth 端点实现

#### 2.1 OAuth 服务层

**文件**: `src/services/oauth/agentpit-oauth.ts`

```typescript
import type { FlexloopOAuthConfig, OAuthState, OAuthTokenResponse, CallbackParams } from '@/types/oauth'
import { generateRandomString, sha256 } from '@/utils/crypto'

class FlexloopOAuthService {
  private config: FlexloopOAuthConfig

  constructor() {
    // ✅ 安全的写法（必须使用）
    this.config = {
      clientId: process.env.FLEXLOOP_OAUTH_CLIENT_ID!,
      clientSecret: process.env.FLEXLOOP_OAUTH_CLIENT_SECRET!,  // 注意：修正拼写错误
      authorizationUrl: process.env.FLEXLOOP_OAUTH_AUTH_URL!,
      tokenUrl: process.env.FLEXLOOP_OAUTH_TOKEN_URL!,
      callbackUrl: process.env.FLEXLOOP_OAUTH_CALLBACK_URL!,
      scope: ['openid', 'profile', 'email'],
    }

    // 添加运行时验证
    if (!this.config.clientId || this.config.clientId === '[CLIENT_ID]') {
      throw new Error('Missing required environment variable: FLEXLOOP_OAUTH_CLIENT_ID')
    }
    if (!this.config.clientSecret || this.config.clientSecret === '[CLIENT_SECRET]') {
      throw new Error('Missing required environment variable: FLEXLOOP_OAUTH_CLIENT_SECRET')
    }
  }

  /**
   * 生成授权 URL 并返回 state 和 code_verifier
   */
  async getAuthorizationUrl(redirectUri: string = '/'): Promise<{ url: string; state: OAuthState }> {
    const state = generateRandomString(32)
    const codeVerifier = generateRandomString(64)
    
    // PKCE: 生成 code_challenge
    const codeChallenge = await sha256(codeVerifier)
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.getCallbackUrl(),
      scope: this.config.scope.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })

    const url = `${this.config.authorizationUrl}?${params.toString()}`

    const oauthState: OAuthState = {
      state,
      codeVerifier,
      redirectUri,
      timestamp: Date.now(),
      redirectCount: 0,
    }

    return { url, state: oauthState }
  }

  /**
   * 处理 OAuth 回调，交换授权码获取访问令牌
   */
  async handleCallback(params: CallbackParams, storedState: OAuthState): Promise<OAuthTokenResponse> {
    // 验证 state 参数防止 CSRF
    if (params.state !== storedState.state) {
      throw new Error('Invalid state parameter. Possible CSRF attack.')
    }

    // 检查是否超过最大重定向次数（防循环）
    if (storedState.redirectCount >= parseInt(process.env.AGENTPIT_MAX_REDIRECT_COUNT || '5')) {
      throw new Error('Maximum redirect count exceeded. Possible redirect loop detected.')
    }

    // 处理错误响应
    if (params.error) {
      throw new Error(`OAuth error: ${params.error} - ${params.error_description}`)
    }

    // 交换授权码获取令牌
    const tokenResponse = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: this.getCallbackUrl(),
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code_verifier: storedState.codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`)
    }

    return tokenResponse.json()
  }

  /**
   * 使用访问令牌获取用户信息
   */
  async getUserInfo(accessToken: string): Promise<FlexloopUser> {
    const userInfoUrl = 'https://pagent.flexloop.tech/api/userinfo' // 根据实际 API 调整
    
    const response = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      id: data.sub || data.id,
      email: data.email,
      name: data.name || data.preferred_username,
      avatar: data.picture || data.avatar_url,
      provider: 'flexloop',
    }
  }

  private getCallbackUrl(): string {
    return process.env.NEXT_PUBLIC_APP_CALLBACK_URL || `${window.location.origin}/api/auth/callback/flexloop`
  }
}

export const flexloopOAuthService = new FlexloopOAuthService()
```

#### 2.2 API 路由 - 发起授权

**文件**: `src/pages/api/auth/login/flexloop.ts` (Pages Router) 或 `src/app/api/auth/login/flexloop/route.ts` (App Router)

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { flexloopOAuthService } from '@/services/oauth/flexloop-oauth'
import { setCookie } from '@/utils/cookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const redirectUri = (req.query.redirect as string) || '/'
    
    // 生成授权 URL 和 state
    const { url, state } = await flexloopOAuthService.getAuthorizationUrl(redirectUri)

    // 将 state 存储到 cookie（HTTPOnly, Secure, SameSite=Strict）
    setCookie(res, 'oauth_state', JSON.stringify(state), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 分钟有效期
      path: '/',
    })

    // 重定向到授权页面
    res.redirect(302, url)
  } catch (error) {
    console.error('OAuth login initiation failed:', error)
    res.status(500).json({ 
      error: 'Failed to initiate OAuth login',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
```

#### 2.3 API 路由 - 处理回调

**文件**: `src/pages/api/auth/callback/flexloop.ts` (Pages Router) 或 `src/app/api/auth/callback/flexloop/route.ts` (App Router)

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { flexloopOAuthService } from '@/services/oauth/flexloop-oauth'
import { getCookie, setCookie, deleteCookie } from '@/utils/cookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json { error: 'Method not allowed' })
    }

    const { code, state, error, error_description } = req.query as CallbackParams

    // 🔒 安全提示：日志中不要记录 clientSecret 或完整 token 信息
    console.log('Processing OAuth callback for state:', state?.substring(0, 8) + '...')

    // 从 cookie 获取存储的 state
    const stateCookie = getCookie(req, 'oauth_state')
    
    if (!stateCookie) {
      return res.redirect('/login?error=missing_state')
    }

    let storedState: OAuthState
    try {
      storedState = JSON.parse(stateCookie)
    } catch {
      return res.redirect('/login?error=invalid_state')
    }

    // 删除已使用的 state cookie（一次性使用）
    deleteCookie(res, 'oauth_state')

    // 更新重定向计数（防循环）
    storedState.redirectCount += 1

    // 处理 OAuth 回调
    const tokens = await flexloopOAuthService.handleCallback(
      { code, state, error, error_description },
      storedState
    )

    // 获取用户信息
    const user = await flexloopOAuthService.getUserInfo(tokens.access_token)

    // 在这里创建或更新用户会话/JWT
    // 例如: await createUserSession(user, tokens)

    // 设置认证 cookie
    setCookie(res, 'auth_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    })

    // 可选: 存储 refresh_token 到 HttpOnly cookie
    if (tokens.refresh_token) {
      setCookie(res, 'refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 天
        path: '/api/auth/refresh',
      })
    }

    // 重定向到原始请求页面或默认页面
    const redirectUrl = storedState.redirectUri || process.env.NEXT_PUBLIC_LOGIN_SUCCESS_REDIRECT || '/dashboard'
    res.redirect(302, redirectUrl)

  } catch (error) {
    console.error('OAuth callback handling failed:', error)
    
    const errorMessage = encodeURIComponent(
      error instanceof Error ? error.message : 'Authentication failed'
    )
    res.redirect(`/login?error=${errorMessage}`)
  }
}
```

---

### 阶段 3: 前端组件实现

#### 3.1 登录按钮组件

**文件**: `src/components/auth/FlexloopLoginButton.vue` (Vue) 或 `src/components/auth/FlexloopLoginButton.tsx` (React/Next.js)

```vue
<template>
  <button
    @click="handleLogin"
    :disabled="isLoading"
    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-6 py-3 text-white font-medium shadow-sm hover:bg-[#5558e3] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="isLoading"
      class="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>

    <!-- Flexloop Logo/Icon -->
    <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
    </svg>

    <span>{{ buttonText }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  buttonText?: string
  redirectTo?: string
}>(), {
  buttonText: 'flexloop 授权登陆',
  redirectTo: '/dashboard'
})

const isLoading = ref(false)

const handleLogin = async () => {
  try {
    isLoading.value = true
    
    // 构建授权 URL
    const params = new URLSearchParams({
      redirect_uri: props.redirectTo,
    })
    
    // 调用后端 API 发起 OAuth 流程
    window.location.href = `/api/auth/login/flexloop?${params.toString()}`
    
  } catch (error) {
    console.error('Login failed:', error)
    isLoading.value = false
    // 显示错误提示
  }
}
</script>
```

#### 3.2 回调处理页面

**文件**: `src/views/AuthCallback.vue` (Vue) 或 `src/app/auth/callback/page.tsx` (Next.js App Router)

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <!-- Loading Animation -->
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      
      <h2 class="text-xl font-semibold text-gray-900 mb-2">
        {{ statusMessage }}
      </h2>
      
      <p class="text-gray-600 mb-4">
        {{ statusDescription }}
      </p>

      <!-- 错误状态 -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800 text-sm">{{ error }}</p>
        <button 
          @click="retryLogin"
          class="mt-2 text-red-600 hover:text-red-800 underline text-sm"
        >
          重试登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const statusMessage = ref('正在完成身份验证...')
const statusDescription = ref('请稍候，我们正在处理您的登录请求')
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // 检查 URL 参数中是否有错误
    const urlError = route.query.error as string
    if (urlError) {
      error.value = decodeURIComponent(urlError)
      statusMessage.value = '登录失败'
      statusDescription.value = '身份验证过程中出现错误'
      return
    }

    // 检查是否有 code 和 state 参数（OAuth 回调）
    const code = route.query.code as string
    const state = route.query.state as string

    if (code && state) {
      // 如果是直接回调（未通过后端），手动调用后端 API
      statusMessage.value = '正在验证凭证...'
      
      const response = await fetch(`/api/auth/callback/flexloop?code=${code}&state=${state}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.redirected) {
        // 后端会重定向到目标页面
        window.location.href = response.url
      } else if (response.ok) {
        // 成功，重定向到主页
        router.push(route.query.redirect as string || '/dashboard')
      } else {
        const data = await response.json()
        error.value = data.error || 'Authentication failed'
        statusMessage.value = '登录失败'
      }
    } else {
      // 没有 OAuth 参数，可能是直接访问此页面
      router.push('/login')
    }
  } catch (err) {
    console.error('Auth callback error:', err)
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    statusMessage.value = '出现错误'
  }
})

const retryLogin = () => {
  error.value = null
  router.push('/login')
}
</script>
```

---

### 阶段 4: 防循环机制与安全增强

#### 4.1 防循环重定向中间件

**文件**: `src/middleware/oauth-guard.ts`

```typescript
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * 防循环重定向中间件
 * 
 * 检测并阻止 OAuth 回调过程中的无限重定向循环
 */
export function oauthRedirectGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname
  
  // 仅对 OAuth 相关路径启用检查
  if (!pathname.startsWith('/api/auth/') && !pathname.includes('/callback')) {
    return null
  }

  // 获取重定向计数器
  const redirectCount = parseInt(request.cookies.get('redirect_count')?.value || '0')
  
  // 超过阈值则阻止
  if (redirectCount >= 5) {
    const response = NextResponse.redirect(new URL('/login?error=redirect_loop', request.url))
    response.cookies.delete('redirect_count')
    return response
  }

  // 增加计数器
  const response = NextResponse.next()
  response.cookies.set('redirect_count', String(redirectCount + 1), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300, // 5 分钟
  })

  return null // 继续正常流程
}
```

#### 4.2 State 参数验证工具

**文件**: `src/utils/oauth-state.ts`

```typescript
import crypto from 'crypto'

/**
 * 生成安全的随机字符串（用于 OAuth state 和 PKCE code_verifier）
 */
export function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length)
}

/**
 * 生成 SHA-256 哈希（用于 PKCE code_challenge）
 */
export async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Buffer.from(hashBuffer).toString('base64url')
}

/**
 * 验证 OAuth state 参数的有效性
 */
export function validateState(receivedState: string, storedState: string): boolean {
  if (!receivedState || !storedState) return false
  if (receivedState.length !== storedState.length) return false
  
  // 使用恒定时间比较防止时序攻击
  return crypto.timingSafeEqual(
    Buffer.from(receivedState),
    Buffer.from(storedState)
  )
}

/**
 * 检测重定向循环
 */
export function detectRedirectLoop(currentPath: string, history: string[], maxDepth: number = 5): boolean {
  // 检查最近 N 次请求是否都是同一个路径
  const recentPaths = history.slice(-maxDepth)
  return recentPaths.every(path => path === currentPath)
}
```

---

### 阶段 5: 路由配置

#### 5.1 Vue Router 配置

**文件**: `src/router/index.ts` (添加以下路由)

```typescript
{
  path: '/auth/callback/:provider?',
  name: 'AuthCallback',
  component: () => import('@/views/AuthCallback.vue'),
  meta: {
    requiresAuth: false,
    isOAuthCallback: true,
  },
}

{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/Login.vue'),
  meta: {
    requiresAuth: false,
  },
}
```

#### 5.2 导航守卫（可选）

**文件**: `src/router/guards.ts`

```typescript
import type { Router } from 'vue-router'

export function setupOAuthGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    // 如果是 OAuth 回调页面，允许通过
    if (to.meta.isOAuthCallback) {
      return next()
    }

    // 检查是否有正在进行的 OAuth 流程
    const oauthInProgress = sessionStorage.getItem('oauth_in_progress')
    if (oauthInProgress && to.path !== '/auth/callback') {
      // 正在进行 OAuth，不拦截
      return next()
    }

    next()
  })
}
```

---

## 使用示例

### 示例 1: 在登录页面使用

**文件**: `src/views/Login.vue`

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">欢迎回来</h1>
        <p class="mt-2 text-gray-600">选择一种方式登录您的账户</p>
      </div>

      <div class="space-y-4">
        <!-- Flexloop SSO 登录按钮 -->
        <FlexloopLoginButton 
          button-text="flexloop 授权登陆"
          redirect-to="/dashboard"
          @success="onLoginSuccess"
          @error="onLoginError"
        />

        <!-- 或者使用其他登录方式 -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">或者</span>
          </div>
        </div>

        <!-- 传统登录表单... -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlexloopLoginButton from '@/components/auth/FlexloopLoginButton.vue'

const onLoginSuccess = (user: FlexloopUser) => {
  console.log('Logged in:', user.name)
  // 跳转到首页或之前尝试访问的页面
}

const onLoginError = (error: Error) => {
  console.error('Login failed:', error.message)
  // 显示错误提示
}
</script>
```

### 示例 2: 编程式触发登录

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// 直接跳转到 OAuth 登录
function loginWithFlexloop() {
  window.location.href = `/api/auth/login/flexloop?redirect=/settings`
}

// 在特定操作前检查登录状态
async function requireAuth() {
  const isAuthenticated = checkAuthToken()
  
  if (!isAuthenticated) {
    // 保存当前路径以便登录后返回
    sessionStorage.setItem('post_login_redirect', router.currentRoute.value.fullPath)
    
    // 触发 OAuth 登录
    loginWithFlexloop()
    return false
  }
  
  return true
}
```

---

## 安全注意事项

### ⚠️ 必须遵守的安全实践

1. **Client Secret 保密**
   - ❌ 绝对不要在前端代码中暴露 `clientSecret`
   - ✅ 只能在服务器端 API 路由中使用
   - ✅ 通过环境变量管理，不要提交到 Git

2. **State 参数验证**
   - ✅ 每次授权请求必须生成唯一的 `state`
   - ✅ 回调时必须严格验证 `state` 匹配
   - ✅ 使用 `crypto.timingSafeEqual()` 防止时序攻击

3. **PKCE 扩展（推荐）**
   - ✅ 对于 SPA（单页应用），强烈建议使用 PKCE
   - ✅ 生成 `code_verifier` 和 `code_challenge`
   - ✅ 即使 Client Secret 泄露也能保证安全

4. **HTTPS 强制**
   - ✅ 生产环境必须使用 HTTPS
   - ✅ 所有回调 URL 必须是 HTTPS
   - ✅ Cookie 必须设置 `Secure` 标志

5. **Token 安全存储**
   - ✅ Access Token 存储在 HttpOnly Cookie 中
   - ✅ Refresh Token 存储在独立的 HttpOnly Cookie 中
   - ❌ 不要将 Token 存储在 localStorage（易受 XSS 攻击）

6. **防循环保护**
   - ✅ 实现重定向计数器（建议最多 5 次）
   - ✅ 超过限制时显示错误页面而非无限重定向
   - ✅ 记录异常重定向模式用于监控

---

## 故障排查

### 常见问题及解决方案

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| `invalid_state` 错误 | State 参数丢失或不匹配 | 检查 Cookie 是否正确设置和读取 |
| `redirect_loop` 检测 | 回调 URL 配置错误 | 确保 `callbackUrl` 与 OAuth 提供商注册的一致 |
| `token_exchange_failed` | Client ID/Secret 错误 | 验证环境变量配置是否正确 |
| CORS 错误 | 前端直接调用 Token API | 确保所有 Token 交换在后端进行 |
| 移动端登录失败 | 弹窗被阻止 | 使用重定向方式而非弹窗 |

---

## 测试清单

- [ ] 点击 "flexloop 授权登陆" 按钮能正确跳转到授权页面
- [ ] 授权后能正确回调到应用
- [ ] 用户信息正确同步（头像、昵称、邮箱）
- [ ] 刷新页面后保持登录状态
- [ ] 注销功能正常工作
- [ ] 手动篡改 state 参数会被拒绝
- [ ] 连续多次快速点击不会导致重复授权
- [ ] 网络中断后恢复不会卡在中间状态
- [ ] 移动端浏览器兼容性正常
- [ ] 多标签页同时登录互不影响

---

## 下一步扩展

- 🔗 **多 Provider 支持**: 同时支持 Google、GitHub 等 OAuth 提供商
- 🔄 **Token 自动刷新**: 使用 Refresh Token 实现 Access Token 无感刷新
- 📊 **登录统计**: 记录登录来源、成功率等指标
- 🛡️ **速率限制**: 防止暴力破解和滥用
- 🌍 **国际化**: 支持多语言登录界面

---

## 🔒 安全最佳实践（重要）

### ✅ 必须遵守的安全规则

1. **绝不提交 `.env.local` 到 Git**
   ```bash
   # 确保 .gitignore 包含以下条目
   .env.local
   .env.*.local
   ```

2. **使用强随机密钥**
   ```bash
   # 生成 State Secret（用于 CSRF 防护）
   openssl rand -base64 32

   # 生成 Session Secret（如果需要）
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **启用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 所有 OAuth 回调 URL 必须是 https:// 开头
   - Cookie 设置 `Secure: true`

4. **最小权限原则**
   - OAuth 应用仅请求必要的 Scope
   - 定期审查和撤销不再需要的 Token
   - 设置合理的 Token 过期时间

5. **定期轮换凭证**
   - 每 90 天更换一次 Client Secret
   - 在更换前确保新旧 Secret 都有效（过渡期）

### 🚨 常见安全问题及解决方案

| 问题 | 风险等级 | 解决方案 |
|------|---------|---------|
| Client ID/Secret 硬编码在代码中 | 🔴 严重 | 移至环境变量 + 使用占位符 |
| .env 文件提交到 Git | 🔴 严重 | 添加到 .gitignore + 使用模板文件 |
| State 参数未验证 | 🟠 高风险 | 使用 timingSafeEqual() 比较 |
| 未启用 PKCE | 🟠 高风险 | SPA 场景强烈建议启用 |
| Token 存储在 localStorage | 🟠 高风险 | 改用 HttpOnly Cookie |

### 🛡️ 敏感信息泄露自检方法

定期运行以下命令检查是否有遗漏的明文凭证：

```bash
# 检查是否还有明文 Client ID（示例值）
grep -r "cmnkgi6yk" ./skills/

# 检查是否还有明文 Secret
grep -r "clientSecret.*':" ./skills/ | grep -v "\[CLIENT_SECRET\]"

# 使用自动化扫描工具
./skills/security/validate-security.sh ./skills/
```

**如果发现任何匹配结果，请立即修复！**

---

**参考实现**: A2APersonalAgent 项目 (.agents/skills/)
**安全标准**: OWASP Top 10 - A02:2021 Cryptographic Failures, A07:2021 Identification and Authentication Failures
**最后更新**: 2026-04-10

**版本**: v1.0.0
**最后更新**: 2026-04-10
**适用项目**: Flexloop Vue3 / Next.js 应用
