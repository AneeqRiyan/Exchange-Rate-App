// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Navigation from './components/layout/Navigation'
import RateLookup from './components/exchange/RateLookup'
import CurrencyConverter from './components/exchange/CurrencyConverter'
import CurrencyList from './components/exchange/CurrencyList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<RateLookup />} />
          <Route path="/converter" element={<CurrencyConverter />} />
          <Route path="/currencies" element={<CurrencyList />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App