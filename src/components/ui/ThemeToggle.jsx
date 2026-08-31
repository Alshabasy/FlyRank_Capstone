import { RiMoonLine, RiSunLine } from 'react-icons/ri'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-glass text-cinema-white transition hover:border-cinema-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-red ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <RiSunLine className="h-5 w-5" aria-hidden="true" /> : <RiMoonLine className="h-5 w-5" aria-hidden="true" />}
    </button>
  )
}
