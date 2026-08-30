import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFavourites } from '../hooks/useFavourites'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MovieGrid from '../components/movie/MovieGrid'
import ProtectedRoute from '../components/ui/ProtectedRoute'
import { useAuth } from '../context/AuthContext'

export default function Favourites() {
  const { user } = useAuth()
  const { favourites, loading, removeFavourite } = useFavourites()

  useEffect(() => {
    document.title = 'My Watchlist — CineVault'
  }, [])

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-cinema-black text-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="rounded-3xl border border-white/10 bg-cinema-dark/95 p-8 shadow-cinema">
            <h1 className="text-3xl font-semibold">My Watchlist</h1>
            <p className="mt-2 text-sm text-cinema-muted">Saved movies for {user?.displayName ?? 'your account'}.</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : favourites.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#111827]/90 p-10 text-center">
              <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
                <div className="h-40 w-40 rounded-3xl bg-white/5" aria-hidden="true" />
                <p className="text-lg font-semibold text-white">No movies saved yet.</p>
                <p className="text-sm text-cinema-muted">Start exploring and add movies to your watchlist.</p>
                <Link
                  to="/"
                  className="rounded-2xl bg-cinema-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-cinema-red-2"
                >
                  Start exploring →
                </Link>
              </div>
            </div>
          ) : (
            <MovieGrid movies={favourites} showRemove onRemove={removeFavourite} />
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}

// ✅ src/pages/Favourites.jsx complete
