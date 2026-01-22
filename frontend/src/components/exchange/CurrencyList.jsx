// src/components/exchange/CurrencyList.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, RotateCw } from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedCurrencies = [...currencies].sort((a, b) => b.requestCount - a.requestCount)
  const topCurrencies = sortedCurrencies.slice(0, 3)

  const getPopularityColor = (index) => {
    if (index < 3) return 'from-yellow-400 to-orange-500'
    if (index < 6) return 'from-blue-400 to-cyan-500'
    return 'from-gray-400 to-slate-500'
  }

  const getPopularityLabel = (index) => {
    if (index < 3) return 'Popular'
    if (index < 6) return 'Common'
    return 'Standard'
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="card card-section">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="section-title mb-0">Supported Currencies</h2>
                <p className="section-subtitle">Browse all available currencies</p>
              </div>
            </div>
            <button
              onClick={fetchCurrencies}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {error && (
            <div className="animate-fade-in">
              <ErrorMessage message={error} onRetry={fetchCurrencies} />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : currencies.length > 0 ? (
            <>
              {/* Featured Currencies */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
                  Top Currencies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topCurrencies.map((currency, index) => (
                    <div
                      key={currency.currency}
                      className={`p-6 rounded-xl bg-gradient-to-br ${getPopularityColor(index)} text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl font-bold">{currency.currency}</span>
                        <span className="text-xs font-bold bg-white/30 px-3 py-1.5 rounded-full backdrop-blur border border-white/20">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm mb-3 font-medium">Requests: <span className="font-bold text-lg">{currency.requestCount}</span></p>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-semibold">{getPopularityLabel(index)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Currencies Table */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
                  All Supported Currencies
                </h3>
                <div className="overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Currency
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Usage Count
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedCurrencies.map((currency, index) => (
                        <tr
                          key={currency.currency}
                          className="hover:bg-blue-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-sm font-bold text-blue-600">
                                  {currency.currency}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {currency.currency}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 bg-gray-200 rounded-full flex-1 max-w-xs">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(currency.requestCount / Math.max(...sortedCurrencies.map(c => c.requestCount))) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-gray-700 min-w-max">
                                {currency.requestCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 shadow-sm">
                                {getPopularityLabel(index)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
                <p className="text-sm text-gray-700 font-medium">
                  <span className="font-bold text-gray-900 text-base">Total Supported Currencies:</span> <span className="text-blue-600 font-bold text-lg ml-1">{currencies.length}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No currencies found. Try refreshing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrencyList