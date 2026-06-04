"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-black text-white h-[500px] flex items-center">
      
      {/* Background Gradients (Nebula Effect) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          NEW COLLECTION 2025
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 delay-100">
          Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tech Lifestyle</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 delay-200">
          Discover the latest gadgets, accessories, and gear designed to elevate your daily workflow and gaming setup.
        </p>

        {/* Buttons (No Search Bar Here) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 delay-300">
          <Link 
            href="/products" 
            className="group px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
          >
            Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/products?filter=sale" 
            className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            View Deals
          </Link>
        </div>

      </div>
    </div>
  )
}