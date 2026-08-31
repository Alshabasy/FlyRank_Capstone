import { Link } from 'react-router-dom'
import { RiFilmLine, RiStarFill, RiTimeLine, RiUserLine, RiTrophyLine, RiArrowRightLine } from 'react-icons/ri'
import type { UIToolInvocation } from 'ai'
import type { CineBotTools } from '../../lib/chat-types'
import { isGetMovieDetailsOutput } from '../../lib/tools/get-movie-details'
import { ToolError } from './ToolError'

type DetailsPart = {
  type: 'tool-getMovieDetails'
  toolCallId: string
} & UIToolInvocation<CineBotTools['getMovieDetails']>

interface MovieDetailsToolViewProps {
  part: DetailsPart
  onRetry?: () => void
  onDismissChat?: () => void
  retryDisabled?: boolean
}

function Rating({ value }: { value: string }) {
  if (!value || value === 'N/A') {
    return <span className="text-cinema-muted text-xs">No rating</span>
  }
  const numeric = Number.parseFloat(value)
  const color = numeric >= 8 ? 'text-emerald-400' : numeric >= 6.5 ? 'text-yellow-400' : numeric >= 5 ? 'text-amber-400' : 'text-red-300'
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${color}`}>
      <RiStarFill className="h-3 w-3" aria-hidden="true" />
      {value}
    </span>
  )
}

export function MovieDetailsToolView({ part, onRetry, onDismissChat, retryDisabled = false }: MovieDetailsToolViewProps) {
  switch (part.state) {
    case 'input-streaming':
      return (
        <div
          className="m-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cinema-muted"
          role="status"
          aria-live="polite"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cinema-red" aria-hidden="true" />
          Fetching full movie metadata...
        </div>
      )

    case 'input-available':
      return (
        <div className="m-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2" role="status">
          <p className="text-sm font-medium text-cinema-white">Looking up movie details</p>
          <p className="mt-1 text-xs text-cinema-muted">
            {part.input.imdbIds.length} movie{part.input.imdbIds.length === 1 ? '' : 's'}:{' '}
            <span className="font-mono">{part.input.imdbIds.slice(0, 3).join(', ')}</span>
            {part.input.imdbIds.length > 3 ? ` (+${part.input.imdbIds.length - 3} more)` : ''}
          </p>
        </div>
      )

    case 'output-available': {
      const output = isGetMovieDetailsOutput(part.output) ? part.output : null
      if (!output) {
        return (
          <ToolError
            message="Movie details arrived in an unexpected format."
            onRetry={onRetry}
            retryDisabled={retryDisabled}
          />
        )
      }

      if (output.movies.length === 0) {
        return (
          <div className="m-1 rounded-xl border border-amber-400/20 bg-amber-500/5 p-3" role="status">
            <p className="text-sm font-medium text-amber-200">No details retrieved</p>
            <p className="mt-1 text-xs text-amber-200/80">
              Couldn&apos;t find metadata for the requested {output.requested === 1 ? 'movie' : 'movies'}.
            </p>
          </div>
        )
      }

      return (
        <section
          className="m-1 overflow-hidden rounded-xl border border-white/10 bg-white/5"
          aria-label={`Full details for ${output.movies.length} recommended movie${output.movies.length === 1 ? '' : 's'}`}
        >
          <header className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-cinema-white">
                {output.movies.length} Recommendation{output.movies.length === 1 ? '' : 's'} · Full Details
              </p>
              <p className="text-xs text-cinema-muted">Rating · Genre · Runtime · Plot</p>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-cinema-muted">Tap to open</p>
          </header>
          <ul className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto p-3">
            {output.movies.map((movie) => (
              <li key={movie.imdbId}>
                <Link
                  to={`/movie/${movie.imdbId}`}
                  onClick={() => onDismissChat?.()}
                  className="group block rounded-lg border border-white/10 bg-cinema-dark/70 p-3 transition hover:border-cinema-blue/60 hover:bg-cinema-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
                  aria-label={`Open details for ${movie.title} — rated ${movie.rating}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-none">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={`${movie.title} poster`}
                          className="h-28 w-20 rounded object-cover"
                          loading="lazy"
                          width={80}
                          height={112}
                        />
                      ) : (
                        <div className="flex h-28 w-20 items-center justify-center rounded bg-white/10">
                          <RiFilmLine className="h-8 w-8 text-cinema-muted" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate text-sm font-semibold text-cinema-white">{movie.title}</h4>
                        <RiArrowRightLine
                          className="mt-0.5 h-4 w-4 flex-none text-cinema-muted transition group-hover:translate-x-0.5 group-hover:text-cinema-blue"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <Rating value={movie.rating} />
                        <span className="text-cinema-muted">· {movie.year}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-cinema-muted">
                        <span className="inline-flex items-center gap-1">
                          <RiTimeLine className="h-3 w-3" aria-hidden="true" />
                          {movie.runtime}
                        </span>
                        {movie.genre && movie.genre !== 'N/A' ? (
                          <span className="truncate">· {movie.genre.split(', ').slice(0, 2).join(', ')}</span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-cinema-muted/90">
                        {movie.director && movie.director !== 'N/A' ? (
                          <span className="inline-flex items-center gap-1 truncate">
                            <RiUserLine className="h-3 w-3" aria-hidden="true" />
                            Dir. {movie.director.split(',')[0]}
                          </span>
                        ) : null}
                        {movie.awards && movie.awards !== 'N/A' && movie.awards.toLowerCase().includes('oscar') ? (
                          <span className="inline-flex items-center gap-1 text-amber-300">
                            <RiTrophyLine className="h-3 w-3" aria-hidden="true" />
                            Won awards
                          </span>
                        ) : null}
                      </div>
                      {movie.plot && movie.plot !== 'N/A' ? (
                        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-cinema-muted/90">
                          {movie.plot}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )
    }

    case 'output-error':
      return (
        <ToolError
          message="We couldn't retrieve detailed movie info right now."
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
