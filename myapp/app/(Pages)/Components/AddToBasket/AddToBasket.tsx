"use client"

import { useCartActions } from "@/app/Hooks/useCartActions"
import styles from "./AddToBasket.module.css"

type AddToBasketProps = {
  itemId: number;
  secondary?: boolean;
}

export default function AddToBasket({ itemId, secondary }: AddToBasketProps) {
  const { addToCart, isLoading } = useCartActions()

  async function handleAddToBasket() {
    const result = await addToCart(itemId, 1)

    if (!result.ok) {
      alert(result.message)
    }
  }

  return (
    <button
      className={secondary ? styles.addToBasketSecondary : styles.addToBasket}
      onClick={(e) => {
        e.preventDefault();
    
        handleAddToBasket();
      }}
      disabled={isLoading}
    >
      {isLoading ? "Adding..." : "Add To Basket"}
    </button>
  )
}