import { ItemType } from "@/app/generated/prisma/enums";
  
export const getBaseFolder = (itemType: ItemType): string => {
    switch (itemType) {
        case ItemType.CARD:
            return "Cards/CardsWithIdLowRes";
        case ItemType.ORIGINAL:
            return "Originals/OriginalsLowRes";
        case ItemType.PRINT:
            return "Prints/PrintsWithIdLowRes";
        case ItemType.CALENDAR:
            return "Calendars/CalendarsWithIdLowRes";
        case ItemType.SLATE:
            return "Slates/SlatesWithIdLowRes";
        case ItemType.GIFT:
            return "Gifts";
        case ItemType.NOTEPAD:
            return "Notepads/NotepadsWithIdLowRes";
        default:
            throw new Error(`Unsupported item type: ${itemType}`);
    }
};
  
export const getImageKey = (itemType: ItemType, imageId: string | null): string => {
    return `${getBaseFolder(itemType)}/${imageId}.jpg`;
};

export function getItemImageSrc(type: ItemType, image: string) {
  const imagePath = getImageKey(type, image);
  return `/api/images/${imagePath}`;
}