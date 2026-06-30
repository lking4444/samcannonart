import Stripe from "stripe"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { computeInternationalShipping } from "@/lib/shipping/calculateInternationShipping"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const checkoutSessionId = body?.checkout_session_id
        const shippingDetails = body?.shipping_details

        if (!checkoutSessionId || !shippingDetails?.address) {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Missing shipping details.",
                },
                { status: 400 }
            )
        }

        const address = shippingDetails.address
        const country = address.country

        if (country !== "US") {
            return NextResponse.json(
                {
                    type: "error",
                    message:
                        "Please use the standard UK checkout for UK orders. International checkout currently supports US shipping only.",
                },
                { status: 400 }
            )
        }

        const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)

        const reservationId = session.metadata?.reservationId

        if (!reservationId) {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Missing reservation for checkout session.",
                },
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
                {
                    type: "error",
                    message: "Reservation not found.",
                },
                { status: 404 }
            )
        }

        if (reservation.expiresAt <= new Date()) {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Reservation has expired.",
                },
                { status: 409 }
            )
        }

        if (reservation.items.length === 0) {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Reservation has no items.",
                },
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
                type: true,
                gift: true,
                name: true,
                description: true,
                dimensions: true,
                uploadId: true,
                hidden: true,
                image: true,
                stock: true,
                tags: true,
            },
        })

        const itemMap = new Map(dbItems.map((item) => [item.id, item]))

        const itemsWithQuantity = reservation.items.map((line) => {
            const item = itemMap.get(line.itemId)

            if (!item || line.quantity <= 0) {
                return null
            }

            return {
                ...item,
                quantity: line.quantity,
            }
        })

        if (itemsWithQuantity.some((item) => item === null)) {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Invalid reservation item.",
                },
                { status: 400 }
            )
        }

        const validItemsWithQuantity = itemsWithQuantity as Array<
            NonNullable<(typeof itemsWithQuantity)[number]>
        >

        const shippingCostInPounds = computeInternationalShipping(validItemsWithQuantity)
        const shippingInPence = Math.round(shippingCostInPounds * 100)

        if (!Number.isInteger(shippingInPence) || shippingInPence <= 0) {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Could not calculate shipping for this order.",
                },
                { status: 400 }
            )
        }

        await stripe.checkout.sessions.update(checkoutSessionId, {
            collected_information: {
                shipping_details: shippingDetails,
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: shippingInPence,
                            currency: "gbp",
                        },
                        display_name: "US shipping",
                    },
                },
            ],
            metadata: {
                ...session.metadata,
                shippingCountry: country,
                shippingState: address.state ?? "",
                shippingPostalCode: address.postal_code ?? "",
                shippingInPence: String(shippingInPence),
                checkoutType: "international",
            },
        })

        return NextResponse.json({
            type: "object",
            value: {
                succeeded: true,
                shippingInPence,
            },
        })
    } catch (error) {
        console.error("Update international shipping error:", error)

        return NextResponse.json(
            {
                type: "error",
                message: "Could not calculate shipping. Please try again.",
            },
            { status: 500 }
        )
    }
}