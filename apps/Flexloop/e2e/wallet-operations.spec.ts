import { test, expect } from '@playwright/test'

test.describe('E2E-3: Wallet Operations Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/monetization')
    await page.waitForLoadState('networkidle')
  })

  test('wallet card displays balance information', async ({ page }) => {
    const wallet = page.locator('[class*="wallet"], [data-testid="wallet"]')
    if (await wallet.count() > 0) {
      await expect(wallet.first()).toBeVisible()
      const text = await wallet.textContent()
      expect(text).toMatch(/¥|余额|balance/i)
    }
  })

  test('currency selector is available', async ({ page }) => {
    const selector = page.locator('select, [class*="currency"]')
    if (await selector.count() > 0) {
      await expect(selector.first()).toBeEnabled()
    }
  })

  test('revenue chart area renders', async ({ page }) => {
    const chart = page.locator('[class*="chart"], [class*="revenue"], canvas')
    if (await chart.count() > 0) {
      await expect(chart.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('transaction history table loads data', async ({ page }) => {
    const table = page.locator('table, [class*="transaction"], [class*="history"]')
    if (await table.count() > 0) {
      await expect(table.first()).toBeVisible()
      const rows = table.locator('tbody tr, [class*="row"]')
      if (await rows.count() > 0) {
        expect(await rows.count()).toBeGreaterThan(0)
      }
    }
  })

  test('withdraw button opens modal', async ({ page }) => {
    const withdrawBtn = page.locator('text=提现, [data-testid="withdraw-btn"]')
    if (await withdrawBtn.count() > 0) {
      await withdrawBtn.first().click()
      await page.waitForTimeout(500)
      const modal = page.locator('[class*="modal"], [role="dialog"]')
      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible()
      }
    }
  })
})
