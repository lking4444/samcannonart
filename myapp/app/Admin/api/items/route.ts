import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, ItemType } from "@/app/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req: Request) {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page") ?? "1");
        const pageSize = Number(searchParams.get("pageSize") ?? "20");

        const keyword = (searchParams.get("keyword") ?? "").trim();
        const type = (searchParams.get("type") ?? "").trim();
        const tag = (searchParams.get("tag") ?? "Default").trim();

        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20;
        const skip = (safePage - 1) * safePageSize;

        const where: Prisma.ItemWhereInput = {
        ...(type ? { type: type as ItemType } : {}),
        ...(keyword
            ? {
                name: {
                contains: keyword,
                mode: "insensitive",
                },
            }
            : {}),
        ...(tag !== "Default"
            ? {
                tags: {
                has: tag,
                },
            }
            : {}),
        };

        const [items, total] = await Promise.all([
          prisma.item.findMany({
            where,
            orderBy: [
              { hidden: "asc" },
              { id: "desc" },
            ],
            skip,
            take: safePageSize,
          }),
          prisma.item.count({ where }),
        ]);

        return NextResponse.json({
        items,
        total,
        page: safePage,
        pageSize: safePageSize,
        hasMore: skip + items.length < total,
        });
  } catch (error) {
    console.error("Admin items route failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin items" },
      { status: 500 }
    );
  }
}