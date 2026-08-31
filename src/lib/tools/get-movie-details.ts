import { z } from 'zod'

export type DetailedMovie = {
  imdbId: string
  title: string
  year: string
  released: string
  runtime: string
  genre: string
  director: string
  cast: string
  plot: string
  language: string
  country: string
  awards: string
  poster: string | null
  rating: string
  imdbVotes: string
  type: string
}

export const GetMovieDetailsSchema = z.object({
  imdbIds: z.array(z.string()).min(1).max(5),
})

export type GetMovieDetailsInput = z.infer<typeof GetMovieDetailsSchema>

export type GetMovieDetailsOutput = {
  movies: DetailedMovie[]
  requested: number
  found: number
}

export function isGetMovieDetailsOutput(value: unknown): value is GetMovieDetailsOutput {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return Array.isArray(record.movies) && typeof record.requested === 'number' && typeof record.found === 'number'
}
