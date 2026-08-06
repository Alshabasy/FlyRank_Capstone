import { useEffect, useMemo, useRef, useState } from 'react'

interface UseAutoScrollReturn {
  scrollRef: React.RefObject<HTMLDivElement | null>
  showJumpButton: boolean
  isNearBottom: boolean
  scrollToBottom: () => void
}

export function useAutoScroll(): UseAutoScrollReturn {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [showJumpButton, setShowJumpButton] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)

  const scrollToBottom = () => {
    if (!scrollRef.current) {
      return
    }

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const node = scrollRef.current
    if (!node) {
      return
    }

    const handleScroll = () => {
      const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight
      const nearBottom = distanceFromBottom <= 80
      setShowJumpButton(!nearBottom)
      setIsNearBottom(nearBottom)
    }

    node.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => node.removeEventListener('scroll', handleScroll)
  }, [])

  return useMemo(
    () => ({
      scrollRef,
      showJumpButton,
      isNearBottom,
      scrollToBottom,
    }),
    [isNearBottom, showJumpButton],
  )
}

// ✅ src/hooks/useAutoScroll.ts complete
