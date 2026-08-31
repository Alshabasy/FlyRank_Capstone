import { test, expect } from '@playwright/test'

/** Minimal AI SDK UI message stream: assistant text + searchMovies tool result. */
function buildMockChatStream() {
  const messageId = 'msg-assistant-1'
  const toolCallId = 'call-matrix-1'
  const lines = [
    `data: ${JSON.stringify({ type: 'start' })}\n\n`,
    `data: ${JSON.stringify({ type: 'start-step' })}\n\n`,
    `data: ${JSON.stringify({ type: 'text-start', id: messageId })}\n\n`,
    `data: ${JSON.stringify({ type: 'text-delta', id: messageId, delta: 'Here are strong sci-fi picks backed by OMDb:' })}\n\n`,
    `data: ${JSON.stringify({ type: 'text-end', id: messageId })}\n\n`,
    `data: ${JSON.stringify({
      type: 'tool-input-start',
      toolCallId,
      toolName: 'searchMovies',
    })}\n\n`,
    `data: ${JSON.stringify({
      type: 'tool-input-available',
      toolCallId,
      toolName: 'searchMovies',
      input: { query: 'sci-fi' },
    })}\n\n`,
    `data: ${JSON.stringify({
      type: 'tool-output-available',
      toolCallId,
      output: {
        query: 'sci-fi',
        totalResults: 1,
        movies: [
          {
            imdbId: 'tt0133093',
            title: 'The Matrix',
            year: '1999',
            poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGc@._V1_SX300.jpg',
            type: 'movie',
          },
        ],
      },
    })}\n\n`,
    `data: ${JSON.stringify({ type: 'finish-step' })}\n\n`,
    `data: ${JSON.stringify({ type: 'finish' })}\n\n`,
    `data: [DONE]\n\n`,
  ]
  return lines.join('')
}

test.describe('CineVault App & CineBot E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'content-type': 'text/event-stream; charset=utf-8',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
        },
        body: buildMockChatStream(),
      })
    })
  })

  test('home → open CineBot → send prompt → receive movie UI', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const botButton = page.getByRole('button', { name: /open cinebot/i })
    await expect(botButton).toBeVisible()
    await botButton.click()

    const chatInput = page.getByRole('textbox', { name: /message cinebot/i })
    await expect(chatInput).toBeVisible()
    await chatInput.fill('Recommend sci-fi movies')

    const sendButton = page.getByRole('button', { name: /send message to cinebot/i })
    await expect(sendButton).toBeEnabled()
    await sendButton.click()

    await expect(page.getByText('Recommend sci-fi movies')).toBeVisible()
    await expect(page.getByText('The Matrix')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('region', { name: /movie search results/i })).toBeVisible()
  })

  test('primary movie browsing flow reaches categories', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /trending/i })).toBeVisible()
    await page.getByLabel('Main Navigation').getByRole('link', { name: 'Categories' }).click()
    await expect(page).toHaveURL(/\/categories/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
