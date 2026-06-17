import Stripe from "stripe"
import { NextResponse } from "next/server"

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

        let shippingInPence: number
        let displayName: string

        if (country === "US") {
            shippingInPence = 2000
            displayName = "US shipping"
        } else {
            return NextResponse.json(
                {
                    type: "error",
                    message: "Please use the standard UK checkout for UK orders. International checkout currently supports US shipping only.",
                },
                { status: 400 }
            )
        }

        await stripe.checkout.sessions.retrieve(checkoutSessionId)

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
                        display_name: displayName,
                    },
                },
            ],
            metadata: {
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