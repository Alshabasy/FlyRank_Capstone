# 🎬 CineVault — Premium Cinema Hub & AI Movie Assistant

> A production-ready React + Vite movie discovery app with CineBot — an AI assistant that searches real OMDb data, renders structured movie cards, and helps users choose what to watch.

---

## Project Brief

**Problem:** Browsing movie catalogs is easy; *choosing* the right film for tonight is not. Users need help translating vague preferences ("something like Interstellar but lighter", "family night, nothing violent") into concrete picks backed by real ratings and metadata.

**Audience:** Movie fans who want fast discovery, a personal watchlist, and conversational recommendations without leaving the app.

**Why it exists:** CineVault combines curated browsing (trending rows, genres, search) with CineBot — a server-side AI that calls OMDb tools instead of hallucinating catalog data, and renders results as interactive movie cards.

---

## Features

### Movie Discovery
- Trending, Action, Drama, and Sci-Fi rows powered by OMDb
- Genre categories page and live search
- Movie detail pages with ratings, cast, plot, and runtime
- Firebase-backed watchlist for authenticated users

### CineBot — AI Movie Assistant
- **Natural-language discovery** — mood, era, genre, similarity, family-safe constraints
- **Two-step tool strategy** — `searchMovies` finds candidates; `getMovieDetails` enriches top picks with ratings, genre, runtime, director, cast, and plot
- **Structured results** — tool output renders as `MovieSearchResults` cards (poster, title, year, rating, genre), not raw JSON
- **Comparison & explanation** — answers "which is better for family night?" using fetched metadata
- **Streaming** — token-by-token assistant text via AI SDK UI message streams
- **Tool lifecycle UI** — distinct states: `input-streaming`, `input-available`, `output-available`, `output-error`
- **Stop / Retry / Regenerate** — abort preserves partial content; retry retries the failed turn
- **Smart scroll** — auto-scroll respects user position; "Jump to latest" when scrolled up

### Resilience & Security
- Designed error states for rate limits, network failures, mid-stream drops, empty results, and tool errors
- Server-side Zod validation, message length limits, and per-IP rate limiting
- API keys remain server-side; safe error messages (no stack traces or secrets)

### Performance & Accessibility
- **3D/WebGL removed** — lightweight CSS gradient hero + static featured poster (faster load, smaller bundle)
- Route-level code splitting (pages, chat panel, chat button)
- Vendor chunking (Firebase, Framer, AI SDK, Icons)
- Keyboard-navigable UI, focus rings, `aria-live` for streamed output, reduced-motion support

---

## Screenshots

_Add screenshots of: Home hero, Categories, CineBot with movie cards, error state, mobile layout._

---

## Setup

```bash
git clone <your-repo-url>
cd Capstone
npm install
cp .env.example .env   # fill in values — see table below
npm run dev            # Vite on :5173 with local API middleware
```

Local dev serves `/api/chat` and `/api/search-movies` through `vite-api-plugin.js` using the same handler code deployed to Vercel.

```bash
npm run build          # production build → dist/
npm run preview        # preview production build on :4173
npm run test           # Vitest unit tests
npm run test:e2e       # Playwright E2E (run `npx playwright install` first)
npm run lint           # ESLint
```

---

## Environment Variables

### Client (Vite — bundled into browser, not secret)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `VITE_OMDB_API_KEY` | Yes | OMDb key for client-side movie browsing |
| `VITE_OMDB_BASE_URL` | No | OMDb base URL (default `https://www.omdbapi.com`) |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Web API key (public client config) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | Yes | Realtime Database URL for watchlists |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase FCM sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | Firebase Analytics measurement ID |
| `VITE_AI_API_KEY` | No* | Local-dev fallback only if server `AI_API_KEY` unset |
| `VITE_AI_MODEL` | No | Client override; server `AI_MODEL` takes priority |

### Server-only (Vercel dashboard or `.env` locally — never bundled)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `AI_API_KEY` | Yes* | OpenRouter API key for streaming chat |
| `OPENROUTER_API_KEY` | Yes* | Alias accepted if `AI_API_KEY` unset |
| `AI_MODEL` | No | Model ID (default `google/gemma-4-26b-a4b-it:free`) |
| `OMDB_API_KEY` | Yes | OMDb key for server-side AI tools |
| `OMDB_BASE_URL` | No | OMDb base URL for tool requests |

*Exactly one of `AI_API_KEY` or `OPENROUTER_API_KEY` is required for CineBot.

**Never commit `.env` or real API keys.**

---

## Architecture

```
Browser (React UI)
   │
   ├─ ChatPanel ──▶ useGeminiChat (AI SDK AbstractChat)
   │                       │
   │                       └── POST /api/chat ──────┐
   │                                                │
   │                                                ▼
   │                            Vercel Serverless (Node.js)
   │                                │
   │                                ├─ streamText() → OpenRouter
   │                                ├─ tool: searchMovies → OMDb
   │                                └─ tool: getMovieDetails → OMDb
   │                                         │
   │                                         ▼
   │                               typed tool-result parts
   │                                         │
   └── ChatMessage ──▶ SearchMoviesToolView / MovieDetailsToolView
                              │
                              ├─ MovieSearchResults (card grid)
                              └─ ToolError (retryable error UI)
```

---

## AI Integration

### Why AI exists
Users describe what they want in natural language. CineBot interprets intent, fetches real catalog data, and explains recommendations — turning "what should I watch?" into actionable picks.

### Provider & model
- **Provider:** OpenRouter (server-side proxy)
- **Default model:** `google/gemma-4-26b-a4b-it:free` (override via `AI_MODEL`)
- **SDK:** Vercel AI SDK v7 (`streamText`, `createUIMessageStream`, tool calling)

### System prompt strategy
`api/_lib/ai-config.js` constrains CineBot to cinema topics, enforces a 2-step search→enrich flow, prohibits hallucinated metadata, and requires spoiler warnings before plot reveals.

### Tool calling
| Tool | Purpose | Schema |
| ---- | ------- | ------ |
| `searchMovies` | Find movies by title, genre, year, actor, mood keywords | `{ query: string, page?: number }` |
| `getMovieDetails` | Fetch full metadata for up to 5 IMDb IDs | `{ imdbIds: string[] }` |

Tools execute server-side only. The model decides when to call them; conversational replies skip tools.

### Structured results & streaming
Tool outputs are normalized with Zod, streamed as UI message parts, and rendered by React components — never as raw JSON in the chat log.

### Error handling
- HTTP 429 → rate-limit UI with retry
- Network/offline → connection error with retry
- Mid-stream failure → interrupted message + retry last turn
- Tool `output-error` → `ToolError` component with retry button
- Empty search → friendly empty state with example prompts

---

## Testing

| Layer | Tool | Coverage |
| ----- | ---- | -------- |
| Unit/component | Vitest + Testing Library | 14 tests — login validation, chat messages, movie search results, BrainButton states |
| E2E | Playwright | Home → CineBot → send prompt → movie cards render; nav → Categories |
| Failure modes | Sabotage harness | See `docs/FAILURE-INVENTORY.md` |

All unit tests mock AI/API — no real provider calls in CI.

```bash
npm run test        # 14/14 passing
npm run test:e2e    # requires npx playwright install
```

---

## Performance

### 3D removal impact (measured)

| Metric | Before (with R3F + shader) | After (CSS hero) |
| ------ | -------------------------- | ---------------- |
| npm packages | +66 Three.js/R3F/drei deps | Removed (66 packages) |
| Production chunks | `MoviePoster3D-*.js`, `CinematicShaderHero-*.js` | None — hero is inline CSS + static poster |
| `Home-*.js` gzip | ~3.8 KB (shader lazy chunk) + 3D chunk | **2.29 KB** (single Home chunk) |
| Initial JS on home | WebGL init + R3F runtime | Zero WebGL overhead |

Build output (post-removal): largest app chunks are `vendor-firebase` (195 KB gzip), `vendor-react` (50 KB gzip), `ChatPanel` (7 KB gzip).

### Optimizations
- Lazy-loaded pages, chat panel, and chat button
- Manual vendor chunking in `vite.config.ts`
- Poster `loading="lazy"` in grids; hero poster `loading="eager"`
- Explicit image dimensions to prevent CLS

### Lighthouse (mobile, local preview — 2026-08-31)

| Category | Score |
| -------- | ----- |
| Performance | **84** |
| Accessibility | **95** |

Run: `npx lighthouse http://localhost:4173 --form-factor=mobile --only-categories=performance,accessibility`

Raw report: `docs/lighthouse-mobile.json`. Scores vary between runs due to OMDb API latency on the home page hero poster (LCP element).

---

## Accessibility

- Semantic HTML (`main`, `nav`, `section`, `dialog` for chat)
- Keyboard navigation with visible `focus-visible` rings
- `aria-label` on icon buttons, search, and chat controls
- `aria-live="polite"` on message log and tool status
- Reduced-motion: Framer Motion respects `prefers-reduced-motion`
- Screen-reader-friendly tool states (status roles, not raw JSON)

Prior WAVE/axe pass documented in `AUDIT.md`. **Re-audit recommended after 3D removal.**

---

## Deployment

### Vercel (recommended)

1. Push to GitHub and import at [vercel.com/new](https://vercel.com/new)
2. Set server env vars (`AI_API_KEY`, `OMDB_API_KEY`, Firebase `VITE_*` vars)
3. Build: `npm run build` → output `dist/`; API routes from `api/*`
4. Verify: deployed URL loads home hero; `POST /api/chat` with empty body returns 400

### CI
`.github/workflows/ci.yml` runs build + unit tests on push.

### Production URL
**NOT VERIFIED** — set your Vercel URL here after deploy.

---

## Known Limitations

1. **Rate limiter is per-Vercel-instance**, not globally distributed. Effective against naive abuse; add Redis/KV for high-traffic production.
2. **Firebase Email/Password only** — OAuth requires additional Console setup.
3. **OMDb free tier** — limited daily requests; heavy AI tool usage may hit caps.
4. **OpenRouter free model** — variable latency and availability.
5. **Watch Trailer button** on hero is a UI placeholder (no trailer API wired).

---

## AI-Assisted Development

| Area | AI generated | Manually reviewed / corrected |
| ---- | ------------ | ----------------------------- |
| Initial app scaffold | React pages, Firebase auth, OMDb hooks | Fixed routing imports, auth persistence, favourites sync |
| CineBot integration | AI SDK wiring, tool schemas, streaming UI | Hardened error mapping, stop/retry logic, ESLint fixes |
| 3D showcase (removed) | R3F poster + WebGL shader hero | **Removed entirely** — replaced with CSS gradient hero for production readiness |
| Tests | Vitest + Playwright specs | Fixed stale assertions after poster fallback change; updated E2E mock stream format |
| README & docs | Draft architecture sections | Verified against actual code; removed unverified Lighthouse claims |

**Workflow:** Cursor agent with phased capstone prompt (audit → remove 3D → strengthen AI → test → document). Each phase verified with `npm run build`, `npm run test`, `npm run lint`.

**Mistakes caught:** Hallucinated movie data prevented by server-side tool enforcement; raw tool JSON never shown to users; demo `/demo` route removed but E2E still referenced it (fixed).

---

## License

MIT — see [LICENSE](LICENSE).

## Author

Amr Alshabasy
