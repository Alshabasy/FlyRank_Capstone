export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cinema-black': 'var(--color-background)',
        'cinema-dark': 'var(--color-surface)',
        'cinema-surface-2': 'var(--color-secondary-surface)',
        'cinema-red': 'var(--color-primary-accent)',
        'cinema-red-2': 'var(--color-primary-accent-hover)',
        'cinema-blue': 'var(--color-primary-accent)',
        'cinema-blue-2': 'var(--color-primary-accent-hover)',
        'cinema-white': 'var(--color-primary-text)',
        'cinema-muted': 'var(--color-secondary-text)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, transparent 40%, var(--color-background) 100%)',
        'card-gradient': 'linear-gradient(to top, var(--color-background) 0%, transparent 60%)',
        'red-blue': 'linear-gradient(135deg, var(--color-primary-accent) 0%, var(--color-secondary-surface) 100%)',
        'nav-gradient': 'linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cinema: '0 20px 50px rgb(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [],
}
