import { z } from 'zod'

export const GetMovieDetailsSchema = z.object({
  imdbIds: z
    .array(z.string().min(5, { message: 'imdbId too short' }).max(32))
    .min(1, { message: 'at least one imdbId required' })
    .max(5, { message: 'max 5 movies per details call' })
    .describe('IMDb IDs to look up full metadata for (1-5 movies). Use to get rating, genre, plot, runtime, director, cast.'),
})

function getOmdbConfig() {
  const baseUrl = (process.env.OMDB_BASE_URL || process.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com')
    .replace('http://', 'https://')
    .replace(/\/$/, '')
  const apiKey = process.env.OMDB_API_KEY || process.env.VITE_OMDB_API_KEY
  return { baseUrl, apiKey }
}

/**
 * @param {{ imdbId: string }} opts
 * @returns {Promise<import('../../src/lib/tools/get-movie-details.js').DetailedMovie | null>}
 */
async function fetchOneDetails(imdbId) {
  const { baseUrl, apiKey } = getOmdbConfig()
  if (!apiKey) throw new Error('OMDb API key is not configured on the server')

  const url = `${baseUrl}/?apikey=${apiKey}&i=${encodeURIComponent(imdbId)}&type=movie&plot=short&r=json`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Movie details service temporarily unavailable')

  const data = await response.json()
  if (!data || data.Response === 'False') return null

  return {
    imdbId: data.imdbID ?? imdbId,
    title: data.Title ?? 'Untitled',
    year: data.Year ?? 'Unknown',
    released: data.Released ?? 'N/A',
    runtime: data.Runtime ?? 'N/A',
    genre: data.Genre ?? 'N/A',
    director: data.Director ?? 'N/A',
    cast: data.Actors ?? 'N/A',
    plot: data.Plot ?? 'No plot summary available.',
    language: data.Language ?? 'N/A',
    country: data.Country ?? 'N/A',
    awards: data.Awards ?? 'N/A',
    poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
    rating: data.imdbRating ?? 'N/A',
    imdbVotes: data.imdbVotes ?? 'N/A',
    type: data.Type || 'movie',
  }
}

/**
 * @param {{ imdbIds: string[] }} input
 * @returns {Promise<import('../../src/lib/tools/get-movie-details.js').GetMovieDetailsOutput>}
 */
export async function executeGetMovieDetails(input) {
  const parsed = GetMovieDetailsSchema.parse(input)
  const { imdbIds } = parsed

  const results = await Promise.all(
    imdbIds.map((id) =>
      fetchOneDetails(id).catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[getMovieDetails] failed for', id, err instanceof Error ? err.message : String(err))
        }
        return null
      }),
    ),
  )

  return {
    movies: results.filter((m) => m !== null),
    requested: imdbIds.length,
    found: results.filter((m) => m !== null).length,
  }
}
