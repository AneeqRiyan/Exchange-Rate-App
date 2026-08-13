// src/utils/formatters.js

/**
 * Format a number as currency with the specified symbol
 * @param {number} amount - The amount to format
 * @param {string} currencySymbol - The currency symbol (e.g., '$', '€')
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencySymbol = '$', decimals = 2) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currencySymbol}0.00`
  }
  return `${currencySymbol}${amount.toFixed(decimals)}`
}

/**
 * Format an exchange rate with a specified number of decimal places
 * @param {number} rate - The exchange rate to format
 * @param {number} decimals - Number of decimal places (default: 6)
 * @returns {string} Formatted rate string
 */
export const formatExchangeRate = (rate, decimals = 6) => {
  if (typeof rate !== 'number' || isNaN(rate)) {
    return '0'
  }
  return rate.toFixed(decimals)
}

/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type: 'short', 'long', 'full' (default: 'short')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    const options = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    }
    
    return dateObj.toLocaleDateString('en-US', options[format] || options.short)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Format a number as percentage
 * @param {number} value - The decimal value (e.g., 0.05 for 5%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%'
  }
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Truncate a string to a maximum length with ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated string
 */
export const truncateString = (str, maxLength = 50) => {
  if (typeof str !== 'string') return ''
  if (str.length <= maxLength) return str
  return `${str.substring(0, maxLength)}...`
}
