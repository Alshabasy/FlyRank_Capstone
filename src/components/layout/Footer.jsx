import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-cinema-dark px-4 py-8 text-center text-sm text-cinema-muted sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} CineVault — All Rights Reserved.</p>
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-6">
          <Link to="/" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red rounded px-1">
            Home
          </Link>
          <Link to="/categories" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red rounded px-1">
            Categories
          </Link>
          <Link to="/favourites" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red rounded px-1">
            Favourites
          </Link>
          <Link to="/demo" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red rounded px-1">
            Demo Showcase
          </Link>
        </nav>
      </div>
    </footer>
  )
}
