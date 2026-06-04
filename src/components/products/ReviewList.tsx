import { prisma } from "@/lib/prisma"
import { Star, User } from "lucide-react"
import { formatDate, renderStars } from "@/lib/shop-utils"

export async function ReviewList({ productId }: { productId: string }) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate Average
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0

  return (
    <div className="mt-16 border-t border-gray-100 dark:border-white/10 pt-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        Customer Reviews
        <span className="text-sm font-normal bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
          {reviews.length}
        </span>
      </h2>

      {/* Average Score */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</div>
          <div>
            <div className="flex text-yellow-400 mb-1">
              {renderStars(Math.round(avgRating)).map((isFilled, i) => (
                <Star key={i} className={`w-5 h-5 ${isFilled ? "fill-current" : "text-gray-300 dark:text-zinc-600"}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Based on {reviews.length} reviews</p>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-sm">
                  {review.user.name?.slice(0, 1).toUpperCase() || <User size={16}/>}
                </div>
                <div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white block">
                        {review.user.name || "Anonymous"}
                    </span>
                    <div className="flex text-yellow-400 w-20">
                        {renderStars(review.rating).map((isFilled, i) => (
                            <Star key={i} className={`w-3 h-3 ${isFilled ? "fill-current" : "text-gray-300 dark:text-zinc-600"}`} />
                        ))}
                    </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3 pl-14">
                {review.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}