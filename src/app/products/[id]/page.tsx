import { getProductById } from "@/modules/products/product.service"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/ui/AddToCartButton"
import { WishlistButton } from "@/components/ui/WishlistButton" 
import { getServerSession } from "next-auth" 
import { authOptions } from "@/lib/auth" 
import { prisma } from "@/lib/prisma" 
import { ReviewList } from "@/components/products/ReviewList" 
import { ReviewForm } from "@/components/products/ReviewForm"
import { ProductSupportChat } from "@/components/products/ProductSupportChat"
import { formatPrice } from "@/lib/shop-utils"
import { Package, Check, ShieldCheck, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

import { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  
  if (!product) {
    return {
      title: "Product Not Found"
    }
  }
  
  const title = `${product.name} | Volts Store`
  const description = product.description.slice(0, 160)
  const imageUrl = product.imageUrl || "https://voltsstore.vercel.app/icon.png"
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical: `/products/${id}`
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  // 1. Fetch Product
  const product = await getProductById(id)
  if (!product) notFound()

  // 2. Fetch Suggestions
  const suggestedProducts = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    take: 4,
    include: { images: true }
  })

  // 3. User Checks (Wishlist & Existing Review)
  let isWishlisted = false
  let existingReview = null

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ 
        where: { email: session.user.email }, 
        select: { id: true } 
    })

    if (user) {
      const wishlistEntry = await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId: user.id, productId: id } }
      })
      isWishlisted = !!wishlistEntry

      // Check if user already reviewed this product
      existingReview = await prisma.review.findFirst({
        where: { userId: user.id, productId: id }
      })
    }
  }

  const productForCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl || "https://voltsstore.vercel.app/icon.png",
    "description": product.description,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Volts Store"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://voltsstore.vercel.app/products/${product.id}`,
      "priceCurrency": "PKR",
      "price": Number(product.price).toFixed(0),
      "priceValidUntil": "2030-01-01",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Volts Store"
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-900/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
          
          {/* --- LEFT: PRODUCT IMAGE --- */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden aspect-square relative shadow-2xl p-2 group">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gray-100 dark:bg-zinc-800">
                {productForCart.imageUrl ? (
                <img src={productForCart.imageUrl} alt={productForCart.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400"><Package className="w-12 h-12 mb-2 opacity-50" />No Image</div>
                )}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT DETAILS --- */}
          <div>
            <div className="mb-8">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-500/30">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-4xl text-gray-900 dark:text-white font-black mt-6">
                {formatPrice(product.price)}
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">{product.description}</p>

            <div className="flex gap-6 mb-8 py-6 border-y border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Check className="w-5 h-5 text-green-500" /> Fast Delivery</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><ShieldCheck className="w-5 h-5 text-indigo-500" /> 1 Year Warranty</div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mb-10">
               <div className="flex gap-4">
                  <AddToCartButton product={productForCart} />
                  <WishlistButton productId={product.id} initialIsActive={isWishlisted} />
               </div>
               <ProductSupportChat productName={product.name} />
            </div>

            {/* --- PRODUCT SPECIFICATIONS --- */}
            <div className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-8 mb-10 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between py-3 border-b border-gray-100 dark:border-white/5">
                  <span className="text-muted-foreground">Country of Origin</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{product.origin || "Local"}</span>
                </div>
                {product.brand && (
                  <div className="flex justify-between py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-muted-foreground">SKU / Model</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-mono">{product.sku}</span>
                  </div>
                )}
                {product.barcode && (
                  <div className="flex justify-between py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-muted-foreground">Barcode</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-mono">{product.barcode}</span>
                  </div>
                )}
                {product.unit && (
                  <div className="flex justify-between py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-muted-foreground">Selling Unit</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{product.unit}</span>
                  </div>
                )}
                {product.expiryDate && (
                  <div className="flex justify-between py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-muted-foreground">Expiry Date</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(product.expiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
              
              {product.tags && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Product Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(",").map((tag: string) => {
                      const cleanTag = tag.trim()
                      if (!cleanTag) return null
                      return (
                        <Link 
                          key={cleanTag}
                          href={`/search?q=${encodeURIComponent(cleanTag)}`}
                          className="px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-colors border border-gray-200 dark:border-white/5"
                        >
                          #{cleanTag}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* --- REVIEWS SECTION (EMBEDDED) --- */}
            <div className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-8">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                    <Link href={`/products/${product.id}/reviews`} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                        See All <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
                 
                 {/* Logic: If logged in, show Form. If reviewed, Form will be in Edit Mode */}
                 {session ? (
                    <ReviewForm 
                        productId={product.id} 
                        initialRating={existingReview?.rating || 0}
                        initialComment={existingReview?.comment || ""}
                        initialImages={existingReview?.images || []}
                        isEditing={!!existingReview} // True if review exists
                    />
                 ) : (
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-8 text-center border border-gray-100 dark:border-white/5">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Please <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">log in</Link> to write a review.
                        </p>
                    </div>
                 )}
                 
                 <ReviewList productId={product.id} />
            </div>
          </div>
        </div>

        {/* --- SUGGESTED PRODUCTS --- */}
        {suggestedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-white/10 pt-16">
             <div className="flex items-center gap-3 mb-8"><Sparkles className="w-6 h-6 text-indigo-500" /><h2 className="text-3xl font-black text-gray-900 dark:text-white">You Might Also Like</h2></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {suggestedProducts.map((p) => (
                   <Link key={p.id} href={`/products/${p.id}`} className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                     <div className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                       {p.images?.[0]?.url ? <img src={p.images[0].url} alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-400"><Package className="w-10 h-10 opacity-20" /></div>}
                     </div>
                     <div className="p-5">
                       <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{p.category}</p>
                       <h3 className="font-bold text-gray-900 dark:text-white truncate">{p.name}</h3>
                       <p className="text-xl font-black text-gray-900 dark:text-white mt-2">{formatPrice(Number(p.price))}</p>
                     </div>
                   </Link>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  )
}