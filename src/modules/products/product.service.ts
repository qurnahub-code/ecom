import { prisma } from "@/lib/prisma"

// Function 1: Get Featured Products
export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 } // [FIX] Fetch the first image
    }
  })

  // [FIX] Flatten the data so the frontend receives 'imageUrl' as expected
  return products.map(p => ({
    ...p,
    price: Number(p.price), // Ensure price is a number, not Decimal
    imageUrl: p.images[0]?.url || '/placeholder.jpg'
  }))
}

// Function 2: Get Single Product
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true // Fetch all images for the detail page
    }
  })

  if (!product) return null

  return {
    ...product,
    price: Number(product.price),
    // [FIX] Provide the first image as the main imageUrl
    imageUrl: product.images[0]?.url || '/placeholder.jpg',
    images: product.images // Keep the full array for galleries
  }
}