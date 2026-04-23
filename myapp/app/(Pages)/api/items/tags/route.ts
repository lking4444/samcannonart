import { NextRequest, NextResponse } from "next/server";
import { getAllTagsByType } from "@/lib/db/items";
import type { ItemType } from "@/app/generated/prisma/client";
import { formatTagForDisplay, normaliseTag } from "@/lib/tags";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
    
        if (!type) {
            return NextResponse.json(
                { error: "Missing type parameter" },
                { status: 400 }
            );
        }
  
        const rawTags = await getAllTagsByType(type as ItemType);
  
        const uniqueTags = new Map<string, string>();
  
        for (const tag of rawTags) {
            const normalized = normaliseTag(tag);
            if (!normalized) continue;
    
            if (!uniqueTags.has(normalized)) {
                uniqueTags.set(normalized, formatTagForDisplay(tag));
            }
        }
  
        const tags = Array.from(uniqueTags.values()).sort((a, b) =>
            a.localeCompare(b)
        );
  
        return NextResponse.json({ tags });

    } catch (error) {
        console.error("Failed to fetch tags:", error);
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
  }