import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

// Lazily load Firebase Realtime Database
let firebaseDbPromise = null

function loadFirebaseDb() {
  if (!firebaseDbPromise) {
    firebaseDbPromise = Promise.all([
      import('firebase/database'),
      import('../firebase/config'),
    ]).then(([dbModule, configModule]) => ({
      rdb: configModule.rdb,
      ref: dbModule.ref,
      set: dbModule.set,
      remove: dbModule.remove,
      get: dbModule.get,
    }))
  }
  return firebaseDbPromise
}

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
      const fb = await loadFirebaseDb()
      const favouritesRef = fb.ref(fb.rdb, `favourites/${user.uid}`)
      const snapshot = await fb.get(favouritesRef)
      const data = snapshot.val() || {}
      const saved = Object.values(data)
      setFavourites(saved)
    } catch (error) {
      setFavourites([])
      toast.error('Could not load your watchlist.')
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
      const fb = await loadFirebaseDb()
      const movieRef = fb.ref(fb.rdb, `favourites/${user.uid}/${movie.imdbID}`)
      await fb.set(movieRef, {
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
      const fb = await loadFirebaseDb()
      const movieRef = fb.ref(fb.rdb, `favourites/${user.uid}/${imdbID}`)
      await fb.remove(movieRef)
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
