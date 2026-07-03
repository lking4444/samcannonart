/*
  Warnings:

  - A unique constraint covering the columns `[uploadId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "uploadId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Item_uploadId_key" ON "Item"("uploadId");
