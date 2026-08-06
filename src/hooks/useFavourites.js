import { useEffect, useState, useCallback } from 'react'
import { ref, set, remove, get } from 'firebase/database'
import { rdb } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

export function useFavourites() {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshFavourites = useCallback(async () => {
    if (!user?.uid) {
      setFavourites([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const favouritesRef = ref(rdb, `favourites/${user.uid}`)
      const snapshot = await get(favouritesRef)
      const data = snapshot.val() || {}
      const saved = Object.keys(data).map((key) => data[key])
      setFavourites(saved)
    } catch (error) {
      setFavourites([])
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    refreshFavourites()
  }, [refreshFavourites])

  const addFavourite = async (movie) => {
    if (!user?.uid || !movie?.imdbID) {
      return
    }

    try {
      const movieRef = ref(rdb, `favourites/${user.uid}/${movie.imdbID}`)
      await set(movieRef, {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        imdbRating: movie.imdbRating ?? 'N/A',
        savedAt: Date.now(),
      })
      toast.success('Added to Watchlist ✓')
      await refreshFavourites()
    } catch (error) {
      toast.error('Could not save movie.')
    }
  }

  const removeFavourite = async (imdbID) => {
    if (!user?.uid || !imdbID) {
      return
    }

    try {
      const movieRef = ref(rdb, `favourites/${user.uid}/${imdbID}`)
      await remove(movieRef)
      toast('Removed from Watchlist')
      await refreshFavourites()
    } catch (error) {
      toast.error('Could not remove movie.')
    }
  }

  const isFavourite = (imdbID) => {
    return favourites.some((movie) => movie.imdbID === imdbID)
  }

  return { favourites, loading, addFavourite, removeFavourite, isFavourite }
}

// ✅ src/hooks/useFavourites.js complete
