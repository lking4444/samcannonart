import { DbItem } from "@/app/Types/items";
import { computeCardShippingCost, computePrintShippingCost, computeCalendarShippingCost, computeNotepadShippingCost } from "./shippingCostByType";

export function computeShipping(items: Array<DbItem & { quantity: number }>): number {
    if (items.some((item) => item.type === "ORIGINAL")) {
        return 0;
    }

    const itemTotal = items.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity;
    }, 0);

    if (itemTotal > 100) {
        return 0;
    }

    const cardCount = items .filter((item) => item.type === "CARD") .reduce((sum, item) => sum + item.quantity, 0);
    const calendarCount = items .filter((item) => item.type === "CALENDAR") .reduce((sum, item) => sum + item.quantity, 0);
    const notePadCount = items .filter((item) => item.type === "NOTEPAD") .reduce((sum, item) => sum + item.quantity, 0);

    const printDimensions = items .filter((item) => item.type === "PRINT") .flatMap((item) => Array(item.quantity).fill(item.dimensions));

    const cardShippingCost = computeCardShippingCost(cardCount);
    const calendarShippingCost = computeCalendarShippingCost(calendarCount);
    const notepadShippingCost = computeNotepadShippingCost(notePadCount);
    const printShippingCost = computePrintShippingCost(printDimensions);


    return Math.max(
        cardShippingCost,
        calendarShippingCost,
        notepadShippingCost,
        printShippingCost
    );
}