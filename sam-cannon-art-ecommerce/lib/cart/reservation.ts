import { isPositiveInteger } from "./getItems"

const MAX_ITEMS_PER_RESERVATION = 50
const MAX_QUANTITY_PER_ITEM = 99

type CreateReservationInput = {
  items: {
    itemId: number
    quantity: number
  }[]
}

export function parseReservationInput(body: unknown): CreateReservationInput | null {
  if (!body || typeof body !== "object" || !("items" in body)) {
    return null
  }

  const { items } = body as { items: unknown }

  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  if (items.length > MAX_ITEMS_PER_RESERVATION) {
    return null
  }

  const mergedItems = new Map<number, number>()

  for (const item of items) {
    if (!item || typeof item !== "object") {
      return null
    }

    const { itemId, quantity } = item as {
      itemId?: unknown
      quantity?: unknown
    }

    if (!isPositiveInteger(itemId) || !isPositiveInteger(quantity)) {
      return null
    }

    if (quantity > MAX_QUANTITY_PER_ITEM) {
      return null
    }

    mergedItems.set(itemId, (mergedItems.get(itemId) ?? 0) + quantity)
  }

  const parsedItems = Array.from(mergedItems, ([itemId, quantity]) => ({
    itemId,
    quantity,
  }))

  if (parsedItems.length > MAX_ITEMS_PER_RESERVATION) {
    return null
  }

  return { items: parsedItems }
}

export function isValidReservationId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}