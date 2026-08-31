import type { UIMessage } from 'ai'
import type { SearchMoviesOutput } from './tools/search-movies'
import type { GetMovieDetailsOutput } from './tools/get-movie-details'

export type CineBotTools = {
  searchMovies: {
    input: {
      query: string
      page?: number
    }
    output: SearchMoviesOutput
  }
  getMovieDetails: {
    input: {
      imdbIds: string[]
    }
    output: GetMovieDetailsOutput
  }
}

export type CineBotUIMessage = UIMessage<never, never, CineBotTools>
