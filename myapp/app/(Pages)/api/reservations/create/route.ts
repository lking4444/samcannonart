import { NextResponse } from "next/server"
import { createReservationWithStockCheck } from "@/lib/db/item_reservations"

type CreateReservationInput = {
  items: {
    itemId: number
    quantity: number
  }[]
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CreateReservationInput

        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { error: "No items provided" },
                { status: 400 }
            )
        }

        const reservation = await createReservationWithStockCheck(body)

        return NextResponse.json(reservation)

    } catch (err) {
        console.error("Reservation error:", err)

        return NextResponse.json(
            { error: (err as Error).message ?? "Reservation failed" },
            { status: 409 } // conflict = stock issue
        )
    }
}