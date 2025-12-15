import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs"; // MUST match the seed library
import jwt from "jsonwebtoken"; // Assuming you use JWT for sessions

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. VITAL STEP: Compare the Input Password with the Hashed DB Password
    // Do NOT use: if (password === user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. check for Admin role (Optional based on where they are logging in)
    if (user.role !== "ADMIN") {
       return NextResponse.json({ error: "Access denied: Admins only" }, { status: 403 });
    }

    // 4. Generate Token (JWT)
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // 5. Return success
    const response = NextResponse.json({ message: "Login successful", role: user.role });
    
    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true, 
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}