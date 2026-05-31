import { NextResponse } from "next/server"

import { getRandomPopularItems } from "@/lib/db/items"

const DEFAULT_LIMIT = 5
const MAX_LIMIT = 20

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limitParam = searchParams.get("limit")

        const limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT

        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
            return NextResponse.json(
                { error: `Invalid limit parameter. Must be between 1 and ${MAX_LIMIT}.` },
                { status: 400 }
            )
        }

        const items = await getRandomPopularItems(limit)

        return NextResponse.json(items)
    } catch (error) {
        console.error("Failed to fetch random popular items:", error)

        return NextResponse.json(
            { error: "Failed to fetch random popular items" },
            { status: 500 }
        )
  }
}