import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      select: {
        tags: true,
      },
    });

    const tags = [...new Set(items.flatMap((item) => item.tags ?? []))].sort();

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Failed to fetch tags:", error);

    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}