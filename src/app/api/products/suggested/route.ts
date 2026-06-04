import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = 30; // User requested 30 items per load

  try {
    const products = await prisma.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" }, // Or { views: 'desc' } if you have analytics
      include: { images: true }
    });

    const total = await prisma.product.count();
    const hasMore = (page * limit) < total;

    return NextResponse.json({ products, hasMore });
  } catch (error) {
    return NextResponse.json({ products: [], hasMore: false });
  }
}