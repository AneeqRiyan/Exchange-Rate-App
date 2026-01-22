// src/components/exchange/RateLookup.jsx
import { useState } from 'react'
import { Search, ArrowRight, Zap } from 'lucide-react'
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
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="card card-section">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="section-title mb-0">Exchange Rate Lookup</h2>
              <p className="section-subtitle">Check the latest conversion rates</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="fromCurrency" className="block text-sm font-semibold text-gray-700 mb-2">
                  From Currency
                </label>
                <input
                  type="text"
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="e.g., EUR"
                  maxLength={3}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="toCurrency" className="block text-sm font-semibold text-gray-700 mb-2">
                  To Currency
                </label>
                <input
                  type="text"
                  id="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="e.g., USD"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={swapCurrencies}
              className="w-full py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              title="Swap currencies"
            >
              <ArrowRight className="w-4 h-4" />
              Swap
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Get Exchange Rate
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="animate-fade-in">
              <ErrorMessage message={error} onRetry={handleSubmit} />
            </div>
          )}

          {rate && !loading && (
            <div className="animate-fade-in">
              <div className="p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-center space-y-3">
                <p className="text-sm font-semibold text-green-600 uppercase tracking-widest">Current Rate</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  1 <span className="text-green-600">{rate.baseCurrency}</span> = <span className="text-green-600">{rate.rate.toFixed(6)}</span> {rate.targetCurrency}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Last updated: {new Date(rate.date).toLocaleDateString()} at {new Date(rate.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RateLookup