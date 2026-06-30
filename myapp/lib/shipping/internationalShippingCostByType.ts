import { GiftType } from "@prisma/client";

type GiftCountsByType = Partial<Record<GiftType, number>>;

export function computeInternationalCardShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1 || numberOfItems === 2) return 8.6;
    if (numberOfItems <= 9) return 12.05;
    if (numberOfItems <= 18) return 14.2;
    if (numberOfItems <= 40) return 17.33;
    if (numberOfItems <= 80) return 20.2;
    return 59.50;
}

export function computeInternationalCalendarShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1 ) return 14.2;
    if (numberOfItems === 2 ) return 16.65;
    if (numberOfItems === 3 ) return 17.53;
    if (numberOfItems <= 6 ) return 20.20;
    return 59.50;
}

export function computeInternationalNotepadShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1) return 14.20;
    if (numberOfItems <= 3) return 16.65;
    if (numberOfItems <= 8) return 20.20;
    if (numberOfItems <= 13) return 32.40;
    if (numberOfItems <= 16) return 39.80;
    if (numberOfItems <= 19) return 45.50;
    return 59.50;
}

export function computeInternationalGiftShippingCost( giftCountsByType: GiftCountsByType ): number {
    const costs = Object.entries(giftCountsByType).map(([giftType, count]) => {
        return computeInternationalGiftTypeShippingCost(
            giftType as GiftType,
            count ?? 0
        );
    });

    if (costs.length === 0) {
        return 0;
    }

    return Math.max(...costs);
}

function computeInternationalGiftTypeShippingCost( giftType: GiftType, quantity: number ): number {
    if (quantity <= 0) return 0;

    switch (giftType) {
        case GiftType.SLATE:
        case GiftType.WOOD:
            if (quantity <= 2) return 14.20;
            if (quantity === 3) return 16.65;
            if (quantity === 4) return 17.53;
            if (quantity <= 8) return 20.20;
            return 59.50;

        case GiftType.TINYPEBBLES:
            if (quantity === 1) return 12.05;
            if (quantity === 2) return 14.20;
            if (quantity === 3) return 16.65;
            return 17.53;

        case GiftType.PEBBLES:
            if (quantity <= 4) return 17.53;
            return 59.50;

        case GiftType.MIXEDMEDIA:
            if (quantity === 1) return 12.53;
            if (quantity <= 3) return 17.20;
            return 59.50;

        default:
            return 0;
    }
}

export function computeInternationalPrintShippingCost(sizes: string[]): number {
    try {
        const validSizes = sizes.filter((size) => size && size.trim().length > 0);

        if (validSizes.length === 0) {
            return 0;
        }

        const { numberOfSquares, numberOfRectangles } = getPrintShapeCounts(validSizes);

        if (numberOfRectangles > 0) {
            if (numberOfRectangles <= 3) return 25.20;
            if (numberOfRectangles <= 6) return 31.50;
            if (numberOfRectangles <= 9) return 32.40;
            if (numberOfRectangles <= 12) return 39.80;
            if (numberOfRectangles <= 15) return 45.50;
            return 59.50;
        }

        if (numberOfSquares <= 4) return 17.53;
        if (numberOfSquares <= 8) return 20.20;
        if (numberOfSquares <= 11) return 32.40;
        if (numberOfSquares <= 15) return 39.80;
        if (numberOfSquares <= 20) return 45.50;
        return 59.50;
    } catch {
        return 59.50;
    }
}

function getPrintShapeCounts(sizes: string[]) {
    let numberOfSquares = 0;
    let numberOfRectangles = 0;

    for (const size of sizes) {
        const matches = size.match(/\d+(\.\d+)?/g);

        if (!matches || matches.length < 2) {
            numberOfRectangles += 1;
            continue;
        }

        const width = Number(matches[0]);
        const height = Number(matches[1]);

        if (Number.isNaN(width) || Number.isNaN(height)) {
            numberOfRectangles += 1;
            continue;
        }

        if (width === height) {
            numberOfSquares += 1;
        } else {
            numberOfRectangles += 1;
        }
    }

    return { numberOfSquares, numberOfRectangles };
}