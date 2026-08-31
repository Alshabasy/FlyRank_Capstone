import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RiHeartLine, RiHeartFill, RiFilmLine } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'

export default function MovieCard({ movie, showRemove, saved = false, onToggleFavourite, onRemove }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const genreChips = useMemo(() => {
    const genres = movie.Genre?.split(',').slice(0, 2).map((item) => item.trim()) ?? []
    return genres
  }, [movie.Genre])

  const handleFavouriteClick = (event) => {
    event.stopPropagation()
    if (onToggleFavourite) {
      onToggleFavourite(movie)
      return
    }

    if (!user) {
      navigate('/login')
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="group relative overflow-hidden rounded-3xl bg-cinema-dark shadow-cinema"
      layout
    >
      <button
        type="button"
        onClick={() => navigate(`/movie/${movie.imdbID}`)}
        className="relative block h-full w-full text-left"
        aria-label={`View details for ${movie.Title}`}
      >
        {movie.Poster && movie.Poster !== 'N/A' ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            width="300"
            height="450"
            className="h-[320px] w-full object-cover aspect-[2/3]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-[320px] items-center justify-center bg-[#161b29] text-cinema-muted">
            <RiFilmLine className="h-12 w-12" aria-hidden="true" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-card-gradient px-4 py-4 text-cinema-white transition-all duration-300 group-hover:h-3/5 group-hover:pb-6">
          <div className="space-y-2">
            <div>
              <p className="text-lg font-semibold leading-tight">{movie.Title}</p>
              <p className="text-sm text-cinema-muted">{movie.Year}</p>
            </div>
            <div className="hidden space-x-2 text-xs font-medium group-hover:flex">
              {genreChips.map((genre) => (
                <span key={genre} className="rounded-full bg-glass px-2 py-1">
                  {genre}
                </span>
              ))}
            </div>
            <div className="hidden items-center justify-between gap-3 group-hover:flex">
              <span className="inline-flex items-center gap-1 rounded-full bg-cinema-red px-3 py-2 text-xs font-semibold text-cinema-white">
                ⭐ {movie.imdbRating ?? 'N/A'}
              </span>
              <span className="rounded-full border border-theme bg-black/40 px-3 py-2 text-xs text-cinema-white">
                View Details
              </span>
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={handleFavouriteClick}
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-cinema-white transition hover:bg-cinema-red"
        aria-label={saved ? 'Remove from favourites' : 'Add to favourites'}
      >
        {saved ? <RiHeartFill className="h-5 w-5 text-cinema-red" /> : <RiHeartLine className="h-5 w-5" />}
      </button>

      {showRemove && onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onRemove(movie.imdbID)
          }}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-glass px-3 py-2 text-xs text-cinema-white transition hover:bg-cinema-red"
          aria-label="Remove movie from watchlist"
        >
          Remove
        </button>
      )}
    </motion.div>
  )
}

// ✅ src/components/movie/MovieCard.jsx complete
