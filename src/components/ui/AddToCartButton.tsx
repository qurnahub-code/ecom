// src/components/ui/AddToCartButton.tsx
"use client"

import { useCart } from "@/context/CartContext"
import { useState } from "react"

export function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleClick = () => {
    addToCart(product)
    
    // Show a little "Added!" feedback animation
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex-1 py-4 px-8 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 ${
        isAdded 
          ? "bg-green-600 text-white hover:bg-green-700" 
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {isAdded ? "Added to Cart! ✓" : "Add to Cart"}
    </button>
  )
}