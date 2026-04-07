import { prisma } from '@/lib/prisma';
import type { Item, ItemType } from '@/app/generated/prisma/client';

type SortOrder = "High to Low" | "Low to High" | "Default";

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
      where: { id: { not: base.id }, stock: { gt: 0 } },
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

export async function getExistingUploadIds(uploadIds: number[]): Promise<number[]> {
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
  
    return items.map((item) => item.uploadId).filter((id): id is number => id !== null);;
}

export async function getItemsByPageFiltered(params: {page?: number; pageSize?: number; type: ItemType; keyword?: string; dimension?: string; tag?: string; sortOrder?: SortOrder;}) {
    const pageSize = params.pageSize ?? 20;
    const page = params.page ?? 1;
    const skip = (page - 1) * pageSize;
  
    const keyword = (params.keyword ?? "").trim();
    const dimension = (params.dimension ?? "").trim();
    const tag = (params.tag ?? "Default");
    const sortOrder = (params.sortOrder ?? "Default") as SortOrder;
  
    const where = {
        type: params.type,
        ...({ stock: { gt: 0 } }),
        ...(dimension ? { dimensions: dimension } : {}),
        ...(tag !== "Default" ? { tags: { has: tag } } : {}),
        ...(keyword ? {name: { contains: keyword, mode: "insensitive" as const },}: {}),
    };
  
    const orderBy =
        sortOrder === "High to Low" ? [{ price: "desc" as const }, { id: "desc" as const }] : 
        sortOrder === "Low to High" ? [{ price: "asc" as const }, { id: "desc" as const }] : 
        [{ year: "desc" as const }, { id: "desc" as const }];
  
    const [items, total] = await Promise.all([
        prisma.item.findMany({
            where,
            orderBy,
            take: pageSize,
            skip,
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
        }),
        prisma.item.count({ where }),
    ]);
  
    return {
        items,
        total,
        page,
        pageSize,
        hasMore: skip + items.length < total,
    };
}

export async function getItemsByPageFilteredAdmin(params: {
    page?: number;
    pageSize?: number;
    type: ItemType;
    keyword?: string;
    tag?: string;
  }) {
    const pageSize = params.pageSize ?? 20;
    const page = params.page ?? 1;
    const skip = (page - 1) * pageSize;
  
    const keyword = (params.keyword ?? "").trim();
    const tag = params.tag ?? "Default";
  
    const where = {
      type: params.type,
      stock: { gt: 0 },
      ...(tag !== "Default" ? { tags: { has: tag } } : {}),
      ...(keyword
        ? {
            name: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };
  
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy: [{ year: "desc" as const }, { id: "desc" as const }],
        take: pageSize,
        skip,
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
      }),
      prisma.item.count({ where }),
    ]);
  
    return {
      items,
      total,
      page,
      pageSize,
      hasMore: skip + items.length < total,
    };
  }

export async function searchItems(params: {query: string; page?: number; pageSize?: number;}) {
    const pageSize = params.pageSize ?? 10;
    const page = params.page ?? 1;
    const skip = (page - 1) * pageSize;

    const query = params.query.trim();

    const where =
        query.length === 0
        ? {} 
        : {
            name: {
                contains: query,
                mode: "insensitive" as const, 
            },
            };

    const [items, total] = await Promise.all([
        prisma.item.findMany({
        where,
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
        },
        }),
        prisma.item.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        pageSize,
        hasMore: skip + items.length < total,
    };
}
