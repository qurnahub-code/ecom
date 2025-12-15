import crypto from "crypto"

export function generateSecureHash(params: Record<string, any>, integritySalt: string) {
  // 1. Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort()
  
  // 2. Concatenate values with '&' (excluding the hash field itself if present)
  let stringToHash = integritySalt
  
  sortedKeys.forEach(key => {
    if (params[key] !== "" && params[key] !== undefined && params[key] !== null && key !== "pp_SecureHash") {
      stringToHash += `&${params[key]}`
    }
  })

  // 3. Generate HMAC-SHA256
  return crypto.createHmac('sha256', integritySalt)
    .update(stringToHash)
    .digest('hex')
    .toUpperCase()
}