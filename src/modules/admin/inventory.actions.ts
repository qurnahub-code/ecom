// src/modules/admin/inventory.actions.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Update Product Details
export async function updateProductDetails(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const barcode = formData.get("barcode") as string
  const vendor = formData.get("vendor") as string
  const origin = formData.get("origin") as string
  const expiryDate = formData.get("expiryDate") as string

  await prisma.product.update({
    where: { id },
    data: {
      name,
      barcode,
      vendor,
      origin,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    }
  })

  revalidatePath('/admin/inventory')
}

// 2. Remove Product
export async function removeProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/inventory')
}

// 3. Simulate Reorder (API Logic)
export async function reorderStock(productId: string, vendor: string) {
  // In a real app, this would send an email via SendGrid or call a Vendor API
  console.log(`🚀 Sending Purchase Order to ${vendor} for Product ID: ${productId}`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true, message: `Order placed with ${vendor}` }
}