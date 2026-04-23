import { NextRequest, NextResponse } from "next/server";
import { ItemType, UploadClientItem } from "@/lib/types";
import { createCards } from "@/lib/db/cards";
import { createCalendars } from "@/lib/db/calendars";
import { createPrints } from "@/lib/db/prints";
import { createOriginals } from "@/lib/db/originals";
import { createSlates } from "@/lib/db/slates";
import { createNotepads } from "@/lib/db/notepads";
import { createGifts } from "@/lib/db/gifts";

type BulkUploadBody = {
    type: keyof typeof ItemType;
    items: UploadClientItem[];
};

export async function POST(req: NextRequest) {
    try {
        const body: BulkUploadBody = await req.json();
        const { type, items } = body;

        if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
            { error: "items must be a non-empty array" },
            { status: 400 }
        );
        }

        const invalidTypeItem = items.find((item) => item.type !== type);

        if (invalidTypeItem) {
        return NextResponse.json(
            { error: "All items must match the requested bulk type" },
            { status: 400 }
        );
        }

        const baseItems = items.map((item) => ({
            uploadId: item.uploadId,
            name: item.name,
            price: item.price.trim(),
            image: item.image,
            stock: item.stock,
            tags: item.tags,
            dimensions: item.dimensions ?? undefined,
            media: item.media ?? undefined,
            description: item.description ?? undefined,
            year: item.year ?? undefined,
        }));

        let created;

        switch (type) {
            case "CARD": {
                const cardItems = items.map((item, index) => {
                if (!item.cardId) { throw new Error(`cardId is required for CARD item ${item.uploadId}`); }
            
                return {
                    ...baseItems[index],
                    cardId: item.cardId,
                };
                });
            
                created = await createCards(cardItems);
                break;
            }

            case "CALENDAR":
                created = await createCalendars(baseItems);
                break;

            case "PRINT":
                const printItems = items.map((item, index) =>{
                    if (!item.printId){ throw new Error(`PrintId is required for PRINT item ${item.uploadId}`); }

                    return {
                        ...baseItems[index],
                        printId: item.printId
                    };
                });

                created = await createPrints(printItems);
                break;

            case "ORIGINAL":
                created = await createOriginals(baseItems);
                break;

            case "SLATE":
                created = await createSlates(baseItems);
                break;

            case "NOTEPAD":
                const notePadItems = items.map((item, index) =>{
                    if (!item.notePadName ){ throw new Error(`notePadName is required for NOTEPAD item ${item.uploadId}`); }

                    return {
                        ...baseItems[index],
                        notePadName: item.notePadName
                    };
                });
            
                created = await createNotepads(notePadItems);
                break;

            case "GIFT":
                const giftItems = items.map((item, index) =>{
                    if (!item.giftNumber ){ throw new Error(`giftNumber is required for GIFT item ${item.uploadId}`); }
                    if (!item.giftType ){ throw new Error(`giftType is required for GIFT item ${item.uploadId}`); }

                    return {
                        ...baseItems[index],
                        giftType: item.giftType,
                        giftNumber: String(item.giftNumber)
                    };
                });

                created = await createGifts(giftItems)
                break;

        default:
            return NextResponse.json(
                { error: `Unsupported bulk type: ${type}` },
                { status: 400 }
            );
        }

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating bulk upload items:", error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create items" },
            { status: 500 }
        );
    }
}