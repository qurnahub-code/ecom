import { prisma } from "@/lib/prisma"
import { Layers } from "lucide-react"
// OPTION 2: Use this if the component is in the SAME folder as this page
import InventoryDashboard from "./InventoryDashboard"

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  // 1. Fetch Data
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { take: 1 } }
  })

  // 2. Serialize Data (Fix Decimal/Date issues for Client Component)
  // We map the database fields to simple types (number, string) to avoid serialization errors
  const serializedProducts = products.map(p => ({
    ...p,
    price: Number(p.price),
    imageUrl: p.images[0]?.url || null,
    expiryDate: p.expiryDate ? p.expiryDate.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-8">
      
      {/* HEADER SECTION (Themed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time stock tracking, valuation, and expiration monitoring.
          </p>
        </div>
        
        {/* Quick Stat Pill */}
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm text-sm">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{products.length} Total SKUs</span>
        </div>
      </div>
      
      {/* CLIENT COMPONENT */}
      <InventoryDashboard initialProducts={serializedProducts} />
    </div>
  )
}