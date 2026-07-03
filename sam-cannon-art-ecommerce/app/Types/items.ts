import { Calendar, Card, Gift, NotePad, Original, Print, Slate } from "@prisma/client";

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
    TINYPEBBLES: 'TINYPEBBLES',
    WOOD: 'WOOD',
    SLATE: 'SLATE'
} as const;

export type ITEM_TYPE = typeof ItemType[keyof typeof ItemType];
export type GIFT_TYPE = typeof GiftType[keyof typeof GiftType];

export type ItemAvailability = {
    exists: boolean
    available: boolean
    stock: number
}

export type ItemClientWithTypes = {
    id: number;
    name: string;
    type: ITEM_TYPE;
    price: string;
    image: string;
    stock: number;
    tags: string[];
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
    popular: boolean;
    hidden: boolean;

    card?: Card;
    calendar?: Calendar;
    print?: Print;
    original?: Original;
    slate?: Slate;
    gift?: Gift;
    notePad?: NotePad;
};

export type ItemClient = {
    id: number;
    name: string;
    type: ITEM_TYPE;
    price: string;
    image: string;
    stock: number;
    tags: string[];
    dimensions: string | null;
    media: string | null;
    description: string | null;
    year: number | null;
    popular: boolean;
    hidden: boolean;
};

export type DbItem = {
    id: number
    name: string
    image: string
    type: ITEM_TYPE
    price: any
    dimensions: string | null
    gift: Gift | null
}
  