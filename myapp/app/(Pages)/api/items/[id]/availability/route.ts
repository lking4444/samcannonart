import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { ItemAvailability } from "@/app/Types/ItemAvailability"

export async function GET( request: Request, { params }: { params: Promise<{ id: string }> } ) {
    const { id } = await params
    const itemId = Number(id)

    if (!Number.isInteger(itemId) || itemId <= 0) {
        return NextResponse.json<ItemAvailability>(
        {
            exists: false,
            available: false,
            stock: 0,
        },
        { status: 400 }
        )
    }

    const item = await prisma.item.findUnique({
        where: {
        id: itemId,
        },
        select: {
        id: true,
        stock: true,
        hidden: true,
        },
    })

    if (!item || item.hidden) {
        return NextResponse.json<ItemAvailability>(
        {
            exists: false,
            available: false,
            stock: 0,
        },
        { status: 404 }
        )
    }

    const reserved = await prisma.reservationItem.aggregate({
        where: {
        itemId,
        reservation: {
            expiresAt: {
            gt: new Date(),
            },
        },
        },
        _sum: {
        quantity: true,
        },
    })

    const reservedQuantity = reserved._sum.quantity ?? 0
    const availableStock = Math.max(item.stock - reservedQuantity, 0)

    return NextResponse.json<ItemAvailability>({
        exists: true,
        available: availableStock > 0,
        stock: availableStock,
})
}