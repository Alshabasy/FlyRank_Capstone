import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { MovieSearchResults } from '../MovieSearchResults'

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('MovieSearchResults Component', () => {
  it('renders valid movie hits list', () => {
    const movies = [
      {
        imdbId: 'tt0068646',
        title: 'The Godfather',
        year: '1972',
        poster: 'https://example.com/godfather.jpg',
        type: 'movie',
      },
      {
        imdbId: 'tt0111161',
        title: 'The Shawshank Redemption',
        year: '1994',
        poster: 'https://example.com/shawshank.jpg',
        type: 'movie',
      },
    ]

    renderWithRouter(<MovieSearchResults movies={movies} totalResults={2} query="classic" />)

    expect(screen.getByRole('region', { name: /movie search results/i })).toBeInTheDocument()
    expect(screen.getByText('The Godfather')).toBeInTheDocument()
    expect(screen.getByText('1972')).toBeInTheDocument()
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    expect(screen.getByText('1994')).toBeInTheDocument()
  })

  it('renders empty result message when no movies are returned', () => {
    renderWithRouter(<MovieSearchResults movies={[]} totalResults={0} query="nonexistentmovie123" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/no movies found/i)).toBeInTheDocument()
  })

  it('handles missing poster gracefully', () => {
    const movies = [
      {
        imdbId: 'tt9999999',
        title: 'Unknown Title',
        year: '2024',
        poster: null,
        type: 'movie',
      },
    ]

    renderWithRouter(<MovieSearchResults movies={movies} totalResults={1} query="unknown" />)

    expect(screen.getByText('Unknown Title')).toBeInTheDocument()
    expect(screen.getByLabelText(/open details for unknown title/i)).toBeInTheDocument()
  })
})
