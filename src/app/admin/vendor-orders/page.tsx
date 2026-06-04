import { prisma } from "@/lib/prisma"
import VendorOrderManager from "@/components/admin/VendorOrderManager"
import { Truck, AlertTriangle, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

// Configuration for Logic
const TARGET_STOCK_LEVEL = 50 
const LOW_STOCK_THRESHOLD = 10

export default async function VendorOrdersPage() {
  // 1. Fetch products
  const products = await prisma.product.findMany({
    where: {
      vendor: { not: null }
    },
    select: {
      id: true,
      name: true,
      stock: true,
      vendor: true,
      price: true, // <--- This returns a Decimal object
      barcode: true
    },
    orderBy: { vendor: 'asc' }
  })

  // 2. Enhance Data & FIX DECIMAL ISSUE
  const enhancedProducts = products.map(p => {
    const isLowStock = p.stock <= LOW_STOCK_THRESHOLD
    const deficit = Math.max(0, TARGET_STOCK_LEVEL - p.stock)
    
    return {
      ...p,
      price: Number(p.price), // <--- [FIX]: Explicitly convert Decimal to Number
      isLowStock,
      suggestedOrder: deficit > 0 ? deficit : 0,
      vendor: p.vendor as string
    }
  })

  // 3. Group by Vendor
  const groupedProducts: Record<string, typeof enhancedProducts> = {}
  
  enhancedProducts.forEach(p => {
    if (!groupedProducts[p.vendor]) groupedProducts[p.vendor] = []
    groupedProducts[p.vendor].push(p)
  })

  // Calculate Stats
  const totalVendors = Object.keys(groupedProducts).length
  const lowStockCount = enhancedProducts.filter(p => p.isLowStock).length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
            Vendor Procurement
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage supply chains and generate purchase orders.
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm text-sm font-medium">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-foreground">{totalVendors} Active Vendors</span>
          </div>
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-full shadow-sm text-sm animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold">{lowStockCount} Items Critical</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Client Component */}
      <VendorOrderManager initialData={groupedProducts} />
    </div>
  )
}
