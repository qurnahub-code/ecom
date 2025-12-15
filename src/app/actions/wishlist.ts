// src/app/actions/wishlist.ts
'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

export async function toggleWishlist(productId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return { success: false, message: "Please login first" }
  }

  // Get User ID from DB using email (safest way)
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false, message: "User not found" }

  // Check if already in wishlist
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId
      }
    }
  })

  if (existing) {
    // Remove it
    await prisma.wishlistItem.delete({ where: { id: existing.id } })
    revalidatePath('/')
    return { success: true, action: 'removed' }
  } else {
    // Add it
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId
      }
    })
    revalidatePath('/')
    return { success: true, action: 'added' }
  }
}