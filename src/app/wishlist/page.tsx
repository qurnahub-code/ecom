import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/lib/shop-utils" // Using our new function file
import { ShoppingBag, XCircle } from "lucide-react"
import { AddToCartButton } from "@/components/ui/AddToCartButton"
import { toggleWishlist } from "@/app/actions/wishlist"

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Fetch Wishlisted Items
  const wishlist = await prisma.wishlistItem.findMany({
    where: { 
      user: { email: session.user.email } 
    },
    include: { product: true }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length})</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link href="/" className="text-indigo-600 font-bold mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white border rounded-xl overflow-hidden relative group">
              
              {/* Remove Button (Server Action form) */}
              <form action={async () => {
                'use server'
                await toggleWishlist(item.productId)
              }}>
                <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 z-10 transition">
                  <XCircle className="w-5 h-5" />
                </button>
              </form>

              {/* Product Image */}
              <div className="h-48 bg-gray-100 relative">
                {item.product.imageUrl && <img src={item.product.imageUrl} className="w-full h-full object-cover" />}
              </div>

              {/* Details */}
              <div className="p-4">
                <Link href={`/products/${item.product.id}`} className="font-bold hover:underline line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-gray-900 font-medium mt-1">{formatPrice(Number(item.product.price))}</p>
                
                <div className="mt-4">
                  <AddToCartButton product={{...item.product, price: Number(item.product.price)}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}