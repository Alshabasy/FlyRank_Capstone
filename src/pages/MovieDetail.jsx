import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getMovieById } from '../utils/omdb'
import { useAuth } from '../context/AuthContext'
import { useFavourites } from '../hooks/useFavourites'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { RiArrowLeftSLine } from 'react-icons/ri'

export default function MovieDetail() {
  const { imdbID } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addFavourite, removeFavourite, isFavourite } = useFavourites()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true)
      const result = await getMovieById(imdbID)
      setMovie(result)
      setLoading(false)
    }

    loadMovie()
  }, [imdbID])

  const saved = isFavourite(imdbID)

  const handleSave = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/movie/${imdbID}` } } })
      return
    }

    if (saved) {
      removeFavourite(imdbID)
      toast('Removed from Watchlist')
    } else {
      addFavourite(movie)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-cinema-black px-4 py-12 text-white sm:px-6 lg:px-8">
        <p className="text-center text-cinema-muted">Movie not found.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-cinema-black text-white">
      <div className="relative overflow-hidden pb-24">
        <div className="absolute inset-0 bg-cover bg-center blur-3xl" style={{ backgroundImage: `url(${movie.Poster !== 'N/A' ? movie.Poster : ''})` }} />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-cinema-dark/90 px-4 py-2 text-sm text-white transition hover:bg-white/5"
          >
            <RiArrowLeftSLine className="h-5 w-5" /> Back
          </button>

          <div className="grid w-full gap-8 rounded-3xl border border-white/10 bg-cinema-dark/95 p-6 shadow-cinema lg:grid-cols-[320px_1fr] lg:p-8">
            <div className="overflow-hidden rounded-3xl bg-black">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt={movie.Title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#111827] text-cinema-muted">No poster available</div>
              )}
            </div>

            <div className="space-y-6 text-white">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-cinema-muted">
                  <span>{movie.Year}</span>
                  <span>•</span>
                  <span>{movie.Runtime}</span>
                </div>
                <h1 className="text-4xl font-semibold">{movie.Title}</h1>
                <div className="flex flex-wrap gap-2">
                  {movie.Genre?.split(',').map((genre) => (
                    <span key={genre} className="rounded-full bg-white/10 px-3 py-2 text-sm text-white">
                      {genre.trim()}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-cinema-red px-3 py-2 text-sm font-semibold text-white">
                  ⭐ {movie.imdbRating ?? 'N/A'}
                </div>
              </div>

              <div className="space-y-3 rounded-3xl bg-[#111827]/80 p-6">
                <p className="text-sm text-cinema-muted">Director</p>
                <p className="text-lg text-white">{movie.Director}</p>
                <p className="text-sm text-cinema-muted">Actors</p>
                <p className="text-white">{movie.Actors}</p>
              </div>

              <div className="space-y-4 rounded-3xl bg-[#111827]/80 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-cinema-muted">Plot</p>
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="text-sm font-semibold text-cinema-blue transition hover:text-cinema-blue-2"
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                </div>
                <p className={expanded ? 'text-white' : 'line-clamp-3 text-white'}>{movie.Plot}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                    saved ? 'bg-emerald-500' : 'bg-cinema-red hover:bg-cinema-red-2'
                  }`}
                >
                  {user ? (saved ? '✓ Saved' : '♥ Add to Favourites') : 'Login to Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// ✅ src/pages/MovieDetail.jsx complete
