import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/lib/shop-utils" 
import { ShoppingBag, X, Heart, AlertCircle, ArrowRight } from "lucide-react"
import { AddToCartButton } from "@/components/ui/AddToCartButton"
import { toggleWishlist } from "@/app/actions/wishlist"

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/wishlist")
  }

  // Fetch Wishlisted Items
  const wishlist = await prisma.wishlistItem.findMany({
    where: { 
      user: { email: session.user.email } 
    },
    include: {
      product: {
        include: {
          images: { take: 1 }
        }
      }
    }
  })

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" /> My Wishlist
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later.
          </p>
        </div>

        {/* --- CONTENT --- */}
        {wishlist.length === 0 ? (
          // Empty State
          <div className="text-center py-24 bg-white/50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
              Looks like you haven't found anything you fancy yet. Browse our store to find your next favorite item.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 hover:scale-105"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          // Product Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col relative">
                
                {/* Remove Button (Top Right) */}
                <form 
                  action={async () => {
                    'use server'
                    await toggleWishlist(item.productId)
                  }}
                  className="absolute top-3 right-3 z-20"
                >
                  <button className="bg-white/90 dark:bg-black/60 backdrop-blur-md p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </form>

                {/* Product Image */}
                <Link href={`/products/${item.product.id}`} className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden block">
                  {item.product.images?.[0]?.url ? (
                    <img 
                      src={item.product.images[0].url} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <AlertCircle className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
                      <p className="text-white text-xs font-bold text-center">View Product</p>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <Link href={`/products/${item.product.id}`} className="block">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {item.product.name}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.product.category}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-3">
                    <p className="font-black text-lg text-gray-900 dark:text-white">
                        {formatPrice(Number(item.product.price))}
                    </p>
                    <div className="shrink-0">
                       <AddToCartButton 
                          product={{
                            ...item.product, 
                            price: Number(item.product.price),
                            imageUrl: item.product.images?.[0]?.url || "/placeholder.jpg"
                          }} 
                       />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}