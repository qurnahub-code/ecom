"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { 
  Package, MapPin, CreditCard, Star, LogOut, 
  LayoutDashboard, Truck, User as UserIcon, Plus 
} from "lucide-react"
import { getUserDashboard, addAddress, addPaymentMethod, submitReview } from "@/app/actions/user"
import { formatPrice, formatDate, renderStars } from "@/lib/shop-utils"
import Link from "next/link"

// Simple loading skeleton if needed
function Loading() {
  return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Dashboard...</div>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  // Fetch data on load
  useState(() => {
    if (status === "authenticated") {
      getUserDashboard().then(res => {
        setData(res)
        setLoading(false)
      })
    }
  })

  if (status === "loading" || loading) return <Loading />
  if (status === "unauthenticated") return <div className="p-10 text-center">Please log in.</div>

  // --- SUB-COMPONENTS ---

  const OverviewTab = () => {
    // Find active order (Status not delivered/cancelled)
    const activeOrder = data.orders.find((o: any) => ['PENDING', 'SHIPPED'].includes(o.status))

    return (
      <div className="space-y-6">
        {/* Shipment Tracker */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5"/> Shipment Status
          </h3>
          {activeOrder ? (
            <div>
              <div className="flex justify-between text-sm opacity-90 mb-2">
                <span>Order #{activeOrder.id.slice(0,8)}</span>
                <span className="font-bold uppercase tracking-wider">{activeOrder.status}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000" 
                  style={{ width: activeOrder.status === 'SHIPPED' ? '60%' : '10%' }}
                ></div>
              </div>
              <p className="text-sm">Estimated Delivery: {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="opacity-80">No active shipments. Time to shop!</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border text-center">
            <div className="text-2xl font-bold">{data.orders.length}</div>
            <div className="text-xs text-gray-500 uppercase">Orders</div>
          </div>
          <div className="bg-white p-4 rounded-xl border text-center">
            <div className="text-2xl font-bold">{data.reviews.length}</div>
            <div className="text-xs text-gray-500 uppercase">Reviews</div>
          </div>
          <div className="bg-white p-4 rounded-xl border text-center">
            <div className="text-2xl font-bold">{data.wishlist?.length || 0}</div>
            <div className="text-xs text-gray-500 uppercase">Saved</div>
          </div>
        </div>
      </div>
    )
  }

  const OrdersTab = () => (
    <div className="space-y-4">
      <h2 className="font-bold text-xl mb-4">Order History</h2>
      {data.orders.map((order: any) => (
        <div key={order.id} className="bg-white border rounded-xl p-4 hover:shadow-sm transition">
          <div className="flex justify-between items-start mb-4 border-b pb-3">
            <div>
              <p className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</p>
              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className="block font-bold">{formatPrice(order.totalAmount)}</span>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                {order.status}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gray-100 rounded bg-cover bg-center" style={{backgroundImage: `url(${item.product.imageUrl || '/placeholder.jpg'})`}}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const ReviewsTab = () => (
    <div className="space-y-8">
      {/* Pending Reviews */}
      {data.pendingReviews.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 text-orange-600">Waiting for Review</h3>
          <div className="grid gap-4">
            {data.pendingReviews.map((product: any) => (
              <div key={product.id} className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg bg-cover" style={{backgroundImage: `url(${product.imageUrl})`}}></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-orange-500">How was it?</p>
                </div>
                <form action={async (fd) => {
                    await submitReview(product.id, Number(fd.get('rating')), fd.get('comment') as string)
                    window.location.reload() // Quick refresh
                }} className="flex gap-2">
                    <select name="rating" className="bg-white border rounded text-sm p-1">
                        <option value="5">5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="3">3 ★</option>
                    </select>
                    <input name="comment" placeholder="Write a thought..." className="bg-white border rounded text-sm p-1 w-32" required />
                    <button className="bg-black text-white px-3 rounded text-xs font-bold">Post</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Reviews */}
      <div>
        <h3 className="font-bold text-lg mb-4">Past Reviews</h3>
        {data.reviews.map((review: any) => (
            <div key={review.id} className="bg-white border rounded-xl p-4 mb-3">
                <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">{review.product.name}</span>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex text-yellow-400 mb-2 gap-0.5">
                    {renderStars(review.rating).map((f, i) => <Star key={i} size={12} className={f ? "fill-current" : "text-gray-200"} />)}
                </div>
                <p className="text-sm text-gray-600">"{review.comment}"</p>
            </div>
        ))}
      </div>
    </div>
  )

  const AddressesTab = () => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl">Address Book</h2>
        </div>
        
        <div className="grid gap-4 mb-8">
            {data.addresses.map((addr: any) => (
                <div key={addr.id} className="border p-4 rounded-xl relative group bg-white">
                    <p className="font-bold text-sm">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.postalCode}</p>
                    <p className="text-xs text-gray-400 mt-2">{addr.phone}</p>
                    {addr.isDefault && <span className="absolute top-4 right-4 bg-gray-100 text-[10px] font-bold px-2 py-1 rounded">DEFAULT</span>}
                </div>
            ))}
        </div>

        {/* Add Address Form */}
        <form action={async (fd) => { await addAddress(fd); window.location.reload(); }} className="bg-gray-50 p-6 rounded-2xl border">
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-500">Add New Address</h3>
            <div className="grid gap-3">
                <input name="fullName" placeholder="Full Name" className="p-2 border rounded" required />
                <input name="street" placeholder="Street Address" className="p-2 border rounded" required />
                <div className="grid grid-cols-2 gap-3">
                    <input name="city" placeholder="City" className="p-2 border rounded" required />
                    <input name="postalCode" placeholder="Postal Code" className="p-2 border rounded" required />
                </div>
                <input name="phone" placeholder="Phone Number" className="p-2 border rounded" required />
                <button className="bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">Save Address</button>
            </div>
        </form>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border p-6 text-center mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                    {session?.user?.name?.[0] || "U"}
                </div>
                <h2 className="font-bold truncate">{session?.user?.name}</h2>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>

            <nav className="space-y-2">
                {[
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'orders', icon: Package, label: 'Orders' },
                    { id: 'addresses', icon: MapPin, label: 'Addresses' },
                    { id: 'reviews', icon: Star, label: 'Reviews' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                            activeTab === item.id 
                            ? 'bg-black text-white shadow-lg' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon size={18} /> {item.label}
                    </button>
                ))}
                <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'addresses' && <AddressesTab />}
        </div>

      </div>
    </div>
  )
}