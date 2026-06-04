import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { getWelcomeEmailHtml } from "@/lib/email-templates"; // ✅ Import your new template

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // --- VALIDATION ---
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "This email is already registered. Please log in." }, { status: 400 });
    }

    // --- CREATE USER ---
    const hashedPassword = await hash(password, 10);
    
    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "CUSTOMER", 
      },
    });

    // --- SEND EMAIL (Background Task) ---
    // We don't await this so the user gets a fast response. 
    // The email sends in the background.
    const emailHtml = getWelcomeEmailHtml(name); // ✅ Generate HTML using your new helper

    sendEmail({
      to: email,
      subject: "Welcome to Majestic Inc. – Your Journey Begins",
      html: emailHtml
    }).catch(err => console.error("Failed to send welcome email:", err));

    return NextResponse.json({ success: true, message: "User created successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}