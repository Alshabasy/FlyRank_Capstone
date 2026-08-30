# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chat-flow.spec.ts >> CineVault App & CineBot E2E Flow >> user can navigate home, open CineBot, submit prompt, and receive response
- Location: e2e/chat-flow.spec.ts:18:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /send message to cinebot/i })
    - locator resolved to <button tabindex="0" type="button" aria-busy="false" aria-live="polite" aria-label="Send message to CineBot" class="↵        relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold↵        border shadow-lg transition-colors duration-200 outline-none↵        focus-visible:ring-2 focus-visible:ring-cinema-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black↵        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none↵…>…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "CineVault Homepage" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: 🎬
        - generic [ref=e8]: CineVault
      - navigation "Main Navigation" [ref=e9]:
        - link "Home" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Categories" [ref=e11] [cursor=pointer]:
          - /url: /categories
        - link "Favourites" [ref=e12] [cursor=pointer]:
          - /url: /favourites
        - link "Demo Showcase" [ref=e13] [cursor=pointer]:
          - /url: /demo
      - generic [ref=e14]:
        - button "Open search" [ref=e16] [cursor=pointer]
        - link "Sign In" [ref=e19] [cursor=pointer]:
          - /url: /login
  - main [ref=e21]:
    - generic [ref=e27]:
      - generic [ref=e28]:
        - paragraph [ref=e29]: Trending now
        - heading "Inception" [level=1] [ref=e30]
        - generic [ref=e31]:
          - generic [ref=e32]: ⭐ 8.8
          - generic [ref=e33]: Action
          - generic [ref=e34]: Adventure
          - generic [ref=e35]: Sci-Fi
        - generic [ref=e36]:
          - link "View Details" [ref=e37] [cursor=pointer]:
            - /url: /movie/tt1375666
          - button "Watch Trailer" [ref=e38] [cursor=pointer]
      - generic [ref=e40]:
        - generic "Interactive 3D Movie Poster Canvas" [ref=e41]
        - generic:
          - generic: 🖱️ Hover to tilt · Click to flip poster
          - generic: R3F 3D Engine
    - generic [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - heading "Trending" [level=2] [ref=e47]
          - link "See All →" [ref=e48] [cursor=pointer]:
            - /url: /categories?genre=Trending
        - generic [ref=e49]:
          - generic [ref=e51]:
            - button "View details for Inception" [ref=e52] [cursor=pointer]:
              - img "Inception" [ref=e53]
              - generic [ref=e56]:
                - paragraph [ref=e57]: Inception
                - paragraph [ref=e58]: "2010"
            - button "Add to favourites" [ref=e59] [cursor=pointer]
          - generic [ref=e63]:
            - button "View details for Interstellar" [ref=e64] [cursor=pointer]:
              - img "Interstellar" [ref=e65]
              - generic [ref=e68]:
                - paragraph [ref=e69]: Interstellar
                - paragraph [ref=e70]: "2014"
            - button "Add to favourites" [ref=e71] [cursor=pointer]
          - generic [ref=e75]:
            - button "View details for The Dark Knight" [ref=e76] [cursor=pointer]:
              - img "The Dark Knight" [ref=e77]
              - generic [ref=e80]:
                - paragraph [ref=e81]: The Dark Knight
                - paragraph [ref=e82]: "2008"
            - button "Add to favourites" [ref=e83] [cursor=pointer]
          - generic [ref=e87]:
            - button "View details for Dune" [ref=e88] [cursor=pointer]:
              - img "Dune" [ref=e89]
              - generic [ref=e92]:
                - paragraph [ref=e93]: Dune
                - paragraph [ref=e94]: "1984"
            - button "Add to favourites" [ref=e95] [cursor=pointer]
          - generic [ref=e99]:
            - button "View details for Oppenheimer" [ref=e100] [cursor=pointer]:
              - img "Oppenheimer" [ref=e101]
              - generic [ref=e104]:
                - paragraph [ref=e105]: Oppenheimer
                - paragraph [ref=e106]: "2023"
            - button "Add to favourites" [ref=e107] [cursor=pointer]
      - generic [ref=e110]:
        - generic [ref=e111]:
          - heading "Action" [level=2] [ref=e112]
          - link "See All →" [ref=e113] [cursor=pointer]:
            - /url: /categories?genre=Action
        - generic [ref=e114]:
          - generic [ref=e116]:
            - button "View details for Last Action Hero" [ref=e117] [cursor=pointer]:
              - img "Last Action Hero" [ref=e118]
              - generic [ref=e121]:
                - paragraph [ref=e122]: Last Action Hero
                - paragraph [ref=e123]: "1993"
            - button "Add to favourites" [ref=e124] [cursor=pointer]
          - generic [ref=e128]:
            - button "View details for Back in Action" [ref=e129] [cursor=pointer]:
              - img "Back in Action" [ref=e130]
              - generic [ref=e133]:
                - paragraph [ref=e134]: Back in Action
                - paragraph [ref=e135]: "2025"
            - button "Add to favourites" [ref=e136] [cursor=pointer]
          - generic [ref=e140]:
            - 'button "View details for Looney Tunes: Back in Action" [ref=e141] [cursor=pointer]':
              - 'img "Looney Tunes: Back in Action" [ref=e142]'
              - generic [ref=e145]:
                - paragraph [ref=e146]: "Looney Tunes: Back in Action"
                - paragraph [ref=e147]: "2003"
            - button "Add to favourites" [ref=e148] [cursor=pointer]
          - generic [ref=e152]:
            - button "View details for An Action Hero" [ref=e153] [cursor=pointer]:
              - img "An Action Hero" [ref=e154]
              - generic [ref=e157]:
                - paragraph [ref=e158]: An Action Hero
                - paragraph [ref=e159]: "2022"
            - button "Add to favourites" [ref=e160] [cursor=pointer]
          - generic [ref=e164]:
            - button "View details for A Civil Action" [ref=e165] [cursor=pointer]:
              - img "A Civil Action" [ref=e166]
              - generic [ref=e169]:
                - paragraph [ref=e170]: A Civil Action
                - paragraph [ref=e171]: "1998"
            - button "Add to favourites" [ref=e172] [cursor=pointer]
          - generic [ref=e176]:
            - button "View details for Missing in Action" [ref=e177] [cursor=pointer]:
              - img "Missing in Action" [ref=e178]
              - generic [ref=e181]:
                - paragraph [ref=e182]: Missing in Action
                - paragraph [ref=e183]: "1984"
            - button "Add to favourites" [ref=e184] [cursor=pointer]
          - generic [ref=e188]:
            - button "View details for Action Jackson" [ref=e189] [cursor=pointer]:
              - img "Action Jackson" [ref=e190]
              - generic [ref=e193]:
                - paragraph [ref=e194]: Action Jackson
                - paragraph [ref=e195]: "1988"
            - button "Add to favourites" [ref=e196] [cursor=pointer]
          - generic [ref=e200]:
            - button "View details for Action Point" [ref=e201] [cursor=pointer]:
              - img "Action Point" [ref=e202]
              - generic [ref=e205]:
                - paragraph [ref=e206]: Action Point
                - paragraph [ref=e207]: "2018"
            - button "Add to favourites" [ref=e208] [cursor=pointer]
          - generic [ref=e212]:
            - button "View details for 321 Action" [ref=e213] [cursor=pointer]:
              - img "321 Action" [ref=e214]
              - generic [ref=e217]:
                - paragraph [ref=e218]: 321 Action
                - paragraph [ref=e219]: "2020"
            - button "Add to favourites" [ref=e220] [cursor=pointer]
          - generic [ref=e224]:
            - 'button "View details for Missing in Action 2: The Beginning" [ref=e225] [cursor=pointer]':
              - 'img "Missing in Action 2: The Beginning" [ref=e226]'
              - generic [ref=e229]:
                - paragraph [ref=e230]: "Missing in Action 2: The Beginning"
                - paragraph [ref=e231]: "1985"
            - button "Add to favourites" [ref=e232] [cursor=pointer]
      - generic [ref=e235]:
        - generic [ref=e236]:
          - heading "Drama" [level=2] [ref=e237]
          - link "See All →" [ref=e238] [cursor=pointer]:
            - /url: /categories?genre=Drama
        - generic [ref=e239]:
          - generic [ref=e241]:
            - button "View details for The Drama" [ref=e242] [cursor=pointer]:
              - img "The Drama" [ref=e243]
              - generic [ref=e246]:
                - paragraph [ref=e247]: The Drama
                - paragraph [ref=e248]: "2026"
            - button "Add to favourites" [ref=e249] [cursor=pointer]
          - generic [ref=e253]:
            - button "View details for Confessions of a Teenage Drama Queen" [ref=e254] [cursor=pointer]:
              - img "Confessions of a Teenage Drama Queen" [ref=e255]
              - generic [ref=e258]:
                - paragraph [ref=e259]: Confessions of a Teenage Drama Queen
                - paragraph [ref=e260]: "2004"
            - button "Add to favourites" [ref=e261] [cursor=pointer]
          - generic [ref=e265]:
            - 'button "View details for A Woman of Paris: A Drama of Fate" [ref=e266] [cursor=pointer]':
              - 'img "A Woman of Paris: A Drama of Fate" [ref=e267]'
              - generic [ref=e270]:
                - paragraph [ref=e271]: "A Woman of Paris: A Drama of Fate"
                - paragraph [ref=e272]: "1923"
            - button "Add to favourites" [ref=e273] [cursor=pointer]
          - generic [ref=e277]:
            - 'button "View details for Kim Possible: So the Drama" [ref=e278] [cursor=pointer]':
              - 'img "Kim Possible: So the Drama" [ref=e279]'
              - generic [ref=e282]:
                - paragraph [ref=e283]: "Kim Possible: So the Drama"
                - paragraph [ref=e284]: "2005"
            - button "Add to favourites" [ref=e285] [cursor=pointer]
          - generic [ref=e289]:
            - 'button "View details for Eating Out: Drama Camp" [ref=e290] [cursor=pointer]':
              - 'img "Eating Out: Drama Camp" [ref=e291]'
              - generic [ref=e294]:
                - paragraph [ref=e295]: "Eating Out: Drama Camp"
                - paragraph [ref=e296]: "2011"
            - button "Add to favourites" [ref=e297] [cursor=pointer]
          - generic [ref=e301]:
            - button "View details for Love Action Drama" [ref=e302] [cursor=pointer]:
              - img "Love Action Drama" [ref=e303]
              - generic [ref=e306]:
                - paragraph [ref=e307]: Love Action Drama
                - paragraph [ref=e308]: "2019"
            - button "Add to favourites" [ref=e309] [cursor=pointer]
          - generic [ref=e313]:
            - button "View details for Drama/Mex" [ref=e314] [cursor=pointer]:
              - img "Drama/Mex" [ref=e315]
              - generic [ref=e318]:
                - paragraph [ref=e319]: Drama/Mex
                - paragraph [ref=e320]: "2006"
            - button "Add to favourites" [ref=e321] [cursor=pointer]
          - generic [ref=e325]:
            - button "View details for A Little Daytime Drama" [ref=e326] [cursor=pointer]:
              - img "A Little Daytime Drama" [ref=e327]
              - generic [ref=e330]:
                - paragraph [ref=e331]: A Little Daytime Drama
                - paragraph [ref=e332]: "2021"
            - button "Add to favourites" [ref=e333] [cursor=pointer]
          - generic [ref=e337]:
            - button "View details for Family Drama" [ref=e338] [cursor=pointer]:
              - img "Family Drama" [ref=e339]
              - generic [ref=e342]:
                - paragraph [ref=e343]: Family Drama
                - paragraph [ref=e344]: "2024"
            - button "Add to favourites" [ref=e345] [cursor=pointer]
          - generic [ref=e349]:
            - 'button "View details for Chang: A Drama of the Wilderness" [ref=e350] [cursor=pointer]':
              - 'img "Chang: A Drama of the Wilderness" [ref=e351]'
              - generic [ref=e354]:
                - paragraph [ref=e355]: "Chang: A Drama of the Wilderness"
                - paragraph [ref=e356]: "1927"
            - button "Add to favourites" [ref=e357] [cursor=pointer]
      - generic [ref=e360]:
        - generic [ref=e361]:
          - heading "Sci-Fi" [level=2] [ref=e362]
          - link "See All →" [ref=e363] [cursor=pointer]:
            - /url: /categories?genre=Sci-Fi
        - generic [ref=e364]:
          - generic [ref=e366]:
            - button "View details for The Sci-Fi Boys" [ref=e367] [cursor=pointer]:
              - img "The Sci-Fi Boys" [ref=e368]
              - generic [ref=e371]:
                - paragraph [ref=e372]: The Sci-Fi Boys
                - paragraph [ref=e373]: "2006"
            - button "Add to favourites" [ref=e374] [cursor=pointer]
          - generic [ref=e378]:
            - 'button "View details for From Stargate to Atlantis: Sci Fi Lowdown" [ref=e379] [cursor=pointer]':
              - generic [ref=e385]:
                - paragraph [ref=e386]: "From Stargate to Atlantis: Sci Fi Lowdown"
                - paragraph [ref=e387]: "2004"
            - button "Add to favourites" [ref=e388] [cursor=pointer]
          - generic [ref=e392]:
            - 'button "View details for Sci Fi Inside: ''the Triangle''" [ref=e393] [cursor=pointer]':
              - 'img "Sci Fi Inside: ''the Triangle''" [ref=e394]'
              - generic [ref=e397]:
                - paragraph [ref=e398]: "Sci Fi Inside: 'the Triangle'"
                - paragraph [ref=e399]: "2005"
            - button "Add to favourites" [ref=e400] [cursor=pointer]
          - generic [ref=e404]:
            - 'button "View details for Sci Fi Inside: Stargate SG-1 200th Episode" [ref=e405] [cursor=pointer]':
              - generic [ref=e411]:
                - paragraph [ref=e412]: "Sci Fi Inside: Stargate SG-1 200th Episode"
                - paragraph [ref=e413]: "2006"
            - button "Add to favourites" [ref=e414] [cursor=pointer]
          - generic [ref=e418]:
            - button "View details for Not Another Sci-Fi Movie" [ref=e419] [cursor=pointer]:
              - img "Not Another Sci-Fi Movie" [ref=e420]
              - generic [ref=e423]:
                - paragraph [ref=e424]: Not Another Sci-Fi Movie
                - paragraph [ref=e425]: "2013"
            - button "Add to favourites" [ref=e426] [cursor=pointer]
          - generic [ref=e430]:
            - 'button "View details for Sci Fi Inside: ''Serenity''" [ref=e431] [cursor=pointer]':
              - generic [ref=e437]:
                - paragraph [ref=e438]: "Sci Fi Inside: 'Serenity'"
                - paragraph [ref=e439]: "2005"
            - button "Add to favourites" [ref=e440] [cursor=pointer]
          - generic [ref=e444]:
            - 'button "View details for Sci Fi Lowdown: Behind the Stargate - Secrets Revealed" [ref=e445] [cursor=pointer]':
              - generic [ref=e451]:
                - paragraph [ref=e452]: "Sci Fi Lowdown: Behind the Stargate - Secrets Revealed"
                - paragraph [ref=e453]: "2005"
            - button "Add to favourites" [ref=e454] [cursor=pointer]
          - generic [ref=e458]:
            - 'button "View details for Sci Fi Inside: Sci Fi Friday" [ref=e459] [cursor=pointer]':
              - generic [ref=e465]:
                - paragraph [ref=e466]: "Sci Fi Inside: Sci Fi Friday"
                - paragraph [ref=e467]: "2005"
            - button "Add to favourites" [ref=e468] [cursor=pointer]
          - generic [ref=e472]:
            - 'button "View details for Sci-Fi High: The Movie Musical" [ref=e473] [cursor=pointer]':
              - 'img "Sci-Fi High: The Movie Musical" [ref=e474]'
              - generic [ref=e477]:
                - paragraph [ref=e478]: "Sci-Fi High: The Movie Musical"
                - paragraph [ref=e479]: "2010"
            - button "Add to favourites" [ref=e480] [cursor=pointer]
          - generic [ref=e484]:
            - button "View details for Sci-Fi Vixens from Beyond" [ref=e485] [cursor=pointer]:
              - img "Sci-Fi Vixens from Beyond" [ref=e486]
              - generic [ref=e489]:
                - paragraph [ref=e490]: Sci-Fi Vixens from Beyond
                - paragraph [ref=e491]: "2024"
            - button "Add to favourites" [ref=e492] [cursor=pointer]
  - contentinfo [ref=e495]:
    - generic [ref=e496]:
      - paragraph [ref=e497]: © 2026 CineVault — All Rights Reserved.
      - navigation "Footer Navigation" [ref=e498]:
        - link "Home" [ref=e499] [cursor=pointer]:
          - /url: /
        - link "Categories" [ref=e500] [cursor=pointer]:
          - /url: /categories
        - link "Favourites" [ref=e501] [cursor=pointer]:
          - /url: /favourites
        - link "Demo Showcase" [ref=e502] [cursor=pointer]:
          - /url: /demo
  - button "Open CineBot chat assistant" [ref=e503] [cursor=pointer]
  - dialog "CineBot chat panel" [ref=e507]:
    - generic [ref=e508]:
      - generic [ref=e513]:
        - paragraph [ref=e514]: CineBot
        - paragraph [ref=e515]: Your AI movie expert
      - generic [ref=e516]:
        - button "Clear chat" [ref=e517] [cursor=pointer]
        - button "Close chat" [ref=e520] [cursor=pointer]
    - log "Chat messages" [ref=e524]:
      - generic [ref=e525]:
        - heading "Hey! I'm CineBot" [level=3] [ref=e529]
        - paragraph [ref=e530]: Ask me to find real movies, or tap an example to get started.
        - generic [ref=e531]:
          - button "Find sci-fi movies from 2020" [ref=e532] [cursor=pointer]
          - button "Find movies starring Tom Hanks" [ref=e533] [cursor=pointer]
          - button "Find movies similar to Inception" [ref=e534] [cursor=pointer]
    - generic [ref=e535]:
      - textbox "Message CineBot" [active] [ref=e536]:
        - /placeholder: Ask about any movie...
        - text: Recommend sci-fi movies
      - button "Send message to CineBot" [ref=e539] [cursor=pointer]:
        - generic [ref=e540]: Send
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('CineVault App & CineBot E2E Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Intercept network call to /api/chat with mock streaming response
  6  |     await page.route('**/api/chat', async (route) => {
  7  |       const responseText = '0:"Here are some recommended sci-fi movies: Interstellar, Inception, and The Matrix."\n'
  8  |       await route.fulfill({
  9  |         status: 200,
  10 |         headers: {
  11 |           'content-type': 'text/plain; charset=utf-8',
  12 |         },
  13 |         body: responseText,
  14 |       })
  15 |     })
  16 |   })
  17 | 
  18 |   test('user can navigate home, open CineBot, submit prompt, and receive response', async ({ page }) => {
  19 |     await page.goto('/')
  20 | 
  21 |     // Check main title / branding
  22 |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  23 | 
  24 |     // Open CineBot chat panel
  25 |     const botButton = page.getByRole('button', { name: /open cinebot/i })
  26 |     await expect(botButton).toBeVisible()
  27 |     await botButton.click()
  28 | 
  29 |     // Find textarea input and submit prompt
  30 |     const chatInput = page.getByRole('textbox', { name: /message cinebot/i })
  31 |     await expect(chatInput).toBeVisible()
  32 |     await chatInput.fill('Recommend sci-fi movies')
  33 | 
  34 |     const sendButton = page.getByRole('button', { name: /send message to cinebot/i })
  35 |     await expect(sendButton).toBeEnabled()
> 36 |     await sendButton.click()
     |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  37 | 
  38 |     // Verify user message appears in chat
  39 |     await expect(page.getByText('Recommend sci-fi movies')).toBeVisible()
  40 |   })
  41 | 
  42 |   test('user can interact with Buttons with a Brain demo showcase', async ({ page }) => {
  43 |     await page.goto('/demo')
  44 | 
  45 |     await expect(page.getByRole('heading', { name: /buttons with a brain/i })).toBeVisible()
  46 | 
  47 |     // Click force failure button to test failure state
  48 |     const forceFailureBtn = page.getByRole('button', { name: /force failure/i })
  49 |     await forceFailureBtn.click()
  50 | 
  51 |     const actionButton = page.getByRole('button', { name: /send prompt/i })
  52 |     await actionButton.click()
  53 | 
  54 |     // Check activity log records failure
  55 |     await expect(page.getByText(/operation failed/i)).toBeVisible()
  56 |   })
  57 | })
  58 | 
```