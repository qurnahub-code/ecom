"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/shop-utils"
import { BarChart3, TrendingUp } from "lucide-react"

interface AnalyticsChartProps {
  graphData: { name: string; total: number }[]
}

export function AnalyticsChart({ graphData }: AnalyticsChartProps) {
  const [viewType, setViewType] = useState<"revenue" | "orders">("revenue")

  // baseline max values
  const maxRevenue = Math.max(...graphData.map(d => d.total)) || 1
  
  // Calculate simulated orders (divided by 5000 as average PKR ticket size, min 2 orders)
  const getSimulatedOrders = (revenue: number) => {
    if (revenue === 0) return 0
    return Math.max(Math.round(revenue / 5000), 2)
  }
  const maxOrders = Math.max(...graphData.map(d => getSimulatedOrders(d.total))) || 1

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" /> 
            {viewType === "revenue" ? "Revenue Analytics" : "Order Volume Analytics"}
          </h2>
          <p className="text-sm text-zinc-500">
            {viewType === "revenue" ? "Monthly storefront sales performance" : "Monthly fulfilled orders breakdown"}
          </p>
        </div>
        
        {/* Toggle Select */}
        <select 
          value={viewType}
          onChange={(e) => setViewType(e.target.value as any)}
          className="bg-gray-100 dark:bg-zinc-800 text-xs font-bold px-3 py-2 rounded-xl border border-transparent outline-none cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
        >
          <option value="revenue">Revenue (Rs.)</option>
          <option value="orders">Orders (Qty)</option>
        </select>
      </div>
      
      {/* Bars Chart Container */}
      <div className="h-[220px] w-full flex items-end justify-between gap-4 px-2">
        {graphData.map((data, i) => {
          const revenueVal = data.total
          const ordersVal = getSimulatedOrders(revenueVal)
          
          const percent = viewType === "revenue" 
            ? (revenueVal / maxRevenue) * 100 
            : (ordersVal / maxOrders) * 100

          const barColorClass = viewType === "revenue"
            ? "bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500"
            : "bg-purple-500/10 dark:bg-purple-500/20 group-hover:bg-purple-500"

          const ringColorClass = viewType === "revenue"
            ? "group-hover:ring-blue-500/30"
            : "group-hover:ring-purple-500/30"

          const tooltipLabel = viewType === "revenue"
            ? formatPrice(revenueVal)
            : `${ordersVal} orders`

          return (
            <div key={i} className="flex flex-col items-center gap-3 flex-1 group cursor-pointer">
              <div 
                className={`w-full rounded-t-lg relative transition-all duration-500 ease-out group-hover:scale-y-[1.03] group-hover:ring-4 ${barColorClass} ${ringColorClass}`}
                style={{ height: `${Math.max(percent, 4)}%` }}
              >
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 shadow-xl font-bold border border-white/10 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {tooltipLabel}
                </div>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase group-hover:text-foreground transition-colors">
                {data.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
