import { executeSearchMovies, SearchMoviesSchema } from './_lib/search-movies.js'
import { checkRateLimit, makeRateLimitedResponse, applyRateLimitHeaders } from './_lib/rate-limit.js'

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
}

const RATE_LIMIT_MAX = 60
const RATE_LIMIT_INFO = { maxRequests: RATE_LIMIT_MAX }

function json(status, body, rateInfo) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
  if (rateInfo) applyRateLimitHeaders(response, rateInfo)
  return response
}

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
    if (text.length > 4_000) {
      return json(413, { message: 'Request payload too large' }, rateInfo)
    }
    body = JSON.parse(text)
  } catch {
    return json(400, { message: 'Invalid JSON body' }, rateInfo)
  }

  try {
    const parsed = SearchMoviesSchema.safeParse(body)
    if (!parsed.success) {
      const firstCode = parsed.error.issues[0]?.code
      const msg =
        firstCode === 'too_big' || firstCode === 'too_small' || firstCode === 'invalid_type'
          ? 'Invalid search request'
          : 'Request validation failed'
      return json(400, { message: msg }, rateInfo)
    }
    const result = await executeSearchMovies(parsed.data)
    return json(200, result, rateInfo)
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[search-movies error]', error instanceof Error ? error.message : String(error))
    }
    const message = error instanceof Error ? error.message : 'Movie search failed'
    const isClientError =
      message.toLowerCase().includes('non-empty') ||
      message.toLowerCase().includes('invalid') ||
      message.toLowerCase().includes('query')
    return json(isClientError ? 400 : 500, {
      message: isClientError ? 'Invalid search request' : 'We could not retrieve movie results right now.',
    }, rateInfo)
  }
}

export async function POST(request) {
  return handler(request)
}
