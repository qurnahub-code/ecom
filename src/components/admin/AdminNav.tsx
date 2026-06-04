"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Briefcase, 
  Truck, 
  Store,
  ClipboardList,
  Activity // Added for the distinct "Overview" icon
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  // Helper: Checks if the path is active
  // We strictly distinguish between root "/admin" and "/admin/overview"
  const isActive = (path: string) => {
     if (path === "/admin") return pathname === "/admin"
     return pathname === path || (path !== "/admin" && pathname.startsWith(path))
  }

  // Dynamic Class Generator (Your Theme-Aware Styles)
  const linkClass = (path: string) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive(path) 
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-screen sticky top-0 overflow-y-auto">
      
      {/* 1. HEADER: The "Home" Button */}
      {/* Clicking this takes you to the Main Admin Page (Charts) */}
      <div className="p-6 pb-2">
        <Link href="/admin" className="block hover:opacity-80 transition-opacity">
           <h2 className="text-2xl font-black tracking-tight text-foreground">Admin Panel</h2>
        </Link>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="mt-4 px-4 space-y-2 flex-1">
        
        {/* Overview (Sub-page) */}
        <Link href="/admin/overview" className={linkClass("/admin/overview")}>
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </Link>

        {/* Products */}
        <Link href="/admin/products" className={linkClass("/admin/products")}>
          <Package className="w-5 h-5" />
          Products
        </Link>

        {/* Inventory */}
        <Link href="/admin/inventory" className={linkClass("/admin/inventory")}>
          <ClipboardList className="w-5 h-5" />
          Inventory
        </Link>

        {/* Vendor Orders (Restored) */}
        <Link href="/admin/vendor-orders" className={linkClass("/admin/vendor-orders")}>
          <Truck className="w-5 h-5" />
          Vendor Orders
        </Link>

        {/* Orders */}
        <Link href="/admin/orders" className={linkClass("/admin/orders")}>
          <ShoppingCart className="w-5 h-5" />
          Orders
        </Link>

        {/* Customers */}
        <Link href="/admin/customers" className={linkClass("/admin/customers")}>
          <Users className="w-5 h-5" />
          Customers
        </Link>

        {/* Job Postings */}
        <Link href="/admin/jobs" className={linkClass("/admin/jobs")}>
          <Briefcase className="w-5 h-5" />
          Job Postings
        </Link>
      </nav>
      
      {/* 3. FOOTER: View Store */}
      <div className="p-4 mt-auto border-t border-border">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all font-medium"
        >
          <Store className="w-4 h-4" />
          View Store
        </Link>
      </div>
    </aside>
  )
}