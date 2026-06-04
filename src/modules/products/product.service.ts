import { prisma } from "@/lib/prisma"

// Helper to convert Decimal to Number for the frontend
const serializeProduct = (product: any) => {
  return {
    ...product,
    price: Number(product.price),
    // [NEW] Handle Admin fields if they exist
    costPrice: product.costPrice ? Number(product.costPrice) : 0,
    taxRate: product.taxRate ? Number(product.taxRate) : 0,
    // Handle Images
    imageUrl: product.images?.[0]?.url || '/placeholder.jpg',
    images: product.images || []
  }
}

// Function 1: Get Featured Products (Used on Home Page)
export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 }
    }
  })

  return products.map(serializeProduct)
}

// Function 2: Get a single product by ID (Used on Detail Page)
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true // Fetch all images for gallery
    }
  })

  if (!product) return null

  return serializeProduct(product)
}

// Function 3: Get All Products (For Admin/Inventory)
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 }
    }
  })

  return products.map(serializeProduct)
}