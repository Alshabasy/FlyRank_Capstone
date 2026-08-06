import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RiSendPlaneLine, RiStopCircleLine } from 'react-icons/ri'

interface ChatInputProps {
  onSend: (content: string, pageContext?: string) => Promise<void>
  onStop: () => void
  isStreaming: boolean
  isThinking: boolean
  disabled?: boolean
  pageContext?: string
}

export function ChatInput({ onSend, onStop, isStreaming, isThinking, disabled = false, pageContext }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) {
      return
    }

    setValue('')
    await onSend(trimmed, pageContext)
    textareaRef.current?.focus()
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSubmit()
    }
  }

  useEffect(() => {
    textareaRef.current?.focus()
  }, [disabled])

  return (
    <div className="border-t border-white/10 bg-cinema-dark/90 p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about any movie..."
        disabled={disabled}
        aria-label="Message CineBot"
        className="min-h-[48px] w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cinema-white outline-none placeholder:text-cinema-muted focus:border-cinema-blue"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className={`text-xs text-cinema-muted ${value.length > 800 ? 'block' : 'hidden'}`}>{value.length} / 1000</p>
        {isStreaming || isThinking ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={onStop}
            aria-label="Stop generating"
            className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400"
          >
            <RiStopCircleLine size={16} />
            <span>Stop</span>
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={handleSubmit}
            aria-label="Send message"
            disabled={disabled || !value.trim()}
            className="flex items-center gap-2 rounded-full bg-cinema-red px-3 py-2 text-sm font-medium text-cinema-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RiSendPlaneLine size={16} />
            <span>Send</span>
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ✅ src/components/chatbot/ChatInput.tsx complete
