import { prisma } from "@/lib/prisma"
import { Star, User } from "lucide-react"
import { formatDate, renderStars } from "@/lib/shop-utils" // Using our new function file

export async function ReviewList({ productId }: { productId: string }) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate Average
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        Customer Reviews
        <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          {reviews.length}
        </span>
      </h2>

      {/* Average Score */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-8 bg-gray-50 p-6 rounded-2xl">
          <div className="text-4xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</div>
          <div>
            <div className="flex text-yellow-400 mb-1">
              {renderStars(Math.round(avgRating)).map((isFilled, i) => (
                <Star key={i} className={`w-5 h-5 ${isFilled ? "fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {review.user.name?.slice(0, 2).toUpperCase() || <User size={14}/>}
                </div>
                <span className="font-semibold text-sm">{review.user.name || "Anonymous"}</span>
              </div>
              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
            </div>
            
            <div className="flex text-yellow-400 w-20 mb-2">
              {renderStars(review.rating).map((isFilled, i) => (
                <Star key={i} className={`w-3 h-3 ${isFilled ? "fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  )
}