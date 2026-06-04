"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Package, MapPin, CreditCard, User, LogOut, 
  ChevronRight, Box, Star, Plus, X, Loader2, MessageSquare, Edit
} from "lucide-react"
import { signOut } from "next-auth/react"
import { addAddress, addPaymentMethod } from "@/app/actions/user"
import { ReviewForm } from "@/components/products/ReviewForm"
import { renderStars } from "@/lib/shop-utils"

export function DashboardClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reviewModalData, setReviewModalData] = useState<{ product: any, review?: any } | null>(null)

  // Stats
  const totalOrders = user.orders.length
  const totalSpent = user.orders.reduce((acc: number, order: any) => acc + Number(order.totalAmount), 0)
  const activeOrders = user.orders.filter((o: any) => o.status === "PENDING" || o.status === "SHIPPED").length
  const totalReviews = user.reviews?.length || 0

  async function handleAddAddress(formData: FormData) {
    setLoading(true)
    await addAddress(formData)
    setLoading(false)
    setShowAddressModal(false)
  }

  async function handleAddCard(formData: FormData) {
    setLoading(true)
    await addPaymentMethod(formData)
    setLoading(false)
    setShowCardModal(false)
  }

  // --- REVIEWS TAB ---
  const ReviewsTab = () => (
    <div className="space-y-8">
        {/* Pending Reviews */}
        {user.pendingReviews && user.pendingReviews.length > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-indigo-500 fill-indigo-500" /> Pending Reviews
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.pendingReviews.map((product: any) => (
                        <div key={product.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl flex items-center gap-4 border border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <Box className="p-2 opacity-20"/>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate text-gray-900 dark:text-white">{product.name}</p>
                                <button 
                                    onClick={() => setReviewModalData({ product })}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-1"
                                >
                                    Write a Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* History */}
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">My Reviews History ({totalReviews})</h3>
            {user.reviews && user.reviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {user.reviews.map((review: any) => (
                        <div key={review.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group">
                             <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                                        {review.product?.images?.[0]?.url ? <img src={review.product.images[0].url} className="w-full h-full object-cover" /> : <MessageSquare className="w-5 h-5 opacity-20 m-auto"/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{review.product?.name}</p>
                                        <div className="flex text-yellow-400 mt-1">
                                            {renderStars(review.rating).map((isFilled, i) => <Star key={i} className={`w-3 h-3 ${isFilled ? "fill-current" : "text-gray-200 dark:text-zinc-700"}`} />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    <button 
                                        onClick={() => setReviewModalData({ product: review.product, review: review })}
                                        className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Edit className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                             </div>
                             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl">"{review.comment}"</p>
                             {review.images && review.images.length > 0 && (
                                 <div className="flex gap-2 mt-3">
                                     {review.images.map((img: string, i: number) => <img key={i} src={img} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-white/10" />)}
                                 </div>
                             )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <Star className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">You haven't written any reviews yet.</p>
                </div>
            )}
        </div>
    </div>
  )

  const OrdersTab = () => (
    <div className="space-y-4">
      {user.orders.length === 0 ? (
        <div className="text-center py-12 bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
           <Box className="w-12 h-12 mx-auto text-gray-400 mb-3" />
           <p className="text-gray-500">No orders placed yet.</p>
        </div>
      ) : (
        user.orders.map((order: any) => (
          <div key={order.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all">
             <div className="flex justify-between items-center">
                 <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Order #{order.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">{order.status} • {new Date(order.createdAt).toLocaleDateString()}</p>
                 </div>
                 <p className="font-black text-xl text-gray-900 dark:text-white">${Number(order.totalAmount).toFixed(2)}</p>
             </div>
          </div>
        ))
      )}
    </div>
  )

  const AddressesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {user.addresses.map((addr: any) => (
        <div key={addr.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
           <p className="font-bold text-gray-900 dark:text-white">{addr.fullName}</p>
           <p className="text-sm text-gray-500">{addr.street}, {addr.city}</p>
        </div>
      ))}
      <button onClick={() => setShowAddressModal(true)} className="flex flex-col items-center justify-center gap-2 h-full min-h-[150px] border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all">
        <Plus className="w-5 h-5" /><span className="font-bold text-sm">Add New Address</span>
      </button>
    </div>
  )

  const WalletTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {user.paymentMethods.map((card: any) => (
        <div key={card.id} className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl aspect-[1.58/1] flex flex-col justify-between">
           <div className="flex justify-between"><span className="text-xs opacity-70">{card.type}</span><CreditCard className="w-6 h-6"/></div>
           <p className="font-mono text-lg tracking-widest">•••• {card.last4}</p>
           <div className="flex justify-between text-xs opacity-70"><span>{user.name}</span><span>{card.expiry}</span></div>
        </div>
      ))}
      <button onClick={() => setShowCardModal(true)} className="flex flex-col items-center justify-center gap-2 h-full min-h-[150px] border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all aspect-[1.58/1]">
        <Plus className="w-6 h-6" /><span className="font-bold text-sm">Add New Card</span>
      </button>
    </div>
  )

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wallet", label: "Wallet", icon: CreditCard },
  ]

  const inputClass = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-gray-200 dark:border-white/5 rounded-2xl p-2 sticky top-24">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'reviews' && user.pendingReviews?.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{user.pendingReviews.length}</span>}
              </button>
            ))}
            <div className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-4" />
            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "overview" && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg"><p className="text-indigo-100 text-sm">Total Orders</p><p className="text-3xl font-black mt-1">{totalOrders}</p></div>
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 p-6 rounded-2xl"><p className="text-gray-500 text-sm">Active Shipments</p><p className="text-3xl font-black mt-1 dark:text-white">{activeOrders}</p></div>
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 p-6 rounded-2xl"><p className="text-gray-500 text-sm">Reviews Written</p><p className="text-3xl font-black mt-1 dark:text-white">{totalReviews}</p></div>
                   </div>
                   <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                      <OrdersTab />
                   </div>
                </div>
              )}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "reviews" && <ReviewsTab />}
              {activeTab === "addresses" && <AddressesTab />}
              {activeTab === "wallet" && <WalletTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showAddressModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative"><button onClick={() => setShowAddressModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button><h2 className="text-xl font-bold mb-4 dark:text-white">Add Address</h2><form action={handleAddAddress} className="space-y-4"><input name="fullName" placeholder="Name" required className={inputClass} /><input name="street" placeholder="Street" required className={inputClass} /><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{loading ? <Loader2 className="animate-spin"/> : "Save"}</button></form></motion.div>
           </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCardModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative"><button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button><h2 className="text-xl font-bold mb-4 dark:text-white">Add Card</h2><form action={handleAddCard} className="space-y-4"><input name="cardNumber" placeholder="Card Number" required className={inputClass} /><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{loading ? <Loader2 className="animate-spin"/> : "Save"}</button></form></motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {reviewModalData && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <button onClick={() => setReviewModalData(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full z-10"><X className="w-5 h-5"/></button>
                  <div className="mb-6"><h2 className="text-xl font-bold text-gray-900 dark:text-white">{reviewModalData.review ? "Edit Review" : "Write Review"}</h2><p className="text-sm text-gray-500 dark:text-gray-400">Product: <span className="font-bold text-indigo-500">{reviewModalData.product.name}</span></p></div>
                  <ReviewForm productId={reviewModalData.product.id} initialRating={reviewModalData.review?.rating || 0} initialComment={reviewModalData.review?.comment || ""} initialImages={reviewModalData.review?.images || []} isEditing={!!reviewModalData.review} onSuccess={() => setReviewModalData(null)} />
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </>
  )
}