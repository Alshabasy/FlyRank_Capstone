# 🎬 CineVault — Movie Discovery App

> A modern React + Vite movie application for discovering movies, browsing genres, saving favourites, and chatting with an AI movie assistant (CineBot) with **AI SDK tool calling** and **generative UI**.

---

## ✨ Overview

CineVault combines movie browsing (OMDb + Firebase) with a floating AI assistant that can call a real server-side `searchMovies` tool and render structured results as React components.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| AI | AI SDK v7 (`streamText`, UI message streams) |
| AI provider | OpenRouter (server-side) |
| Movie data | OMDb API |
| Auth / data | Firebase Auth + Realtime Database |
| Deployment | Vercel (static app + `/api/*` serverless functions) |

---

## 🤖 AI Tools

### Architecture

1. **Client** — `useGeminiChat` wraps AI SDK `AbstractChat` + `DefaultChatTransport` → `POST /api/chat`
2. **Server** — `api/chat.js` runs `streamText` with the `searchMovies` tool
3. **Tool execution** — `api/_lib/search-movies.js` validates with Zod, queries OMDb, normalizes JSON
4. **Generative UI** — `ChatMessage` renders typed `tool-searchMovies` parts across four states

### Tool: `searchMovies`

**Purpose:** Search OMDb for movie results when the user needs real catalog data.

**Defined in:**
- Server execution: `api/_lib/search-movies.js`
- Client types: `src/lib/tools/search-movies.ts`
- Tool registration: `api/chat.js`

**Input schema:**

```json
{
  "query": "string (required, non-empty)",
  "page": "integer 1-100 (optional)"
}
```

**Return shape:**

```json
{
  "movies": [
    {
      "imdbId": "string",
      "title": "string",
      "year": "string",
      "poster": "string | null",
      "type": "string"
    }
  ],
  "totalResults": 0,
  "query": "string"
}
```

**Failure behavior:**

| Condition | Behavior |
|-----------|----------|
| OMDb/network failure | Tool `output-error` → `ToolError` component |
| Zero results | `MovieSearchResults` empty state (not an error) |
| Invalid input | HTTP 400 from `/api/search-movies` |
| Dev sabotage (`trigger-error`, `TOOL_SABOTAGE=true`) | Simulated tool failure for testing |

**Tool UI states:** `input-streaming` · `input-available` · `output-available` · `output-error`

---

## ⚙️ Getting Started

### Prerequisites

- Node.js LTS
- npm

### Install & run

```bash
git clone <your-repo-url>
cd Capstone
npm install
cp .env.example .env   # fill values locally — never commit .env
npm run dev            # http://localhost:5173
```

Local dev serves `/api/chat` and `/api/search-movies` through the Vite middleware (`vite-api-plugin.js`), using the same handlers deployed on Vercel.

### Build

```bash
npm run build
npm run preview
```

---

## 🔐 Environment variables (names only)

**Client (Vite):**

- `VITE_OMDB_API_KEY`, `VITE_OMDB_BASE_URL`
- `VITE_FIREBASE_*`
- `VITE_AI_API_KEY` (local dev fallback read by server routes if `AI_API_KEY` unset)
- `VITE_AI_MODEL` (optional)

**Server (preferred in production — set in Vercel dashboard):**

- `AI_API_KEY` or `OPENROUTER_API_KEY`
- `AI_MODEL` (default: `openrouter/free`)
- `OMDB_API_KEY`, `OMDB_BASE_URL`

**Development sabotage (never enable in production):**

- `VITE_CHAT_SABOTAGE=rate-limit` — force HTTP 429 from chat route
- `VITE_CHAT_SABOTAGE=stream-fail` — partial stream then error
- `TEST_RATE_LIMIT=true` — server-side 429 for all chat requests
- `TOOL_SABOTAGE=true` — force all tool executions to fail
- Reserved query `trigger-error` — single tool failure

Disable sabotage: remove/unset all flags above and restart the dev server.

---

## 🧪 Sabotage testing commands

```bash
# Rate limit
VITE_CHAT_SABOTAGE=rate-limit npm run dev

# Mid-stream failure
VITE_CHAT_SABOTAGE=stream-fail npm run dev

# Tool failure via env
TOOL_SABOTAGE=true npm run dev

# Tool failure via query (in chat)
Find movies trigger-error

# Server-side search API direct test
curl -X POST http://localhost:5173/api/search-movies \
  -H 'Content-Type: application/json' \
  -d '{"query":"inception"}'
```

See `docs/FAILURE-INVENTORY.md` for the full failure matrix.

---

## 📁 Relevant files

| Area | Path |
|------|------|
| Chat API | `api/chat.js` |
| Search API | `api/search-movies.js` |
| Tool + OMDb | `api/_lib/search-movies.js` |
| AI prompt/config | `api/_lib/ai-config.js`, `src/lib/ai-config.ts` |
| Chat hook | `src/hooks/useGeminiChat.ts` |
| Tool UI | `src/components/chatbot/SearchMoviesToolView.tsx` |
| Results UI | `src/components/chatbot/MovieSearchResults.tsx` |
| Error UI | `src/components/chatbot/ToolError.tsx` |
| Chat shell | `src/components/chatbot/ChatPanel.tsx` |
| Local API middleware | `vite-api-plugin.js` |
| Vercel routing | `vercel.json` |

---

## 📄 License

MIT — see [LICENSE](LICENSE).

## 👤 Author

Amr Alshabasy
