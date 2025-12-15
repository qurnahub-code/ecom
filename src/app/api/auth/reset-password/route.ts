import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // 1. Find user with valid token and expiry
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() } // Expiry must be in the future
      }
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Update User (Clear token fields)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}