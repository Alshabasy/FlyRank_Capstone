import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const HOVER_SIZE = 52
const RING_SIZE = 36

/**
 * Site-wide custom cursor: skyblue dot + mint ring with hover/click states.
 * Portaled to document.body so it sits above all content (z-index 9999).
 */
const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const hovering = useRef(false)
  const rafId = useRef(0)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (reduceMotion || !finePointer) return undefined

    setEnabled(true)

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const onOver = (e) => {
      hovering.current = Boolean(e.target?.closest?.('[data-cursor="hover"]'))
    }

    const onClick = () => {
      const dot = dotRef.current
      if (!dot) return
      dot.classList.remove('cursor-dot--click')
      void dot.offsetWidth
      dot.classList.add('cursor-dot--click')
    }

    const lerp = () => {
      const speed = 0.18
      ringPos.current.x += (pos.current.x - ringPos.current.x) * speed
      ringPos.current.y += (pos.current.y - ringPos.current.y) * speed

      const ring = ringRef.current
      if (ring) {
        const size = hovering.current ? HOVER_SIZE : RING_SIZE
        ring.style.width = `${size}px`
        ring.style.height = `${size}px`
        ring.style.borderColor = hovering.current ? 'var(--yellow)' : 'var(--mint)'
        ring.style.opacity = hovering.current ? '0.6' : '1'
        ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }
      rafId.current = requestAnimationFrame(lerp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mousedown', onClick)
    rafId.current = requestAnimationFrame(lerp)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onClick)
      cancelAnimationFrame(rafId.current)
      setEnabled(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const style = document.createElement('style')
    style.setAttribute('data-custom-cursor', 'true')
    style.textContent =
      'html, body, *, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(style)
    return () => style.remove()
  }, [enabled])

  if (!enabled) return null

  return createPortal(
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[10px] w-[10px]
          -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--skyblue)]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999]
          -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--mint)]"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          willChange: 'transform, width, height, opacity, border-color',
        }}
      />
    </>,
    document.body,
  )
}

export default CustomCursor
