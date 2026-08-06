import { useEffect, useState, useRef } from 'react'
import { searchMovies, getMoviesByGenre, getTrendingMovies } from '../utils/omdb'

export function useMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!query) {
      setMovies([])
      return
    }

    setLoading(true)
    setError(null)

    clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      try {
        const results = await searchMovies(query)
        setMovies(results)
      } catch (fetchError) {
        setError(fetchError)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const search = (value) => {
    setQuery(value)
  }

  const fetchByGenre = async (genre) => {
    setLoading(true)
    setError(null)

    try {
      const results = await getMoviesByGenre(genre)
      setMovies(results)
      return results
    } catch (fetchError) {
      setError(fetchError)
      setMovies([])
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchTrending = async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await getTrendingMovies()
      setMovies(results)
      return results
    } catch (fetchError) {
      setError(fetchError)
      setMovies([])
      return []
    } finally {
      setLoading(false)
    }
  }

  return { movies, loading, error, search, fetchByGenre, fetchTrending }
}

// ✅ src/hooks/useMovies.js complete
