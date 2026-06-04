import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // You need bcrypt to hash the new password

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Find user with this token AND ensure token hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Expiry must be greater than NOW
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await hash(password, 12);

    // 3. Update User & Clear Token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,       // Clear the token so it can't be reused
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}