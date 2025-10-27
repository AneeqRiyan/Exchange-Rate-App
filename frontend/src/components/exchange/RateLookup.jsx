// src/components/exchange/RateLookup.jsx
import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const RateLookup = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR')
  const [toCurrency, setToCurrency] = useState('USD')
  const [rate, setRate] = useState(null)
  const { getRate, loading, error, clearError } = useExchangeRates()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    try {
      const result = await getRate(fromCurrency, toCurrency)
      setRate(result)
    } catch (error) {
      // Error handled by hook
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setRate(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Exchange Rate Lookup</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                From Currency
              </label>
              <input
                type="text"
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., EUR"
                maxLength={3}
                required
              />
            </div>
            
            <button
              type="button"
              onClick={swapCurrencies}
              className="mt-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                To Currency
              </label>
              <input
                type="text"
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., USD"
                maxLength={3}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Get Exchange Rate
              </>
            )}
          </button>
        </form>

        {error && (
          <ErrorMessage message={error} onRetry={handleSubmit} />
        )}

        {rate && !loading && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-900">
                1 {rate.baseCurrency} = {rate.rate.toFixed(6)} {rate.targetCurrency}
              </p>
              <p className="text-green-700 text-sm mt-1">
                Last updated: {new Date(rate.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RateLookup