import { createOpenAI } from '@ai-sdk/openai'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  tool,
} from 'ai'
import { SYSTEM_PROMPT, MODEL_CONFIG, resolveAiApiKey, resolveChatModel, isDevSabotageAllowed } from './_lib/ai-config.js'
import { executeSearchMovies, SearchMoviesSchema } from './_lib/search-movies.js'
import { executeGetMovieDetails, GetMovieDetailsSchema } from './_lib/get-movie-details.js'
import { checkRateLimit, makeRateLimitedResponse, applyRateLimitHeaders } from './_lib/rate-limit.js'
import {
  ChatRequestSchema,
  validateUserMessageLengths,
  MAX_USER_MESSAGE_LENGTH,
  MAX_MESSAGES_IN_CONTEXT,
  MAX_PAGE_CONTEXT_LENGTH,
} from './_lib/chat-validation.js'

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
}

const RATE_LIMIT_MAX = 25
const RATE_LIMIT_INFO = { maxRequests: RATE_LIMIT_MAX }

function json(status, body, rateInfo) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
  if (rateInfo) applyRateLimitHeaders(response, rateInfo)
  return response
}

const searchMoviesTool = tool({
  description:
    'Search OMDb for real movie results. Use whenever the user asks to find, search, or list movies by title, genre, year, actor, mood, era, or similar criteria. Returns candidate matches — call getMovieDetails next for 2-5 top picks to get rating, genre, runtime, plot, director, and cast.',
  inputSchema: SearchMoviesSchema,
  execute: async (input) => executeSearchMovies(input),
})

const getMovieDetailsTool = tool({
  description:
    'Fetch full metadata (IMDb rating, genre, runtime, director, cast, plot, awards, country, poster) for up to 5 specific movies by their IMDb IDs. Use after searchMovies when recommending or comparing movies so you can justify picks with real data instead of guessing.',
  inputSchema: GetMovieDetailsSchema,
  execute: async (input) => executeGetMovieDetails(input),
})

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return json(405, { message: 'Method not allowed' }, RATE_LIMIT_INFO)
  }

  const rl = checkRateLimit(request, { maxRequests: RATE_LIMIT_MAX })
  if (!rl.allowed) {
    return makeRateLimitedResponse({ ...RATE_LIMIT_INFO, retryAfterMs: rl.retryAfterMs })
  }
  const rateInfo = { ...RATE_LIMIT_INFO, used: RATE_LIMIT_MAX }

  let body
  try {
    const text = await request.text()
    if (text.length > 32_000) {
      return json(413, { message: 'Request payload too large' }, rateInfo)
    }
    body = JSON.parse(text)
  } catch {
    return json(400, { message: 'Invalid JSON body' }, rateInfo)
  }

  const parsed = ChatRequestSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    const hint = firstIssue
      ? firstIssue.code === 'too_big' || firstIssue.code === 'too_small'
        ? `Field limit exceeded`
        : 'Request validation failed'
      : 'Request validation failed'
    return json(400, { message: hint }, rateInfo)
  }

  const { messages, pageContext, sabotage: sabotageRaw } = parsed.data
  const sabotage = isDevSabotageAllowed() ? sabotageRaw : undefined

  if (!validateUserMessageLengths(messages)) {
    return json(400, {
      message: `User message exceeds the ${MAX_USER_MESSAGE_LENGTH} character limit`,
    }, rateInfo)
  }

  if (messages.length > MAX_MESSAGES_IN_CONTEXT) {
    return json(400, { message: `Too many messages (max ${MAX_MESSAGES_IN_CONTEXT})` }, rateInfo)
  }

  if (typeof pageContext === 'string' && pageContext.length > MAX_PAGE_CONTEXT_LENGTH) {
    return json(400, { message: 'Page context too long' }, rateInfo)
  }

  if (sabotage === 'rate-limit' || process.env.TEST_RATE_LIMIT === 'true') {
    return makeRateLimitedResponse({ ...RATE_LIMIT_INFO, retryAfterMs: 10_000 })
  }

  const apiKey = resolveAiApiKey()
  if (!apiKey) {
    return json(500, {
      message: 'CineBot is not configured. Add AI_API_KEY on the server.',
    }, rateInfo)
  }

  const openrouter = createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
  })

  const system = pageContext
    ? `${SYSTEM_PROMPT}\n\nCurrent page context: ${pageContext}`
    : SYSTEM_PROMPT

  try {
    if (sabotage === 'stream-fail') {
      const stream = createUIMessageStream({
        async execute({ writer }) {
          writer.write({ type: 'start' })
          writer.write({ type: 'text-start', id: 'sabotage-text' })
          writer.write({
            type: 'text-delta',
            id: 'sabotage-text',
            delta: 'The best movies I recommend are',
          })
          throw new Error('Simulated mid-stream failure')
        },
        onError: () => 'The response was interrupted. Please try again.',
      })

      return createUIMessageStreamResponse({ stream })
    }

    const result = streamText({
      model: openrouter.chat(resolveChatModel()),
      system,
      messages: await convertToModelMessages(messages),
      tools: {
        searchMovies: searchMoviesTool,
        getMovieDetails: getMovieDetailsTool,
      },
      stopWhen: stepCountIs(5),
      temperature: MODEL_CONFIG.temperature,
      maxOutputTokens: MODEL_CONFIG.maxOutputTokens,
      abortSignal: request.signal,
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[chat handler error]', err instanceof Error ? err.message : String(err))
    }
    return json(500, { message: 'Something went wrong while contacting CineBot.' }, rateInfo)
  }
}

export async function POST(request) {
  return handler(request)
}
