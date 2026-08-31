import { useEffect, useMemo, useState } from 'react'
import { getMoviesByGenre, getTrendingMovies } from '../utils/omdb'
import MovieRow from '../components/movie/MovieRow'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useFavourites } from '../hooks/useFavourites'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { RiFilmLine, RiStarFill } from 'react-icons/ri'

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
    document.title = 'CineVault — Premium Cinema Hub & AI Assistant'
  }, [])

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      const [trendingResults, actionResults, dramaResults, sciFiResults] = await Promise.all([
        getTrendingMovies(),
        getMoviesByGenre('Action'),
        getMoviesByGenre('Drama'),
        getMoviesByGenre('Sci-Fi'),
      ])
      setTrending(trendingResults)
      if (trendingResults.length > 0) {
        setHeroMovie(trendingResults[0])
      }
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
    <main className="min-h-screen bg-cinema-black text-cinema-white">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,var(--color-hero-glow-1),transparent_55%),radial-gradient(ellipse_at_80%_70%,var(--color-hero-glow-2),transparent_60%),linear-gradient(180deg,var(--color-background)_0%,var(--color-surface)_50%,var(--color-background)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-black/35 via-transparent to-cinema-black/85" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,var(--color-background)_80%)] opacity-35" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7 max-w-3xl rounded-3xl border border-theme bg-cinema-dark/90 p-8 shadow-cinema backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cinema-red">Trending now</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-cinema-white sm:text-5xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.9)' }}>{heroMovie?.Title ?? 'CineVault'}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-glass px-3 py-2 text-sm font-semibold text-cinema-white inline-flex items-center gap-1.5">
                  <RiStarFill className="text-yellow-400 h-4 w-4" aria-hidden="true" />
                  {heroMovie?.imdbRating ?? 'N/A'}
                </span>
                {heroMovie?.Genre?.split(',').slice(0, 3).map((genre) => (
                  <span key={genre} className="rounded-full bg-glass px-3 py-2 text-sm text-cinema-muted">
                    {genre.trim()}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-cinema-muted sm:text-base line-clamp-3 min-h-[4.5em]">
                {heroMovie?.Plot ?? 'Discover your next favourite film with CineVault — the premium cinema hub combining hand-curated discovery, intelligent AI recommendations, and a personal watchlist.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/movie/${heroMovie?.imdbID ?? ''}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-cinema-red px-6 py-3 text-sm font-semibold text-cinema-white transition hover:bg-cinema-red-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-red"
                >
                  View Details
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-theme bg-transparent px-6 py-3 text-sm font-semibold text-cinema-white transition hover:border-cinema-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-red"
                >
                  Watch Trailer
                </button>
              </div>
            </div>

            {/* Static Featured Poster — fast, lightweight, no WebGL overhead */}
            <div className="lg:col-span-5 hidden md:block">
              <div className="relative mx-auto aspect-[2/3] w-full max-w-sm">
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cinema-red/20 via-cinema-surface-2/30 to-cinema-red/15 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-theme shadow-[0_30px_80px_-20px_rgba(229,9,20,0.55)]">
                  {heroMovie?.Poster && heroMovie.Poster !== 'N/A' ? (
                    <img
                      src={heroMovie.Poster}
                      alt={`${heroMovie.Title} poster`}
                      className="h-full w-full object-cover"
                      width={400}
                      height={600}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cinema-dark to-cinema-surface-2 text-cinema-muted">
                      <RiFilmLine className="h-20 w-20 opacity-50" aria-hidden="true" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent" aria-hidden="true" />
                  {heroMovie?.Runtime && (
                    <div className="absolute bottom-4 right-4 rounded-full border border-theme bg-cinema-black/70 px-3 py-1.5 text-xs font-medium text-cinema-white backdrop-blur">
                      {heroMovie.Runtime}
                    </div>
                  )}
                </div>
              </div>
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
