import Stripe from "stripe"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { isValidReservationId } from "@/lib/cart/reservation"
import { computeDiscount } from "@/lib/discount/computeDiscount"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const reservationId = body.reservationId ?? body.resId

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
                { error: "Invalid reservation item" },
                { status: 400 }
            )
        }

        const validItemsWithQuantity = itemsWithQuantity as Array< NonNullable<(typeof itemsWithQuantity)[number]> >

        const subtotalInPence = validItemsWithQuantity.reduce((sum, item) => {
            const unitPence = Math.round(Number(item.price.toString()) * 100)
            return sum + unitPence * item.quantity
        }, 0)

        const discount = computeDiscount(validItemsWithQuantity)
        const discountInPence = Math.round(Number(discount) * 100)

        const initialAmountInPence = subtotalInPence - discountInPence

        if (!Number.isInteger(initialAmountInPence) || initialAmountInPence <= 0) {
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

        const checkoutLineItems = validItemsWithQuantity.map((item) => {
            const name = item.name?.trim() || "Artwork"
            const description = item.description?.trim()
            const image = item.image?.trim()
            const imageUrl = image?.startsWith("http") ? image : undefined

            return {
                quantity: item.quantity,
                price_data: {
                    currency: "gbp",
                    unit_amount: Math.round(Number(item.price.toString()) * 100),
                    product_data: {
                        name,
                        ...(description ? { description } : {}),
                        ...(imageUrl ? { images: [imageUrl] } : {}),
                    },
                },
            }
        })

        let couponId: string | undefined

        if (discountInPence > 0) {
            const coupon = await stripe.coupons.create({
                amount_off: discountInPence,
                currency: "gbp",
                duration: "once",
                name: "Order discount",
            })

            couponId = coupon.id
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            ui_mode: "embedded_page",

            permissions: {
                update_shipping_details: "server_only",
            },

            billing_address_collection: "required",

            shipping_address_collection: {
                allowed_countries: ["US"],
            },

            line_items: checkoutLineItems,

            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "gbp",
                        },
                        display_name: "Shipping calculated after address",
                    },
                },
            ],

            discounts: couponId
                ? [
                    {
                        coupon: couponId,
                    },
                ]
                : undefined,

            payment_intent_data: {
                description:
                    "Thank you so much for choosing Sam Cannon Art and we hope you enjoy your purchase",
            },

            phone_number_collection: {
                enabled: true,
            },

            metadata: {
                reservationId,
                subtotalInPence: String(subtotalInPence),
                discountInPence: String(discountInPence),
                checkoutType: "international",
            },

            return_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        })

        if (!session.client_secret) {
            return NextResponse.json(
                { error: "Failed to create checkout session" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            clientSecret: session.client_secret,
        })
    } catch (error) {
        console.error("International checkout session error:", error)

        return NextResponse.json(
            { error: "Failed to create international checkout session" },
            { status: 500 }
        )
    }
}