// src\app\products\page.tsx
import { getProductById } from "@/modules/products/product.service"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/ui/AddToCartButton"
import { WishlistButton } from "@/components/ui/WishlistButton" 
import { getServerSession } from "next-auth" 
import { authOptions } from "@/lib/auth" 
import { prisma } from "@/lib/prisma" 
import { ReviewList } from "@/components/products/ReviewList" 
import { Package, Check, ShieldCheck, ArrowRight, Star, Sparkles } from "lucide-react"
import Link from "next/link"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  // 1. Fetch Current Product
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  // 2. Fetch Suggested Products (Same Category, exclude current)
  const suggestedProducts = await prisma.product.findMany({
    where: {
        category: product.category,
        NOT: { id: product.id }
    },
    take: 4,
    include: { images: true }
  })

  // 3. Check Wishlist Status
  const session = await getServerSession(authOptions)
  let isWishlisted = false

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email },
      select: { id: true } 
    })

    if (user) {
      const wishlistItem = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: id
          }
        }
      })
      isWishlisted = !!wishlistItem
    }
  }

  // 4. Clean Data for Client Components
  const productForCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* --- MAIN PRODUCT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">

          {/* LEFT: Image Section */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden aspect-square relative shadow-2xl p-2 group">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gray-100 dark:bg-zinc-800">
                {productForCart.imageUrl ? (
                <img 
                    src={productForCart.imageUrl} 
                    alt={productForCart.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                    <Package className="w-12 h-12 mb-2 opacity-50" />
                    No Image Available
                </div>
                )}
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    In Stock
                </div>
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div>
            <div className="mb-8">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-500/30">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-end gap-4 mt-6">
                  <p className="text-4xl text-gray-900 dark:text-white font-black tracking-tight">
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <p className="mb-1.5 text-lg text-gray-400 line-through decoration-red-500 decoration-2 font-medium">
                     ${(Number(product.price) * 1.2).toFixed(2)}
                  </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Features / Trust Badges */}
            <div className="flex gap-6 mb-8 py-6 border-y border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-5 h-5 text-green-500" /> Fast Delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" /> 1 Year Warranty
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-10">
              <AddToCartButton product={productForCart} />
              <WishlistButton 
                productId={product.id} 
                initialIsActive={isWishlisted} 
              />
            </div>

            {/* Extra Info */}
            <div className="mb-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stock Available: <span className="font-bold text-gray-900 dark:text-white">{product.stock} units</span>
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-8">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                    <Link 
                      href={`/products/${product.id}/reviews`}
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      See All <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
                 <ReviewList productId={product.id} />
            </div>
          </div>
        </div>

        {/* --- SUGGESTED PRODUCTS SECTION --- */}
        {suggestedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-white/10 pt-16">
             <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">You Might Also Like</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {suggestedProducts.map((p) => {
                 const displayImage = p.images?.[0]?.url || (p as any).imageUrl || null
                 
                 return (
                   <Link 
                     key={p.id} 
                     href={`/products/${p.id}`}
                     className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                   >
                     <div className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                       {displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={p.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                          />
                       ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 bg-gray-50 dark:bg-zinc-800/50">
                             <Package className="w-10 h-10 opacity-20" />
                          </div>
                       )}
                     </div>
                     <div className="p-5">
                       <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">{p.category}</p>
                       <h3 className="font-bold text-gray-900 dark:text-white truncate">{p.name}</h3>
                       <p className="text-xl font-black text-gray-900 dark:text-white mt-2">${Number(p.price).toFixed(2)}</p>
                     </div>
                   </Link>
                 )
               })}
             </div>
          </div>
        )}

      </div>
    </div>
  )
}