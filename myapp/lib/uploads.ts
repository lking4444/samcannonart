import { ItemType, UploadClientItem } from "@/lib/types";
import { RawExcelRow } from "./imports/types";
import { Dispatch, SetStateAction } from "react";

export function filterItemsNotInDatabase(uploadedItems: UploadClientItem[], existingUploadIds: number[]): UploadClientItem[] {
  const existingIdsSet = new Set(existingUploadIds);

  return uploadedItems.filter((item) => !existingIdsSet.has(item.uploadId));
}

export type ItemTypeValue = (typeof ItemType)[keyof typeof ItemType];

export type ParsedRow = Record<string, unknown>;

type SelectedFilesMap = Record<number, File | null>;

export async function saveAllImages(items: UploadClientItem[],selectedFiles: SelectedFilesMap) {
  if (items.length === 0) return;

  const formData = new FormData();

  for (const item of items) {
    const file = selectedFiles[item.uploadId];

    if (!file) {
      throw new Error(`Missing image for uploadId ${item.uploadId}`);
    }

    if (file.name !== item.image) {
      throw new Error(
        `Image filename mismatch for uploadId ${item.uploadId}. Expected "${item.image}", got "${file.name}".`
      );
    }

    const imageId = item.image.replace(/\.[^.]+$/, "");

    formData.append("files", file);
    formData.append(
      "metadata",
      JSON.stringify({
        uploadId: item.uploadId,
        itemType: item.type,
        imageId,
        filename: file.name,
      })
    );
  }

  const response = await fetch("/api/images/upload/bulk", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to upload all images");
  }

  return response.json();
}

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
  
    console.log(`${type}`)
  
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
  
export function mapRowToUploadItem(row: RawExcelRow): UploadClientItem {
    const type = parseItemType(row.Type);

    const base = {
        uploadId: toNumberValue(row.UploadId),
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
            console.log('hello');
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
            return {
                ...base,
                giftNumber: toNumberValue(row.CardId),
                giftType: undefined,
                // TODO : gift type 
            };
    }

    return base;   
}

export async function saveAllUploadItems(
    newItems: UploadClientItem[],
    setNewItems: Dispatch<SetStateAction<UploadClientItem[]>>
  ) {
    if (newItems.length === 0) {
      return;
    }
  
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