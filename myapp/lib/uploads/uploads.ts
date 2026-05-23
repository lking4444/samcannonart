import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";

import { RawExcelRow } from "../imports/types";
import { ItemTypeValue, UploadClientItem, ParsedRow } from "@/app/Types/upload";
import { GIFT_TYPE, GiftType, ITEM_TYPE, ItemType } from "@/app/Types/items";

function toStringValue(value: unknown): string {
    return value == null ? "" : String(value).trim();
}
  
function toNumberValue(value: unknown): number {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
  }
  
function toNullableNumberValue(value: unknown): number | null {
    const str = toStringValue(value);
    if (!str) return null;
  
    const num = Number(str);
    return Number.isNaN(num) ? null : num;
  }
  
function parseTags(value: unknown): string[] {
    if (!value) return [];
        return String(value)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
}
  
function parseItemType(value: unknown): ItemTypeValue {
    const type = String(value).trim().toUpperCase();
  
    switch (type) {
        case "CARD":
            return ItemType.CARD;
        case "PRINT":
            return ItemType.PRINT;
        case "NOTEPAD":
            return ItemType.NOTEPAD;
        case "GIFT":
            return ItemType.GIFT;
        case "CALENDAR":
            return ItemType.CALENDAR;
        case "ORIGINAL":
            return ItemType.ORIGINAL;
        case "SLATE":
            return ItemType.SLATE;
        default:
            return ItemType.ORIGINAL;
    }
}

function parseGiftType(value: unknown):  GIFT_TYPE{
    const type = String(value).trim().toUpperCase();
  
    switch (type) {
        case "MIXEDMEDIA":
            return GiftType.MIXEDMEDIA;
        case "PEBBLES":
            return GiftType.PEBBLES;
        case "TINYPEBBLES":
            return GiftType.TINYPEBBLES;
        default:
            return GiftType.MIXEDMEDIA;
    }   
}

export function isExcelFile(file: File) {
    return (
        file.name.toLowerCase().endsWith(".xlsx") ||
        file.name.toLowerCase().endsWith(".xls") ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
    );
  }

export function filterItemsNotInDatabase(uploadedItems: UploadClientItem[], existingUploadIds: string[]): UploadClientItem[] {
    const existingIdsSet = new Set(existingUploadIds);
  
    return uploadedItems.filter((item) => !existingIdsSet.has(item.uploadId));
}
  
export async function parseUploadSpreadsheet(file: File): Promise<UploadClientItem[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
  
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
  
    const rows = XLSX.utils.sheet_to_json<ParsedRow>(firstSheet, {
        defval: "",
    });
  
    return rows.map(mapRowToUploadItem);
}

export function mapRowToUploadItem(row: RawExcelRow): UploadClientItem {
    const type = parseItemType(row.Type);

    const base = {
        uploadId: toStringValue(row.UploadId),
        name: toStringValue(row.Name),
        type,
        price: toStringValue(row.Price),
        image: toStringValue(row.Image),
        stock: toNumberValue(row.Stock),
        tags: parseTags(row.Tags),
        dimensions: toStringValue(row.Dimensions) || null,
        media: toStringValue(row.Media) || null,
        description: toStringValue(row.Description) || null,
        year: toNullableNumberValue(row.Year),
    };

    switch (type) {
        case 'CARD':
            return {
                ...base,
                cardId: toStringValue(row.CardId),
            };
        case 'PRINT':
            return {
                ...base,
                printId: toStringValue(row.PrintId),
            };
        case 'NOTEPAD':
            return {
                ...base,
                notePadName: toStringValue(row.CardId),
        
            };
        case 'GIFT':
            const giftType = parseGiftType(row.GiftType)

            return {
                ...base,
                giftNumber: toNumberValue(row.GiftNumber),
                giftType: giftType,
            };
    }

    return base;   
}

export async function fetchExistingUploadIds(uploadIds: string[]) {
    const response = await fetch("/Admin/api/items/existing-upload-ids", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uploadIds }),
    });
  
    if (!response.ok) {
        throw new Error("Failed to check existing upload IDs");
    }
  
    const data = await response.json();
    return data.existingUploadIds as string[];
}

export async function saveAllUploadItems(newItems: UploadClientItem[], setNewItems: Dispatch<SetStateAction<UploadClientItem[]>>) {
    if (newItems.length === 0) { return; }
  
    const type = newItems[0].type;
  
    const response = await fetch("/Admin/api/add-many", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type,
            items: newItems,
        }),
    });
  
    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || `Failed to save ${type} items`);
    }
  
    setNewItems([]);
}

export async function saveItem( item: UploadClientItem, selectedFile: File | null, onSaved: (uploadId: string) => void ) {
    if (!selectedFile) { throw new Error("Please select an image before saving."); }
   
    const selectedFileName = selectedFile.name.replace(/\.jpg$/i, "");
  
    if (selectedFileName !== item.image) {
        throw new Error( `Image filename mismatch. Expected "${item.image}", got "${selectedFileName}".` );
    }
  
    const imageId = item.image;
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("itemType", item.type);
    formData.append("imageId", imageId);
  
    const uploadResponse = await fetch("/Admin/api/images/single", {
        method: "POST",
        body: formData,
    });
  
    if (!uploadResponse.ok) { throw new Error("Failed to upload image"); }
  
    const response = await fetch("/Admin/api/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
  
    if (!response.ok) { throw new Error("Failed to save item"); }
  
    onSaved(item.uploadId);
}

export function isItemType(value: string): value is ITEM_TYPE {
    return Object.values(ItemType).includes(value as ITEM_TYPE);            
}