// src/constants/config.js
export const APP_CONFIG = {
  // In Docker and production, relative '/api' points directly to the Spring Boot backend
  // serving the application on the same host and port.
  // In Vite local development, Vite dev proxy forwards '/api' to 'http://localhost:8080'.
  // Can be explicitly overridden with VITE_API_BASE_URL if backend is hosted separately.
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CURRENCIES: ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY']
}

export const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CHF: 'CHF',
  CAD: 'C$',
  AUD: 'A$',
  CNY: '¥'
}