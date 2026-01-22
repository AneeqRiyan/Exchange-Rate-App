// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Navigation from './components/layout/Navigation'
import RateLookup from './components/exchange/RateLookup'
import CurrencyConverter from './components/exchange/CurrencyConverter'
import CurrencyList from './components/exchange/CurrencyList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-1 w-full flex items-start justify-center">
        <div className="w-full max-w-4xl px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<RateLookup />} />
            <Route path="/converter" element={<CurrencyConverter />} />
            <Route path="/currencies" element={<CurrencyList />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App