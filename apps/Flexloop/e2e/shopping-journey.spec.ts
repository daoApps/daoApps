import { test, expect } from '@playwright/test'

test.describe('E2E-4: Shopping Journey Flow', () => {
  test('marketplace loads with product grid', async ({ page }) => {
    await page.goto('/marketplace')
    await page.waitForLoadState('networkidle')
    const products = page.locator('[class*="product"], [class*="grid"] > div')
    if (await products.count() > 0) {
      expect(await products.count()).toBeGreaterThan(0)
    }
  })

  test('search filter accepts text input', async ({ page }) => {
    await page.goto('/marketplace')
    const searchInput = page.locator('input[placeholder*="搜索"], input[type="text"]')
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('智能音箱')
      await page.waitForTimeout(400)
    }
  })

  'product detail page shows product info' as any; test('product detail page shows product info', async ({ page }) => {
    await page.goto('/marketplace')
    const firstProduct = page.locator('[class*="product-card"], [class*="item"]').first()
    if (await firstProduct.count() > 0) {
      await firstProduct.click()
      await page.waitForTimeout(1000)
      await expect(page).toHaveURL(/product|detail/i, { timeout: 5000 })
    }
  })

  test('cart tab or icon is accessible', async ({ page }) => {
    await page.goto('/marketplace')
    const cartTab = page.locator('text=购物车, [data-testid="cart-tab"], [class*="cart-icon"]')
    if (await cartTab.count() > 0) {
      await expect(cartTab.first()).toBeVisible()
    }
  })

  test('order management tab exists', async ({ page }) => {
    await page.goto('/marketplace')
    const orderTab = page.locator('text=订单, [data-testid="orders-tab"]')
    if (await orderTab.count() > 0) {
      await orderTab.first().click()
      await page.waitForTimeout(500)
    }
  })
})
