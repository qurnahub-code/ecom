// src/lib/shop-utils.ts

// --- CONFIGURATION ---
export const SITE_CONFIG = {
  currency: 'PKR',
  taxRate: 0.0, // Tax is inclusive in product prices
  shippingFlatRate: 250,
  freeShippingThreshold: 5000,
}

// --- FUNCTIONS ---

// 1. Format Money
export function formatPrice(amount: number | string) {
  const price = Number(amount)
  return `Rs. ${price.toLocaleString('en-PK')}`
}

// 2. Format Date
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// 3. Calculate Cart Totals (Includes Tax & Shipping)
export function calculateCartTotals(subtotal: number, discountPercent: number = 0) {
  const discountAmount = subtotal * (discountPercent / 100)
  const discountedSubtotal = subtotal - discountAmount
  
  // Logic: Free shipping if over threshold
  const shipping = discountedSubtotal > SITE_CONFIG.freeShippingThreshold 
    ? 0 
    : SITE_CONFIG.shippingFlatRate
    
  const tax = discountedSubtotal * SITE_CONFIG.taxRate
  const total = discountedSubtotal + shipping + tax

  return {
    subtotal,
    discountAmount,
    shipping,
    tax,
    total
  }
}

// 4. Generate Star Array (For Reviews)
export function renderStars(rating: number) {
  // Returns an array like [true, true, true, false, false] for 3 stars
  return Array.from({ length: 5 }, (_, i) => i < rating)
}