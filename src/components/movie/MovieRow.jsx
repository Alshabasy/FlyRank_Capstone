import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'

export default function MovieRow({ title, movies, linkTo, savedIds = new Set(), onToggleFavourite }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <Link to={linkTo} className="text-sm font-medium text-cinema-blue transition hover:text-cinema-blue-2">
          See All →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <motion.div key={movie.imdbID} whileHover={{ y: -6 }} className="min-w-[220px] max-w-[220px] flex-shrink-0">
            <MovieCard
              movie={movie}
              saved={savedIds.has(movie.imdbID)}
              onToggleFavourite={onToggleFavourite}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ✅ src/components/movie/MovieRow.jsx complete
