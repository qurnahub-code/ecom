'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

// --- HELPER: Safe Number Parsing ---
const parseNumber = (value: any, fallback = 0) => {
  const num = parseFloat(value?.toString())
  return isNaN(num) ? fallback : num
}

// --- HELPER: Image Upload Handler ---
// NOTE: This only works locally or on a VPS. 
// For Vercel/Netlify, you must use a cloud service like UploadThing or AWS S3.
async function handleImageUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  // Clean filename to prevent issues
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase()
  const filename = `${Date.now()}-${safeName}`
  const uploadDir = join(process.cwd(), "public", "products")
  
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), buffer)
  
  return `/products/${filename}`
}

// --- ORDER ACTIONS ---
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any }
    })
    revalidatePath('/admin/orders')
  } catch (error) {
    console.error("Failed to update order:", error)
    throw new Error("Failed to update order status")
  }
}

// --- PRODUCT ACTIONS ---

// 1. CREATE PRODUCT
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const price = parseNumber(formData.get("price"))
    const stock = parseNumber(formData.get("stock"))
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    
    // Advanced Fields
    const sku = formData.get("sku") as string
    const brand = formData.get("brand") as string
    const barcode = formData.get("barcode") as string
    const qrCode = formData.get("qrCode") as string
    const costPrice = parseNumber(formData.get("costPrice"), 0)
    const taxRate = parseNumber(formData.get("taxRate"), 0)
    const minStock = parseNumber(formData.get("minStock"), 10)
    const unit = formData.get("unit") as string
    const vendor = formData.get("vendor") as string
    const tags = formData.get("tags") as string
    
    // Handle Image Upload
    const file = formData.get('image') as unknown as File
    const imagePath = await handleImageUpload(file)

    await prisma.product.create({
      data: {
        name,
        price,
        stock,
        category,
        description,
        sku,
        brand,
        barcode,
        qrCode,
        costPrice,
        taxRate,
        minStock,
        unit,
        vendor,
        tags,
        images: imagePath ? {
          create: [{ url: imagePath, altText: name }]
        } : undefined
      }
    })

  } catch (error) {
    console.error("Create Product Error:", error)
    // You might want to return an error state here instead of throwing
    throw new Error("Failed to create product") 
  }

  // Revalidate and Redirect must happen outside try/catch in Server Actions
  // if redirect is involved (as redirect throws a special error)
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

// 2. UPDATE PRODUCT
export async function updateProductDetails(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) throw new Error("Product ID is required for update")

  try {
    const name = formData.get("name") as string
    const price = parseNumber(formData.get("price"))
    const stock = parseNumber(formData.get("stock"))
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    
    // Advanced Fields
    const sku = formData.get("sku") as string
    const brand = formData.get("brand") as string
    const barcode = formData.get("barcode") as string
    const qrCode = formData.get("qrCode") as string
    const costPrice = parseNumber(formData.get("costPrice"), 0)
    const taxRate = parseNumber(formData.get("taxRate"), 0)
    const minStock = parseNumber(formData.get("minStock"), 10)
    const unit = formData.get("unit") as string
    const vendor = formData.get("vendor") as string
    const tags = formData.get("tags") as string

    // Handle Image Upload
    const file = formData.get('image') as unknown as File
    const newImagePath = await handleImageUpload(file)

    // ✅ DATABASE UPDATE
    await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      await tx.product.update({
        where: { id },
        data: {
          name, price, stock, category, description,
          sku, brand, barcode, qrCode, costPrice,
          taxRate, minStock, unit, vendor, tags,
        }
      })

      // 2. If new image uploaded, REPLACE old ones
      if (newImagePath) {
        // Option A: Delete all old images (Simplest for "Main Image" logic)
        await tx.productImage.deleteMany({ where: { productId: id } })
        
        // Add new image
        await tx.productImage.create({
          data: {
            url: newImagePath,
            altText: name,
            productId: id
          }
        })
      }
    })

  } catch (error) {
    console.error("Update Product Error:", error)
    throw new Error("Failed to update product")
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  redirect('/admin/products')
}

// 3. DELETE PRODUCT
export async function removeProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
  } catch (error) {
    console.error("Delete Error:", error)
    throw new Error("Failed to delete product")
  }
}