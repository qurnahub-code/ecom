import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/ProductForm"

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { take: 1 } } // Fetch images if needed
  })

  if (!product) notFound()

  // SERIALIZATION: Convert Decimals to numbers and Dates to strings
  // This is required because Client Components cannot receive complex Server types
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    stock: Number(product.stock),
    taxRate: product.taxRate ? Number(product.taxRate) : null,
    minStock: product.minStock ? Number(product.minStock) : 10,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    // Handle image URL specifically
    imageUrl: product.images?.[0]?.url || null, 
  }

  return <ProductForm initialData={serializedProduct} />
}