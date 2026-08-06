import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMoviesByGenre, searchMovies } from '../utils/omdb'
import { GENRES } from '../utils/constants'
import CategoryChip from '../components/ui/CategoryChip'
import MovieGrid from '../components/movie/MovieGrid'
import MovieRow from '../components/movie/MovieRow'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useFavourites } from '../hooks/useFavourites'
import { useAuth } from '../context/AuthContext'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Categories() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()
  const selectedGenre = query.get('genre') || 'Action'
  const searchTerm = query.get('search') || ''
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const activeGenre = useMemo(() => (GENRES.includes(selectedGenre) ? selectedGenre : 'Action'), [selectedGenre])
  const { user } = useAuth()
  const { favourites, addFavourite, removeFavourite, isFavourite } = useFavourites()
  const favouriteIds = useMemo(() => new Set(favourites.map((item) => item.imdbID)), [favourites])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (searchTerm) {
        const results = await searchMovies(searchTerm)
        setMovies(results)
      } else {
        const results = await getMoviesByGenre(activeGenre)
        setMovies(results)
      }
      setLoading(false)
    }

    load()
  }, [activeGenre, searchTerm])

  const handleSelectGenre = (genre) => {
    navigate(`/categories?genre=${encodeURIComponent(genre)}`)
  }

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
    <main className="min-h-screen bg-cinema-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Browse by Genre</h1>
            <p className="mt-2 text-sm text-cinema-muted">Explore hand-picked movies by genre.</p>
          </div>
          <p className="text-sm text-cinema-muted">Showing results for {searchTerm || activeGenre}</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4">
          {GENRES.map((genre) => (
            <CategoryChip key={genre} label={genre} active={genre === activeGenre} onClick={() => handleSelectGenre(genre)} />
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <MovieRow
            title={searchTerm ? `Search results for ${searchTerm}` : `${activeGenre} Movies`}
            movies={movies}
            linkTo={`/categories?genre=${encodeURIComponent(activeGenre)}`}
            savedIds={favouriteIds}
            onToggleFavourite={handleToggleFavourite}
          />
        )}
      </div>
    </main>
  )
}

// ✅ src/pages/Categories.jsx complete
