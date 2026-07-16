export function computeCardShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1) return 1.8;
    if (numberOfItems === 2) return 2.8;
    if (numberOfItems <= 18) return 3.3;
    return 0;
}

export function computeCalendarShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1 || numberOfItems === 2) return 3.3;
    if (numberOfItems >= 3) return 4.65;
    return 0;
}

export function computeNotepadShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1 || numberOfItems === 2) return 3.3;
    if (numberOfItems >= 3) return 4.65;
    return 0;
}

export function computeGiftShippingCost(numberOfItems: number): number {
    if (numberOfItems <= 0) return 0;
    if (numberOfItems === 1 || numberOfItems === 2) return 3.3;
    if (numberOfItems >= 3) return 4.65;
    return 0;
}

export function computePrintShippingCost(sizes: string[]): number {
    const DEFAULT_RECTANGLE_PRICE = 6.55;
    const SQUARE_PRICE = 4.65;

    try {
        if (sizes.length === 0) {
            return 0;
        }

        const validSizes = sizes.filter((size) => size && size.trim().length > 0);

        if (validSizes.length === 0) {
            return 0;
        }

        const hasRectangleOrInvalidSize = validSizes.some((size) => {
            const matches = size.match(/\d+(\.\d+)?/g);

            if (!matches || matches.length < 2) {
                return true;
            }

            const width = Number(matches[0]);
            const height = Number(matches[1]);

            if (Number.isNaN(width) || Number.isNaN(height)) {
                return true;
            }

            return width !== height;
        });

        if (hasRectangleOrInvalidSize) {
            return DEFAULT_RECTANGLE_PRICE;
        }

        return SQUARE_PRICE;
    } catch {
        return 0;
    }
}