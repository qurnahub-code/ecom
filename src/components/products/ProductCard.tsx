"use client"

import Link from "next/link"
import { Star, ExternalLink, ImageIcon } from "lucide-react"
import { WishlistButton } from "@/components/ui/WishlistButton"

interface ProductCardProps {
  product: any
  isWishlisted?: boolean
  layout?: 'grid' | 'list' // [NEW] Supports toggling views
}

export function ProductCard({ product, isWishlisted = false, layout = 'grid' }: ProductCardProps) {
  
  const openImageInNewWindow = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(url, '_blank')
  }

  return (
    <Link 
      href={`/products/${product.id}`} 
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex ${layout === 'list' ? 'flex-row h-40' : 'flex-col h-full'}`}
    >
      {/* --- IMAGE SECTION --- */}
      {/* We change width based on layout prop */}
      <div className={`relative overflow-hidden bg-gray-100 ${layout === 'list' ? 'w-40 h-full shrink-0' : 'w-full aspect-square'}`}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon size={24} />
          </div>
        )}

        {/* OVERLAYS */}
        
        {/* 1. Category Badge (Top Left) */}
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
          {product.category || 'Item'}
        </span>

        {/* 2. Wishlist Button (Top Right) */}
        <div className="absolute top-2 right-2 z-20 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.preventDefault()}>
           <WishlistButton productId={product.id} initialIsActive={isWishlisted} />
        </div>

        {/* 3. Open Image Button (Bottom Right) */}
        {product.imageUrl && (
          <button 
            onClick={(e) => openImageInNewWindow(e, product.imageUrl)}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-gray-700 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:text-indigo-600 hover:scale-110 z-20"
            title="Open Image"
          >
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className={`p-4 flex flex-col flex-grow ${layout === 'list' ? 'justify-center' : ''}`}>
        
        {/* Rating Row */}
        <div className="flex items-center gap-1 text-yellow-400 mb-1">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-[10px] text-gray-400 font-medium ml-1">
            {product.rating ? product.rating.toFixed(1) : '4.5'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Description (Only show in List view or if space permits) */}
        {layout === 'list' && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        
        {/* Price & Action */}
        <div className={`flex items-center justify-between ${layout === 'grid' ? 'mt-auto pt-3 border-t border-gray-50' : 'mt-2'}`}>
          <span className="text-lg font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded group-hover:bg-black group-hover:text-white transition-colors">
            VIEW
          </span>
        </div>
      </div>
    </Link>
  )
}