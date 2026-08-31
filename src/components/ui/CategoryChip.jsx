export default function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none ${
        active
          ? 'bg-cinema-red text-cinema-white border-transparent'
          : 'border-cinema-dark text-cinema-muted hover:border-cinema-white/20 hover:text-cinema-white'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

// ✅ src/components/ui/CategoryChip.jsx complete
