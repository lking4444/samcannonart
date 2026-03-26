import { NextResponse } from "next/server";
import { searchItems } from "@/lib/db/items";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");
    const query = searchParams.get("q") ?? "";

    if (query.length === 0) {
        return NextResponse.json({items: [], total: 0, page, pageSize, hasMore: false,});
    }

    const result = await searchItems({
        query,
        page: Number.isFinite(page) && page > 0 ? page : 1,
        pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
    });

    return NextResponse.json(result);
}