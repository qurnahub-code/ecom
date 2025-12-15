import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <div className="relative bg-gray-900 text-white h-[400px] flex items-center overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <div className="w-full max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
            New Collection 2025
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tech Lifestyle</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Discover the latest gadgets, accessories, and gear designed to enhance your daily workflow. Quality you can trust, prices you'll love.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/search" 
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/search?q=sale" 
              className="px-8 py-3 rounded-xl font-bold border border-gray-700 hover:bg-white/5 transition flex items-center justify-center"
            >
              View Deals
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}