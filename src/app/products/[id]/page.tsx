import { getProductById } from "@/modules/products/product.service"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/ui/AddToCartButton"
import { WishlistButton } from "@/components/ui/WishlistButton" // [NEW] Import Component
import { getServerSession } from "next-auth" // [NEW] Import Session
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // [NEW] Import Auth Options
import { prisma } from "@/lib/prisma" // [NEW] Import DB
import { ReviewList } from "@/components/products/ReviewList" // [NEW] Import ReviewList Component

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 1. Unwrap the params
  const { id } = await params

  // 2. Fetch the raw data from database
  const product = await getProductById(id)

  // 3. Handle 404
  if (!product) {
    notFound()
  }

  // 4. [NEW] Check Wishlist Status Server-Side
  const session = await getServerSession(authOptions)
  let isWishlisted = false

  if (session?.user?.email) {
    // We need the User ID to check the wishlist relation
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

  // 5. Create a "Clean" object for the Client Component
  const productForCart = {
    id: product.id,
    name: product.name,
    price: product.price.toNumber(),
    imageUrl: product.imageUrl,
    category: product.category
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* LEFT: Image Section */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative border border-gray-200">
            {productForCart.imageUrl ? (
              <img 
                src={productForCart.imageUrl} 
                alt={productForCart.name} 
                className="w-full h-full object-cover object-center"
              />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
            )}
          </div>

          {/* RIGHT: Details Section */}
          <div>
            <div className="mb-6">
              <span className="text-sm text-indigo-600 font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>
              <p className="text-2xl text-gray-900 mt-4 font-bold">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <AddToCartButton product={productForCart} />
              
              {/* [UPDATED] Replaced static button with functional component */}
              <WishlistButton 
                productId={product.id} 
                initialIsActive={isWishlisted} 
              />
            </div>

            {/* Extra Info */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Stock Available: <span className="font-medium text-gray-900">{product.stock} units</span>
              </p>
            </div>

            <ReviewList productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  )
}