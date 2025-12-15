// src/app/admin/layout.tsx
import Link from "next/link"
import { LayoutDashboard, Package, Users, Settings, LogOut, ClipboardList, Truck } from "lucide-react"
import { AiAssistant } from "@/components/admin/AiAssistant"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your store</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <Package className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <ClipboardList className="w-5 h-5" />
            Inventory
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/inventory/vendor-orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <Truck className="w-5 h-5" />
            Vendor Orders
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition cursor-not-allowed opacity-50">
            <Users className="w-5 h-5" />
            Customers (Soon)
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-900 transition">
            <LogOut className="w-5 h-5" />
            Exit to Store
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
        <AiAssistant />
      </main>
    </div>
  )
}