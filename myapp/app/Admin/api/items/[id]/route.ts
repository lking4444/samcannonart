import { NextResponse } from "next/server";
import { updateItem } from "@/lib/db/items";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function PATCH( request: Request, { params }: { params: Promise<{ id: string }> } ) {
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

        if (Number.isNaN(itemId)) {
        return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
        }

        const body = await request.json();

        const updatedItem = await updateItem(itemId, {
            name: body.name,
            price: body.price,
            description: body.description ?? null,
            dimensions: body.dimensions ?? null,
            media: body.media ?? null,
            stock: Number(body.stock),
            image: body.image,
            year: body.year ?? null,
            popular: Boolean(body.popular),
            hidden: Boolean(body.hidden),
            tags: Array.isArray(body.tags) ? body.tags : [],
        });

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error("Failed to update item:", error);
        return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 }
        );
    }
}