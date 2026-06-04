'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { compare, hash } from "bcryptjs"
import { authenticator } from "otplib"

// 1. Verify Current Password
export async function verifyCurrentPassword(password: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: "Not authorized" }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.password) return { success: false, error: "User not found" }

  const isValid = await compare(password, user.password)
  return { success: isValid }
}

// 2. Send Reset Code (Mocked for Demo)
export async function sendVerificationCode(email: string) {
  // In a real app: Generate 6-digit code, save to DB/Redis, send via Resend/SendGrid
  console.log(`[EMAIL SENT] To: ${email}, Code: 123456`) 
  return { success: true, message: "Code sent to your email" }
}

// 3. Update Password
export async function updatePassword(newPassword: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const hashedPassword = await hash(newPassword, 10)
  
  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword }
  })

  return { success: true }
}

// 4. Generate 2FA Secret
export async function generate2FASecret() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const secret = authenticator.generateSecret()
  const user = session.user.email
  const otpauth = authenticator.keyuri(user, 'Majestic Inc', secret)

  // Save secret temporarily (or permanently but disabled)
  await prisma.user.update({
    where: { email: session.user.email },
    data: { twoFactorSecret: secret }
  })

  return { success: true, secret, otpauth }
}

// 5. Verify & Enable 2FA
export async function enable2FA(token: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.twoFactorSecret) return { success: false, error: "Setup 2FA first" }

  const isValid = authenticator.check(token, user.twoFactorSecret)

  if (isValid) {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { twoFactorEnabled: true }
    })
    return { success: true }
  }

  return { success: false, error: "Invalid Token" }
}