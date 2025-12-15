"use client"

import { useState, useRef } from "react"
import { 
  Search, ScanLine, Trash2, Edit, RefreshCw, 
  AlertTriangle, XCircle, CheckCircle, Globe, Truck,
  Camera, X, QrCode, RefreshCcw 
} from "lucide-react"
import { removeProduct, updateProductDetails, reorderStock } from "@/modules/admin/inventory.actions"

export default function InventoryDashboard({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // --- CAMERA STATES ---
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // --- CAMERA LOGIC ---
  const startScanner = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      alert("Camera access denied or not available.")
      setIsCameraOpen(false)
    }
  }

  const stopScanner = () => {
    setIsCameraOpen(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  const captureCode = () => {
    // Simulating QR Decode - In a real app, you'd pipe this frame to a QR library like 'jsqr'
    // For now, we simulate a successful scan of a random product ID from the list
    if (products.length > 0) {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setSearch(randomProduct.barcode || randomProduct.id.slice(0, 8))
      stopScanner()
    } else {
      alert("No products to match against.")
      stopScanner()
    }
  }

  // --- FILTERING LOGIC ---
  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase()
    const matchesSearch = 
      p.name.toLowerCase().includes(term) || 
      (p.barcode && p.barcode.toLowerCase().includes(term)) || 
      p.id.toLowerCase().includes(term)

    if (!matchesSearch) return false

    const now = new Date()
    const expiry = p.expiryDate ? new Date(p.expiryDate) : null
    const daysToExpiry = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999

    if (filter === "EXPIRED") return expiry && daysToExpiry < 0
    if (filter === "NEAR_EXPIRY") return expiry && daysToExpiry > 0 && daysToExpiry <= 30
    if (filter === "LOW_STOCK") return p.stock < 10
    
    return true
  })

  // --- ACTIONS ---
  const handleReorder = async (product: any) => {
    if(!product.vendor) return alert("No vendor linked to this product.")
    if(confirm(`Send Purchase Order to ${product.vendor} for ${product.name}?`)) {
        const res = await reorderStock(product.id, product.vendor)
        if(res.success) alert(`✅ ${res.message}`)
    }
  }

  return (
    <div className="relative">
      
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total Items" value={products.length} 
          icon={<CheckCircle className="text-blue-500" />} 
          onClick={() => setFilter("ALL")} active={filter === "ALL"}
        />
        <StatCard 
          label="Low Stock" value={products.filter(p => p.stock < 10).length} 
          icon={<AlertTriangle className="text-orange-500" />} 
          onClick={() => setFilter("LOW_STOCK")} active={filter === "LOW_STOCK"}
        />
        <StatCard 
          label="Expiring Soon" value={products.filter(p => {
             if(!p.expiryDate) return false
             const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (86400000))
             return days > 0 && days <= 30
          }).length} 
          icon={<RefreshCw className="text-yellow-500" />} 
          onClick={() => setFilter("NEAR_EXPIRY")} active={filter === "NEAR_EXPIRY"}
        />
        <StatCard 
          label="Expired" value={products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date()).length} 
          icon={<XCircle className="text-red-500" />} 
          onClick={() => setFilter("EXPIRED")} active={filter === "EXPIRED"}
        />
      </div>

      {/* 2. SEARCH & SCAN TOOLBAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Scan or Search (Name, Barcode, ID)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>
        
        <button 
          onClick={startScanner}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md"
        >
          <ScanLine className="w-5 h-5" />
          Scan Item
        </button>
      </div>

      {/* 3. INVENTORY TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Origin</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => {
                const expiry = product.expiryDate ? new Date(product.expiryDate) : null
                const isExpired = expiry && expiry < new Date()
                
                return (
                  <tr key={product.id} className={`group transition ${isExpired ? "bg-red-50/50" : "hover:bg-gray-50"}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{product.name}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono text-gray-500">BC: {product.barcode || "N/A"}</span>
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono text-gray-500">ID: {product.id.slice(0, 4)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {product.origin === 'Imported' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
                          <Globe className="w-3 h-3" /> Imported
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                          <Truck className="w-3 h-3" /> Local
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{product.stock} units</div>
                      {product.stock < 10 && <div className="text-xs text-orange-600 font-medium flex items-center gap-1"><AlertTriangle size={10}/> Low Stock</div>}
                    </td>

                    <td className="px-6 py-4">
                      {expiry ? (
                        <div className={`text-sm ${isExpired ? "text-red-600 font-bold" : "text-gray-600"}`}>
                          {expiry.toLocaleDateString()}
                          {isExpired && <span className="block text-[10px] font-bold text-red-600">EXPIRED</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">--</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleReorder(product)} title="Reorder Stock" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingProduct(product)} title="Edit Details" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={async () => { if(confirm("Delete item?")) await removeProduct(product.id) }} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CAMERA OVERLAY --- */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-between items-center p-6 text-white z-10">
             <button onClick={stopScanner} className="bg-white/10 p-2 rounded-full"><X size={24}/></button>
             <span className="font-semibold text-lg">Scan Barcode / QR</span>
             <div className="w-10"></div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
             
             {/* Scanner Frame */}
             <div className="absolute w-72 h-72 border-2 border-white/50 rounded-2xl relative">
                <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-b-blue-500 opacity-50 animate-pulse"></div>
                <div className="w-full h-0.5 bg-red-500 absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_red]"></div>
             </div>
             <p className="absolute bottom-20 text-white/80 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">Align code within frame</p>
          </div>
          
          <div className="bg-black p-8 flex justify-center">
             <button onClick={captureCode} className="w-20 h-20 bg-white rounded-full border-8 border-gray-300 hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"></button>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (Simplified) --- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form action={async (formData) => { await updateProductDetails(formData); setEditingProduct(null); }} className="space-y-4">
              <input type="hidden" name="id" value={editingProduct.id} />
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                <input name="name" defaultValue={editingProduct.name} className="w-full border p-2 rounded-lg" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Barcode</label>
                  <input name="barcode" defaultValue={editingProduct.barcode} className="w-full border p-2 rounded-lg" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Expiry</label>
                  <input type="date" name="expiryDate" defaultValue={editingProduct.expiryDate ? new Date(editingProduct.expiryDate).toISOString().split('T')[0] : ''} className="w-full border p-2 rounded-lg" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, onClick, active }: any) {
  return (
    <div onClick={onClick} className={`p-4 rounded-xl border cursor-pointer transition-all ${active ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 bg-white hover:shadow-md'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs font-bold uppercase">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}