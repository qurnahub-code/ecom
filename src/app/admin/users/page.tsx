import { prisma } from "@/lib/prisma"
import CustomersDashboard from "@/components/admin/CustomersDashboard"
import { Users } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  // 1. Fetch Users with their Order stats
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          totalAmount: true,
          createdAt: true
        }
      }
    }
  })

  // 2. Process Data for the UI (Calculate LTV and Last Order)
  const enhancedUsers = users.map(user => {
    const totalSpent = user.orders.reduce((acc, order) => acc + Number(order.totalAmount), 0)
    const lastOrderDate = user.orders.length > 0 
      ? user.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
      : null

    return {
      id: user.id,
      name: user.name || "Unknown",
      email: user.email,
      role: user.role,
      image: null,
      createdAt: user.createdAt.toISOString(),
      ordersCount: user.orders.length,
      totalSpent,
      lastActive: lastOrderDate ? lastOrderDate.toISOString() : user.createdAt.toISOString(),
      // Simple logic: VIP if spent > $500
      status: totalSpent > 500 ? "VIP" : user.orders.length > 0 ? "Active" : "New"
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header - Consistent with your requested Theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-card border border-border rounded-xl shadow-sm">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
             <h1 className="text-3xl font-bold text-zinc-900 dark:text-blue-400 transition-colors">
               Customer Insights
             </h1>
             <p className="text-sm text-zinc-500 dark:text-zinc-400">
               Manage relationships and view customer lifetime value.
             </p>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <CustomersDashboard initialUsers={enhancedUsers} />
    </div>
  )
}