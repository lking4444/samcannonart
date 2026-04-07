import * as XLSX from "xlsx";
import { prisma } from "../lib/prisma";
import { createCard } from "../lib/db/cards";

type SheetRow = {
  UploadId?: number | string;
  Name?: string;
  CardId?: string;
  Media?: string;
  Tags?: string;
  Dimensions?: string;
};

function getString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function getInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  return Number.isInteger(num) ? num : null;
}

function parseTags(value: unknown): string[] {
  const raw = getString(value);
  if (!raw) return [];

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function main() {
  const filePath =
    "/Users/louisking/Library/Mobile Documents/com~apple~CloudDocs/Git/test_deployment/test_deployment/myapp/Cards.xlsx";
  const defaultStock = 25;

  console.log("Deleting existing cards...");
  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: {
        item: {
          type: "CARD",
        },
      },
    }),
    prisma.reservationItem.deleteMany({
      where: {
        item: {
          type: "CARD",
        },
      },
    }),
    prisma.card.deleteMany(),
    prisma.item.deleteMany({
      where: {
        type: "CARD",
      },
    }),
  ]);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<SheetRow>(sheet, {
    defval: "",
  });

  console.log(`Found ${rows.length} rows`);

  for (const [index, row] of rows.entries()) {
    const uploadId = getInt(row.UploadId);
    const name = getString(row.Name);
    const code = getString(row.CardId);
    const media = getString(row.Media);
    const dimensions = getString(row.Dimensions);
    const tags = parseTags(row.Tags);

    if (uploadId === null || !name || !code) {
      console.warn(
        `Skipping row ${index + 2}: missing UploadId, Name, or Code`
      );
      continue;
    }

    try {
      await createCard({
        uploadId,
        name,
        image: code,
        price: "2.50",
        stock: defaultStock,
        dimensions: dimensions || undefined,
        media: media || undefined,
        description:
          "Inlcudes white envelope, compostable cello wrapper with a blank inside",
        tags,
        cardId: code,
      });

      console.log(`Created card: ${name} (${code}) [uploadId=${uploadId}]`);
    } catch (error) {
      console.error(`Failed on row ${index + 2}:`, error);
    }
  }
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });