import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/lib/shop-utils"
import PageAnimation from "@/components/PageAnimation" // ✅ Import Animation
import { 
  ArrowLeft, Mail, Phone, Calendar, ShoppingBag, 
  TrendingUp, MapPin, Package, ExternalLink 
} from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminCustomerDetailsPage({ params }: PageProps) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }
    }
  })

  if (!user) notFound()

  // Stats Logic
  const totalOrders = user.orders.length
  const totalSpent = user.orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((acc, order) => acc + Number(order.totalAmount), 0)
  
  const lastOrder = user.orders[0]

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50/50 dark:bg-zinc-950 transition-colors duration-300 min-h-screen">
      <PageAnimation>
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin/customers" 
            className="p-3 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{user.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
              <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
              <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
              }`}>
                  {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Lifetime Value</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">{formatPrice(totalSpent)}</p>
                </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Orders</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalOrders}</p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Location</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">
                        {lastOrder?.city || "Unknown"}
                    </p>
                </div>
            </div>
        </div>

        {/* ORDER HISTORY TABLE */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-500" /> Order History
                </h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50 text-xs uppercase font-bold text-zinc-500 border-b border-gray-200 dark:border-zinc-800">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4 text-right">Total</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {user.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-zinc-200">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                                        'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                    {order.items.length} Item(s)
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-zinc-900 dark:text-white">
                                    {formatPrice(Number(order.totalAmount))}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                      href={`/admin/orders/${order.id}`}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        View <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {user.orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                                    This user hasn't placed any orders yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </PageAnimation>
    </div>
  )
}