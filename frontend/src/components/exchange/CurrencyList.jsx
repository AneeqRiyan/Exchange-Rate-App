// src/components/exchange/CurrencyList.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const CurrencyList = () => {
  const [currencies, setCurrencies] = useState([])
  const { getCurrencies, loading, error, clearError } = useExchangeRates()

  const fetchCurrencies = async () => {
    clearError()
    try {
      const data = await getCurrencies()
      setCurrencies(data)
    } catch (error) {
      // Error handled by hook
    }
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const sortedCurrencies = [...currencies].sort((a, b) => b.requestCount - a.requestCount)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Supported Currencies</h2>
          <button
            onClick={fetchCurrencies}
            disabled={loading}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={fetchCurrencies} />
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCurrencies.map((currency, index) => (
                  <tr key={currency.currency} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-800">
                            {currency.currency}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {currency.currency}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{currency.requestCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                        <div className="text-sm text-gray-900">
                          {index < 3 ? 'High' : index < 6 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Total supported currencies: {currencies.length}</p>
        </div>
      </div>
    </div>
  )
}

export default CurrencyList