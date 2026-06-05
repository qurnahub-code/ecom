'use server'

import { prisma } from "@/lib/prisma"

// 1. Suggestions for the Navbar
export async function getSearchSuggestions(query: string) {
  if (!query || query.length < 2) return []

  const keywords = query.trim().split(/\s+/).filter(Boolean)
  if (keywords.length === 0) return []

  const products = await prisma.product.findMany({
    where: {
      AND: keywords.map(keyword => ({
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { category: { contains: keyword, mode: 'insensitive' } },
          { tags: { contains: keyword, mode: 'insensitive' } },
          { sku: { contains: keyword, mode: 'insensitive' } },
          { barcode: { contains: keyword, mode: 'insensitive' } }
        ]
      }))
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
  category?: string,
  brand?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: string,
  page?: number,
  limit?: number
}) {
  const { query, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = params

  const keywords = query ? query.trim().split(/\s+/).filter(Boolean) : []

  const whereClause: any = {
    AND: [
      // Price filters
      minPrice !== undefined ? { price: { gte: minPrice } } : {},
      maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
      
      // Category & Brand filters (Case-insensitive)
      category && category !== 'All' ? { category: { equals: category, mode: 'insensitive' } } : {},
      brand ? { brand: { equals: brand, mode: 'insensitive' } } : {}
    ]
  }

  // Apply keyword tokenized match if query exists
  if (keywords.length > 0) {
    whereClause.AND.push({
      AND: keywords.map(keyword => ({
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { category: { contains: keyword, mode: 'insensitive' } },
          { tags: { contains: keyword, mode: 'insensitive' } },
          { sku: { contains: keyword, mode: 'insensitive' } },
          { barcode: { contains: keyword, mode: 'insensitive' } }
        ]
      }))
    })
  }

  // Define sorting strategies
  let orderBy: any = { createdAt: 'desc' }
  
  switch (sort) {
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    case 'name_asc':
      orderBy = { name: 'asc' }
      break
    case 'name_desc':
      orderBy = { name: 'desc' }
      break
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' }
  }

  // Execute Count & Query in parallel for speed
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reviews: { select: { rating: true } },
        images: { take: 1 }
      }
    }),
    prisma.product.count({ where: whereClause })
  ])

  const data = products.map(p => ({
    ...p,
    price: Number(p.price),
    imageUrl: p.images[0]?.url || '/placeholder.jpg',
    rating: p.reviews.length > 0 
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
      : 0,
    sales: 0 
  }))

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}