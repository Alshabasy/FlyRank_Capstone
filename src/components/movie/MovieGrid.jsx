import MovieCard from './MovieCard'

export default function MovieGrid({ movies, showRemove, onRemove }) {
  if (!movies || movies.length === 0) {
    return <p className="py-12 text-center text-cinema-muted">No movies available.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} showRemove={showRemove} onRemove={onRemove} />
      ))}
    </div>
  )
}

// ✅ src/components/movie/MovieGrid.jsx complete
