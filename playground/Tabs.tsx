import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

type TabItem = {
  id: string
  label: string
  content: ReactNode
}

type TabsProps = {
  items: TabItem[]
  defaultTabId?: string
}

export default function Tabs({ items, defaultTabId }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? items[0]?.id ?? '')
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const tabListId = useId()

  const activeIndex = items.findIndex((item) => item.id === activeTabId)

  const focusTab = (index: number) => {
    const nextTabId = items[index]?.id
    if (!nextTabId) {
      return
    }
    setActiveTabId(nextTabId)
    tabRefs.current[nextTabId]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const currentIndex = items.findIndex((item) => item.id === currentId)
    if (currentIndex < 0) {
      return
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusTab((currentIndex + 1) % items.length)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusTab((currentIndex - 1 + items.length) % items.length)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(items.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        setActiveTabId(currentId)
        break
      default:
        break
    }
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div role="tablist" aria-label="Example tabs" id={tabListId} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {items.map((item) => {
          const selected = item.id === activeTabId
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[item.id] = element
              }}
              id={`${tabListId}-${item.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabListId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTabId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, item.id)}
              style={{
                padding: '0.65rem 0.9rem',
                borderRadius: '999px',
                border: selected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                background: selected ? '#2563eb' : '#fff',
                color: selected ? '#fff' : '#111827',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items[activeIndex] ? (
        <div
          role="tabpanel"
          id={`${tabListId}-panel-${items[activeIndex].id}`}
          aria-labelledby={`${tabListId}-${items[activeIndex].id}`}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1rem',
            background: '#f8fafc',
            color: '#111827',
          }}
        >
          {items[activeIndex].content}
        </div>
      ) : null}
    </div>
  )
}
