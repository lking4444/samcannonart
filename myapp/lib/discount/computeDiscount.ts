import { DbItem } from "@/app/Types/items";

export function computeDiscount(items: Array<DbItem & { quantity: number }>): number {
    const giftShippingValues = items
        .filter(
            ( item ): item is DbItem & {
                quantity: number
                gift: NonNullable<DbItem["gift"]>
            } => item.type === "GIFT" && item.gift !== null
        )
        .flatMap((item) => {
            const discountValue =
                item.gift.giftType === "PEBBLES"
                    ? 4.65
                    : item.gift.giftType === "TINYPEBBLES" ||
                        item.gift.giftType === "SLATE" ||
                        item.gift.giftType === "WOOD"
                      ? 3.3
                      : 0

            if (discountValue === 0) {
                return []
            }

            return Array(item.quantity).fill(discountValue)
        })

    if (giftShippingValues.length <= 1) {
        return 0
    }

    giftShippingValues.sort((a, b) => a - b)

    return giftShippingValues
        .slice(0, giftShippingValues.length - 1)
        .reduce((sum, value) => sum + value, 0)
}