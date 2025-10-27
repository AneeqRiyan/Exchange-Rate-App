// src/components/exchange/CurrencyConverter.jsx
import { useState } from 'react'
import { Calculator, ArrowRight } from 'lucide-react'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR')
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState('100')
  const [conversion, setConversion] = useState(null)
  const { convertAmount, loading, error, clearError } = useExchangeRates()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    try {
      const numericAmount = parseFloat(amount)
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid positive amount')
      }
      
      const result = await convertAmount(fromCurrency, toCurrency, numericAmount)
      setConversion(result)
    } catch (error) {
      // Error handled by hook or validation
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setConversion(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Currency Converter</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount"
                required
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="convertFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  From Currency
                </label>
                <input
                  type="text"
                  id="convertFrom"
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
                <label htmlFor="convertTo" className="block text-sm font-medium text-gray-700 mb-1">
                  To Currency
                </label>
                <input
                  type="text"
                  id="convertTo"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., USD"
                  maxLength={3}
                  required
                />
              </div>
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
                <Calculator className="w-4 h-4 mr-2" />
                Convert
              </>
            )}
          </button>
        </form>

        {error && (
          <ErrorMessage message={error} onRetry={handleSubmit} />
        )}

        {conversion && !loading && (
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-900 mb-2">
                {conversion.amount.toFixed(2)} {conversion.fromCurrency}
              </p>
              <p className="text-2xl font-semibold text-blue-700">
                = {conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}
              </p>
              <p className="text-blue-600 text-sm mt-2">
                Exchange rate: 1 {conversion.fromCurrency} = {(conversion.convertedAmount / conversion.amount).toFixed(6)} {conversion.toCurrency}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencyConverter