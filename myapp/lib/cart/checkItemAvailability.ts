import { ItemAvailability } from "@/app/Types/ItemAvailability"

export async function checkItemAvailability( itemId: number ): Promise<ItemAvailability> {
    const res = await fetch(`/api/items/${itemId}/availability`)

    if (!res.ok) {
    return {
        exists: false,
        available: false,
        stock: 0,
    }
    }

    return res.json()
}