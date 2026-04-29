"use client"
import { useState } from "react"
import { ClientItem } from "../types"

import { goToCheckout } from "@/lib/checkout"
import { checkItemAvailability } from "@/lib/cart/checkItemAvailability"

import styles from "./BuyNow.module.css"

type BuyNowProps = {
  item: ClientItem
}

export default function BuyNow({ item }: BuyNowProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleBuyNow() {
    try {
      setIsLoading(true)

      const availability = await checkItemAvailability(item.id)

      if (!availability.exists) {
        alert("This item is no longer available.")
        return
      }

      if (!availability.available || availability.stock < 1) {
        alert("This item is out of stock.")
        return
      }

      await goToCheckout([{ itemId: item.id, quantity: 1 }])
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      className={styles.buyNow}
      onClick={handleBuyNow}
      disabled={isLoading}
    >
      {isLoading ? "Checking..." : "Buy Now"}
    </button>
  )
}