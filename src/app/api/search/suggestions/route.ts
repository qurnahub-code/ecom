import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    // Search for products matching the query
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5, // Limit to 5 suggestions
      select: {
        id: true,
        name: true,
        category: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}