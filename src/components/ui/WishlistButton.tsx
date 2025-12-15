"use client"

import { Heart } from "lucide-react"
import { useState } from "react"
import { toggleWishlist } from "@/app/actions/wishlist"
import { useRouter } from "next/navigation"

export function WishlistButton({ productId, initialIsActive }: { productId: string, initialIsActive: boolean }) {
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigating if inside a Link
    setIsLoading(true)

    const res = await toggleWishlist(productId)
    
    if (res.success) {
      setIsActive(res.action === 'added')
    } else {
      // If not logged in, redirect to login
      if (res.message === "Please login first") {
        router.push("/login")
      }
    }
    setIsLoading(false)
  }

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className={`p-3 rounded-full shadow-sm transition-all ${
        isActive 
          ? "bg-red-50 text-red-500 border border-red-200" 
          : "bg-white text-gray-400 border border-gray-200 hover:text-red-500 hover:border-red-200"
      }`}
    >
      <Heart className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
    </button>
  )
}