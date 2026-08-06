import { streamText } from 'ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getChatModel, getFallbackResponse, SYSTEM_PROMPT, type ChatMessage, type ChatState } from '../lib/gemini'

interface UseGeminiChatReturn {
  messages: ChatMessage[]
  isThinking: boolean
  isStreaming: boolean
  error: string | null
  sendMessage: (content: string, pageContext?: string) => Promise<void>
  stopStreaming: () => void
  clearMessages: () => void
}

const initialState: ChatState = {
  messages: [],
  isThinking: false,
  isStreaming: false,
  error: null,
}

export function useGeminiChat(): UseGeminiChatReturn {
  const [state, setState] = useState<ChatState>(initialState)
  const abortControllerRef = useRef<AbortController | null>(null)

  const appendAssistantMessage = useCallback((content: string) => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          timestamp: new Date(),
          isStreaming: true,
        },
      ],
    }))
  }, [])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setState((prev) => ({
      ...prev,
      isStreaming: false,
      isThinking: false,
    }))
  }, [])

  const clearMessages = useCallback(() => {
    abortControllerRef.current?.abort()
    setState(initialState)
  }, [])

  const sendMessage = useCallback(async (content: string, pageContext?: string) => {
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      return
    }

    const promptWithContext = pageContext
      ? `[Context: User is currently on the ${pageContext} page]\n${trimmedContent}`
      : trimmedContent

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedContent,
      timestamp: new Date(),
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isThinking: true,
      isStreaming: false,
      error: null,
    }))

    appendAssistantMessage('')

    try {
      const model = getChatModel()
      if (!model) {
        setState((prev) => ({
          ...prev,
          isThinking: false,
          isStreaming: false,
          error: 'CineBot is not configured. Add VITE_AI_API_KEY to .env',
          messages: prev.messages.filter((message) => message.role !== 'assistant' || message.content !== ''),
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        isThinking: false,
        isStreaming: true,
      }))

      const result = streamText({
        model,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: promptWithContext }],
        abortSignal: controller.signal,
      })

      let streamedContent = ''

      for await (const delta of result.textStream) {
        if (controller.signal.aborted) {
          break
        }

        streamedContent += delta

        setState((prev) => {
          const updated = [...prev.messages]
          const last = updated[updated.length - 1]
          if (last?.role === 'assistant') {
            last.content = streamedContent
            last.isStreaming = true
          }
          return {
            ...prev,
            messages: updated,
            isThinking: false,
            isStreaming: true,
          }
        })
      }

      if (!controller.signal.aborted) {
        setState((prev) => {
          const updated = [...prev.messages]
          const last = updated[updated.length - 1]
          if (last?.role === 'assistant') {
            last.content = streamedContent
            last.isStreaming = false
          }
          return {
            ...prev,
            messages: updated,
            isStreaming: false,
            isThinking: false,
          }
        })
      }

      if (!controller.signal.aborted) {
        setState((prev) => {
          const updated = [...prev.messages]
          const last = updated[updated.length - 1]
          if (last?.role === 'assistant') {
            last.isStreaming = false
          }
          return {
            ...prev,
            messages: updated,
            isStreaming: false,
            isThinking: false,
          }
        })
      }
    } catch (error) {
      if (controller.signal.aborted) {
        setState((prev) => ({
          ...prev,
          isThinking: false,
          isStreaming: false,
        }))
        return
      }

      const fallbackReply = getFallbackResponse(trimmedContent, pageContext)
      setState((prev) => {
        const updated = [...prev.messages]
        const last = updated[updated.length - 1]
        if (last?.role === 'assistant') {
          last.content = fallbackReply
          last.isStreaming = false
        }

        return {
          ...prev,
          messages: updated,
          isThinking: false,
          isStreaming: false,
          error: null,
        }
      })
    }
  }, [appendAssistantMessage, state.messages])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return useMemo(
    () => ({
      messages: state.messages,
      isThinking: state.isThinking,
      isStreaming: state.isStreaming,
      error: state.error,
      sendMessage,
      stopStreaming,
      clearMessages,
    }),
    [clearMessages, sendMessage, state.error, state.isStreaming, state.isThinking, state.messages, stopStreaming],
  )
}

// ✅ src/hooks/useGeminiChat.ts complete
