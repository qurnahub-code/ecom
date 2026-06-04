import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowLeft, User, Calendar } from "lucide-react"
import { ReviewForm } from "@/components/products/ReviewForm" 
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { formatDate, renderStars } from "@/lib/shop-utils"

interface PageProps { params: Promise<{ id: string }> }

export default async function ProductReviewsPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const product = await prisma.product.findUnique({
    where: { id },
    include: { reviews: { orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true } } } } }
  })

  if (!product) notFound()

  let existingReview = null
  let userId = null
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    if (user) {
        userId = user.id
        existingReview = product.reviews.find(r => r.userId === user.id)
    }
  }

  const averageRating = product.reviews.length > 0 ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/products/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-500 mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Product</Link>
          <div><h1 className="text-3xl font-black text-gray-900 dark:text-white">Reviews: {product.name}</h1></div>
        </div>

        {/* Form (Edit or New) */}
        {session ? (
            <div className="mb-10">
                <ReviewForm 
                    productId={product.id} 
                    initialRating={existingReview?.rating || 0} 
                    initialComment={existingReview?.comment || ""} 
                    initialImages={existingReview?.images || []}
                    isEditing={!!existingReview} 
                />
            </div>
        ) : (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-10 text-center"><p className="text-indigo-800 dark:text-indigo-200">Please <Link href="/login" className="font-bold underline">log in</Link> to write a review.</p></div>
        )}

        {/* List */}
        <div className="space-y-6">
          {product.reviews.map((review) => (
              <div key={review.id} className={`bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm ${review.userId === userId ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-gray-100 dark:border-white/5'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">{review.user.name?.[0] || <User className="w-5 h-5" />}</div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{review.user.name || "Anonymous"} {review.userId === userId && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">YOU</span>}</p>
                      <div className="flex text-yellow-400 text-xs">{renderStars(review.rating).map((isFilled, i) => <Star key={i} className={`w-3 h-3 ${isFilled ? "fill-current" : "text-gray-200 dark:text-zinc-700"}`} />)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="w-3 h-3" /> {formatDate(review.createdAt)}</div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                
                {/* Images */}
                {review.images && review.images.length > 0 && (
                   <div className="flex gap-2 mt-3">{review.images.map((img: string, i: number) => <img key={i} src={img} className="w-16 h-16 rounded-lg object-cover border border-gray-100 dark:border-white/10" />)}</div>
                )}
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}