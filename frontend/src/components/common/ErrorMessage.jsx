// src/components/common/ErrorMessage.jsx
import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-red-800 font-medium">Error</span>
      </div>
      <p className="text-red-700 mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage