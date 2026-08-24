import { z } from 'zod'

export const SearchMoviesSchema = z.object({
  query: z
    .string()
    .min(1, { message: 'query must be non-empty' })
    .describe('Movie search text such as a title, genre keyword, or actor name'),
  page: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe('OMDb results page number from 1 to 100'),
})

/**
 * @typedef {{ imdbId: string, title: string, year: string, poster: string | null, type: string }} MovieHit
 * @typedef {{ movies: MovieHit[], totalResults: number, query: string }} SearchMoviesOutput
 */

function getOmdbConfig() {
  const baseUrl = (process.env.OMDB_BASE_URL || process.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com')
    .replace('http://', 'https://')
    .replace(/\/$/, '')
  const apiKey = process.env.OMDB_API_KEY || process.env.VITE_OMDB_API_KEY
  return { baseUrl, apiKey }
}

/**
 * @param {{ query: string, page?: number }} input
 * @returns {Promise<SearchMoviesOutput>}
 */
export async function executeSearchMovies(input) {
  const parsed = SearchMoviesSchema.parse(input)
  const { query, page = 1 } = parsed

  if (query.trim().toLowerCase() === 'trigger-error') {
    throw new Error('Simulated movie search failure')
  }

  if (process.env.TOOL_SABOTAGE === 'true') {
    throw new Error('Simulated movie search failure')
  }

  const { baseUrl, apiKey } = getOmdbConfig()
  if (!apiKey) {
    throw new Error('OMDb API key is not configured on the server')
  }

  const url = `${baseUrl}/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie&page=${page}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Movie search service is temporarily unavailable')
  }

  const data = await response.json()

  if (!data || data.Response === 'False' || !data.Search) {
    return { movies: [], totalResults: 0, query }
  }

  const movies = data.Search.map((movie) => ({
    imdbId: movie.imdbID ?? '',
    title: movie.Title ?? 'Untitled',
    year: movie.Year ?? 'Unknown',
    poster: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null,
    type: movie.Type || 'movie',
  })).filter((movie) => movie.imdbId)

  const totalResults = Number.parseInt(data.totalResults || String(movies.length), 10) || movies.length

  return { movies, totalResults, query }
}
