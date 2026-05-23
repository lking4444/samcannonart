import { NextResponse } from "next/server";

import { getRecommendedItems } from "@/lib/db/items";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
  
    const id = Number(idParam);
    if (!idParam || Number.isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Missing/invalid id" }, { status: 400 });
    }
  
    const items = await getRecommendedItems(id, 5);
    return NextResponse.json({ items });
  }