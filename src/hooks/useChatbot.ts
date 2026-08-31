import { useContext } from 'react'
import { ChatbotContext } from '../context/chatbot-context'

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
