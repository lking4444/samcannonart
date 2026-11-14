CREATE TYPE "ShippingRegion" AS ENUM ('UK', 'INTERNATIONAL');
CREATE TABLE "ShippingRule" (
 "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
 "archived" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "ShippingRule_name_key" ON "ShippingRule"("name");
CREATE TABLE "ShippingTier" (
 "id" TEXT NOT NULL PRIMARY KEY, "shippingRuleId" TEXT NOT NULL,
 "region" "ShippingRegion" NOT NULL, "minQuantity" INTEGER NOT NULL,
 "maxQuantity" INTEGER, "priceInPence" INTEGER NOT NULL,
 CONSTRAINT "ShippingTier_shippingRuleId_fkey" FOREIGN KEY ("shippingRuleId") REFERENCES "ShippingRule"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT "ShippingTier_quantity_check" CHECK ("minQuantity" >= 1 AND ("maxQuantity" IS NULL OR "maxQuantity" >= "minQuantity")),
 CONSTRAINT "ShippingTier_price_check" CHECK ("priceInPence" >= 0 AND ("region" <> 'INTERNATIONAL' OR "priceInPence" > 0))
);
CREATE UNIQUE INDEX "ShippingTier_shippingRuleId_region_minQuantity_key" ON "ShippingTier"("shippingRuleId", "region", "minQuantity");
ALTER TABLE "Item" ADD COLUMN "shippingRuleId" TEXT;
CREATE INDEX "Item_shippingRuleId_idx" ON "Item"("shippingRuleId");
ALTER TABLE "Item" ADD CONSTRAINT "Item_shippingRuleId_fkey" FOREIGN KEY ("shippingRuleId") REFERENCES "ShippingRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
