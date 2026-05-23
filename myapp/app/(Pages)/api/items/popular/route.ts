import { NextResponse } from "next/server";

import { getRandomPopularItems } from "@/lib/db/items";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : 5;

        if (Number.isNaN(limit) || limit < 1) {
            return NextResponse.json(
                { error: "Invalid limit parameter" },
                { status: 400 }
            );
        }

        const items = await getRandomPopularItems(limit);

        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch random popular items:", error);

        return NextResponse.json(
            { error: "Failed to fetch random popular items" },
            { status: 500 }
        );
    }
}