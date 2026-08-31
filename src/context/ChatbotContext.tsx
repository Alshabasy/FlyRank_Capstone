import { useMemo, useState } from 'react'
import { ChatbotContext } from './chatbot-context'

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => setIsOpen((prev) => !prev)
  const closeChat = () => setIsOpen(false)

  const value = useMemo(() => ({ isOpen, toggleChat, closeChat }), [isOpen])

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
}
