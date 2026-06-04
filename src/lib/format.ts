export function formatPrice(amount: number | string) {
  const price = Number(amount)
  return `Rs. ${price.toLocaleString('en-PK')}`
}