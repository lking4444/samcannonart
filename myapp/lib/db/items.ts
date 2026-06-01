import { prisma } from '@/lib/prisma';
import type { Item, ItemType, Prisma } from '@prisma/client';
import { normaliseTag } from '../filtering/tags';

type SortOrder = "High to Low" | "Low to High" | "Default";

type UpdateItemInput = {
    name: string;
    price: string;
    description?: string | null;
    dimensions?: string | null;
    media?: string | null;
    stock: number;
    image: string;
    year?: number | null;
    popular: boolean;
    hidden: boolean;
    tags: string[];
};


type StockDecrementInput = {
    itemId: number;
    quantity: number;
};

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .map(t => t.trim())
}
  
function unique<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}
  
function countOverlap(a: string[], b: string[]): number {
    if (a.length === 0 || b.length === 0) return 0;

    const setB = new Set(b);
    let count = 0;
    for (const x of a) if (setB.has(x)) count++;
        return count;
}

export async function getAllCardItems(){
    return prisma.item.findMany({
        where: {type: 'CARD'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllTagsByType(type: ItemType): Promise<string[]> {
    const items = await prisma.item.findMany({
        where: {
            type,
            stock: { gt: 0 },
        },
        select: {
            tags: true,
        },
        });

    const allTags = items.flatMap((item) => item.tags ?? []);

    return [...new Set(allTags)]
        .map((tag) => tag.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
}

export async function getRandomPopularItems(limit = 5) {
    const safeLimit = Math.max(1, Math.min(limit, 20));
  
    return prisma.$queryRaw`
      SELECT *
      FROM "Item"
      WHERE "popular" = true
        AND "hidden" = false
      ORDER BY RANDOM()
      LIMIT ${safeLimit}
    `;
  }
  
export async function deleteItem(itemId: number) {
    return prisma.item.delete({
      where: {
        id: itemId,
      },
    });
}

export async function updateItem(id: number, data: UpdateItemInput) {
    return prisma.item.update({
        where: { id },
        data: {
            name: data.name,
            price: data.price,
            description: data.description,
            dimensions: data.dimensions,
            media: data.media,
            stock: data.stock,
            image: data.image,
            year: data.year,
            popular: data.popular,
            hidden: data.hidden,
            tags: data.tags,
        },
    });
}

export async function togglePopular(id: number) {
    const item = await prisma.item.findUnique({
      where: { id },
      select: { popular: true },
    });
  
    if (!item) {
      throw new Error("Item not found");
    }
  
    return prisma.item.update({
      where: { id },
      data: {
        popular: !item.popular,
      },
    });
}

export async function getAllCalendarItems(){
    return prisma.item.findMany({
        where: {type: 'CALENDAR'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllOriginalItems(){
    return prisma.item.findMany({
        where: {type: 'ORIGINAL'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllGiftItems(){
    return prisma.item.findMany({
        where: {type: 'GIFT'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllSlateItems(){
    return prisma.item.findMany({
        where: {type: 'SLATE'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllPrintItems(){
    return prisma.item.findMany({
        where: {type: 'PRINT'},
        orderBy: {year: 'desc'},
    });
}


export async function getAllNotepadItems(){
    return prisma.item.findMany({
        where: {type: 'NOTEPAD'},
        orderBy: {year: 'desc'},
    });
}

export async function getAllItemsById(ids: number[]) {
    return prisma.item.findMany({
      where: {
        id: { in: ids },
      },
    })
}


export async function getItem(id: number){
    return prisma.item.findUnique({
        where: {id},
    });
}

export async function getRecommendedItems(itemId: number, limit = 12) {
    const MIN_RECS = 5;
    const target = Math.max(MIN_RECS, limit);
  
    const base = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, type: true, name: true, description: true, tags: true },
    });
    if (!base) return [];
  
    const baseTags = unique((base.tags ?? []).map(t => t.trim().toLowerCase()).filter(Boolean));
    const baseNameTokens = unique(tokenize(base.name ?? ""));
    const baseDescTokens = unique(tokenize(base.description ?? ""));
  
    const candidates = await prisma.item.findMany({
        where: { id: { not: base.id }, stock: { gt: 0 }, hidden: false },
        select: {
            id: true, name: true, type: true, price: true, image: true,
            stock: true, dimensions: true, description: true, year: true, tags: true,
        },
        take: 250,
    });
  
    // if the catalog can't supply 
    if (candidates.length <= target) {
      return [...candidates].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0)).slice(0, target);
    }
  
    const picked: typeof candidates = [];
    const pickedIds = new Set<number>();
  
    const addInOrder = (items: typeof candidates) => {
      for (const it of items) {
        if (pickedIds.has(it.id)) continue;
        picked.push(it);
        pickedIds.add(it.id);
        if (picked.length >= target) break;
      }
    };
  
    // 1) TAG overlap (take ONLY those with overlap > 0)
    const byTags = candidates
      .map(it => {
        const tags = unique((it.tags ?? []).map(t => t.trim().toLowerCase()).filter(Boolean));
        return { item: it, score: countOverlap(baseTags, tags) };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || Number(b.item.price ?? 0) - Number(a.item.price ?? 0) || (b.item.year ?? 0) - (a.item.year ?? 0))
      .map(x => x.item);
  
    addInOrder(byTags);
  
    // 2) NAME overlap (if we still need more)
    if (picked.length < MIN_RECS) {
      const byName = candidates
        .map(it => ({ item: it, score: countOverlap(baseNameTokens, unique(tokenize(it.name ?? ""))) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || Number(b.item.price ?? 0) - Number(a.item.price ?? 0) || (b.item.year ?? 0) - (a.item.year ?? 0))
        .map(x => x.item);
  
      addInOrder(byName);
    }
  
    // 3) DESCRIPTION overlap
    if (picked.length < MIN_RECS) {
      const byDesc = candidates
        .map(it => ({ item: it, score: countOverlap(baseDescTokens, unique(tokenize(it.description ?? ""))) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || Number(b.item.price ?? 0) - Number(a.item.price ?? 0) || (b.item.year ?? 0) - (a.item.year ?? 0))
        .map(x => x.item);
  
      addInOrder(byDesc);
    }
  
    // 4) Fallback: same type, highest price
    if (picked.length < MIN_RECS) {
      const sameTypeHighPrice = [...candidates]
        .filter(it => it.type === base.type)
        .sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0) || (b.year ?? 0) - (a.year ?? 0));
      addInOrder(sameTypeHighPrice);
    }
  
    // 5) Final fallback: anything highest price (in case same-type isn't enough)
    if (picked.length < MIN_RECS) {
      const anyHighPrice = [...candidates].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0) || (b.year ?? 0) - (a.year ?? 0));
      addInOrder(anyHighPrice);
    }
  
    // Ensure correct length cap
    return picked.slice(0, target);
}


export async function changeStock(changeValue : number, id : number){
    const item: Item | null = await prisma.item.findUnique({
        where: { id },
    });
}

export async function decrementStock(amount : number, id : number){
    return prisma.item.update({
        where: {id},
        data: {
            stock: {
                decrement: amount,
            },
        },
    });
}

export async function incrementStock(amount : number, id : number){
    return prisma.item.update({
        where: {id},
        data: {
            stock: {
                increment: amount,
            },
        },
    });
}

export async function getExistingUploadIds(uploadIds: string[]): Promise<string[]> {
    if (uploadIds.length === 0) return [];
  
    const items = await prisma.item.findMany({
        where: {
            uploadId: {
            in: uploadIds,
            },
        },
        select: {
            uploadId: true,
        },
    });
  
    return items.map((item) => item.uploadId).filter((id): id is string => id !== null);;
}

export async function getItemsByPageFiltered(params: { page?: number; pageSize?: number; type: ItemType; keyword?: string; dimension?: string; tag?: string; sortOrder?: SortOrder; }) {
    const pageSize = params.pageSize ?? 20;
    const page = params.page ?? 1;
  
    const keyword = (params.keyword ?? "").trim();
    const dimension = (params.dimension ?? "Default").trim();
    const tag = (params.tag ?? "Default").trim();
    const sortOrder = (params.sortOrder ?? "Default") as SortOrder;
  
    const normalizedSelectedTag =
      tag !== "Default" ? normaliseTag(tag) : null;
  
    const where = {
      type: params.type,
      hidden: false,
      stock: { gt: 0 },
      ...(dimension != "Default" ? { dimensions: dimension } : {}),
      ...(keyword
        ? {
            name: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };
  
    const orderBy =
      sortOrder === "High to Low"
        ? [{ price: "desc" as const }, { id: "desc" as const }]
        : sortOrder === "Low to High"
        ? [{ price: "asc" as const }, { id: "desc" as const }]
        : [{ year: "desc" as const }, { id: "desc" as const }];
  
    const candidates = await prisma.item.findMany({
      where,
      orderBy,
      select: {
        id: true,
        tags: true,
        name: true,
        type: true,
        price: true,
        image: true,
        stock: true,
        dimensions: true,
        description: true,
        year: true,
      },
    });
  
    const filtered =
      normalizedSelectedTag === null
        ? candidates
        : candidates.filter((item) =>
            item.tags.some(
              (itemTag) => normaliseTag(itemTag) === normalizedSelectedTag
            )
          );
  
    const total = filtered.length;
    const skip = (page - 1) * pageSize;
    const items = filtered.slice(skip, skip + pageSize);
  
    return {
      items,
      total,
      page,
      pageSize,
      hasMore: skip + items.length < total,
    };
  }


export async function searchItems(params: { query: string; page?: number; pageSize?: number; }) {
    const pageSize = params.pageSize ?? 10;
    const page = params.page ?? 1;
    const skip = (page - 1) * pageSize;

    const query = params.query.trim();

    if (query.length === 0) {
        const [items, total] = await Promise.all([
        prisma.item.findMany({
            where: {
            hidden: false,
            },
            orderBy: [{ year: "desc" }, { id: "desc" }],
            take: pageSize,
            skip,
            select: {
            id: true,
            name: true,
            type: true,
            price: true,
            image: true,
            stock: true,
            dimensions: true,
            description: true,
            year: true,
            tags: true,
            },
        }),
        prisma.item.count({
            where: {
            hidden: false,
            },
        }),
        ]);

        return {
        items,
        total,
        page,
        pageSize,
        hasMore: skip + items.length < total,
        };
    }

    const keyword = `%${query}%`;

    const items = await prisma.$queryRaw<
        {
        id: number;
        name: string;
        type: string;
        price: Prisma.Decimal;
        image: string;
        stock: number;
        dimensions: string | null;
        description: string | null;
        year: number | null;
        tags: string[];
        }[]
    >`
        SELECT
        i.id,
        i.name,
        i.type,
        i.price,
        i.image,
        i.stock,
        i.dimensions,
        i.description,
        i.year,
        i.tags
        FROM "Item" i
        WHERE
        i.hidden = false
        AND (
            i.name ILIKE ${keyword}
            OR EXISTS (
            SELECT 1
            FROM unnest(i.tags) AS tag
            WHERE tag ILIKE ${keyword}
            )
        )
        ORDER BY
        CASE
            WHEN i.name ILIKE ${keyword}
            AND EXISTS (
                SELECT 1
                FROM unnest(i.tags) AS tag
                WHERE tag ILIKE ${keyword}
            )
            THEN 1

            WHEN EXISTS (
            SELECT 1
            FROM unnest(i.tags) AS tag
            WHERE tag ILIKE ${keyword}
            )
            THEN 2

            WHEN i.name ILIKE ${keyword}
            THEN 3

            ELSE 4
        END ASC,
        i.year DESC NULLS LAST,
        i.id DESC
        LIMIT ${pageSize}
        OFFSET ${skip}
    `;

    const countResult = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count
        FROM "Item" i
        WHERE
        i.hidden = false
        AND (
            i.name ILIKE ${keyword}
            OR EXISTS (
            SELECT 1
            FROM unnest(i.tags) AS tag
            WHERE tag ILIKE ${keyword}
            )
        )
    `;

    const total = Number(countResult[0]?.count ?? 0);

    return {
        items,
        total,
        page,
        pageSize,
        hasMore: skip + items.length < total,
    };
}
  
export async function decrementPurchasedStock(items: StockDecrementInput[]) {
    if (items.length === 0) return;

    // Combine duplicate item IDs 
    const quantityByItemId = new Map<number, number>();

    for (const item of items) {
        const quantity = Math.max(0, item.quantity ?? 0);

        if (quantity === 0) continue;

        quantityByItemId.set(
            item.itemId,
            (quantityByItemId.get(item.itemId) ?? 0) + quantity
        );
    }

    const stockUpdates = Array.from(quantityByItemId.entries()).map(
        ([itemId, quantity]) => ({
            itemId,
            quantity,
        })
    );

    return prisma.$transaction(async (tx) => {
        for (const { itemId, quantity } of stockUpdates) {
            const result = await tx.item.updateMany({
                where: {
                id: itemId,
                stock: {
                    gte: quantity,
                },
                },
                data: {
                stock: {
                    decrement: quantity,
                },
                },
        });

        if (result.count !== 1) {
            throw new Error(
                `Not enough stock available for item ${itemId}, or item does not exist.`
            );
        }
        }
    });
}