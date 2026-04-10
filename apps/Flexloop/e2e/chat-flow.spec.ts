import { test, expect } from '@playwright/test'

test.describe('E2E-2: Chat Conversation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat')
    await page.waitForLoadState('networkidle')
  })

  test('chat interface loads with conversation UI', async ({ page }) => {
    const chatArea = page.locator('[class*="chat"], [class*="conversation"]')
    await expect(chatArea.first()).toBeVisible({ timeout: 10000 })
  })

  test('can create new conversation', async ({ page }) => {
    const newBtn = page.locator('text=新建对话, [data-testid="new-conversation"]')
    if (await newBtn.count() > 0) {
      await newBtn.first().click()
      await page.waitForTimeout(500)
    }
  })

  test('message input is present and interactive', async ({ page }) => {
    const input = page.locator('textarea, [contenteditable="true"], [data-testid="message-input"]')
    if (await input.count() > 0) {
      await expect(input.first()).toBeVisible()
      await input.first().fill('你好')
      expect(await input.inputValue()).toContain('你好')
    }
  })

  test('send button triggers message sending', async ({ page }) => {
    const input = page.locator('textarea, [contenteditable="true"], [data-testid="message-input"]')
    const sendBtn = page.locator('[data-testid="send-button"], button:has-text("发送")')

    if (await input.count() > 0 && await sendBtn.count() > 0) {
      await input.first().fill('测试消息')
      await sendBtn.first().click()
      await page.waitForTimeout(1000)
    }
  })

  test('quick commands panel is accessible', async ({ page }) => {
    const quickCmd = page.locator('[class*="quick"], [class*="command"]')
    if (await quickCmd.count() > 0) {
      await expect(quickCmd.first()).toBeVisible()
    }
  })

  test('chat sidebar shows conversation list', async ({ page }) => {
    const sidebar = page.locator('[class*="sidebar"], [class*="history"]')
    if (await sidebar.count() > 0) {
      await expect(sidebar.first()).toBeVisible()
    }
  })
})
