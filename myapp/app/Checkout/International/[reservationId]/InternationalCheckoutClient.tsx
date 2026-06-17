"use client"

import { useCallback } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckout, EmbeddedCheckoutProvider, } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function InternationalCheckoutClient({ reservationId, }: { reservationId: string }) {

    console.log("reservationId: ", reservationId)

    const fetchClientSecret = useCallback(async () => {
        const res = await fetch("/api/stripe/internationalCheckout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reservationId }),
        })

        const data = await res.json()

        if (!res.ok || !data.clientSecret) {
            throw new Error(data.error ?? "Failed to create checkout session")
        }

        return data.clientSecret
    }, [reservationId])

    const onShippingDetailsChange = useCallback(async (event: any) => {
        const res = await fetch("/api/stripe/updateInternationalShipping", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                checkout_session_id: event.checkoutSessionId,
                shipping_details: event.shippingDetails,
            }),
        })

        const data = await res.json()

        if (!res.ok || data.type === "error") {
            return {
                type: "reject" as const,
                errorMessage:
                    data.message ?? "Could not calculate shipping.",
            }
        }

        return {
            type: "accept" as const,
        }
    }, [])

    return (
        <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
                fetchClientSecret,
                onShippingDetailsChange,
            }}
        >
            <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>
    )
}