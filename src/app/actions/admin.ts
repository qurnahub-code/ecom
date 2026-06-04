'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

// --- HELPER: Safe Number Parsing ---
const parseNumber = (value: any, fallback = 0) => {
  const num = parseFloat(value?.toString())
  return isNaN(num) ? fallback : num
}

// --- HELPER: Image Upload Handler ---
async function handleImageUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
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
    
    // Advanced & Inventory Fields
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
    const origin = formData.get("origin") as string // [NEW]
    
    // [NEW] Handle Date Parsing
    const expiryRaw = formData.get("expiryDate") as string
    const expiryDate = expiryRaw ? new Date(expiryRaw) : null
    
    // Handle Image Upload
    const file = formData.get('image') as unknown as File
    const imagePath = await handleImageUpload(file)

    await prisma.product.create({
      data: {
        name, price, stock, category, description,
        sku, brand, barcode, qrCode, costPrice,
        taxRate, minStock, unit, vendor, tags,
        origin, 
        expiryDate,
        images: imagePath ? {
          create: [{ url: imagePath, altText: name }]
        } : undefined
      }
    })

  } catch (error) {
    console.error("Create Product Error:", error)
    throw new Error("Failed to create product") 
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

// 2. UPDATE PRODUCT (Consolidated)
export async function updateProductDetails(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) throw new Error("Product ID is required for update")

  try {
    const name = formData.get("name") as string
    const price = parseNumber(formData.get("price"))
    const stock = parseNumber(formData.get("stock"))
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    
    // Advanced & Inventory Fields
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
    const origin = formData.get("origin") as string // [NEW]

    // [NEW] Handle Date Parsing
    const expiryRaw = formData.get("expiryDate") as string
    const expiryDate = expiryRaw ? new Date(expiryRaw) : null

    // Handle Image Upload
    const file = formData.get('image') as unknown as File
    const newImagePath = await handleImageUpload(file)

    // DB Update
    await prisma.$transaction(async (tx) => {
      // 1. Update fields
      await tx.product.update({
        where: { id },
        data: {
          name, price, stock, category, description,
          sku, brand, barcode, qrCode, costPrice,
          taxRate, minStock, unit, vendor, tags,
          origin,
          expiryDate
        }
      })

      // 2. Replace Image if new one uploaded
      if (newImagePath) {
        await tx.productImage.deleteMany({ where: { productId: id } })
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
  revalidatePath('/admin/inventory') // [NEW] Refresh inventory page too
  redirect('/admin/products')
}

// 3. DELETE PRODUCT
export async function removeProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
    revalidatePath('/admin/inventory')
  } catch (error) {
    console.error("Delete Error:", error)
    throw new Error("Failed to delete product")
  }
}

// 4. REORDER STOCK (Simulated)
export async function reorderStock(productId: string, vendor: string) {
  console.log(`🚀 Sending Purchase Order to ${vendor} for Product ID: ${productId}`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, you might update a "status" field on the product or create a "PurchaseOrder" record
  return { success: true, message: `Order placed with ${vendor}` }
}

// --- USER CRUD ACTIONS ---

// 1. Delete User
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/admin/users')
    revalidatePath('/admin/customers')
    return { success: true }
  } catch (error) {
    console.error("Delete User Error:", error)
    return { success: false, error: "Failed to delete user." }
  }
}

// 2. Update User Role
export async function updateUserRole(id: string, newRole: string) {
  try {
    await prisma.user.update({
      where: { id },
      data: { role: newRole as Role }
    })
    revalidatePath('/admin/users')
    revalidatePath('/admin/customers')
    return { success: true }
  } catch (error) {
    console.error("Update User Role Error:", error)
    return { success: false, error: "Failed to update user role." }
  }
}

// --- ORDER CRUD ACTIONS ---

// Delete Order
export async function deleteOrder(id: string) {
  try {
    // Delete order items first (if cascade delete is not set on db)
    await prisma.orderItem.deleteMany({ where: { orderId: id } })
    // Delete order
    await prisma.order.delete({ where: { id } })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error("Delete Order Error:", error)
    return { success: false, error: "Failed to delete order." }
  }
}