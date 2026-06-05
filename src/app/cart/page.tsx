"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { validateCoupon } from "@/app/actions/coupon" // Ensure this action exists
import Link from "next/link"
import { formatPrice, SITE_CONFIG } from "@/lib/shop-utils"
import { 
  Trash2, Minus, Plus, ShoppingBag, ArrowRight, 
  Tag, Truck, ArrowLeft, PackageCheck, Loader2, AlertCircle 
} from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart()
  
  // Coupon States
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Free Shipping Logic (Configurable)
  const freeShippingThreshold = SITE_CONFIG.freeShippingThreshold
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100)
  const remainingForFreeShip = Math.max(freeShippingThreshold - cartTotal, 0)

  // Totals Calculation
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const finalTotal = Math.max(cartTotal - discountAmount, 0)

  // --- HANDLER: Apply Coupon ---
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponMessage(null)
    setAppliedCoupon(null) // Reset previous coupon

    try {
      // Call Server Action
      const result = await validateCoupon(couponCode, cartTotal)

      if (result.valid) {
        setAppliedCoupon({ code: result.code!, discount: result.discount! })
        setCouponMessage({ type: 'success', text: result.message! })
      } else {
        setCouponMessage({ type: 'error', text: result.message! })
      }
    } catch (error) {
      setCouponMessage({ type: 'error', text: "Something went wrong. Try again." })
    } finally {
      setCouponLoading(false)
    }
  }

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-zinc-950 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="relative z-10 max-w-md w-full">
          <div className="w-24 h-24 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl">
            <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link 
            href="/products" 
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold transition-all hover:scale-105"
          >
            Start Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
             Shopping Cart <span className="text-gray-400 dark:text-zinc-600 text-lg font-medium ml-2">({items.length} items)</span>
           </h1>
           <Link href="/products" className="hidden md:flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
             <ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* --- LEFT: Item List (Span 8) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free Shipping Progress Bar */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
               <div className="flex items-center gap-3 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Truck className="w-5 h-5 text-indigo-500" />
                  {remainingForFreeShip > 0 ? (
                    <span>Add <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formatPrice(remainingForFreeShip)}</span> more for free shipping</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">You've unlocked Free Shipping! 🎉</span>
                  )}
               </div>
               <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progress}%` }}
                 />
               </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="group relative flex gap-4 md:gap-6 p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm transition-all hover:border-indigo-100 dark:hover:border-indigo-500/20">
                  
                  {/* Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-zinc-800 rounded-xl shrink-0 overflow-hidden relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.category || "General"}</p>
                      </div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      <div className="flex items-center bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-1 border border-gray-200 dark:border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition shadow-sm disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                      >
                        <Trash2 className="w-4 h-4" /> 
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: Order Summary (Span 4) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                
                {/* Coupon Code Section */}
                <div className="mb-6">
                   <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Coupon Code" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white uppercase"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={couponLoading || !couponCode}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </button>
                   </form>

                   {/* Coupon Messages */}
                   {couponMessage && (
                     <div className={`mt-3 text-xs flex items-center gap-2 font-medium ${
                       couponMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                     }`}>
                       {couponMessage.type === 'success' ? <PackageCheck className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                       {couponMessage.text}
                     </div>
                   )}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 animate-in fade-in">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{formatPrice(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {remainingForFreeShip > 0 ? "Calculated next" : "Free"}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-white/10 pt-4 flex justify-between items-end">
                    <span className="text-gray-900 dark:text-white font-bold">Total</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link 
                  href="/checkout" 
                  className="group relative w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                </Link>
                
                {/* REMOVED: Payment Icons (as requested) */}
              </div>
              
              {/* Order Note */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Order Instructions</h3>
                 <textarea 
                   placeholder="Add special instructions for delivery..."
                   className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none h-20"
                 ></textarea>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}