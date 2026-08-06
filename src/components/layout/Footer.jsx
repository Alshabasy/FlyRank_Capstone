import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-cinema-dark px-4 py-8 text-center text-sm text-cinema-muted sm:px-6">
      <p className="mb-2">© {new Date().getFullYear()} CineVault</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="transition hover:text-white">
          Home
        </Link>
        <Link to="/categories" className="transition hover:text-white">
          Categories
        </Link>
        <Link to="/favourites" className="transition hover:text-white">
          Favourites
        </Link>
      </div>
    </footer>
  )
}

// ✅ src/components/layout/Footer.jsx complete
