import { prisma } from "@/lib/prisma"
import InventoryDashboard from "./InventoryDashboard"

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { take: 1 } } // [FIX] Include images
  })

  // [FIX] Serialize data (Decimal -> Number, Date -> String)
  const serializedProducts = products.map(p => ({
    ...p,
    price: Number(p.price),
    imageUrl: p.images[0]?.url || null,
    expiryDate: p.expiryDate ? p.expiryDate.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500">Real-time stock tracking and reordering.</p>
      </div>
      <InventoryDashboard initialProducts={serializedProducts} />
    </div>
  )
}