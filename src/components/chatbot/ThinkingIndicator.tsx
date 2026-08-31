import { AnimatePresence, motion } from 'framer-motion'

interface ThinkingIndicatorProps {
  visible: boolean
}

export function ThinkingIndicator({ visible }: ThinkingIndicatorProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="mx-4 mb-3 max-w-[85%] rounded-2xl border border-theme bg-glass px-4 py-3"
        >
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-2.5 w-2.5 rounded-full bg-cinema-red"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: index * 0.15 }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-cinema-muted">CineBot is thinking...</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

// ✅ src/components/chatbot/ThinkingIndicator.tsx complete
