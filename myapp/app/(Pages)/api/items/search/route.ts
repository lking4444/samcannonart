import { NextResponse } from "next/server"

import { searchItems } from "@/lib/db/items"
import { parsePositiveInteger } from "@/lib/cart/getItems"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50
const MAX_QUERY_LENGTH = 100

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE)

        const requestedPageSize = parsePositiveInteger(
            searchParams.get("pageSize"),
            DEFAULT_PAGE_SIZE
        )

        const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE)

        const query = (searchParams.get("q") ?? "").trim()

        if (query.length === 0) {
            return NextResponse.json({
                items: [],
                total: 0,
                page,
                pageSize,
                hasMore: false,
            })
        }

        if (query.length > MAX_QUERY_LENGTH) {
            return NextResponse.json(
                { error: `Search query must be ${MAX_QUERY_LENGTH} characters or fewer` },
                { status: 400 }
            )
        }

        const result = await searchItems({
            query,
            page,
            pageSize,
        })

        return NextResponse.json(result)
    } catch (error) {
            console.error("Item search failed:", error)

            return NextResponse.json(
                { error: "Failed to search items" },
                { status: 500 }
            )
    }
}