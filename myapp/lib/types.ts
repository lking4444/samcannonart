export const ItemType = {
    SLATE: "SLATE",
    CARD: "CARD",
    CALENDAR: "CALENDAR",
    PRINT: "PRINT",
    ORIGINAL: "ORIGINAL",
    NOTEPAD: "NOTEPAD",
    GIFT: "GIFT",
  } as const;

export const GiftType = {
    MIXEDMEDIA: 'MIXEDMEDIA',
    PEBBLES: 'PEBBLES',
    TINYPEBBLES: 'TINYPEBBLES'
} as const;
  
  export type ITEM_TYPE = typeof ItemType[keyof typeof ItemType];
  export type GIFT_TYPE = typeof GiftType[keyof typeof GiftType];


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
    giftType?: GIFT_TYPE | undefined;
};