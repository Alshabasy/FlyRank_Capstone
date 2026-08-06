import { createContext, useContext, useMemo, useState } from 'react'

interface ChatbotContextValue {
  isOpen: boolean
  toggleChat: () => void
  closeChat: () => void
}

const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined)

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => setIsOpen((prev) => !prev)
  const closeChat = () => setIsOpen(false)

  const value = useMemo(() => ({ isOpen, toggleChat, closeChat }), [isOpen])

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}

// ✅ src/context/ChatbotContext.tsx complete
