import { customShippingCharges, validateQuantities } from "./rules";
import { DbItem } from "@/app/Types/items";
import { computeCardShippingCost, computePrintShippingCost, computeCalendarShippingCost, computeNotepadShippingCost } from "./shippingCostByType";

export function computeDefaultShipping(items: Array<DbItem & { quantity: number }>): number {

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

export function computeShipping(items: Array<DbItem & { quantity: number }>): number {
    validateQuantities(items);
    if (items.some(item => item.type === "ORIGINAL")) return 0;
    const subtotal = items.reduce((sum, item) => sum + Math.round(Number(item.price) * 100) * item.quantity, 0);
    if (subtotal >= 12500) return 0;
    const defaults = items.filter(item => item.shippingRuleId === null);
    return Math.max(computeDefaultShipping(defaults), ...customShippingCharges(items, "UK"), 0);
}
