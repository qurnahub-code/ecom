// src/context/CartContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  imageUrl?: string
  quantity: number
  category?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (id: string) => void        // [NEW] Remove specific item
  updateQuantity: (id: string, qty: number) => void // [NEW] Change quantity
  clearCart: () => void 
  cartCount: number
  cartTotal: number                           // [NEW] Auto-calculated total
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
    setIsLoaded(true)
  }, [])

  // Save to LocalStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  // 1. Add to Cart
  const addToCart = (product: any) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentItems, { 
        id: product.id, 
        name: product.name, 
        price: Number(product.price), 
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: 1 
      }]
    })
  }

  // 2. Remove Item [NEW]
  const removeFromCart = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  // 3. Update Quantity [NEW]
  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(id) // If user goes below 1, remove item
      return
    }
    setItems((current) => 
      current.map((item) => item.id === id ? { ...item, quantity: qty } : item)
    )
  }

  const clearCart = () => {
    setItems([])
    if (typeof window !== 'undefined') localStorage.removeItem("cart")
  }

  // Calculated Values
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount,
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}