/*
  Warnings:

  - You are about to drop the column `itemType` on the `Item` table. All the data in the column will be lost.
  - Added the required column `image` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SLATE', 'CARD', 'CALENDAR', 'PRINT', 'ORIGINAL', 'NOTEPAD', 'GIFT');

-- CreateEnum
CREATE TYPE "GiftType" AS ENUM ('MIXEDMEDIA', 'PEBBLES', 'TINYPEBBLES');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "itemType",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "media" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "type" "ItemType" NOT NULL,
ADD COLUMN     "year" INTEGER;

-- CreateTable
CREATE TABLE "Card" (
    "itemId" INTEGER NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Print" (
    "itemId" INTEGER NOT NULL,
    "printId" TEXT NOT NULL,

    CONSTRAINT "Print_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "NotePad" (
    "itemId" INTEGER NOT NULL,
    "notePadName" TEXT NOT NULL,

    CONSTRAINT "NotePad_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Original" (
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Original_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Gift" (
    "itemId" INTEGER NOT NULL,
    "giftNumber" TEXT NOT NULL,
    "giftType" "GiftType" NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Slate" (
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Slate_pkey" PRIMARY KEY ("itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardId_key" ON "Card"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Print_printId_key" ON "Print"("printId");

-- CreateIndex
CREATE UNIQUE INDEX "NotePad_notePadName_key" ON "NotePad"("notePadName");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Print" ADD CONSTRAINT "Print_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotePad" ADD CONSTRAINT "NotePad_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Original" ADD CONSTRAINT "Original_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slate" ADD CONSTRAINT "Slate_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
