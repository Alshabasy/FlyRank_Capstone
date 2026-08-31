import { useId } from 'react'
import { motion } from 'framer-motion'
import { RiRobot2Line } from 'react-icons/ri'
import type { CineBotUIMessage } from '../../lib/chat-types'
import { SearchMoviesToolView } from './SearchMoviesToolView'
import { MovieDetailsToolView } from './MovieDetailsToolView'

interface ChatMessageProps {
  message: CineBotUIMessage
  isStreaming?: boolean
  onRetryTool?: () => void
  onTryExample?: (prompt: string) => void
  onDismissChat?: () => void
  retryDisabled?: boolean
}

function formatTime(date: Date | number | string | undefined) {
  const value = date instanceof Date ? date : new Date()
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function renderText(content: string, baseId: string) {
  const lines = content.split('\n')

  return lines.map((line, index) => {
    const lineId = `${baseId}-l${index}`
    if (line.startsWith('•')) {
      return (
        <div key={lineId} className="ml-3 mt-1 list-disc text-sm leading-6">
          {line.replace('•', '')}
        </div>
      )
    }

    const parts = line.split(/(\*\*.*?\*\*)/g)
    return (
      <div key={lineId} className="text-sm leading-6">
        {parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`${lineId}-p${partIndex}`}>{part.slice(2, -2)}</strong>
          }
          return <span key={`${lineId}-p${partIndex}`}>{part}</span>
        })}
      </div>
    )
  })
}

export function ChatMessage({
  message,
  isStreaming = false,
  onRetryTool,
  onTryExample,
  onDismissChat,
  retryDisabled = false,
}: ChatMessageProps) {
  const stableId = useId()
  const isUser = message.role === 'user'
  const textParts = message.parts.filter((part) => part.type === 'text')
  const toolSearchParts = message.parts.filter((part) => part.type === 'tool-searchMovies')
  const toolDetailsParts = message.parts.filter((part) => part.type === 'tool-getMovieDetails')
  const combinedText = textParts.map((part) => (part.type === 'text' ? part.text : '')).join('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser ? (
        <div className="mr-2 mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-cinema-red/20 text-cinema-red">
          <RiRobot2Line size={16} />
        </div>
      ) : null}

      <div className={`max-w-[min(100%,20rem)] ${isUser ? 'text-right' : 'text-left'}`}>
        {combinedText || isUser ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              isUser
                ? 'bg-gradient-to-r from-cinema-red to-cinema-blue text-cinema-white'
                : 'border border-white/10 bg-white/5 text-cinema-white'
            }`}
            style={isUser ? { borderRadius: '16px 16px 4px 16px' } : { borderRadius: '16px 16px 16px 4px' }}
          >
            {renderText(combinedText || (isStreaming ? '' : '...'), stableId)}
            {isStreaming && !isUser ? (
              <span className="ml-1 inline-block h-4 w-2 animate-[blink_1s_step-end_infinite] bg-cinema-white" />
            ) : null}
          </div>
        ) : null}

        {!isUser ? (
          <>
            {toolSearchParts.map((part) =>
              part.type === 'tool-searchMovies' ? (
                <SearchMoviesToolView
                  key={part.toolCallId}
                  part={part}
                  onRetry={onRetryTool}
                  onTryExample={onTryExample}
                  onDismissChat={onDismissChat}
                  retryDisabled={retryDisabled}
                />
              ) : null,
            )}
            {toolDetailsParts.map((part) =>
              part.type === 'tool-getMovieDetails' ? (
                <MovieDetailsToolView
                  key={part.toolCallId}
                  part={part}
                  onRetry={onRetryTool}
                  onDismissChat={onDismissChat}
                  retryDisabled={retryDisabled}
                />
              ) : null,
            )}
          </>
        ) : null}

        <p className="mt-1 text-xs text-cinema-muted">{formatTime(undefined)}</p>
      </div>
    </motion.div>
  )
}
