'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// 1. Get Dashboard Data
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

  // Calculate "Pending Reviews"
  const boughtProductIds = new Set<string>()
  user.orders.forEach(order => {
    order.items.forEach(item => boughtProductIds.add(item.productId))
  })

  const reviewedProductIds = new Set(user.reviews.map(r => r.productId))
  const pendingReviewIds = [...boughtProductIds].filter(id => !reviewedProductIds.has(id))
  
  const pendingReviews = await prisma.product.findMany({
    where: { id: { in: pendingReviewIds } },
    select: { 
      id: true, 
      name: true, 
      images: { take: 1, select: { url: true } } 
    }
  })

  const formattedPendingReviews = pendingReviews.map(p => ({
    id: p.id,
    name: p.name,
    imageUrl: p.images[0]?.url || '/placeholder.jpg'
  }))

  return { ...user, pendingReviews: formattedPendingReviews }
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
      country: "Pakistan"
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}

// 3. Add Payment Method
export async function addPaymentMethod(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  const cardNumber = formData.get("cardNumber") as string
  
  await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      type: (formData.get("brand") as string) || "Credit Card", 
      last4: cardNumber.slice(-4),
      expiry: formData.get("expiry") as string
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}

// 4. Submit OR Edit Review (UPSERT LOGIC)
export async function submitReview(
  productId: string, 
  rating: number, 
  comment: string,
  images: string[] = []
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false }

  // Check if review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: user.id,
      productId: productId
    }
  })

  if (existingReview) {
    // UPDATE existing review
    await prisma.review.update({
      where: { id: existingReview.id },
      data: { rating, comment, images }
    })
  } else {
    // CREATE new review
    await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating,
        comment,
        images
      }
    })
  }

  // Refresh pages to show updated data
  revalidatePath('/dashboard')
  revalidatePath(`/products/${productId}`)
  revalidatePath(`/products/${productId}/reviews`)

  return { success: true }
}