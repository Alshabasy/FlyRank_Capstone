import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { RiCloseLine, RiDeleteBin6Line, RiRobot2Line } from 'react-icons/ri'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useGeminiChat } from '../../hooks/useGeminiChat'
import { useChatbot } from '../../context/ChatbotContext'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'
import { JumpToLatestButton } from './JumpToLatestButton'
import { ThinkingIndicator } from './ThinkingIndicator'

function getPageContext(pathname: string) {
  if (pathname === '/') return 'Home (browsing trending movies)'
  if (pathname === '/categories') return 'Categories (browsing movies by genre)'
  if (pathname === '/favourites') return 'Favourites (viewing saved watchlist)'
  if (pathname.startsWith('/movie/')) return 'Movie Detail page'
  return 'the app'
}

export function ChatPanel() {
  const location = useLocation()
  const { isOpen, closeChat } = useChatbot()
  const { messages, isThinking, isStreaming, error, sendMessage, stopStreaming, clearMessages } = useGeminiChat()
  const { scrollRef, showJumpButton, isNearBottom, scrollToBottom } = useAutoScroll()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const pageContext = useMemo(() => getPageContext(location.pathname), [location.pathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeChat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeChat, isOpen])

  useEffect(() => {
    if (isOpen && isNearBottom) {
      scrollToBottom()
    }
  }, [isNearBottom, isOpen, messages, scrollToBottom])

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !panelRef.current) {
      return
    }

    const focusable = panelRef.current.querySelectorAll<HTMLElement>('button, textarea, [href]')
    const first = focusable[0]
    if (first) {
      first.focus()
    }
  }, [isOpen])

  const handleSend = async (content: string) => {
    await sendMessage(content, pageContext)
  }

  const hasApiKey = Boolean((import.meta.env.VITE_AI_API_KEY?.trim() || import.meta.env.VITE_OPENROUTER_API_KEY?.trim()))

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 z-40 flex w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[16px] border border-white/10 bg-cinema-dark shadow-[0_25px_60px_rgba(0,0,0,0.6)] md:w-[380px]"
          style={{ height: 'min(560px, 70vh)' }}
          role="dialog"
          aria-label="CineBot chat panel"
          aria-modal="true"
          ref={panelRef}
        >
          <div className="flex items-start justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cinema-red/20 text-cinema-red">
                  <RiRobot2Line size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cinema-white">CineBot</p>
                  <p className="text-xs text-cinema-muted">Your AI movie expert</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearMessages}
                aria-label="Clear chat"
                className="rounded-full p-2 text-cinema-muted transition hover:bg-white/10 hover:text-cinema-white"
              >
                <RiDeleteBin6Line size={16} />
              </button>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                className="rounded-full p-2 text-cinema-muted transition hover:bg-white/10 hover:text-cinema-white"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          </div>

          {!hasApiKey ? (
            <div className="border-b border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              CineBot is not configured. Add VITE_AI_API_KEY to .env
            </div>
          ) : null}

          <div className="relative flex-1 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-y-auto px-3 py-3" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cinema-red to-cinema-blue text-cinema-white">
                    <RiRobot2Line size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-cinema-white">Hey! I&apos;m CineBot 🎬</h3>
                  <p className="mt-2 text-sm text-cinema-muted">
                    Ask me anything about movies — recommendations, ratings, plot questions, or hidden gems.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Recommend me a thriller', 'Best movies of 2024', 'Movies similar to Interstellar'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void handleSend(suggestion)}
                        className="rounded-full border border-cinema-blue/40 bg-cinema-blue/10 px-3 py-1 text-sm text-cinema-blue"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pb-20">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              )}
              {error ? (
                <div className="mb-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages()
                    }}
                    className="mt-2 rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-200"
                  >
                    Try again
                  </button>
                </div>
              ) : null}
              <ThinkingIndicator visible={isThinking} />
            </div>
            <JumpToLatestButton visible={showJumpButton} onClick={scrollToBottom} />
          </div>

          <ChatInput
            onSend={handleSend}
            onStop={stopStreaming}
            isStreaming={isStreaming}
            isThinking={isThinking}
            disabled={!hasApiKey}
            pageContext={pageContext}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

// ✅ src/components/chatbot/ChatPanel.tsx complete
