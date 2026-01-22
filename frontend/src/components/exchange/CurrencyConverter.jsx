// src/components/exchange/CurrencyConverter.jsx
import { useState } from 'react'
import { Calculator, ArrowRight, DollarSign } from 'lucide-react'
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
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="card card-section">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="section-title mb-0">Currency Converter</h2>
              <p className="section-subtitle">Convert between currencies instantly</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Amount to Convert
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400 font-semibold">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  className="input-field pl-9"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="convertFrom" className="block text-sm font-semibold text-gray-700 mb-2">
                  From Currency
                </label>
                <input
                  type="text"
                  id="convertFrom"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="e.g., EUR"
                  maxLength={3}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="convertTo" className="block text-sm font-semibold text-gray-700 mb-2">
                  To Currency
                </label>
                <input
                  type="text"
                  id="convertTo"
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
                  Converting...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Convert
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="animate-fade-in">
              <ErrorMessage message={error} onRetry={handleSubmit} />
            </div>
          )}

          {conversion && !loading && (
            <div className="animate-fade-in">
              <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                <div className="text-center space-y-4">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Conversion Result</p>
                  <div className="space-y-3">
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                      {conversion.amount.toFixed(2)} 
                      <span className="text-blue-600 ml-2 font-bold">{conversion.fromCurrency}</span>
                    </p>
                    <div className="flex justify-center py-1">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-300 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-blue-600 rotate-90" />
                      </div>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-600 font-medium">
                      Rate: 1 <span className="font-bold">{conversion.fromCurrency}</span> = <span className="font-bold text-blue-600">{(conversion.convertedAmount / conversion.amount).toFixed(6)}</span> {conversion.toCurrency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrencyConverter