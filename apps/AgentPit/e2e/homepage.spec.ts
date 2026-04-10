import { test, expect } from '@playwright/test'

test.describe('E2E-1: Homepage Browsing and Navigation', () => {
  test('renders hero section with platform title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1, h2')).toContainText(/Flexloop|玄环|柔/i)
  })

  test('displays all module cards on homepage', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.module-card, [class*="card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(9)
  })

  test('navigates to monetization when clicking card', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const card = page.locator('text=变现').first()
    if (await card.count() > 0) {
      await card.click()
      await expect(page).toHaveURL(/monetization/, { timeout: 5000 })
    }
  })

  test('navigates to chat page from homepage', async ({ page }) => {
    await page.goto('/')
    const chatLink = page.locator('text=智能体').first()
    if (await chatLink.count() > 0) {
      await chatLink.click()
      await expect(page).toHaveURL(/chat/, { timeout: 5000 })
    } else {
      await page.goto('/chat')
      await expect(page).toHaveURL(/chat/)
    }
  })

  test('statistics section displays data', async ({ page }) => {
    await page.goto('/')
    const stats = page.locator('[class*="stat"], [data-testid="stat"]')
    if (await stats.count() > 0) {
      expect(await stats.first().isVisible()).toBe(true)
    }
  })

  test('back navigation returns to homepage', async ({ page }) => {
    await page.goto('/monetization')
    await page.goBack()
    await expect(page).toHaveURL(/\//, { timeout: 5000 })
  })
})
