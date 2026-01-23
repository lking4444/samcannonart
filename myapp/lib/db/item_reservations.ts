import { prisma } from '@/lib/prisma';
import { Prisma } from "@prisma/client"

type BasketItemInput = { 
    itemId: number; 
    quantity: number 
}

type CreateReservationInput = { 
    items: BasketItemInput[]; 
}

// 5 minute reservation time
const RESERVATION_DURATION_MS = 5 * 60 * 1000 

async function getReservedItemMap(transaction: Prisma.TransactionClient, itemIds: number[],now: Date): Promise<Map<number, number>> {
    // compute the number of reservation per basket item,  null if there are none
    const reserved: { itemId: number; _sum: { quantity: number | null } }[] =
        await transaction.reservationItem.groupBy({
                by: ["itemId"],
                where: {
                    itemId: { in: itemIds },
                    reservation: { expiresAt: { gt: now } },
                },
                _sum: { quantity: true },
        })
  
    const reservedItemMap = new Map<number, number>()
  
    for (const { itemId, _sum } of reserved) {
        reservedItemMap.set(itemId, _sum.quantity ?? 0)
    }
  
    return reservedItemMap
  }

export async function createReservationWithStockCheck(data: CreateReservationInput) {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + RESERVATION_DURATION_MS)

    // Reduce basket items into a map from item to stock value
    const itemStockMap = data.items.reduce<Record<number, number>>(
        (map, { itemId, quantity }) => {
            map[itemId] = (map[itemId] ?? 0) + quantity
            return map
        },
        {}
      )

    const itemIds = Object.keys(itemStockMap).map(Number)

    return prisma.$transaction(async (transaction) => {
        // Clear expired reservations
        await transaction.reservation.deleteMany({
            where: { expiresAt: { lt: now } },
        })

        // Get current stock of items in basket
        const items = await transaction.item.findMany({
            where: { id: { in: itemIds } },
            select: { id: true, stock: true },
        })

        // compute the number of reservation per basket item,  null if there are none
        const reservedItemMap :  Map<number, number> = await getReservedItemMap(transaction, itemIds, now)

        // Check item availability
        for (const item of items) {
            const requestedStock = itemStockMap[item.id] ?? 0
            const numberOfReserved = reservedItemMap.get(item.id) ?? 0
            const available = item.stock - numberOfReserved

            if (available < requestedStock) {
                throw new Error(`Item ${item.id} out of stock`)
            }
        }

        // Create reservation + reservation items
        return transaction.reservation.create({
            data: {
                expiresAt,
                items: {
                    create: Object.entries(itemStockMap).map(([itemId, quantity]) => ({
                        itemId: Number(itemId),
                        quantity,
                    })),
                },
            },
            include: { items: true },
        })
    })
}