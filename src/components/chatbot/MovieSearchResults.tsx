import type { MovieHit } from '../../lib/tools/search-movies'

interface MovieSearchResultsProps {
  movies: MovieHit[]
  totalResults: number
  query: string
  onTryExample?: (prompt: string) => void
}

function Poster({ poster }: { poster: string | null }) {
  if (!poster) {
    return (
      <div
        className="flex h-20 w-14 flex-none items-center justify-center rounded-sm bg-white/10 text-[10px] text-cinema-muted"
        aria-hidden="true"
      >
        No art
      </div>
    )
  }

  return (
    <img
      src={poster}
      alt=""
      className="h-20 w-14 flex-none rounded-sm object-cover"
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

export function MovieSearchResults({ movies, totalResults, query, onTryExample }: MovieSearchResultsProps) {
  if (!movies.length) {
    return (
      <div className="m-1 rounded-xl border border-white/10 bg-white/5 p-4" role="status">
        <p className="text-sm font-semibold text-cinema-white">No movies found</p>
        <p className="mt-1 text-sm text-cinema-muted">
          Nothing matched &ldquo;{query}&rdquo;. Try a broader title or different keywords.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Find sci-fi movies from 2020', 'Find movies starring Tom Hanks', 'Find movies similar to Inception'].map(
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
    <section className="m-1 overflow-hidden rounded-xl border border-white/10 bg-white/5" aria-label="Movie search results">
      <header className="border-b border-white/10 px-3 py-2">
        <p className="text-sm font-semibold text-cinema-white">Movie Results</p>
        <p className="text-xs text-cinema-muted">
          {totalResults} match{totalResults === 1 ? '' : 'es'} for &ldquo;{query}&rdquo;
        </p>
      </header>
      <ul className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto p-3 sm:grid-cols-1">
        {movies.map((movie, index) => (
          <li key={movie.imdbId || index}>
            <article className="flex gap-3 rounded-lg border border-white/10 bg-cinema-dark/60 p-2">
              <Poster poster={movie.poster} />
              <div
                className="flex h-20 w-14 flex-none items-center justify-center rounded-sm bg-white/10 text-[10px] text-cinema-muted"
                hidden
                aria-hidden="true"
              >
                No art
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-cinema-white">{movie.title}</h4>
                <p className="mt-1 text-xs text-cinema-muted">{movie.year}</p>
                <p className="mt-1 text-xs capitalize text-cinema-muted">{movie.type}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
