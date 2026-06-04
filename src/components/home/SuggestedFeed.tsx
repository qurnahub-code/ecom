"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/products/ProductCard"
import { Loader2 } from "lucide-react"

export function SuggestedFeed() {
  const [products, setProducts] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const fetchMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    
    try {
      const res = await fetch(`/api/products/suggested?page=${page}`)
      const data = await res.json()
      
      if (data.products.length > 0) {
        setProducts(prev => [...prev, ...data.products])
        setPage(prev => prev + 1)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  // Initial Load
  useEffect(() => {
    fetchMore()
  }, [])

  if (!initialized) return null

  return (
    <section className="py-24 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-950/50">
      <div className="max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white">Just For You</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Personalized recommendations based on trends.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 min-[2200px]:grid-cols-8 gap-4 mb-12">
          {products.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="h-full">
               {/* Ensure we parse price correctly for the card */}
               <ProductCard product={{...product, price: Number(product.price)}} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          {hasMore ? (
            <button 
              onClick={fetchMore}
              disabled={loading}
              className="group relative px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full font-bold text-sm shadow-sm hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 text-black dark:text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </span>
              ) : (
                "Explore More Items"
              )}
            </button>
          ) : (
             <p className="text-gray-400 text-sm">You've reached the end of the collection!</p>
          )}
        </div>

      </div>
    </section>
  )
}