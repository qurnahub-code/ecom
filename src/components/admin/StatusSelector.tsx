// src/components/admin/StatusSelector.tsx
"use client"

import { updateOrderStatus } from "@/modules/admin/actions"
import { useState } from "react"

export function StatusSelector({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
    const newStatus = e.target.value
    
    // Call the Server Action
    await updateOrderStatus(id, newStatus)
    
    setIsLoading(false)
  }

  // Color coding based on status
  const getColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative">
      <select 
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={isLoading}
        className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-all ${getColor(currentStatus)} ${isLoading ? 'opacity-50' : ''}`}
      >
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      
      {/* Tiny Loading Spinner if updating */}
      {isLoading && (
        <div className="absolute right-[-20px] top-1.5">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}