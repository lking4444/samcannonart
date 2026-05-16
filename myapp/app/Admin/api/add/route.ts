import { NextRequest, NextResponse } from 'next/server';

import { createCard } from '@/lib/db/cards';
import { createCalendar } from '@/lib/db/calendars';
import { createPrint } from '@/lib/db/prints';
import { createGift } from '@/lib/db/gifts';
import { createSlate } from '@/lib/db/slates';
import { createOriginal } from '@/lib/db/originals';
import { createNotepad } from '@/lib/db/notepads';
import { requireAdmin } from '@/lib/auth/requireAdmin';

import { UploadClientItem } from '@/app/Types/upload';

export async function POST(req: NextRequest) {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
        const item: UploadClientItem = await req.json();

        const baseData = {
            uploadId: item.uploadId,
            name: item.name,
            price: item.price,
            image: item.image,
            stock: item.stock,
            tags: item.tags,
            dimensions: item.dimensions ?? undefined,
            media: item.media ?? undefined,
            description: item.description ?? undefined,
            year: item.year ?? undefined,
        };

        let created;

        switch (item.type) {
            case 'CARD': {
                if (!item.cardId) {
                    return NextResponse.json(
                        { error: 'cardId is required for CARD items' },
                        { status: 400 }
                    );
                }

                created = await createCard({
                    ...baseData,
                    cardId: item.cardId,
                });
                break;
            }
            case 'SLATE': {
                created = await createSlate({
                    ...baseData,
                });
                break;
            }
            case 'ORIGINAL': {
                created = await createOriginal({
                    ...baseData,
                });
                break;
                }
            case 'CALENDAR': {
                created = await createCalendar({
                    ...baseData,
                    });
                break;
            }
            case 'PRINT': {
                if (!item.printId) {
                    return NextResponse.json(
                        { error: 'printId is required for PRINT items' },
                        { status: 400 }
                    );
                }

                created = await createPrint({
                    ...baseData,
                    printId: item.printId,
                });
                break;
            }
            case 'GIFT': {
                if (!item.giftNumber ){ throw new Error(`giftNumber is required for GIFT item ${item.uploadId}`); }
                if (!item.giftType ){ throw new Error(`giftType is required for GIFT item ${item.uploadId}`); }


                created = await createGift({
                    ...baseData,
                    giftNumber: String(item.giftNumber),
                    giftType: item.giftType,
                });
                break;
            }
            case 'NOTEPAD': {
                created = await createNotepad({
                    ...baseData,
                    notePadName: item.notePadName ?? "",
                });
                break;
        }

        default:
            return NextResponse.json(
                { error: `Unsupported item type: ${item.type}` },
                { status: 400 }
            );
        }

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('Error creating upload item:', error);

        return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
        );
    }
}