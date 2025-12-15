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
      // [FIX] Select the first image from the relation instead of 'imageUrl'
      images: {
        take: 1,
        select: {
          url: true
        }
      }
    }
  })

  // [FIX] Map the result to flatten the image URL for the frontend
  return products.map(product => ({
    ...product,
    imageUrl: product.images[0]?.url || '/placeholder.jpg' // Fallback if empty
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
      lte: maxPrice || 100000
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

  let orderBy: any = {}
  if (sort === 'Price Low-High') orderBy = { price: 'asc' }
  else if (sort === 'Price High-Low') orderBy = { price: 'desc' }
  else if (sort === 'Newest') orderBy = { createdAt: 'desc' }
  else orderBy = { id: 'asc' }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      reviews: true,
      // [FIX] Include images so we can display them
      images: {
        take: 1
      }
    }
  })

  return products.map(p => ({
    ...p,
    price: Number(p.price),
    // [FIX] Map the first image url to 'imageUrl' so your UI components keep working
    imageUrl: p.images[0]?.url || '/placeholder.jpg',
    rating: p.reviews.length > 0 
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
      : 0,
    sales: 0 
  }))
}