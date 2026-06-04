"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, MapPin, Calendar, CreditCard, Clock, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/shop-utils" // Ensure you have this or use your own helper

// Helper to calculate progress based on status
const getStepStatus = (currentStatus: string) => {
  const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentIndex = steps.indexOf(currentStatus.toUpperCase())
  return currentIndex === -1 ? 0 : currentIndex + 1
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return
    
    setLoading(true)
    setError("")
    setOrder(null)

    try {
      // Mock API call - Replace with your actual endpoint: `/api/orders/${orderId}`
      const res = await fetch(`/api/orders/${orderId}`)
      
      if (!res.ok) {
          // If 404, throw error
          if(res.status === 404) throw new Error("Order not found")
          throw new Error("Something went wrong")
      }
      
      const data = await res.json()
      setOrder(data)
    } catch (err: any) {
      setError(err.message || "Invalid Order ID. Please check and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your Order ID found in your confirmation email.
          </p>
        </div>

        {/* --- SEARCH BOX --- */}
        <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 mb-10">
            <form onSubmit={checkOrder} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Order ID (e.g., clq8...)"
                        required
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl py-4 pl-12 pr-4 text-base focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                </div>
                <button 
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Clock className="w-5 h-5 animate-spin" /> : "Track"}
                </button>
            </form>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 mb-8 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
            </div>
        )}

        {/* --- ORDER DETAILS RESULT --- */}
        {order && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                
                {/* 1. Status Card with Stepper */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order Status</p>
                            <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{order.status}</h2>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Delivery</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {/* Mock logic: +5 days from creation */}
                                {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-zinc-800 -translate-y-1/2 rounded-full" />
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(getStepStatus(order.status) / 4) * 100}%` }}
                        />
                        <div className="relative flex justify-between">
                            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                                const active = i < getStepStatus(order.status)
                                return (
                                    <div key={step} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-300'}`}>
                                            {i === 0 && <Clock className="w-4 h-4" />}
                                            {i === 1 && <Package className="w-4 h-4" />}
                                            {i === 2 && <Truck className="w-4 h-4" />}
                                            {i === 3 && <CheckCircle className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-xs font-bold ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>{step}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Shipping Info */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-500" /> Shipping Details
                        </h3>
                        {/* Assuming API returns address relation or fields */}
                        {order.addresses?.[0] ? (
                            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                <p className="font-bold text-gray-900 dark:text-white">{order.addresses[0].fullName}</p>
                                <p>{order.addresses[0].street}</p>
                                <p>{order.addresses[0].city}, {order.addresses[0].postalCode}</p>
                                <p>{order.addresses[0].country}</p>
                                <p className="mt-2 text-indigo-500">{order.addresses[0].phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Address info unavailable</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-indigo-500" /> Payment Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-medium text-gray-900 dark:text-white">Credit Card (**** 1234)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date</span>
                                <span className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between text-lg font-black">
                                <span className="text-gray-900 dark:text-white">Total</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Items List */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-500" /> Order Items ({order.items?.length || 0})
                    </h3>
                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4 py-2">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 shrink-0">
                                    {item.product?.images?.[0]?.url ? (
                                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package className="w-6 h-6 opacity-30" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white truncate">{item.product?.name || "Product Name"}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price)}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        )}

      </div>
    </div>
  )
}