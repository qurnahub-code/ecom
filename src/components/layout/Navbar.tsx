"use client"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { 
  ShoppingBag, Menu, X, User, LogOut, 
  LayoutDashboard, Settings, ChevronDown 
} from "lucide-react"
import { SmartSearchBar } from "@/components/ui/SmartSearchBar"

export function Navbar() {
  const { items } = useCart()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 text-white">
      
      {/* REMOVED: Top Free Shipping Banner */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight hidden sm:block">E-Com Platform</span>
          </Link>

          {/* Smart Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 justify-center">
             <SmartSearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5"
                >
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {session.user.name?.[0] || "U"}
                  </div>
                  <span className="text-xs font-bold max-w-[80px] truncate hidden sm:block">
                    {session.user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-bold text-white">{session.user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>

                      {session.user.role === 'ADMIN' && (
                        <Link 
                          href="/admin" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}

                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-bold hover:text-indigo-400">
                Log In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-900 p-4 space-y-4">
           <div className="pb-4">
             <SmartSearchBar />
           </div>
           <Link href="/products" className="block text-sm font-bold text-gray-300">Shop All</Link>
           <Link href="/dashboard" className="block text-sm font-bold text-gray-300">My Dashboard</Link>
        </div>
      )}
    </nav>
  )
}