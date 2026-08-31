export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-12 w-12 rounded-full border-4 border-theme border-t-cinema-red animate-spin" aria-label="Loading"></div>
    </div>
  )
}

// ✅ src/components/ui/LoadingSpinner.jsx complete
