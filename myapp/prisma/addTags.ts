import { prisma } from "@/lib/prisma";

const TAGS_BY_TYPE: Record<string, string[]> = {
  CARD: ["cards", "stationery", "illustration"],
  CALENDAR: ["calendar", "illustration", "seasonal"],
  PRINT: ["print", "wall-art", "illustration"],
  NOTE_PAD: ["notepad", "stationery", "everyday"],
  ORIGINAL: ["original", "one-of-a-kind", "artwork"],
  GIFT: ["gift", "handmade", "small-batch"],
  SLATE: ["slate", "hand-painted", "home-decor"],
};

const FALLBACK_TAGS = ["handmade", "sam-cannon-art"];

function uniqMerge(existing: string[] | null | undefined, add: string[]) {
  return Array.from(new Set([...(existing ?? []), ...add]));
}

async function main() {
  const items = await prisma.item.findMany({
    select: { id: true, type: true, tags: true },
  });

  let updated = 0;

  for (const item of items) {
    const typeKey = String(item.type);
    const toAdd = [...(TAGS_BY_TYPE[typeKey] ?? []), ...FALLBACK_TAGS];
    const nextTags = uniqMerge(item.tags ?? [], toAdd);

    // only update if changed
    if ((item.tags ?? []).length === nextTags.length) continue;

    await prisma.item.update({
      where: { id: item.id },
      data: { tags: nextTags },
    });

    updated++;
  }

  console.log(`Done. Updated ${updated}/${items.length} items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
