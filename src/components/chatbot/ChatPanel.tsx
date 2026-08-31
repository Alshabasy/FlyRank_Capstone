import { useEffect, useMemo, useRef, useState } from 'react'
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

const EXAMPLE_PROMPTS = [
  'Dark psychological thrillers from the last 10 years',
  'Family movies tonight, nothing violent',
  'Like Interstellar but less complicated',
  '80s action classics with high ratings',
]

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
  const {
    messages,
    isThinking,
    isStreaming,
    error,
    sendMessage,
    retryLast,
    stopStreaming,
    clearMessages,
    status,
  } = useGeminiChat()
  const { scrollRef, showJumpButton, isNearBottom, scrollToBottom } = useAutoScroll()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [emptyFeedback, setEmptyFeedback] = useState<string | null>(null)

  const pageContext = useMemo(() => getPageContext(location.pathname), [location.pathname])
  const busy = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChat()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeChat, isOpen])

  useEffect(() => {
    if (isOpen && isNearBottom) {
      scrollToBottom()
    }
  }, [isNearBottom, isOpen, messages, isThinking, isStreaming, scrollToBottom])

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>('button, textarea, [href]')
    focusable[0]?.focus()
  }, [isOpen])

  const handleSend = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) {
      setEmptyFeedback('Type a movie question before sending.')
      return
    }
    setEmptyFeedback(null)
    await sendMessage(trimmed, pageContext)
  }

  const lastMessage = messages[messages.length - 1]
  const lastIsStreaming = Boolean(isStreaming && lastMessage?.role === 'assistant')

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-3 z-40 flex w-[calc(100vw-1.5rem)] max-w-[380px] flex-col overflow-hidden rounded-[16px] border border-white/10 bg-cinema-dark shadow-[0_25px_60px_rgba(0,0,0,0.6)] sm:right-6"
          style={{ height: 'min(560px, calc(100dvh - 7rem))' }}
          role="dialog"
          aria-label="CineBot chat panel"
          aria-modal="true"
          ref={panelRef}
        >
          <div className="flex items-start justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cinema-red/20 text-cinema-red">
                <RiRobot2Line size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-cinema-white">CineBot</p>
                <p className="text-xs text-cinema-muted">Your AI movie expert</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearMessages}
                aria-label="Clear chat"
                className="rounded-full p-2 text-cinema-muted transition hover:bg-white/10 hover:text-cinema-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
              >
                <RiDeleteBin6Line size={16} />
              </button>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                className="rounded-full p-2 text-cinema-muted transition hover:bg-white/10 hover:text-cinema-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div
              ref={scrollRef}
              className="h-full overflow-y-auto overscroll-contain px-3 py-3"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cinema-red to-cinema-blue text-cinema-white">
                    <RiRobot2Line size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-cinema-white">Hey! I&apos;m CineBot</h3>
                  <p className="mt-2 text-sm text-cinema-muted">
                    Ask me to find real movies, or tap an example to get started.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {EXAMPLE_PROMPTS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void handleSend(suggestion)}
                        className="rounded-full border border-cinema-blue/40 bg-cinema-blue/10 px-3 py-1 text-sm text-cinema-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pb-20">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isStreaming={lastIsStreaming && index === messages.length - 1}
                      onRetryTool={() => void retryLast()}
                      onTryExample={(prompt) => void handleSend(prompt)}
                      onDismissChat={closeChat}
                      retryDisabled={busy}
                    />
                  ))}
                </div>
              )}

              {error ? (
                <div className="mb-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200" role="alert">
                  <p>{error.message}</p>
                  {error.retryable ? (
                    <button
                      type="button"
                      onClick={() => void retryLast()}
                      disabled={busy}
                      aria-label="Retry last message"
                      className="mt-2 rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              ) : null}

              {emptyFeedback ? (
                <p className="mb-2 text-center text-xs text-cinema-muted" role="status">
                  {emptyFeedback}
                </p>
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
            disabled={false}
            pageContext={pageContext}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
