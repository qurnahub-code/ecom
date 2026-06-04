'use server'

import { PaymentType } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sendEmail } from "@/lib/mail"
import { getOrderConfirmationEmailHtml } from "@/lib/email-templates"

export async function placeOrder(cartItems: any[], total: number, formData: FormData) {
  // 1. Check Authentication
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email

  if (!userEmail) {
    // Ideally handle this on frontend, but double check here
    throw new Error("You must be logged in to place an order.")
  }

  // 2. Extract Data from Form
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const postalCode = formData.get("postalCode") as string
  const phone = formData.get("phone") as string
  const paymentMethod = formData.get("paymentMethod") as string

  // 3. Create Order in Database
  const order = await prisma.order.create({
    data: {
      user: { connect: { email: userEmail } },
      guestName: session?.user?.name || "Customer",
      guestEmail: userEmail,
      totalAmount: total,
      status: "PENDING",
      paymentMethod: (paymentMethod as PaymentType) || PaymentType.COD,
      address,
      city,
      postalCode,
      phone,
      items: {
        create: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    // Include user data so we can use the name in the email
    include: {
      items: {
        include: { product: true }
      },
      user: true 
    }
  })

  // 4. Send Confirmation Email (Background Task)
  // We use the new template function here
  const emailHtml = getOrderConfirmationEmailHtml({
      ...order,
      fullName: order.user?.name || "Valued Customer" // Pass the name for the email
  })
  
  sendEmail({
    to: userEmail,
    subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
    html: emailHtml
  }).catch(err => console.error("Failed to send order email:", err))

  // 5. Redirect to the "Viewer" Page (Success Page)
  redirect(`/checkout/success/${order.id}`)
}