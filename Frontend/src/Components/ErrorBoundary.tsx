import { Component, ReactNode } from 'react'
interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className='flex flex-col items-center justify-center py-20'>
          <h2 className='text-2xl font-semibold text-gray-800'>Something went wrong</h2>
          <p className='mt-2 text-gray-500'>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => window.location.reload()} className='mt-4 rounded bg-[#E8420A] px-6 py-2 text-white hover:bg-[#d03a08]'>Reload Page</button>
        </div>
      )
    }
    return this.props.children
  }
}
