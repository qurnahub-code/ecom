import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CheckCircle, Copy, Home, Package, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params

  // 1. Fetch the Order directly from DB (Fast & Secure)
  const order = await prisma.order.findUnique({
    where: { id },
    include: { 
      items: { 
        include: { 
          product: {
            include: {
              images: { take: 1 }
            }
          } 
        } 
      } 
    }
  })

  if (!order) notFound()

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans flex items-center justify-center py-12">
      
      {/* Background Animation */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-3xl w-full px-4 sm:px-6">
        
        {/* SUCCESS CARD */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-10 text-center border-b border-gray-100 dark:border-white/5 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-900/10">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Order ID: <span className="font-mono font-bold text-gray-900 dark:text-white">#{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>

          {/* Order Progress Timeline */}
          <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-800/10">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-6">Order Status Timeline</h3>
            <div className="flex items-center justify-between max-w-lg mx-auto relative">
              {/* Connector Line */}
              <div className="absolute top-[18px] left-[5%] right-[5%] h-1 bg-gray-200 dark:bg-zinc-800 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000" 
                  style={{ 
                    width: order.status === 'DELIVERED' ? '100%' : 
                           order.status === 'SHIPPED' ? '66%' : 
                           (order.isPaid || order.paymentMethod === 'COD') ? '33%' : '0%' 
                  }}
                />
              </div>

              {/* Timeline Steps */}
              {[
                { 
                  label: "Placed", 
                  active: true, 
                  completed: true 
                },
                { 
                  label: "Paid / Verified", 
                  active: order.isPaid || order.paymentMethod === 'COD', 
                  completed: order.isPaid || order.paymentMethod === 'COD' || order.status === 'SHIPPED' || order.status === 'DELIVERED' 
                },
                { 
                  label: "Shipped", 
                  active: order.status === 'SHIPPED' || order.status === 'DELIVERED', 
                  completed: order.status === 'SHIPPED' || order.status === 'DELIVERED' 
                },
                { 
                  label: "Delivered", 
                  active: order.status === 'DELIVERED', 
                  completed: order.status === 'DELIVERED' 
                }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      step.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : step.active 
                        ? 'bg-indigo-500 border-indigo-500 text-white animate-pulse' 
                        : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400'
                    }`}
                  >
                    {step.completed ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 transition-colors ${
                    step.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Instructions (Dynamic) */}
          {(order.paymentMethod === 'JAZZCASH' || order.paymentMethod === 'EASYPAISA' || order.paymentMethod === 'COD') && (
            <div className="bg-indigo-600 dark:bg-indigo-900/50 text-white p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  Payment Status: <span className="opacity-80">{order.paymentMethod}</span>
                </h2>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  {order.paymentMethod === 'COD' 
                    ? "Please have the exact amount ready for the rider upon delivery."
                    : "If you haven't sent the payment yet, please complete the transfer using the details provided during checkout."}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="p-8 md:p-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" /> Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-white/5 flex items-center justify-center">
                      {item.product.images?.[0]?.url ? (
                        <img 
                          src={item.product.images[0].url} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{item.product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white font-mono">${Number(item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
               <div>
                 <p className="text-xs uppercase font-bold text-gray-400">Shipping Address</p>
                 <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{order.address}, {order.city}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs uppercase font-bold text-gray-400">Total Amount</p>
                 <p className="text-3xl font-black text-gray-900 dark:text-white">${Number(order.totalAmount).toFixed(2)}</p>
               </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="p-8 border-t border-gray-100 dark:border-white/10 flex gap-4">
            <Link href="/" className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Link>
            <Link href="/products" className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white py-4 rounded-xl font-bold text-center hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              Shop More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}