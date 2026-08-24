import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AppErrorBoundary caught', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-semibold text-cinema-white">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </h1>
          <p className="mt-2 max-w-md text-sm text-cinema-muted">
            The page hit an unexpected error. You can try recovering without losing the rest of the app.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 rounded-full bg-cinema-red px-4 py-2 text-sm font-medium text-cinema-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinema-blue"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
