import { z } from 'zod'

/** Client-side Zod contract + types (mirrors api/_lib/search-movies.js). */
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

export type SearchMoviesInput = z.infer<typeof SearchMoviesSchema>

export type MovieHit = {
  imdbId: string
  title: string
  year: string
  poster: string | null
  type: string
}

export type SearchMoviesOutput = {
  movies: MovieHit[]
  totalResults: number
  query: string
}

export function isSearchMoviesOutput(value: unknown): value is SearchMoviesOutput {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return Array.isArray(record.movies) && typeof record.query === 'string' && typeof record.totalResults === 'number'
}
