import { CartItem } from "@/app/Store/cartStore"
import { Reservation } from "@prisma/client"

export async function goToCheckout(cartItems: CartItem[]) {
    const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
    })

    if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error ?? "Failed to reserve items")
    }

    const reservation: Reservation = await response.json()
    const reservationId = reservation.id as string

    const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId }),
    })

    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to create checkout session")
    }

    const { url } = await res.json()

    if (!url) {
        throw new Error("Missing checkout URL")
    }

    window.location.href = url
}

export async function goToCheckoutInternational(cartItems: CartItem[]) {
    const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
    })

    if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error ?? "Failed to reserve items")
    }

    const reservation: Reservation = await response.json()
    const reservationId = reservation.id as string

    window.location.href = `/Checkout/International/${reservationId}`
}
