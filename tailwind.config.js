export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cinema-black': '#08080f',
        'cinema-dark': '#111827',
        'cinema-red': '#e50914',
        'cinema-red-2': '#b91c1c',
        'cinema-blue': '#1d4ed8',
        'cinema-blue-2': '#1e40af',
        'cinema-white': '#f8fafc',
        'cinema-muted': '#94a3b8',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, transparent 40%, #08080f 100%)',
        'card-gradient': 'linear-gradient(to top, #08080f 0%, transparent 60%)',
        'red-blue': 'linear-gradient(135deg, #e50914 0%, #1d4ed8 100%)',
        'nav-gradient': 'linear-gradient(to bottom, #08080f 0%, transparent 100%)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cinema: '0 20px 50px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
