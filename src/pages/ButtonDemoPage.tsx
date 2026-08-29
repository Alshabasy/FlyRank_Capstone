import { useState, lazy, Suspense } from 'react'
import { BrainButton, type ButtonActionType, type ButtonState } from '../components/ui/BrainButton'
import { RiSparklingLine, RiPulseLine, RiSpeedUpLine, RiCheckDoubleLine, RiAlertLine } from 'react-icons/ri'

const MoviePoster3DCanvas = lazy(() => import('../components/3d/MoviePoster3D'))

export default function ButtonDemoPage() {
  const [delayMs, setDelayMs] = useState<number>(1500)
  const [outcome, setOutcome] = useState<'success' | 'failure' | 'random'>('success')
  const [controlledState, setControlledState] = useState<ButtonState | 'auto'>('auto')
  const [actionType, setActionType] = useState<ButtonActionType>('send')
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 7)])
  }

  const handleSimulatedAction = async () => {
    addLog(`Action triggered (${actionType}). Waiting ${delayMs}ms...`)
    await new Promise((res) => setTimeout(res, delayMs))

    const isSuccess = outcome === 'success' || (outcome === 'random' && Math.random() > 0.3)
    if (!isSuccess) {
      addLog('Operation failed as requested.')
      throw new Error('Simulated network error')
    }
    addLog('Operation succeeded successfully.')
  }

  return (
    <main className="min-h-screen bg-cinema-black text-cinema-white px-4 py-10 md:py-16 max-w-6xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-red/10 border border-cinema-red/30 text-cinema-red text-xs font-semibold uppercase tracking-wider mb-3">
          <RiSparklingLine className="w-4 h-4" />
          <span>FE-09 Interactive Showcase</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Buttons with a Brain
        </h1>
        <p className="text-cinema-muted mt-2 max-w-2xl text-sm md:text-base">
          A stateful action button communicating lifecycle states (Idle, Hover/Focus, Loading, Success, Error, Disabled) using explicit state transitions, transform/opacity GPU motion, interruption safety, and reduced motion accessibility.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Playground Controls */}
        <section aria-labelledby="playground-title" className="lg:col-span-6 bg-cinema-dark p-6 rounded-2xl border border-white/10 shadow-cinema space-y-6">
          <h2 id="playground-title" className="text-xl font-semibold text-white flex items-center gap-2">
            <RiPulseLine className="text-cinema-red" />
            Interactive Playground
          </h2>

          {/* Action Button Preview Box */}
          <div className="bg-cinema-black/70 p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[160px] gap-4">
            <BrainButton
              actionType={actionType}
              state={controlledState === 'auto' ? undefined : controlledState}
              onClick={handleSimulatedAction}
              label={actionType === 'send' ? 'Send Prompt' : actionType === 'generate' ? 'Generate Movie' : actionType === 'retry' ? 'Retry Request' : 'Stop Stream'}
            />
            <p className="text-xs text-cinema-muted">
              Current state: <span className="font-mono text-cinema-white font-semibold capitalize">{controlledState !== 'auto' ? `Controlled (${controlledState})` : 'Automatic (State Machine)'}</span>
            </p>
          </div>

          {/* Controls Form */}
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">Action Variant</label>
              <div className="grid grid-cols-4 gap-2">
                {(['send', 'retry', 'generate', 'stop'] as ButtonActionType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActionType(type)}
                    className={`py-2 px-3 rounded-lg capitalize border text-xs font-medium transition ${
                      actionType === type ? 'bg-cinema-red text-white border-cinema-red' : 'bg-white/5 border-white/10 text-cinema-muted hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">Simulation Outcome</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOutcome('success')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    outcome === 'success' ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' : 'bg-white/5 border-white/10 text-cinema-muted hover:text-white'
                  }`}
                >
                  <RiCheckDoubleLine />
                  Force Success
                </button>
                <button
                  type="button"
                  onClick={() => setOutcome('failure')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    outcome === 'failure' ? 'bg-amber-600/30 text-amber-300 border-amber-500' : 'bg-white/5 border-white/10 text-cinema-muted hover:text-white'
                  }`}
                >
                  <RiAlertLine />
                  Force Failure
                </button>
                <button
                  type="button"
                  onClick={() => setOutcome('random')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    outcome === 'random' ? 'bg-cinema-blue/30 text-blue-300 border-cinema-blue' : 'bg-white/5 border-white/10 text-cinema-muted hover:text-white'
                  }`}
                >
                  Random (70/30)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-cinema-muted mb-1.5">
                <label htmlFor="delay-range" className="flex items-center gap-1">
                  <RiSpeedUpLine />
                  Simulated Delay
                </label>
                <span className="font-mono text-cinema-white">{delayMs}ms</span>
              </div>
              <input
                id="delay-range"
                type="range"
                min="300"
                max="4000"
                step="100"
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
                className="w-full accent-cinema-red bg-white/10 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1.5">Manual State Override</label>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                {(['auto', 'idle', 'loading', 'success', 'error'] as (ButtonState | 'auto')[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setControlledState(st)}
                    className={`py-1.5 rounded border capitalize transition ${
                      controlledState === st ? 'bg-cinema-blue text-white border-cinema-blue' : 'bg-white/5 border-white/10 text-cinema-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-cinema-muted space-y-1 min-h-[120px]">
            <p className="text-white font-sans text-xs font-semibold mb-2 flex items-center justify-between">
              <span>Event Activity Log</span>
              <button type="button" onClick={() => setLog([])} className="text-[10px] text-cinema-muted hover:text-white underline">
                Clear
              </button>
            </p>
            {log.length === 0 ? (
              <p className="italic text-white/30">Click the button above to log state transitions.</p>
            ) : (
              log.map((item, idx) => (
                <div key={idx} className="truncate">{item}</div>
              ))
            )}
          </div>
        </section>

        {/* Documentation Section */}
        <section aria-labelledby="docs-title" className="lg:col-span-6 space-y-6">
          <div className="bg-cinema-dark p-6 rounded-2xl border border-white/10 shadow-cinema space-y-4">
            <h2 id="docs-title" className="text-xl font-semibold text-white">
              State Machine Architecture
            </h2>
            <div className="bg-cinema-black/80 p-4 rounded-xl border border-white/10 font-mono text-xs text-cinema-white space-y-2 overflow-x-auto">
              <p className="text-cinema-red font-semibold">// State Transitions Flow</p>
              <p>IDLE ➔ (onClick) ➔ LOADING</p>
              <p>LOADING ➔ (resolve success) ➔ SUCCESS ➔ (2s timeout) ➔ IDLE</p>
              <p>LOADING ➔ (reject error)   ➔ ERROR   ➔ (onClick) ➔ LOADING</p>
            </div>
          </div>

          <div className="bg-cinema-dark p-6 rounded-2xl border border-white/10 shadow-cinema space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Motion & Accessibility Decisions
            </h2>
            <ul className="space-y-3 text-sm text-cinema-muted">
              <li className="flex gap-2">
                <strong className="text-cinema-white shrink-0">Transforms & Opacity:</strong>
                <span>Transitions utilize Framer Motion spring physics with GPU-accelerated <code className="text-cinema-red bg-white/5 px-1 py-0.5 rounded">scale</code> and <code className="text-cinema-red bg-white/5 px-1 py-0.5 rounded">opacity</code>. Layout-heavy properties (<code className="text-cinema-muted">width</code>, <code className="text-cinema-muted">height</code>) are deliberately preserved to avoid costly browser reflows.</span>
              </li>
              <li className="flex gap-2">
                <strong className="text-cinema-white shrink-0">Interruption Safety:</strong>
                <span>Spam-clicking while in <code className="text-cinema-white">loading</code> state is blocked using <code className="text-cinema-white">disabled</code> + pointer event locks, preventing duplicate network invocations.</span>
              </li>
              <li className="flex gap-2">
                <strong className="text-cinema-white shrink-0">Reduced Motion:</strong>
                <span>Uses <code className="text-cinema-white">useReducedMotion()</code> hook. When preferred reduced motion is active, spatial translations (<code className="text-cinema-white">y: 6px</code>) and scale gestures are suppressed in favor of high-contrast instant opacity state swaps.</span>
              </li>
              <li className="flex gap-2">
                <strong className="text-cinema-white shrink-0">Keyboard Accessibility:</strong>
                <span>Full keyboard support with <code className="text-cinema-white">focus-visible:ring-2</code> focus indicator ring, native <code className="text-cinema-white">&lt;button&gt;</code> semantics, and <code className="text-cinema-white">aria-live="polite"</code> announcements.</span>
              </li>
            </ul>
          </div>

          <div className="bg-cinema-dark p-6 rounded-2xl border border-white/10 shadow-cinema space-y-4">
            <h2 className="text-xl font-semibold text-white">
              FE-11 Interactive 3D Showcase
            </h2>
            <p className="text-sm text-cinema-muted">
              Interactive 3D Movie Poster powered by React Three Fiber & Three.js. Supports pointer tracking, material toggle, and flip animation.
            </p>
            <Suspense fallback={<div className="h-[380px] rounded-2xl bg-cinema-dark/60 animate-pulse border border-white/10" />}>
              <MoviePoster3DCanvas />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  )
}
