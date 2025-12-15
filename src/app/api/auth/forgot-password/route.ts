import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    // 1. Check user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    // 2. Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex")
    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 3600000) 

    // 3. Save to DB
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    })

    // 4. Send Email (MOCK implementation)
    // In production, use Resend or Nodemailer here.
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    console.log("==============================================")
    console.log("🔐 PASSWORD RESET LINK GENERATED (DEV MODE):")
    console.log(resetUrl)
    console.log("==============================================")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}