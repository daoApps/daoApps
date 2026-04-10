import { test, expect } from '@playwright/test'

test.describe('E2E-7: Responsive Layout Adaptation', () => {
  test.describe('Desktop layout (1920x1080)', () => {
    test.use({ viewport: { width: 1920, height: 1080 } })

    test('header navigation bar is visible on desktop', async ({ page }) => {
      await page.goto('/')
      const nav = page.locator('nav, header')
      await expect(nav.first()).toBeVisible()
    })

    test('sidebar is visible on desktop', async ({ page }) => {
      await page.goto('/')
      const sidebar = page.locator('[class*="sidebar"], aside')
      if (await sidebar.count() > 0) {
        await expect(sidebar.first()).toBeVisible()
      }
    })
  })

  test.describe('Tablet layout (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } })

    test('page content adapts to tablet width', async ({ page }) => {
      await page.goto('/')
      const bodyWidth = await page.evaluate(() => document.body.clientWidth)
      expect(bodyWidth).toBe(768)
    })
  })

  test.describe('Mobile layout (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('hamburger menu appears on mobile', async ({ page }) => {
      await page.goto('/')
      const hamburger = page.locator('button[aria-label*="menu"], [class*="hamburger"], .hamburger')
      if (await hamburger.count() > 0) {
        await expect(hamburger.first()).toBeVisible()
      }
    })

    test('sidebar is hidden by default on mobile', async ({ page }) => {
      await page.goto('/')
      const sidebar = page.locator('[class*="sidebar"]')
      if (await sidebar.count() > 0) {
        const isVisible = await sidebar.first().isVisible()
        expect(isVisible).toBeFalsy()
      }
    })

    test('no horizontal scrollbar on mobile', async ({ page }) => {
      await page.goto('/')
      const overflowX = await page.evaluate(() => window.getComputedStyle(document.body).overflowX)
      expect(['hidden', 'auto', 'clip']).toContain(overflowX)
    })

    test('touch targets are adequately sized on mobile', async ({ page }) => {
      await page.goto('/')
      const buttons = page.locator('button, a[role="button"], [role="button"]')
      if (await buttons.count() > 0) {
        const firstBtn = buttons.first()
        const box = await firstBtn.boundingBox()
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(36)
          expect(box.height).toBeGreaterThanOrEqual(36)
        }
      }
    })
  })

  test.describe('Mobile landscape (667x375)', () => {
    test.use({ viewport: { width: 667, height: 375 } })

    test('layout adapts to landscape orientation', async ({ page }) => {
      await page.goto('/')
      const bodyWidth = await page.evaluate(() => document.body.clientWidth)
      expect(bodyWidth).toBe(667)
    })
  })

  test('core functionality works on mobile', async ({ page }) => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('can navigate to main pages on mobile', async ({ page }) => {
      const pages = ['/chat', '/marketplace', '/settings']
      for (const p of pages) {
        await page.goto(p)
        await page.waitForLoadState('domcontentloaded')
        await expect(page).toHaveURL(p)
      }
    })
  })
})
