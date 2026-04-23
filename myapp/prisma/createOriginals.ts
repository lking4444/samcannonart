import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import * as XLSX from 'xlsx';
import { prisma } from '../lib/prisma';
import { createOriginal } from '../lib/db/originals';

type SheetRow = {
  UploadId?: number | string;
  Name?: string;
  Media?: string;
  Dimensions?: string;
  Price?: string | number;
  Tags?: string;
};

function getString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function getInt(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;

  const num = Number(value);
  return Number.isInteger(num) ? num : null;
}

function parseTags(value: unknown): string[] {
  const raw = getString(value);
  if (!raw) return [];

  return raw
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function makeImageName(name: string): string {
  return name.replace(/\s+/g, '').toLowerCase();
}

async function main() {
  const filePath =
    '/Users/louisking/Library/Mobile Documents/com~apple~CloudDocs/Git/test_deployment/test_deployment/myapp/Originals.xlsx';

  console.log('Deleting existing Originals...');
  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: {
        item: {
          type: 'ORIGINAL',
        },
      },
    }),
    prisma.reservationItem.deleteMany({
      where: {
        item: {
          type: 'ORIGINAL',
        },
      },
    }),
    prisma.original.deleteMany(),
    prisma.item.deleteMany({
      where: {
        type: 'ORIGINAL',
      },
    }),
  ]);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<SheetRow>(sheet, {
    defval: '',
  });

  console.log(`Found ${rows.length} rows`);

  for (const [index, row] of rows.entries()) {
    const uploadId = getString(row.UploadId);
    const name = getString(row.Name);
    const media = getString(row.Media);
    const dimensions = getString(row.Dimensions);
    const price = getString(row.Price);
    const tags = parseTags(row.Tags);

    if (uploadId === null || !name || !price) {
      console.warn(
        `Skipping row ${index + 2}: missing UploadId, Name, or Price`
      );
      continue;
    }

    const imageName = makeImageName(name);

    try {
      await createOriginal({
        uploadId,
        name,
        image: imageName,
        price,
        stock: 1,
        dimensions: dimensions || undefined,
        media: media || undefined,
        description: '',
        tags,
      });

      console.log(`Created original: ${name} [uploadId=${uploadId}]`);
    } catch (error) {
      console.error(`Failed on row ${index + 2}:`, error);
    }
  }
}

main()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });