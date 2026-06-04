import { prisma } from "@/lib/prisma"

export async function getAdminStats() {
  // 1. Basic Counts
  const totalRevenueData = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: { not: 'CANCELLED' } }
  })
  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count()
  const lowStockCount = await prisma.product.count({
    where: { stock: { lte: 5 } }
  })

  // 2. Graph Data (Simulated for demo, but structure is real)
  const graphData = [
    { name: "Jan", total: 4000 },
    { name: "Feb", total: 3000 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 2780 },
    { name: "May", total: 1890 },
    { name: "Jun", total: 2390 },
    { name: "Jul", total: 3490 },
  ]

  // 3. Recent Orders (Extended)
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: true
    }
  })

  // 4. [NEW] Top Selling Products (Logic: Fetch items, group in JS for simplicity)
  // In a large app, use groupBy via Prisma. Here we simulate "Top" by just taking first 4 products with sales
  const topProductsRaw = await prisma.orderItem.findMany({
    take: 20,
    include: { product: { include: { images: true } } }
  })
  
  // Simple aggregation for the demo
  const productMap = new Map()
  topProductsRaw.forEach(item => {
    const existing = productMap.get(item.productId) || { 
        name: item.product.name, 
        image: item.product.images[0]?.url || null,
        sales: 0,
        revenue: 0 
    }
    existing.sales += item.quantity
    existing.revenue += Number(item.price) * item.quantity
    productMap.set(item.productId, existing)
  })
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)

  // 5. [NEW] Recent Activity (Mix of Users & Orders)
  const newUsers = await prisma.user.findMany({
      take: 3, orderBy: { createdAt: 'desc' }
  })
  
  const activityFeed = [
      ...recentOrders.map(o => ({
          type: 'ORDER',
          message: `New order placed by ${o.user?.name || 'Guest'}`,
          time: o.createdAt,
          amount: o.totalAmount
      })),
      ...newUsers.map(u => ({
          type: 'USER',
          message: `New customer registered: ${u.name}`,
          time: u.createdAt,
          amount: null
      }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6)

  return {
    totalRevenue: Number(totalRevenueData._sum.totalAmount) || 0,
    totalOrders,
    totalUsers,
    lowStockCount,
    graphData,
    recentOrders,
    topProducts,
    activityFeed
  }
}