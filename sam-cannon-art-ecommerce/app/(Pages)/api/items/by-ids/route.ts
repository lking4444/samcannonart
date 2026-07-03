import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { isPositiveInteger } from "@/lib/cart/getItems"

const MAX_IDS = 100

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body || typeof body !== "object" || !("ids" in body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { ids: rawIds } = body as { ids: unknown }

    if (!Array.isArray(rawIds)) {
      return NextResponse.json(
        { error: "Invalid item IDs" },
        { status: 400 }
      )
    }

    const ids: number[] = [...new Set(rawIds.filter(isPositiveInteger))]

    if (ids.length === 0) {
      return NextResponse.json([])
    }

    if (ids.length > MAX_IDS) {
      return NextResponse.json(
        { error: `Too many item IDs. Maximum is ${MAX_IDS}.` },
        { status: 400 }
      )
    }

    const items = await prisma.item.findMany({
      where: {
        id: {
          in: ids,
        },
        hidden: false,
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        type: true,
        dimensions: true,
        gift: true,
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Basket item lookup failed:", error)

    return NextResponse.json(
      { error: "Failed to fetch basket items" },
      { status: 500 }
    )
  }
}