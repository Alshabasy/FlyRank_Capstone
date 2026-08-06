import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

type ModalDialogProps = {
  title: string
  triggerLabel?: string
  children: ReactNode
}

export default function ModalDialog({ title, triggerLabel = 'Open dialog', children }: ModalDialogProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelectors)
    const first = focusableElements?.[0] ?? dialogRef.current
    first?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const elements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelectors)
      if (!elements || elements.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const closeModal = () => {
    setOpen(false)
    previouslyFocusedRef.current?.focus()
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        style={{
          width: 'fit-content',
          padding: '0.7rem 1rem',
          borderRadius: '999px',
          border: '1px solid #60a5fa',
          background: '#111827',
          color: '#f9fafb',
          cursor: 'pointer',
        }}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.72)',
            display: 'grid',
            placeItems: 'center',
            padding: '1rem',
            zIndex: 50,
          }}
          onClick={closeModal}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(100%, 32rem)',
              borderRadius: '1rem',
              background: '#f8fafc',
              color: '#111827',
              padding: '1.25rem',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.24)',
            }}
          >
            <h2 id={titleId} style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
              {title}
            </h2>
            <p id={descriptionId} style={{ margin: '0 0 1rem', lineHeight: 1.6 }}>
              {children}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={closeModal} style={{ padding: '0.6rem 0.9rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
                Close
              </button>
              <button type="button" onClick={closeModal} style={{ padding: '0.6rem 0.9rem', borderRadius: '0.75rem', background: '#2563eb', color: '#fff', border: 'none' }}>
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
