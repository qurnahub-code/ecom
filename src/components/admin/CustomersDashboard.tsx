"use client"

import { useState, useMemo } from "react"
import { 
  Search, Mail, MoreHorizontal, Filter, 
  ArrowUpDown, Crown, UserCheck, UserPlus, Trash2
} from "lucide-react"
import Link from "next/link"
import { updateUserRole, deleteUser } from "@/app/actions/admin"

export default function CustomersDashboard({ initialUsers }: { initialUsers: any[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL") // ALL, VIP, ACTIVE, NEW

  // --- 1. FILTERING LOGIC ---
  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
      
      if (!matchesSearch) return false
      
      if (filter === "VIP") return user.status === "VIP"
      if (filter === "ACTIVE") return user.status === "Active"
      if (filter === "NEW") return user.status === "New"
      
      return true
    })
  }, [search, filter, initialUsers])

  // --- 2. CALCULATE METRICS ---
  const metrics = {
    total: initialUsers.length,
    vip: initialUsers.filter(u => u.status === "VIP").length,
    new: initialUsers.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    active: initialUsers.filter(u => u.ordersCount > 0).length
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Customers" 
          value={metrics.total} 
          icon={UserCheck} 
          color="blue"
          onClick={() => setFilter("ALL")}
          active={filter === "ALL"}
        />
        <StatCard 
          label="VIP Members" 
          value={metrics.vip} 
          subtext="Spent > Rs. 50,000"
          icon={Crown} 
          color="purple"
          onClick={() => setFilter("VIP")}
          active={filter === "VIP"}
        />
        <StatCard 
          label="New Signups" 
          value={metrics.new} 
          subtext="Last 7 Days"
          icon={UserPlus} 
          color="green"
          onClick={() => setFilter("NEW")}
          active={filter === "NEW"}
        />
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
             <Filter className="w-4 h-4" /> Filter
           </button>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-semibold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No customers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} />
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    {/* Orders Count */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{user.ordersCount}</span>
                      <span className="text-xs text-muted-foreground ml-1">orders</span>
                    </td>

                    {/* Total Spent (LTV) */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">${user.totalSpent.toLocaleString()}</span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                         {/* Role Selector */}
                         <select 
                           value={user.role} 
                           onChange={async (e) => {
                             const confirmChange = window.confirm(`Are you sure you want to change ${user.name}'s role to ${e.target.value}?`)
                             if (confirmChange) {
                               const res = await updateUserRole(user.id, e.target.value)
                               if (res.success) {
                                 alert("Role updated successfully!")
                                 window.location.reload()
                               } else {
                                 alert(res.error || "Failed to update role")
                               }
                             }
                           }}
                           className="bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                         >
                           <option value="CUSTOMER">Customer</option>
                           <option value="ADMIN">Admin</option>
                           <option value="SUPPORT">Support</option>
                         </select>

                         {/* Delete Button */}
                         <button 
                           onClick={async () => {
                             const confirmDelete = window.confirm(`Are you sure you want to delete customer ${user.name}? This action is irreversible.`)
                             if (confirmDelete) {
                               const res = await deleteUser(user.id)
                               if (res.success) {
                                 alert("Customer deleted successfully!")
                                 window.location.reload()
                               } else {
                                 alert(res.error || "Failed to delete customer")
                               }
                             }
                           }}
                           className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 rounded-lg transition-colors group/delete" 
                           title="Delete Customer"
                         >
                           <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600 dark:hover:text-red-400" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-xs text-center text-muted-foreground mt-4">
        Showing {filteredUsers.length} of {initialUsers.length} customers
      </div>
    </div>
  )
}

/* --- FIXED STAT CARD COMPONENT --- */

function StatCard({ label, value, icon: Icon, color, subtext, onClick, active }: any) {
  const colors: any = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20",
    green: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20",
  }

  return (
    <div 
      onClick={onClick}
      // [FIX]: Ensure 'bg-card' is present in BOTH states to prevent transparency
      className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 bg-card
        ${active 
          ? "border-primary ring-1 ring-primary/20" 
          : "border-border hover:border-primary/50"
        }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {subtext && <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full text-muted-foreground">{subtext}</span>}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-foreground mt-1">{value}</h3>
      </div>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
      {initials}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    VIP: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    Active: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    New: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status === 'VIP' && <Crown className="w-3 h-3" />}
      {status}
    </span>
  )
}