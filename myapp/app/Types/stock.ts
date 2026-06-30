export class StockReservationError extends Error {
    items: {
        itemId: number
        requested: number
        available: number
    }[]

    constructor(items: { itemId: number; requested: number; available: number }[]) {
        super("Some items are no longer available")
        this.name = "StockReservationError"
        this.items = items
    }
}