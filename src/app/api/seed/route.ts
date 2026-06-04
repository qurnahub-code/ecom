import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Create the two mock products your checkout page uses
    await prisma.product.upsert({
      where: { id: "prod_1" }, // Using the exact ID from your checkout page
      update: {},
      create: {
        id: "prod_1",
        name: "Wireless Headphones",
        description: "High quality wireless headphones",
        price: 10,
        stock: 100,
        category: "Electronics",
        images: {
          create: { url: "https://placehold.co/400" }
        }
      }
    });

    await prisma.product.upsert({
      where: { id: "prod_2" },
      update: {},
      create: {
        id: "prod_2",
        name: "Mechanical Keyboard",
        description: "Clicky mechanical keyboard",
        price: 200,
        stock: 50,
        category: "Electronics",
        images: {
          create: { url: "https://placehold.co/400" }
        }
      }
    });

    return NextResponse.json({ message: "✅ Mock products created! You can now checkout." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed", details: error }, { status: 500 });
  }
}