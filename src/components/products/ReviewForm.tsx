"use client"

import { useState } from "react"
import { Star, Send, Loader2, Edit2, Image as ImageIcon, X } from "lucide-react"
import { submitReview } from "@/app/actions/user"
import { useRouter } from "next/navigation"

interface ReviewFormProps {
  productId: string
  initialRating?: number
  initialComment?: string
  initialImages?: string[]
  isEditing?: boolean
  onSuccess?: () => void
}

export function ReviewForm({ 
  productId, 
  initialRating = 0, 
  initialComment = "", 
  initialImages = [], 
  isEditing = false,
  onSuccess
}: ReviewFormProps) {
  
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  const [images, setImages] = useState<string[]>(initialImages)
  const [loading, setLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const router = useRouter()

  // --- MOCK IMAGE UPLOAD ---
  // In a real production app, you would upload the file to Cloudinary/Uploadthing here
  // and get a real URL back. For now, we use a local blob URL to simulate it.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const fakeUrl = URL.createObjectURL(e.target.files[0])
       setImages(prev => [...prev, fakeUrl]) 
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, i) => i !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return alert("Please select a rating")
    
    setLoading(true)
    const res = await submitReview(productId, rating, comment, images)
    setLoading(false)

    if (res.success) {
      if (!isEditing) {
          // Reset form only if creating new
          setRating(0)
          setComment("")
          setImages([])
      }
      router.refresh()
      if (onSuccess) onSuccess()
    } else {
      alert("Failed to submit review.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl mb-8 relative transition-all">
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        {isEditing ? <><Edit2 className="w-4 h-4 text-indigo-500" /> Edit Your Review</> : "Write a Review"}
      </h3>
      
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              className={`w-6 h-6 ${
                star <= (hoveredStar || rating) 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300 dark:text-zinc-600"
              }`} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 pt-0.5">
            {rating > 0 ? `${rating} Stars` : "Select Rating"}
        </span>
      </div>

      {/* Image Upload UI */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 group">
                    <img src={img} alt="Review" className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
            
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:text-indigo-500 text-gray-400 transition-colors bg-white dark:bg-zinc-900">
                <ImageIcon className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase mt-1">Add</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
        </div>
      </div>

      {/* Comment Input */}
      <div className="relative">
        <textarea
          required
          rows={3}
          placeholder="Share your thoughts..."
          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none pr-12 text-gray-900 dark:text-white placeholder:text-gray-400"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button 
          disabled={loading || !comment || rating === 0}
          className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </form>
  )
}