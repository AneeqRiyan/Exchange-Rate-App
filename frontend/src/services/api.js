// src/services/api.js
import axios from 'axios'
import { APP_CONFIG } from '../constants/config'

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const exchangeRateAPI = {
  getExchangeRate: (fromCurrency, toCurrency) =>
    api.get(`/exchange-rates/rate/${fromCurrency}/${toCurrency}`),
  
  convertAmount: (fromCurrency, toCurrency, amount) =>
    api.get('/exchange-rates/convert', {
      params: { from: fromCurrency, to: toCurrency, amount }
    }),
  
  getSupportedCurrencies: () =>
    api.get('/exchange-rates/currencies'),
  
  refreshRates: () =>
    api.post('/exchange-rates/refresh'),
  
  getLastUpdated: () =>
    api.get('/exchange-rates/last-updated'),
}

export default api