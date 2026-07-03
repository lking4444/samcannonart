"use client"

import { useState } from "react"
import { useCartStore } from "@/app/Store/cartStore"
import { useUiStore } from "@/app/Store/uiStore"
import { checkItemAvailability } from "@/lib/cart/checkItemAvailability"

type CartActionResult = {
  ok: boolean
  message?: string
}

export function useCartActions() {
  const [isLoading, setIsLoading] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const openCart = useUiStore((s) => s.openCart)

  async function canSetQuantity(
    itemId: number,
    nextQuantity: number
  ): Promise<CartActionResult> {
    const availability = await checkItemAvailability(itemId)

    if (!availability.exists) {
      return {
        ok: false,
        message: "This item is no longer available.",
      }
    }

    if (!availability.available) {
      return {
        ok: false,
        message: "This item is out of stock.",
      }
    }

    if (nextQuantity > availability.stock) {
      return {
        ok: false,
        message: `Only ${availability.stock} left in stock.`,
      }
    }

    return { ok: true }
  }

  async function addToCart(itemId: number, quantity = 1) {
    try {
      setIsLoading(true)

      const currentItem = useCartStore
        .getState()
        .items.find((item) => item.itemId === itemId)

      const currentQuantity = currentItem?.quantity ?? 0
      const nextQuantity = currentQuantity + quantity

      const result = await canSetQuantity(itemId, nextQuantity)

      if (!result.ok) {
        return result
      }

      addItem(itemId, quantity)
      openCart()

      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)

      return {
        ok: false,
        message: "Something went wrong. Please try again.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function increaseQuantity(itemId: number, amount = 1) {
    try {
      setIsLoading(true)

      const currentItem = useCartStore
        .getState()
        .items.find((item) => item.itemId === itemId)

      const currentQuantity = currentItem?.quantity ?? 0
      const nextQuantity = currentQuantity + amount

      const result = await canSetQuantity(itemId, nextQuantity)

      if (!result.ok) {
        return result
      }

      setQuantity(itemId, nextQuantity)

      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)

      return {
        ok: false,
        message: "Something went wrong. Please try again.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  function decreaseQuantity(itemId: number, currentQuantity: number) {
    if (currentQuantity <= 1) {
      removeItem(itemId)
      return
    }

    setQuantity(itemId, currentQuantity - 1)
  }

  return {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    isLoading,
  }
}