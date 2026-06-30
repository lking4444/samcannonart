import { DbItem } from "@/app/Types/items";
import { computeInternationalCalendarShippingCost, computeInternationalCardShippingCost, computeInternationalGiftShippingCost, computeInternationalNotepadShippingCost, computeInternationalPrintShippingCost } from "./internationalShippingCostByType";
import { GiftType } from "@prisma/client";

export function computeInternationalShipping(items: Array<DbItem & { quantity: number }>): number {
    if (items.some((item) => item.type === "ORIGINAL")) {
        return 17.53;
    }

    const cardCount = items .filter((item) => item.type === "CARD") .reduce((sum, item) => sum + item.quantity, 0);
    const calendarCount = items .filter((item) => item.type === "CALENDAR") .reduce((sum, item) => sum + item.quantity, 0);
    const printDimensions = items .filter((item) => item.type === "PRINT") .flatMap((item) => Array(item.quantity).fill(item.dimensions));
    const notePadCount = items .filter((item) => item.type === "NOTEPAD") .reduce((sum, item) => sum + item.quantity, 0);
    const giftCountsByType = items
        .filter((item) => item.gift !== null)
        .reduce<Partial<Record<GiftType, number>>>((counts, item) => {
            const giftType = item.gift!.giftType;

            counts[giftType] = (counts[giftType] ?? 0) + item.quantity;

            return counts;
        }, {});

    const giftShippingCost = computeInternationalGiftShippingCost(giftCountsByType);
    const cardShippingCost = computeInternationalCardShippingCost(cardCount);
    const calendarShippingCost = computeInternationalCalendarShippingCost(calendarCount);
    const notepadShippingCost = computeInternationalNotepadShippingCost(notePadCount);
    const printShippingCost = computeInternationalPrintShippingCost(printDimensions);

    return Math.max(
        cardShippingCost,
        giftShippingCost,
        calendarShippingCost,
        printShippingCost,
        notepadShippingCost
    );
}