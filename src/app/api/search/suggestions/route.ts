import { NextResponse } from "next/server"
import { getSearchSuggestions } from "@/app/actions"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""

    const suggestions = await getSearchSuggestions(query)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Suggestions API Error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}