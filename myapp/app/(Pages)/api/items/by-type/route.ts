import { NextResponse } from "next/server";

import { getItemsByPageFiltered } from "@/lib/db/items";
import type { ItemType } from '@prisma/client';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    // Need item type
    const type = searchParams.get("type") as ItemType | null;
    if (!type) return NextResponse.json({ error: "Missing type" }, { status: 400 });

    // If no page default to 1
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "20");

    // Sorting and Search Params
    const keyword = searchParams.get("keyword") ?? "";
    const dimension = searchParams.get("dimension") ?? "Default";
    const tag = searchParams.get("tag") ?? "Default";
    const sortOrder = (searchParams.get("sortOrder") ?? "Default") as
        | "High to Low"
        | "Low to High"
        | "Default";

    const data = await getItemsByPageFiltered({
        type,
        page,
        pageSize,
        keyword,
        dimension,
        tag,
        sortOrder,
    });

    return NextResponse.json(data);
}