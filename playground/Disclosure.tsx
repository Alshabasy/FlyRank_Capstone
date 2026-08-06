import { useId, useState, type ReactNode } from 'react'

type DisclosureProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', background: '#fff' }}>
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((current) => !current)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: '#111827',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span>{title}</span>
          <span>{open ? '−' : '+'}</span>
        </button>
      </h3>

      <div id={contentId} role="region" hidden={!open} style={{ marginTop: '0.75rem', color: '#475569', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  )
}
