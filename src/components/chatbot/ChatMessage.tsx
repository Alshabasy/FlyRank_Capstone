import { motion } from 'framer-motion'
import { RiRobot2Line } from 'react-icons/ri'
import type { ChatMessage as ChatMessageType } from '../../lib/gemini'

interface ChatMessageProps {
  message: ChatMessageType
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function renderContent(content: string) {
  const lines = content.split('\n')

  return lines.map((line, index) => {
    if (line.startsWith('•')) {
      return (
        <div key={`${line}-${index}`} className="ml-3 mt-1 list-disc text-sm leading-6">
          {line.replace('•', '')}
        </div>
      )
    }

    const withBold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return (
      <div key={`${line}-${index}`} className="text-sm leading-6">
        <span dangerouslySetInnerHTML={{ __html: withBold }} />
      </div>
    )
  })
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser ? (
        <div className="mr-2 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-cinema-red/20 text-cinema-red">
          <RiRobot2Line size={16} />
        </div>
      ) : null}

      <div className={`max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${isUser
            ? 'bg-gradient-to-r from-cinema-red to-cinema-blue text-cinema-white'
            : 'border border-white/10 bg-white/5 text-cinema-white'}`}
          style={isUser ? { borderRadius: '16px 16px 4px 16px' } : { borderRadius: '16px 16px 16px 4px' }}
        >
          {renderContent(message.content || '...')}
          {message.isStreaming ? <span className="ml-1 inline-block h-4 w-2 animate-[blink_1s_step-end_infinite] bg-cinema-white" /> : null}
        </div>
        <p className="mt-1 text-xs text-cinema-muted">{formatTime(message.timestamp)}</p>
      </div>
    </motion.div>
  )
}

// ✅ src/components/chatbot/ChatMessage.tsx complete
