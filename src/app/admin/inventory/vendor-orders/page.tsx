// src/app/admin/inventory/vendor-orders/page.tsx
import { prisma } from "@/lib/prisma"
import VendorOrderManager from "@/components/admin/VendorOrderManager"

export const dynamic = 'force-dynamic'

export default async function VendorOrdersPage() {
  // 1. Fetch products that have a vendor assigned
  const products = await prisma.product.findMany({
    where: {
      vendor: { not: null } // Only items with vendors
    },
    select: {
      id: true,
      name: true,
      stock: true,
      vendor: true,
      price: true,
      barcode: true
    },
    orderBy: { vendor: 'asc' }
  })

  // 2. Group by Vendor for the UI
  // { "Acme Corp": [Product, Product], "Global Supplies": [Product] }
  const groupedProducts: Record<string, any[]> = {}
  
  products.forEach(p => {
    const v = p.vendor as string
    if (!groupedProducts[v]) groupedProducts[v] = []
    groupedProducts[v].push(p)
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Orders</h1>
        <p className="text-gray-500">Generate purchase orders for low stock items.</p>
      </div>
      
      <VendorOrderManager initialData={groupedProducts} />
    </div>
  )
}