import { getAdminStats } from "@/modules/admin/admin.service"
import PageAnimation from "@/components/PageAnimation"
import Link from "next/link"
import { formatPrice } from "@/lib/shop-utils"
import { 
  DollarSign, ShoppingBag, Users, AlertTriangle, 
  ArrowRight, TrendingUp, Package, Clock, 
  Plus, Target, ChevronRight, UserPlus
} from "lucide-react"
import { ExportCSVButton } from "@/components/admin/ExportCSVButton"
import { AnalyticsChart } from "@/components/admin/AnalyticsChart"

export const dynamic = 'force-dynamic'

export default async function AdminRootPage() {
  const stats = await getAdminStats()
  const maxRevenue = Math.max(...stats.graphData.map(d => d.total)) || 1

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300 font-sans">
      <PageAnimation>
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* 1. TOP BAR: Title + Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Overview of your store's performance today.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <ExportCSVButton 
                 data={stats.graphData.map(d => ({ Month: d.name, Revenue: d.total }))} 
                 filename="monthly_revenue_report.csv"
                 label="Export Report"
               />
               <Link 
                 href="/admin/products/new" 
                 className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-zinc-500/20"
               >
                  <Plus className="w-4 h-4" /> Add Product
               </Link>
            </div>
          </div>

          {/* 2. STATS ROW (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Revenue */}
             <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                   </div>
                   <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" /> +12.5%
                   </span>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Revenue</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{formatPrice(stats.totalRevenue)}</h3>
             </div>

             {/* Orders */}
             <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                      <ShoppingBag className="w-5 h-5" />
                   </div>
                   <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" /> +4.2%
                   </span>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Orders</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stats.totalOrders}</h3>
             </div>

             {/* Customers */}
             <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                      <Users className="w-5 h-5" />
                   </div>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Customers</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stats.totalUsers}</h3>
             </div>

             {/* Low Stock */}
             <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                   </div>
                   {stats.lowStockCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded-full animate-pulse">
                         Action Needed
                      </span>
                   )}
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Low Stock Items</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stats.lowStockCount}</h3>
             </div>
          </div>

          {/* 3. MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
             
             {/* LEFT COLUMN (2/3 width) */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* CHART SECTION */}
                <AnalyticsChart graphData={stats.graphData} />

                {/* RECENT ORDERS TABLE */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
                      <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1">
                         View All <ChevronRight className="w-4 h-4" />
                      </Link>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 dark:bg-zinc-800/50 text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400">
                            <tr>
                               <th className="px-6 py-4">Order ID</th>
                               <th className="px-6 py-4">Customer</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {stats.recentOrders.map((order) => (
                               <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                  <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-white">
                                     #{order.id.slice(0, 8).toUpperCase()}
                                  </td>
                                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                                     {order.user?.name || "Guest"}
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                                        'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                     }`}>
                                        {order.status}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold text-zinc-900 dark:text-white">
                                     {formatPrice(Number(order.totalAmount))}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

             </div>

             {/* RIGHT COLUMN (1/3 width) - Sidebar Widgets */}
             <div className="space-y-6">
                
                {/* ACTIVITY FEED */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                   <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity
                   </h2>
                   <div className="relative border-l border-gray-200 dark:border-zinc-800 ml-2 space-y-6">
                      {stats.activityFeed.map((activity, i) => (
                         <div key={i} className="ml-6 relative">
                            <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${
                               activity.type === 'ORDER' ? 'bg-blue-500' : 'bg-green-500'
                            }`}></span>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{activity.message}</p>
                            <p className="text-xs text-zinc-500 mt-1">
                               {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               {activity.amount && ` • ${formatPrice(Number(activity.amount))}`}
                            </p>
                         </div>
                      ))}
                   </div>
                </div>

                {/* TOP PRODUCTS */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                   <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-500" /> Top Products
                   </h2>
                   <div className="space-y-5">
                      {stats.topProducts.length === 0 ? (
                          <p className="text-zinc-500 text-sm">No sales data yet.</p>
                      ) : stats.topProducts.map((product, i) => (
                         <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-zinc-700">
                               {/* Real image would go here, fallback for now */}
                               <Package className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{product.name}</p>
                               <p className="text-xs text-zinc-500">{product.sales} sales</p>
                            </div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">
                               {formatPrice(product.revenue)}
                            </p>
                         </div>
                      ))}
                   </div>
                   <button className="w-full mt-6 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800 rounded-xl transition-colors">
                      View Performance Report
                   </button>
                </div>

                {/* SERVER STATUS MINI-WIDGET */}
                <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Users className="w-24 h-24" />
                   </div>
                   <h3 className="text-lg font-bold mb-1">Invite Team</h3>
                   <p className="text-zinc-400 text-xs mb-4 max-w-[80%]">Collaborate with your team by adding them to the dashboard.</p>
                   <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors border border-white/10">
                      <UserPlus className="w-4 h-4" /> Invite Member
                   </button>
                </div>

             </div>
          </div>

        </div>
      </PageAnimation>
    </div>
  )
}