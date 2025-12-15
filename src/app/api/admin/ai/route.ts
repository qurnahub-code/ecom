import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // 1. Fetch REAL Inventory Data from Prisma
    // We select only relevant fields to keep the payload small for the AI
    const products = await prisma.product.findMany({
      select: {
        name: true,
        stock: true,
        price: true,
        vendor: true,
        expiryDate: true,
        category: true,
      }
    })

    // 2. Prepare the System Prompt with the Data
    // We feed the database state directly to the AI as context
    const systemPrompt = `
      You are an expert Inventory Analyst AI for a warehouse. 
      You have access to the current inventory data below in JSON format.
      
      CURRENT INVENTORY DATA:
      ${JSON.stringify(products)}

      Your job is to answer the user's question based ONLY on this data.
      - If asking about low stock, look for items with stock < 10.
      - If asking about value, multiply price * stock.
      - If asking about vendors, aggregate data by vendor.
      - Keep answers concise, professional, and actionable.
      - Format numbers as currency ($) where appropriate.
    `

    // 3. Call OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-4o-mini", // Cost-effective and fast
    })

    const answer = completion.choices[0].message.content

    return NextResponse.json({ answer })

  } catch (error) {
    console.error("AI Error:", error)
    return NextResponse.json(
      { answer: "I encountered an error analyzing your inventory. Please check your API key." },
      { status: 500 }
    )
  }
}