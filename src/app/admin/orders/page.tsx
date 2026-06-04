import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/shop-utils"
import { 
  ShoppingBag, Calendar, User, Package, CheckCircle, XCircle, Truck 
} from "lucide-react"
import Link from "next/link"
import OrderActionsMenu from "./OrderActionsMenu" // ✅ Import the new menu
import { updateOrderStatus } from "@/app/actions/admin"

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  // Helper for Status Badge Styles (Matches your screenshot theme)
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            Orders Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage customer orders, track status, and process shipments.
          </p>
        </div>
        <div className="bg-black text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {orders.length} Total Orders
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          // CARD CONTAINER: Matches your screenshot (Dark card, white text)
          <div key={order.id} className="bg-zinc-950 text-white rounded-2xl overflow-hidden shadow-xl border border-zinc-800/50 group hover:border-zinc-700 transition-all">
            
            {/* 1. TOP BAR: Order ID & Amount */}
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 bg-zinc-900/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                   <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-lg tracking-tight">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mt-2">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {order.user?.name || "Guest User"}</span>
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                 <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Total Amount</p>
                    <p className="text-2xl font-black tracking-tight">{formatPrice(Number(order.totalAmount))}</p>
                 </div>
                 
                 {/* ✅ NEW DROPDOWN MENU */}
                 <OrderActionsMenu orderId={order.id} />
              </div>
            </div>

            {/* 2. BODY: Items & Quick Buttons */}
            <div className="p-6 grid lg:grid-cols-2 gap-8 items-center">
               
               {/* Items Summary */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                       <Package className="w-3 h-3" /> {order.items?.length || 0} Item(s)
                    </span>
                  </div>

                  <div className="space-y-3">
                     {order.items?.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm group/item">
                           <div className="flex items-center gap-3">
                              <span className="text-zinc-500 font-mono text-xs">{item.quantity}x</span>
                              <span className="font-bold text-zinc-200 group-hover/item:text-white transition-colors">
                                {item.product.name}
                              </span>
                           </div>
                           <span className="font-mono text-zinc-400">{formatPrice(Number(item.price))}</span>
                        </div>
                     ))}
                     {order.items && order.items.length > 2 && (
                        <p className="text-xs text-zinc-600 italic pl-7">+ {order.items.length - 2} more items...</p>
                     )}
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="grid grid-cols-2 gap-3 lg:pl-8 lg:border-l border-zinc-900">
                    <p className="col-span-2 text-[10px] font-bold text-zinc-600 uppercase mb-1">Update Status</p>
                    
                    <form action={updateOrderStatus.bind(null, order.id, "SHIPPED")} className="contents">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-900/50 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]">
                            <Truck className="w-3.5 h-3.5" /> Ship
                        </button>
                    </form>
                    
                    <form action={updateOrderStatus.bind(null, order.id, "DELIVERED")} className="contents">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-900/50 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]">
                            <CheckCircle className="w-3.5 h-3.5" /> Deliver
                        </button>
                    </form>
                    
                    <form action={updateOrderStatus.bind(null, order.id, "CANCELLED")} className="contents">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]">
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                    </form>

                    <Link 
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]"
                    >
                        Details
                    </Link>
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}