import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center py-20'>
          <h1 className='text-6xl font-bold text-gray-300'>Oops</h1>
          <p className='mt-4 text-xl text-gray-500'>Something went wrong.</p>
        </div>
      )
    }
    return this.props.children
  }
}
