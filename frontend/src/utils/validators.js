// src/utils/validators.js

/**
 * Validate if a string is a valid ISO 4217 currency code
 * @param {string} code - The currency code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidCurrencyCode = (code) => {
  if (typeof code !== 'string') return false
  // ISO 4217 codes are exactly 3 uppercase letters
  return /^[A-Z]{3}$/.test(code)
}

/**
 * Validate if a number is a valid amount (positive number)
 * @param {number} amount - The amount to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount)
  return typeof num === 'number' && !isNaN(num) && num > 0
}

/**
 * Validate if a string is a valid email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidUrl = (url) => {
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Validate if a value is not empty or null
 * @param {any} value - The value to validate
 * @returns {boolean} True if not empty, false otherwise
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

/**
 * Validate if a number is within a specified range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} True if within range, false otherwise
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}

/**
 * Validate if a string matches a minimum length
 * @param {string} str - The string to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} True if meets minimum length, false otherwise
 */
export const isMinLength = (str, minLength) => {
  if (typeof str !== 'string') return false
  return str.trim().length >= minLength
}

/**
 * Validate if a string matches a maximum length
 * @param {string} str - The string to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} True if within maximum length, false otherwise
 */
export const isMaxLength = (str, maxLength) => {
  if (typeof str !== 'string') return false
  return str.length <= maxLength
}

/**
 * Validate exchange rate object
 * @param {object} rate - The exchange rate object to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidExchangeRate = (rate) => {
  if (typeof rate !== 'object' || rate === null) return false
  
  return (
    isValidCurrencyCode(rate.baseCurrency) &&
    isValidCurrencyCode(rate.targetCurrency) &&
    typeof rate.rate === 'number' &&
    !isNaN(rate.rate) &&
    rate.rate > 0 &&
    (rate.date === undefined || !isNaN(Date.parse(rate.date)))
  )
}

/**
 * Validate conversion object
 * @param {object} conversion - The conversion object to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidConversion = (conversion) => {
  if (typeof conversion !== 'object' || conversion === null) return false
  
  return (
    isValidCurrencyCode(conversion.fromCurrency) &&
    isValidCurrencyCode(conversion.toCurrency) &&
    isValidAmount(conversion.amount) &&
    typeof conversion.convertedAmount === 'number' &&
    !isNaN(conversion.convertedAmount) &&
    conversion.convertedAmount >= 0
  )
}
