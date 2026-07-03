import { NextResponse } from "next/server"

import { getItemsByPageFiltered } from "@/lib/db/items"
import { isItemType, isSortOrder, parsePositiveInteger } from "@/lib/cart/getItems"

const MAX_PAGE_SIZE = 50

export async function GET(req: Request) {
  try {
        const { searchParams } = new URL(req.url)

        const typeParam = searchParams.get("type")

        if (!isItemType(typeParam)) {
            return NextResponse.json(
                { error: "Invalid or missing type" },
                { status: 400 }
            )
        }

        const page = parsePositiveInteger(searchParams.get("page"), 1)

        const requestedPageSize = parsePositiveInteger( searchParams.get("pageSize"), 20 )

        const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE)

        const keyword = searchParams.get("keyword")?.trim() ?? ""
        const dimension = searchParams.get("dimension")?.trim() || "Default"
        const tag = searchParams.get("tag")?.trim() || "Default"

        const sortOrderParam = searchParams.get("sortOrder")
        const sortOrder = isSortOrder(sortOrderParam) ? sortOrderParam : "Default"

        const data = await getItemsByPageFiltered({
            type: typeParam,
            page,
            pageSize,
            keyword,
            dimension,
            tag,
            sortOrder,
        })

        return NextResponse.json(data)
  } catch (error) {
        console.error("Filtered item lookup failed:", error)

        return NextResponse.json(
            { error: "Failed to fetch items" },
            { status: 500 }
        )
  }
}