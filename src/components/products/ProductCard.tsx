"use client"

import Link from "next/link"
import { Star, ExternalLink, ImageIcon } from "lucide-react"
import { WishlistButton } from "@/components/ui/WishlistButton"

interface ProductCardProps {
  product: any
  isWishlisted?: boolean
  layout?: 'grid' | 'list'
}

export function ProductCard({ product, isWishlisted = false, layout = 'grid' }: ProductCardProps) {
  
  // 1. Safe Image Accessor (Handles both Prisma relation array OR flat string)
  const mainImage = product.images?.[0]?.url || product.imageUrl || null

  const openImageInNewWindow = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(url, '_blank')
  }

  return (
    <Link 
      href={`/products/${product.id}`} 
      className={`group relative flex overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl
        /* LIGHT MODE: White bg, Gray border, Dark shadow */
        bg-white border-gray-200 shadow-sm
        /* DARK MODE: Zinc bg, subtle border, Black shadow */
        dark:bg-zinc-900 dark:border-white/10 dark:hover:shadow-black/50
        ${layout === 'list' ? 'flex-row h-40' : 'flex-col h-full'}
      `}
    >
      {/* --- IMAGE SECTION --- */}
      <div className={`relative overflow-hidden 
        /* Background for transparent vector images */
        bg-gray-100 dark:bg-zinc-800 
        ${layout === 'list' ? 'w-40 h-full shrink-0' : 'w-full aspect-square'}
      `}>
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-zinc-600">
            <ImageIcon size={24} />
          </div>
        )}

        {/* --- OVERLAYS --- */}
        
        {/* 1. Category Badge */}
        <span className="absolute top-2 left-2 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md
          bg-black/60 text-white 
          dark:bg-white/90 dark:text-black">
          {product.category || 'Item'}
        </span>

        {/* 2. Wishlist Button (Top Right) */}
        {/* We wrap it to handle the click event properly */}
        <div 
          className="absolute top-2 right-2 z-20 transition-opacity duration-300 opacity-100 sm:opacity-0 group-hover:opacity-100" 
          onClick={(e) => e.preventDefault()}
        >
           <WishlistButton productId={product.id} initialIsActive={isWishlisted} />
        </div>

        {/* 3. Open Image Button (Bottom Right) */}
        {mainImage && (
          <button 
            onClick={(e) => openImageInNewWindow(e, mainImage)}
            className="absolute bottom-2 right-2 z-20 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hover:scale-110
              /* High Contrast Colors */
              bg-zinc-900 text-white hover:bg-indigo-600
              dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white"
            title="Open Image"
          >
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className={`p-4 flex flex-col flex-grow ${layout === 'list' ? 'justify-center' : ''}`}>
        
        {/* Rating Row */}
        <div className="flex items-center gap-1 text-yellow-500 mb-1">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-[10px] font-medium ml-1 text-gray-500 dark:text-gray-400">
            {product.rating ? Number(product.rating).toFixed(1) : '4.5'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2 transition-colors
          text-gray-900 group-hover:text-indigo-600
          dark:text-white dark:group-hover:text-primary">
          {product.name}
        </h3>
        
        {/* Description (List View Only) */}
        {layout === 'list' && (
          <p className="text-xs line-clamp-2 mb-3 text-gray-500 dark:text-gray-400">
            {product.description}
          </p>
        )}
        
        {/* Price & Action */}
        <div className={`flex items-center justify-between ${layout === 'grid' ? 'mt-auto pt-3 border-t border-gray-100 dark:border-white/10' : 'mt-2'}`}>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          
          <span className="text-[10px] font-bold px-2 py-1 rounded transition-colors
            bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-white
            dark:bg-white/10 dark:text-gray-300 dark:group-hover:bg-white dark:group-hover:text-black">
            VIEW
          </span>
        </div>
      </div>
    </Link>
  )
}