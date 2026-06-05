import { NextResponse } from "next/server"
import { searchProducts } from "@/app/actions"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    
    const query = url.searchParams.get("q") || undefined
    const minPrice = url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined
    const maxPrice = url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined
    const category = url.searchParams.get("category") || undefined
    const brand = url.searchParams.get("brand") || undefined
    const sort = url.searchParams.get("sort") || "newest"
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 12

    const searchResults = await searchProducts({
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit
    })

    return NextResponse.json(searchResults)
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}