import { NextResponse } from "next/server"

import { createReservationWithStockCheck, } from "@/lib/db/item_reservations"
import { parseReservationInput } from "@/lib/cart/reservation"

import { StockReservationError } from "@/app/Types/stock"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const input = parseReservationInput(body)

        if (!input) {
            return NextResponse.json(
                { error: "Invalid reservation items" },
                { status: 400 }
            )
        }

        const reservation = await createReservationWithStockCheck(input)

        return NextResponse.json(reservation)
    } catch (error) {
        console.error("Reservation error:", error)

        if (error instanceof StockReservationError) {
            return NextResponse.json(
                {
                    error: "Some items are no longer available.",
                    code: "OUT_OF_STOCK",
                    items: error.items,
                },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: "Reservation failed" },
            { status: 409 }
        )
    }
}