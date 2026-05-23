import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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