import { useEffect, useMemo, useState } from 'react'
import { getMoviesByGenre, getTrendingMovies } from '../utils/omdb'
import MovieRow from '../components/movie/MovieRow'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useFavourites } from '../hooks/useFavourites'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const [heroMovie, setHeroMovie] = useState(null)
  const [trending, setTrending] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [dramaMovies, setDramaMovies] = useState([])
  const [sciFiMovies, setSciFiMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { favourites, addFavourite, removeFavourite, isFavourite } = useFavourites()

  const favouriteIds = useMemo(() => new Set(favourites.map((item) => item.imdbID)), [favourites])

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      const trendingResults = await getTrendingMovies()
      setTrending(trendingResults)
      if (trendingResults.length > 0) {
        setHeroMovie(trendingResults[0])
      }
      const [actionResults, dramaResults, sciFiResults] = await Promise.all([
        getMoviesByGenre('Action'),
        getMoviesByGenre('Drama'),
        getMoviesByGenre('Sci-Fi'),
      ])
      setActionMovies(actionResults)
      setDramaMovies(dramaResults)
      setSciFiMovies(sciFiResults)
      setLoading(false)
    }

    loadMovies()
  }, [])

  const handleToggleFavourite = (movie) => {
    if (!user) {
      navigate('/login')
      return
    }
    if (isFavourite(movie.imdbID)) {
      removeFavourite(movie.imdbID)
    } else {
      addFavourite(movie)
    }
  }

  return (
    <main className="min-h-screen bg-cinema-black text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${heroMovie?.Poster ?? ''})`, transform: 'scale(1.05)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-end px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl rounded-3xl border border-white/10 bg-cinema-dark/90 p-8 shadow-cinema backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cinema-blue">Trending now</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">{heroMovie?.Title ?? 'CineVault'}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                ⭐ {heroMovie?.imdbRating ?? 'N/A'}
              </span>
              {heroMovie?.Genre?.split(',').slice(0, 3).map((genre) => (
                <span key={genre} className="rounded-full bg-white/10 px-3 py-2 text-sm text-cinema-muted">
                  {genre.trim()}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/movie/${heroMovie?.imdbID ?? ''}`}
                className="inline-flex items-center justify-center rounded-2xl bg-cinema-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-cinema-red-2"
              >
                View Details
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-cinema-blue"
              >
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <MovieRow
              title="Trending"
              movies={trending}
              linkTo="/categories?genre=Trending"
              savedIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
            <MovieRow
              title="Action"
              movies={actionMovies}
              linkTo="/categories?genre=Action"
              savedIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
            <MovieRow
              title="Drama"
              movies={dramaMovies}
              linkTo="/categories?genre=Drama"
              savedIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
            <MovieRow
              title="Sci-Fi"
              movies={sciFiMovies}
              linkTo="/categories?genre=Sci-Fi"
              savedIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
          </>
        )}
      </section>
    </main>
  )
}

// ✅ src/pages/Home.jsx complete
