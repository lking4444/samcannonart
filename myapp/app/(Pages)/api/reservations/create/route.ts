import { NextResponse } from "next/server"

import { createReservationWithStockCheck } from "@/lib/db/item_reservations"
import { parseReservationInput } from "@/lib/cart/reservation"

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

        return NextResponse.json(
            { error: "Reservation failed" },
            { status: 409 }
        )
    }
}