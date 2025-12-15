// src/lib/shop-utils.ts

// --- CONFIGURATION ---
export const SITE_CONFIG = {
  currency: 'USD',
  taxRate: 0.08, // 8% Tax
  shippingFlatRate: 15.00,
  freeShippingThreshold: 200.00,
}

// --- FUNCTIONS ---

// 1. Format Money
export function formatPrice(amount: number | string) {
  const price = Number(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: SITE_CONFIG.currency,
  }).format(price)
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