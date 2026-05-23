import { NextResponse } from "next/server";

import { deleteItem } from "@/lib/db/items";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function DELETE( request: Request, { params }: { params: Promise<{ id: string }> } ) {
    const session = await requireAdmin();

    if (!session) {
        return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const itemId = Number(id);
    
        if (!Number.isInteger(itemId)) {
            return NextResponse.json(
                { error: "Invalid item id" },
                { status: 400 }
            );
        }
    
        await deleteItem(itemId);
    
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
    
        if ( error instanceof PrismaClientKnownRequestError && error.code === "P2025" ) {
            return NextResponse.json(
                { error: "Item not found" },
                { status: 404 }
            );
        }
    
        if ( error instanceof PrismaClientKnownRequestError && error.code === "P2003" ) {
            return NextResponse.json( { error: "This item cannot be deleted because it is linked to an order or reservation.", },
                { status: 409 }
            );
        }
    
        return NextResponse.json(
            { error: "Failed to delete item" },
            { status: 500 }
        );
     }
}