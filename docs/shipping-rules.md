# Shipping rules

## Deploy

Apply the additive migration to the deployment database before deploying the new app:

```sh
npx prisma migrate deploy
npx prisma generate
npm run build
```

The migration adds two tables and a nullable `Item.shippingRuleId`. Existing products stay on Default. It does not change any existing product prices, stock, categories or orders.

## Admin

Open **Admin → Shipping**. Create a named rule with quantity ranges and UK/international prices in pounds. A single quantity has the same From and To. Ranges must start at 1, be continuous without overlaps, and finish with a blank To (unlimited). UK rates may be zero; international rates must be positive.

Filter/search products, select products on the current page and assign a rule, or choose Default to remove an override. The individual product editor also has a shipping dropdown which saves immediately, separately from its other fields.

Editing a rule changes rates for all products using it. Archiving prevents new assignments but retains existing assignments and rates. Rules are not deleted through the UI. Uploads continue to create new products with Default and skip existing upload IDs; ordinary product edits do not reset assignments.

## Calculation

Only products with no override enter existing default category calculations (including print dimensions and gift subtypes). Custom products are grouped by rule ID across product designs/categories. Quantities within each group are summed and one matching tier is chosen. The highest group rate is charged once.

UK orders are free if any original is present, including an original with a custom rule, or if the product subtotal before discounts is at least £125. Otherwise the highest group rate applies.

International orders have no free threshold. Default originals contribute £17.53 to the maximum rather than short-circuiting other charges. Custom originals use their custom international tier. A missing/zero final international charge is rejected. A positive shipping rate is calculated both when creating the Stripe session and when updating its address.

Existing gift discounts and all other default rates are unchanged. Existing paid orders and already-created Stripe sessions are not repriced. New checkouts read current product assignments and tiers from the database; the cart displays an estimate and refreshes product data when opened.

## Checks

```sh
npm run test:shipping
npx tsc --noEmit
```

Before release, use a staging database and Stripe test mode to create a rule, bulk-assign products, reset one to Default, and check a mixed basket in both checkout flows. Check £124.99/£125, a basket containing an original, and an international subtotal above £150.
