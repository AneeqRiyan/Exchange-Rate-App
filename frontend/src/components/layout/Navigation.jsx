// src/components/layout/Navigation.jsx
import { Link, useLocation } from 'react-router-dom'
import { Search, Calculator, List } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Rate Lookup', icon: Search },
    { path: '/converter', label: 'Currency Converter', icon: Calculator },
    { path: '/currencies', label: 'Supported Currencies', icon: List },
  ]

  return (
    <nav className="glass-effect border-b border-blue-100/50 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 py-4 px-4 font-medium transition-all duration-200 rounded-t-lg border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation