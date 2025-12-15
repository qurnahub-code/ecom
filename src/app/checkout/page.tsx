"use client"

import { useCart } from "@/context/CartContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Truck, Phone } from "lucide-react"
import Link from "next/link"
import { processJazzCash, processEasyPaisa } from "@/app/actions/payment"

export default function CheckoutPage() {
  const { items, cartCount, clearCart, cartTotal } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cod") // Default COD
  const router = useRouter()

  // Calculate Totals
  const shippingCost = 200 // PKR
  const total = cartTotal + shippingCost

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const mobileNumber = formData.get("paymentPhone") as string
    
    // 1. First, Create the Order (Pending State)
    // We send data to our internal API first to create the record
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        shippingDetails: {
            fullName: formData.get("fullName"),
            address: formData.get("address"),
            city: formData.get("city"),
            phone: formData.get("phone"),
            postalCode: "00000"
        },
        paymentMethod: paymentMethod,
        total
      })
    })

    const orderData = await orderRes.json()

    if (!orderData.success) {
        alert("Failed to create order")
        setIsSubmitting(false)
        return
    }

    // 2. Process Payment based on selection
    let paymentResult = { success: true, message: "" }

    if (paymentMethod === "jazzcash") {
        paymentResult = await processJazzCash(total, mobileNumber, orderData.orderId)
    } else if (paymentMethod === "easypaisa") {
        paymentResult = await processEasyPaisa(total, mobileNumber, orderData.orderId)
    }

    // 3. Handle Result
    if (paymentResult.success) {
        clearCart()
        router.push(`/order-confirmation/${orderData.orderId}`)
    } else {
        alert(`Payment Error: ${paymentResult.message}`)
    }
    
    setIsSubmitting(false)
  }

  if (cartCount === 0) return <div className="p-20 text-center">Your cart is empty.</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Link href="/cart" className="text-gray-500 hover:text-black flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-900">Checkout</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: Details */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Shipping Details
              </h2>
              <div className="grid gap-4">
                <input name="fullName" required placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" />
                <input name="address" required placeholder="Street Address" className="w-full px-4 py-2 border rounded-lg" />
                <input name="city" required placeholder="City" className="w-full px-4 py-2 border rounded-lg" />
                <input name="phone" required placeholder="Contact Number (03...)" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            {/* PAYMENT METHOD SELECTION */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Phone className="w-5 h-5" /> Payment Method
              </h2>

              <div className="space-y-3">
                {/* 1. JazzCash */}
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'jazzcash' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="jazzcash" onChange={() => setPaymentMethod('jazzcash')} className="accent-red-600" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">JC</div>
                    <div>
                        <span className="block font-bold text-gray-900">JazzCash Mobile Account</span>
                        <span className="block text-xs text-gray-500">Pay via App (MPIN required)</span>
                    </div>
                  </div>
                </label>

                {/* 2. EasyPaisa */}
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'easypaisa' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="easypaisa" onChange={() => setPaymentMethod('easypaisa')} className="accent-green-600" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">EP</div>
                    <div>
                        <span className="block font-bold text-gray-900">EasyPaisa Wallet</span>
                        <span className="block text-xs text-gray-500">Pay via App</span>
                    </div>
                  </div>
                </label>

                {/* 3. COD */}
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="cod" onChange={() => setPaymentMethod('cod')} className="accent-black" />
                  <div>
                    <span className="block font-bold text-gray-900">Cash on Delivery</span>
                    <span className="block text-xs text-gray-500">Pay when you receive the package.</span>
                  </div>
                </label>
              </div>

              {/* Mobile Number Input (Only for Online Payment) */}
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                  <div className="mt-6 animate-in slide-in-from-top-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                          Enter {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Mobile Number
                      </label>
                      <input 
                        name="paymentPhone" 
                        required 
                        placeholder="03XXXXXXXXX" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none font-mono text-lg"
                        pattern="^03[0-9]{9}$"
                        title="Please enter a valid 11 digit mobile number starting with 03"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                          * You will receive a popup on this number to enter your MPIN.
                      </p>
                  </div>
              )}
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:sticky lg:top-24 h-fit bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              {/* List items... */}
              <div className="space-y-2 mb-6 text-sm">
                  {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>Rs. {Math.round(item.price * item.quantity)}</span>
                      </div>
                  ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>Rs. {Math.round(cartTotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>Rs. {shippingCost}</span></div>
                  <div className="flex justify-between font-bold text-xl mt-2"><span>Total</span><span>Rs. {Math.round(total)}</span></div>
              </div>
              
              <button disabled={isSubmitting} className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50">
                  {isSubmitting ? "Processing..." : `Pay Rs. ${Math.round(total)}`}
              </button>
          </div>

        </form>
      </div>
    </div>
  )
}