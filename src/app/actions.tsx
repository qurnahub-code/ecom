'use server'

import { prisma } from "@/lib/prisma"

// 1. Suggestions for the Navbar
export async function getSearchSuggestions(query: string) {
  if (!query || query.length < 1) return []

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { barcode: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 6,
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      images: {
        take: 1,
        select: { url: true }
      }
    }
  })

  return products.map(product => ({
    ...product,
    imageUrl: product.images[0]?.url || '/placeholder.jpg'
  }))
}

// 2. Full Search for the Search Page
export async function searchProducts(params: {
  query?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: string
}) {
  const { query, minPrice, maxPrice, sort } = params

  const where: any = {
    price: {
      gte: minPrice || 0,
      lte: maxPrice || 1000000 // Increased max limit slightly
    }
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }, 
      { description: { contains: query, mode: 'insensitive' } },
      { barcode: { contains: query, mode: 'insensitive' } }
    ]
  }

  // ✅ FIX: Updated sorting logic to match SearchPage.tsx
  let orderBy: any = {}
  
  switch (sort) {
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    default:
      orderBy = { createdAt: 'desc' } // Default to newest if no valid sort provided
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      reviews: { select: { rating: true } }, // Optimize: only fetch rating
      images: {
        take: 1
      }
    }
  })

  return products.map(p => ({
    ...p,
    price: Number(p.price),
    imageUrl: p.images[0]?.url || '/placeholder.jpg',
    rating: p.reviews.length > 0 
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
      : 0,
    sales: 0 
  }))
}