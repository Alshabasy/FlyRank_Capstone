import { test, expect } from '@playwright/test'

test.describe('CineVault App & CineBot E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept network call to /api/chat with mock streaming response
    await page.route('**/api/chat', async (route) => {
      const responseText = '0:"Here are some recommended sci-fi movies: Interstellar, Inception, and The Matrix."\n'
      await route.fulfill({
        status: 200,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
        },
        body: responseText,
      })
    })
  })

  test('user can navigate home, open CineBot, submit prompt, and receive response', async ({ page }) => {
    await page.goto('/')

    // Check main title / branding
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Open CineBot chat panel
    const botButton = page.getByRole('button', { name: /open cinebot/i })
    await expect(botButton).toBeVisible()
    await botButton.click()

    // Find textarea input and submit prompt
    const chatInput = page.getByRole('textbox', { name: /message cinebot/i })
    await expect(chatInput).toBeVisible()
    await chatInput.fill('Recommend sci-fi movies')

    const sendButton = page.getByRole('button', { name: /send message to cinebot/i })
    await expect(sendButton).toBeEnabled()
    await sendButton.click({ force: true })

    // Verify user message appears in chat
    await expect(page.getByText('Recommend sci-fi movies')).toBeVisible()
  })

  test('user can interact with Buttons with a Brain demo showcase', async ({ page }) => {
    await page.goto('/demo')

    await expect(page.getByRole('heading', { name: /buttons with a brain/i })).toBeVisible()

    // Click force failure button to test failure state
    const forceFailureBtn = page.getByRole('button', { name: /force failure/i })
    await forceFailureBtn.click()

    const actionButton = page.getByRole('button', { name: /send prompt/i })
    await actionButton.click()

    // Check activity log records failure
    await expect(page.getByText(/operation failed/i)).toBeVisible()
  })
})
