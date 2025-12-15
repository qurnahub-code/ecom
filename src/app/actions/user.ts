'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

// 1. Get Dashboard Data (One big fetch for efficiency)
export async function getUserDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
      paymentMethods: true,
      reviews: { include: { product: true } },
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
      }
    }
  })

  if (!user) return null

  // Calculate "Pending Reviews" (Items bought but not reviewed)
  // 1. Get all bought product IDs
  const boughtProductIds = new Set<string>()
  user.orders.forEach(order => {
    order.items.forEach(item => boughtProductIds.add(item.productId))
  })

  // 2. Get reviewed product IDs
  const reviewedProductIds = new Set(user.reviews.map(r => r.productId))

  // 3. Find difference
  const pendingReviewIds = [...boughtProductIds].filter(id => !reviewedProductIds.has(id))
  
  // 4. Fetch details for these products
  const pendingReviews = await prisma.product.findMany({
    where: { id: { in: pendingReviewIds } },
    select: { id: true, name: true, imageUrl: true }
  })

  return { ...user, pendingReviews }
}

// 2. Add Address
export async function addAddress(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  await prisma.address.create({
    data: {
      userId: user.id,
      fullName: formData.get("fullName") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
      phone: formData.get("phone") as string,
      country: "USA" // Default
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}

// 3. Add Payment Method (Mock)
export async function addPaymentMethod(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      brand: formData.get("brand") as string,
      last4: (formData.get("cardNumber") as string).slice(-4),
      expiry: formData.get("expiry") as string
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}

// 4. Submit Review
export async function submitReview(productId: string, rating: number, comment: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  await prisma.review.create({
    data: {
      userId: user.id,
      productId,
      rating,
      comment
    }
  })

  revalidatePath('/dashboard')
  revalidatePath(`/products/${productId}`)
  return { success: true }
}