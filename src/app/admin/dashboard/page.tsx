import { getAdminStats } from "@/modules/admin/admin.service" // Import the service from Response #11
import PageAnimation from "@/components/PageAnimation"
import Link from "next/link"
import { formatPrice } from "@/lib/shop-utils"
import { 
  DollarSign, ShoppingBag, Users, AlertTriangle, 
  ArrowRight, TrendingUp, Package 
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  // 1. Fetch Live Stats
  const stats = await getAdminStats()

  // Helper to calculate bar height percentage for the graph
  const maxRevenue = Math.max(...stats.graphData.map(d => d.total)) || 1

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <PageAnimation>
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Dashboard Overview</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-zinc-800">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-zinc-600 dark:text-zinc-300">System Live</span>
            </div>
          </div>

          {/* 1. KEY METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Revenue */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <DollarSign className="w-24 h-24 text-zinc-900 dark:text-white" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Revenue</p>
               </div>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {formatPrice(stats.totalRevenue)}
               </h3>
               <p className="text-emerald-500 text-xs font-bold flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" /> +12.5% from last month
               </p>
            </div>

            {/* Total Orders */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShoppingBag className="w-24 h-24 text-zinc-900 dark:text-white" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Orders</p>
               </div>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {stats.totalOrders}
               </h3>
               <Link href="/admin/orders" className="text-blue-500 text-xs font-bold flex items-center gap-1 mt-2 hover:underline">
                  View all orders <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            {/* Total Customers */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users className="w-24 h-24 text-zinc-900 dark:text-white" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Customers</p>
               </div>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {stats.totalUsers}
               </h3>
               <p className="text-zinc-500 text-xs mt-2">Active registered users</p>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <AlertTriangle className="w-24 h-24 text-red-500" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Low Stock</p>
               </div>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {stats.lowStockCount}
               </h3>
               <Link href="/admin/inventory" className="text-red-500 text-xs font-bold flex items-center gap-1 mt-2 hover:underline">
                  Restock Now <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

          </div>

          {/* 2. CHARTS & LISTS */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* REVENUE CHART (Custom CSS Bar Chart) */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Revenue Overview</h2>
                 <select className="bg-gray-100 dark:bg-zinc-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-transparent outline-none">
                    <option>Yearly</option>
                    <option>Monthly</option>
                 </select>
              </div>
              
              <div className="h-[250px] w-full flex items-end justify-between gap-2">
                 {stats.graphData.map((data, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                       <div 
                         className="w-full bg-blue-500/20 dark:bg-blue-500/20 rounded-t-sm relative group-hover:bg-blue-500 transition-colors duration-300"
                         style={{ height: `${(data.total / maxRevenue) * 100}%` }}
                       >
                         {/* Tooltip */}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatPrice(data.total)}
                         </div>
                       </div>
                       <span className="text-[10px] font-bold text-zinc-400 uppercase">{data.name}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* RECENT ORDERS LIST */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
               <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Recent Orders</h2>
               <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                     <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-zinc-400" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                {order.user?.name || "Guest"}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {order.items.length} Items • {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-zinc-900 dark:text-white">
                             {formatPrice(Number(order.totalAmount))}
                           </p>
                           <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                             order.status === 'DELIVERED' ? 'text-green-500 bg-green-500/10' :
                             order.status === 'CANCELLED' ? 'text-red-500 bg-red-500/10' :
                             'text-blue-500 bg-blue-500/10'
                           }`}>
                             {order.status}
                           </span>
                        </div>
                     </div>
                  ))}
                  {stats.recentOrders.length === 0 && (
                     <p className="text-center text-zinc-500 text-sm py-8">No recent orders.</p>
                  )}
               </div>
               
               <Link href="/admin/orders" className="block mt-6 text-center text-sm font-bold text-blue-500 hover:text-blue-600 border-t border-gray-100 dark:border-zinc-800 pt-4">
                  View All Activity
               </Link>
            </div>

          </div>

        </div>
      </PageAnimation>
    </div>
  )
}