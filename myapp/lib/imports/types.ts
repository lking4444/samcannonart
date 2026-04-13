import { GiftType } from "@/app/generated/prisma/enums";
import { ItemType, ITEM_TYPE } from "../types";

export type ImportRowBase = {
    name: string;
    uploadId: number;
    type: ITEM_TYPE;
    price: number;
    image: string;
    stock: number;
    dimensions?: string;
    media?: string;
    description?: string;
    year?: number;
    tags?: string[];
};

export type CardImportRow = ImportRowBase & {
    type: typeof ItemType.CARD;
    cardId: string;
};

export type PrintImportRow = ImportRowBase & {
    type: typeof ItemType.PRINT;
    printId: string;
};

export type CalendarImportRow = ImportRowBase & {
    type: typeof ItemType.CALENDAR;
};

export type OriginalImportRow = ImportRowBase & {
    type: typeof ItemType.ORIGINAL;
};

export type SlateImportRow = ImportRowBase & {
    type: typeof ItemType.SLATE;
};

export type NotePadImportRow = ImportRowBase & {
    type: typeof ItemType.NOTEPAD;
    notePadName: string;
};

export type GiftImportRow = ImportRowBase & {
    type: typeof ItemType.GIFT;
    giftNumber: string;
    giftType: GiftType;
};

export type AnyImportRow =
    | CardImportRow
    | PrintImportRow
    | CalendarImportRow
    | OriginalImportRow
    | SlateImportRow
    | NotePadImportRow
    | GiftImportRow;

export type RawExcelRow = {
    UploadId?: unknown;
    Name?: unknown;
    Type?: unknown;
    Price?: unknown;
    Image?: unknown;
    Stock?: unknown;
    Dimensions?: unknown;
    Media?: unknown;
    Description?: unknown;
    Year?: unknown;
    Tags?: unknown;
    CardId?: unknown;
    PrintId?: unknown;
    NotePadName?: unknown;
    GiftNumber?: unknown;
    GiftType?: unknown;
};