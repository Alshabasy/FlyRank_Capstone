import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChatMessage } from '../ChatMessage'
import type { CineBotUIMessage } from '../../../lib/chat-types'
import { MemoryRouter } from 'react-router-dom'

describe('ChatMessage Component', () => {
  it('renders user message correctly', () => {
    const userMessage: CineBotUIMessage = {
      id: 'msg-1',
      role: 'user',
      parts: [{ type: 'text', text: 'Recommend a sci-fi movie' }],
    }

    render(
      <MemoryRouter>
        <ChatMessage message={userMessage} />
      </MemoryRouter>
    )
    expect(screen.getByText('Recommend a sci-fi movie')).toBeInTheDocument()
  })

  it('renders assistant response with markdown bolding', () => {
    const assistantMessage: CineBotUIMessage = {
      id: 'msg-2',
      role: 'assistant',
      parts: [{ type: 'text', text: 'You should check out **Inception**!' }],
    }

    render(
      <MemoryRouter>
        <ChatMessage message={assistantMessage} />
      </MemoryRouter>
    )
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('You should check out')).toBeInTheDocument()
  })

  it('renders streaming state with cursor', () => {
    const streamingMessage: CineBotUIMessage = {
      id: 'msg-3',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Thinking about' }],
    }

    render(
      <MemoryRouter>
        <ChatMessage message={streamingMessage} isStreaming />
      </MemoryRouter>
    )
    expect(screen.getByText('Thinking about')).toBeInTheDocument()
  })

  it('renders tool invocation results when message contains tool parts', () => {
    const toolMessage: CineBotUIMessage = {
      id: 'msg-4',
      role: 'assistant',
      parts: [
        {
          type: 'tool-searchMovies',
          toolCallId: 'call-123',
          state: 'output-available',
          input: { query: 'Matrix' },
          output: {
            query: 'Matrix',
            totalResults: 1,
            movies: [
              {
                imdbId: 'tt0133093',
                title: 'The Matrix',
                year: '1999',
                poster: 'https://example.com/matrix.jpg',
                type: 'movie',
              },
            ],
          },
        },
      ],
    }

    render(
      <MemoryRouter>
        <ChatMessage message={toolMessage} />
      </MemoryRouter>
    )
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.getByText('1999')).toBeInTheDocument()
  })
})
