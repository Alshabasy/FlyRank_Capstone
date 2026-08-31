import { Link } from 'react-router-dom'
import { RiFilmLine, RiArrowRightLine } from 'react-icons/ri'
import type { MovieHit } from '../../lib/tools/search-movies'

interface MovieSearchResultsProps {
  movies: MovieHit[]
  totalResults: number
  query: string
  onTryExample?: (prompt: string) => void
  onDismissChat?: () => void
}

function Poster({ poster, alt }: { poster: string | null; alt: string }) {
  if (!poster) {
    return (
      <div
        className="flex h-24 w-16 flex-none items-center justify-center rounded-sm bg-glass text-[10px] text-cinema-muted"
        aria-hidden="true"
      >
        <RiFilmLine className="h-6 w-6 opacity-60" />
      </div>
    )
  }

  return (
    <img
      src={poster}
      alt={alt}
      className="h-24 w-16 flex-none rounded-sm object-cover"
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = 'none'
        const fallback = event.currentTarget.nextElementSibling
        if (fallback instanceof HTMLElement) {
          fallback.hidden = false
        }
      }}
    />
  )
}

export function MovieSearchResults({ movies, totalResults, query, onTryExample, onDismissChat }: MovieSearchResultsProps) {
  if (!movies.length) {
    return (
      <div className="m-1 rounded-xl border border-theme bg-glass p-4" role="status">
        <p className="text-sm font-semibold text-cinema-white">No movies found</p>
        <p className="mt-1 text-sm text-cinema-muted">
          Nothing matched &ldquo;{query}&rdquo;. Try a broader title or different keywords.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Sci-fi movies from 2020', 'Movies starring Tom Hanks', 'Similar to Inception'].map(
            (example) => (
              <button
                key={example}
                type="button"
                onClick={() => onTryExample?.(example)}
                className="rounded-full border border-cinema-blue/40 bg-cinema-blue/10 px-3 py-1 text-xs text-cinema-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
              >
                {example}
              </button>
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="m-1 overflow-hidden rounded-xl border border-theme bg-glass" aria-label="Movie search results">
      <header className="flex items-center justify-between gap-2 border-b border-theme px-3 py-2">
        <div>
          <p className="text-sm font-semibold text-cinema-white">Movie Results</p>
          <p className="text-xs text-cinema-muted">
            {totalResults} match{totalResults === 1 ? '' : 'es'} for &ldquo;{query}&rdquo;
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-wider text-cinema-muted">Tap a card to open details</p>
      </header>
      <ul className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto p-3">
        {movies.map((movie, index) => (
          <li key={movie.imdbId || index}>
            <Link
              to={`/movie/${movie.imdbId}`}
              onClick={() => onDismissChat?.()}
              className="group flex gap-3 rounded-lg border border-theme bg-cinema-dark/60 p-2 transition hover:border-cinema-blue/60 hover:bg-cinema-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
              aria-label={`Open details for ${movie.title}`}
            >
              <Poster poster={movie.poster} alt={`${movie.title} poster`} />
              <div
                className="flex h-24 w-16 flex-none items-center justify-center rounded-sm bg-glass text-[10px] text-cinema-muted"
                hidden
                aria-hidden="true"
              >
                <RiFilmLine className="h-6 w-6 opacity-60" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="truncate text-sm font-semibold text-cinema-white group-hover:text-cinema-white">
                    {movie.title}
                  </h4>
                  <RiArrowRightLine
                    className="mt-0.5 h-4 w-4 flex-none text-cinema-muted transition group-hover:translate-x-0.5 group-hover:text-cinema-blue"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-cinema-muted">
                  <span>{movie.year}</span>
                  <span className="capitalize">{movie.type}</span>
                </div>
                <p className="mt-2 truncate text-[11px] text-cinema-muted/80">
                  IMDb ID: <span className="font-mono">{movie.imdbId}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
