import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { cardName, cardNumber, expiry } = await req.json()

    // 1. Find User
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) throw new Error("User not found")

    // 2. Save Card (In a real app, NEVER save raw numbers. Save the Stripe Token)
    // We will save the last 4 digits for display purposes.
    const last4 = cardNumber.slice(-4)
    
    await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        type: "VISA", // Detect type based on number in real app
        last4: last4,
        expiry: expiry
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save card" }, { status: 500 })
  }
}