import { ItemType } from "@prisma/client"

const SORT_ORDERS = ["High to Low", "Low to High", "Default"] as const

export function isPositiveInteger(id: unknown): id is number {
    return typeof id === "number" && Number.isInteger(id) && id > 0
}

export function isItemType(value: string | null): value is ItemType {
    return value !== null && Object.values(ItemType).includes(value as ItemType)
}

export function isSortOrder( value: string | null ): value is "High to Low" | "Low to High" | "Default" {
    return value !== null && SORT_ORDERS.includes(value as "High to Low" | "Low to High" | "Default")
}

export function parsePositiveInteger(value: string | null, fallback: number) {
    const parsed = Number(value ?? fallback)

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback
    }

    return parsed
}