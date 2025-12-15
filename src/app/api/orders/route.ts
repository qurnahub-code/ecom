// src/app/api/orders/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, shippingDetails, paymentMethod, total } = body

    // 1. Create the Order in the Database
    const order = await prisma.order.create({
      data: {
        guestName: shippingDetails.fullName,
        address: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        phone: shippingDetails.phone,
        totalAmount: total,
        paymentMethod: paymentMethod,
        
        // 2. Create the "Order Items" automatically
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price // Store price at time of purchase
          }))
        }
      }
    })

    return NextResponse.json({ success: true, orderId: order.id })
    
  } catch (error) {
    console.error("Order Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}