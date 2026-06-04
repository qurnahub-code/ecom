import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; // Connects to your singleton DB client
import * as bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 2. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Compare Passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // 5. Return Success
    const response = NextResponse.json({ 
        message: "Login successful", 
        role: user.role 
    });
    
    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true, 
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}