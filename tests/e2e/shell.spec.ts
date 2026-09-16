import { expect, test } from '@playwright/test'

test('renders the public shell without overlap', async ({ page }, testInfo) => {
  await page.route('**/api/v1/**', async (route) => {
    const url = route.request().url()
    const data = url.includes('/categories') ? [] : { records: [], total: 0, current: 1, size: 12, pages: 0 }
    await route.fulfill({ json: { code: 200, msg: '成功', data } })
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '拾光集市' })).toBeVisible()
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll')
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true })
})
