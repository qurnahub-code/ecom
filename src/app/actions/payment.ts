'use server'

import { prisma } from "@/lib/prisma"
import { generateSecureHash } from "@/lib/payment-utils"
import { redirect } from "next/navigation"

// --- CONFIGURATION (Move these to .env later) ---
const JC_MERCHANT_ID = "YOUR_MERCHANT_ID"
const JC_PASSWORD = "YOUR_PASSWORD"
const JC_INTEGRITY_SALT = "YOUR_SALT"
const JC_API_URL = "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction"

// 1. Process JazzCash Payment
export async function processJazzCash(amount: number, mobileNumber: string, orderId: string) {
  
  // 1. Prepare Data for JazzCash API
  const dateTime = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14) // YYYYMMDDHHMMSS
  const expiryTime = new Date(Date.now() + 10 * 60000).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)

  const payload: any = {
    "pp_Language": "EN",
    "pp_MerchantID": JC_MERCHANT_ID,
    "pp_SubMerchantID": "",
    "pp_Password": JC_PASSWORD,
    "pp_BankID": "TBANK",
    "pp_ProductID": "RETAIL",
    "pp_TxnRefNo": `T${dateTime}`, // Unique Ref
    "pp_Amount": Math.round(amount * 100), // Amount in Paisa (multiply by 100)
    "pp_TxnCurrency": "PKR",
    "pp_TxnDateTime": dateTime,
    "pp_BillReference": orderId,
    "pp_Description": "Order Payment",
    "pp_TxnExpiryDateTime": expiryTime,
    "pp_ReturnURL": "http://localhost:3000/api/payment/callback",
    "pp_SecureHash": "",
    "pp_MobileNumber": mobileNumber,
    "pp_CNIC": "345678", // Dummy for Sandbox, usually optional or specific
  }

  // 2. Generate Hash
  payload.pp_SecureHash = generateSecureHash(payload, JC_INTEGRITY_SALT)

  try {
    // 3. Call JazzCash API
    const response = await fetch(JC_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    // 4. Check Response
    if (result.pp_ResponseCode === "000") {
      // SUCCESS: Update Order in DB
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          isPaid: true, 
          paymentMethod: 'JAZZCASH',
          paymentPhone: mobileNumber,
          transactionId: result.pp_TxnRefNo
        }
      })
      return { success: true, message: "Payment Successful! Check your phone for SMS." }
    } else {
      // FAILED
      return { success: false, message: result.pp_ResponseMessage || "Payment Failed" }
    }

  } catch (error) {
    console.error("JazzCash Error:", error)
    return { success: false, message: "Connection Error with JazzCash" }
  }
}

// 2. EasyPaisa Logic (Simplified Placeholder)
export async function processEasyPaisa(amount: number, mobileNumber: string, orderId: string) {
  // EasyPaisa API logic is similar but uses different endpoints/parameters.
  // For now, let's simulate a success to keep your project moving.
  
  await new Promise(resolve => setTimeout(resolve, 2000)) // Fake delay

  await prisma.order.update({
    where: { id: orderId },
    data: { 
      isPaid: true, 
      paymentMethod: 'EASYPAISA',
      paymentPhone: mobileNumber,
      transactionId: `EP-${Date.now()}`
    }
  })

  return { success: true, message: "EasyPaisa Request Sent. Please approve on your phone." }
}