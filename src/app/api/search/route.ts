import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    
    // 1. Extract Query Parameters
    const q = url.searchParams.get("q") || "";
    const minPrice = url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined;
    const maxPrice = url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined;
    const category = url.searchParams.get("category") || undefined;
    const brand = url.searchParams.get("brand") || undefined;
    const sort = url.searchParams.get("sort") || "newest";
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 12;

    // 2. Build the "Where" Clause Dynamically
    const whereClause: Prisma.ProductWhereInput = {
      AND: [
        // Search Logic (Name OR Description OR Tags)
        q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { tags: { contains: q, mode: "insensitive" } },
          ],
        } : {},

        // Price Filter
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},

        // Category & Brand Filter
        category ? { category: { equals: category, mode: "insensitive" } } : {},
        brand ? { brand: { equals: brand, mode: "insensitive" } } : {},
      ],
    };

    // 3. Define Sorting Strategy
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }; // Default: Newest

    switch (sort) {
      case "price_asc": orderBy = { price: "asc" }; break;
      case "price_desc": orderBy = { price: "desc" }; break;
      case "name_asc": orderBy = { name: "asc" }; break;
      case "name_desc": orderBy = { name: "desc" }; break;
      // You could add 'stock_desc' or 'rating_desc' here later
    }

    // 4. Execute Query with Pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { take: 1 }, // Fetch only the main image for performance
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // 5. Return Response with Metadata
    return NextResponse.json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}