'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

// --- ORDER ACTIONS ---
export async function updateOrderStatus(orderId: string, newStatus: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as any } // Cast to any to avoid Enum strictness issues during dev
  })
  revalidatePath('/admin/orders')
}

// --- PRODUCT ACTIONS ---

// 1. Create a New Product
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const price = parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const stock = parseInt(formData.get("stock") as string)
  const description = formData.get("description") as string
  const vendor = formData.get("vendor") as string
  const barcode = formData.get("barcode") as string
  const origin = formData.get("origin") as string
  const expiryRaw = formData.get("expiryDate") as string
  
  // Handle Image Upload
  const file: File | null = formData.get('image') as unknown as File
  let imagePath = ""

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`
    const uploadDir = join(process.cwd(), "public", "products")
    
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)
    imagePath = `/products/${filename}`
  }

  // Save to DB (Corrected for new Schema)
  await prisma.product.create({
    data: {
      name,
      price,
      category,
      stock,
      description,
      vendor,
      barcode,
      origin: origin || "Local",
      expiryDate: expiryRaw ? new Date(expiryRaw) : null,
      // [FIX] Save image to the new relation
      images: imagePath ? {
        create: [{ url: imagePath, altText: name }]
      } : undefined
    }
  })

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

// 2. Update Product
export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const price = parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const stock = parseInt(formData.get("stock") as string)
  const description = formData.get("description") as string
  const vendor = formData.get("vendor") as string
  const barcode = formData.get("barcode") as string
  
  // Handle Image Update
  const file: File | null = formData.get('image') as unknown as File
  
  await prisma.product.update({
    where: { id },
    data: {
      name, price, category, stock, description, vendor, barcode,
    }
  })

  // [FIX] If new image, add it to the relation
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`
    const uploadDir = join(process.cwd(), "public", "products")
    
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    // Create the new image entry
    await prisma.productImage.create({
      data: {
        url: `/products/${filename}`,
        altText: name,
        productId: id
      }
    })
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({ where: { id: productId } })
  revalidatePath('/admin/products')
}