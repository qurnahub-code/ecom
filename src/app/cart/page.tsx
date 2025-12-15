// src/app/cart/page.tsx
"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="group flex gap-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-300 transition-all">
              
              {/* Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                )}
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 leading-tight">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.category || "General"}</p>
                  </div>
                  <p className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                {/* Controls */}
                <div className="flex justify-between items-center mt-4">
                  {/* Quantity Controller */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-700 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-700 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-2xl sticky top-24 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Estimate</span>
                <span className="text-green-600 font-medium">Calculated next</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Estimate</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-xl text-gray-900 mt-4">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/checkout" 
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 group"
            >
              Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Secure Checkout powered by Stripe (Mock)
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}