// src/hooks/useExchangeRates.js
import { useState, useEffect } from 'react'
import { exchangeRateAPI } from '../services/api'

export const useExchangeRates = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const getRate = async (fromCurrency, toCurrency) => {
    setLoading(true)
    setError(null)
    try {
      const response = await exchangeRateAPI.getExchangeRate(fromCurrency, toCurrency)
      return response.data
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch exchange rate'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const convertAmount = async (fromCurrency, toCurrency, amount) => {
    setLoading(true)
    setError(null)
    try {
      const response = await exchangeRateAPI.convertAmount(fromCurrency, toCurrency, amount)
      return response.data
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to convert amount'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const getCurrencies = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await exchangeRateAPI.getSupportedCurrencies()
      return response.data
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch currencies'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const refreshRates = async () => {
    setLoading(true)
    setError(null)
    try {
      await exchangeRateAPI.refreshRates()
      // Refetch last updated time
      const response = await exchangeRateAPI.getLastUpdated()
      setLastUpdated(response.data)
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to refresh rates'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const response = await exchangeRateAPI.getLastUpdated()
        setLastUpdated(response.data)
      } catch (err) {
        console.error('Failed to fetch last updated time:', err)
      }
    }
    fetchLastUpdated()
  }, [])

  return {
    loading,
    error,
    lastUpdated,
    getRate,
    convertAmount,
    getCurrencies,
    refreshRates,
    clearError: () => setError(null)
  }
}