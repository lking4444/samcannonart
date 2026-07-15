export const EXPORTABLE_ITEM_TYPES = [
    {
        value: "CARD",
        label: "Cards",
    },
    {
        value: "CALENDAR",
        label: "Calendars",
    },
    {
        value: "PRINT",
        label: "Prints",
    },
    {
        value: "ORIGINAL",
        label: "Originals",
    },
    {
        value: "NOTEPAD",
        label: "Notepads",
    },
    {
        value: "GIFT",
        label: "Gifts",
    },
] as const

export type ExportItemType = (typeof EXPORTABLE_ITEM_TYPES)[number]["value"]

const exportableItemTypeValues = new Set<string>(
    EXPORTABLE_ITEM_TYPES.map((itemType) => itemType.value)
)

export function isExportItemType( value: string | null ): value is ExportItemType {
    return value !== null && exportableItemTypeValues.has(value)
}

export function getExportItemTypeLabel(type: ExportItemType): string {
    return (
        EXPORTABLE_ITEM_TYPES.find(
            (itemType) => itemType.value === type
        )?.label ?? type
    )
}