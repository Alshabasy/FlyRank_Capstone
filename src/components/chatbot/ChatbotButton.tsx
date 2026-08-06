import { AnimatePresence, motion } from 'framer-motion'
import { RiCloseLine, RiRobot2Line } from 'react-icons/ri'
import { useChatbot } from '../../context/ChatbotContext'
import { useGeminiChat } from '../../hooks/useGeminiChat'

export function ChatbotButton() {
  const { isOpen, toggleChat } = useChatbot()
  const { messages } = useGeminiChat()

  const hasMessages = messages.length > 0 && !isOpen

  return (
    <motion.button
      type="button"
      onClick={toggleChat}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open CineBot chat assistant"
      data-cursor="hover"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cinema-red to-cinema-blue shadow-[0_16px_45px_rgba(229,9,20,0.35)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span key="close" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
            <RiCloseLine size={24} className="text-cinema-white" />
          </motion.span>
        ) : (
          <motion.span key="bot" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
            <RiRobot2Line size={24} className="text-cinema-white" />
          </motion.span>
        )}
      </AnimatePresence>
      {!isOpen && hasMessages ? (
        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
      ) : null}
    </motion.button>
  )
}

// ✅ src/components/chatbot/ChatbotButton.tsx complete
