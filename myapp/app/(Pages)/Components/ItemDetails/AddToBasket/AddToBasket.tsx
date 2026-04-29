"use client"

import { useCartActions } from "@/app/Hooks/useCartActions"
import styles from "./AddToBasket.module.css"

type AddToBasketProps = {
  itemId: number
}

export default function AddToBasket({ itemId }: AddToBasketProps) {
  const { addToCart, isLoading } = useCartActions()

  async function handleAddToBasket() {
    const result = await addToCart(itemId, 1)

    if (!result.ok) {
      alert(result.message)
    }
  }

  return (
    <button
      className={styles.addToBasket}
      onClick={handleAddToBasket}
      disabled={isLoading}
    >
      {isLoading ? "Adding..." : "Add To Basket"}
    </button>
  )
}