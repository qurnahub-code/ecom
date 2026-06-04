"use client"

import { Trash2 } from "lucide-react"
import { deleteOrder } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete order #${orderId.slice(0, 8).toUpperCase()}? This action is irreversible.`
    )
    if (!confirmDelete) return

    setLoading(true)
    try {
      const res = await deleteOrder(orderId)
      if (res.success) {
        alert("Order deleted successfully!")
        router.push("/admin/orders")
      } else {
        alert(res.error || "Failed to delete order")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while deleting the order.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white shadow-lg shadow-red-600/20 rounded-xl font-bold text-sm transition-all hover:scale-105"
    >
      <Trash2 className="w-4 h-4" /> 
      {loading ? "Deleting..." : "Delete Order"}
    </button>
  )
}
