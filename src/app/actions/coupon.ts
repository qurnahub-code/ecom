"use server"

import { prisma } from "@/lib/prisma"

export async function validateCoupon(code: string, cartTotal: number) {
  if (!code) return { valid: false, message: "Please enter a code." }

  // 1. Find Coupon (Case Insensitive)
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() } 
  })

  // 2. Validation Checks
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." }
  }

  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is no longer active." }
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { valid: false, message: "This coupon has expired." }
  }

  if (cartTotal < coupon.minAmount) {
    return { valid: false, message: `Add $${(coupon.minAmount - cartTotal).toFixed(2)} more to use this coupon.` }
  }

  // 3. Calculate Discount Amount
  let discountAmount = 0
  
  if (coupon.type === "PERCENT") {
    // Example: 10% of 500 = 50
    discountAmount = (cartTotal * coupon.discount) / 100
    // Optional: Cap max discount if needed
  } else {
    // FIXED amount (e.g. $20 off)
    discountAmount = coupon.discount
  }

  // Ensure discount doesn't exceed total (No negative payments)
  discountAmount = Math.min(discountAmount, cartTotal)

  return { 
    valid: true, 
    discount: discountAmount,
    code: coupon.code, // Return normalized code
    type: coupon.type,
    message: "Coupon applied successfully!" 
  }
}