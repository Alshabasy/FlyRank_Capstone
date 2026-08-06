const BASE_URL = `${(import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com').replace('http://', 'https://')}/?apikey=${import.meta.env.VITE_OMDB_API_KEY}`

async function fetchOmdb(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.Response === 'False') {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export async function searchMovies(query) {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return []
  }

  const lowerQuery = trimmedQuery.toLowerCase()
  const results = []
  const seen = new Set()

  const addMatches = (movies) => {
    for (const movie of movies) {
      if (!movie?.Title) continue
      const title = movie.Title.toLowerCase()
      const matchesQuery = title.includes(lowerQuery)
      const matchesCharacter = lowerQuery.split('').some((char) => char.trim() && title.includes(char))
      if ((matchesQuery || matchesCharacter) && !seen.has(movie.imdbID)) {
        seen.add(movie.imdbID)
        results.push(movie)
      }
      if (results.length >= 10) {
        break
      }
    }
  }

  const searchTerms = Array.from(new Set([trimmedQuery, ...trimmedQuery.split('').filter((char) => char.trim().length > 0)]))

  for (const term of searchTerms) {
    if (results.length >= 10) break
    const data = await fetchOmdb(`${BASE_URL}&s=${encodeURIComponent(term)}&type=movie`)
    addMatches(data?.Search ?? [])
  }

  return results.slice(0, 10)
}

export async function getMovieById(imdbID) {
  if (!imdbID) {
    return null
  }

  const url = `${BASE_URL}&i=${encodeURIComponent(imdbID)}&type=movie&plot=full`
  return await fetchOmdb(url)
}

export async function getMoviesByGenre(genre, page = 1) {
  if (!genre) {
    return []
  }

  const url = `${BASE_URL}&s=${encodeURIComponent(genre)}&type=movie&page=${page}`
  const data = await fetchOmdb(url)

  return data?.Search ?? []
}

export async function getTrendingMovies() {
  const results = []

  for (const title of ['Inception', 'Interstellar', 'The Dark Knight', 'Dune', 'Oppenheimer']) {
    const url = `${BASE_URL}&t=${encodeURIComponent(title)}&type=movie`
    const data = await fetchOmdb(url)
    if (data) {
      results.push(data)
    }
  }

  return results
}

// ✅ src/utils/omdb.js complete
