// src/components/common/Header.jsx
import { RefreshCw, Calendar } from 'lucide-react'
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
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exchange Rate Service</h1>
            <p className="text-gray-600 text-sm mt-1">
              European Central Bank Reference Rates
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Rates
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header