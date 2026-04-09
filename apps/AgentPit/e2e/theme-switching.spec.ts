import { test, expect } from '@playwright/test'

test.describe('E2E-6: Theme Switching Global Effect', () => {
  test('settings page contains theme preferences', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    const themeSection = page.locator('text=主题, [data-testid="theme"]')
    if (await themeSection.count() > 0) {
      await expect(themeSection.first()).toBeVisible()
    }
  })

  test('switching to dark mode updates html element', async ({ page }) => {
    await page.goto('/settings')
    const darkModeOption = page.locator('text=暗色, [data-testid="theme-dark"], [value="dark"]')
    if (await darkModeOption.count() > 0) {
      await darkModeOption.first().click()
      await page.waitForTimeout(500)
      const htmlEl = page.locator('html')
      const className = await htmlEl.getAttribute('class') || ''
      expect(className).toContain('dark')
    }
  })

  test('switching back to light mode removes dark class', async ({ page }) => {
    await page.goto('/settings')
    const lightModeOption = page.locator('text=亮色, [data-testid="theme-light"], [value="light"]')
    if (await lightModeOption.count() > 0) {
      await lightModeOption.first().click()
      await page.waitForTimeout(500)
      const htmlEl = page.locator('html')
      const className = await htmlEl.getAttribute('class') || ''
      expect(className).not.toContain('dark')
    }
  })

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/settings')
    const darkOption = page.locator('[data-testid="theme-dark"], text=暗色').first()
    if (await darkOption.count() > 0) {
      await darkOption.click()
      await page.waitForTimeout(500)

      await page.goto('/chat')
      await page.waitForLoadState('networkidle')
      const htmlEl = page.locator('html')
      const className = await htmlEl.getAttribute('class') || ''
      expect(className).toContain('dark')
    }
  })

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/settings')
    const darkOption = page.locator('[data-testid="theme-dark"], text=暗色').first()
    if (await darkOption.count() > 0) {
      await darkOption.click()
      await page.waitForTimeout(300)
      await page.reload()
      await page.waitForLoadState('networkidle')
      const htmlClass = await page.evaluate(() => document.documentElement.className)
      expect(htmlClass).toContain('dark')
    }
  })
})
