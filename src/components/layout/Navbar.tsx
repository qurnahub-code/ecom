// src/components/layout/Navbar.tsx
"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { SearchBar } from "@/components/ui/SearchBar"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"

export function Navbar() {
  const { cartCount } = useCart()
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg font-bold text-xl">E-Com</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Platform</span>
          </Link>

          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
             <SearchBar />
          </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative group p-2 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-black" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER DROPDOWN LOGIC */}
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-4 rounded-full border hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate">{session.user?.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b mb-1">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold truncate">{session.user?.email}</p>
                    </div>
                    
                    <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    
                    {/* Admin Link if role is ADMIN */}
                    {session.user?.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 font-bold hover:bg-indigo-50">
                          ⚡ Admin Panel
                        </Link>
                    )}

                    <div className="border-t mt-1 pt-1">
                      <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}