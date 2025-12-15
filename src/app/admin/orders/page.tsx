// src/app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma"
import { StatusSelector } from "@/components/admin/StatusSelector"
import { Truck, MapPin, Phone } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  // Fetch ALL orders, newest first
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true } // Include items to count them
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold border-b">Order Details</th>
                <th className="px-6 py-4 font-semibold border-b">Shipping Info</th>
                <th className="px-6 py-4 font-semibold border-b">Items</th>
                <th className="px-6 py-4 font-semibold border-b">Total</th>
                <th className="px-6 py-4 font-semibold border-b">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  
                  {/* Column 1: ID & Date */}
                  <td className="px-6 py-4 align-top">
                    <div className="font-mono text-xs text-gray-400 mb-1">#{order.id.slice(0, 8)}</div>
                    <div className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </td>

                  {/* Column 2: Customer & Shipping */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="font-medium text-gray-900">{order.guestName}</div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[200px]">{order.address}, {order.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-3 h-3 text-gray-400" />
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Items Count */}
                  <td className="px-6 py-4 align-top">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                       {order.items.length} Items
                     </span>
                     <div className="mt-2 text-xs text-gray-400">
                        {/* Show first item name as preview */}
                        {order.items[0]?.quantity}x Product...
                     </div>
                  </td>

                  {/* Column 4: Total */}
                  <td className="px-6 py-4 align-top">
                    <div className="text-sm font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</div>
                  </td>

                  {/* Column 5: Action (Status Selector) */}
                  <td className="px-6 py-4 align-top">
                    <StatusSelector id={order.id} currentStatus={order.status} />
                  </td>

                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No orders received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}