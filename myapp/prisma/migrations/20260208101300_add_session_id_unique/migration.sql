/*
  Warnings:

  - A unique constraint covering the columns `[SessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_SessionId_key" ON "Order"("SessionId");
