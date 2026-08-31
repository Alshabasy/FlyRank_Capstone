import type { UIToolInvocation } from 'ai'
import { MovieSearchResults } from './MovieSearchResults'
import { ToolError } from './ToolError'
import type { CineBotTools } from '../../lib/chat-types'
import { isSearchMoviesOutput } from '../../lib/tools/search-movies'

type SearchMoviesPart = {
  type: 'tool-searchMovies'
  toolCallId: string
} & UIToolInvocation<CineBotTools['searchMovies']>

interface SearchMoviesToolViewProps {
  part: SearchMoviesPart
  onRetry?: () => void
  onTryExample?: (prompt: string) => void
  onDismissChat?: () => void
  retryDisabled?: boolean
}

export function SearchMoviesToolView({
  part,
  onRetry,
  onTryExample,
  onDismissChat,
  retryDisabled = false,
}: SearchMoviesToolViewProps) {
  switch (part.state) {
    case 'input-streaming':
      return (
        <div
          className="m-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cinema-muted"
          role="status"
          aria-live="polite"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cinema-blue" aria-hidden="true" />
          Preparing search...
        </div>
      )

    case 'input-available':
      return (
        <div className="m-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2" role="status">
          <p className="text-sm font-medium text-cinema-white">Searching movies</p>
          <p className="mt-1 text-xs text-cinema-muted">
            Query: &ldquo;{part.input.query}&rdquo;
            {part.input.page ? ` · page ${part.input.page}` : ''}
          </p>
        </div>
      )

    case 'output-available': {
      const output = isSearchMoviesOutput(part.output) ? part.output : null
      if (!output) {
        return (
          <ToolError
            message="Movie results arrived in an unexpected format."
            onRetry={onRetry}
            retryDisabled={retryDisabled}
          />
        )
      }

      return (
        <MovieSearchResults
          movies={output.movies}
          totalResults={output.totalResults}
          query={output.query}
          onTryExample={onTryExample}
          onDismissChat={onDismissChat}
        />
      )
    }

    case 'output-error':
      return (
        <ToolError
          message="We couldn't retrieve movie results right now."
          onRetry={onRetry}
          retryDisabled={retryDisabled}
        />
      )

    case 'approval-requested':
    case 'approval-responded':
    case 'output-denied':
      return null

    default:
      return null
  }
}
