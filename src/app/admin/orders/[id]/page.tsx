import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/lib/shop-utils"
import { updateOrderStatus } from "@/app/actions/admin"
import DeleteOrderButton from "@/components/admin/DeleteOrderButton"
import PageAnimation from "@/components/PageAnimation" // ✅ Import Animation
import { 
  ArrowLeft, Calendar, Mail, MapPin, Phone, 
  CreditCard, Package, Truck, CheckCircle, XCircle, Trash2 
} from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  if (!order) notFound()

  // Helper for Status Badge (Theme Aware)
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50/50 dark:bg-zinc-950 min-h-screen transition-colors duration-300">
      <PageAnimation>
        
        {/* 1. HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex items-start gap-4">
            <Link 
              href="/admin/orders" 
              className="p-3 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
                      {order.status}
                  </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" /> Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Status Actions */}
          <div className="flex gap-3">
              <form action={updateOrderStatus.bind(null, order.id, "SHIPPED")}>
                <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl font-bold text-sm transition-all hover:scale-105">
                  <Truck className="w-4 h-4" /> Ship Order
                </button>
              </form>
              <form action={updateOrderStatus.bind(null, order.id, "CANCELLED")}>
                <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-red-600 dark:text-red-400 border border-gray-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-sm">
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </form>
              <DeleteOrderButton orderId={order.id} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 2. LEFT COLUMN: SHIPPING & ITEMS */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Customer & Shipping Card */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" /> Shipping Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Customer</p>
                          <p className="text-zinc-900 dark:text-white font-bold text-lg">{order.user?.name || "Guest Checkout"}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                              <Mail className="w-3.5 h-3.5" /> {order.user?.email}
                          </p>
                      </div>
                      <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Phone</p>
                          <p className="text-zinc-900 dark:text-white font-bold text-lg flex items-center gap-2">
                              <Phone className="w-4 h-4 text-zinc-400" /> {order.phone}
                          </p>
                      </div>
                      <div className="sm:col-span-2 space-y-1 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Delivery Address</p>
                          <p className="text-zinc-700 dark:text-zinc-200 font-medium">{order.address}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{order.city}, {order.postalCode}, Pakistan</p>
                      </div>
                  </div>
              </div>

              {/* Items List */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Package className="w-5 h-5 text-emerald-500" /> Order Items 
                          <span className="text-zinc-400 dark:text-zinc-500 text-sm font-normal">({order.items.length})</span>
                      </h2>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {order.items.map((item) => (
                          <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                                      <Package className="w-8 h-8 text-gray-400 dark:text-zinc-600" /> 
                                  </div>
                                  <div>
                                      <p className="font-bold text-zinc-900 dark:text-white text-lg">{item.product.name}</p>
                                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                                        {formatPrice(Number(item.price))} <span className="text-zinc-400">x</span> {item.quantity}
                                      </p>
                                  </div>
                              </div>
                              <div className="text-right pl-4 border-l border-gray-200 dark:border-zinc-800 sm:border-0 sm:pl-0">
                                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-widest mb-1">Total</p>
                                  <p className="font-mono font-bold text-zinc-900 dark:text-white text-xl">
                                    {formatPrice(Number(item.price) * item.quantity)}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

          </div>

          {/* 3. RIGHT COLUMN: SUMMARY */}
          <div className="space-y-8">
              
              {/* Payment Info */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-500" /> Payment
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <span className="text-zinc-500 dark:text-zinc-400 text-sm">Method</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-700 px-2 py-1 rounded text-xs tracking-wider border border-gray-200 dark:border-zinc-600 shadow-sm">
                          {order.paymentMethod}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <span className="text-zinc-500 dark:text-zinc-400 text-sm">Status</span>
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${
                          order.paymentMethod === 'COD' 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                            {order.paymentMethod === 'COD' ? (
                              <><Calendar className="w-3.5 h-3.5" /> Pending (COD)</>
                            ) : (
                              <><CheckCircle className="w-3.5 h-3.5" /> Paid</>
                            )}
                        </span>
                    </div>
                  </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Order Summary</h2>
                  <div className="space-y-3">
                      <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-sm">
                          <span>Subtotal</span>
                          <span className="font-mono text-zinc-900 dark:text-zinc-200">{formatPrice(Number(order.totalAmount))}</span>
                      </div>
                      <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-sm">
                          <span>Shipping</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">Free</span>
                      </div>
                      <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-sm">
                          <span>Tax</span>
                          <span className="font-mono text-zinc-900 dark:text-zinc-200">{formatPrice(0)}</span>
                      </div>
                      
                      <div className="h-px bg-gray-200 dark:bg-zinc-800 my-4" />
                      
                      <div className="flex justify-between items-end">
                          <span className="text-zinc-500 dark:text-zinc-400 font-bold">Total</span>
                          <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                            {formatPrice(Number(order.totalAmount))}
                          </span>
                      </div>
                  </div>
              </div>
          </div>

        </div>
      </PageAnimation>
    </div>
  )
}