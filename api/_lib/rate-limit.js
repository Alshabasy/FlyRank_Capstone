const WINDOW_MS = 60_000
const DEFAULT_MAX_REQUESTS = 30
const PRUNE_INTERVAL_MS = 5 * 60_000

const buckets = new Map()

let lastPrune = 0

function pruneOld() {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS)
    if (bucket.hits.length === 0) {
      buckets.delete(key)
    }
  }
  lastPrune = now
}

function identifierFromRequest(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return `ip:${first}`
  }
  const realIp = request.headers.get('x-real-ip')
  if (typeof realIp === 'string' && realIp.length > 0) {
    return `ip:${realIp}`
  }
  const userAgent = request.headers.get('user-agent') ?? 'unknown-ua'
  return `ua:${userAgent.slice(0, 96)}`
}

export function checkRateLimit(request, opts = {}) {
  const now = Date.now()
  if (now - lastPrune > PRUNE_INTERVAL_MS) {
    pruneOld()
  }

  const maxRequests = opts.maxRequests ?? DEFAULT_MAX_REQUESTS
  const id = identifierFromRequest(request)
  const bucket = buckets.get(id) ?? { hits: [] }

  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS)

  if (bucket.hits.length >= maxRequests) {
    buckets.set(id, bucket)
    return {
      allowed: false,
      retryAfterMs: Math.max(1, WINDOW_MS - (now - bucket.hits[0])),
    }
  }

  bucket.hits.push(now)
  buckets.set(id, bucket)
  return { allowed: true, retryAfterMs: 0 }
}

export function applyRateLimitHeaders(response, info) {
  const remaining = Math.max(0, (info.maxRequests ?? DEFAULT_MAX_REQUESTS) - (info.used ?? 1))
  response.headers.set('X-RateLimit-Limit', String(info.maxRequests ?? DEFAULT_MAX_REQUESTS))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Window', `${WINDOW_MS / 1000}s`)
  return response
}

export function makeRateLimitedResponse(info) {
  const retrySeconds = Math.max(1, Math.ceil((info.retryAfterMs ?? WINDOW_MS) / 1000))
  const response = new Response(
    JSON.stringify({
      message: 'Too many requests right now. Please try again in a moment.',
      code: 'RATE_LIMIT',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retrySeconds),
      },
    },
  )
  return applyRateLimitHeaders(response, { ...info, used: info.maxRequests ?? DEFAULT_MAX_REQUESTS })
}
