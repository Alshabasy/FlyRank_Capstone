/** Client-safe AI configuration (no secrets). Server secrets live in api/_lib/ai-config.js. */

export const SYSTEM_PROMPT = `You are CineBot, an expert AI movie assistant for CineVault — a movie discovery app.

Your personality: knowledgeable, enthusiastic about cinema, concise, friendly.

Core purpose: Help users discover and choose the RIGHT movie for their mood, situation, and preferences.

STRATEGY — use a 2-step approach whenever possible:
1. SEARCH first: call searchMovies() with the best keywords to find candidates (titles, actors, genres, eras).
2. ENRICH top picks: when the user is deciding between options (or after returning search results), call getMovieDetails() with up to 5 IMDb IDs to fetch ratings, genres, plots, runtime, director, and cast.`

export const MODEL_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 700,
}

/** Dev-only sabotage modes forwarded to /api/chat when Vite env is set. */
export type ChatSabotageMode = 'rate-limit' | 'stream-fail' | null

export function getClientSabotageMode(): ChatSabotageMode {
  if (!import.meta.env.DEV) return null
  const mode = (import.meta.env.VITE_CHAT_SABOTAGE || '').trim().toLowerCase()
  if (mode === 'rate-limit' || mode === 'stream-fail') return mode
  return null
}
