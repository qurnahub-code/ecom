// src/modules/admin/admin.service.ts
import { prisma } from "@/lib/prisma"

export async function getAdminStats() {
  // 1. Get Total Orders
  const totalOrders = await prisma.order.count()

  // 2. Calculate Total Revenue
  // (Prisma's aggregate function sums up the 'totalAmount' column)
  const revenueData = await prisma.order.aggregate({
    _sum: {
      totalAmount: true
    }
  })
  const totalRevenue = revenueData._sum.totalAmount || 0

  // 3. Get Recent Orders (Last 5)
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      items: true // We also want to know how many items were in each order
    }
  })

  return {
    totalOrders,
    totalRevenue: Number(totalRevenue), // Convert Decimal to Number
    recentOrders
  }
}