import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BiMenu, BiX } from 'react-icons/bi'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../ui/SearchBar'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Favourites', to: '/favourites' },
  { label: 'Demo Showcase', to: '/demo' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = useMemo(() => {
    if (!user?.displayName) return 'CV'
    return user.displayName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [user])

  return (
    <header className={`sticky top-0 z-40 border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent)] backdrop-blur-2xl transition ${
      scrolled ? 'bg-cinema-dark/95 shadow-xl' : 'bg-nav-gradient'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red rounded-lg" aria-label="CineVault Homepage">
          <span>🎬</span>
          <span>
            <span className="font-normal">Cine</span>
            <span className="text-cinema-red">Vault</span>
          </span>
        </Link>

        <nav aria-label="Main Navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-red rounded-md px-1 py-0.5 ${
                  isActive ? 'text-cinema-red underline decoration-cinema-red underline-offset-4' : 'text-white hover:text-cinema-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <SearchBar />
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cinema-red text-sm font-semibold text-white"
                aria-label="Open user menu"
              >
                {initials}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-3xl border border-white/10 bg-cinema-dark p-3 shadow-cinema"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false)
                        navigate('/favourites')
                      }}
                      className="w-full rounded-2xl px-3 py-2 text-left text-sm text-white transition hover:bg-white/5"
                    >
                      My Watchlist
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout()
                        setDropdownOpen(false)
                      }}
                      className="mt-2 w-full rounded-2xl px-3 py-2 text-left text-sm text-white transition hover:bg-white/5"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-2xl bg-cinema-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-cinema-blue-2"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cinema-dark text-white md:hidden"
          onClick={() => setOpenMenu(true)}
          aria-label="Open menu"
        >
          <BiMenu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-50 bg-cinema-dark/95 px-6 py-8 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="text-lg font-semibold text-white">
                CineVault
              </Link>
              <button type="button" onClick={() => setOpenMenu(false)} aria-label="Close menu" className="text-white">
                <BiX className="h-8 w-8" />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenMenu(false)}
                  className="block rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-base font-medium text-white transition hover:border-cinema-red"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <div className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-4">
                <SearchBar />
              </div>
            </div>

            <div className="mt-6">
              {user ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/favourites')
                      setOpenMenu(false)
                    }}
                    className="w-full rounded-2xl bg-cinema-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-cinema-red-2"
                  >
                    My Watchlist
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout()
                      setOpenMenu(false)
                    }}
                    className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-cinema-blue"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpenMenu(false)}
                  className="block rounded-2xl bg-cinema-blue px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cinema-blue-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ✅ src/components/layout/Navbar.jsx complete
