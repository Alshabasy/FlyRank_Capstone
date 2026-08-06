import { createOpenAI } from '@ai-sdk/openai'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isThinking: boolean
  isStreaming: boolean
  error: string | null
}

const aiApiKey = (import.meta.env.VITE_AI_API_KEY?.trim() || import.meta.env.VITE_OPENROUTER_API_KEY?.trim()).trim()

export const aiClient = aiApiKey
  ? createOpenAI({
      apiKey: aiApiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  : null

export const CHAT_MODEL = import.meta.env.VITE_AI_MODEL?.trim() || 'inclusionai/ling-3.0-tiny:free'

export const SYSTEM_PROMPT = `
You are CineBot, an expert AI movie assistant for CineVault — a movie discovery app.

Your personality: knowledgeable, enthusiastic about cinema, concise, friendly.

You help users with:
- Movie recommendations based on genre, mood, or similar titles
- Movie facts: cast, director, plot, ratings, release year
- "Is it worth watching?" style advice
- Comparing movies
- Explaining plot points (with spoiler warnings)

Rules:
- Keep responses under 200 words unless the user asks for detail
- Always mention IMDB ratings when recommending (e.g. "rated 8.8/10 on IMDB")
- If asked about something non-movie-related, politely redirect to cinema topics
- Format lists with bullet points using "•"
- Never make up movie facts — if unsure, say so
- If a user mentions they're on the movie detail page, use that context
`

export const MODEL_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 512,
}

export function getChatModel() {
  if (!aiClient) {
    return null
  }

  return aiClient.chat(CHAT_MODEL)
}

export function getFallbackResponse(message: string, pageContext?: string) {
  const prompt = `${pageContext ? `[Context: ${pageContext}] ` : ''}${message}`.toLowerCase()

  if (prompt.includes('similar') || prompt.includes('like')) {
    return 'I’m switching to a local fallback because the live AI service is currently unavailable. For movie suggestions, I’d start with Interstellar, The Matrix, or Blade Runner if you like thoughtful sci-fi, or Se7en and Zodiac for darker thrillers.'
  }

  if (prompt.includes('worth watching') || prompt.includes('watch')) {
    return 'I can still help with a quick recommendation: if you want something gripping and stylish, Inception and The Dark Knight are strong picks; if you want something more emotional, La La Land or The Grand Budapest Hotel are great options.'
  }

  if (prompt.includes('thriller') || prompt.includes('90s')) {
    return 'For a thriller, I’d point you toward Se7en, Silence of the Lambs, or The Sixth Sense. If you want something more modern, Prisoners and Gone Girl are excellent too.'
  }

  if (prompt.includes('rating') || prompt.includes('rate')) {
    return 'I can’t verify live ratings right now because the live AI service is temporarily unavailable, but I can still help you compare titles and pick something based on mood, genre, or era.'
  }

  return 'I’m using a local fallback because the live AI service is temporarily unavailable right now. I can still help with movie recommendations, genre picks, and quick comparisons while the live assistant is down.'
}

// ✅ src/lib/gemini.ts complete
