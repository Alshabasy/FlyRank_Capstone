import './App.css'
import ModalDialog from '../playground/ModalDialog'
import Tabs from '../playground/Tabs'
import Disclosure from '../playground/Disclosure'

const tabs = [
  { id: 'overview', label: 'Overview', content: 'A keyboard-first tab pattern with arrow-key navigation and focus management.' },
  { id: 'details', label: 'Details', content: 'Each tab is exposed as a real tab element with an associated panel.' },
  { id: 'notes', label: 'Notes', content: 'Use Tab to enter the tablist, then Arrow keys to move between tabs.' },
]

function App() {
  return (
    <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2rem 1rem 3rem', display: 'grid', gap: '1.25rem' }}>
      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Accessibility playground</h1>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
          These three components follow W3C ARIA Authoring Practices patterns and are usable by keyboard alone.
        </p>
      </section>

      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Modal dialog</h2>
        <ModalDialog title="Keyboard-friendly modal" triggerLabel="Open modal">
          This dialog traps focus while open, closes on Escape, and returns focus to the trigger when dismissed.
        </ModalDialog>
      </section>

      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Tabs</h2>
        <Tabs items={tabs} defaultTabId="overview" />
      </section>

      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Disclosure</h2>
        <Disclosure title="How this version differs from shadcn" defaultOpen>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.35rem' }}>
            <li>This example is intentionally minimal and dependency-free.</li>
            <li>It uses a simpler focus model and does not include shadcn-style animation polish or composition APIs.</li>
            <li>It is designed to be easy to inspect and extend for learning purposes.</li>
          </ul>
        </Disclosure>
      </section>
    </main>
  )
}

export default App
