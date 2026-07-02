// scripts/updateOriginalImages.ts

import { prisma } from '../lib/prisma';

async function main() {
  const originals = await prisma.original.findMany({
    include: {
      item: true,
    },
  });

  console.log(`Found ${originals.length} originals`);

  const updates = originals
    .map((original) => {
      const uploadId = original.item.uploadId;

      if (!uploadId) {
        console.warn(
          `Skipping item ${original.itemId}: missing uploadId`
        );

        return null;
      }

      if (original.item.image === uploadId) {
        console.log(
          `Skipping item ${original.itemId}: image already matches uploadId "${uploadId}"`
        );

        return null;
      }

      console.log(
        `Updating item ${original.itemId}: image "${original.item.image}" -> "${uploadId}"`
      );

      return prisma.item.update({
        where: {
          id: original.itemId,
        },
        data: {
          image: uploadId,
        },
      });
    })
    .filter((update): update is ReturnType<typeof prisma.item.update> => {
      return update !== null;
    });

  if (updates.length === 0) {
    console.log('No original images needed updating');
    return;
  }

  await prisma.$transaction(updates);

  console.log(`Updated ${updates.length} original images successfully`);
}

main()
  .catch((error) => {
    console.error('Failed to update original images');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });