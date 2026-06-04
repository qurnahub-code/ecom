import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail"; 

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Security: Don't reveal if user exists
      return NextResponse.json({ message: "If email exists, link sent." });
    }

    // 2. Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // 3. Save to DB
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    // 4. Generate Link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // 5. Send Real Email (Professional Template)
    await sendEmail({ 
      to: email, 
      subject: "Reset Your Password - Majestic Admin", 
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">We received a request to reset your password for your Majestic Admin account. Click the button below to proceed:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
          </div>

          <p style="color: #999; font-size: 14px; text-align: center;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 14px; text-align: center;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Majestic Inc.</p>
        </div>
      ` 
    });
    
    return NextResponse.json({ message: "Reset link sent" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}