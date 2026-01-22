// src/components/common/Footer.jsx
import { Heart, Github, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white border-t border-blue-800/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">About</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Exchange Rate Service provides real-time currency conversion powered by European Central Bank data.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Features</h3>
            <ul className="text-blue-200 text-sm space-y-2">
              <li>• Real-time Exchange Rates</li>
              <li>• Multi-Currency Support</li>
              <li>• Instant Conversion</li>
              <li>• Popular Currencies Tracking</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-blue-800/50 hover:bg-blue-700 rounded-lg transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-blue-800/50 hover:bg-blue-700 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800/30 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-blue-200 text-sm">
            <p>© {new Date().getFullYear()} Exchange Rate Service. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>using React & Tailwind CSS</span>
            </div>
          </div>
          <p className="text-center mt-4 text-blue-300 text-xs">
            Data sourced from <span className="font-semibold">European Central Bank</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer