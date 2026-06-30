import { NextRequest, NextResponse } from "next/server"

import { getAllDimensionsByType } from "@/lib/db/items"
import { isItemType } from "@/lib/cart/getItems"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const type = searchParams.get("type")

        if (!isItemType(type)) {
            return NextResponse.json(
                { error: "Missing or invalid type parameter" },
                { status: 400 }
            )
        }

       const rawDimensions = await getAllDimensionsByType(type)

        const uniqueDimensions = new Set<string>()

        for (const dimension of rawDimensions) {
            if (dimension) {
                uniqueDimensions.add(dimension)
            }
        }

        const dimensions = Array.from(uniqueDimensions).sort((a, b) =>
            a.localeCompare(b)
        )

        return NextResponse.json({ dimensions })
    } catch (error) {
        console.error("Failed to fetch tags:", error)

        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        )
    }
}