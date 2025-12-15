import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // [UPDATED] Uses your global Prisma client
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

    // 4. Role Check (Admin Logic)
    // If you want to force ONLY admins to use this specific login route:
    if (user.role !== "ADMIN") {
       // return NextResponse.json({ error: "Access denied: Admins only" }, { status: 403 });
    }

    // 5. Generate Token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // 6. Return Success & Set Cookie
    const response = NextResponse.json({ 
        message: "Login successful", 
        role: user.role 
    });
    
    // Set the token in an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true, 
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}