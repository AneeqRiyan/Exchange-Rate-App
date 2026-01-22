// src/components/common/Header.jsx
import { RefreshCw, TrendingUp } from 'lucide-react'
import { useExchangeRates } from '../../hooks/useExchangeRates'

const Header = () => {
  const { lastUpdated, refreshRates, loading } = useExchangeRates()

  const handleRefresh = async () => {
    try {
      await refreshRates()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <header className="sticky top-0 z-50 animate-slide-in-down">
      <div className="glass-effect border-b border-blue-100/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Exchange Rate Service
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">
                    ECB Real-time Rates
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="hidden sm:block p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="inline-flex w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="font-medium">Updated: {new Date(lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header