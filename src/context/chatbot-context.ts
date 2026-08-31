import { createContext } from 'react'

export interface ChatbotContextValue {
  isOpen: boolean
  toggleChat: () => void
  closeChat: () => void
}

export const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined)
