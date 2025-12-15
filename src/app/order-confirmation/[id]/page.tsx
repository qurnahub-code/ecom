// src/app/order-confirmation/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CheckCircle, Copy, Home, Printer } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params

  // 1. Fetch the Order
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  })

  if (!order) notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* SUCCESS HEADER */}
        <div className="bg-white p-8 rounded-t-2xl shadow-sm border-b border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
          <p className="text-gray-500 mt-2">Order ID: <span className="font-mono text-gray-900">#{order.id.slice(0, 8)}</span></p>
        </div>

        {/* BANKING INSTRUCTIONS (Only show if payment was Bank Transfer) */}
        {order.paymentMethod === 'bank' && (
          <div className="bg-indigo-600 text-white p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                🏦 Payment Required
              </h2>
              <p className="text-indigo-100 mb-6 text-sm">
                Please transfer the total amount to the account below. Your order will be shipped once payment is received.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">Bank Name</p>
                    <p className="text-xl font-bold mt-1">Local City Bank</p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">Account Title</p>
                    <p className="text-xl font-bold mt-1">E-Com Platform Ltd</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">Account Number (IBAN)</p>
                    <div className="flex items-center gap-3 mt-1 group cursor-pointer">
                      <p className="text-2xl font-mono font-bold">PK36 MEZN 0000 1234 5678 90</p>
                      <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="bg-white p-8 rounded-b-2xl shadow-sm border border-t-0 border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-8">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                    Img
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">${Number(item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <div className="text-gray-500">
              <p className="text-sm">Shipping to:</p>
              <p className="font-medium text-gray-900">{order.address}, {order.city}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 flex gap-4">
            <Link href="/" className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-center hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Link>
            <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}