import { GiftType } from "@/app/generated/prisma/enums";

export const ItemType = {
    SLATE: "SLATE",
    CARD: "CARD",
    CALENDAR: "CALENDAR",
    PRINT: "PRINT",
    ORIGINAL: "ORIGINAL",
    NOTEPAD: "NOTEPAD",
    GIFT: "GIFT",
  } as const;
  
  export type ITEM_TYPE = typeof ItemType[keyof typeof ItemType];

  export type UploadClientItem = {
    name: string;
    uploadId: number;
    type: ITEM_TYPE;
    price: string;
    image: string;
    stock: number;
    tags: string[];
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
    cardId?: string | undefined;
    printId?: string | undefined;
    notePadName?: string | undefined;
    giftNumber?: number | undefined;
    giftType?: GiftType | undefined;
};