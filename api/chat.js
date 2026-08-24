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

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const searchMoviesTool = tool({
  description:
    'Search OMDb for real movie results. Use whenever the user asks to find, search, or list movies by title, genre, year, actor, or similar criteria. Do not invent search results.',
  inputSchema: SearchMoviesSchema,
  execute: async (input) => executeSearchMovies(input),
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
    return json(405, { message: 'Method not allowed' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { message: 'Invalid JSON body' })
  }

  const messages = body?.messages
  const pageContext = typeof body?.pageContext === 'string' ? body.pageContext : undefined
  const sabotage = isDevSabotageAllowed() ? body?.sabotage : undefined

  if (!Array.isArray(messages)) {
    return json(400, { message: 'messages must be an array' })
  }

  if (sabotage === 'rate-limit' || process.env.TEST_RATE_LIMIT === 'true') {
    return json(429, {
      message: 'Too many requests right now. Please try again in a moment.',
      code: 'RATE_LIMIT',
    })
  }

  const apiKey = resolveAiApiKey()
  if (!apiKey) {
    return json(500, {
      message: 'CineBot is not configured. Add AI_API_KEY on the server.',
    })
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
      },
      stopWhen: stepCountIs(5),
      temperature: MODEL_CONFIG.temperature,
      maxOutputTokens: MODEL_CONFIG.maxOutputTokens,
      abortSignal: request.signal,
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    })
  } catch {
    return json(500, { message: 'Something went wrong while contacting CineBot.' })
  }
}

export async function POST(request) {
  return handler(request)
}
