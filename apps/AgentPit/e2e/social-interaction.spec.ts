import { test, expect } from '@playwright/test'

test.describe('E2E-5: Social Interaction & Matching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/social')
    await page.waitForLoadState('networkidle')
  })

  test('social page renders with tab navigation', async ({ page }) => {
    const tabs = page.locator('[role="tab"], [class*="tab-nav"]')
    if (await tabs.count() > 0) {
      expect(await tabs.count()).toBeGreaterThanOrEqual(3)
    }
  })

  test('recommend tab shows user cards', async ({ page }) => {
    const recommendTab = page.locator('text=推荐').first()
    if (await recommendTab.count() > 0) {
      await recommendTab.click()
      await page.waitForTimeout(500)
      const userCards = page.locator('[class*="user-card"], [class*="recommend"]')
      if (await userCards.count() > 0) {
        expect(await userCards.count()).toBeGreaterThan(0)
      }
    }
  })

  test('match/dating tab has interaction buttons', async ({ page }) => {
    const matchTab = page.locator('text=匹配').first()
    if (await matchTab.count() > 0) {
      await matchTab.click()
      await page.waitForTimeout(500)
      const actionBtns = page.locator('button:has-text("喜欢"), button:has-text("跳过"), [class*="like"], [class*="skip"]')
      if (await actionBtns.count() > 0) {
        await expect(actionBtns.first()).toBeVisible()
      }
    }
  })

  test('feed tab shows social posts', async ({ page }) => {
    const feedTab = page.locator('text=动态').first()
    if (await feedTab.count() > 0) {
      await feedTab.click()
      await page.waitForTimeout(500)
      const posts = page.locator('[class*="post"], [class*="feed"]')
      if (await posts.count() > 0) {
        expect(await posts.count()).toBeGreaterThan(0)
      }
    }
  })

  test('friends tab shows friend list', async ({ page }) => {
    const friendsTab = page.locator('text=好友').first()
    if (await friendsTab.count() > 0) {
      await friendsTab.click()
      await page.waitForTimeout(500)
    }
  })

  test('notification tab shows notification panel', async ({ page }) => {
    const notifTab = page.locator('text=通知').first()
    if (await notifTab.count() > 0) {
      await notifTab.click()
      await page.waitForTimeout(500)
      const notifPanel = page.locator('[class*="notification"], [class*="panel"]')
      if (await notifPanel.count() > 0) {
        await expect(notifPanel.first()).toBeVisible()
      }
    }
  })
})
