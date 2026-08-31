import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  AbstractChat,
  DefaultChatTransport,
  type ChatInit,
  type ChatStatus,
  type UIMessage,
} from 'ai'
import { getClientSabotageMode } from '../lib/ai-config'
import type { CineBotUIMessage } from '../lib/chat-types'

/** Mutable page context for the active chat request (single ChatPanel instance). */
const activePageContext = { value: undefined as string | undefined }

type ChatErrorKind = 'network' | 'rate-limit' | 'stream' | 'server' | 'unknown'

export type ChatErrorState = {
  kind: ChatErrorKind
  message: string
  retryable: boolean
}

interface UseGeminiChatReturn {
  messages: CineBotUIMessage[]
  status: ChatStatus
  isThinking: boolean
  isStreaming: boolean
  error: ChatErrorState | null
  lastFailedUserText: string | null
  sendMessage: (content: string, pageContext?: string) => Promise<void>
  retryLast: () => Promise<void>
  stopStreaming: () => void
  clearMessages: () => void
  clearError: () => void
}

type StoreSnapshot<UI_MESSAGE extends UIMessage> = {
  messages: UI_MESSAGE[]
  status: ChatStatus
  error: Error | undefined
  version: number
}

class ReactChat<UI_MESSAGE extends UIMessage> extends AbstractChat<UI_MESSAGE> {
  #listeners = new Set<() => void>()
  #getSnapshotInternal: () => StoreSnapshot<UI_MESSAGE>

  constructor(init: ChatInit<UI_MESSAGE>) {
    const listeners = new Set<() => void>()
    let messages = init.messages ?? []
    let status: ChatStatus = 'ready'
    let error: Error | undefined
    let version = 0
    let cached: StoreSnapshot<UI_MESSAGE> = { messages, status, error, version }

    const emit = () => {
      version += 1
      cached = { messages, status, error, version }
      listeners.forEach((listener) => listener())
    }

    const state = {
      get status() {
        return status
      },
      set status(value: ChatStatus) {
        status = value
        emit()
      },
      get error() {
        return error
      },
      set error(value: Error | undefined) {
        error = value
        emit()
      },
      get messages() {
        return messages
      },
      set messages(value: UI_MESSAGE[]) {
        messages = value
        emit()
      },
      pushMessage: (message: UI_MESSAGE) => {
        messages = [...messages, message]
        emit()
      },
      popMessage: () => {
        messages = messages.slice(0, -1)
        emit()
      },
      replaceMessage: (index: number, message: UI_MESSAGE) => {
        messages = messages.map((item, itemIndex) => (itemIndex === index ? message : item))
        emit()
      },
      snapshot: <T,>(value: T) => structuredClone(value),
    }

    super({
      ...init,
      state,
    })

    this.#listeners = listeners
    this.#getSnapshotInternal = () => cached
  }

  subscribe = (listener: () => void) => {
    this.#listeners.add(listener)
    return () => {
      this.#listeners.delete(listener)
    }
  }

  getSnapshot = () => this.#getSnapshotInternal()

  clearAllMessages() {
    this.messages = []
  }
}

function mapError(error: unknown): ChatErrorState {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      kind: 'network',
      message: 'You appear to be offline. Check your connection and try again.',
      retryable: true,
    }
  }

  const text = error instanceof Error ? error.message : String(error ?? '')
  const lower = text.toLowerCase()

  if (lower.includes('429') || lower.includes('rate limit') || lower.includes('too many requests')) {
    return {
      kind: 'rate-limit',
      message: 'Too many requests right now. Please try again in a moment.',
      retryable: true,
    }
  }

  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('offline')) {
    return {
      kind: 'network',
      message: 'We could not reach CineBot. Check your connection and try again.',
      retryable: true,
    }
  }

  if (lower.includes('interrupt') || lower.includes('stream') || lower.includes('sabotage')) {
    return {
      kind: 'stream',
      message: 'The response was interrupted. You can retry your last message.',
      retryable: true,
    }
  }

  return {
    kind: 'unknown',
    message: 'Something went wrong while talking to CineBot. Please try again.',
    retryable: true,
  }
}

export function useGeminiChat(): UseGeminiChatReturn {
  const lastUserTextRef = useRef<string | null>(null)
  const [uiError, setUiError] = useState<ChatErrorState | null>(null)
  const [lastFailedUserText, setLastFailedUserText] = useState<string | null>(null)

  const [chat] = useState(() => {
    return new ReactChat<CineBotUIMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: ({ messages, id, trigger, messageId, body }) => ({
          body: {
            ...body,
            id,
            messages,
            trigger,
            messageId,
            pageContext: activePageContext.value,
            sabotage: getClientSabotageMode() ?? undefined,
          },
        }),
          fetch: async (input, init) => {
            try {
              const response = await fetch(input, init)
              if (response.status === 429) {
                throw new Error('429 Too many requests right now. Please try again in a moment.')
              }
              if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null
                const message =
                  typeof payload?.message === 'string'
                    ? payload.message
                    : `Request failed with status ${response.status}`
                throw new Error(message)
              }
              return response
            } catch (error) {
              if (error instanceof TypeError) {
                throw new Error('Network request failed. You may be offline.', { cause: error })
              }
              throw error
            }
          },
        }),
      onError: (error) => {
        setUiError(mapError(error))
      },
      onFinish: ({ isAbort, isDisconnect, isError }) => {
        if (isAbort) {
          setUiError(null)
          return
        }
        if (isDisconnect || isError) {
          setUiError(mapError(new Error(isDisconnect ? 'stream disconnect' : 'stream error')))
        }
      },
    })
  })

  const snapshot = useSyncExternalStore(chat.subscribe, chat.getSnapshot, chat.getSnapshot)

  const hasFirstToken = useMemo(() => {
    const last = snapshot.messages[snapshot.messages.length - 1]
    if (!last || last.role !== 'assistant') return false
    return last.parts.some((part) => {
      if (part.type === 'text') return part.text.trim().length > 0
      if (part.type.startsWith('tool-')) return true
      return false
    })
  }, [snapshot.messages])

  const sendMessage = useCallback(
    async (content: string, pageContext?: string) => {
      const trimmed = content.trim()
      if (!trimmed) return
      if (snapshot.status === 'streaming' || snapshot.status === 'submitted') return

      activePageContext.value = pageContext
      lastUserTextRef.current = trimmed
      setLastFailedUserText(trimmed)
      setUiError(null)

      try {
        await chat.sendMessage({ text: trimmed })
      } catch (error) {
        setUiError(mapError(error))
      }
    },
    [chat, snapshot.status, setLastFailedUserText, setUiError],
  )

  const retryLast = useCallback(async () => {
    if (snapshot.status === 'streaming' || snapshot.status === 'submitted') return

    const failedText = lastUserTextRef.current
    setUiError(null)

    try {
      // Prefer regenerating the failed assistant turn when possible
      const lastAssistant = [...snapshot.messages].reverse().find((message) => message.role === 'assistant')
      if (lastAssistant && (chat.error || snapshot.status === 'error' || uiError)) {
        await chat.regenerate({ messageId: lastAssistant.id })
        return
      }

      if (failedText) {
        await chat.sendMessage({ text: failedText })
      }
    } catch (error) {
      setUiError(mapError(error))
    }
  }, [chat, snapshot.messages, snapshot.status, uiError, setUiError])

  const stopStreaming = useCallback(() => {
    void chat.stop()
    setUiError(null)
  }, [chat, setUiError])

  const clearMessages = useCallback(() => {
    void chat.stop()
    chat.clearAllMessages()
    lastUserTextRef.current = null
    setLastFailedUserText(null)
    setUiError(null)
  }, [chat, setLastFailedUserText, setUiError])

  const clearError = useCallback(() => {
    chat.clearError()
    setUiError(null)
  }, [chat, setUiError])

  const isStreaming = snapshot.status === 'streaming'
  const isThinking = snapshot.status === 'submitted' || (isStreaming && !hasFirstToken)

  return useMemo(
    () => ({
      messages: snapshot.messages,
      status: snapshot.status,
      isThinking,
      isStreaming,
      error: uiError,
      lastFailedUserText,
      sendMessage,
      retryLast,
      stopStreaming,
      clearMessages,
      clearError,
    }),
    [
      clearError,
      clearMessages,
      isStreaming,
      isThinking,
      lastFailedUserText,
      retryLast,
      sendMessage,
      snapshot.messages,
      snapshot.status,
      stopStreaming,
      uiError,
    ],
  )
}
