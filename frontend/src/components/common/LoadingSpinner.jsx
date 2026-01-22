// src/components/common/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-3 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full animate-spin`}
        />
        <div
          className={`${sizeClasses[size]} absolute top-0 left-0 border-3 border-blue-200 rounded-full opacity-30`}
        />
      </div>
    </div>
  )
}

export default LoadingSpinner