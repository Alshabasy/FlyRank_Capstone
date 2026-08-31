import { useEffect, useRef, useState } from 'react'
import { BrainButton } from '../ui/BrainButton'

const MAX_INPUT_LENGTH = 1500

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

  const tooLong = value.length > MAX_INPUT_LENGTH
  const isOverSoftLimit = value.length > MAX_INPUT_LENGTH * 0.8

  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || tooLong) {
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
    <div className="border-t border-theme bg-cinema-dark/90 p-3">
      <textarea
        ref={textareaRef}
        value={value}
        maxLength={MAX_INPUT_LENGTH}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about any movie..."
        disabled={disabled}
        aria-label="Message CineBot"
        aria-invalid={tooLong}
        className={`min-h-[48px] w-full resize-none rounded-xl border bg-glass px-4 py-3 text-sm text-cinema-white outline-none placeholder:text-cinema-muted transition-all ${
          tooLong
            ? 'border-cinema-red focus:border-cinema-red focus:ring-2 focus:ring-cinema-red/40'
            : 'border-theme focus:border-cinema-blue focus:ring-2 focus:ring-cinema-blue/40'
        }`}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className={`text-xs ${tooLong ? 'text-cinema-red' : isOverSoftLimit ? 'text-cinema-muted' : 'text-cinema-muted/70'}`}>
          {value.length} / {MAX_INPUT_LENGTH}
        </p>
        <div className="ml-auto">
          {isStreaming || isThinking ? (
            <BrainButton
              actionType="stop"
              onClick={onStop}
              variant="danger"
              aria-label="Stop generating response"
            />
          ) : (
            <BrainButton
              actionType="send"
              onClick={handleSubmit}
              disabled={disabled || !value.trim() || tooLong}
              variant="primary"
              aria-label="Send message to CineBot"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ✅ src/components/chatbot/ChatInput.tsx complete
