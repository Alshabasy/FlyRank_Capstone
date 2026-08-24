# Failure Inventory — CineBot Chat

Verification environment: local dev (`npm run dev`), Vite + `/api/*` middleware, OpenRouter model `openrouter/free`, OMDb via server `OMDB_API_KEY` / `VITE_OMDB_API_KEY`.

| # | Case | Trigger | Expected behavior | Actual behavior | Recovery | Status |
|---|------|---------|-------------------|-----------------|----------|--------|
| 1 | Empty input | Send with whitespace / empty textarea | No API request; useful feedback | Send disabled; empty submit shows inline hint | Type a valid message | Verified (code + UI) |
| 2 | Network failure before send | Browser offline before send | Designed error, retry, input usable | `fetch` wrapper maps offline to network error card with Retry | Retry after reconnect | Verified (transport) |
| 3 | API error | Invalid server config / upstream 500 | Designed error, no crash | JSON error from `/api/chat` surfaced via chat error card | Retry / fix env | Verified (handler) |
| 4 | Mid-stream failure | `VITE_CHAT_SABOTAGE=stream-fail` | Partial text preserved, error, retry last user message | SSE emits partial `"The best movies I recommend are"` then `error` chunk | Retry button → `chat.regenerate()` | Verified (API script) |
| 5 | Rate limit / 429 | `TEST_RATE_LIMIT=true` or `VITE_CHAT_SABOTAGE=rate-limit` | Rate-limit copy + Retry | HTTP 429 JSON → client error card | Retry after cooldown | Verified (API script) |
| 6 | Slow response | Normal model latency | Thinking indicator until first token/tool part | `submitted` or streaming-without-content shows `ThinkingIndicator` | Wait | Verified (hook logic) |
| 7 | Tool failure | Query `trigger-error` or `TOOL_SABOTAGE=true` | `output-error` tool UI, app usable | Tool execute throws → AI SDK `output-error` part → `ToolError` | Retry last message | Verified (API script) |
| 8 | No movie results | OMDb returns zero hits | Designed empty state, next actions | `MovieSearchResults` empty branch + example chips | Try broader query / examples | Verified (API script) |
| 9 | First-run empty state | Open chat with zero messages | Example prompts, clear CTA | Three clickable prompts populate/send flow | Click example | Verified (UI) |
| 10 | Route/server failure | Broken API route | Error boundary / API JSON error | `AppErrorBoundary` for React faults; API returns JSON for route errors | Reload / Try again | Verified (code) |
| 11 | Aborted generation | Stop while streaming | Partial assistant message kept; input re-enabled | `chat.stop()` preserves tokens; status returns to ready | Send next message | Verified (AI SDK stop) |
| 12 | Mobile keyboard / viewport | 375px width, input focus | No horizontal overflow; composer pinned | Panel uses `100dvh`-based height, `overscroll-contain`, responsive widths | Scroll / jump-to-latest | Verified (layout) |

## Sabotage controls (development only)

| Flag | Effect |
|------|--------|
| `VITE_CHAT_SABOTAGE=rate-limit` | Client asks server to return HTTP 429 |
| `VITE_CHAT_SABOTAGE=stream-fail` | Partial stream then SSE error |
| `TEST_RATE_LIMIT=true` | All chat requests return 429 |
| `TOOL_SABOTAGE=true` | All `searchMovies` executions fail |
| Query `trigger-error` | Single tool call fails |

Disable all flags and restart dev server before production deploy.

## Manual QA checklist

- [x] Happy path tool call (`Find sci-fi movies from 2020`) — server stream includes `tool-searchMovies` lifecycle
- [x] Empty input blocked
- [x] Example prompts on empty chat
- [x] 429 sabotage
- [x] Mid-stream sabotage partial text
- [x] Tool sabotage (`trigger-error`)
- [x] Zero-result normalization
- [x] Production build (`npm run build`)

## Known limitations

- OpenRouter free model routing can change; default is `openrouter/free` (override with `AI_MODEL`).
- Browser-level offline simulation requires DevTools; automated curl tests cover API paths only.
- Tool retry re-runs the failed assistant turn via `regenerate()`, not a isolated tool re-execution.
