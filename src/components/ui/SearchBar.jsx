import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiSearch } from 'react-icons/bi'
import { useMovies } from '../../hooks/useMovies'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const { movies, loading, search } = useMovies()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    search(query)
  }, [query])

  const handleResultClick = (id) => {
    setOpen(false)
    navigate(`/movie/${id}`)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cinema-dark text-cinema-white transition hover:bg-cinema-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open search"
        aria-expanded={open}
      >
        <BiSearch className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            className="absolute right-0 top-12 z-50 w-[320px] rounded-3xl bg-cinema-dark/95 p-4 shadow-cinema"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-4 py-2">
              <BiSearch className="h-5 w-5 text-cinema-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-cinema-muted focus:outline-none"
                placeholder="Search movies..."
                aria-label="Search movies"
                autoFocus
              />
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto text-sm">
              {loading && <p className="py-4 text-center text-cinema-muted">Searching...</p>}
              {!loading && query && movies.length === 0 && (
                <p className="py-4 text-center text-cinema-muted">No results for '{query}'.</p>
              )}
              {!loading && movies.length > 0 && (
                <div className="space-y-2">
                  {movies.slice(0, 6).map((movie) => (
                    <button
                      key={movie.imdbID}
                      type="button"
                      onClick={() => handleResultClick(movie.imdbID)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white/5"
                    >
                      <img
                        src={movie.Poster !== 'N/A' ? movie.Poster : ''}
                        alt={movie.Title}
                        className="h-12 w-8 rounded-lg bg-slate-900 object-cover"
                        loading="lazy"
                      />
                      <div className="truncate">
                        <p className="text-sm font-semibold text-white truncate">{movie.Title}</p>
                        <p className="text-xs text-cinema-muted">{movie.Year}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {query && (
              <button
                type="button"
                onClick={() => navigate(`/categories?search=${encodeURIComponent(query)}`)}
                className="mt-4 w-full rounded-2xl bg-cinema-blue px-3 py-2 text-sm font-semibold text-white transition hover:bg-cinema-blue-2"
              >
                See all results for "{query}" →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ✅ src/components/ui/SearchBar.jsx complete
