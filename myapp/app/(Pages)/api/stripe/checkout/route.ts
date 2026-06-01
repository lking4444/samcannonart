import Stripe from "stripe"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { isValidReservationId } from "@/lib/cart/reservation"
import { computeShipping } from "@/lib/shipping/calculateShipping"
import { computeDiscount } from "@/lib/discount/computeDiscount"

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

        const validItemsWithQuantity = itemsWithQuantity as Array<
            NonNullable<(typeof itemsWithQuantity)[number]>
        >

        const subtotalInPence = validItemsWithQuantity.reduce((sum, item) => {
            const unitPence = Math.round(Number(item.price.toString()) * 100)
            return sum + unitPence * item.quantity
        }, 0)

        const shippingCost = computeShipping(validItemsWithQuantity)
        const discount = computeDiscount(validItemsWithQuantity)

        const shippingInPence = Math.round(Number(shippingCost) * 100)
        const discountInPence = Math.round(Number(discount) * 100)

        const amountInPence =
            subtotalInPence + shippingInPence - discountInPence

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

        const checkoutLineItems = validItemsWithQuantity.map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: "gbp",
                unit_amount: Math.round(Number(item.price.toString()) * 100),
                product_data: {
                name: item.name,
                description: item.description ?? undefined,
                images: item.image ? [item.image] : undefined,
                },
            },
        }))

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

            billing_address_collection: "required",

            // Add this if you want Stripe to collect delivery address too
            shipping_address_collection: {
                allowed_countries: ["GB"],
            },

            line_items: checkoutLineItems,

            shipping_options:
                shippingInPence > 0
                ? [
                    {
                        shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: shippingInPence,
                            currency: "gbp",
                        },
                        display_name: "Delivery",
                        },
                    },
                    ]
                : [
                    {
                        shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "gbp",
                        },
                        display_name: "Free delivery",
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
                shippingInPence: String(shippingInPence),
                discountInPence: String(discountInPence),
                totalInPence: String(amountInPence),
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