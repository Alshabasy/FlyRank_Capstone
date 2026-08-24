interface ToolErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryDisabled?: boolean
}

export function ToolError({
  title = 'Movie search failed',
  message = "We couldn't retrieve movie results right now.",
  onRetry,
  retryDisabled = false,
}: ToolErrorProps) {
  return (
    <div
      className="m-1 rounded-xl border border-red-400/30 bg-red-500/10 p-4"
      role="alert"
    >
      <p className="text-sm font-semibold text-red-200">{title}</p>
      <p className="mt-1 text-sm text-red-100/90">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          disabled={retryDisabled}
          aria-label="Retry movie search"
          className="mt-3 rounded-full border border-red-400/40 px-3 py-1.5 text-xs text-red-100 transition hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
