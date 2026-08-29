import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { RiSendPlaneLine, RiRefreshLine, RiSparklingLine, RiStopCircleLine, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri'

export type ButtonActionType = 'send' | 'retry' | 'generate' | 'stop' | 'custom'
export type ButtonState = 'idle' | 'loading' | 'success' | 'error'

export interface BrainButtonProps {
  actionType?: ButtonActionType
  state?: ButtonState
  onClick?: () => void | Promise<void>
  disabled?: boolean
  label?: string
  loadingLabel?: string
  successLabel?: string
  errorLabel?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'danger'
  autoResetDelay?: number // ms to reset success state back to idle
  'aria-label'?: string
}

export function BrainButton({
  actionType = 'send',
  state: controlledState,
  onClick,
  disabled = false,
  label,
  loadingLabel,
  successLabel = 'Done!',
  errorLabel = 'Failed. Retry?',
  className = '',
  variant = 'primary',
  autoResetDelay = 2000,
  'aria-label': ariaLabel,
}: BrainButtonProps) {
  const [internalState, setInternalState] = useState<ButtonState>('idle')
  const isReducedMotion = useReducedMotion()
  const mountedRef = useRef(true)

  const currentState = controlledState ?? internalState

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Auto reset success state back to idle after delay
  useEffect(() => {
    if (currentState === 'success' && !controlledState) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setInternalState('idle')
        }
      }, autoResetDelay)
      return () => clearTimeout(timer)
    }
  }, [currentState, controlledState, autoResetDelay])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (disabled || currentState === 'loading') return

    if (onClick) {
      if (!controlledState) {
        setInternalState('loading')
      }
      try {
        await onClick()
        if (!controlledState && mountedRef.current) {
          setInternalState('success')
        }
      } catch {
        if (!controlledState && mountedRef.current) {
          setInternalState('error')
        }
      }
    }
  }

  // Determine icon & label based on state & actionType
  const getIcon = () => {
    switch (currentState) {
      case 'loading':
        return (
          <motion.div
            animate={isReducedMotion ? {} : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full shrink-0"
            aria-hidden="true"
          />
        )
      case 'success':
        return <RiCheckLine className="w-4 h-4 shrink-0 text-emerald-300" aria-hidden="true" />
      case 'error':
        return <RiErrorWarningLine className="w-4 h-4 shrink-0 text-amber-300" aria-hidden="true" />
      case 'idle':
      default:
        switch (actionType) {
          case 'retry':
            return <RiRefreshLine className="w-4 h-4 shrink-0" aria-hidden="true" />
          case 'generate':
            return <RiSparklingLine className="w-4 h-4 shrink-0" aria-hidden="true" />
          case 'stop':
            return <RiStopCircleLine className="w-4 h-4 shrink-0" aria-hidden="true" />
          case 'send':
          default:
            return <RiSendPlaneLine className="w-4 h-4 shrink-0" aria-hidden="true" />
        }
    }
  }

  const getLabel = () => {
    if (currentState === 'loading') {
      return loadingLabel || (actionType === 'generate' ? 'Generating...' : actionType === 'stop' ? 'Stopping...' : 'Sending...')
    }
    if (currentState === 'success') return successLabel
    if (currentState === 'error') return errorLabel

    if (label) return label
    switch (actionType) {
      case 'retry':
        return 'Retry'
      case 'generate':
        return 'Generate'
      case 'stop':
        return 'Stop'
      case 'send':
      default:
        return 'Send'
    }
  }

  const getVariantStyles = () => {
    if (currentState === 'success') {
      return 'bg-emerald-600/90 hover:bg-emerald-600 text-white border-emerald-500/50 shadow-emerald-900/30'
    }
    if (currentState === 'error') {
      return 'bg-amber-600/90 hover:bg-amber-600 text-white border-amber-500/50 shadow-amber-900/30'
    }
    if (variant === 'danger' || actionType === 'stop') {
      return 'bg-red-600/90 hover:bg-red-600 text-white border-red-500/50 shadow-red-900/30'
    }
    if (variant === 'secondary') {
      return 'bg-cinema-dark hover:bg-white/10 text-cinema-white border-white/10 hover:border-cinema-blue/50 shadow-black/40'
    }
    // Default primary
    return 'bg-cinema-red hover:bg-cinema-red-2 text-white border-cinema-red/50 shadow-cinema-red/20'
  }

  const isDisabled = disabled || currentState === 'loading'

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={ariaLabel || getLabel()}
      aria-busy={currentState === 'loading'}
      aria-live="polite"
      whileHover={isDisabled || isReducedMotion ? {} : { scale: 1.02 }}
      whileTap={isDisabled || isReducedMotion ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
        border shadow-lg transition-colors duration-200 outline-none
        focus-visible:ring-2 focus-visible:ring-cinema-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        select-none overflow-hidden ${getVariantStyles()} ${className}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${currentState}-${actionType}`}
          initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-2 shrink-0"
        >
          {getIcon()}
          <span>{getLabel()}</span>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
