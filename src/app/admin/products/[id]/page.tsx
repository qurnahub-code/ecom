// src/app/admin/products/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) notFound()

  return <ProductForm initialData={product} />
}