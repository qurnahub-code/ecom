"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { placeOrder } from "@/app/actions/checkout" // ✅ Import the Server Action
import { useCart } from "@/context/CartContext"
import { 
  Loader2, CreditCard, Truck, MapPin, Phone, 
  AlertCircle, CheckCircle, Smartphone, Banknote, X, ShieldCheck
} from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, cartTotal, clearCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [fetchingAddress, setFetchingAddress] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "JAZZCASH" | "EASYPAISA" | "CARD">("COD")
  
  // --- CARD LOGIC STATES ---
  const [showCardModal, setShowCardModal] = useState(false)
  const [isCardVerified, setIsCardVerified] = useState(false)
  const [cardVerifying, setCardVerifying] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  })

  // Manual Payment Details
  const [paymentData, setPaymentData] = useState({
    transactionId: "", 
    paymentPhone: ""   
  })

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    country: "Pakistan" // Default country
  })

  // --- 1. AUTH & ADDRESS LOGIC ---
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout")
    }
    
    if (status === "authenticated" && session?.user) {
      setFormData(prev => ({ ...prev, fullName: session.user?.name || "" }))
      
      // Attempt to fetch saved address (Optional - keep if you have this API)
      fetch("/api/user/addresses")
        .then(res => res.json())
        .then(addresses => {
          if (Array.isArray(addresses) && addresses.length > 0) {
            const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0]
            setFormData(prev => ({
              ...prev,
              address: defaultAddr.street,
              city: defaultAddr.city,
              postalCode: defaultAddr.postalCode,
              phone: defaultAddr.phone,
              fullName: defaultAddr.fullName || prev.fullName
            }))
          }
        })
        .catch(() => console.log("No saved addresses found")) // Silent fail
        .finally(() => setFetchingAddress(false))
    } else {
      setFetchingAddress(false)
    }
  }, [status, router, session])

  // --- 2. CARD HANDLERS ---
  const handleCardClick = () => {
    if (isCardVerified) {
        setPaymentMethod("CARD")
    } else {
        setShowCardModal(true)
    }
  }

  const verifyCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setCardVerifying(true)
    setTimeout(() => {
        setCardVerifying(false)
        setIsCardVerified(true)
        setPaymentMethod("CARD")
        setShowCardModal(false)
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // --- 3. CHECKOUT HANDLER (Updated Logic) ---
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // A. Validation
    if ((paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA") && !paymentData.transactionId) {
      setError(`Please enter the ${paymentMethod} Transaction ID/TRX.`)
      setLoading(false)
      return
    }

    if (paymentMethod === "CARD" && !isCardVerified) {
        setError("Please add and verify your card details.")
        setLoading(false)
        return
    }

    // B. Prepare Data for Server Action
    // We must map our State object to a standard FormData object
    const submitData = new FormData()
    
    // Shipping Info
    submitData.append("address", formData.address)
    submitData.append("city", formData.city)
    submitData.append("postalCode", formData.postalCode)
    submitData.append("country", formData.country)
    submitData.append("phone", formData.phone)
    
    // Payment Info
    submitData.append("paymentMethod", paymentMethod)
    
    // Optional: Pass custom payment data if your server action is updated to handle them
    // (Note: The basic placeOrder function receives FormData, so standard fields work best. 
    // If you need to save TRX ID, ensure your Prisma schema and placeOrder function support it)

    try {
      // ✅ C. Call Server Action
      // We pass the Cart Items and Total directly, plus the FormData
      await placeOrder(items, cartTotal, submitData)
      
      // Note: placeOrder contains a `redirect()`. 
      // Next.js will interrupt execution here to navigate to the success page.
      
    } catch (err: any) {
      // Ignore Next.js Redirect errors (they are actually successful)
      if (err.message === "NEXT_REDIRECT") {
          setSuccess(true)
          clearCart()
          return
      }
      
      console.error(err)
      setError(err.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
  const labelClass = "text-xs font-bold text-muted-foreground uppercase tracking-wider"
  const cardClass = "bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm transition-all"

  if (status === "loading" || fetchingAddress) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground relative overflow-hidden flex justify-center py-12 px-4 transition-colors duration-300">
      
      {/* --- SUCCESS OVERLAY --- */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-zinc-900 border border-border p-12 rounded-3xl text-center shadow-2xl max-w-sm w-full"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Order Placed!</h2>
              <p className="text-muted-foreground mb-6">Redirecting to receipt...</p>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CARD MODAL (Unchanged) --- */}
      <AnimatePresence>
        {showCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-zinc-900 border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" /> Add New Card
                        </h3>
                        <button onClick={() => setShowCardModal(false)} className="p-2 hover:bg-muted rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={verifyCard} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Card Number</label>
                                <div className="relative mt-1">
                                    <input 
                                            required 
                                            placeholder="0000 0000 0000 0000" 
                                            className={inputClass + " pl-10 font-mono"}
                                            value={cardDetails.number}
                                            maxLength={19}
                                            onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                                    />
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Expiry</label>
                                    <input 
                                            required 
                                            placeholder="MM/YY" 
                                            className={inputClass + " mt-1"} 
                                            maxLength={5}
                                            value={cardDetails.expiry}
                                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>CVC</label>
                                    <input 
                                            required 
                                            placeholder="123" 
                                            className={inputClass + " mt-1"} 
                                            maxLength={3}
                                            type="password"
                                            value={cardDetails.cvc}
                                            onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Cardholder Name</label>
                                <input 
                                    required 
                                    placeholder="John Doe" 
                                    className={inputClass + " mt-1"} 
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input 
                                    type="checkbox" 
                                    id="saveCard" 
                                    checked={saveCard}
                                    onChange={(e) => setSaveCard(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                                />
                                <label htmlFor="saveCard" className="text-sm font-medium cursor-pointer select-none">
                                    Save this card securely
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={cardVerifying}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            {cardVerifying ? (
                                <>Authenticating <Loader2 className="w-4 h-4 animate-spin" /></>
                            ) : (
                                <>Verify & Add Card <ShieldCheck className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* LEFT COLUMN: FORM */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-2">Securely complete your purchase.</p>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            
            {/* 1. SHIPPING DETAILS */}
            <div className={cardClass}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="text-primary w-5 h-5" /> Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="group">
                    <label className={labelClass}>Full Name</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Ali Khan" className={inputClass} />
                </div>
                <div className="group">
                    <label className={labelClass}>Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="House 123, Street 4, DHA" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className={labelClass}>City</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="Lahore" className={inputClass} />
                    </div>
                  <div>
                      <label className={labelClass}>Postal Code</label>
                      <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="54000" className={inputClass} />
                  </div>
                </div>
                <div className="group">
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0300 1234567" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                {/* Hidden Country Input used for FormData */}
                <input type="hidden" name="country" value={formData.country} />
              </div>
            </div>

            {/* 2. PAYMENT METHOD */}
            <div className={cardClass}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Banknote className="text-primary w-5 h-5" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <button type="button" onClick={() => setPaymentMethod("COD")} 
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "COD" ? "bg-primary text-white border-primary ring-2 ring-primary/30" : "bg-background border-input hover:bg-muted"}`}>
                  <Truck className="w-6 h-6" /> <span className="font-bold text-sm">COD</span>
                </button>
                
                {/* Card Button */}
                <button type="button" onClick={handleCardClick} 
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "CARD" ? "bg-primary text-white border-primary ring-2 ring-primary/30" : "bg-background border-input hover:bg-muted"}`}>
                  {isCardVerified ? <ShieldCheck className="w-6 h-6 text-white" /> : <CreditCard className="w-6 h-6" />} 
                  <span className="font-bold text-sm">
                    {isCardVerified ? `Visa •• ${cardDetails.number.slice(-4)}` : "Card"}
                  </span>
                </button>
                
                {/* JazzCash */}
                <button type="button" onClick={() => setPaymentMethod("JAZZCASH")} 
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "JAZZCASH" ? "bg-red-600 text-white border-red-600 ring-2 ring-red-600/30" : "bg-background border-input hover:bg-muted"}`}>
                  <Smartphone className="w-6 h-6" /> <span className="font-bold text-sm">JazzCash</span>
                </button>

                {/* EasyPaisa */}
                <button type="button" onClick={() => setPaymentMethod("EASYPAISA")} 
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "EASYPAISA" ? "bg-green-600 text-white border-green-600 ring-2 ring-green-600/30" : "bg-background border-input hover:bg-muted"}`}>
                  <Smartphone className="w-6 h-6" /> <span className="font-bold text-sm">EasyPaisa</span>
                </button>
              </div>

              {/* Verified Card Banner */}
              {isCardVerified && paymentMethod === "CARD" && (
                 <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 text-white p-2 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">Card Verified Successfully</p>
                            <p className="text-xs text-muted-foreground">Visa ending in {cardDetails.number.slice(-4)}</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => setShowCardModal(true)} className="text-xs font-bold text-primary hover:underline">
                        Change
                    </button>
                 </div>
              )}

              {/* MANUAL PAYMENT SOURCE INPUT */}
              <AnimatePresence>
                {(paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA") && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted/50 p-4 rounded-xl border border-dashed border-primary/30 mt-4 space-y-4">
                      <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div className="text-sm text-muted-foreground">
                             <p className="font-bold text-foreground">Instructions:</p>
                             Send <strong>PKR {cartTotal.toLocaleString()}</strong> to <span className="font-mono bg-muted px-1 rounded">0300-1234567</span>.
                             <br/>Enter the sender details below for verification.
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className={labelClass}>Sender Phone / Account</label>
                           <input 
                             placeholder="03XX-XXXXXXX" 
                             className={inputClass}
                             value={paymentData.paymentPhone}
                             onChange={(e) => setPaymentData({...paymentData, paymentPhone: e.target.value})}
                           />
                        </div>
                        <div>
                           <label className={labelClass}>Transaction ID (TRX)</label>
                           <input 
                             placeholder="e.g. 8H3K9L2M" 
                             className={inputClass}
                             value={paymentData.transactionId}
                             onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                           />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}
          </form>
        </motion.div>

        {/* RIGHT COLUMN: SUMMARY */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="sticky top-8 space-y-6">
            <div className={cardClass + " shadow-2xl border-primary/10"}>
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-mono text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-border"><span>Total</span><span>${cartTotal.toLocaleString()}</span></div>
              </div>

              <button
                type="submit" form="checkout-form" disabled={loading || success}
                className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Order"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}