import { executeSearchMovies, SearchMoviesSchema } from './_lib/search-movies.js'

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
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
    return json(405, { message: 'Method not allowed' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { message: 'Invalid JSON body' })
  }

  try {
    const input = SearchMoviesSchema.parse(body)
    const result = await executeSearchMovies(input)
    return json(200, result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Movie search failed'
    const status =
      message.toLowerCase().includes('non-empty') || message.toLowerCase().includes('invalid')
        ? 400
        : 500
    return json(status, {
      message: 'We could not retrieve movie results right now.',
      detail: message,
    })
  }
}

export async function POST(request) {
  return handler(request)
}
