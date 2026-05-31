import Stripe from "stripe"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { isValidReservationId } from "@/lib/cart/reservation"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const reservationId = body?.reservationId

        if (!isValidReservationId(reservationId)) {
            return NextResponse.json(
                { error: "Missing or invalid reservation ID" },
                { status: 400 }
            )
        }

        const reservation = await prisma.reservation.findUnique({
            where: {
                id: reservationId,
            },
            include: {
                items: {
                select: {
                    itemId: true,
                    quantity: true,
                },
                },
            },
        })

        if (!reservation) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 }
            )
        }

        if (reservation.expiresAt <= new Date()) {
            return NextResponse.json(
                { error: "Reservation has expired" },
                { status: 409 }
            )
        }

        if (reservation.items.length === 0) {
            return NextResponse.json(
                { error: "Reservation has no items" },
                { status: 400 }
            )
        }

        const itemIds = reservation.items.map((item) => item.itemId)

        const dbItems = await prisma.item.findMany({
            where: {
                id: {
                in: itemIds,
                },
                hidden: false,
            },
            select: {
                id: true,
                price: true,
            },
        })

        const priceMap = new Map(dbItems.map((item) => [item.id, item.price]))

        let amountInPence = 0

        for (const line of reservation.items) {
            const price = priceMap.get(line.itemId)

            if (price === undefined || line.quantity <= 0) {
                return NextResponse.json(
                    { error: "Invalid reservation item" },
                    { status: 400 }
                )
            }

            const unitPence = Math.round(Number(price.toString()) * 100)
            amountInPence += unitPence * line.quantity
        }

        if (!Number.isInteger(amountInPence) || amountInPence <= 0) {
            return NextResponse.json(
                { error: "Invalid checkout amount" },
                { status: 400 }
            )
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL

        if (!appUrl) {
            console.error("Missing NEXT_PUBLIC_APP_URL")

            return NextResponse.json(
                { error: "Checkout is not configured" },
                { status: 500 }
            )
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            billing_address_collection: "required",
            payment_intent_data: {
                description:
                "Thank you so much for choosing Sam Cannon Art and we hope you enjoy your purchase",
            },
            phone_number_collection: {
                enabled: true,
            },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "gbp",
                        unit_amount: amountInPence,
                        product_data: {
                            name: "Order Total",
                        },
                    },
                },
            ],
            metadata: {
                reservationId,
            },
                success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${appUrl}/checkout/cancel`,
        })

        if (!session.url) {
            return NextResponse.json(
                { error: "Failed to create checkout session" },
                { status: 500 }
            )
        }

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error("Checkout session error:", error)

        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        )
    }
}