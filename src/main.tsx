import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig, chains } from './config/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

// Add error boundary for wallet extension conflicts
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Handle wallet extension conflicts
      if (event.message?.includes('ethereum') || 
          event.message?.includes('isZerion') ||
          event.message?.includes('Cannot redefine property')) {
        console.warn('Wallet extension conflict detected:', event.message)
        // Don't crash the app for these errors
        event.preventDefault()
        return
      }
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-4">Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider chains={chains}>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </ErrorBoundary>
  </React.StrictMode>,
)