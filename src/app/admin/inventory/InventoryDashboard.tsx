"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import Link from "next/link"
import { 
  Search, ScanLine, Trash2, Edit, RefreshCw, 
  AlertTriangle, XCircle, CheckCircle2, Globe, Truck,
  Camera, X, QrCode, Calendar, Package, TrendingUp, DollarSign, Layers
} from "lucide-react"
import { removeProduct, updateProductDetails, reorderStock, quickUpdateInventoryProduct } from "@/app/actions/admin"

export default function InventoryDashboard({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // Sync initialProducts prop to local state when Server Component revalidates
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // --- 1. ADVANCED METRICS CALCULATION ---
  const metrics = useMemo(() => {
    const totalItems = products.length
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    const lowStock = products.filter(p => p.stock < 10).length
    const outOfStock = products.filter(p => p.stock === 0).length
    const expired = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date()).length
    
    // Group by Origin
    const localCount = products.filter(p => p.origin !== 'Imported').length
    const importedCount = products.filter(p => p.origin === 'Imported').length

    return { totalItems, totalValue, lowStock, outOfStock, expired, localCount, importedCount }
  }, [products])

  // --- 2. FILTERING LOGIC ---
  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase()
    const matchesSearch = 
      p.name.toLowerCase().includes(term) || 
      (p.barcode && p.barcode.toLowerCase().includes(term)) || 
      p.id.toLowerCase().includes(term) ||
      (p.vendor && p.vendor.toLowerCase().includes(term))

    if (!matchesSearch) return false

    const now = new Date()
    const expiry = p.expiryDate ? new Date(p.expiryDate) : null
    const daysToExpiry = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999

    if (filter === "EXPIRED") return expiry && daysToExpiry < 0
    if (filter === "LOW_STOCK") return p.stock < 10
    if (filter === "OUT_STOCK") return p.stock === 0
    if (filter === "IMPORTED") return p.origin === 'Imported'
    
    return true
  })

  // --- CAMERA HANDLERS ---
  const startScanner = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      alert("Camera access failed. Check permissions.")
      setIsCameraOpen(false)
    }
  }

  const stopScanner = () => {
    setIsCameraOpen(false)
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
    }
  }

  const captureCode = () => {
    // Simulated Decode
    if (products.length > 0) {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setSearch(randomProduct.barcode || randomProduct.id.slice(0, 8))
      stopScanner()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. FINANCIAL & STOCK OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Value Card */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-24 h-24 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Inventory Value</p>
            <h3 className="text-3xl font-bold text-foreground mt-2">
              ${metrics.totalValue.toLocaleString()}
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>Asset Valuation Live</span>
          </div>
        </div>

        {/* Stock Health */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stock Health</p>
            <div className="mt-4 space-y-3">
              {/* Healthy */}
              <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-foreground">Healthy Stock</span>
                   <span className="text-muted-foreground">{metrics.totalItems - metrics.lowStock} items</span>
                 </div>
                 <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((metrics.totalItems - metrics.lowStock) / metrics.totalItems) * 100}%` }}></div>
                 </div>
              </div>
              {/* Critical */}
              <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-foreground">Low / Critical</span>
                   <span className="text-orange-500 font-bold">{metrics.lowStock} items</span>
                 </div>
                 <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(metrics.lowStock / metrics.totalItems) * 100}%` }}></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Origin Breakdown */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center gap-4">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
               <Globe className="w-6 h-6" />
             </div>
             <div>
               <p className="text-2xl font-bold text-foreground">{metrics.importedCount}</p>
               <p className="text-xs text-muted-foreground uppercase">Imported Units</p>
             </div>
           </div>
           <div className="w-full h-px bg-border"></div>
           <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
               <Truck className="w-6 h-6" />
             </div>
             <div>
               <p className="text-2xl font-bold text-foreground">{metrics.localCount}</p>
               <p className="text-xs text-muted-foreground uppercase">Local Units</p>
             </div>
           </div>
        </div>
      </div>

      {/* 2. INTERACTIVE FILTERS */}
      <div className="flex flex-wrap gap-3 pb-2">
         <FilterPill label="All Items" count={metrics.totalItems} active={filter === "ALL"} onClick={() => setFilter("ALL")} />
         <FilterPill label="Low Stock" count={metrics.lowStock} active={filter === "LOW_STOCK"} onClick={() => setFilter("LOW_STOCK")} color="orange" />
         <FilterPill label="Out of Stock" count={metrics.outOfStock} active={filter === "OUT_STOCK"} onClick={() => setFilter("OUT_STOCK")} color="red" />
         <FilterPill label="Expired" count={metrics.expired} active={filter === "EXPIRED"} onClick={() => setFilter("EXPIRED")} color="red" />
         <FilterPill label="Imported" count={metrics.importedCount} active={filter === "IMPORTED"} onClick={() => setFilter("IMPORTED")} color="purple" />
      </div>

      {/* 3. TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-2 rounded-xl border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search products, SKU, barcodes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button 
          onClick={startScanner}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-lg hover:opacity-90 transition font-medium text-sm shadow-sm"
        >
          <ScanLine className="w-4 h-4" />
          Scan Item
        </button>
      </div>

      {/* 4. MAIN TABLE */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-semibold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category / Origin</th>
                <th className="px-6 py-4">Financials</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground">
                     <div className="flex flex-col items-center gap-3">
                       <div className="p-4 bg-muted rounded-full">
                         <Package className="w-8 h-8 opacity-40" />
                       </div>
                       <p>No inventory items match your search.</p>
                     </div>
                   </td>
                 </tr>
              ) : (
                filteredProducts.map(product => {
                  const isLow = product.stock < 10
                  const isOut = product.stock === 0
                  
                  return (
                    <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                      {/* Product Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-base">{product.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                             {product.barcode && (
                               <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground flex items-center gap-1">
                                 <QrCode size={10} /> {product.barcode}
                               </span>
                             )}
                             <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground">
                               SKU: {product.id.slice(-6).toUpperCase()}
                             </span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Origin / Category */}
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                           <span className="text-foreground font-medium flex items-center gap-2">
                             <Layers className="w-3 h-3 text-muted-foreground" />
                             {product.category || "Uncategorized"}
                           </span>
                           {product.origin === 'Imported' ? (
                              <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Imported
                              </span>
                           ) : (
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Truck className="w-3 h-3" /> Local
                              </span>
                           )}
                         </div>
                      </td>

                      {/* Financials */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-foreground">${product.price.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">Unit Cost</span>
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`font-bold text-lg ${isOut ? "text-red-500" : isLow ? "text-orange-500" : "text-foreground"}`}>
                            {product.stock}
                          </div>
                          {isOut ? (
                             <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold border border-red-500/20">OUT OF STOCK</span>
                          ) : isLow && (
                             <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold border border-orange-500/20">LOW</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { if(confirm(`Restock ${product.name}?`)) alert("Sent to Vendor!") }} 
                            className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Quick Reorder"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingProduct(product)} 
                            className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { if(confirm("Delete?")) removeProduct(product.id) }} 
                            className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CAMERA OVERLAY --- */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-300">
           {/* Same Camera UI as before (it was already good quality) */}
           <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
             <button onClick={stopScanner} className="bg-white/10 p-3 rounded-full hover:bg-white/20 text-white"><X size={20}/></button>
             <span className="text-white font-medium">Scan Barcode</span>
             <div className="w-10"></div>
           </div>
           <div className="flex-1 relative flex items-center justify-center">
             <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
             <div className="relative z-10 w-72 h-72 rounded-3xl border-2 border-white/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute inset-0 border-t-2 border-blue-500 opacity-50 animate-pulse"></div>
                <div className="absolute top-1/2 w-full h-0.5 bg-red-500 shadow-[0_0_15px_red]"></div>
             </div>
           </div>
           <div className="p-10 flex justify-center bg-black">
             <button onClick={captureCode} className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 hover:scale-105 transition"></button>
           </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">Quick Edit Product</h3>
              </div>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  try {
                    await quickUpdateInventoryProduct(formData)
                    setEditingProduct(null)
                  } catch (err) {
                    alert("Failed to update product")
                  }
                }}
                className="p-6 space-y-4"
              >
                 <input type="hidden" name="id" value={editingProduct.id} />
                 
                 <div>
                   <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
                   <input name="name" required defaultValue={editingProduct.name} className="w-full mt-1 bg-background border border-border p-3 rounded-xl text-foreground focus:border-primary outline-none transition-all" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase">Price</label>
                      <input name="price" type="number" step="0.01" required defaultValue={editingProduct.price} className="w-full mt-1 bg-background border border-border p-3 rounded-xl text-foreground focus:border-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase">Stock</label>
                      <input name="stock" type="number" required defaultValue={editingProduct.stock} className="w-full mt-1 bg-background border border-border p-3 rounded-xl text-foreground focus:border-primary outline-none transition-all" />
                    </div>
                 </div>
                 
                 <div className="pt-4 flex flex-col gap-3">
                   <div className="flex gap-3">
                     <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 rounded-xl border border-border text-foreground hover:bg-muted font-medium transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold transition-opacity shadow-lg shadow-primary/20">Save Changes</button>
                   </div>
                   
                   <Link 
                     href={`/admin/products/${editingProduct.id}`}
                     className="block text-center text-xs text-primary hover:underline font-semibold mt-2"
                   >
                     Edit Detailed Specifications
                   </Link>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  )
}

// --- SUB COMPONENTS ---

function FilterPill({ label, count, active, onClick, color = "blue" }: any) {
  const activeClasses = {
    blue: "bg-blue-500 text-white border-blue-600",
    orange: "bg-orange-500 text-white border-orange-600",
    red: "bg-red-500 text-white border-red-600",
    purple: "bg-purple-500 text-white border-purple-600",
  }[color as string] || "bg-foreground text-background"

  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border
        ${active ? activeClasses : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"}
      `}
    >
      {label}
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20" : "bg-muted text-foreground"}`}>
        {count}
      </span>
    </button>
  )
}