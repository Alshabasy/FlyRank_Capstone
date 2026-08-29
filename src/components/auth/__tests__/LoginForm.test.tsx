import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from '../LoginForm.jsx'

describe('LoginForm Component', () => {
  it('renders form inputs and submit button', () => {
    const formState = { email: '', password: '' }
    const errors = {}

    render(
      <LoginForm
        formState={formState}
        errors={errors}
        onChange={() => {}}
        onSubmit={() => {}}
        onForgotPassword={() => {}}
        onGoogleSignIn={() => {}}
        loading={false}
      />
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
  })

  it('displays validation error messages when present', () => {
    const formState = { email: 'invalid-email', password: '' }
    const errors = {
      email: 'Please enter a valid email address',
      password: 'Password is required',
    }

    render(
      <LoginForm
        formState={formState}
        errors={errors}
        onChange={() => {}}
        onSubmit={() => {}}
        onForgotPassword={() => {}}
        onGoogleSignIn={() => {}}
        loading={false}
      />
    )

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('submits form when user clicks sign in', () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())
    const formState = { email: 'user@example.com', password: 'password123' }

    render(
      <LoginForm
        formState={formState}
        errors={{}}
        onChange={() => {}}
        onSubmit={handleSubmit}
        onForgotPassword={() => {}}
        onGoogleSignIn={() => {}}
        loading={false}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
