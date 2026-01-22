// src/components/common/ErrorMessage.jsx
import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

const ErrorMessage = ({ message, onRetry }) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm mb-1">Error Occurred</h3>
              <p className="text-red-700 text-sm">{message}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200 font-medium inline-flex items-center gap-2"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage