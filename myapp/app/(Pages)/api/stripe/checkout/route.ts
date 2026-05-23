import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {

    const { reservationId } = (await req.json()) as { reservationId: string }

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { items: { select: { itemId: true, quantity: true } } },
    })
  
    if (!reservation) {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }
  
    const itemIds = reservation.items.map((i) => i.itemId)
  
    const dbItems = await prisma.item.findMany({
        where: { id: { in: itemIds } },
        select: { id: true, price: true },
    })
  
    const priceMap = new Map(dbItems.map((i) => [i.id, i.price]))
  
    let amountInPence = 0

    for (const line of reservation.items) {
        const price = priceMap.get(line.itemId)

        if (!price) {
            return NextResponse.json({ error: "Item missing from DB" }, { status: 400 })
        }

        const unitPence = Math.round(Number(price.toString()) * 100)
        amountInPence += unitPence * line.quantity
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        billing_address_collection: "required", 
        payment_intent_data: {
            description: `Thank you so much for choosing Sam Cannon  Art and we hope you enjoy your puchase`
        },
        phone_number_collection: { enabled: true },
        line_items:[
            {
                quantity: 1,
                price_data: {
                    currency: "gbp",
                    unit_amount: amountInPence,
                    product_data: {name: "Order Total"}
                }
            }
        ],
        metadata: { reservationId },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
}