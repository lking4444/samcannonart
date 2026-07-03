import { ItemType } from "@prisma/client";
  
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_CDN_URL

export const getBaseFolder = (itemType: ItemType): string => {
    switch (itemType) {
        case ItemType.CARD:
            return "Cards/CardsWithIdLowRes";
        case ItemType.ORIGINAL:
            return "Originals/OriginalsLowRes";
        case ItemType.PRINT:
            return "Prints/DetailedImages";
        case ItemType.CALENDAR:
            return "Calendars/CalendarsWithIdLowRes";
        case ItemType.SLATE:
            return "Slates/SlatesWithIdLowRes";
        case ItemType.GIFT:
            return "Gifts/DetailedImages";
        case ItemType.NOTEPAD:
            return "Notepads/NotepadsWithIdLowRes";
        default:
            throw new Error(`Unsupported item type: ${itemType}`);
    }
};

export const getThumbnailFolder = (itemType: ItemType): string => {
    switch (itemType) {
        case ItemType.CARD:
            return "Cards/Thumbnails";
        case ItemType.ORIGINAL:
            return "Originals/Thumbnails";
        case ItemType.PRINT:
            return "Prints/Thumbnails";
        case ItemType.CALENDAR:
            return "Calendars/Thumbnails";
        case ItemType.SLATE:
            return "Slates/Thumbnails";
        case ItemType.GIFT:
            return "Gifts/Thumbnails";
        case ItemType.NOTEPAD:
            return "Notepads/Thumbnails";
        default:
            throw new Error(`Unsupported item type: ${itemType}`);
    }
};
  
export const getImageKey = (itemType: ItemType, imageId: string | null): string => {
    return `${getBaseFolder(itemType)}/${imageId}.jpg`;
};

export const getThumbnailKey = (itemType: ItemType, imageId: string | null): string => {
    return `${getThumbnailFolder(itemType)}/${imageId}.webp`;
};


export function getItemImageSrc(type: ItemType, image: string, Thumbnail?: boolean) {
    if (Thumbnail){
        const imagePath = getThumbnailKey(type, image)
        return `${IMAGE_BASE_URL}/${imagePath}`;
    }
    const imagePath = getImageKey(type, image);

    return `${IMAGE_BASE_URL}/${imagePath}`;
}