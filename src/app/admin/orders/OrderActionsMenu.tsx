"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, Eye, Truck, XCircle, Trash2, CheckCircle } from "lucide-react"
import { updateOrderStatus } from "@/app/actions/admin"

export default function OrderActionsMenu({ orderId }: { orderId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-zinc-800 rounded-full transition-all text-gray-400 hover:text-white"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col gap-0.5">
            <Link 
              href={`/admin/orders/${orderId}`}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-700 dark:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <Eye className="w-4 h-4 text-gray-500" /> View Details
            </Link>
            
            <button 
                onClick={() => { updateOrderStatus(orderId, "SHIPPED"); setIsOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-blue-50 text-blue-600 rounded-lg w-full text-left"
            >
              <Truck className="w-4 h-4" /> Mark Shipped
            </button>
            
            <button 
                onClick={() => { updateOrderStatus(orderId, "DELIVERED"); setIsOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-green-50 text-green-600 rounded-lg w-full text-left"
            >
              <CheckCircle className="w-4 h-4" /> Mark Delivered
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-zinc-800 my-1" />
            
            <button 
                onClick={() => { updateOrderStatus(orderId, "CANCELLED"); setIsOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-red-50 text-red-600 rounded-lg w-full text-left"
            >
              <XCircle className="w-4 h-4" /> Cancel Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}