import type { UIMessage } from 'ai'
import type { SearchMoviesOutput } from './tools/search-movies'

export type CineBotTools = {
  searchMovies: {
    input: {
      query: string
      page?: number
    }
    output: SearchMoviesOutput
  }
}

export type CineBotUIMessage = UIMessage<never, never, CineBotTools>
