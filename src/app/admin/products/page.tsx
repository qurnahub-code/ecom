import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { 
  Plus, Search, MoreHorizontal, Package, 
  Barcode, Tag, Truck, DollarSign 
} from "lucide-react"
import { ExportCSVButton } from "@/components/admin/ExportCSVButton"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { take: 1 } } // Fetch thumbnail
  })

  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
            Product Catalog
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory, set prices, and track suppliers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ExportCSVButton 
            data={products.map(p => ({
              ProductId: p.id,
              Name: p.name,
              Category: p.category,
              Price: Number(p.price),
              CostPrice: p.costPrice ? Number(p.costPrice) : 0,
              Stock: p.stock,
              SKU: p.sku || "",
              Brand: p.brand || "",
              Barcode: p.barcode || "",
              Origin: p.origin || "",
              ExpiryDate: p.expiryDate ? p.expiryDate.toISOString() : "",
              Tags: p.tags || "",
              Vendor: p.vendor || "",
              DateAdded: p.createdAt.toISOString()
            }))}
            filename="store_products_catalog.csv"
            label="Export Products"
          />
          
          {/* RGB "Add Product" Button */}
          <Link 
            href="/admin/products/new" 
            className="group relative inline-flex items-center justify-center p-[2px] rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-[spin_4s_linear_infinite]" />
            <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-zinc-900 text-white font-bold transition-all group-hover:bg-zinc-800">
              <Plus className="w-4 h-4" /> Add Product
            </span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Package className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No products found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Start by adding your first product to the catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-semibold tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Identity (SKU)</th>
                  <th className="px-6 py-4">Supplier / Vendor</th>
                  <th className="px-6 py-4">Financials</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => {
                  // Stock Logic
                  const isLowStock = product.stock < (product.minStock || 10)
                  const isOut = product.stock === 0
                  
                  return (
                    <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                      
                      {/* 1. Name & Category */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-base">{product.name}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                              {product.category || "Uncategorized"}
                            </span>
                            {product.isAffiliate && (
                              <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                                Affiliate
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Identity (SKU/Barcode) */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {product.sku ? (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-foreground">
                              <Tag className="w-3 h-3 text-primary" /> {product.sku}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">--</span>
                          )}
                          
                          {product.barcode && (
                             <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                               <Barcode className="w-3 h-3" /> {product.barcode}
                             </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Vendor Column (NEW) */}
                      <td className="px-6 py-4">
                        {product.vendor ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500/10 rounded-md">
                              <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium text-foreground">{product.vendor}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">--</span>
                        )}
                      </td>

                      {/* 4. Financials */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            ${Number(product.price).toLocaleString()}
                          </span>
                          {product.costPrice && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              Cost: ${Number(product.costPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Stock Status */}
                      <td className="px-6 py-4">
                         {isOut ? (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                             Out of Stock
                           </span>
                         ) : isLowStock ? (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                             Low: {product.stock}
                           </span>
                         ) : (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                             In Stock: {product.stock}
                           </span>
                         )}
                      </td>

                      {/* 6. Actions */}
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/products/${product.id}`} 
                          className="inline-flex p-2 hover:bg-background border border-transparent hover:border-border rounded-lg transition-all text-muted-foreground hover:text-primary"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}