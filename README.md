# 🎬 CineVault — Premium Cinema Hub & AI Assistant

> A production-grade React + Vite movie discovery application combining AI-powered chat with tool calling, generative UI, a custom cinematic WebGL fragment shader hero, and an interactive 3D poster showcase — all hardened for public deployment.

---

## ✨ Features

### 🎥 Movie Discovery
- **Trending, Action, Drama, Sci-Fi** rows powered by OMDb with lazy-loaded poster grids
- **Genre categories** page for browsing
- **Individual movie detail** views with rating, cast, and plot information
- **Watchlist / Favourites** persisted to Firebase Realtime Database with user auth

### 🤖 AI Chat (CineBot)
- **Streaming responses** via AI SDK UI message streams — token-by-token rendering
- **Tool calling**: server-side `searchMovies` tool that queries real OMDb data (never hallucinates catalog results)
- **Generative UI**: typed tool parts render as React components in four states (`input-streaming`, `input-available`, `output-available`, `output-error`)
- **Stop / Retry / Regenerate** controls with proper abort signal handling
- **Context injection**: current page metadata is attached to requests

### 🛡️ Error Handling & Resilience
- **Graceful failures** for rate limits, network drops, mid-stream disconnects, and tool errors
- **Per-component error boundaries** (page shell + chat panel + root)
- **Sabotage harness** for manual and automated failure-mode testing (see `docs/FAILURE-INVENTORY.md`)

### 🎨 Custom WebGL Hero
- **Fullscreen cinematic fragment shader**: hand-written GLSL aurora/light-field visual with project-specific palette
- **Three uniforms**: `u_time`, `u_resolution`, `u_mouse` — all meaningfully wired
- **Aspect-corrected UV** coordinates — compositionally stable from 375px to 4K
- **`pointer-events: none`** decorative canvas — never intercepts foreground clicks
- **DPR capped at 1.5×** — justified trade-off between fidelity and fill-rate

### 🎭 Interactive 3D Experience
- **React Three Fiber** poster showcase with:
  - Cursor-tilt reactivity (lerped for smoothness)
  - Click-to-flip with neon ↔ gold lighting toggle
  - Float animation from drei
  - **`prefers-reduced-motion`** disables float & tilt
  - Fallback static card when WebGL is unavailable

### ♿ Accessibility & Performance
- **Focus-visible rings** on every interactive element
- **`aria-label`s** on icon buttons and search inputs
- **Mobile-first responsive** layout with zero horizontal overflow
- **Route-level code-splitting** + vendor chunking (Firebase, Framer, Three, AI, Icons)
- **Lazy-loaded** 3D canvas, shader hero, chat panel, and chat button
- **Visibility pausing** — the fragment shader halts time + RAF when the tab is hidden
- **Reduced-motion fallback** — shader hero swaps to an equivalent static radial gradient; 3D tilt is disabled

### 🔐 Production Security
- **Server-side rate limiting** (IP/UA-backed sliding window) on both API routes
- **Strict payload size caps** (32 KB chat / 4 KB search)
- **Per-field length limits** (1,500-char user messages, 20-message context window, 6,000-char tool content)
- **Zod validation** on every incoming server request
- **Safe error responses** — no stack traces, API keys, or internal paths leak to the client
- **Firebase config isolation**: public client config via `VITE_*`; server-only secrets in non-exposed env vars

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 8 + TypeScript 6 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3.4 + custom cinema palette |
| Animation | Framer Motion 13 (page transitions / nav) |
| WebGL / 3D | Three.js + React Three Fiber 8 + drei 9 |
| Custom shader | Raw WebGL2 with hand-written GLSL fragment shader |
| AI | AI SDK v7 (`streamText`, `createUIMessageStream`, tool calling) |
| AI provider | OpenRouter (server-side proxy — never exposes keys to client) |
| Movie data | OMDb API (dual: client for browsing, server for AI tool) |
| Auth / data | Firebase Auth + Realtime Database (lazy-loaded modules) |
| Validation | Zod 4 (client + server) |
| Testing | Vitest 4 + Testing Library (14 unit tests), Playwright 1.62 (E2E) |
| Deployment | Vercel (static SPA + `/api/*` Node.js serverless functions) |
| Linting | ESLint 10 + typescript-eslint + React Compiler plugin |

---

## 🏗️ Architecture

```
Browser (React UI)
   │
   ├─ ChatPanel ──▶ useGeminiChat (AI SDK AbstractChat)
   │                       │
   │                       └── POST /api/chat ──────┐
   │                                                │
   │                                                ▼
   │                            Vercel Serverless (Node.js runtime)
   │                                │
   │                                ├─ streamText() call to OpenRouter
   │                                │    (AI SDK model adapter)
   │                                └── tool: searchMovies
   │                                         │
   │                                         ▼
   │                               OMDb HTTP fetch ──▶ Zod normalize
   │                                         │
   │                                         ▼
   │                               typed tool-result part ◀───┐
   │                                                           │
   └── ChatMessage ──▶ generative UI: SearchMoviesToolView ───┘
                              │
                              ├─ MovieSearchResults (grid)
                              └─ ToolError (retryable error UI)
```

### Shader rendering pipeline

```
Home.jsx hero section
  └─ CinematicShaderHero (code-split via React.lazy)
       ├─ prefers-reduced-motion: reduce  →  static CSS gradient
       ├─ WebGL init failed                →  static CSS gradient
       └─ WebGL ready
            ├─ ResizeObserver  →  set canvas size × DPR 1.5 cap
            ├─ pointermove     →  damped lerp into u_mouse uniform
            ├─ visibilitychange →  freeze RAF + time; resume without jump
            └─ requestAnimationFrame loop
                 └─ draw fullscreen quad
                      └─ GLSL: normalized UV → aspect correct →
                         dual fbm fields → palette mix → grain → vignette
```

### Fallback chain

```
Hero requested
  └─ CinematicShaderHero suspense → immediate: gradient skeleton
       └─ reduced motion or no WebGL → brand gradient (permanent)
       └─ WebGL OK → shader overlay + gradient-vignette sandwich for
                     guaranteed text contrast

3D poster requested
  └─ suspense: shimmer skeleton
       └─ no WebGL → static card with emoji + explanation
       └─ reduced motion → render without tilt/float
       └─ normal: R3F Canvas with DPR [1,1.5]
```

---

## 🧠 Custom Fragment Shader — Documentation

### Source location
`src/components/shaders/CinematicShaderHero.tsx` — vertex + fragment GLSL embedded as template strings, compiled at runtime.

### Uniforms

| Uniform | Type | Purpose |
|---|---|---|
| `u_time` | `float` | Accumulated wall-clock time the tab has been **visible** (not hidden). Decelerated inside the shader (×0.08) for ambient, non-distracting motion. |
| `u_resolution` | `vec2` | Actual canvas backbuffer size in device pixels. Used for (a) aspect-ratio correction so the pattern never stretches, and (b) film-grain hash so grain is per-pixel regardless of DPR. |
| `u_mouse` | `vec2` | Normalized `[0,1]` pointer position inside the hero container (Y flipped to match GL's bottom-left origin). Damped at 8 %/frame for a soft parallax pull, not a violent follow. Neutral is `(0.5, 0.5)`. |

### GLSL section breakdown (comments inline in source)

1. **Coordinate normalization** — `v_uv` from vertex shader is `[0,1]` (bottom-left origin).
2. **Aspect-ratio correction** — `uv = (v_uv - 0.5) * 2.0; uv.x *= aspect;` gives `[-a, a] × [-1, 1]`; a circle stays a circle at any viewport.
3. **Time-based animation** — `slowTime = u_time * 0.08`. Two fields drift in opposite directions at different rates to keep motion organic without becoming noise.
4. **Mouse influence** — `mousePull = mouseNdc * 0.15` offsets the two fbm domains with a sign difference so they shear gently, not translate rigidly.
5. **Procedural field / noise** — `hash21 → valueNoise → 4-octave fbm`. Two fields `noiseA` and `noiseB` warp each other to form aurora bands. 4 octaves is the deliberate ceiling to keep shader cost bounded.
6. **Color palette** — 4-stop mix against CineVault brand colors: `deepSpace #08080f → auroraBlue #1d4ed8 → auroraPurple #5b21b6 → auroraRed #e50914`. Single-pixel film grain `±1.75%` to defeat banding.
7. **Contrast / vignette** — radial `1 − smoothstep(dot(uv,uv))` vignette to ~55 % at edges, then a `pow(0.92)` contrast lift for true film blacks.
8. **Final output** — `vec4(color, 1.0)`. Alpha blending is not used; overlay contrast guarantees text legibility on top.

### Answers to shader review questions

1. **What is UV?** The per-fragment coordinate in texture space, ranging `[0,1]` with `(0,0)` at the bottom-left of the fullscreen quad (matching WebGL convention).
2. **Why do we normalize coordinates?** Raw pixel coords depend on viewport size — normalization lets procedural math (distances, circles, noise) work the same at every resolution, without per-device tuning.
3. **Why is aspect ratio correction needed?** A 16:9 screen has a different X/Y scale than a 9:16 phone. Without correction a circular feature renders as an ellipse on one device vs. another — the hero would *visibly stretch* between breakpoints.
4. **What does `u_time` control?** It advances the dual noise-fields to create flowing bands. It is **only accumulated while the tab is visible** (visibility API), and decelerated in-shader, so motion reads as cinema ambience rather than a distraction.
5. **What does `u_resolution` control?** (a) Supplies the denominator for aspect correction — `aspect = res.x / res.y`. (b) Gives real pixel dimensions for the per-pixel grain hash so grain size is consistent across DPR 1.0 and 1.5.
6. **What does `u_mouse` control?** Shears the two noise domains in opposite directions with a soft lerp — creates a "light follows cursor" parallax. Touch-only devices stay at neutral `(0.5, 0.5)` for a stable composition.
7. **How is the procedural pattern generated?** A 2D value-noise hash (`hash21`) → value-noise with smoothstep interpolation → four-octave fbm layered twice, with each field warping the other's domain to create shearing aurora bands.
8. **How is color generated?** Three `mix()` stages gated by smoothstep thresholds on the noise masks, then additive per-pixel grain. Colors are picked directly from the project's Tailwind palette so the shader feels native to the app, not like a grafted demo.
9. **Why does the shader remain performant?** DPR capped at 1.5× (cuts fragments 44 % vs 2×, 75 % vs 3×), 4-octave fbm ceiling, zero texture reads, one hash for grain, no loops, and the RAF pauses entirely when the tab is hidden or reduced motion is enabled.
10. **What happens under reduced motion?** The React effect short-circuits and renders a brand-matched radial-gradient background (`cinema-red ↔ cinema-blue over deep space`) with identical content contrast behavior — the hero headline and CTA are unchanged.
11. **What happens when the tab is hidden?** `visibilitychange` cancels the RAF and records the timestamp. On return, the timestamp baseline resets so `u_time` resumes *from where it left off* — no multi-minute "fast forward" jump.

### Reduced-motion & tab-hidden behavior

Both features are enforced from the React host layer so they can be applied *before* any WebGL context is created, avoiding wasted memory on devices that will never render the shader.

### Performance strategy for shader

- **Single fullscreen quad** (two triangles, no vertex work)
- **DPR `min(devicePixelRatio, 1.5)`** — the justified sweet spot for a fragment-dominant pass
- **`ResizeObserver` not onscroll** — resize work only when layout actually changes, not every frame
- **Mouse damping in JS not GLSL** — 8 %/frame exponential lerp runs once per frame on two floats, rather than per-fragment
- **Visibility guard** — at the 60 FPS budget a hidden tab would otherwise burn 60 GPU draws per second × however many minutes the user is away

---

## 🧪 Testing

```bash
# Unit tests (Vitest + Testing Library)
npm run test

# Watch mode
npm run test:watch

# E2E (Playwright — installs browsers on first run)
npm run test:e2e
```

Coverage: 14 passing unit tests across login form validation, chat message rendering, movie search result rendering, and BrainButton state machines. E2E spec walks the full chat flow (prompt → streaming response → completion).

### Failure-inventory testing

A built-in sabotage harness exercises every meaningful failure path. Commands and trigger points are documented in `docs/FAILURE-INVENTORY.md`.

---

## 🚀 Run Instructions

```bash
# 1. Clone
git clone git@github.com:<your-org>/<your-repo>.git
cd Capstone

# 2. Install dependencies
npm install

# 3. Environment variables
cp .env.example .env
# then edit .env — see variable table below

# 4. Development (Vite + local API middleware on port 5173)
npm run dev

# 5. Production build
npm run build

# 6. Preview production build locally
npm run preview
```

Local dev serves `/api/chat` and `/api/search-movies` through `vite-api-plugin.js` using the *exact same handler code* that is deployed to Vercel serverless — no behavioural difference between dev and prod.

---

## 🔐 Environment Variables

### Client/public variables (Vite — bundled into the browser, NOT secret)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `VITE_OMDB_API_KEY` | Yes | OMDb API key for **client-side** movie browsing. Public because movie search is done from the browser in `src/utils/omdb.js`. |
| `VITE_OMDB_BASE_URL` | No | Override OMDb base URL. Defaults to `https://www.omdbapi.com`. |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase client API key. This is the **public** Web API key (not a server secret) — standard Firebase configuration. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain. |
| `VITE_FIREBASE_DATABASE_URL` | Yes | Firebase Realtime Database URL for watchlists. |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase FCM sender ID. |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID. |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | Firebase measurement ID. |
| `VITE_AI_API_KEY` | No* | Local-dev fallback for chat — *only used if server `AI_API_KEY` is unset*. Never set this in production. |
| `VITE_AI_MODEL` | No | Client-side override of the chat model; server reads `AI_MODEL` with higher priority. |

### Server-only variables (set in Vercel dashboard or `.env` locally — NEVER bundled into client code)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `AI_API_KEY` | Yes* | OpenRouter API key for streaming chat. **Preferred** server key. Has higher priority than VITE_AI_API_KEY. |
| `OPENROUTER_API_KEY` | Yes* | Alias accepted by `resolveAiApiKey()` if `AI_API_KEY` is unset. |
| `AI_MODEL` | No | Model identifier (default `openrouter/free`). |
| `OMDB_API_KEY` | Yes | OMDb API key for the **server-side** `searchMovies` tool. Keeping it separate from the client key lets you rotate scoped keys independently. |
| `OMDB_BASE_URL` | No | Override OMDb base URL for tool requests. Defaults to `https://www.omdbapi.com`. |

*Exactly one of `AI_API_KEY` or `OPENROUTER_API_KEY` is required server-side for CineBot to function. If unset the route returns HTTP 500 with a safe user-facing message. The client-side `VITE_AI_API_KEY` is never read by deployed server routes if a server key is present.*

**DO NOT PUT REAL VALUES IN `.env.example` OR `README.md`. NEVER COMMIT `.env`.**

---

## 📐 Technical Decisions

- **Why Vite + React?** Vite 8's instant HMR and Rolldown-based production build deliver a tight edit loop and small bundles; React 18's Suspense and `startTransition` integrate cleanly with the AI SDK's streaming UI model.
- **Why the AI SDK?** First-class support for `streamText`, typed UI message streams, and server-side tool calling removes all hand-rolled SSE parsing and provider coupling.
- **Why OpenRouter via server proxy?** Exposes a single well-known provider surface and guarantees the API key never hits the client. Proxying also allows us to enforce rate limits, length caps, and prompt injection safeguards.
- **Why server-side tool execution?** OMDb keys for the AI tool are server-only, response payloads are normalized through Zod, and we can sanitize/trim results *before* they ever enter the context window.
- **Why a custom raw-WebGL shader (not R3F) for the hero?** R3F carries 100+ KB of renderer code for a 2D fullscreen quad. Raw WebGL + hand-written GLSL ships a 3.77 KB gzipped shader module, with identical feature coverage (uniforms, DPR cap, visibility pause, reduced-motion) but zero framework overhead on the hero critical path.
- **Why `Math.min(devicePixelRatio, 1.5)`?** A procedural aurora is fragment-bound and almost entirely low-frequency content — 2×+ pixel ratios fill 4× the fragments with diminishing perceptual returns. 1.5× is the smallest multiplier that keeps diagonal edges smooth while halving the shader cost vs. 2×.
- **Why React.lazy for 3D, shader, chat, and chat button?** None of these are needed for First Contentful Paint. Splitting them drops the main-chunk budget and moves the cost to idle time / user interaction time.
- **Why an in-process rate limiter (not distributed)?** For single-project Vercel deployments without a Redis budget, the strongest *practical* protection is per-instance sliding-window rate limiting. It is documented honestly in the "Limitations" note below and is strictly better than no rate limit at all. For multi-region high-traffic deployments, add Upstash or Vercel KV to the lookup chain in `api/_lib/rate-limit.js`.
- **Why Vitest + Playwright?** Vitest matches Vite's module graph zero-config, and Playwright gives deterministic cross-browser E2E for the streaming chat contract.

### Known limitations (honest disclosure)

1. **Rate limiter is per-Vercel-instance, not global.** Cold starts and horizontally-scaled instances each carry their own counter bucket. For true distributed rate limiting add a shared store (Upstash Redis / Vercel KV) with an atomic `INCR + EXPIRE` pattern. The current implementation is still effective against naive single-client abuse.
2. **Firebase Email/Password auth is the only configured provider.** OAuth (Google, Apple) would need additional Console configuration — scaffolding for the auth UI already exists in `src/pages/Login.jsx`.

---

## 🤖 AI Usage Section

CineBot is a production AI chat assistant integrated through the Vercel AI SDK.

### Model & provider
- **Provider:** OpenRouter
- **Default model:** `openrouter/free` (configurable via `AI_MODEL` server env var)
- **Temperature:** 0.7
- **`maxOutputTokens`:** 512 per step (enforced server-side)
- **Step limit:** 5 tool-call steps per request (`stopWhen: stepCountIs(5)`)

### Prompt guardrails (see `api/_lib/ai-config.js::SYSTEM_PROMPT`)
- Personality constrained to movie-related topics; politely redirects off-topic questions
- Max 200-word responses unless the user explicitly requests detail
- Always cites IMDb ratings in recommendations when known
- Spoiler-warns before revealing plot points
- Hard rule: `searchMovies` tool is called *before* answering any catalog lookup question; hallucinated search results are prohibited

### Tool: `searchMovies`
- **Purpose:** Real-time OMDb catalog lookup for user-initiated searches
- **Input schema (Zod):** `{ query: non-empty string, page?: 1..100 }`
- **Return shape:** `{ movies: MovieHit[], totalResults: number, query: string }`
- **Failure handling:** OMDb network / 5xx errors surface as `output-error` parts rendered by `ToolError`; empty result sets render as a friendly empty state, not an error.

### Streaming contract
Responses use AI SDK UI message streams (`createUIMessageStreamResponse` → `toUIMessageStream`) so the client can render assistant text, tool invocations, and tool results with incremental part-level updates without re-parsing the full payload.

### Guardrails & abuse prevention
- Length caps enforced **server-side** (not trusted from the client):
  - 1,500 chars per user message
  - 20 messages in the context window
  - 6,000 chars per tool input or result
  - 400 chars for page context attachment
- 32 KB hard cap on raw request body
- 25 chat requests / minute per identifier and 60 search requests / minute (IP-based, with UA fallback; see `api/_lib/rate-limit.js`)
- Abort signals wired from `request.signal` all the way through to the provider call

---

## 🌐 Cross-Browser Test Matrix

| Browser | Navigation | Hero shader | Chat | Streaming | Stop / Retry | Tool results | Error states | Mobile layout |
|---|---|---|---|---|---|---|---|---|
| Chrome (latest) | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified |
| Firefox (latest) | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified | ✅ Verified |
| Safari (latest macOS) | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Mobile Safari (iOS) | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |

To verify remaining entries: run `npm run test:e2e` with Playwright's browser flags set to `webkit` and iOS device emulation.

---

## 🚢 Deployment

### Vercel (recommended)

1. Push the repository to GitHub/GitLab.
2. Import the project at `vercel.com/new`.
3. In project **Settings → Environment Variables**, add every variable from the *Server-only* table (and any client `VITE_*` variables you need — though those are usually fine in a committed `.env.example` workflow).
4. Deploy. Build command is `npm run build`; output directory is `dist`; API routes auto-deploy from `api/*`.
5. Verify the deployed URL loads the shader hero and that `/api/chat` returns HTTP 400 on empty POST (the server is responding, and is reachable).

### CI

`.github/workflows/ci.yml` runs `npm run build` + `npm run test` on every push. Merges that break the build or the test suite are blocked.

---

## 📄 License

MIT — see [LICENSE](LICENSE).

## 👤 Author

Amr Alshabasy
