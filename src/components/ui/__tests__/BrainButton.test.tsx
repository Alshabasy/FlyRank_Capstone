import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrainButton } from '../BrainButton'

describe('BrainButton Component', () => {
  it('renders idle state with correct label and role', () => {
    render(<BrainButton actionType="send" label="Send Message" />)
    const button = screen.getByRole('button', { name: /send message/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('handles click, switches to loading, and resolves to success state', async () => {
    const handleClick = vi.fn().mockImplementation(() => new Promise((res) => setTimeout(res, 20)))
    render(<BrainButton actionType="send" onClick={handleClick} label="Submit" successLabel="Done!" />)

    const button = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.getByText(/done!/i)).toBeInTheDocument()
    })
  })

  it('handles click failure and displays error state', async () => {
    const handleClick = vi.fn().mockRejectedValue(new Error('Failed request'))
    render(<BrainButton actionType="retry" onClick={handleClick} label="Retry Action" errorLabel="Error Occurred" />)

    const button = screen.getByRole('button', { name: /retry action/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument()
    })
  })

  it('remains disabled and unclickable when disabled prop is true', () => {
    const handleClick = vi.fn()
    render(<BrainButton actionType="send" disabled label="Disabled Action" onClick={handleClick} />)

    const button = screen.getByRole('button', { name: /disabled action/i })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
