import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatPrice } from "@/lib/shop-utils"
import Link from "next/link"
import PageAnimation from "@/components/PageAnimation" // ✅ Import Animation
import { Package, Truck, Clock, ArrowRight, LayoutDashboard } from "lucide-react"

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
        items: { include: { product: true } }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <PageAnimation>
          
          {/* Welcome Header */}
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                <LayoutDashboard className="w-8 h-8 text-white" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back, {session.user.name}!</p>
             </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">{orders.length}</p>
             </div>
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Shipments</p>
                <p className="text-4xl font-black text-blue-600 dark:text-blue-500 mt-2">
                  {orders.filter(o => o.status === 'SHIPPED' || o.status === 'PENDING').length}
                </p>
             </div>
          </div>

          {/* Orders List */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   <Package className="w-5 h-5 text-indigo-500" /> Recent Activity
                </h2>
             </div>
             
             <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {orders.map((order) => (
                   <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         
                         <div className="space-y-1">
                            <div className="flex items-center gap-3">
                               <span className="font-bold text-lg text-gray-900 dark:text-white font-mono">
                                 #{order.id.slice(0, 8).toUpperCase()}
                               </span>
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider ${
                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                  'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                               }`}>
                                  {order.status}
                               </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                               <Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}
                               <span className="text-gray-300 dark:text-zinc-700">•</span>
                               {order.items.length} Item(s)
                            </p>
                         </div>

                         <div className="flex items-center gap-6">
                            <p className="font-bold text-xl text-gray-900 dark:text-white">{formatPrice(Number(order.totalAmount))}</p>
                            <Link 
                              href={`/orders/${order.id}`} // Link to public receipt
                              className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all"
                            >
                               <ArrowRight className="w-5 h-5" />
                            </Link>
                         </div>

                      </div>
                   </div>
                ))}

                {orders.length === 0 && (
                   <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Package className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">No orders yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Start shopping to see your orders here.</p>
                      <Link href="/products" className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                         Browse Products
                      </Link>
                   </div>
                )}
             </div>
          </div>

        </PageAnimation>
      </div>
    </div>
  )
}