import { AnimatePresence, motion } from 'framer-motion'

interface JumpToLatestButtonProps {
  visible: boolean
  onClick: () => void
}

export function JumpToLatestButton({ visible, onClick }: JumpToLatestButtonProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={onClick}
          className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-theme bg-cinema-dark px-3 py-2 text-sm text-cinema-white shadow-lg"
        >
          <span>↓</span>
          <span>Jump to latest</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

// ✅ src/components/chatbot/JumpToLatestButton.tsx complete
