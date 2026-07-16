import { NextResponse } from "next/server"

import { getRecommendedItems } from "@/lib/db/items"

const ITEM_LIMIT = 10

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")

    const id = Number(idParam)

    if (!idParam || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid id" },
        { status: 400 }
      )
    }

    const items = await getRecommendedItems(id, ITEM_LIMIT)

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Failed to fetch recommended items:", error)

    return NextResponse.json(
      { error: "Failed to fetch recommended items" },
      { status: 500 }
    )
  }
}