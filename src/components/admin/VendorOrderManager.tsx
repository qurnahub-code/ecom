// src/components/admin/VendorOrderManager.tsx
"use client"

import { useState } from "react"
import { ShoppingCart, FileText, CheckCircle } from "lucide-react"

export default function VendorOrderManager({ initialData }: { initialData: Record<string, any[]> }) {
  const vendors = Object.keys(initialData)
  
  // State to track order quantities: { "productId": 50, "productId2": 20 }
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({})
  const [selectedVendor, setSelectedVendor] = useState<string | null>(vendors[0] || null)
  const [showSummary, setShowSummary] = useState(false)

  const handleQuantityChange = (productId: string, qty: number) => {
    setOrderQuantities(prev => ({
      ...prev,
      [productId]: qty > 0 ? qty : 0
    }))
  }

  const currentOrderItems = selectedVendor ? initialData[selectedVendor].filter(p => (orderQuantities[p.id] || 0) > 0) : []
  const totalCost = currentOrderItems.reduce((sum, p) => sum + (orderQuantities[p.id] * Number(p.price)), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Vendor Tabs */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {vendors.map(vendor => (
            <button
              key={vendor}
              onClick={() => { setSelectedVendor(vendor); setShowSummary(false); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedVendor === vendor ? 'bg-black text-white' : 'bg-white border'
              }`}
            >
              {vendor}
            </button>
          ))}
        </div>

        {/* Product Table */}
        {selectedVendor && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3">Order Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {initialData[selectedVendor].map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-400">${Number(product.price)}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{product.stock}</td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        className="w-full border rounded p-1 text-center"
                        placeholder="0"
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border p-6 sticky top-8">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileText size={18}/> Draft Order</h3>
            {showSummary ? (
                <div className="bg-green-50 p-4 rounded text-center">
                    <CheckCircle className="mx-auto text-green-600 mb-2"/>
                    <p className="text-sm font-bold text-green-800">Sent to {selectedVendor}</p>
                </div>
            ) : (
                <>
                    <div className="space-y-2 mb-4 text-sm">
                        {currentOrderItems.map(p => (
                            <div key={p.id} className="flex justify-between">
                                <span className="truncate w-32">{p.name}</span>
                                <span>{orderQuantities[p.id]} x ${Number(p.price)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold mb-4">
                        <span>Total</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>
                    <button onClick={() => setShowSummary(true)} className="w-full bg-black text-white py-2 rounded-lg font-bold">
                        Send Order
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  )
}