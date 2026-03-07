import { CartItem } from '@/app/Store/cartStore'
import styles from './BuyNow.module.css'
import { Reservation } from '@/app/generated/prisma/client'
import { clientItem } from '../ItemDetails'

async function goToCheckout(cartItems : CartItem[]) {

    const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
    })
    
    if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error ?? "Failed to reserve items")
    }

    const reservation : Reservation = await response.json()
    const reservationId = reservation.id as string

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({reservationId}),
    })

    const { url } = await res.json()
    window.location.href = url
  }

type BuyNowProps = {
    item: clientItem
}

export default function BuyNow({ item }: BuyNowProps) {
    return (
      <button
        className={styles.buyNow}
        onClick={() => goToCheckout([{ itemId: item.id, quantity: 1 }])}
      >
        Buy Now
      </button>
    );
  }