import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, Clock } from "lucide-react"
import { formatPrice } from "@/lib/shop-utils" // Use your price formatter

interface PageProps {
  params: Promise<{ id: string }>
}

// Helper for the progress stepper
const getStepStatus = (status: string) => {
  const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const index = steps.indexOf(status.toUpperCase())
  return index === -1 ? 0 : index + 1
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  // 1. Fetch Order
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: true } }
        }
      }
    }
  })

  // 2. Security Check (Optional but Recommended)
  // If the user is logged in, ensure this order belongs to them.
  // If logged out, you might want to redirect to login or show 404 unless you want public links.
  if (!order) return notFound()
  
  if (session?.user?.email) {
     const user = await prisma.user.findUnique({ where: { email: session.user.email } })
     if (user && order.userId && order.userId !== user.id) {
         // Order belongs to someone else
         return redirect('/') 
     }
  }

  // 3. Prepare Address Data (Handling your specific schema)
  // Assuming address fields are stored directly on the order based on your previous errors
  const address = {
      name: order.guestName || "Customer",
      street: order.address,
      city: order.city,
      postal: order.postalCode,
      phone: order.phone
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Order Details</h1>
                <p className="text-sm text-gray-500">ID: <span className="font-mono">{order.id}</span></p>
            </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{order.status}</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="font-bold text-gray-900 dark:text-white flex items-center justify-end gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Stepper */}
            <div className="relative mt-8">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-zinc-800 -translate-y-1/2 rounded-full" />
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(getStepStatus(order.status) / 4) * 100}%` }}
                />
                <div className="relative flex justify-between">
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                        const active = i < getStepStatus(order.status)
                        return (
                            <div key={step} className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 z-10 px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                                    {i === 0 && <Clock className="w-4 h-4" />}
                                    {i === 1 && <Package className="w-4 h-4" />}
                                    {i === 2 && <Truck className="w-4 h-4" />}
                                    {i === 3 && <CheckCircle className="w-4 h-4" />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-indigo-600' : 'text-gray-400'}`}>{step}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-500" /> Shipping Address
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white text-base">{address.name}</p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.postal}</p>
                    <p className="pt-2 text-indigo-600 dark:text-indigo-400 font-medium">{address.phone}</p>
                </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-500" /> Payment Info
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Method</span>
                        <span className="font-bold text-gray-900 dark:text-white">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPrice(Number(order.totalAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between text-lg font-black">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(Number(order.totalAmount))}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" /> Items in Order
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
                {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 shrink-0 relative">
                            {item.product?.images?.[0]?.url ? (
                                <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate">{item.product.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{formatPrice(Number(item.price))}</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  )
}