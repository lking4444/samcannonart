import { DbItem } from "@/app/Types/items"

export async function loadCartItemsByIds(ids: number[]) {
    const res = await fetch("/api/items/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    })

    if (!res.ok) {
        throw new Error("Failed to load cart items")
    }

    return res.json() as Promise<DbItem[]>
}